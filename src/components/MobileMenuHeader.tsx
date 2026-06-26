import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import MobileFullscreenMenu from './MobileFullscreenMenu';

interface MobileMenuHeaderProps {
  userName?: string;
  userEmail?: string | null;
  onLogout?: () => void;
  loggingOut?: boolean;
}

export default function MobileMenuHeader({
  userName,
  userEmail,
  onLogout,
  loggingOut,
}: MobileMenuHeaderProps) {
  const { mobileOpen, toggleMobile } = useSidebar();

  return (
    <>
      <header className="app-mobile-header">
        <Link to="/dashboard" className="app-mobile-header-brand">
          <div className="app-mobile-header-mark">
            <GraduationCap size={16} />
          </div>
          <div className="app-mobile-header-text">
            <span className="app-mobile-header-name">Lexum</span>
          </div>
        </Link>
        <button
          className={`app-mobile-header-btn ${mobileOpen ? 'is-open' : ''}`}
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <div className="mobile-hamburger">
            <span />
            <span />
            <span />
          </div>
        </button>
      </header>

      <MobileFullscreenMenu
        userName={userName}
        userEmail={userEmail}
        onLogout={onLogout}
        loggingOut={loggingOut}
      />
    </>
  );
}
