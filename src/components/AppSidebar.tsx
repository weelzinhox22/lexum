import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  User,
  Award,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Circle,
  Target,
} from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

export interface ModuleSectionNav {
  id: number;
  title: string;
  done?: boolean;
  active?: boolean;
  onClick?: () => void;
}

interface AppSidebarProps {
  userName?: string;
  userEmail?: string | null;
  onLogout?: () => void;
  loggingOut?: boolean;
  moduleSections?: ModuleSectionNav[];
  moduleProgressLabel?: string;
  moduleProgressPct?: number;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Painel', href: '/dashboard' },
  { id: 'modules', icon: BookOpen, label: 'Módulos', href: '/modules' },
  { id: 'exam', icon: Target, label: 'Prova Geral', href: '/exam' },
  { id: 'certificate', icon: Award, label: 'Emitir certificado', href: '/certificate' },
  { id: 'validate', icon: ShieldCheck, label: 'Validar certificado', href: '/validate' },
  { id: 'profile', icon: User, label: 'Meu perfil', href: '/profile' },
]

export default function AppSidebar({
  userName = 'Aluno',
  userEmail,
  onLogout,
  loggingOut,
  moduleSections,
  moduleProgressLabel,
  moduleProgressPct = 0,
}: AppSidebarProps) {
  const location = useLocation();
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar();
  const firstName = userName.split(' ')[0];

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    if (mobileOpen) closeMobile();
  };

  return (
    <aside
      className={`app-sidebar ${collapsed ? 'app-sidebar--collapsed' : ''}`}
    >
      <div className="app-sidebar-inner">
        <div className="app-sidebar-top">
          <Link to="/dashboard" className="app-sidebar-brand" title="Lexum" onClick={handleLinkClick}>
            <div className="app-sidebar-mark">
              <GraduationCap size={collapsed ? 20 : 18} />
            </div>
            {!collapsed && (
              <div className="app-sidebar-brand-text">
                <span className="app-sidebar-brand-name">Lexum</span>
                <span className="app-sidebar-brand-sub">Direito Previdenciário</span>
              </div>
            )}
          </Link>
          <button
            type="button"
            className="app-sidebar-toggle"
            onClick={toggle}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="app-sidebar-nav">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={handleLinkClick}
                className={`app-sidebar-link ${active ? 'app-sidebar-link--active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} strokeWidth={active ? 2.25 : 2} />
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && <span className="app-sidebar-link-dot" />}
              </Link>
            );
          })}
        </nav>

        {moduleSections && moduleSections.length > 0 && (
          <div className="app-sidebar-module">
            {!collapsed && (
              <div className="app-sidebar-module-head">
                <span>Seções desta aula</span>
                {moduleProgressLabel && (
                  <span className="app-sidebar-module-pct">{moduleProgressLabel}</span>
                )}
              </div>
            )}
            {moduleProgressPct > 0 && !collapsed && (
              <div className="app-sidebar-module-bar">
                <div className="app-sidebar-module-bar-fill" style={{ width: `${moduleProgressPct}%` }} />
              </div>
            )}
            <div className="app-sidebar-sections">
              {moduleSections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  className={`app-sidebar-section ${sec.active ? 'app-sidebar-section--active' : ''} ${sec.done ? 'app-sidebar-section--done' : ''}`}
                  onClick={sec.onClick}
                  title={sec.title}
                >
                  {sec.done ? (
                    <CheckCircle2 size={14} className="app-sidebar-section-icon" />
                  ) : (
                    <Circle size={14} className="app-sidebar-section-icon" />
                  )}
                  {!collapsed && <span className="app-sidebar-section-title">{sec.title}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="app-sidebar-footer">
          {!collapsed && (
            <div className="app-sidebar-quote">
              <p>“Conhecimento que transforma a prática previdenciária.”</p>
            </div>
          )}
          <div className="app-sidebar-user" title={userEmail ?? undefined}>
            <div className="app-sidebar-avatar">{firstName.charAt(0).toUpperCase()}</div>
            {!collapsed && (
              <div className="app-sidebar-user-meta">
                <span className="app-sidebar-user-name">{firstName}</span>
                {userEmail && <span className="app-sidebar-user-email">{userEmail}</span>}
              </div>
            )}
          </div>
          {onLogout && (
            <button
              type="button"
              className="app-sidebar-logout"
              onClick={onLogout}
              disabled={loggingOut}
              title="Sair"
            >
              {loggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
              {!collapsed && <span>{loggingOut ? 'Saindo...' : 'Sair da conta'}</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
