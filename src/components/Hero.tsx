import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Award, FileCheck, ChevronRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Intro Timeline
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(badgeRef.current,
      { opacity: 0, y: 16, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }
    )
    .fromTo(headlineRef.current?.children ?? [],
      { opacity: 0, y: 40, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out', stagger: 0.14 },
      '-=0.3'
    )
    .fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(highlightsRef.current?.children ?? [],
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
      '-=0.4'
    )
    .fromTo(ctaRef.current?.children ?? [],
      { opacity: 0, y: 16, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)', stagger: 0.12 },
      '-=0.3'
    )
    .fromTo(statsRef.current?.children ?? [],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 },
      '-=0.4'
    )
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.3'
    );
  }, []);

  // Global mousemove handler for background spotlight
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          left: x,
          top: y,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 72,
        overflow: 'hidden',
        background: 'var(--navy-950)',
      }}
    >
      {/* Hero Background Image — fullscreen */}
      <img
        src="/hero.webp"
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Dark overlay for readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(4,16,30,0.55) 0%, rgba(4,16,30,0.40) 50%, rgba(4,16,30,0.70) 100%)',
        zIndex: 1,
      }} />

      {/* Background layers */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(145deg, #030C16 0%, #061525 40%, #091F38 70%, #051220 100%)',
        zIndex: -1,
      }} />

      {/* Mouse Follower Spotlight (Spotlight effect) */}
      <div
        ref={spotlightRef}
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.065) 0%, rgba(19,52,102,0.15) 50%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 2,
          mixBlendMode: 'screen',
          filter: 'blur(30px)',
          left: -1000,
          top: -1000,
        }}
      />

      {/* Animated gradient orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Grid pattern */}
      <div className="hero-grid" style={{ opacity: 0.25 }} />

      {/* Noise overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        backgroundSize: '256px 256px',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <div className="section-container" style={{ position: 'relative', zIndex: 10, width: '100%', flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: 'clamp(20px, 3vw, 48px)' }}>
        <div style={{
          maxWidth: 720,
          padding: 'clamp(60px, 10vh, 120px) 0 clamp(40px, 6vh, 80px)',
          flex: 1,
        }}>

          {/* Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Badge */}
            <div ref={badgeRef} style={{ opacity: 0 }}>
              <span className="hero-badge">
                <Sparkles size={11} className="gold-sparkle" />
                Curso Livre Online · 100% Gratuito
                <span className="hero-badge-dot" />
              </span>
            </div>

            {/* Headline */}
            <div ref={headlineRef} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <h1 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(38px, 5.5vw, 68px)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: 0,
              }}>
                Domine o
              </h1>
              <h1 style={{
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'clamp(44px, 6.5vw, 76px)',
                fontWeight: 300,
                background: 'linear-gradient(135deg, var(--gold-200) 0%, var(--gold-400) 50%, var(--gold-300) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.02,
                letterSpacing: '-0.01em',
                margin: 0,
              }}>
                Direito Previdenciário
              </h1>
              <h1 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(38px, 5.5vw, 68px)',
                fontWeight: 800,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: 0,
              }}>
                na Prática.
              </h1>
            </div>

            <p ref={subRef} style={{
              fontSize: 'clamp(15px, 2vw, 16px)',
              lineHeight: 1.8,
              color: 'rgba(168,180,196,0.85)',
              maxWidth: 480,
              margin: 0,
              opacity: 0,
            }}>
              Formação complementar objetiva e de alto nível sobre benefícios previdenciários,
              qualidade de segurado e processos administrativos junto ao INSS.
              Certificado digital de{' '}
              <strong style={{
                color: 'var(--gold-300)',
                fontWeight: 600,
              }}>40 horas</strong>{' '}
              com validação via QR Code.
            </p>

            {/* Highlights */}
            <div ref={highlightsRef} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {[
                { icon: <Clock size={13} />, label: '40 Horas de Conteúdo' },
                { icon: <Award size={13} />, label: 'Certificado Válido' },
                { icon: <FileCheck size={13} />, label: 'Avaliação Final' },
              ].map((item) => (
                <div key={item.label} className="hero-highlight-pill">
                  <span style={{ color: 'var(--gold-400)' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div ref={ctaRef} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/login" className="btn-hero-primary" style={{ opacity: 0 }}>
                <span>Começar Gratuitamente</span>
                <ChevronRight size={17} />
              </Link>
              <a href="#modulos" className="btn-hero-ghost" style={{ opacity: 0 }}>
                Explorar Conteúdo
              </a>
            </div>

            {/* Stats row */}
            <div ref={statsRef} style={{
              display: 'flex',
              gap: 40,
              paddingTop: 28,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              {[
                { value: '12', label: 'Módulos Completos' },
                { value: '40h', label: 'Carga Horária' },
                { value: '100%', label: 'Gratuito' },
              ].map((stat) => (
                <div key={stat.label} style={{ opacity: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 32,
                    fontWeight: 500,
                    background: 'linear-gradient(135deg, var(--gold-200), var(--gold-400))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

        {/* Scroll indicator */}
        <div ref={scrollRef} style={{ opacity: 0, display: 'flex', justifyContent: 'center', paddingBottom: 40 }}>
          <div className="scroll-indicator">
            <div className="scroll-line" />
            <span>explorar</span>
          </div>
        </div>
      </div>
    </div>

      <style>{`
        @media (max-width: 768px) {
          #hero {
            width: 100% !important;
            max-width: 100% !important;
            touch-action: pan-y !important;
            overscroll-behavior: none !important;
          }
          .section-container {
            padding: 0 16px !important;
          }
          #hero img[aria-hidden] {
            object-position: left center !important;
          }
          [ref="statsRef"] {
            gap: 24px !important;
          }
        }
        @media (max-width: 480px) {
          [class*="hero-highlight-pill"] {
            font-size: 11px !important;
            padding: 6px 12px !important;
          }
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .hero-orb-1 {
          top: 10%;
          right: 5%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%);
          filter: blur(50px);
          animation: orbFloat1 9s ease-in-out infinite;
        }
        .hero-orb-2 {
          bottom: 5%;
          left: -8%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(19,52,102,0.45) 0%, transparent 70%);
          filter: blur(60px);
          animation: orbFloat2 11s ease-in-out infinite;
        }
        .hero-orb-3 {
          top: 35%;
          right: 35%;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%);
          filter: blur(35px);
          animation: orbFloat1 7s ease-in-out infinite reverse;
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 20px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(25px, -25px); }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(201,168,76,0.09);
          border: 1px solid rgba(201,168,76,0.22);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold-300);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          transition: all 0.3s;
        }
        .hero-badge:hover {
          background: rgba(201,168,76,0.14);
          border-color: rgba(201,168,76,0.35);
          transform: translateY(-1px);
        }
        .hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold-400);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
        
        .gold-sparkle {
          animation: sparkleAnim 3s infinite ease-in-out;
        }
        @keyframes sparkleAnim {
          0%, 100% { opacity: 0.6; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.1) rotate(180deg); }
        }

        .hero-highlight-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(168,180,196,0.9);
          backdrop-filter: blur(6px);
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .hero-highlight-pill:hover {
          background: rgba(201,168,76,0.08);
          border-color: rgba(201,168,76,0.25);
          color: var(--gold-300);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(201,168,76,0.1);
        }

        .btn-hero-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 36px;
          background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-400) 100%);
          color: var(--navy-950);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: 0 4px 20px rgba(201,168,76,0.25), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .btn-hero-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
          transform: translateX(-120%);
          transition: transform 0.7s var(--ease-out-quart);
        }
        .btn-hero-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(201,168,76,0.45), inset 0 1px 0 rgba(255,255,255,0.2);
          background: linear-gradient(135deg, var(--gold-300) 0%, var(--gold-400) 100%);
        }
        .btn-hero-primary:hover::before { transform: translateX(120%); }
        .btn-hero-primary:active { transform: translateY(-1px); }

        .btn-hero-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 15px 32px;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          backdrop-filter: blur(4px);
        }
        .btn-hero-ghost:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(201,168,76,0.3);
          color: var(--gold-300);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

      `}</style>
    </section>
  );
}
