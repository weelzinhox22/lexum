import { useEffect, useRef } from 'react';
import { UserPlus, BookOpen, ClipboardCheck, FileCheck, Percent, Download } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: UserPlus,
    title: 'Crie sua conta',
    description: 'Cadastro gratuito em menos de 2 minutos. Sem cartão de crédito.',
  },
  {
    icon: BookOpen,
    title: 'Estude os módulos',
    description: 'Acesse os 12 módulos com conteúdo teórico e material de apoio complementar.',
  },
  {
    icon: ClipboardCheck,
    title: 'Conclua os quizzes',
    description: 'Questões objetivas ao final de cada módulo para fixação do conteúdo.',
  },
  {
    icon: FileCheck,
    title: 'Faça a avaliação final',
    description: 'Prova abrangendo todo o conteúdo do curso em um único teste.',
  },
  {
    icon: Percent,
    title: 'Atinja 70% de aproveitamento',
    description: 'Nota mínima exigida para emissão do certificado digital.',
  },
  {
    icon: Download,
    title: 'Baixe o certificado',
    description: 'Certificado digital de 40 horas com código único e QR Code incluso.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        headingRef.current?.children ?? [],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
        }
      );

      // Progress line
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, duration: 1.4, ease: 'power2.out',
            scrollTrigger: { trigger: lineRef.current, start: 'top 75%' },
          }
        );
      }

      // Steps
      stepsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, x: i % 2 === 0 ? -24 : 24 },
          {
            opacity: 1, x: 0, duration: 0.65, ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 84%' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="como-obter" style={{
      padding: 'var(--section-py) 0',
      background: '#FFFFFF',
    }}>
      <div className="section-container">

        {/* Heading */}
        <div ref={headingRef} style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 72px' }}>
          <div className="gold-rule" style={{ justifyContent: 'center', marginBottom: 16, opacity: 0 }}>
            Como Funciona
          </div>
          <h2 style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(30px, 4vw, 46px)',
            fontWeight: 400,
            color: 'var(--navy-800)',
            lineHeight: 1.15,
            marginBottom: 18,
            opacity: 0,
          }}>
            Seu caminho até o{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold-600)' }}>certificado</em>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#637080', opacity: 0 }}>
            Seis etapas simples e diretas para conquistar sua formação complementar.
          </p>
        </div>

        {/* Steps — two column layout with center line */}
        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto' }}>

          {/* Center vertical line (desktop) */}
          <div
            ref={lineRef}
            style={{
              display: 'none',
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              background: 'linear-gradient(to bottom, var(--gold-500), rgba(201,168,76,0.1))',
              transform: 'translateX(-50%)',
              opacity: 0.3,
            }}
            className="center-line"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(28px, 4vw, 48px)',
          }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  ref={(el) => { stepsRef.current[index] = el; }}
                  style={{ opacity: 0, display: 'flex', gap: 18, alignItems: 'flex-start' }}
                  onMouseEnter={(e) => {
                    const iconEl = e.currentTarget.querySelector('.step-icon-wrap');
                    if (iconEl) gsap.to(iconEl, { scale: 1.1, duration: 0.25, ease: 'back.out(1.5)' });
                  }}
                  onMouseLeave={(e) => {
                    const iconEl = e.currentTarget.querySelector('.step-icon-wrap');
                    if (iconEl) gsap.to(iconEl, { scale: 1, duration: 0.3, ease: 'power2.out' });
                  }}
                >
                  {/* Icon + Number */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                    <div
                      className="step-icon-wrap"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))',
                        border: '1px solid rgba(201,168,76,0.22)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Icon size={20} style={{ color: 'var(--gold-600)' }} />
                      {/* Step number badge */}
                      <span style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: 'var(--navy-800)',
                        color: '#FFFFFF',
                        fontSize: 9,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        letterSpacing: '0',
                      }}>
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div style={{ paddingTop: 4 }}>
                    <h3 style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--navy-800)',
                      marginBottom: 7,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3,
                    }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.7, color: '#637080' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <div style={{
            display: 'inline-block',
            padding: '20px 40px',
            background: 'var(--navy-950)',
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
            }} />
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4, position: 'relative', zIndex: 1 }}>
              Pronto para começar?
            </p>
            <p style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 22,
              fontWeight: 400,
              color: '#FFFFFF',
              position: 'relative',
              zIndex: 1,
            }}>
              Acesso{' '}
              <span style={{ color: 'var(--gold-400)', fontStyle: 'italic' }}>100% gratuito</span>
              {' '}— sem cadastro com cartão
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .center-line { display: block !important; }
        }
      `}</style>
    </section>
  );
}
