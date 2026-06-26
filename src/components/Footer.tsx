import { Link } from 'react-router-dom';
import { Mail, MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';

const navColumns = [
  {
    title: 'Navegação',
    links: [
      { label: 'Início', to: '/' },
      { label: 'Login / Cadastro', to: '/login' },
      { label: 'Meus módulos', to: '/modules' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Validar Certificado', to: '/validate' },
    ],
  },
  {
    title: 'Sobre o curso',
    links: [
      { label: 'Conteúdo programático', href: '/#modulos' },
      { label: 'Como funciona', href: '/#como-obter' },
      { label: 'Certificação', href: '/#certificado' },
      { label: 'Perguntas frequentes', href: '/#faq' },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contato" style={{ background: 'var(--navy-950)', color: 'var(--text-primary)' }}>

      {/* Main footer */}
      <div className="section-container" style={{ paddingTop: 'clamp(48px, 6vw, 80px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(40px, 5vw, 64px)',
        }}>

          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 300 }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{
                width: 38,
                height: 38,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 17,
                  fontWeight: 600,
                  color: 'var(--gold-400)',
                  letterSpacing: '-0.02em',
                }}>SO</span>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 17,
                  fontWeight: 500,
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                }}>Lexum</div>
                <div style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-500)',
                }}>Formação Complementar</div>
              </div>
            </Link>

            <p style={{ fontSize: 13.5, lineHeight: 1.75, color: 'var(--text-muted)' }}>
              Plataforma de cursos livres jurídicos para formação complementar de
              estudantes e profissionais do Direito.
            </p>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { Icon: Mail, text: 'contato@lexum.com.br' },
                { Icon: MapPin, text: 'São Paulo, SP' },
                { Icon: ShieldCheck, text: 'CNPJ: 00.000.000/0001-00' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={13} style={{ color: 'var(--gold-600)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h4 style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 20,
              }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {'to' in link ? (
                      <Link
                        to={link.to}
                        style={{
                          fontSize: 14,
                          color: 'var(--text-muted)',
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-400)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={(link as { href: string }).href}
                        style={{
                          fontSize: 14,
                          color: 'var(--text-muted)',
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-400)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Security column */}
          <div>
            <h4 style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: 20,
            }}>
              Segurança
            </h4>
            <p style={{ fontSize: 13.5, lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: 24 }}>
              Certificados com código único e QR Code para validação online. Dados protegidos com criptografia.
            </p>

            {/* SSL badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 6,
            }}>
              <ShieldCheck size={16} style={{ color: 'var(--gold-500)' }} />
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Protegido por</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>SSL 256-bit</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="section-container" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Lexum Formação Complementar. Todos os direitos reservados.
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Termos de Uso', 'Privacidade'].map((label) => (
                <Link
                  key={label}
                  to="/"
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--gold-400)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  {label}
                  <ArrowUpRight size={10} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
