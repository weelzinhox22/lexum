import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  Loader2,
  ChevronRight,
  Target,
  User,
  BarChart3,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { gsap } from 'gsap';
import { courseModules } from '../data/modules';
import AppShell from '../components/AppShell';

export default function Profile() {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Aluno');
  const [progressMap, setProgressMap] = useState<Record<number, { status: string; grade?: number }>>({});
  const [createdAt, setCreatedAt] = useState<string>('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setUserEmail(session.user.email ?? null);
        const fullName = session.user.user_metadata?.full_name;
        if (fullName) setUserName(fullName);
        else if (session.user.email) setUserName(session.user.email.split('@')[0]);
        if (session.user.created_at) {
          setCreatedAt(new Date(session.user.created_at).toLocaleDateString('pt-BR', {
            day: 'numeric', month: 'long', year: 'numeric',
          }));
        }
      }
      setAuthChecking(false);
    });
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem('oryon_modules_progress');
    if (saved) { try { setProgressMap(JSON.parse(saved)); } catch {} }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleEditName = () => {
    setEditedName(userName);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) return;
    setSavingName(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: editedName.trim() }
        });
        if (error) {
          console.error('Erro ao atualizar nome:', error.message);
          return;
        }
        setUserName(editedName.trim());
        setIsEditingName(false);
        setEditedName('');
      }
    } catch (err) {
      console.error('Erro inesperado ao atualizar nome:', err);
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  useEffect(() => {
    if (authChecking) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.pf-header', { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
      gsap.fromTo('.pf-card', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.15 });
    }, pageRef);
    return () => ctx.revert();
  }, [authChecking]);

  const total = courseModules.length;
  const completed = courseModules.filter(m => {
    const p = progressMap[m.id];
    return p?.status === 'concluido';
  }).length;
  const pct = Math.round((completed / total) * 100);
  const doneHours = courseModules.filter(m => {
    const p = progressMap[m.id];
    return p?.status === 'concluido';
  }).reduce((a, m) => a + parseInt(m.duration), 0);
  const totalHours = courseModules.reduce((a, m) => a + parseInt(m.duration), 0);
  const withGrades = courseModules.filter(m => progressMap[m.id]?.status === 'concluido' && progressMap[m.id]?.grade !== undefined);
  const avgGrade = withGrades.length > 0
    ? Math.round(withGrades.reduce((a, m) => a + (progressMap[m.id]?.grade || 0), 0) / withGrades.length)
    : 0;



  if (authChecking) {
    return (
      <div className="db-loading">
        <div className="db-loading-inner">
          <div className="db-loading-spinner">
            <Loader2 size={24} className="animate-spin" />
          </div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
                <User size={12} />
                Perfil do Aluno
              </div>
              <h1 className="db-heading">
                {userName}
              </h1>
              <p className="db-subheading">{userEmail}</p>
              {createdAt && (
                <div className="db-meta-info">
                  <Calendar size={14} />
                  <span>Membro desde {createdAt}</span>
                </div>
              )}
            </div>
          </header>

          {/* Stats Row */}
          <div className="db-stats-grid">
            <div className="db-stat db-stat--gold">
              <div className="db-stat-top">
                <div className="db-stat-icon-wrap">
                  <TrendingUp size={16} />
                </div>
                <span className="db-stat-label">Progresso</span>
              </div>
              <div className="db-stat-value">{pct}%</div>
              <div className="db-stat-sub">{completed}/{total} módulos</div>
              <div className="db-stat-bar">
                <div className="db-stat-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="db-stat db-stat--blue">
              <div className="db-stat-top">
                <div className="db-stat-icon-wrap">
                  <BookOpen size={16} />
                </div>
                <span className="db-stat-label">Módulos</span>
              </div>
              <div className="db-stat-value">{completed}</div>
              <div className="db-stat-sub">de {total} concluídos</div>
              <div className="db-stat-bar">
                <div className="db-stat-bar-fill" style={{ width: `${(completed / total) * 100}%` }} />
              </div>
            </div>

            <div className="db-stat db-stat--purple">
              <div className="db-stat-top">
                <div className="db-stat-icon-wrap">
                  <Clock size={16} />
                </div>
                <span className="db-stat-label">Horas</span>
              </div>
              <div className="db-stat-value">{doneHours}h</div>
              <div className="db-stat-sub">de {totalHours}h estudadas</div>
              <div className="db-stat-bar">
                <div className="db-stat-bar-fill" style={{ width: `${(doneHours / totalHours) * 100}%` }} />
              </div>
            </div>

            <div className="db-stat db-stat--green">
              <div className="db-stat-top">
                <div className="db-stat-icon-wrap">
                  <Award size={16} />
                </div>
                <span className="db-stat-label">Média</span>
              </div>
              <div className="db-stat-value">{avgGrade > 0 ? `${avgGrade}%` : '—'}</div>
              <div className="db-stat-sub">nos quizzes</div>
            </div>
          </div>

          {/* Body Grid */}
          <div className="db-main db-body-grid">
            {/* Left: Info */}
            <section className="db-modules-section">
              <div className="db-section-header">
                <div className="db-section-title">
                  <BarChart3 size={16} />
                  Informações da Conta
                </div>
              </div>

              <div className="db-modules-list">
                <div className="db-module-row db-module-row--done">
                  <div className="db-module-num db-module-num--done">
                    <User size={16} />
                  </div>
                  <div className="db-module-info db-module-info--editable">
                    <span className="db-module-title">Nome completo</span>
                    {isEditingName ? (
                      <div className="edit-name-wrap">
                        <input
                          type="text"
                          className="edit-name-input"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') handleCancelName();
                          }}
                          autoFocus
                        />
                        <div className="edit-name-actions">
                          <button className="edit-name-save" onClick={handleSaveName} disabled={savingName}>
                            {savingName ? 'Salvando...' : 'Salvar'}
                          </button>
                          <button className="edit-name-cancel" onClick={handleCancelName} disabled={savingName}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <span className="db-module-meta">
                        {userName}
                        <button className="edit-name-btn" onClick={handleEditName} title="Editar nome">
                          <Pencil size={14} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                <div className="db-module-row db-module-row--done">
                  <div className="db-module-num db-module-num--done">
                    <Calendar size={16} />
                  </div>
                  <div className="db-module-info">
                    <span className="db-module-title">E-mail</span>
                    <span className="db-module-meta">{userEmail}</span>
                  </div>
                </div>

                <div className="db-module-row db-module-row--done">
                  <div className="db-module-num db-module-num--done">
                    <BookOpen size={16} />
                  </div>
                  <div className="db-module-info">
                    <span className="db-module-title">Curso</span>
                    <span className="db-module-meta">Direito Previdenciário na Prática</span>
                  </div>
                </div>

                {createdAt && (
                  <div className="db-module-row db-module-row--done">
                    <div className="db-module-num db-module-num--done">
                      <Calendar size={16} />
                    </div>
                    <div className="db-module-info">
                      <span className="db-module-title">Membro desde</span>
                      <span className="db-module-meta">{createdAt}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Right: Panels */}
            <div className="db-right-col">
              {/* Certificate */}
              <div className={`db-panel ${completed === total ? 'db-panel--cert-ready' : ''}`}>
                <div className="db-panel-header">
                  <Award size={16} className="db-panel-icon" />
                  <span className="db-panel-label">Certificado</span>
                </div>

                {completed === total ? (
                  <div className="db-cert-ready">
                    <div className="db-cert-ready-icon">
                      <CheckCircle2 size={28} />
                    </div>
                    <p className="db-cert-ready-text">Parabéns! Seu certificado está disponível.</p>
                    <Link to="/certificate" className="db-cert-btn">
                      <Award size={14} />
                      Emitir Certificado
                    </Link>
                  </div>
                ) : (
                  <div className="db-cert-pending">
                    <div className="db-cert-progress-ring">
                      <svg viewBox="0 0 64 64" className="db-cert-svg">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="db-cert-track" />
                        <circle
                          cx="32" cy="32" r="28"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
                          strokeLinecap="round"
                          className="db-cert-fill"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                        />
                      </svg>
                      <span className="db-cert-pct">{pct}%</span>
                    </div>
                    <p className="db-cert-pending-text">Complete todos os {total} módulos para emitir seu certificado.</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="db-panel">
                <div className="db-panel-header">
                  <Target size={16} className="db-panel-icon" />
                  <span className="db-panel-label">Ações Rápidas</span>
                </div>
                <div className="db-modules-list">
                  <Link to="/dashboard" className="db-module-row">
                    <div className="db-module-num db-module-num--active">
                      <TrendingUp size={14} />
                    </div>
                    <div className="db-module-info">
                      <span className="db-module-title">Painel de estudos</span>
                    </div>
                    <ChevronRight size={14} className="db-module-arrow" />
                  </Link>

                  <Link to="/modules" className="db-module-row">
                    <div className="db-module-num db-module-num--active">
                      <BookOpen size={14} />
                    </div>
                    <div className="db-module-info">
                      <span className="db-module-title">Ver todos os módulos</span>
                    </div>
                    <ChevronRight size={14} className="db-module-arrow" />
                  </Link>

                  <Link to="/exam" className="db-module-row">
                    <div className="db-module-num db-module-num--active">
                      <Target size={14} />
                    </div>
                    <div className="db-module-info">
                      <span className="db-module-title">Fazer Prova Geral</span>
                    </div>
                    <ChevronRight size={14} className="db-module-arrow" />
                  </Link>

                  <Link to="/validate" className="db-module-row">
                    <div className="db-module-num db-module-num--active">
                      <Award size={14} />
                    </div>
                    <div className="db-module-info">
                      <span className="db-module-title">Validar certificado</span>
                    </div>
                    <ChevronRight size={14} className="db-module-arrow" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>

      <style>{`
        @media (max-width: 640px) {
          .edit-name-wrap {
            width: 100%;
          }
          .edit-name-input {
            font-size: 13px !important;
            padding: 6px 10px !important;
          }
          .edit-name-actions {
            flex-direction: column;
            gap: 6px;
          }
          .edit-name-save,
          .edit-name-cancel {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }

        .db-meta-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          font-size: 13px;
          color: #64748b;
        }

        .db-module-row--done .db-module-title {
          color: #1e293b;
          font-weight: 600;
        }

        .db-module-row--done .db-module-meta {
          color: #475569;
        }

        .db-module-num--done {
          background: linear-gradient(135deg, #C9A84C, #D4B05A);
          color: white;
        }

        .edit-name-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          color: #64748b;
          transition: all 0.2s ease;
          margin-left: 8px;
        }

        .edit-name-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .edit-name-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          background: white;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .edit-name-input:focus {
          border-color: #C9A84C;
        }

        .edit-name-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .edit-name-save {
          padding: 6px 16px;
          background: linear-gradient(135deg, #C9A84C, #D4B05A);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-name-save:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(201, 168, 76, 0.3);
        }

        .edit-name-cancel {
          padding: 6px 16px;
          background: #e2e8f0;
          color: #475569;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-name-cancel:hover {
          background: #cbd5e1;
        }

        .edit-name-cancel:disabled,
        .edit-name-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .db-module-info--editable {
          flex: 1;
        }

        .edit-name-wrap {
          margin-top: 6px;
        }
      `}</style>
    </>
  );
}
