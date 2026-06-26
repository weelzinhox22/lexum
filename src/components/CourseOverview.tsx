import { useEffect, useRef } from 'react';
import { FileText, Briefcase, Brain, Award, TrendingUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    icon: FileText,
    title: 'Conteúdo Atualizado',
    description: 'Material elaborado com base na legislação vigente, jurisprudência atualizada e reformas previdenciárias recentes.',
  },
  {
    icon: Briefcase,
    title: 'Abordagem Prática',
    description: 'Casos concretos, exemplos reais e simulações de processos administrativos previdenciários.',
  },
  {
    icon: Brain,
    title: 'Quizzes por Módulo',
    description: 'Questões objetivas ao final de cada módulo para fixação do conteúdo e preparação para a avaliação.',
  },
  {
    icon: Award,
    title: 'Certificado Digital',
    description: 'Certificado com código único e QR Code, válido para horas complementares em instituições de ensino.',
  },
];

export default function CourseOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        headingRef.current?.children ?? [],
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
          },
        }
      );

      // Cards stagger
      const cardEls = cardsRef.current?.children ?? [];
      gsap.fromTo(
        cardEls,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 78%',
          },
        }
      );

      // Promo block
      gsap.fromTo(
        promoRef.current,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1, scale: 1,
          duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: promoRef.current,
            start: 'top 82%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="sobre" style={{
      padding: 'var(--section-py) 0',
      background: '#FFFFFF',
    }}>
      <div className="section-container">

        {/* Section Header */}
        <div ref={headingRef} style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 72px' }}>
          <div className="gold-rule" style={{ justifyContent: 'center', marginBottom: 16, opacity: 0 }}>
            Sobre o Curso
          </div>
          <h2 style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 400,
            color: 'var(--navy-800)',
            lineHeight: 1.15,
            marginBottom: 20,
            opacity: 0,
          }}>
            Formação Complementar em{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold-600)' }}>
              Direito Previdenciário
            </em>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#637080', opacity: 0 }}>
            Desenvolvido para estudantes e profissionais que desejam compreender, de forma objetiva
            e aplicada, os fundamentos do Direito Previdenciário. Uma abordagem completa que une teoria e prática.
          </p>
        </div>

        {/* Feature Cards */}
        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginBottom: 64,
          }}
        >
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="card-premium"
                style={{ opacity: 0 }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { y: -6, duration: 0.3, ease: 'power2.out' });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { y: 0, duration: 0.4, ease: 'power2.out' });
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: i === 0 ? 'rgba(201,168,76,0.1)' : 'rgba(11,30,56,0.06)',
                  border: '1px solid',
                  borderColor: i === 0 ? 'rgba(201,168,76,0.2)' : 'rgba(11,30,56,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon size={20} style={{ color: i === 0 ? 'var(--gold-600)' : 'var(--navy-700)' }} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--navy-800)',
                  marginBottom: 10,
                  letterSpacing: '-0.01em',
                }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#637080' }}>
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Banner */}
        <div
          ref={promoRef}
          style={{
            opacity: 0,
            borderRadius: 12,
            overflow: 'hidden',
            background: 'var(--navy-900)',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            padding: 'clamp(32px, 5vw, 56px) clamp(28px, 5vw, 64px)',
            position: 'relative',
            zIndex: 1,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <TrendingUp size={14} style={{ color: 'var(--gold-400)' }} />
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-400)' }}>
                  Investimento
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 'clamp(40px, 6vw, 60px)',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  lineHeight: 1,
                }}>
                  Grátis
                </span>
                <span style={{
                  fontSize: 18,
                  textDecoration: 'line-through',
                  color: 'var(--text-muted)',
                  fontWeight: 300,
                }}>
                  R$ 197
                </span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Bolsa acadêmica de{' '}
                <span style={{ color: 'var(--gold-400)', fontWeight: 600 }}>100%</span>{' '}
                aplicada. Sem taxas ocultas.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['40h de conteúdo estruturado', '12 módulos + avaliação final', 'Certificado com QR Code'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 10, color: 'var(--gold-400)' }}>✓</span>
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
