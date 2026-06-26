import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

const navLinks = [
  { label: 'Sobre o Curso', href: '/#sobre' },
  { label: 'Módulos', href: '/#modulos' },
  { label: 'Como Funciona', href: '/#como-obter' },
  { label: 'Certificado', href: '/#certificado' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    if (!overlayRef.current || !menuContentRef.current) return;

    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlayRef.current, { display: 'flex' });
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      if (menuLinksRef.current) {
        gsap.fromTo(
          menuLinksRef.current.children,
          { opacity: 0, y: 32, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.15 }
        );
      }
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' });
        }
      });
    }
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      const id = href.split('#')[1];
      if (window.location.pathname === '/') {
        setTimeout(() => {
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
          background: scrolled
            ? 'rgba(4, 16, 30, 0.82)'
            : 'rgba(4, 16, 30, 0)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        <div className="section-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                background: 'linear-gradient(135deg, var(--gold-600), var(--gold-400))',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 16px rgba(201,168,76,0.3)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--navy-950)',
                  letterSpacing: '-0.02em',
                }}>SO</span>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                }}>
                  Lexum
                </div>
                <div style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-500)',
                  lineHeight: 1,
                }}>
                  Formação Complementar
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav style={{ display: 'none', alignItems: 'center', gap: 36 }} className="desktop-nav">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="nav-link-glass"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Link
                to="/login"
                className="btn-primary-glass"
                style={{ display: 'none' }}
                id="header-cta"
              >
                Iniciar Formação
                <ArrowRight size={14} />
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="hamburger-btn"
                aria-label="Menu"
              >
                <div className={`hamburger-icon ${mobileOpen ? 'is-open' : ''}`}>
                  <span />
                  <span />
                  <span />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'rgba(4, 10, 22, 0.97)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(19,52,102,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div ref={menuContentRef} style={{ width: '100%', maxWidth: 480, padding: '0 32px' }}>
          {/* Brand in overlay */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 13,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold-500)',
              marginBottom: 4,
            }}>Lexum</div>
            <div style={{ width: 40, height: 1, background: 'rgba(201,168,76,0.3)', margin: '12px auto 0' }} />
          </div>

          <div ref={menuLinksRef} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {navLinks.map((link, i) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="mobile-nav-item"
              >
                <span className="mobile-nav-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="mobile-nav-label">{link.label}</span>
                <ArrowRight size={16} className="mobile-nav-arrow" />
              </button>
            ))}

            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px 32px' }}
              >
                Iniciar Formação Gratuita
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          #header-cta { display: inline-flex !important; }
          .hamburger-btn { display: none !important; }
        }

        .nav-link-glass {
          position: relative;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 0;
          transition: color 0.25s;
          letter-spacing: 0.01em;
        }
        .nav-link-glass::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--gold-500);
          transition: width 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .nav-link-glass:hover { color: #fff; }
        .nav-link-glass:hover::after { width: 100%; }

        .btn-primary-glass {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          background: rgba(201,168,76,0.15);
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 8px;
          color: var(--gold-300);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          backdrop-filter: blur(8px);
          letter-spacing: 0.02em;
        }
        .btn-primary-glass:hover {
          background: rgba(201,168,76,0.25);
          border-color: rgba(201,168,76,0.6);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(201,168,76,0.2);
        }

        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
          padding: 0;
        }
        .hamburger-btn:hover {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.3);
        }

        .hamburger-icon {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 20px;
        }
        .hamburger-icon span {
          display: block;
          height: 1.5px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.35s cubic-bezier(0.77, 0, 0.175, 1);
          transform-origin: center;
        }
        .hamburger-icon span:nth-child(1) { width: 100%; }
        .hamburger-icon span:nth-child(2) { width: 75%; }
        .hamburger-icon span:nth-child(3) { width: 100%; }

        .hamburger-icon.is-open span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
          width: 100%;
        }
        .hamburger-icon.is-open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger-icon.is-open span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
          width: 100%;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 20px;
          width: 100%;
          padding: 22px 0;
          background: none;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          text-align: left;
          transition: all 0.25s ease;
        }
        .mobile-nav-item:hover .mobile-nav-label { color: #fff; }
        .mobile-nav-item:hover .mobile-nav-arrow { opacity: 1; transform: translateX(4px); color: var(--gold-400); }
        .mobile-nav-item:hover .mobile-nav-number { color: var(--gold-500); }

        .mobile-nav-number {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.2);
          transition: color 0.25s;
          min-width: 24px;
        }
        .mobile-nav-label {
          flex: 1;
          font-family: var(--font-editorial);
          font-size: clamp(22px, 5vw, 32px);
          font-weight: 400;
          color: rgba(255,255,255,0.7);
          transition: color 0.25s;
          letter-spacing: -0.01em;
        }
        .mobile-nav-arrow {
          opacity: 0;
          color: rgba(255,255,255,0.3);
          transition: all 0.25s ease;
        }
      `}</style>
    </>
  );
}
