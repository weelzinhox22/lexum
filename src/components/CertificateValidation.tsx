import { useEffect, useRef } from 'react';
import { Shield, QrCode, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const validationSteps = [
  'Insira o código do certificado',
  'Sistema verifica a autenticidade',
  'Dados do aluno são exibidos',
  'Certificado confirmado com sucesso',
];

export default function CertificateValidation() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current?.children ?? [],
        { opacity: 0, x: -32 },
        {
          opacity: 1, x: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: leftRef.current, start: 'top 78%' },
        }
      );
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: rightRef.current, start: 'top 78%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="certificado" style={{
      padding: 'var(--section-py) 0',
      background: '#F5F7FA',
    }}>
      <div className="section-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
        }}>

          {/* Left */}
          <div ref={leftRef} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="gold-rule" style={{ opacity: 0 }}>Validação</div>

            <h2 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(30px, 4vw, 48px)',
              fontWeight: 400,
              color: 'var(--navy-800)',
              lineHeight: 1.1,
              opacity: 0,
            }}>
              Certificados com{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold-600)' }}>
                verificação online
              </em>
            </h2>

            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#637080', opacity: 0 }}>
              Todo certificado emitido pela <strong style={{ color: 'var(--navy-800)', fontWeight: 600 }}>Lexum</strong> possui
              um código único e um QR Code que permitem validação instantânea por qualquer
              instituição de ensino ou empregador.
            </p>

            {/* Features */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: '24px',
              background: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 8,
              opacity: 0,
            }}>
              {[
                { icon: <Shield size={16} />, text: 'Código único de validação por certificado' },
                { icon: <QrCode size={16} />, text: 'QR Code impresso no próprio documento' },
                { icon: <CheckCircle size={16} />, text: 'Verificação instantânea em qualquer dispositivo' },
              ].map((item) => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: 'var(--gold-600)', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: '#4B5A6E' }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Example code */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 20px',
              background: 'rgba(201,168,76,0.05)',
              border: '1px solid rgba(201,168,76,0.18)',
              borderRadius: 8,
              opacity: 0,
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'rgba(201,168,76,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: 'var(--gold-600)' }}>Ex</span>
              </div>
              <div>
                <p style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: 'var(--navy-800)', letterSpacing: '0.06em' }}>
                  ORY-2026-0001
                </p>
                <p style={{ fontSize: 12, color: '#9BAAB9', marginTop: 2 }}>
                  Formato do código de certificado
                </p>
              </div>
            </div>

            <div style={{ opacity: 0 }}>
              <Link to="/validate" className="btn-primary" style={{ width: 'fit-content' }}>
                Validar certificado
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right — Validation Card Mockup */}
          <div ref={rightRef} style={{ opacity: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: 360,
              background: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 12,
              padding: '32px',
              boxShadow: '0 20px 60px rgba(11,30,56,0.08)',
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))',
                  border: '1px solid rgba(201,168,76,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Shield size={24} style={{ color: 'var(--gold-600)' }} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 20,
                  fontWeight: 500,
                  color: 'var(--navy-800)',
                  marginBottom: 6,
                }}>
                  Verificação Instantânea
                </h3>
                <p style={{ fontSize: 13, color: '#9BAAB9', lineHeight: 1.55 }}>
                  Valide qualquer certificado Lexum em segundos
                </p>
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {validationSteps.map((step, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                    paddingBottom: i < validationSteps.length - 1 ? 20 : 0,
                    position: 'relative',
                  }}>
                    {/* Line connector */}
                    {i < validationSteps.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: 13,
                        top: 26,
                        width: 1,
                        height: 'calc(100% - 6px)',
                        background: 'linear-gradient(to bottom, rgba(201,168,76,0.3), rgba(201,168,76,0.05))',
                      }} />
                    )}
                    {/* Circle */}
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: i === 3
                        ? 'var(--gold-500)'
                        : 'rgba(201,168,76,0.1)',
                      border: '1px solid',
                      borderColor: i === 3 ? 'var(--gold-400)' : 'rgba(201,168,76,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      zIndex: 1,
                    }}>
                      {i === 3
                        ? <CheckCircle size={13} style={{ color: '#FFFFFF' }} />
                        : <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold-600)' }}>{i + 1}</span>
                      }
                    </div>
                    <p style={{
                      fontSize: 13.5,
                      color: i === 3 ? 'var(--navy-800)' : '#637080',
                      fontWeight: i === 3 ? 600 : 400,
                      lineHeight: 1.5,
                      paddingTop: 3,
                    }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
