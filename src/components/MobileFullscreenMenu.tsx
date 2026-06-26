import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  User,
  Award,
  LogOut,
  GraduationCap,
  Loader2,
  Target,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import { gsap } from 'gsap';
import { useSidebar } from '../contexts/SidebarContext';

interface MobileFullscreenMenuProps {
  userName?: string;
  userEmail?: string | null;
  onLogout?: () => void;
  loggingOut?: boolean;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Painel', href: '/dashboard' },
  { id: 'modules', icon: BookOpen, label: 'Módulos', href: '/modules' },
  { id: 'exam', icon: Target, label: 'Prova Geral', href: '/exam' },
  { id: 'certificate', icon: Award, label: 'Emitir Certificado', href: '/certificate' },
  { id: 'validate', icon: ShieldCheck, label: 'Validar Certificado', href: '/validate' },
  { id: 'profile', icon: User, label: 'Meu Perfil', href: '/profile' },
];

export default function MobileFullscreenMenu({
  userName = 'Aluno',
  userEmail,
  onLogout,
  loggingOut,
}: MobileFullscreenMenuProps) {
  const location = useLocation();
  const { mobileOpen, closeMobile } = useSidebar();
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Track visibility for exit animation duration
  const [exiting, setExiting] = useState(false);

  const firstName = userName.split(' ')[0];
  const initials = firstName.charAt(0).toUpperCase();

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    closeMobile();
  };

  // GSAP entrance/exit animations
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    // Use gsap.context() for automatic cleanup on StrictMode double-invoke
    const ctx = gsap.context(() => {
      if (mobileOpen) {
        document.body.style.overflow = 'hidden';

        gsap.set(el, { display: 'flex', opacity: 0 });

        const tl = gsap.timeline();

        tl.to(el, { opacity: 1, duration: 0.35, ease: 'power2.out' })
          .fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')
          .fromTo(footerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.3');

        // Stagger links after overlay is visible
        if (linksRef.current) {
          tl.fromTo(
            linksRef.current.children,
            { opacity: 0, y: 40, filter: 'blur(8px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.06, ease: 'power3.out' },
            '-=0.1'
          );
        }

      } else {
        // Exit animation — fade links out first, then overlay
        document.body.style.overflow = '';
        setExiting(true);

        if (linksRef.current) {
          gsap.to(linksRef.current.children, {
            opacity: 0,
            y: 20,
            filter: 'blur(4px)',
            duration: 0.2,
            ease: 'power2.in',
            stagger: 0.02,
            onComplete: () => {
              gsap.to(el, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                  setExiting(false);
                }
              });
            }
          });
        } else {
          gsap.to(el, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => setExiting(false)
          });
        }
      }
    }, el);

    return () => {
      ctx.revert(); // Kills all GSAP animations created in this context
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  if (!mobileOpen && !exiting) return null;

  return (
    <div
      ref={overlayRef}
      className="mobile-fullscreen-menu"
    >
      {/* Decorative glowing orbs */}
      <div className="mfm-orb mfm-orb--top" />
      <div className="mfm-orb mfm-orb--bottom" />
      <div className="mfm-orb mfm-orb--center" />

      {/* Grid overlay */}
      <div className="mfm-grid" />

      {/* Close button */}
      <button
        className="mfm-close-btn"
        onClick={closeMobile}
        aria-label="Fechar menu"
      >
        <X size={22} />
      </button>

      <div className="mfm-content" ref={menuContentRef}>
        {/* Top branding */}
        <div ref={headerRef} className="mfm-header">
          <div className="mfm-brand-icon">
            <GraduationCap size={20} />
          </div>
          <div className="mfm-brand-text">
            <span className="mfm-brand-name">Lexum</span>
            <span className="mfm-brand-sub">Formação Complementar</span>
          </div>
          <div className="mfm-brand-line" />
        </div>

        {/* Navigation links */}
        <div ref={linksRef} className="mfm-links">
          {navItems.map((item, i) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={handleLinkClick}
                className={`mfm-link ${active ? 'mfm-link--active' : ''}`}
              >
                <span className="mfm-link-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mfm-link-icon-wrap">
                  <Icon size={18} strokeWidth={active ? 2.25 : 1.8} />
                </div>
                <span className="mfm-link-label">{item.label}</span>
                <span className={`mfm-link-indicator ${active ? 'mfm-link-indicator--active' : ''}`}>
                  <span />
                </span>
                <ArrowRight size={15} className="mfm-link-arrow" />
              </Link>
            );
          })}
        </div>

        {/* Bottom: User + Logout */}
        <div ref={footerRef} className="mfm-footer">
          <div className="mfm-user">
            <div className="mfm-avatar">{initials}</div>
            <div className="mfm-user-info">
              <span className="mfm-user-name">{firstName}</span>
              {userEmail && <span className="mfm-user-email">{userEmail}</span>}
            </div>
            <div className="mfm-sparkle">
              <Sparkles size={12} />
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              className="mfm-logout-btn"
              onClick={onLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogOut size={14} />
              )}
              <span>{loggingOut ? 'Saindo...' : 'Sair da conta'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
