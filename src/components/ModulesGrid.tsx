import { useEffect, useRef } from 'react';
import { modules } from '../data/modules';
import type { Module } from '../data/modules';
import { Lock, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import type { ComponentType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ModuleStatus = Module['status'];

const statusMeta: Record<ModuleStatus, {
  Icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  style: React.CSSProperties;
  dotColor: string;
}> = {
  liberado: {
    Icon: PlayCircle,
    label: 'Disponível',
    style: { background: 'rgba(201,168,76,0.1)', color: 'var(--gold-600)', border: '1px solid rgba(201,168,76,0.25)' },
    dotColor: 'var(--gold-500)',
  },
  bloqueado: {
    Icon: Lock,
    label: 'Em breve',
    style: { background: 'rgba(99,112,128,0.08)', color: 'var(--text-muted)', border: '1px solid rgba(99,112,128,0.12)' },
    dotColor: '#9BAAB9',
  },
  concluido: {
    Icon: CheckCircle,
    label: 'Concluído',
    style: { background: 'rgba(34,197,94,0.08)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.18)' },
    dotColor: '#22c55e',
  },
};

export default function ModulesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current?.children ?? [],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 82%',
          },
        }
      );

      const cards = gridRef.current?.children ?? [];
      gsap.fromTo(
        cards,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.55, ease: 'power3.out',
          stagger: { amount: 0.6, from: 'start' },
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="modulos" style={{
      padding: 'var(--section-py) 0',
      background: '#F5F7FA',
    }}>
      <div className="section-container">

        {/* Heading */}
        <div ref={headingRef} style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 64px' }}>
          <div className="gold-rule" style={{ justifyContent: 'center', marginBottom: 16, opacity: 0 }}>
            Conteúdo Programático
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
            12 Módulos Estruturados
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#637080', opacity: 0 }}>
            Do básico ao avançado — cada módulo inclui material de apoio, quiz e avaliação de progresso.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          {modules.map((mod) => {
            const meta = statusMeta[mod.status];
            const Icon = meta.Icon;
            const isBlocked = mod.status === 'bloqueado';

            return (
              <div
                key={mod.id}
                style={{
                  opacity: 0,
                  position: 'relative',
                  background: '#FFFFFF',
                  border: '1px solid',
                  borderColor: isBlocked ? '#EEF1F5' : 'rgba(201,168,76,0.2)',
                  borderRadius: 8,
                  padding: '24px 26px',
                  cursor: isBlocked ? 'default' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  filter: isBlocked ? 'none' : undefined,
                }}
                onMouseEnter={(e) => {
                  if (isBlocked) return;
                  gsap.to(e.currentTarget, {
                    y: -4,
                    boxShadow: '0 16px 40px rgba(11,30,56,0.1)',
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                }}
                onMouseLeave={(e) => {
                  if (isBlocked) return;
                  gsap.to(e.currentTarget, {
                    y: 0,
                    boxShadow: '0 0 0 rgba(0,0,0,0)',
                    duration: 0.35,
                    ease: 'power2.out',
                  });
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  {/* Module number */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: 28,
                      fontWeight: 400,
                      color: isBlocked ? '#D0D8E4' : 'var(--gold-500)',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                    }}>
                      {String(mod.id).padStart(2, '0')}
                    </span>
                    <Icon
                      size={15}
                      style={{ color: isBlocked ? '#9BAAB9' : 'var(--gold-600)' }}
                    />
                  </div>

                  {/* Status badge */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '3px 10px',
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    ...meta.style,
                  }}>
                    <span style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: meta.dotColor,
                      flexShrink: 0,
                    }} />
                    {meta.label}
                  </span>
                </div>

                {/* Content */}
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isBlocked ? '#9BAAB9' : 'var(--navy-800)',
                  lineHeight: 1.45,
                  marginBottom: 8,
                  letterSpacing: '-0.01em',
                }}>
                  {mod.title}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: isBlocked ? '#C0CAD6' : '#637080',
                  lineHeight: 1.65,
                  marginBottom: 20,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {mod.description}
                </p>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  gap: 20,
                  paddingTop: 16,
                  borderTop: '1px solid',
                  borderColor: isBlocked ? '#F0F3F7' : '#EEF1F5',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#9BAAB9' }}>
                    <Clock size={12} />
                    <span>{mod.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#9BAAB9' }}>
                    <BookOpen size={12} />
                    <span>{mod.lessons} aulas</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
