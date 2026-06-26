/**
 * ContentAccordion.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Componente de Accordion premium para a área de conteúdo dos módulos Lexum.
 *
 * Uso básico:
 *   <ContentAccordion items={accordionData} />
 *
 * Uso com item aberto por padrão:
 *   <ContentAccordion items={accordionData} defaultOpenId="regra-geral" />
 *
 * Cada item suporta uma `variant` que define a cor temática do indicador lateral:
 *   - "default"   → azul-navy  (padrão, p/ teoria geral)
 *   - "case"      → âmbar/gold (estudo de caso)
 *   - "rule"      → esmeralda  (regra geral)
 *   - "exception" → rosé       (exceções)
 *   - "tip"       → violeta    (dica prática)
 *   - "warning"   → laranja    (atenção)
 *   - "mind"      → ciano      (mapa mental)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import {
  ChevronDown,
  BookOpen,
  Scale,
  Lightbulb,
  AlertTriangle,
  BrainCircuit,
  Gavel,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

export type AccordionVariant =
  | 'default'
  | 'case'
  | 'rule'
  | 'exception'
  | 'tip'
  | 'warning'
  | 'mind';

export interface AccordionListItem {
  text: ReactNode;
  /** Sub-itens aninhados (opcional) */
  children?: AccordionListItem[];
}

export interface AccordionItem {
  id: string;
  title: string;
  variant?: AccordionVariant;
  /** Ícone customizado. Se omitido, usa o padrão da variant. */
  icon?: ReactNode;
  /** Parágrafo de introdução antes da lista (opcional) */
  intro?: ReactNode;
  /** Itens da lista elegante com ChevronRight como marcador */
  listItems?: AccordionListItem[];
  /** Conteúdo React livre (substitui intro + listItems se fornecido) */
  children?: ReactNode;
}

export interface ContentAccordionProps {
  items: AccordionItem[];
  /** ID do item aberto por padrão. Se não fornecido, todos começam fechados. */
  defaultOpenId?: string;
  /** Se true, só um item pode estar aberto por vez (comportamento exclusivo). */
  exclusive?: boolean;
  className?: string;
}

// ── Variant config ────────────────────────────────────────────────────────────

interface VariantConfig {
  /** Cor da borda lateral esquerda e do ícone */
  accent: string;
  /** Cor de fundo suave do conteúdo expandido */
  bg: string;
  /** Cor de fundo do badge do ícone no header */
  iconBg: string;
  /** Cor do ícone */
  iconColor: string;
  /** Cor do texto do título */
  titleColor: string;
  /** Ícone padrão da variant */
  DefaultIcon: React.ComponentType<{ size?: number; className?: string }>;
}

const VARIANT_MAP: Record<AccordionVariant, VariantConfig> = {
  default: {
    accent: '#0B1E38',
    bg: '#F5F7FA',
    iconBg: '#EEF1F7',
    iconColor: '#0B1E38',
    titleColor: '#0B1E38',
    DefaultIcon: BookOpen,
  },
  case: {
    accent: '#C9A84C',
    bg: '#FEFBF0',
    iconBg: '#FDF5D9',
    iconColor: '#A8893A',
    titleColor: '#7A5E1A',
    DefaultIcon: Gavel,
  },
  rule: {
    accent: '#16A34A',
    bg: '#F0FDF4',
    iconBg: '#DCFCE7',
    iconColor: '#15803D',
    titleColor: '#14532D',
    DefaultIcon: Scale,
  },
  exception: {
    accent: '#E11D48',
    bg: '#FFF1F2',
    iconBg: '#FFE4E6',
    iconColor: '#BE123C',
    titleColor: '#881337',
    DefaultIcon: AlertTriangle,
  },
  tip: {
    accent: '#7C3AED',
    bg: '#F5F3FF',
    iconBg: '#EDE9FE',
    iconColor: '#6D28D9',
    titleColor: '#4C1D95',
    DefaultIcon: Lightbulb,
  },
  warning: {
    accent: '#EA580C',
    bg: '#FFF7ED',
    iconBg: '#FFEDD5',
    iconColor: '#C2410C',
    titleColor: '#7C2D12',
    DefaultIcon: ShieldCheck,
  },
  mind: {
    accent: '#0891B2',
    bg: '#ECFEFF',
    iconBg: '#CFFAFE',
    iconColor: '#0E7490',
    titleColor: '#164E63',
    DefaultIcon: BrainCircuit,
  },
};

// ── AccordionItemPanel ─────────────────────────────────────────────────────────

interface PanelProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItemPanel({ item, isOpen, onToggle }: PanelProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const variant = item.variant ?? 'default';
  const cfg = VARIANT_MAP[variant];
  const Icon = item.icon ? null : cfg.DefaultIcon;

  // Smooth height animation via JS (native CSS grid trick: 0fr → 1fr)
  // Usamos max-height para compatibilidade ampla sem Framer Motion
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!bodyRef.current) return;
    if (isOpen) {
      // Allow natural height, then capture it
      bodyRef.current.style.display = 'block';
      const natural = bodyRef.current.scrollHeight;
      setHeight(natural);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      className="ca-panel"
      style={{
        borderRadius: 12,
        border: `1px solid ${isOpen ? cfg.accent + '33' : '#E8ECF2'}`,
        overflow: 'hidden',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        boxShadow: isOpen
          ? `0 4px 24px ${cfg.accent}14, 0 1px 4px rgba(0,0,0,0.06)`
          : '0 1px 3px rgba(0,0,0,0.04)',
        background: '#FFFFFF',
      }}
    >
      {/* ── Header ── */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          userSelect: 'none',
          position: 'relative',
        }}
      >
        {/* Accent line left */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: isOpen ? '60%' : '0%',
            borderRadius: '0 3px 3px 0',
            background: cfg.accent,
            transition: 'height 0.3s ease',
          }}
        />

        {/* Icon badge */}
        <span
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 8,
            background: cfg.iconBg,
            color: cfg.iconColor,
            transition: 'background 0.2s ease',
          }}
        >
          {item.icon ?? (Icon && <Icon size={16} />)}
        </span>

        {/* Title */}
        <span
          style={{
            flex: 1,
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: 600,
            color: isOpen ? cfg.titleColor : '#1E293B',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s ease',
            lineHeight: 1.4,
          }}
        >
          {item.title}
        </span>

        {/* Chevron */}
        <span
          style={{
            flexShrink: 0,
            color: isOpen ? cfg.accent : '#94A3B8',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), color 0.2s ease',
            display: 'flex',
          }}
        >
          <ChevronDown size={17} strokeWidth={2.2} />
        </span>
      </button>

      {/* ── Body (animated) ── */}
      <div
        style={{
          maxHeight: height,
          overflow: 'hidden',
          transition: 'max-height 0.38s cubic-bezier(0.165, 0.84, 0.44, 1)',
        }}
      >
        <div
          ref={bodyRef}
          style={{
            borderTop: `1px solid ${cfg.accent}22`,
            borderLeft: `4px solid ${cfg.accent}`,
            background: cfg.bg,
            padding: '18px 22px 20px 20px',
          }}
        >
          {/* Free children override */}
          {item.children ? (
            <div style={{ color: '#1E293B', fontSize: 14, lineHeight: 1.75 }}>
              {item.children}
            </div>
          ) : (
            <>
              {/* Intro paragraph */}
              {item.intro && (
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: '#374151',
                    marginBottom: item.listItems?.length ? 14 : 0,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {item.intro}
                </p>
              )}

              {/* Elegant list */}
              {item.listItems && item.listItems.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {item.listItems.map((li, i) => (
                    <ListItemRow key={i} item={li} accentColor={cfg.accent} />
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ListItemRow (recursive for nested items) ──────────────────────────────────

function ListItemRow({ item, accentColor, depth = 0 }: { item: AccordionListItem; accentColor: string; depth?: number }) {
  return (
    <li>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          paddingLeft: depth * 18,
        }}
      >
        <span
          style={{
            flexShrink: 0,
            marginTop: 3,
            color: accentColor,
            opacity: depth > 0 ? 0.6 : 1,
          }}
        >
          <ChevronRight size={13} strokeWidth={2.5} />
        </span>
        <span
          style={{
            fontSize: 13.5,
            lineHeight: 1.7,
            color: '#374151',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {item.text}
        </span>
      </div>

      {/* Nested children */}
      {item.children && item.children.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {item.children.map((child, ci) => (
            <ListItemRow key={ci} item={child} accentColor={accentColor} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── ContentAccordion (main export) ────────────────────────────────────────────

export default function ContentAccordion({
  items,
  defaultOpenId,
  exclusive = true,
  className = '',
}: ContentAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    defaultOpenId ? new Set([defaultOpenId]) : new Set()
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (exclusive) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {items.map((item) => (
        <AccordionItemPanel
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DE EXEMPLO — dados prontos para testar o componente
// Importe e use em ModulePage ou em qualquer page de preview:
//
//   import ContentAccordion, { MOCK_ACCORDION_DATA } from '../components/ContentAccordion';
//   <ContentAccordion items={MOCK_ACCORDION_DATA} defaultOpenId="estudo-caso" />
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_ACCORDION_DATA: AccordionItem[] = [
  {
    id: 'estudo-caso',
    title: 'Estudo de caso',
    variant: 'case',
    intro: (
      <>
        João, 58 anos, trabalhou como empregado rural por 30 anos e contribuiu regularmente
        para o RGPS. Após o afastamento por incapacidade temporária, deseja requerer a
        aposentadoria por invalidez. Seu representante questiona se o período de carência
        foi cumprido e qual será o valor do benefício.
      </>
    ),
    listItems: [
      {
        text: (
          <>
            <strong>Questão 1 — Carência:</strong> João cumpre os 12 meses de carência exigidos
            pelo art. 25, I, da Lei 8.213/91?
          </>
        ),
      },
      {
        text: (
          <>
            <strong>Questão 2 — Valor:</strong> Como o INSS calcula o salário-de-benefício
            para fins de aposentadoria por invalidez comum?
          </>
        ),
        children: [
          {
            text: 'Média aritmética simples dos 80% maiores salários de contribuição desde julho/1994.',
          },
          {
            text: 'Multiplicada pelo coeficiente de 100% da média, independentemente do tempo de contribuição.',
          },
        ],
      },
      {
        text: (
          <>
            <strong>Questão 3 — Acréscimo de 25%:</strong> João necessita de assistência
            permanente de terceiros? Qual o impacto disso no benefício?
          </>
        ),
      },
      {
        text: (
          <>
            <strong>Questão 4 — Período de espera:</strong> João recebeu auxílio-doença durante
            15 meses. Como esse período influencia a data de início da aposentadoria por invalidez?
          </>
        ),
      },
    ],
  },

  {
    id: 'mapa-mental',
    title: 'Mapa mental rápido',
    variant: 'mind',
    intro: 'Estrutura resumida dos benefícios por incapacidade no RGPS:',
    listItems: [
      {
        text: <><strong>Auxílio-doença (B31/B91)</strong> — incapacidade temporária ≥ 15 dias</>,
        children: [
          { text: 'Carência: 12 meses (exceto acidente ou doenças listadas)' },
          { text: 'Valor: 91% do salário-de-benefício' },
          { text: 'Cessação: alta médica ou conversão em aposentadoria por invalidez' },
        ],
      },
      {
        text: <><strong>Aposentadoria por invalidez (B32)</strong> — incapacidade permanente e total</>,
        children: [
          { text: 'Carência: 12 meses (mesmas exceções do auxílio-doença)' },
          { text: 'Valor: 100% do salário-de-benefício + 25% se precisar de assistência' },
          { text: 'Sujeita a revisões periódicas pelo INSS' },
        ],
      },
      {
        text: <><strong>BPC/LOAS</strong> — não é benefício previdenciário, é assistencial</>,
        children: [
          { text: 'Não exige contribuição prévia' },
          { text: 'Renda familiar per capita ≤ ¼ do salário mínimo' },
          { text: 'Valor: 1 salário mínimo' },
        ],
      },
    ],
  },

  {
    id: 'regra-geral',
    title: 'Regra geral',
    variant: 'rule',
    intro: (
      <>
        A aposentadoria por invalidez é devida ao segurado que, estando ou não em gozo de
        auxílio-doença, for considerado <strong>incapaz e insusceptível de reabilitação</strong>{' '}
        para o exercício de atividade que lhe garanta a subsistência (art. 42, Lei 8.213/91).
      </>
    ),
    listItems: [
      {
        text: (
          <>
            <strong>Art. 42, caput:</strong> incapacidade total e permanente verificada pela perícia médica do INSS.
          </>
        ),
      },
      {
        text: (
          <>
            <strong>Carência (art. 25, I):</strong> 12 contribuições mensais. Dispensada nos casos
            de acidente de qualquer natureza, doenças profissionais e doenças listadas no art. 26, II.
          </>
        ),
      },
      {
        text: (
          <>
            <strong>Data de início do benefício (DIB):</strong> no dia seguinte à cessação
            do auxílio-doença; ou no 16º dia de afastamento, se o segurado não recebeu auxílio-doença.
          </>
        ),
      },
      {
        text: (
          <>
            <strong>Salário-de-benefício:</strong> média aritmética simples dos 80% maiores salários
            de contribuição desde julho/1994, aplicando-se o coeficiente de 100%.
          </>
        ),
      },
    ],
  },

  {
    id: 'excecoes',
    title: 'Exceções e casos especiais',
    variant: 'exception',
    intro: (
      <>
        Hipóteses em que as regras gerais da aposentadoria por invalidez são <strong>afastadas ou modificadas</strong>:
      </>
    ),
    listItems: [
      {
        text: (
          <>
            <strong>Acréscimo de 25% (art. 45):</strong> devido quando o segurado necessitar de
            assistência permanente de outra pessoa, conforme relação do Anexo I do Decreto 3.048/99.
            O acréscimo <em>não se incorpora</em> ao salário para fins de cálculo de outros benefícios.
          </>
        ),
      },
      {
        text: (
          <>
            <strong>Segurado especial:</strong> não precisa provar carência em meses de contribuição;
            basta comprovar o exercício de atividade rural nos 12 meses anteriores ao requerimento.
          </>
        ),
      },
      {
        text: (
          <>
            <strong>Doença pré-existente:</strong> em regra, não gera direito ao benefício.
            Exceção: se a incapacidade sobreveio de progressão ou agravamento superveniente à filiação.
          </>
        ),
      },
      {
        text: (
          <>
            <strong>Conversão em aposentadoria por idade:</strong> segurado inválido que atingir
            a idade da aposentadoria por idade (STJ, AgRg no AREsp 704.713/SP).
          </>
        ),
      },
    ],
  },
];
