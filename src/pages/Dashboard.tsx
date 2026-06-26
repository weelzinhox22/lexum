import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Loader2,
  QrCode,
  FileText,
  Play,
  TrendingUp,
  ClipboardList,
  BarChart3,
  Star,
  Flame,
  Target,
  ArrowUpRight,
  X,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { gsap } from 'gsap';
import { courseModules } from '../data/modules';
import { getModuleProgress, getModuleProgressSync, getModuleStatusSync } from '../lib/progress';
import AppShell from '../components/AppShell';
import { useLexumProgress } from '../lib/lexumProgress';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Aluno');
  const [authChecking, setAuthChecking] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certCode] = useState('ORY-2026-0001');
  const [progressMap, setProgressMap] = useState<Record<number, { status: string; grade?: number }>>({});
  const pageRef = useRef<HTMLDivElement>(null);

  const { completedList, completedCount: completed, totalModules: total, percentage: pct, isAllCompleted: certReady } = useLexumProgress(userId);
  const current = courseModules.find(m => !completedList.includes(m.slug) && !completedList.includes(`modulo-${m.id}`));
  const doneHours = Math.round((pct / 100) * 40);
  const totalHours = 40;

  // Automatically show certificate modal if redirected with ?emit=true
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('emit') === 'true' && certReady) {
      setShowCertModal(true);
      // Remove ?emit=true query param to clean the URL
      navigate('/dashboard', { replace: true });
    }
  }, [location.search, certReady, navigate]);

  // Auth
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate('/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const refreshProgress = useCallback(async (userId?: string) => {
    const progress = userId
      ? await getModuleProgress(userId)
      : getModuleProgressSync();
    setProgressMap(progress);
  }, []);

  // Progress (local + Supabase quando logado)
  useEffect(() => {
    if (authChecking) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      refreshProgress(session?.user?.id);
    });
  }, [authChecking, location.pathname, refreshProgress]);

  useEffect(() => {
    const handle = () => {
      refreshProgress();
    };
    window.addEventListener('storage', handle);
    window.addEventListener('focus', handle);
    return () => {
      window.removeEventListener('storage', handle);
      window.removeEventListener('focus', handle);
    };
  }, [refreshProgress]);

  // GSAP
  useEffect(() => {
    if (authChecking) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.db-header', { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
      gsap.fromTo('.db-stat', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.15 });
      gsap.fromTo('.db-main', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.35 });
    }, pageRef);
    return () => ctx.revert();
  }, [authChecking]);

  const getStatus = (id: number): 'liberado' | 'bloqueado' | 'concluido' => {
    const mod = courseModules.find(m => m.id === id);
    if (mod && (completedList.includes(mod.slug) || completedList.includes(`modulo-${mod.id}`))) {
      return 'concluido';
    }
    return getModuleStatusSync(id);
  };

  const goModule = (id: number) => {
    if (getStatus(id) !== 'bloqueado') {
      const mod = courseModules.find(m => m.id === id);
      if (mod) navigate(`/module/${mod.slug}`);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate('/login');
  };


  const withGrades = courseModules.filter(m => progressMap[m.id]?.status === 'concluido' && progressMap[m.id]?.grade !== undefined);
  const avgGrade = withGrades.length > 0
    ? Math.round(withGrades.reduce((a, m) => a + (progressMap[m.id]?.grade || 0), 0) / withGrades.length)
    : 0;

  const firstName = userName.split(' ')[0];

  if (authChecking) {
    return (
      <div className="db-loading">
        <div className="db-loading-inner">
          <div className="db-loading-spinner">
            <Loader2 size={24} className="animate-spin" />
          </div>
          <p>Carregando painel...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      label: 'Progresso',
      value: `${pct}%`,
      sub: `${completed}/${total} módulos`,
      icon: TrendingUp,
      color: 'gold',
      bar: pct,
    },
    {
      label: 'Horas concluídas',
      value: `${doneHours}h`,
      sub: `de ${totalHours}h totais`,
      icon: Clock,
      color: 'blue',
      bar: Math.round((doneHours / totalHours) * 100),
    },
    {
      label: 'Quizzes feitos',
      value: `${completed}/${total}`,
      sub: avgGrade > 0 ? `Média: ${avgGrade}%` : 'Nenhum ainda',
      icon: ClipboardList,
      color: 'purple',
      bar: Math.round((completed / total) * 100),
    },
    {
      label: 'Certificado',
      value: certReady ? 'Pronto!' : 'Pendente',
      sub: certReady ? 'Clique para emitir' : `Faltam ${total - completed} módulos`,
      icon: Award,
      color: certReady ? 'green' : 'gray',
      onClick: certReady ? () => navigate('/certificate') : undefined,
    },
  ];

  return (
    <AppShell
      userName={userName}
      userEmail={userEmail}
      onLogout={handleLogout}
      loggingOut={loggingOut}
    >
      <div className="db-page" ref={pageRef}>

        {/* Header */}
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-greeting-chip">
              <Flame size={12} />
              Bem-vindo de volta
            </div>
            <h1 className="db-heading">
              Olá, <em>{firstName}</em>
            </h1>
            <p className="db-subheading">Acompanhe seu progresso no curso de Direito Previdenciário</p>
          </div>
          {current && (
            <button
              onClick={() => goModule(current.id)}
              className="db-cta-btn"
            >
              <Play size={15} />
              Continuar estudando
              <ArrowUpRight size={14} className="db-cta-arrow" />
            </button>
          )}
        </header>

        {/* Stats Row */}
        <div className="db-stats-grid">
          {statsData.map((s, i) => (
            <div
              key={i}
              className={`db-stat db-stat--${s.color} ${s.onClick ? 'db-stat--clickable' : ''}`}
              onClick={s.onClick}
            >
              <div className="db-stat-top">
                <div className="db-stat-icon-wrap">
                  <s.icon size={16} />
                </div>
                <span className="db-stat-label">{s.label}</span>
              </div>
              <div className="db-stat-value">{s.value}</div>
              <div className="db-stat-sub">{s.sub}</div>
              {s.bar !== undefined && (
                <div className="db-stat-bar">
                  <div className="db-stat-bar-fill" style={{ width: `${s.bar}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Body Grid */}
        <div className="db-main db-body-grid">

          {/* Left: Modules */}
          <section className="db-modules-section">
            <div className="db-section-header">
              <div className="db-section-title">
                <BookOpen size={16} />
                Meus Módulos
                <span className="db-module-count">{courseModules.length} módulos</span>
              </div>
            </div>

            <div className="db-modules-list db-modules-list--all">
              {courseModules.map(mod => {
                const status = getStatus(mod.id);
                const locked = status === 'bloqueado';
                const done = status === 'concluido';
                const grade = progressMap[mod.id]?.grade;

                return (
                  <button
                    key={mod.id}
                    onClick={() => goModule(mod.id)}
                    disabled={locked}
                    className={`db-module-row ${done ? 'db-module-row--done' : ''} ${locked ? 'db-module-row--locked' : ''}`}
                  >
                    <div className={`db-module-num ${done ? 'db-module-num--done' : locked ? 'db-module-num--locked' : 'db-module-num--active'}`}>
                      {done ? <CheckCircle2 size={16} /> : locked ? <Lock size={14} /> : <span>{String(mod.id).padStart(2, '0')}</span>}
                    </div>

                    <div className="db-module-info">
                      <span className="db-module-title">{mod.title}</span>
                      <span className="db-module-meta">
                        {mod.duration}
                        {done && grade ? ` · Nota: ${grade}%` : ''}
                      </span>
                    </div>

                    <div className={`db-module-badge db-module-badge--${status}`}>
                      {status === 'concluido' ? 'Concluído' : status === 'liberado' ? 'Em andamento' : 'Bloqueado'}
                    </div>

                    {!locked && <ChevronRight size={14} className="db-module-arrow" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Right: Sidebar Panels */}
          <div className="db-right-col">

            {/* Current Module Card */}
            {current && (
              <div className="db-panel db-panel--featured">
                <div className="db-panel-badge">
                  <Flame size={11} />
                  Módulo atual
                </div>
                <div className="db-panel-module-num">Módulo {current.id}</div>
                <h3 className="db-panel-module-title">{current.title}</h3>
                <p className="db-panel-module-desc">{current.description}</p>
                <button onClick={() => goModule(current.id)} className="db-panel-cta">
                  <Play size={14} />
                  Continuar aula
                </button>
              </div>
            )}

            {/* Certificate */}
            <div className={`db-panel ${certReady ? 'db-panel--cert-ready' : ''}`}>
              <div className="db-panel-header">
                <Award size={16} className="db-panel-icon" />
                <span className="db-panel-label">Certificado</span>
              </div>

              {certReady ? (
                <div className="db-cert-ready">
                  <div className="db-cert-ready-icon">
                    <Star size={28} />
                  </div>
                  <p className="db-cert-ready-text">Parabéns! Seu certificado está disponível.</p>
                  <button onClick={() => navigate('/certificate')} className="db-cert-btn">
                    <FileText size={14} />
                    Emitir Certificado
                  </button>
                </div>
              ) : (
                <div className="db-cert-pending">
                  <div className="db-cert-progress-ring">
                    <svg viewBox="0 0 64 64" className="db-cert-svg">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="db-cert-track" />
                      <circle
                        cx="32" cy="32" r="28"
                        fill="none" stroke="currentColor" strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
                        strokeLinecap="round"
                        className="db-cert-fill"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                      />
                    </svg>
                    <span className="db-cert-pct">{pct}%</span>
                  </div>
                  <p className="db-cert-pending-text">Complete todos os {total} módulos para emitir seu certificado de <strong>{totalHours}h</strong>.</p>
                  <div className="db-cert-steps">
                    {['Concluir todos os módulos', 'Nota mínima 70% nos quizzes', 'Certificado emitido automaticamente'].map((s, i) => (
                      <div key={i} className="db-cert-step">
                        <div className={`db-cert-step-dot ${i < completed ? 'db-cert-step-dot--done' : ''}`}>
                          {i < completed ? <CheckCircle2 size={10} /> : <span>{i + 1}</span>}
                        </div>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="db-panel">
              <div className="db-panel-header">
                <BarChart3 size={16} className="db-panel-icon" />
                <span className="db-panel-label">Resumo da Formação</span>
              </div>
              <ul className="db-summary-list">
                {[
                  { label: `${total} módulos completos`, done: true },
                  { label: 'Quizzes de fixação por módulo', done: true },
                  { label: 'Avaliação final integrada', done: true },
                  { label: 'Nota mínima de 70% exigida', done: true },
                  { label: `Certificado digital de ${totalHours}h`, done: true },
                  { label: 'QR Code e código único de autenticidade', done: true },
                ].map((item, i) => (
                  <li key={i} className="db-summary-item">
                    <CheckCircle2 size={13} className="db-summary-check" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tip */}
            <div className="db-panel db-panel--tip">
              <Target size={14} className="db-tip-icon" />
              <p className="db-tip-text">
                <strong>Dica:</strong> Tente obter 90%+ nos quizzes para garantir um aproveitamento excelente antes de solicitar o certificado.
              </p>
            </div>

          </div>
        </div>

      {/* ── Certificate Modal ──────────────────────────── */}
      {showCertModal && (
        <div className="db-modal-overlay" onClick={() => setShowCertModal(false)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div className="db-modal-topbar">
              <div className="db-modal-topbar-left">
                <ShieldCheck size={15} />
                <span>Certificado de Conclusão Acadêmica</span>
              </div>
              <button onClick={() => setShowCertModal(false)} className="db-modal-close">
                <X size={16} />
              </button>
            </div>

            <div className="db-cert-wrapper">
              <div className="db-cert-doc">
                <div className="db-cert-header">
                  <div className="db-cert-seal">
                    <Award size={26} />
                  </div>
                  <h2 className="db-cert-institution">Lexum</h2>
                  <p className="db-cert-subtitle">Formação Complementar Autorizada</p>
                </div>

                <div className="db-cert-body">
                  <p className="db-cert-intro">Certificamos para os devidos fins de direito que</p>
                  <h3 className="db-cert-name">{userName}</h3>
                  <p className="db-cert-description">
                    concluiu com êxito e excelente aproveitamento acadêmico a formação livre de extensão universitária em{' '}
                    <strong>Direito Previdenciário na Prática</strong>, abrangendo benefícios, custeio, carência, qualidade de segurado
                    e processo administrativo, totalizando uma carga horária acadêmica de <strong>{totalHours} horas</strong>.
                  </p>
                </div>

                <div className="db-cert-signatories">
                  <div className="db-cert-signatory">
                    <div className="db-cert-sign-line" />
                    <p className="db-cert-sign-name">Dr. Arthur Oryon</p>
                    <p className="db-cert-sign-role">Diretor Acadêmico</p>
                  </div>
                  <div className="db-cert-qr">
                    <QrCode size={52} />
                    <span>Validar via QR</span>
                  </div>
                  <div className="db-cert-signatory">
                    <div className="db-cert-sign-line" />
                    <p className="db-cert-sign-name">Lexum Educa��o Jur�dica</p>
                    <p className="db-cert-sign-role">Registro Eletrônico</p>
                  </div>
                </div>

                <div className="db-cert-footer">
                  <span>Código: <strong>{certCode}</strong></span>
                  <span>Data: <strong>{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                </div>
              </div>
            </div>

            <div className="db-modal-actions">
              <button onClick={() => setShowCertModal(false)} className="db-modal-cancel">Fechar</button>
              <button onClick={() => window.print()} className="db-modal-print">
                <FileText size={15} />
                Imprimir / Salvar PDF
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}
