import { useState, useEffect, useRef } from 'react';
import { faqItems } from '../data/modules';
import { Plus } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BenefitsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current?.children ?? [],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
        }
      );
      gsap.fromTo(
        listRef.current?.children ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: listRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const toggleItem = (index: number) => {
    const isOpening = openIndex !== index;
    const prevIndex = openIndex;

    // Close previous
    if (prevIndex !== null && answerRefs.current[prevIndex]) {
      gsap.to(answerRefs.current[prevIndex], {
        height: 0, opacity: 0, duration: 0.3, ease: 'power2.in',
      });
    }

    setOpenIndex(isOpening ? index : null);

    if (isOpening && answerRefs.current[index]) {
      // First set height to auto to measure it
      const el = answerRefs.current[index]!;
      gsap.set(el, { height: 'auto', opacity: 1 });
      const h = el.offsetHeight;
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: h, opacity: 1, duration: 0.38, ease: 'power2.out' }
      );
    }
  };

  return (
    <section ref={sectionRef} id="faq" style={{
      padding: 'var(--section-py) 0',
      background: '#FFFFFF',
    }}>
      <div className="section-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(40px, 6vw, 96px)',
          alignItems: 'start',
        }}>

          {/* Left — heading */}
          <div ref={headingRef}>
            <div className="gold-rule" style={{ marginBottom: 20, opacity: 0 }}>FAQ</div>
            <h2 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(30px, 4vw, 46px)',
              fontWeight: 400,
              color: 'var(--navy-800)',
              lineHeight: 1.1,
              marginBottom: 20,
              opacity: 0,
            }}>
              Perguntas{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold-600)' }}>
                frequentes
              </em>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#637080', marginBottom: 32, opacity: 0 }}>
              Dúvidas sobre o curso, certificado e plataforma respondidas de forma direta.
            </p>

            <div style={{ opacity: 0 }}>
              <div style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                {[
                  { value: '12', label: 'módulos' },
                  { value: '40h', label: 'de conteúdo' },
                  { value: '100%', label: 'gratuito' },
                ].map((stat) => (
                  <div key={stat.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: 32,
                      fontWeight: 500,
                      color: 'var(--gold-500)',
                      lineHeight: 1,
                    }}>{stat.value}</span>
                    <span style={{ fontSize: 13, color: '#9BAAB9' }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — accordion */}
          <div ref={listRef}>
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  style={{
                    opacity: 0,
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '22px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: 16,
                    }}
                  >
                    <span style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: isOpen ? 'var(--navy-800)' : '#4B5A6E',
                      lineHeight: 1.45,
                      transition: 'color 0.25s',
                      flex: 1,
                    }}>
                      {item.question}
                    </span>

                    {/* Plus/minus icon */}
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: isOpen ? 'var(--gold-500)' : 'var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.3s',
                      background: isOpen ? 'rgba(201,168,76,0.08)' : 'transparent',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}>
                      <Plus size={13} style={{
                        color: isOpen ? 'var(--gold-600)' : '#9BAAB9',
                        transition: 'color 0.25s',
                      }} />
                    </div>
                  </button>

                  <div
                    ref={(el) => { answerRefs.current[index] = el; }}
                    style={{
                      height: 0,
                      overflow: 'hidden',
                      opacity: 0,
                    }}
                  >
                    <p style={{
                      fontSize: 14,
                      lineHeight: 1.8,
                      color: '#637080',
                      paddingBottom: 22,
                    }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
