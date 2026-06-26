import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, User, Building2, Hash, AlertCircle, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { supabase } from '../lib/supabase';

const highlights = [
  '12 módulos de Direito Previdenciário',
  'Quizzes e avaliação final inclusos',
  'Certificado digital de 40 horas',
  'Acesso imediato após o cadastro',
];

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const [universityVal, setUniversityVal] = useState('');
  const [semesterVal, setSemesterVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [passVal, setPassVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const formRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      formRef.current?.children ?? [],
      { opacity: 0, y: 24, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out', stagger: 0.09 }
    );
    tl.fromTo(
      rightRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
      '-=0.5'
    );
  }, []);

  const handleSwitch = () => {
    if (!formRef.current) return;
    setError('');
    setSuccess('');
    gsap.to(formRef.current, {
      opacity: 0, y: 10, filter: 'blur(4px)', duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        setIsLogin((v) => !v);
        gsap.fromTo(
          formRef.current,
          { opacity: 0, y: -10, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }
        );
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: emailVal,
          password: passVal,
        });
        if (signInError) throw signInError;
        navigate('/dashboard');
      } else {
        // Sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email: emailVal,
          password: passVal,
          options: {
            data: {
              full_name: nameVal,
              university: universityVal,
              semester: semesterVal,
            },
          },
        });
        if (signUpError) throw signUpError;
        
        setSuccess('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.';
      // Translate common Supabase errors
      if (msg.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Confirme seu e-mail antes de fazer login.');
      } else if (msg.includes('User already registered')) {
        setError('Este e-mail já está cadastrado. Faça o login.');
      } else if (msg.includes('Password should be at least')) {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#06101C' }}>

      {/* Left — Form Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px)',
        minWidth: 0,
        position: 'relative',
      }}>
        {/* Subtle background orb */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
          <div ref={formRef}>

            {/* Logo */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 52 }}>
              <div style={{
                width: 38,
                height: 38,
                background: 'linear-gradient(135deg, var(--gold-600), var(--gold-400))',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(201,168,76,0.25)',
              }}>
                <span style={{ fontFamily: 'var(--font-editorial)', fontSize: 16, fontWeight: 600, color: '#04101E' }}>SO</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-editorial)', fontSize: 17, fontWeight: 500, color: '#FFFFFF', lineHeight: 1.1 }}>Lexum</div>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-500)' }}>Formação Complementar</div>
              </div>
            </Link>

            {/* Heading */}
            <div style={{ marginBottom: 36 }}>
              <h1 style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(28px, 4vw, 38px)',
                fontWeight: 400,
                color: '#FFFFFF',
                lineHeight: 1.1,
                marginBottom: 10,
              }}>
                {isLogin ? 'Entrar na plataforma' : 'Criar sua conta'}
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(168,180,196,0.8)', lineHeight: 1.6 }}>
                {isLogin
                  ? 'Acesse seu painel de estudos e continue de onde parou.'
                  : 'Cadastre-se gratuitamente e comece sua formação complementar.'}
              </p>
            </div>

            {/* Feedback */}
            {error && (
              <div className="auth-alert auth-alert-error">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="auth-alert auth-alert-success">
                <CheckCircle size={15} />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Name (register only) */}
              {!isLogin && (
                <div>
                  <label className="form-label">Nome completo</label>
                  <div className="input-glass-wrapper">
                    <User size={15} className="input-glass-icon" />
                    <input
                      type="text"
                      className="input-glass"
                      placeholder="Seu nome completo"
                      value={nameVal}
                      onChange={(e) => setNameVal(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* University (register only) */}
              {!isLogin && (
                <div>
                  <label className="form-label">Faculdade / Universidade</label>
                  <div className="input-glass-wrapper">
                    <Building2 size={15} className="input-glass-icon" />
                    <input
                      type="text"
                      className="input-glass"
                      placeholder="Ex.: Universidade Federal do Rio de Janeiro"
                      value={universityVal}
                      onChange={(e) => setUniversityVal(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Semester (register only) */}
              {!isLogin && (
                <div>
                  <label className="form-label">Semestre (opcional)</label>
                  <div className="input-glass-wrapper">
                    <Hash size={15} className="input-glass-icon" />
                    <input
                      type="text"
                      className="input-glass"
                      placeholder="Ex.: 5º semestre"
                      value={semesterVal}
                      onChange={(e) => setSemesterVal(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="form-label">E-mail</label>
                <div className="input-glass-wrapper">
                  <Mail size={15} className="input-glass-icon" />
                  <input
                    type="email"
                    className="input-glass"
                    placeholder="seu@email.com"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="form-label" style={{ margin: 0 }}>Senha</label>
                  {isLogin && (
                    <button
                      type="button"
                      className="forgot-btn"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="input-glass-wrapper" style={{ position: 'relative' }}>
                  <Lock size={15} className="input-glass-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-glass"
                    placeholder={isLogin ? '••••••••' : 'Mínimo 6 caracteres'}
                    value={passVal}
                    onChange={(e) => setPassVal(e.target.value)}
                    required
                    style={{ paddingRight: 48 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    {isLogin ? 'Entrando...' : 'Criando conta...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Entrar na plataforma' : 'Criar conta gratuita'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Switch */}
            <p style={{ marginTop: 28, textAlign: 'center', fontSize: 14, color: 'rgba(168,180,196,0.6)' }}>
              {isLogin ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
              <button onClick={handleSwitch} className="switch-mode-btn">
                {isLogin ? 'Cadastre-se gratuitamente' : 'Fazer login'}
              </button>
            </p>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Link to="/" className="back-link">
                ← Voltar para o início
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Dark Visual Panel */}
      <div
        ref={rightRef}
        style={{
          opacity: 0,
          flex: '0 0 46%',
          display: 'none',
          background: 'linear-gradient(145deg, #040C18 0%, #071525 50%, #0A1E38 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="login-right-panel"
      >
        {/* Background deco */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 70% at 60% 40%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }} />
        <div className="hero-grid" style={{ opacity: 0.5 }} />

        {/* Top light streak */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(48px, 6vw, 80px)',
        }}>
          <div style={{ marginBottom: 48 }}>
            <div className="gold-rule" style={{ marginBottom: 20 }}>
              Lexum
            </div>
            <h2 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(32px, 3.5vw, 50px)',
              fontWeight: 400,
              color: '#FFFFFF',
              lineHeight: 1.08,
              marginBottom: 20,
            }}>
              Comece sua{' '}
              <em style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, var(--gold-300), var(--gold-500))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>jornada</em>
              {' '}no Direito Previdenciário
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(168,180,196,0.8)' }}>
              Acesso imediato ao curso completo com certificado digital de 40 horas.
              100% gratuito, sem cartão de crédito.
            </p>
          </div>

          {/* Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {highlights.map((h) => (
              <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CheckCircle size={13} style={{ color: 'var(--gold-400)' }} />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(168,180,196,0.85)' }}>{h}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            marginTop: 48,
            paddingTop: 40,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            gap: 40,
          }}>
            {[
              { value: '12', label: 'Módulos' },
              { value: '40h', label: 'Certificado' },
              { value: '100%', label: 'Gratuito' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 34,
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, var(--gold-300), var(--gold-500))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  marginBottom: 4,
                }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .login-right-panel { display: flex !important; }
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(168,180,196,0.7);
          margin-bottom: 8px;
        }

        .input-glass-wrapper {
          position: relative;
        }

        .input-glass {
          width: 100%;
          padding: 13px 16px 13px 44px;
          font-family: var(--font-sans);
          font-size: 14px;
          color: #FFFFFF;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          outline: none;
          transition: all 0.25s ease;
          backdrop-filter: blur(8px);
        }
        .input-glass::placeholder { color: rgba(168,180,196,0.4); }
        .input-glass:focus {
          background: rgba(255,255,255,0.08);
          border-color: rgba(201,168,76,0.5);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
        }
        .input-glass:hover:not(:focus) {
          border-color: rgba(255,255,255,0.18);
        }

        .input-glass-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(168,180,196,0.4);
          pointer-events: none;
          transition: color 0.25s;
        }
        .input-glass-wrapper:focus-within .input-glass-icon {
          color: var(--gold-500);
        }

        .password-toggle {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(168,180,196,0.4);
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .password-toggle:hover { color: var(--gold-400); }

        .forgot-btn {
          font-size: 12px;
          color: var(--gold-500);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
          font-weight: 500;
        }
        .forgot-btn:hover { color: var(--gold-300); }

        .btn-auth-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 15px 24px;
          margin-top: 4px;
          background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-400) 100%);
          color: #04101E;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: 0 4px 20px rgba(201,168,76,0.25);
        }
        .btn-auth-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
          transform: translateX(-120%);
          transition: transform 0.7s ease;
        }
        .btn-auth-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 35px rgba(201,168,76,0.4);
          background: linear-gradient(135deg, var(--gold-300) 0%, var(--gold-400) 100%);
        }
        .btn-auth-submit:hover:not(:disabled)::before { transform: translateX(120%); }
        .btn-auth-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-auth-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
          line-height: 1.45;
        }
        .auth-alert-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
        }
        .auth-alert-success {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          color: #4ade80;
        }

        .switch-mode-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: var(--gold-400);
          transition: color 0.2s;
          padding: 0;
        }
        .switch-mode-btn:hover { color: var(--gold-300); }

        .back-link {
          font-size: 13px;
          color: rgba(168,180,196,0.45);
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover { color: rgba(168,180,196,0.8); }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
