/**
 * Conteúdo didático complementar por seção (mesclado na exibição do módulo).
 */
const SPECIFIC: Record<string, string> = {
  '1-1': `
**Linha do tempo para memorizar**
Use a sequência CAP → IAP → INPS → INSS → CF/88 como roteiro de revisão para provas e entrevistas.

**Para fixar**
- Qual foi o primeiro marco legal da previdência brasileira?
- Qual a diferença entre modelo bismarckiano e beveridgeano?`,
  '3-2': `
**Exercício prático**
Um cliente com 96 contribuições perdeu a qualidade há 1 ano. Calcule: carência residual, contribuições ainda necessárias e estratégia de reingresso como facultativo.`,
};

export function getDidacticSupplement(moduleId: number, sectionId: number, sectionTitle: string): string {
  const key = `${moduleId}-${sectionId}`;
  const specific = SPECIFIC[key];

  return `${specific ?? ''}

---

**Objetivos de aprendizagem**
Ao concluir esta seção sobre **${sectionTitle}**, você deve ser capaz de:
1. Explicar os conceitos centrais com linguagem técnica adequada à advocacia previdenciária.
2. Identificar a base legal aplicável e citar os dispositivos principais.
3. Aplicar o conteúdo a um caso concreto (orientação ao cliente ou petição).

**Roteiro de estudo sugerido**
| Etapa | Ação | Tempo indicado |
| --- | --- | --- |
| 1 | Leitura atenta do texto e das tabelas | 15–20 min |
| 2 | Anotação dos artigos de lei e súmulas | 5 min |
| 3 | Resolução do quiz do módulo | 10–15 min |
| 4 | Revisão dos erros e consulta à jurisprudência | 10 min |

**Estudo de caso (advocacia prática)**
Imagine que um cliente chega ao escritório com dúvida relacionada a "${sectionTitle}". Liste no caderno:
- Quais documentos pedir na primeira consulta (CTPS, CNIS, PPP, laudos, etc.).
- Quais perguntas fazer para fechar o diagnóstico previdenciário.
- Se o caminho inicial é administrativo (INSS), judicial ou planejamento contributivo.

**Mapa mental rápido**
- **Regra geral** → o que a lei diz
- **Exceções** → hipóteses especiais e dispensas
- **Prova** → como comprovar no INSS ou na Justiça
- **Prazo** → decadência, prescrição e período de graça

**Atenção para provas e concursos**
Este tema é recorrente em OAB, concursos do INSS e TJ/TRF. Priorize tabelas comparativas, prazos numéricos e distinções terminológicas (não confundir carência com tempo de contribuição).

**Dica do professor**
Relacione sempre o instituto estudado aos **três pilares do requerimento**: qualidade de segurado, carência (quando exigida) e fato gerador do benefício. Essa tríade evita indeferimentos por omissão de requisito.

**Checklist do advogado previdenciarista**
- [ ] Conferir CNIS e vínculos antes de qualquer estratégia
- [ ] Verificar período de graça e possível perda de qualidade
- [ ] Simular benefício no Meu INSS quando aplicável
- [ ] Registrar protocolo e prazo de recurso (30 dias no CRPS)

**Bibliografia complementar**
Lei n.º 8.213/1991; Lei n.º 8.212/1991; Decreto n.º 3.048/1999; EC n.º 103/2019; súmulas e temas do STF/STJ sobre o assunto.`;
}

export function mergeSectionContent(
  baseContent: string,
  moduleId: number,
  sectionId: number,
  sectionTitle: string
): string {
  const supplement = getDidacticSupplement(moduleId, sectionId, sectionTitle).trim();
  if (!supplement) return baseContent;
  return `${baseContent.trim()}\n\n${supplement}`;
}
