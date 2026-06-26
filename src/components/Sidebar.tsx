import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Award,
  ShieldCheck,
  Headphones,
  User,
  LogOut,
  GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  userName?: string;
  onLogout?: () => void;
  loggingOut?: boolean;
}

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Meus Módulos', icon: BookOpen, href: '/modules' },
  { label: 'Avaliações', icon: ClipboardCheck, href: '/dashboard#avaliacoes' },
  { label: 'Certificado', icon: Award, href: '/dashboard#certificado' },
  { label: 'Validação', icon: ShieldCheck, href: '/validate' },
  { label: 'Suporte', icon: Headphones, href: '/dashboard#suporte' },
  { label: 'Meu Perfil', icon: User, href: '/dashboard#perfil' },
];

export default function Sidebar({ userName: _userName, onLogout, loggingOut }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href.startsWith('/dashboard#')) return false;
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="sidebar-container">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="sidebar-logo-mark">
          <span className="text-[15px] font-bold font-editorial text-[#07152A]">SO</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold font-editorial text-white leading-tight">
            Lexum
          </span>
          <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#C9A84C] leading-tight mt-0.5">
            Formação Complementar
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`sidebar-nav-item ${active ? 'active' : ''}`}
            >
              <Icon size={18} className="shrink-0 opacity-80" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-4 border-t border-white/5">
        {/* Institutional Card */}
        <div className="sidebar-institutional">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
              <GraduationCap size={14} />
            </div>
            <span className="text-[11px] font-semibold text-[#C9A84C] tracking-wide">Formação</span>
          </div>
          <p className="text-[11px] italic leading-relaxed text-white/50">
            “Conhecimento que faz a diferença.”
          </p>
          <p className="text-[9px] text-white/30 mt-0.5">
            Estude quando quiser, de onde estiver.
          </p>
        </div>

        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="sidebar-logout-btn"
          >
            <LogOut size={14} />
            <span>{loggingOut ? 'Saindo...' : 'Sair'}</span>
          </button>
        )}
      </div>

      <style>{`
        .sidebar-container {
          width: 280px;
          flex-shrink: 0;
          min-height: 100vh;
          background: #07152A;
          display: flex;
          flex-direction: column;
          padding: 24px 18px;
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow-y: auto;
        }

        .sidebar-logo-mark {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #C9A84C, #D4B05A);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(201,168,76,0.3);
          flex-shrink: 0;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(168,180,196,0.65);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: #FFFFFF;
        }

        .sidebar-nav-item.active {
          background: rgba(201,168,76,0.1);
          color: #C9A84C;
          border: 1px solid rgba(201,168,76,0.15);
        }

        .sidebar-nav-item.active svg {
          opacity: 1;
        }

        .sidebar-institutional {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 10px;
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 9px 12px;
          background: none;
          border: 1px solid transparent;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(168,180,196,0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-logout-btn:hover {
          color: #ef4444;
          background: rgba(239,68,68,0.06);
          border-color: rgba(239,68,68,0.12);
        }
      `}</style>
    </aside>
  );
}
