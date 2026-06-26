/**
 * SmartContent.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Componente ultra-reutilizável que transforma texto bruto dos módulos Lexum
 * em HTML semântico e estilizado — sem tocar em nenhum dado do banco.
 *
 * Uso:
 *   <SmartContent text={section.content} />
 *   <SmartContent text={modulo.description} variant="compact" />
 *
 * Integração com renderContent existente:
 *   Substitua o bloco "Detect arrow list" do ModulePage.tsx pela chamada:
 *   <SmartContent text={paragraph} key={pIdx} />
 *
 * Ou use preprocessModuleText() para pré-processar antes de passar ao
 * renderContent existente (zero mudança de estrutura).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { memo, Fragment } from 'react';
import { ChevronRight, Dot } from 'lucide-react';
import { parseModuleText, hasArrowPattern, type ParseToken } from '../lib/textParser';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SmartContentProps {
  /** Texto bruto do módulo (pode conter "- →", "- **X** →", markdown, etc.) */
  text: string;
  /**
   * "full"    → renderiza todos os tipos de token (padrão)
   * "compact" → itens de lista mais compactos (grid cards)
   * "plain"   → apenas texto, sem listas (fallback gracioso)
   */
  variant?: 'full' | 'compact' | 'plain';
  /** Classe CSS extra no wrapper raiz */
  className?: string;
}

// ── Helpers de highlight ──────────────────────────────────────────────────────

/**
 * Regex que captura referências legais (Art., Lei, CF/88, etc.)
 * para realçar com um badge inline.
 */
const LAW_REF_RE =
  /(Art\.\s*\d+(?:\s*,\s*§\s*\d+\s*[ºª]?)?(?:\s*,\s*[IVXLCDM]+)?|CF\/88|Lei\s*(?:nº\s*)?[\d.]+\/\d+|Decreto\s*(?:nº\s*)?[\d.]+\/\d+|EC\s*(?:nº\s*)?[\d]+\/\d+|ADCT)/gi;

/** Inline: realça referências legais e texto em negrito (**texto**) */
function renderRich(raw: string, keyPrefix: string) {
  // 1. Divide por negrito
  const boldParts = raw.split(/(\*\*[^*]+\*\*)/g);

  return boldParts.map((part, bIdx) => {
    const key = `${keyPrefix}-b${bIdx}`;

    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={key} className="font-semibold text-slate-800">
          {renderLawRefs(inner, key)}
        </strong>
      );
    }
    return <Fragment key={key}>{renderLawRefs(part, key)}</Fragment>;
  });
}

/** Realça referências legais com badge amber */
function renderLawRefs(text: string, keyPrefix: string) {
  const parts = text.split(LAW_REF_RE);
  return parts.map((part, i) => {
    if (LAW_REF_RE.test(part)) {
      LAW_REF_RE.lastIndex = 0; // reset stateful regex
      return (
        <span
          key={`${keyPrefix}-law${i}`}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold
                     bg-amber-50 text-amber-700 border border-amber-200 mx-0.5 leading-none align-middle"
        >
          {part}
        </span>
      );
    }
    return <Fragment key={`${keyPrefix}-t${i}`}>{part}</Fragment>;
  });
}

// ── Sub-renderers por tipo de token ───────────────────────────────────────────

interface RendererProps {
  token: ParseToken;
  idx: number;
  compact: boolean;
}

/** Parágrafo de texto rico */
function ParagraphRenderer({ token, idx }: RendererProps) {
  if (token.type !== 'paragraph') return null;
  return (
    <p
      key={idx}
      className="text-sm text-slate-700 leading-relaxed"
    >
      {renderRich(token.raw, `p${idx}`)}
    </p>
  );
}

/** Lista simples: "- → item" */
function ArrowListRenderer({ token, idx, compact }: RendererProps) {
  if (token.type !== 'arrow-list') return null;
  return (
    <ul
      className={`flex flex-col ${compact ? 'gap-1' : 'gap-2'}`}
      role="list"
    >
      {token.items.map((item, i) => (
        <li
          key={`al-${idx}-${i}`}
          className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed"
        >
          {/* Ícone elegante: ChevronRight amber */}
          <ChevronRight
            size={14}
            strokeWidth={2.5}
            className="mt-0.5 shrink-0 text-amber-500"
            aria-hidden
          />
          <span>{renderRich(item, `al${idx}-${i}`)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Mapa mental: "- **Rótulo** → resumo" */
function MapSectionRenderer({ token, idx, compact }: RendererProps) {
  if (token.type !== 'map-section') return null;

  const entries = token.entries;

  if (compact) {
    // Versão compacta: badges inline
    return (
      <div className="flex flex-wrap gap-2">
        {entries.map((entry, i) => (
          <span
            key={`ms-${idx}-${i}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                       bg-navy-50 border border-navy-200 text-navy-800 leading-none"
            style={{ backgroundColor: '#EEF1F7', borderColor: '#C5CDD9', color: '#0B1E38' }}
          >
            <Dot size={12} className="text-amber-500 shrink-0" aria-hidden />
            <span className="font-semibold">{entry.label}</span>
            <span className="opacity-60 mx-0.5">·</span>
            <span className="opacity-80">{entry.summary}</span>
          </span>
        ))}
      </div>
    );
  }

  // Versão full: lista com separador visual
  return (
    <ul className="flex flex-col gap-2.5" role="list">
      {entries.map((entry, i) => (
        <li
          key={`ms-${idx}-${i}`}
          className="flex items-start gap-3 text-sm leading-relaxed"
        >
          {/* Dot decorativo */}
          <span
            aria-hidden
            className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400"
          />
          <span className="text-slate-700">
            <span className="font-semibold text-slate-800">{entry.label}</span>
            <span className="mx-1.5 text-slate-400" aria-hidden>→</span>
            <span>{renderRich(entry.summary, `ms${idx}-${i}`)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Lista com título: "Título\n- → item1\n- → item2" */
function TitledListRenderer({ token, idx, compact }: RendererProps) {
  if (token.type !== 'titled-list') return null;
  return (
    <div className="flex flex-col gap-2">
      {/* Título da seção */}
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">
        {token.title}
      </p>

      {/* Lista de itens */}
      <ul className={`flex flex-col ${compact ? 'gap-1' : 'gap-2'}`} role="list">
        {token.items.map((item, i) => (
          <li
            key={`tl-${idx}-${i}`}
            className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed"
          >
            <ChevronRight
              size={14}
              strokeWidth={2.5}
              className="mt-0.5 shrink-0 text-amber-500"
              aria-hidden
            />
            <span>{renderRich(item, `tl${idx}-${i}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── SmartContent ──────────────────────────────────────────────────────────────

/**
 * Componente principal.
 * Usa React.memo para evitar re-renders desnecessários quando o texto não muda.
 */
const SmartContent = memo(function SmartContent({
  text,
  variant = 'full',
  className = '',
}: SmartContentProps) {
  // Se não há nenhum padrão de seta → renderizar como parágrafo simples (fast path)
  if (variant === 'plain' || !hasArrowPattern(text)) {
    return (
      <div className={`text-sm text-slate-700 leading-relaxed ${className}`}>
        {renderRich(text, 'plain')}
      </div>
    );
  }

  const tokens = parseModuleText(text);
  const compact = variant === 'compact';

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {tokens.map((token, idx) => {
        const props: RendererProps = { token, idx, compact };

        switch (token.type) {
          case 'arrow-list':
            return <ArrowListRenderer key={idx} {...props} />;
          case 'map-section':
            return <MapSectionRenderer key={idx} {...props} />;
          case 'titled-list':
            return <TitledListRenderer key={idx} {...props} />;
          case 'paragraph':
          default:
            return <ParagraphRenderer key={idx} {...props} />;
        }
      })}
    </div>
  );
});

export default SmartContent;

// ─────────────────────────────────────────────────────────────────────────────
// preprocessModuleText()
// ─────────────────────────────────────────────────────────────────────────────
// Hook de integração com o renderContent() EXISTENTE no ModulePage.tsx.
//
// Em vez de refatorar todo o renderContent, basta chamar essa função
// ANTES de passar o texto para ele. Ela normaliza as setas e converte
// "- **X** → y" para o formato de dash list que o renderContent já entende.
//
// Uso no ModulePage.tsx, dentro do loop de sections:
//
//   renderContent(
//     preprocessModuleText(
//       mergeSectionContent(section.content, moduleData.id, section.id, section.title)
//     )
//   )
//
// Isso garante compatibilidade 100% com o parser existente sem quebrar nada.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pré-processa o texto de uma seção antes de passá-lo ao renderContent existente.
 *
 * Transforma:
 *   "- **Regra geral** → o que a lei diz"
 * Em:
 *   "- **Regra geral:** o que a lei diz"
 *
 * E:
 *   "- → item simples"
 * permanece como:
 *   "- item simples"  (o renderContent já lida com "- " via lp-list--dash)
 */
export function preprocessModuleText(rawText: string): string {
  return rawText
    // Normaliza quebras de linha
    .replace(/\r\n/g, '\n')
    // Normaliza variações de espaço em torno de "→"
    .replace(/^(-)\s*(→)/gm, '$1 $2')
    // "- **Rótulo** → resumo"  →  "- **Rótulo:** resumo" (compatível com lp-subsection)
    .replace(/^-\s+(\*\*[^*]+\*\*)\s*→\s*(.+)$/gm, '- $1: $2')
    // "- → item"  →  "- item" (lista dash padrão)
    .replace(/^-\s+→\s*(.+)$/gm, '- $1');
}
