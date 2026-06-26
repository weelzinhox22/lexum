import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  userName: string;
  userEmail: string | null;
}

export default function Topbar({ userName, userEmail }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="topbar-container">
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="min-w-0">
          <h1 className="topbar-course-title">Direito Previdenciário na Prática</h1>
          <p className="topbar-course-subtitle">
            Benefícios, Segurados e Processo Administrativo
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <div className="flex flex-col gap-px">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#9BAAB9]">
              Carga horária
            </span>
            <span className="text-[13px] font-semibold text-[#0B1E38]">
              40 horas
            </span>
          </div>
          <div className="w-px h-7 bg-[#E8ECF2]" />
          <div className="flex flex-col gap-px">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#9BAAB9]">
              Matrícula
            </span>
            <span className="text-[13px] font-semibold text-[#0B1E38]">
              ORY-2026-0001
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button className="topbar-notif-btn">
          <Bell size={18} />
          <span className="topbar-notif-dot" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="topbar-user-btn"
          >
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#0B1E38] to-[#133466] flex items-center justify-center text-[#C9A84C] shrink-0">
              <User size={16} />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[13px] font-semibold text-[#0B1E38] leading-tight">{userName}</span>
              <span className="text-[10px] text-[#9BAAB9] leading-tight truncate max-w-[140px]">{userEmail || ''}</span>
            </div>
            <ChevronDown size={14} className="text-[#9BAAB9]" />
          </button>

          {dropdownOpen && (
            <div className="topbar-dropdown">
              <button
                onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}
                className="topbar-dropdown-item"
              >
                Dashboard
              </button>
              <button
                onClick={() => { setDropdownOpen(false); navigate('/modules'); }}
                className="topbar-dropdown-item"
              >
                Meus Módulos
              </button>
              <button
                onClick={() => { setDropdownOpen(false); navigate('/validate'); }}
                className="topbar-dropdown-item"
              >
                Validar Certificado
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .topbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          padding: 0 32px;
          background: #FFFFFF;
          border-bottom: 1px solid #E8ECF2;
          width: 100%;
        }

        .topbar-course-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 20px;
          font-weight: 600;
          color: #0B1E38;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .topbar-course-subtitle {
          font-size: 11px;
          color: #9BAAB9;
          margin: 1px 0 0 0;
          font-weight: 500;
        }

        .topbar-notif-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #E8ECF2;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #637080;
          transition: all 0.2s;
        }

        .topbar-notif-btn:hover {
          background: #FFFFFF;
          border-color: #D0D8E4;
          color: #0B1E38;
        }

        .topbar-notif-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #C9A84C;
          border: 1.5px solid #F8FAFC;
        }

        .topbar-user-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px 6px 6px;
          border: 1px solid #E8ECF2;
          border-radius: 8px;
          background: #F8FAFC;
          cursor: pointer;
          transition: all 0.2s;
        }

        .topbar-user-btn:hover {
          background: #FFFFFF;
          border-color: #D0D8E4;
        }

        .topbar-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 200px;
          background: #FFFFFF;
          border: 1px solid #E8ECF2;
          border-radius: 10px;
          box-shadow: 0 12px 40px rgba(11,30,56,0.12);
          padding: 6px;
          z-index: 200;
          animation: dropdownFadeIn 0.15s ease;
        }

        .topbar-dropdown-item {
          display: block;
          width: 100%;
          padding: 10px 14px;
          background: none;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #4B5A6E;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
        }

        .topbar-dropdown-item:hover {
          background: #F8FAFC;
          color: #0B1E38;
        }

        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .topbar-container {
            padding: 0 16px;
          }
          .topbar-course-title {
            font-size: 16px;
          }
        }
      `}</style>
    </header>
  );
}
