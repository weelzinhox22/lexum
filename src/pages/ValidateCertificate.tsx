import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { certificateExample } from '../data/modules';
import { supabase } from '../lib/supabase';
import AppSidebar from '../components/AppSidebar';
import MobileMenuHeader from '../components/MobileMenuHeader';
import { SidebarProvider } from '../contexts/SidebarContext';
import {
  Shield,
  Search,
  QrCode,
  CheckCircle,
  XCircle,
  Sparkles,
  Award,
  Lock,
  FileCheck,
  Fingerprint,
  ArrowUpRight,
  ChevronRight,
  Clock,
  BookOpen,
  Target,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ValidateCertificate() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [validated, setValidated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Certificate data from DB
  const [certData, setCertData] = useState<{
    student_name: string;
    auth_code: string;
    course_name: string;
    workload: string;
    issued_at: string;
    hash: string;
  } | null>(null);

  // Lê automaticamente o parâmetro ?code= da URL (QR Code do certificado)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlCode = params.get('code');
    if (urlCode) {
      setCode(urlCode.toUpperCase());
    }
  }, [location.search]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session) {
        setUserEmail(session.user.email ?? null);
        const fullName = session.user.user_metadata?.full_name;
        if (fullName) setUserName(fullName);
        else if (session.user.email) setUserName(session.user.email.split('@')[0]);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        setUserEmail(session.user.email ?? null);
        const fullName = session.user.user_metadata?.full_name;
        if (fullName) setUserName(fullName);
        else if (session.user.email) setUserName(session.user.email.split('@')[0]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCertData(null);

    const searchCode = code.trim().toUpperCase();

    // Lookup in the certificates table
    const { data } = await supabase
      .from('certificates')
      .select('student_name, auth_code, course_name, workload, issued_at, hash')
      .eq('auth_code', searchCode)
      .maybeSingle();

    if (data) {
      setCertData(data);
      setValidated(true);
    } else {
      setValidated(false);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setCode('');
    setValidated(null);
    setCertData(null);
  };

  // ── Refs for GSAP ──
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const trustRowRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // ── GSAP Entrance Animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero stagger
      gsap.fromTo(
        heroRef.current?.children ?? [],
        { opacity: 0, y: 32, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', stagger: 0.1, delay: 0.15 }
      );

      // Trust row
      gsap.fromTo(
        trustRowRef.current?.children ?? [],
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.07, delay: 0.55 }
      );

      // Form card entrance
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', delay: 0.75 }
      );

      // Steps section
      gsap.fromTo(
        stepsRef.current?.children ?? [],
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: stepsRef.current, start: 'top 88%' } }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Result entrance (when validation result appears)
  useEffect(() => {
    if (validated !== null && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [validated]);

  return (
    <SidebarProvider>
      <div className="app-layout">
        {isLoggedIn && <MobileMenuHeader />}
        {isLoggedIn && (
          <AppSidebar
            userName={userName}
            userEmail={userEmail}
            onLogout={handleLogout}
            loggingOut={loggingOut}
          />
        )}
        <main className="app-main" style={{ marginLeft: isLoggedIn ? undefined : 0 }}>
          <div ref={pageRef} className="val-page">

            {/* ═══════════════════════════════════════════════════
               HERO SECTION — Dark Navy
               ═══════════════════════════════════════════════════ */}
            <section className="val-hero">
              {/* Background layers */}
              <div className="val-hero-bg" />
              <div className="val-hero-grid" />
              <div className="val-hero-radial" />

              <div className="val-container val-hero-inner">

                {/* Heading */}
                <div ref={heroRef} className="val-hero-heading">
                  <div className="val-hero-badge">
                    <Shield size={11} className="val-hero-sparkle" />
                    Verificação digital · Autenticidade
                  </div>
                  <h1 className="val-hero-title">
                    Validar{' '}
                    <em>Certificado</em>
                  </h1>
                  <p className="val-hero-sub">
                    Insira o código único do certificado para verificar sua autenticidade em segundos.
                    A validação é gratuita e está disponível para qualquer instituição ou empregador.
                  </p>
                </div>

                {/* Trust Indicators Row */}
                <div ref={trustRowRef} className="val-trust-row">
                  <div className="val-trust-item">
                    <div className="val-trust-icon val-trust-icon--gold">
                      <Shield size={14} />
                    </div>
                    <span className="val-trust-text">Código Único</span>
                  </div>
                  <div className="val-trust-divider" />
                  <div className="val-trust-item">
                    <div className="val-trust-icon val-trust-icon--blue">
                      <Fingerprint size={14} />
                    </div>
                    <span className="val-trust-text">QR Code Digital</span>
                  </div>
                  <div className="val-trust-divider" />
                  <div className="val-trust-item">
                    <div className="val-trust-icon val-trust-icon--green">
                      <FileCheck size={14} />
                    </div>
                    <span className="val-trust-text">Verificação Instantânea</span>
                  </div>
                  <div className="val-trust-divider" />
                  <div className="val-trust-item">
                    <div className="val-trust-icon val-trust-icon--purple">
                      <Lock size={14} />
                    </div>
                    <span className="val-trust-text">Dados Protegidos</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════
               VALIDATION FORM SECTION
               ═══════════════════════════════════════════════════ */}
            <section className="val-form-section">
              <div className="val-container">
                <div className="val-form-layout">

            {/* Form Card */}
            {validated === null ? (
              <div ref={formRef} className="val-form-card">
                {/* Decorative top accent */}
                <div className="val-form-accent" />

                {/* Icon */}
                <div className="val-form-icon-wrap">
                  <Shield size={22} />
                </div>

                <h2 className="val-form-title">Insira o Código do Certificado</h2>
                <p className="val-form-desc">
                  O código único está impresso no certificado digital. Digite-o abaixo para verificar a autenticidade.
                </p>

                <form onSubmit={handleValidate} className="val-form">
                  <div className="val-input-group">
                    <div className="val-input-icon">
                      <Search size={15} />
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: ORY-2026-0001"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="val-input"
                      required
                    />
                    {code && (
                      <button
                        type="button"
                        onClick={() => setCode('')}
                        className="val-input-clear"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !code.trim()}
                    className={`val-submit-btn ${loading ? 'val-submit-btn--loading' : ''}`}
                  >
                    {loading ? (
                      <span className="val-btn-loading">
                        <svg className="val-spinner" viewBox="0 0 24 24">
                          <circle className="val-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="val-spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Validando...
                      </span>
                    ) : (
                      <>
                        Validar Certificado
                        <Shield size={15} />
                      </>
                    )}
                  </button>
                </form>

                {/* Example code hint */}
                <div className="val-example">
                  <QrCode size={12} />
                  <span>
                    Teste com o código:{' '}
                    <button
                      onClick={() => setCode(certificateExample.code)}
                      className="val-example-code"
                    >
                      {certificateExample.code}
                    </button>
                  </span>
                </div>
              </div>
            ) : validated ? (
              /* ═══════════════════════════════════════════
                 SUCCESS RESULT
                 ═══════════════════════════════════════════ */                <div ref={resultRef} className="val-result val-result--success">
                {/* Top accent */}
                <div className="val-result-accent val-result-accent--success" />

                {/* Success header */}
                <div className="val-result-header val-result-header--success">
                  <div className="val-result-icon-wrap val-result-icon-wrap--success">
                    <CheckCircle size={28} />
                  </div>
                  <h2 className="val-result-title val-result-title--success">Certificado Válido</h2>
                  <p className="val-result-subtitle">
                    Este certificado é autêntico e está registrado em nosso sistema
                  </p>
                </div>

                {/* Certificate details from DB */}
                {certData && (
                  <div className="val-cert-details">
                    <div className="val-cert-detail-row val-cert-detail-row--full">
                      <span className="val-cert-detail-label">Certificamos que</span>
                      <span className="val-cert-detail-value val-cert-detail-value--name">
                        {certData.student_name}
                      </span>
                    </div>

                    <div className="val-cert-detail-row val-cert-detail-row--full">
                      <span className="val-cert-detail-label">Concluiu com êxito o curso</span>
                      <span className="val-cert-detail-value">
                        {certData.course_name}
                      </span>
                    </div>

                    <div className="val-cert-detail-grid">
                      <div className="val-cert-detail-box">
                        <div className="val-cert-detail-box-icon">
                          <Clock size={13} />
                        </div>
                        <div>
                          <span className="val-cert-detail-box-label">Carga Horária</span>
                          <span className="val-cert-detail-box-value">{certData.workload}</span>
                        </div>
                      </div>
                      <div className="val-cert-detail-box">
                        <div className="val-cert-detail-box-icon val-cert-detail-box-icon--gold">
                          <Award size={13} />
                        </div>
                        <div>
                          <span className="val-cert-detail-box-label">Conclusão</span>
                          <span className="val-cert-detail-box-value">
                            {new Date(certData.issued_at).toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Code + Hash */}
                    <div className="val-cert-code-section">
                      <div className="val-cert-code-block">
                        <span className="val-cert-code-label">Código Único</span>
                        <div className="val-cert-code-value-wrap">
                          <Fingerprint size={13} />
                          <span className="val-cert-code-value">{certData.auth_code}</span>
                        </div>
                      </div>
                      <div className="val-cert-qr-block">
                        <QrCode size={36} />
                        <span className="val-cert-qr-label">Validar via QR</span>
                      </div>
                    </div>

                    {/* Hash */}
                    <div className="val-cert-detail-row" style={{ marginTop: '10px' }}>
                      <span className="val-cert-detail-label">Hash de Autenticidade (SHA-256)</span>
                      <span className="val-cert-detail-value" style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' }}>
                        {certData.hash}
                      </span>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="val-result-actions">
                  <button onClick={handleReset} className="val-result-btn val-result-btn--secondary">
                    Validar outro certificado
                  </button>
                </div>
              </div>
            ) : (
              /* ═══════════════════════════════════════════
                 ERROR RESULT
                 ═══════════════════════════════════════════ */
              <div ref={resultRef} className="val-result val-result--error">
                {/* Top accent */}
                <div className="val-result-accent val-result-accent--error" />

                {/* Error header */}
                <div className="val-result-header val-result-header--error">
                  <div className="val-result-icon-wrap val-result-icon-wrap--error">
                    <XCircle size={28} />
                  </div>
                  <h2 className="val-result-title val-result-title--error">Certificado Não Encontrado</h2>
                  <p className="val-result-subtitle">
                    Nenhum certificado foi encontrado com o código informado.
                  </p>
                </div>

                <div className="val-error-body">
                  <div className="val-error-detail-card">
                    <Target size={14} />
                    <div>
                      <strong>Verifique o código digitado</strong>
                      <p>O código é composto por letras maiúsculas e números (ex: ORY-2026-0001).</p>
                    </div>
                  </div>
                  <div className="val-error-detail-card">
                    <BookOpen size={14} />
                    <div>
                      <strong>Certificado pode não estar registrado</strong>
                      <p>Certificados são registrados automaticamente após a conclusão com nota mínima de 70%.</p>
                    </div>
                  </div>

                  <button onClick={handleReset} className="val-result-btn val-result-btn--primary">
                    Tentar Novamente
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

                {/* Side info (only when form is shown) */}
                {validated === null && (
                  <div className="val-side-info">
                    {/* How It Works */}
                    <div ref={stepsRef} className="val-steps-card">
                      <h3 className="val-steps-title">
                        <Fingerprint size={14} />
                        Como funciona?
                      </h3>
                      <div className="val-steps-list">
                        {[
                          { num: 1, text: 'Insira o código único do certificado' },
                          { num: 2, text: 'O sistema consulta o registro oficial' },
                          { num: 3, text: 'Dados do certificado são exibidos' },
                          { num: 4, text: 'Confirmação de autenticidade' },
                        ].map((step) => (
                          <div key={step.num} className="val-step">
                            <div className="val-step-num">
                              {step.num === 4 ? <CheckCircle size={10} /> : <span>{step.num}</span>}
                            </div>
                            <div className={`val-step-connector ${step.num === 4 ? 'val-step-connector--last' : ''}`} />
                            <span className="val-step-text">{step.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Why Validate */}
                    <div className="val-why-card">
                      <h3 className="val-steps-title">
                        <Award size={14} />
                        Por que validar?
                      </h3>
                      <ul className="val-why-list">
                        {[
                          'Garantir a autenticidade do documento',
                          'Verificar dados do aluno e curso',
                          'Confirmar carga horária e conteúdo',
                          'Prevenir fraudes acadêmicas',
                        ].map((item, i) => (
                          <li key={i} className="val-why-item">
                            <CheckCircle size={12} className="val-why-check" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Example Code Card */}
                    <div className="val-example-card">
                      <div className="val-example-card-icon">
                        <QrCode size={16} />
                      </div>
                      <div className="val-example-card-text">
                        <span className="val-example-card-label">Exemplo de código</span>
                        <span className="val-example-card-code">{certificateExample.code}</span>
                      </div>
                      <button
                        onClick={() => setCode(certificateExample.code)}
                        className="val-example-card-btn"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>

              {/* Bottom Info Bar */}
              {validated === null && (
                <div className="val-bottom-info">
                  <div className="val-container">
                    <div className="val-bottom-info-inner">
                      <div className="val-bottom-info-text">
                        <Sparkles size={14} />
                        <span>
                          Todos os certificados emitidos pela <strong>Lexum</strong> possuem código único e QR Code para validação online.
                        </span>
                      </div>
                      <Link to="/" className="val-bottom-info-link">
                        Conheça o curso
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </section>

      {/* ═══════════════════════════════════════════════════
         STYLES
         ═══════════════════════════════════════════════════ */}
      <style>{`
        /* ── Page Root ── */
        .val-page {
          min-height: 100vh;
          background: #F0F3F8;
          font-family: var(--font-sans);
        }

        /* ── Container ── */
        .val-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 48px);
        }

        /* ═══════════════════════════════════════════════
           TOPBAR
           ═══════════════════════════════════════════════ */
        .val-topbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(4, 16, 30, 0.82);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        .val-topbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .val-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .val-logo-mark {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #C9A84C, #D4B05A);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #07152A;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(201, 168, 76, 0.25);
        }
        .val-logo-brand {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #EDF1F7;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .val-logo-tagline {
          display: block;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(201, 168, 76, 0.8);
          line-height: 1;
          margin-top: 1px;
        }

        .val-topbar-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .val-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          transition: all 0.25s var(--ease-out-quart);
        }
        .val-back-link:hover {
          color: #C9A84C;
          border-color: rgba(201, 168, 76, 0.35);
          background: rgba(201, 168, 76, 0.08);
        }

        /* ═══════════════════════════════════════════════
           HERO
           ═══════════════════════════════════════════════ */
        .val-hero {
          position: relative;
          padding: clamp(56px, 8vh, 96px) 0 clamp(40px, 5vh, 48px);
          overflow: hidden;
          background: var(--navy-950);
        }
        .val-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, #030C16 0%, #061525 40%, #091F38 70%, #051220 100%);
        }
        .val-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
        }
        .val-hero-radial {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 70% 40%, rgba(201, 168, 76, 0.05) 0%, transparent 70%);
        }

        .val-hero-inner {
          position: relative;
          z-index: 2;
        }

        .val-hero-heading {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 680px;
        }
        .val-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(201, 168, 76, 0.09);
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 100px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold-300);
          width: fit-content;
          backdrop-filter: blur(8px);
        }
        .val-hero-sparkle {
          animation: valSparkle 3s ease-in-out infinite;
        }
        @keyframes valSparkle {
          0%, 100% { opacity: 0.6; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.1) rotate(180deg); }
        }

        .val-hero-title {
          font-family: var(--font-editorial);
          font-size: clamp(38px, 5vw, 56px);
          font-weight: 400;
          color: #FFFFFF;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .val-hero-title em {
          font-style: italic;
          background: linear-gradient(135deg, var(--gold-200) 0%, var(--gold-400) 50%, var(--gold-300) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .val-hero-sub {
          font-size: 14px;
          color: rgba(168, 180, 196, 0.7);
          margin: 4px 0 0;
          font-weight: 400;
          line-height: 1.7;
          max-width: 540px;
        }

        /* ── Trust Row ── */
        .val-trust-row {
          display: inline-flex;
          align-items: center;
          gap: 0;
          margin-top: 28px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 12px 20px;
          flex-wrap: wrap;
        }
        .val-trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
        }
        .val-trust-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .val-trust-icon--gold  { background: rgba(201,168,76,0.12); color: #C9A84C; }
        .val-trust-icon--blue  { background: rgba(59,130,246,0.1);  color: #60A5FA; }
        .val-trust-icon--green { background: rgba(34,197,94,0.1);   color: #4ADE80; }
        .val-trust-icon--purple{ background: rgba(139,92,246,0.1);  color: #A78BFA; }
        .val-trust-text {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          white-space: nowrap;
        }
        .val-trust-divider {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.08);
        }

        /* ═══════════════════════════════════════════════
           FORM SECTION
           ═══════════════════════════════════════════════ */
        .val-form-section {
          padding: clamp(40px, 5vw, 60px) 0 clamp(48px, 5vw, 72px);
        }

        .val-form-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 28px;
          align-items: start;
        }

        /* ── Form Card ── */
        .val-form-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid #E8ECF2;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 2px 12px rgba(11, 30, 56, 0.06);
          overflow: hidden;
        }
        .val-form-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--gold-600), var(--gold-400), var(--gold-600));
        }

        .val-form-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04));
          border: 1px solid rgba(201,168,76,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
          margin-bottom: 20px;
        }

        .val-form-title {
          font-family: var(--font-editorial);
          font-size: 26px;
          font-weight: 500;
          color: var(--navy-800);
          margin: 0 0 8px;
          line-height: 1.2;
        }
        .val-form-desc {
          font-size: 13.5px;
          color: #637080;
          line-height: 1.7;
          margin: 0 0 28px;
        }

        /* ── Input ── */
        .val-input-group {
          position: relative;
          margin-bottom: 16px;
        }
        .val-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9BAAB9;
          pointer-events: none;
          z-index: 1;
          transition: color 0.25s;
        }
        .val-input-group:focus-within .val-input-icon {
          color: var(--gold-500);
        }
        .val-input {
          width: 100%;
          padding: 16px 44px 16px 48px;
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--navy-800);
          background: #FAFBFC;
          border: 1.5px solid #E8ECF2;
          border-radius: 12px;
          outline: none;
          transition: all 0.25s;
        }
        .val-input::placeholder {
          text-transform: none;
          font-weight: 400;
          letter-spacing: 0;
          color: #B8C5D4;
        }
        .val-input:focus {
          background: #FFFFFF;
          border-color: var(--gold-500);
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.12);
        }

        .val-input-clear {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #C4CEDC;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .val-input-clear:hover {
          color: #EF4444;
          background: rgba(239,68,68,0.08);
        }

        /* ── Submit Button ── */
        .val-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #C9A84C, #D4B05A);
          color: #07152A;
          font-size: 14px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s var(--ease-out-quart);
          box-shadow: 0 4px 16px rgba(201, 168, 76, 0.3);
          position: relative;
          overflow: hidden;
        }
        .val-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.25) 50%, transparent 80%);
          transform: translateX(-120%);
          transition: transform 0.7s var(--ease-out-quart);
        }
        .val-submit-btn:hover::before {
          transform: translateX(120%);
        }
        .val-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(201, 168, 76, 0.45);
          background: linear-gradient(135deg, var(--gold-300), var(--gold-400));
        }
        .val-submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(201, 168, 76, 0.2);
        }
        .val-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }
        .val-submit-btn--loading {
          opacity: 0.8;
        }

        .val-btn-loading {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .val-spinner {
          width: 16px;
          height: 16px;
          animation: valRotate 1s linear infinite;
        }
        .val-spinner-track { opacity: 0.3; }
        .val-spinner-fill { opacity: 0.9; }
        @keyframes valRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Example Hint ── */
        .val-example {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
          font-size: 12px;
          color: #94A3B8;
        }
        .val-example svg {
          flex-shrink: 0;
          color: #C4CEDC;
        }
        .val-example-code {
          background: none;
          border: none;
          font-family: monospace;
          font-size: 12px;
          font-weight: 700;
          color: #C9A84C;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          transition: all 0.2s;
          letter-spacing: 0.04em;
        }
        .val-example-code:hover {
          background: rgba(201,168,76,0.1);
          color: #A8893A;
        }

        /* ═══════════════════════════════════════════════
           RESULT CARDS
           ═══════════════════════════════════════════════ */
        .val-result {
          background: #FFFFFF;
          border: 1px solid #E8ECF2;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(11, 30, 56, 0.06);
        }
        .val-result-accent {
          height: 3px;
        }
        .val-result-accent--success {
          background: linear-gradient(90deg, #22C55E, #4ADE80);
        }
        .val-result-accent--error {
          background: linear-gradient(90deg, #EF4444, #F87171);
        }

        .val-result-header {
          text-align: center;
          padding: 36px 32px 24px;
        }
        .val-result-header--success {
          background: linear-gradient(180deg, rgba(34,197,94,0.04), transparent);
        }
        .val-result-header--error {
          background: linear-gradient(180deg, rgba(239,68,68,0.04), transparent);
        }

        .val-result-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .val-result-icon-wrap--success {
          background: rgba(34,197,94,0.1);
          color: #22C55E;
          border: 1px solid rgba(34,197,94,0.2);
        }
        .val-result-icon-wrap--error {
          background: rgba(239,68,68,0.1);
          color: #EF4444;
          border: 1px solid rgba(239,68,68,0.2);
        }

        .val-result-title {
          font-family: var(--font-editorial);
          font-size: 24px;
          font-weight: 500;
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .val-result-title--success { color: #16A34A; }
        .val-result-title--error { color: #DC2626; }

        .val-result-subtitle {
          font-size: 13px;
          color: #64748B;
          line-height: 1.6;
          margin: 0;
          max-width: 400px;
          margin: 0 auto;
        }

        /* ── Certificate Details (Success) ── */
        .val-cert-details {
          padding: 0 32px 20px;
        }

        .val-cert-detail-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 18px;
          background: #FAFBFC;
          border: 1px solid #F0F3F8;
          border-radius: 12px;
          margin-bottom: 10px;
        }
        .val-cert-detail-row--full {
          grid-column: 1 / -1;
        }
        .val-cert-detail-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
        }
        .val-cert-detail-value {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--navy-800);
          line-height: 1.5;
        }
        .val-cert-detail-value--name {
          font-family: var(--font-editorial);
          font-size: 18px;
          font-weight: 600;
          color: var(--navy-800);
        }

        .val-cert-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }
        .val-cert-detail-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #FAFBFC;
          border: 1px solid #F0F3F8;
          border-radius: 12px;
        }
        .val-cert-detail-box-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: rgba(59,130,246,0.08);
          color: #3B82F6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .val-cert-detail-box-icon--gold {
          background: rgba(201,168,76,0.08);
          color: #C9A84C;
        }
        .val-cert-detail-box-label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94A3B8;
          margin-bottom: 2px;
        }
        .val-cert-detail-box-value {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: var(--navy-800);
        }

        /* ── Code + QR ── */
        .val-cert-code-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #FDFBF5, #F8F5EA);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 12px;
        }
        .val-cert-code-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .val-cert-code-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
        }
        .val-cert-code-value-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--navy-800);
        }
        .val-cert-code-value-wrap svg {
          color: #C9A84C;
        }
        .val-cert-code-value {
          font-family: monospace;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--navy-900);
        }
        .val-cert-qr-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          color: var(--navy-800);
          flex-shrink: 0;
        }
        .val-cert-qr-label {
          font-size: 8px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
        }

        /* ── Result Actions ── */
        .val-result-actions {
          padding: 0 32px 28px;
        }
        .val-result-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 24px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s var(--ease-out-quart);
          border: none;
          font-family: var(--font-sans);
        }
        .val-result-btn--primary {
          background: linear-gradient(135deg, #C9A84C, #D4B05A);
          color: #07152A;
          box-shadow: 0 4px 12px rgba(201,168,76,0.25);
        }
        .val-result-btn--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(201,168,76,0.35);
          background: linear-gradient(135deg, var(--gold-300), var(--gold-400));
        }
        .val-result-btn--secondary {
          background: #F5F7FA;
          border: 1px solid #E8ECF2;
          color: #64748B;
        }
        .val-result-btn--secondary:hover {
          border-color: #D0D8E4;
          color: var(--navy-800);
          background: #FAFBFC;
        }

        /* ── Error Body ── */
        .val-error-body {
          padding: 0 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .val-error-detail-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #FAFBFC;
          border: 1px solid #F0F3F8;
          border-radius: 12px;
          color: #64748B;
        }
        .val-error-detail-card svg {
          flex-shrink: 0;
          margin-top: 1px;
          color: #94A3B8;
        }
        .val-error-detail-card strong {
          display: block;
          font-size: 12.5px;
          color: var(--navy-800);
          margin-bottom: 2px;
        }
        .val-error-detail-card p {
          font-size: 12px;
          line-height: 1.6;
          margin: 0;
        }

        /* ═══════════════════════════════════════════════
           SIDE INFO
           ═══════════════════════════════════════════════ */
        .val-side-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .val-steps-card,
        .val-why-card {
          background: #FFFFFF;
          border: 1px solid #E8ECF2;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(11, 30, 56, 0.04);
        }
        .val-steps-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--navy-800);
          margin: 0 0 16px;
        }
        .val-steps-title svg {
          color: #C9A84C;
        }

        .val-steps-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .val-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding-bottom: 20px;
          position: relative;
        }
        .val-step:last-child {
          padding-bottom: 0;
        }
        .val-step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 10px;
          font-weight: 700;
          color: #C9A84C;
          z-index: 1;
        }
        .val-step:last-child .val-step-num {
          background: #C9A84C;
          border-color: #D4B05A;
          color: #07152A;
        }
        .val-step-connector {
          position: absolute;
          left: 12px;
          top: 26px;
          width: 1px;
          height: calc(100% - 6px);
          background: linear-gradient(to bottom, rgba(201,168,76,0.2), rgba(201,168,76,0.05));
        }
        .val-step-connector--last {
          display: none;
        }
        .val-step-text {
          font-size: 12.5px;
          color: #4B5A6E;
          line-height: 1.5;
          padding-top: 3px;
        }
        .val-step:last-child .val-step-text {
          color: var(--navy-800);
          font-weight: 600;
        }

        .val-why-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 0;
          margin: 0;
        }
        .val-why-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #4B5A6E;
          line-height: 1.4;
        }
        .val-why-check {
          color: #22C55E;
          flex-shrink: 0;
        }

        .val-example-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #FDFBF5, #FFF9ED);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 14px;
          padding: 16px 16px 16px 18px;
          transition: all 0.25s;
        }
        .val-example-card:hover {
          border-color: rgba(201,168,76,0.4);
          box-shadow: 0 8px 24px rgba(201,168,76,0.08);
        }
        .val-example-card-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(201,168,76,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A84C;
          flex-shrink: 0;
        }
        .val-example-card-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
          flex: 1;
        }
        .val-example-card-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
        }
        .val-example-card-code {
          font-family: monospace;
          font-size: 13px;
          font-weight: 700;
          color: var(--navy-800);
          letter-spacing: 0.04em;
        }
        .val-example-card-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(201,168,76,0.15);
          background: rgba(201,168,76,0.05);
          color: #C9A84C;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .val-example-card-btn:hover {
          background: rgba(201,168,76,0.15);
          border-color: rgba(201,168,76,0.3);
          transform: translateX(2px);
        }

        /* ═══════════════════════════════════════════════
           BOTTOM INFO BAR
           ═══════════════════════════════════════════════ */
        .val-bottom-info {
          margin-top: 40px;
        }
        .val-bottom-info-inner {
          background: linear-gradient(145deg, #0B1E38, #133466);
          border-radius: 16px;
          padding: 20px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          box-shadow: 0 8px 32px rgba(11, 30, 56, 0.15);
        }
        .val-bottom-info-text {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }
        .val-bottom-info-text svg {
          flex-shrink: 0;
          color: #C9A84C;
        }
        .val-bottom-info-text strong {
          color: rgba(255, 255, 255, 0.9);
        }
        .val-bottom-info-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #C9A84C;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .val-bottom-info-link:hover {
          gap: 9px;
          color: var(--gold-300);
        }

        /* ═══════════════════════════════════════════════
           RESPONSIVE
           ═══════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .val-form-layout {
            grid-template-columns: 1fr;
          }
          .val-side-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 768px) {
          .val-trust-row {
            width: 100%;
            justify-content: center;
            gap: 0;
          }
          .val-trust-divider:last-child {
            display: none;
          }
          .val-hero-title { font-size: 32px; }
          .val-form-card { padding: 28px 24px; }
          .val-cert-detail-grid { grid-template-columns: 1fr; }
          .val-result-header { padding: 28px 24px 20px; }
          .val-cert-details { padding: 0 24px 16px; }
          .val-result-actions { padding: 0 24px 24px; }
          .val-error-body { padding: 0 24px 24px; }
          .val-bottom-info-inner { padding: 16px 20px; }
        }
        @media (max-width: 640px) {
          .val-logo-text { display: none; }
          .val-trust-item { padding: 4px 6px; }
          .val-trust-text { font-size: 10px; }
          .val-trust-divider { display: none; }
          .val-trust-row { gap: 4px; justify-content: flex-start; flex-wrap: wrap; }
          .val-side-info { grid-template-columns: 1fr; }
          .val-trust-row { flex-direction: column; align-items: flex-start; gap: 8px; padding: 14px 16px; }
        }
      `}</style>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
