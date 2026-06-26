import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLexumProgress } from '../lib/lexumProgress';
import { supabase } from '../lib/supabase';
import { LexumCertificate } from '../components/LexumCertificate';
import AppSidebar from '../components/AppSidebar';
import MobileMenuHeader from '../components/MobileMenuHeader';
import { SidebarProvider } from '../contexts/SidebarContext';
import '../certificate.css';
import {
  Award,
  Lock,
  Loader2,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Fingerprint,
  ExternalLink,
  Shield,
  FileCheck,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { generateCertificateHash } from '../lib/certificateHash';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getFormattedDate(): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const d = new Date();
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function generateAuthCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'LEX-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += '-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function CertificateEmission() {
  const navigate = useNavigate();
  const { completedCount, totalModules, percentage, isAllCompleted } = useLexumProgress();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [authCode] = useState<string>(generateAuthCode);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [examPassed, setExamPassed] = useState<boolean | null>(null);
  const [examPercentage, setExamPercentage] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);


  // Ref para o certificado oculto usado na captura
  const certCaptureRef = useRef<HTMLDivElement>(null);

  const validationUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/validate?code=${authCode}`
      : `/validate?code=${authCode}`;

  // ── Gerar QR Code assim que tiver o authCode ──────────────────────────
  useEffect(() => {
    QRCode.toDataURL(validationUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#0B192C', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [validationUrl]);

  // ── Auth ─────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
        const fullName = session.user.user_metadata?.full_name;
        if (fullName) setUserName(fullName);
        else if (session.user.email) setUserName(session.user.email.split('@')[0]);
      }
      setAuthChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate('/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // ── Check exam result (most recent attempt) ───────────────────────────────
  useEffect(() => {
    if (userId) {
      supabase
        .from('general_exam_results')
        .select('passed, percentage')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching exam result:', error);
            setExamPassed(false);
          } else if (data) {
            setExamPassed(data.passed);
            setExamPercentage(data.percentage);
          } else {
            // No exam result found yet
            setExamPassed(false);
          }
        });
    }
  }, [userId]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ── Salvar certificado no DB (primeira vez) ou atualizar ────────────
  const saveCertificateToDB = useCallback(async (hash: string) => {
    if (!userId) return;

    // Verifica se já existe certificado para este usuário
    const { data: existing } = await supabase
      .from('certificates')
      .select('id, hash')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      // Já existe → atualiza dados (visual pode mudar)
      await supabase
        .from('certificates')
        .update({
          student_name: userName.trim(),
          auth_code: authCode,
          issued_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } else {
      // Primeira emissão → insere
      await supabase
        .from('certificates')
        .insert({
          user_id: userId,
          student_name: userName.trim(),
          auth_code: authCode,
          hash,
          issued_at: new Date().toISOString(),
        });
    }

  }, [userId, userName, authCode]);

  // ── Geração do PDF via html2canvas ────────────────────────────────────
  const handleGeneratePDF = useCallback(async () => {
    if (!userName.trim() || !isAllCompleted) return;
    setIsGenerating(true);
    setPdfSuccess(false);

    try {
      const el = certCaptureRef.current;
      if (!el) throw new Error('Elemento do certificado não encontrado.');

      // Torna o elemento visível fora da tela (NÃO display:none)
      el.style.visibility = 'visible';
      el.style.pointerEvents = 'none';

      // Aguarda dois frames para garantir que o DOM renderizou
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#FFFFFF',
        width: 1123,
        height: 794,
        logging: false,
        removeContainer: true,
      });

      // Restaura invisibilidade
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';

      // Gera hash e salva no DB
      const hash = await generateCertificateHash(userId!, authCode, getFormattedDate());
      await saveCertificateToDB(hash);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1123, 794],
        compress: true,
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 1123, 794);
      pdf.save(`Certificado_Lexum_${userName.trim().replace(/\s+/g, '_')}.pdf`);
      setPdfSuccess(true);
    } catch (err) {
      console.error('[PDF] Erro:', err);
      // Restaura invisibilidade em caso de erro
      if (certCaptureRef.current) {
        certCaptureRef.current.style.visibility = 'hidden';
      }
      alert('Não foi possível gerar o PDF. Verifique se o seu navegador está atualizado e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  }, [userName, isAllCompleted, userId, authCode, saveCertificateToDB]);

  // ─────────────────────────────────────────────────────────────────────────

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="app-layout">
        <MobileMenuHeader />
        <AppSidebar
          userName={userName}
          userEmail={userEmail}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
        <main className="app-main">
          {/*
            ── Certificado oculto off-screen para html2canvas ──────────────────
            Usa visibility:hidden (NÃO display:none) para ficar no DOM renderizado
          */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: '-1200px',
              visibility: 'hidden',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          >
            <LexumCertificate
              ref={certCaptureRef}
              nomeDoAluno={userName.trim() || 'Nome do Aluno'}
              dataEmissao={getFormattedDate()}
              authCode={authCode}
              qrCodeDataUrl={qrDataUrl}
              validationUrl={validationUrl}
            />
          </div>

          <div className="cert-page">

            {/* ═══════════════════════════════════════════════════
               HERO SECTION — Dark Navy
               ═══════════════════════════════════════════════════ */}
        <section className="cert-hero">
          {/* Background layers */}
          <div className="cert-hero-bg" />
          <div className="cert-hero-grid" />
          <div className="cert-hero-radial" />

          <div className="cert-container cert-hero-inner">

            {/* Heading */}
            <div className="cert-hero-heading">
              <div className="cert-hero-badge">
                <Award size={11} className="cert-hero-sparkle" />
                Certificado Oficial · Extensão Acadêmica
              </div>
              <h1 className="cert-hero-title">
                Emitir{' '}
                <em>Certificado</em>
              </h1>
              <p className="cert-hero-sub">
                Após concluir todos os módulos, você pode emitir seu certificado oficial de 40 horas complementares.
                O documento inclui código único de autenticidade e QR Code para validação online.
              </p>
            </div>

            {/* Trust Indicators Row */}
            <div className="cert-trust-row">
              <div className="cert-trust-item">
                <div className="cert-trust-icon cert-trust-icon--gold">
                  <Award size={14} />
                </div>
                <span className="cert-trust-text">Código Único</span>
              </div>
              <div className="cert-trust-divider" />
              <div className="cert-trust-item">
                <div className="cert-trust-icon cert-trust-icon--blue">
                  <Fingerprint size={14} />
                </div>
                <span className="cert-trust-text">QR Code Digital</span>
              </div>
              <div className="cert-trust-divider" />
              <div className="cert-trust-item">
                <div className="cert-trust-icon cert-trust-icon--green">
                  <FileCheck size={14} />
                </div>
                <span className="cert-trust-text">Validação Online</span>
              </div>
              <div className="cert-trust-divider" />
              <div className="cert-trust-item">
                <div className="cert-trust-icon cert-trust-icon--purple">
                  <Shield size={14} />
                </div>
                <span className="cert-trust-text">Dados Protegidos</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
           EMISSION FORM SECTION
           ═══════════════════════════════════════════════════ */}
        <section className="cert-form-section">
          <div className="cert-container">
            <div className="cert-form-layout">

              {/* ── STATE 1: LOCKED ─────────────────────────────────────────── */}
              {!isAllCompleted || examPassed === false || examPassed === null ? (
                <div className="cert-form-card">
                  {/* Decorative top accent */}
                  <div className="cert-form-accent cert-form-accent--error" />

                  {/* Icon */}
                  <div className="cert-form-icon-wrap cert-form-icon-wrap--error">
                    <Lock size={22} />
                  </div>

                  <h2 className="cert-form-title">Certificado Bloqueado</h2>
                  <p className="cert-form-desc">
                    {!isAllCompleted && examPassed === false ? (
                      <>Para receber seu certificado oficial, você precisa concluir <strong>100% dos módulos</strong> do curso e obter <strong>acerto de 60% ou mais</strong> na Prova Geral.</>
                    ) : !isAllCompleted ? (
                      <>Para receber seu certificado oficial, você precisa concluir <strong>100% dos módulos</strong> do curso. Cada módulo deve ser lido integralmente.</>
                    ) : (
                      <>Para receber seu certificado oficial, você precisa obter <strong>acerto de 60% ou mais</strong> na Prova Geral. Sua pontuação atual: <strong>{examPercentage}%</strong>.</>
                    )}
                  </p>

                  {/* Progress ring */}
                  <div className="cert-progress-ring-wrap">
                    <svg viewBox="0 0 80 80" className="cert-progress-ring-svg" aria-label={`${percentage}% concluído`}>
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                      <circle
                        cx="40" cy="40" r="34"
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="5"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - percentage / 100)}`}
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.8s ease' }}
                      />
                    </svg>
                    <div className="cert-progress-ring-label">
                      <span className="cert-progress-percent">{percentage}%</span>
                      <span className="cert-progress-sub">{completedCount}/{totalModules}</span>
                    </div>
                  </div>

                  <p className="cert-progress-modules-text">
                    {completedCount} de {totalModules} módulos concluídos
                  </p>

                  {!isAllCompleted ? (
                    <button disabled className="cert-submit-btn cert-submit-btn--disabled">
                      <Lock size={15} />
                      <span>Concluir Curso para Desbloquear</span>
                    </button>
                  ) : (
                    <Link to="/exam" className="cert-submit-btn">
                      <Award size={15} />
                      <span>Fazer Prova Geral</span>
                    </Link>
                  )}
                </div>

              ) : (
                /* ── STATE 2: UNLOCKED ──────────────────────────────────────── */
                <div className="cert-form-card">
                  {/* Decorative top accent */}
                  <div className="cert-form-accent" />

                  {/* Icon */}
                  <div className="cert-form-icon-wrap">
                    <Award size={22} />
                  </div>

                  <h2 className="cert-form-title">Emitir Certificado</h2>
                  <p className="cert-form-desc">
                    Você concluiu todos os <strong>{totalModules} módulos</strong> do curso.
                    Seu certificado de{' '}
                    <strong>40 horas complementares</strong> está disponível.
                  </p>

                  {/* Campo de nome */}
                  <div className="cert-input-group">
                    <label htmlFor="studentName" className="cert-input-label">
                      Nome completo do Aluno
                    </label>
                    <input
                      type="text"
                      id="studentName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Como constará no certificado"
                      className="cert-input"
                      autoComplete="name"
                      spellCheck={false}
                    />
                    <div className="cert-input-hint">
                      <ShieldCheck size={12} />
                      <span>
                        Confira atentamente — o nome não poderá ser alterado após a emissão.
                      </span>
                    </div>
                  </div>

                  {/* Detalhes do documento */}
                  <div className="cert-details-list">
                    <div className="cert-detail-row">
                      <FileText size={13} className="cert-detail-icon" />
                      <div>
                        <p className="cert-detail-label">Tipo</p>
                        <p className="cert-detail-value">Certificado de Extensão</p>
                      </div>
                    </div>
                    <div className="cert-detail-row">
                      <Clock size={13} className="cert-detail-icon" />
                      <div>
                        <p className="cert-detail-label">Carga Horária</p>
                        <p className="cert-detail-value">40 horas complementares</p>
                      </div>
                    </div>
                    <div className="cert-detail-row">
                      <CheckCircle2 size={13} className="cert-detail-icon" />
                      <div>
                        <p className="cert-detail-label">Data de Emissão</p>
                        <p className="cert-detail-value">{getFormattedDate()}</p>
                      </div>
                    </div>
                    <div className="cert-detail-row">
                      <Fingerprint size={13} className="cert-detail-icon" />
                      <div>
                        <p className="cert-detail-label">Código de Autenticidade</p>
                        <p className="cert-detail-value cert-detail-mono">{authCode}</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code preview */}
                  <div className="cert-qr-section">
                    <div className="cert-qr-thumb">
                      {qrDataUrl ? (
                        <img src={qrDataUrl} alt="QR Code de validação" className="w-full h-full object-cover" />
                      ) : (
                        <Loader2 size={18} className="animate-spin text-slate-300" />
                      )}
                    </div>
                    <div className="cert-qr-info">
                      <p className="cert-qr-title">QR Code de Validação</p>
                      <p className="cert-qr-desc">
                        Embutido no PDF. Quem escanear será direcionado para a página de verificação.
                      </p>
                      <a
                        href={validationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-qr-link"
                      >
                        Testar link de validação
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* Botão de emissão */}
                  <button
                    id="btn-emit-certificate"
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || !userName.trim()}
                    className={`cert-submit-btn ${isGenerating ? 'cert-submit-btn--loading' : ''} ${!userName.trim() ? 'cert-submit-btn--disabled' : ''}`}
                  >
                    {isGenerating ? (
                      <span className="cert-btn-loading">
                        <svg className="cert-spinner" viewBox="0 0 24 24">
                          <circle className="cert-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="cert-spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Gerando PDF...
                      </span>
                    ) : pdfSuccess ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>PDF Gerado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Download size={15} />
                        <span>Baixar Certificado em PDF</span>
                      </>
                    )}
                  </button>

                  {pdfSuccess && (
                    <p className="cert-success-hint">
                      O arquivo foi salvo na pasta de Downloads do seu dispositivo.
                    </p>
                  )}
                </div>
              )}

              {/* Side info (only when unlocked) */}
              {isAllCompleted && examPassed === true && (
                <div className="cert-side-info">
                  {/* Preview Panel */}
                  <div className="cert-preview-card">
                    <div className="cert-preview-header">
                      <CheckCircle2 size={14} />
                      <span>Prévia em Tempo Real</span>
                      <span className="cert-preview-badge">A4 Paisagem</span>
                    </div>

                    {/* Área de preview com escalonamento */}
                    <div className="cert-preview-stage">
                      {/*
                        O stage tem largura fixa. Calculamos o scale para caber:
                        scale = stageWidth / 1123. Com max ~680px → scale ≈ 0.605
                      */}
                      <div
                        className="cert-preview-scaler"
                        style={{
                          transform: 'scale(var(--cert-preview-scale, 0.60))',
                          transformOrigin: 'top center',
                        }}
                      >
                        <LexumCertificate
                          nomeDoAluno={userName.trim() || '[Seu Nome Completo]'}
                          dataEmissao={getFormattedDate()}
                          authCode={authCode}
                          qrCodeDataUrl={qrDataUrl}
                          validationUrl={validationUrl}
                        />
                      </div>
                    </div>

                    <p className="cert-preview-note">
                      O PDF final será gerado com resolução 2× para impressão de alta qualidade em A4.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          </section>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
