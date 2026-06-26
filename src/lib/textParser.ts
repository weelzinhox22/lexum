/**
 * textParser.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Utilitário puro (zero dependências React) que transforma texto bruto dos
 * módulos Lexum em um array tipado de tokens prontos para renderização.
 *
 * Por que um utilitário separado?
 * • Testável em isolamento (Jest/Vitest sem JSDOM)
 * • Reutilizável fora do React (ex: geração de PDF, e-mail, SSR)
 * • Separação clara de responsabilidades (parse ≠ render)
 *
 * Padrões reconhecidos (em ordem de prioridade):
 *  1. Bloco de mapa mental  → "- **Título** → texto de resumo"
 *  2. Lista com seta inline → "- → item" ou "-→item" (variações)
 *  3. Seção com seta inline em parágrafo misto (título + itens)
 *  4. Fallback → parágrafo de texto rico (negrito, lei, etc.)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Token types ───────────────────────────────────────────────────────────────

export type TokenType =
  | 'paragraph'
  | 'arrow-list'      // lista pura "- → item"
  | 'map-section'     // "- **Título** → resumo" (mapa mental)
  | 'titled-list';    // "Título\n- → item1\n- → item2"

export interface ParagraphToken {
  type: 'paragraph';
  raw: string;
}

export interface ArrowListToken {
  type: 'arrow-list';
  items: string[];
}

export interface MapSectionToken {
  type: 'map-section';
  entries: Array<{ label: string; summary: string }>;
}

export interface TitledListToken {
  type: 'titled-list';
  title: string;
  items: string[];
}

export type ParseToken =
  | ParagraphToken
  | ArrowListToken
  | MapSectionToken
  | TitledListToken;

// ── Regexes ───────────────────────────────────────────────────────────────────

/**
 * Detecta linha do tipo: - **Rótulo** → texto
 * Captura: [1] rótulo, [2] texto após a seta
 *
 * Variações suportadas:
 *   - **Regra geral** → o que a lei diz
 *   - **Exceções**→hipóteses especiais    (sem espaço)
 *   -  **Prazo** →  decadência            (múltiplos espaços)
 */
const MAP_LINE_RE = /^-\s+\*\*([^*]+)\*\*\s*→\s*(.+)$/;

/**
 * Detecta linha do tipo: - → item  |  -→item  |  -  → item
 * Captura: [1] texto do item (sem a seta e o traço)
 */
const ARROW_ITEM_RE = /^-\s*→\s*(.+)$/;

/**
 * Detecta se UMA linha inteira é de mapa mental (- **X** → y)
 * usado para decidir o tipo do bloco inteiro.
 */
function isMapLine(line: string): boolean {
  return MAP_LINE_RE.test(line.trim());
}

/**
 * Detecta se UMA linha é item de seta simples (- → texto)
 */
function isArrowLine(line: string): boolean {
  return ARROW_ITEM_RE.test(line.trim());
}

// ── Normalização de entrada ───────────────────────────────────────────────────

/**
 * Normaliza variações tipográficas da seta antes do parsing principal.
 * Garante que "-→" (sem espaço) e "-  →" (espaço duplo) virem "- →".
 */
export function normalizeArrows(raw: string): string {
  return raw
    // Normaliza "\r\n" → "\n"
    .replace(/\r\n/g, '\n')
    // Remove possíveis espaços entre "-" e "→" para forma canônica
    .replace(/^(-)\s*(→)/gm, '$1 $2')
    // Variante com traço duplo "--→"
    .replace(/^--\s*→/gm, '- →');
}

// ── Parser principal ──────────────────────────────────────────────────────────

/**
 * Converte um bloco de texto (parágrafo já separado por \n\n) em um token.
 */
function parseBlock(block: string): ParseToken {
  const lines = block.split('\n').map(l => l.trimEnd()).filter(Boolean);

  if (lines.length === 0) {
    return { type: 'paragraph', raw: block };
  }

  // ── Caso 1: Mapa mental — todas as linhas são "- **X** → y" ──
  if (lines.every(isMapLine)) {
    const entries = lines.map(line => {
      const m = line.trim().match(MAP_LINE_RE)!;
      return { label: m[1].trim(), summary: m[2].trim() };
    });
    return { type: 'map-section', entries };
  }

  // ── Caso 2: Lista pura de setas — todas as linhas são "- → item" ──
  if (lines.every(isArrowLine)) {
    const items = lines.map(l => {
      const m = l.trim().match(ARROW_ITEM_RE)!;
      return m[1].trim();
    });
    return { type: 'arrow-list', items };
  }

  // ── Caso 3: Bloco misto — primeira linha é título, restantes são setas ──
  // Exemplo:
  //   Mapa mental rápido
  //   - → Regra geral
  //   - → Exceções
  const [firstLine, ...rest] = lines;
  const restAreArrows = rest.length > 0 && rest.every(isArrowLine);
  if (!isArrowLine(firstLine) && !isMapLine(firstLine) && restAreArrows) {
    const items = rest.map(l => {
      const m = l.trim().match(ARROW_ITEM_RE)!;
      return m[1].trim();
    });
    return { type: 'titled-list', title: firstLine.trim(), items };
  }

  // ── Caso 4: Bloco misto — alguma linha interna tem "→" mas não é pura lista ──
  // Estratégia: se mais de 50% das linhas são de seta → forçar titled-list
  const arrowCount = lines.filter(isArrowLine).length;
  const mapCount = lines.filter(isMapLine).length;

  if (mapCount >= Math.ceil(lines.length / 2) && mapCount === lines.filter(isMapLine).length) {
    // Maioria é mapa mental → trata como map-section parcial
    const entries = lines.filter(isMapLine).map(line => {
      const m = line.trim().match(MAP_LINE_RE)!;
      return { label: m[1].trim(), summary: m[2].trim() };
    });
    if (entries.length > 0) {
      return { type: 'map-section', entries };
    }
  }

  if (arrowCount >= Math.ceil(lines.length / 2)) {
    const title = lines.find(l => !isArrowLine(l))?.trim() ?? '';
    const items = lines.filter(isArrowLine).map(l => {
      const m = l.trim().match(ARROW_ITEM_RE)!;
      return m[1].trim();
    });
    return title
      ? { type: 'titled-list', title, items }
      : { type: 'arrow-list', items };
  }

  // ── Fallback: parágrafo simples ──
  return { type: 'paragraph', raw: block };
}

/**
 * Entry point principal.
 * Recebe o texto completo de uma seção e retorna o array de tokens.
 *
 * @param rawText  Texto bruto vindo do banco/JSON
 * @returns        Array de ParseToken prontos para renderização
 */
export function parseModuleText(rawText: string): ParseToken[] {
  const normalized = normalizeArrows(rawText);

  // Separa em blocos por linha em branco dupla (igual ao renderContent existente)
  const blocks = normalized.split('\n\n').map(b => b.trim()).filter(Boolean);

  return blocks.map(parseBlock);
}

// ── Helpers para testes unitários ────────────────────────────────────────────

/** Retorna true se o texto contém pelo menos um padrão de seta reconhecível */
export function hasArrowPattern(text: string): boolean {
  return /^-\s*→/m.test(normalizeArrows(text));
}
