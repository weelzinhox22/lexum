import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseModules, getModuleStatus as getStatusFromStore, getModuleProgress } from '../data/modules';
import { supabase } from '../lib/supabase';
import AppShell from '../components/AppShell';
import { useLexumProgress } from '../lib/lexumProgress';
import {
  Clock,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Lock,
  Play,
  Award,
  TrendingUp,
  Sparkles,
  Timer,
  Trophy,
  Star,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Modules() {
  const { completedList, completedCount: completedCountHook, totalModules: totalModulesHook, percentage: progressPercentHook } = useLexumProgress();
  const navigate = useNavigate();
  const [progressMap, setProgressMap] = useState<Record<number, { status: string; grade?: number }>>({});
  const [userName, setUserName] = useState('Aluno');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login');
      else {
        setUserEmail(session.user.email ?? null);
        const fullName = session.user.user_metadata?.full_name;
        if (fullName) setUserName(fullName);
        else if (session.user.email) setUserName(session.user.email.split('@')[0]);
      }
    });
  }, [navigate]);

  useEffect(() => {
    setProgressMap(getModuleProgress());
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getModuleStatus = (moduleId: number): 'liberado' | 'bloqueado' | 'concluido' => {
    const mod = courseModules.find(m => m.id === moduleId);
    if (mod && (completedList.includes(mod.slug) || completedList.includes(`modulo-${mod.id}`))) {
      return 'concluido';
    }
    return getStatusFromStore(moduleId);
  };

  const totalModules = totalModulesHook;
  const completedCount = completedCountHook;
  const unlockedCount = courseModules.filter(m => getModuleStatus(m.id) !== 'bloqueado').length;
  const progressPercent = progressPercentHook;
  const totalHours = courseModules.reduce((acc, m) => acc + parseInt(m.duration), 0);
  const completedHours = courseModules.filter(m => getModuleStatus(m.id) === 'concluido').reduce((acc, m) => acc + parseInt(m.duration), 0);
  const withGrades = courseModules.filter(m => progressMap[m.id]?.status === 'concluido' && progressMap[m.id]?.grade !== undefined);
  const avgGrade = withGrades.length > 0
    ? Math.round(withGrades.reduce((a, m) => a + (progressMap[m.id]?.grade || 0), 0) / withGrades.length)
    : 0;
  const hasStarted = unlockedCount > 0;
  const currentModule = courseModules.find(m => !completedList.includes(m.slug) && !completedList.includes(`modulo-${m.id}`));

  const handleModuleClick = (moduleId: number) => {
    const status = getModuleStatus(moduleId);
    if (status === 'bloqueado') return;
    const mod = courseModules.find(m => m.id === moduleId);
    if (mod) navigate(`/module/${mod.slug}`);
  };

  // ── Refs for GSAP ──
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const sectionHeaderRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statNumRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const hasQuizzes = withGrades.length > 0;

  const stats = [
    {
      icon: TrendingUp,
      label: 'Progresso',
      rawValue: progressPercent,
      suffix: '%',
      sub: `${completedCount}/${totalModules} módulos`,
      color: 'gold',
    },
    {
      icon: Award,
      label: 'Concluídos',
      rawValue: completedCount,
      suffix: '',
      sub: `${unlockedCount - completedCount} em andamento`,
      color: 'blue',
    },
    {
      icon: Timer,
      label: 'Horas Completadas',
      rawValue: completedHours,
      suffix: 'h',
      sub: `de ${totalHours}h totais`,
      color: 'purple',
    },
    {
      icon: Trophy,
      label: 'Média nos Quizzes',
      rawValue: hasQuizzes ? avgGrade : null,
      suffix: '%',
      sub: hasQuizzes ? `${withGrades.length} quizzes` : 'Nenhum ainda',
      color: avgGrade >= 70 ? 'green' : 'gray',
    },
  ];

  // ── GSAP Entrance Animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero stagger
      gsap.fromTo(
        heroRef.current?.children ?? [],
        { opacity: 0, y: 32, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', stagger: 0.1, delay: 0.15 }
      );

      // Stats entrance (fade + scale)
      gsap.fromTo(
        statsRef.current?.children ?? [],
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.45 }
      );

      // Stat number count-up (starts after all 4 stat cards are visible)
      statNumRefs.current.forEach((el, i) => {
        if (!el) return;
        const raw = stats[i].rawValue;
        if (raw === null) {
          el.textContent = '—';
          return;
        }
        const target = { val: 0 };
        gsap.to(target, {
          val: raw,
          duration: 1.6,
          ease: 'power3.out',
          delay: 0.85 + i * 0.1,
          onUpdate: () => {
            el!.textContent = String(Math.round(target.val));
          },
        });
      });

      // Progress bar
      gsap.fromTo(
        progressBarRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.7 }
      );

      // Section header
      gsap.fromTo(
        sectionHeaderRef.current?.children ?? [],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: sectionHeaderRef.current, start: 'top 88%' } }
      );

      // Grid cards
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.04, scrollTrigger: { trigger: gridRef.current, start: 'top 90%' } }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <AppShell
      userName={userName}
      userEmail={userEmail}
      onLogout={handleLogout}
      loggingOut={loggingOut}
    >
    <div ref={pageRef} className="mod-page mod-page--shell">

      {/* ═══════════════════════════════════════════════════
         HERO SECTION — Dark Navy
         ═══════════════════════════════════════════════════ */}
      <section className="mod-hero">
        {/* Background layers */}
        <div className="mod-hero-bg" />
        <div className="mod-hero-grid" />
        <div className="mod-hero-radial" />

        <div className="mod-container mod-hero-inner">

          {/* Heading */}
          <div ref={heroRef} className="mod-hero-heading">
            <div className="mod-hero-badge">
              <Sparkles size={11} className="mod-hero-sparkle" />
              Formação Complementar · 12 Módulos
            </div>
            <h1 className="mod-hero-title">
              Módulos do{' '}
              <em>Curso</em>
            </h1>
            <p className="mod-hero-sub">
              {totalModules} módulos · {totalHours}h de conteúdo · Acesso vitalício
            </p>
          </div>

          {/* Stats Row */}
          <div ref={statsRef} className="mod-stats">
            {stats.map((s, i) => (
              <div key={s.label} className={`mod-stat mod-stat--${s.color}`}>
                <div className="mod-stat-icon-wrap">
                  <s.icon size={15} />
                </div>
                <div className="mod-stat-info">
                  <span className="mod-stat-value">
                    {s.rawValue !== null ? (
                      <>
                        <span ref={(el) => { statNumRefs.current[i] = el; }}>0</span>
                        {s.suffix}
                      </>
                    ) : (
                      '—'
                    )}
                  </span>
                  <span className="mod-stat-label">{s.label}</span>
                </div>
                <span className="mod-stat-sub">{s.sub}</span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {hasStarted && (
            <div ref={progressBarRef} className="mod-hero-progress">
              <div className="mod-hero-progress-head">
                <span className="mod-hero-progress-label">
                  {completedCount} de {totalModules} módulos concluídos
                </span>
                <span className="mod-hero-progress-pct">{progressPercent}%</span>
              </div>
              <div className="mod-hero-progress-track">
                <div className="mod-hero-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          {!hasStarted && (
            <div ref={progressBarRef} className="mod-hero-empty">
              <Target size={16} />
              <span>Nenhum módulo iniciado ainda. O primeiro módulo está liberado para você!</span>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         MODULES GRID SECTION
         ═══════════════════════════════════════════════════ */}
      <section className="mod-grid-section">
        <div className="mod-container">

          {/* Section Header */}
          <div ref={sectionHeaderRef} className="mod-section-header">
            <div className="mod-section-badge">Conteúdo Programático</div>
            <h2 className="mod-section-title">Todos os Módulos</h2>
            <p className="mod-section-desc">
              Clique em um módulo liberado para acessar o conteúdo, realizar os quizzes e acompanhar seu progresso.
            </p>
          </div>

          {/* Grid */}
          <div ref={gridRef} className="mod-grid">
            {courseModules.map((mod) => {
              const status = getModuleStatus(mod.id);
              const isClickable = status !== 'bloqueado';
              const isCompleted = status === 'concluido';
              const isInProgress = status === 'liberado';
              const modProgress = progressMap[mod.id];

              return (
                <div
                  key={mod.id}
                  onClick={() => handleModuleClick(mod.id)}
                  className={`mod-card ${isClickable ? 'mod-card--clickable' : ''} ${isCompleted ? 'mod-card--done' : ''}`}
                >
                  {/* Top gold accent bar */}
                  <div className={`mod-card-accent ${isCompleted ? 'mod-card-accent--done' : isInProgress ? 'mod-card-accent--active' : ''}`} />

                  {/* Card Header */}
                  <div className="mod-card-header">
                    <div className={`mod-card-num ${isCompleted ? 'mod-card-num--done' : isInProgress ? 'mod-card-num--active' : 'mod-card-num--locked'}`}>
                      {isCompleted ? (
                        <CheckCircle size={18} />
                      ) : (
                        <span>{String(mod.id).padStart(2, '0')}</span>
                      )}
                    </div>
                    <span className={`mod-card-badge mod-card-badge--${status}`}>
                      {status === 'concluido' ? 'Concluído' : status === 'liberado' ? 'Em andamento' : 'Bloqueado'}
                    </span>
                  </div>

                  {/* Title + Desc */}
                  <h3 className="mod-card-title">{mod.title}</h3>
                  <p className="mod-card-desc">{mod.description}</p>

                  {/* Meta Row */}
                  <div className="mod-card-meta">
                    <div className="mod-card-meta-item">
                      <Clock size={11} />
                      <span>{mod.duration}</span>
                    </div>
                    <div className="mod-card-meta-item">
                      <BookOpen size={11} />
                      <span>{mod.sections.length} {mod.sections.length === 1 ? 'seção' : 'seções'}</span>
                    </div>
                    {isCompleted && modProgress?.grade !== undefined && (
                      <div className="mod-card-grade">
                        <Star size={11} />
                        <span>{modProgress.grade}%</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mod-card-footer">
                    {isClickable ? (
                      <span className="mod-card-action">
                        {isCompleted ? 'Revisar módulo' : isInProgress ? 'Continuar' : 'Acessar'}
                        <ChevronRight size={13} />
                      </span>
                    ) : (
                      <span className="mod-card-action mod-card-action--locked">
                        <Lock size={11} />
                        Complete o anterior
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        {currentModule && (
          <div className="mod-bottom-cta">
            <div className="mod-container">
              <div className="mod-bottom-cta-inner">
                <div className="mod-bottom-cta-text">
                  <span className="mod-bottom-cta-chip">
                    <Play size={11} />
                    Próximo módulo disponível
                  </span>
                  <h3 className="mod-bottom-cta-title">
                    Módulo {currentModule.id}: {currentModule.title}
                  </h3>
                  <p className="mod-bottom-cta-desc">{currentModule.description}</p>
                </div>
                <button onClick={() => handleModuleClick(currentModule.id)} className="mod-bottom-cta-btn">
                  <Play size={14} />
                  Continuar estudando
                  <ArrowUpRight size={13} className="mod-bottom-cta-arrow" />
                </button>
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
        .mod-page {
          min-height: 100vh;
          background: #F0F3F8;
          font-family: var(--font-sans);
        }

        /* ── Container ── */
        .mod-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 48px);
        }

        /* ═══════════════════════════════════════════════
           TOPBAR
           ═══════════════════════════════════════════════ */
        .mod-topbar {
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
        .mod-topbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .mod-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .mod-logo-mark {
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
        .mod-logo-brand {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #EDF1F7;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .mod-logo-tagline {
          display: block;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(201, 168, 76, 0.8);
          line-height: 1;
          margin-top: 1px;
        }

        .mod-topbar-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .mod-back-link {
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
        .mod-back-link:hover {
          color: #C9A84C;
          border-color: rgba(201, 168, 76, 0.35);
          background: rgba(201, 168, 76, 0.08);
        }

        /* ═══════════════════════════════════════════════
           HERO
           ═══════════════════════════════════════════════ */
        .mod-hero {
          position: relative;
          padding: clamp(56px, 8vh, 96px) 0 clamp(40px, 5vh, 56px);
          overflow: hidden;
          background: var(--navy-950);
        }
        .mod-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, #030C16 0%, #061525 40%, #091F38 70%, #051220 100%);
        }
        .mod-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
        }
        .mod-hero-radial {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 70% 40%, rgba(201, 168, 76, 0.05) 0%, transparent 70%);
        }

        .mod-hero-inner {
          position: relative;
          z-index: 2;
        }

        .mod-hero-heading {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 36px;
        }
        .mod-hero-badge {
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
        .mod-hero-sparkle {
          animation: modSparkle 3s ease-in-out infinite;
        }
        @keyframes modSparkle {
          0%, 100% { opacity: 0.6; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.1) rotate(180deg); }
        }

        .mod-hero-title {
          font-family: var(--font-editorial);
          font-size: clamp(38px, 5vw, 56px);
          font-weight: 400;
          color: #FFFFFF;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .mod-hero-title em {
          font-style: italic;
          background: linear-gradient(135deg, var(--gold-200) 0%, var(--gold-400) 50%, var(--gold-300) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mod-hero-sub {
          font-size: 14px;
          color: rgba(168, 180, 196, 0.7);
          margin: 4px 0 0;
          font-weight: 400;
        }

        /* ── Stats ── */
        .mod-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        .mod-stat {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 18px 18px 14px;
          transition: all 0.3s var(--ease-out-quart);
          backdrop-filter: blur(8px);
        }
        .mod-stat:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }

        .mod-stat-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }
        .mod-stat--gold .mod-stat-icon-wrap  { background: rgba(201,168,76,0.12); color: #C9A84C; }
        .mod-stat--blue .mod-stat-icon-wrap  { background: rgba(59,130,246,0.1);  color: #60A5FA; }
        .mod-stat--purple .mod-stat-icon-wrap{ background: rgba(139,92,246,0.1);  color: #A78BFA; }
        .mod-stat--green .mod-stat-icon-wrap { background: rgba(34,197,94,0.1);   color: #4ADE80; }
        .mod-stat--gray .mod-stat-icon-wrap  { background: rgba(100,116,139,0.1); color: #94A3B8; }

        .mod-stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mod-stat-value {
          font-size: 26px;
          font-weight: 800;
          color: #EDF1F7;
          letter-spacing: -0.03em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .mod-stat-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.4);
        }
        .mod-stat-sub {
          display: block;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.25);
          margin-top: 6px;
          font-weight: 400;
        }

        /* ── Progress ── */
        .mod-hero-progress {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 18px 22px;
        }
        .mod-hero-progress-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .mod-hero-progress-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }
        .mod-hero-progress-pct {
          font-size: 13px;
          font-weight: 700;
          color: var(--gold-400);
          font-variant-numeric: tabular-nums;
        }
        .mod-hero-progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }
        .mod-hero-progress-fill {
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(90deg, var(--gold-600), var(--gold-300));
          transition: width 1.2s var(--ease-out-quart);
        }

        .mod-hero-empty {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 22px;
          background: rgba(201, 168, 76, 0.06);
          border: 1px solid rgba(201, 168, 76, 0.15);
          border-radius: 14px;
          color: var(--gold-300);
          font-size: 13px;
          font-weight: 500;
        }
        .mod-hero-empty svg {
          flex-shrink: 0;
          opacity: 0.7;
        }

        /* ═══════════════════════════════════════════════
           GRID SECTION
           ═══════════════════════════════════════════════ */
        .mod-grid-section {
          padding: clamp(40px, 5vw, 64px) 0 clamp(56px, 6vw, 80px);
        }

        .mod-section-header {
          text-align: center;
          max-width: 560px;
          margin: 0 auto 40px;
        }
        .mod-section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold-600);
          margin-bottom: 12px;
        }
        .mod-section-badge::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: var(--gold-500);
          opacity: 0.4;
        }
        .mod-section-badge::after {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: var(--gold-500);
          opacity: 0.4;
        }
        .mod-section-title {
          font-family: var(--font-editorial);
          font-size: clamp(28px, 3.5vw, 40px);
          font-weight: 400;
          color: var(--navy-800);
          line-height: 1.15;
          margin: 0 0 12px;
        }
        .mod-section-desc {
          font-size: 14px;
          line-height: 1.75;
          color: #637080;
          margin: 0;
        }

        /* ── Grid ── */
        .mod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        /* ═══════════════════════════════════════════════
           CARD
           ═══════════════════════════════════════════════ */
        .mod-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid #E8ECF2;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.4s var(--ease-out-quart);
          box-shadow: 0 2px 8px rgba(11, 30, 56, 0.04);
        }
        .mod-card--clickable {
          cursor: pointer;
        }
        .mod-card--clickable:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 50px rgba(11, 30, 56, 0.12);
          border-color: rgba(201, 168, 76, 0.3);
        }
        .mod-card--done {
          opacity: 1;
        }

        .mod-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(232, 236, 242, 0.8);
          transition: all 0.3s;
        }
        .mod-card-accent--active {
          background: linear-gradient(90deg, var(--gold-600), var(--gold-400));
        }
        .mod-card-accent--done {
          background: linear-gradient(90deg, #22C55E, #4ADE80);
        }
        .mod-card:hover .mod-card-accent--active {
          background: linear-gradient(90deg, var(--gold-500), var(--gold-300));
          height: 4px;
        }

        .mod-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 22px 0;
          margin-bottom: 12px;
        }

        .mod-card-num {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.3s;
        }
        .mod-card-num--active {
          background: rgba(201, 168, 76, 0.08);
          border: 1.5px solid rgba(201, 168, 76, 0.2);
          color: #C9A84C;
        }
        .mod-card-num--done {
          background: rgba(34, 197, 94, 0.08);
          border: 1.5px solid rgba(34, 197, 94, 0.2);
          color: #22C55E;
        }
        .mod-card-num--locked {
          background: #F5F7FA;
          border: 1.5px solid #E8ECF2;
          color: #C4CEDC;
        }
        .mod-card--clickable:hover .mod-card-num--active {
          background: rgba(201, 168, 76, 0.14);
          border-color: rgba(201, 168, 76, 0.35);
          transform: scale(1.05);
        }
        .mod-card--clickable:hover .mod-card-num--done {
          background: rgba(34, 197, 94, 0.14);
          border-color: rgba(34, 197, 94, 0.3);
          transform: scale(1.05);
        }

        .mod-card-badge {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 100px;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .mod-card-badge--concluido  { background: rgba(34,197,94,0.08);  color: #16A34A; border-color: rgba(34,197,94,0.18);    }
        .mod-card-badge--liberado   { background: rgba(201,168,76,0.08); color: #A8893A; border-color: rgba(201,168,76,0.18);   }
        .mod-card-badge--bloqueado  { background: rgba(100,116,139,0.06); color: #94A3B8; border-color: rgba(100,116,139,0.1); }

        .mod-card-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--navy-800);
          line-height: 1.35;
          margin: 0 22px 6px;
          letter-spacing: -0.01em;
        }
        .mod-card--done .mod-card-title {
          color: #1E293B;
        }

        .mod-card-desc {
          font-size: 12.5px;
          color: #637080;
          line-height: 1.65;
          margin: 0 22px 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .mod-card-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 22px;
          border-top: 1px solid #F0F3F8;
          margin-top: auto;
        }
        .mod-card-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #94A3B8;
          font-weight: 500;
        }
        .mod-card-meta-item svg {
          flex-shrink: 0;
        }
        .mod-card-grade {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #16A34A;
          margin-left: auto;
        }
        .mod-card-grade svg {
          flex-shrink: 0;
        }

        .mod-card-footer {
          padding: 0 22px 16px;
        }
        .mod-card-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: #C9A84C;
          transition: all 0.2s;
        }
        .mod-card--clickable:hover .mod-card-action {
          gap: 8px;
        }
        .mod-card-action svg {
          transition: transform 0.2s;
        }
        .mod-card--clickable:hover .mod-card-action svg {
          transform: translateX(3px);
        }
        .mod-card-action--locked {
          color: #94A3B8;
          gap: 5px;
        }
        .mod-card--clickable:hover .mod-card-action--locked {
          gap: 5px;
        }
        .mod-card--clickable:hover .mod-card-action--locked svg {
          transform: none;
        }

        /* ═══════════════════════════════════════════════
           BOTTOM CTA
           ═══════════════════════════════════════════════ */
        .mod-bottom-cta {
          margin-top: 48px;
          padding-bottom: 0;
        }
        .mod-bottom-cta-inner {
          background: linear-gradient(145deg, #0B1E38, #133466);
          border-radius: 16px;
          padding: clamp(28px, 4vw, 40px) clamp(24px, 4vw, 44px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(11, 30, 56, 0.2);
        }
        .mod-bottom-cta-inner::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.06), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .mod-bottom-cta-text {
          position: relative;
          z-index: 1;
        }
        .mod-bottom-cta-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold-400);
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.2);
          padding: 4px 10px;
          border-radius: 100px;
          margin-bottom: 10px;
        }
        .mod-bottom-cta-title {
          font-family: var(--font-editorial);
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 500;
          color: #FFFFFF;
          margin: 0 0 6px;
          line-height: 1.25;
        }
        .mod-bottom-cta-desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
          line-height: 1.6;
          max-width: 480px;
        }
        .mod-bottom-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          background: linear-gradient(135deg, #C9A84C, #D4B05A);
          color: #07152A;
          font-size: 13px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s var(--ease-out-quart);
          box-shadow: 0 4px 16px rgba(201, 168, 76, 0.35);
          position: relative;
          z-index: 1;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .mod-bottom-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(201, 168, 76, 0.5);
          background: linear-gradient(135deg, var(--gold-300), var(--gold-400));
        }
        .mod-bottom-cta-arrow {
          opacity: 0.6;
          transition: all 0.2s;
        }
        .mod-bottom-cta-btn:hover .mod-bottom-cta-arrow {
          opacity: 1;
          transform: translate(2px, -2px);
        }

        /* ═══════════════════════════════════════════════
           RESPONSIVE
           ═══════════════════════════════════════════════ */
        @media (max-width: 900px) {
          .mod-stats { grid-template-columns: repeat(2, 1fr); }
          .mod-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        }
        @media (max-width: 640px) {
          .mod-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .mod-stat { padding: 14px 14px 12px; }
          .mod-stat-value { font-size: 22px; }
          .mod-grid { grid-template-columns: 1fr; }
          .mod-hero-title { font-size: 32px; }
          .mod-logo-text { display: none; }
        }
      `}</style>
    </div>
    </AppShell>
  );
}
