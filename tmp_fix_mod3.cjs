const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'modules.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize to LF for processing
content = content.replace(/\r\n/g, '\n');
const origForCRLF = content;
const isCRLF = fs.readFileSync(filePath, 'utf8').includes('\r\n');

// ── 1. Fix moduleSummaries (already done) ──
// Already has id:3 with '6h' and lessons: 7 - verify
const summaryIdx = content.indexOf("    description: 'Conceitos fundamentais de qualidade de segurado, período de graça, carência, perda e manutenção da condição de segurado e regras específicas para concessão de benefícios.'");
if (summaryIdx === -1) {
  console.log('Need to update summary...');
  // Find and update
  const oldSummary = "    description: 'Conceitos fundamentais de qualidade de segurado, período de graça e carência para concessão de benefícios.',\n    duration: '4h',\n    lessons: 2,";
  const newSummary = "    description: 'Conceitos fundamentais de qualidade de segurado, período de graça, carência, perda e manutenção da condição de segurado e regras específicas para concessão de benefícios.',\n    duration: '6h',\n    lessons: 7,";
  if (content.includes(oldSummary)) {
    content = content.replace(oldSummary, newSummary);
    console.log('✅ Updated module summary');
  } else {
    console.log('⚠️ Summary already updated or not found');
  }
} else {
  console.log('✅ Summary already updated');
}

// ── 2. Find the courseModules section ──
const courseModStart = content.indexOf('export const courseModules: CourseModuleData[] = [');
if (courseModStart === -1) {
  console.error('ERROR: Could not find courseModules start');
  process.exit(1);
}

// Find where courseModules array starts (the first { after the = [)
const arrayStart = content.indexOf('{', courseModStart);
// Find where Module 4 starts (find id: 4 after courseModules)
const mod4InCourseModules = content.indexOf('\n    id: 4,\n', courseModStart);
// But this could also find id: 4 in moduleSummaries. Let me search after arrayStart
const mod4Pos = content.indexOf('\n    id: 4,\n    slug', arrayStart);
// Also find the end of the courseModules array
const courseEnd = content.indexOf('];\n\n// Module Progress delegates', arrayStart);

if (mod4Pos === -1 || courseEnd === -1) {
  console.error('ERROR: Could not find module 4 or course end in courseModules');
  process.exit(1);
}

console.log('courseModules array starts at byte:', courseModStart);
console.log('First module object starts at byte:', arrayStart);
console.log('Module 4 starts at byte:', mod4Pos);
console.log('courseModules array ends at byte:', courseEnd);

// Everything from arrayStart to mod4Pos needs to be replaced with:
// Module 1 (original) + Module 2 (expanded) + Module 3 (new expanded)

// Extract Module 1's original content from the first read_files output
// I need to find it from the current file... but it's corrupted!
// So I need to reconstruct from what I know.

// Actually, looking at the current state: the content from arrayStart to mod4Pos 
// is the corrupted Module 1 (with Module 3's new content).
// I need to replace it with: Module 1 + Module 2 + new Module 3

// Module 1 original (from the conversation history):
const mod1Original = `  {
    id: 1,
    slug: 'introducao-ao-direito-previdenciario',
    title: 'Introdução ao Direito Previdenciário',
    description: 'Fundamentos históricos, conceitos básicos, princípios constitucionais, fontes normativas, custeio e organização administrativa da Previdência Social no Brasil.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Histórico da Previdência no Mundo e no Brasil',
        content: \\\`**Origens Internacionais: os Modelos Bismarckiano e Beveridgeano**

A Previdência Social moderna nasceu na Alemanha do século XIX, sob a liderança do chanceler Otto von Bismarck. O objetivo central era conter a mobilização operária e oferecer proteção social mínima por meio do Estado, sem abrir mão da lógica contributiva. Entre 1883 e 1889, Bismarck aprovou as três primeiras peças do seguro social moderno: o Seguro-Doença, o Seguro-Acidentes de Trabalho e o Seguro-Invalidez e Velhice.

Já em 1942, o economista britânico William Beveridge publicou o *Plano Beveridge*, que definiu as bases do Estado de Bem-Estar Social no Reino Unido. Enquanto Bismarck amparava a proteção social em uma relação de trabalho formal e contribuição direta, Beveridge deslocava o centro para a universalidade, o financiamento público e a garantia de um mínimo de sobrevivência.

A comparação entre os dois modelos ajuda a entender o padrão híbrido que o Brasil herdou e reformulou ao longo do século XX:

| Critério de Comparação | Modelo Bismarckiano | Modelo Beveridgeano |
| --- | --- | --- |
| Caráter do seguro | Corporativo, contributivo e vinculado ao trabalho formal | Universalista, público e voltado ao bem-estar social |
| Elegibilidade | Limitada ao trabalhador contribuinte | Expandida a todos os cidadãos, independentemente da ocupação |
| Financiamento | Contribuições de empregados, empregadores e Estado | Impostos gerais e orçamento público |
| Objetivo principal | Manter o status socioeconômico do trabalhador | Garantir mínimo existencial e reduzir a pobreza |

**Atenção:** O Brasil atualiza um desenho híbrido: a Previdência Social conserva forte matriz bismarckiana, enquanto a Saúde e a Assistência Social seguem um viés beveridgeano, com universalidade e acesso não condicionado à contribuição direta.

**Jurisprudência:** O STF reconhece a necessidade de preservar o equilíbrio entre financiamento e proteção social, sobretudo quando mudanças normativas impactam direitos já consolidados. Em revisões e debates sobre transição, o Tribunal enfatiza que a regra previdenciária deve ser interpretada à luz da segurança jurídica e do mínimo existencial.

**Evolução Histórica da Previdência no Brasil**

A proteção social brasileira passou por fases bem delimitadas, respondendo à industrialização, à urbanização e à consolidação do Estado social:

1. **1923 - Lei Eloy Chaves:** marco inicial da Previdência Social brasileira, com as Caixas de Aposentadoria e Pensões (CAPs) para trabalhadores ferroviários.
2. **1930 a 1937 - Era Vargas:** as CAPs foram substituídas pelos Institutos de Aposentadoria e Pensões (IAPs), organizados por categorias profissionais.
3. **1960 - LOPS:** primeira unificação normativa do RGPS, com padrões para direitos, deveres, carências e benefícios.
4. **1966 - INPS:** união dos IAPs em uma única entidade autárquica federal.
5. **1977 - SINPAS:** estruturação do sistema nacional entre INPS, IAPAS, LBA e FUNABEM.
6. **1988 - Constituição Federal:** o conceito de Seguridade Social foi elevado à categoria constitucional.
7. **1990 - INSS:** fusão do INPS com o IAPAS, com responsabilidade pela gestão do RGPS.

**Artigo de Lei:** Art. 194, CF/88, define a Seguridade Social como conjunto integrado de ações voltadas à Saúde, à Previdência e à Assistência Social. A leitura desse dispositivo é essencial para compreender o fundamento constitucional da proteção social no Brasil.\\\`
      },
      {
        id: 2,
        title: 'Conceito e Divisão da Seguridade Social',
        content: \\\`**Conceito Legal e Doutrinário da Seguridade**

O Art. 194 da Constituição Federal define a Seguridade Social como *"um conjunto integrado de ações de iniciativa dos Poderes Públicos e da sociedade, destinadas a assegurar os direitos relativos à Saúde, à Previdência e à Assistência Social"*. Esse artigo inaugura o que a doutrina chama de **tripé da Seguridade**: Saúde, Previdência e Assistência.

A Seguridade Social é, em essência, uma política de proteção contra as contingências sociais e os riscos de vida que afetam a renda, a saúde e a subsistência. A análise do conteúdo jurídico deste tema exige distinguir com precisão os papéis de cada pilar.

| Pilar da Seguridade | Caráter Contributivo | Elegibilidade / Acesso | Financiamento Principal |
| --- | --- | --- | --- |
| **Saúde (SUS)** | Não contributivo | Universal, para toda a população | Impostos gerais e contribuições sociais |
| **Assistência Social (LOAS)** | Não contributivo | Seletivo, condicionado à hipossuficiência | Recursos da União, impostos e contribuições |
| **Previdência Social (INSS)** | Contributivo e obrigatoriamente filiado | Trabalhadores inscritos e contribuintes do RGPS | Contribuições de trabalhadores, empresas e Estado |

**O Princípio da Solidariedade como Base Econômica**

A Previdência Social brasileira opera sob o **Princípio da Solidariedade**, que faz dela um pacto intergeracional entre trabalhadores ativos, aposentados e população em geral. Em vez de uma poupança individual, o sistema funciona por **repartição simples (pay-as-you-go)**, isto é, o trabalho atual financia os benefícios concedidos a quem já está inativo.

**Importante:** Esse desenho explica por que pequenas alterações na arrecadação, na taxa de desemprego ou no envelhecimento populacional podem alterar rapidamente a sustentabilidade atuarial do sistema.

**Gestão Quadripartite da Seguridade Social**

A Constituição assegura que a Seguridade seja administrada sob um regime **quadripartite**, no qual participam, de forma paritária, trabalhadores, empregadores, aposentados e Governo. Esse arranjo reforça o caráter democrático do sistema e evita que a política previdenciária seja controlada por um único interesse corporativo.

**Dica Prática:** Para memorizar o desenho da Seguridade, associe cada pilar ao tipo de risco que ele enfrenta: Saúde protege contra doença; Assistência Social protege contra vulnerabilidade; Previdência Social protege contra perda de renda.

**Artigo de Lei:** Art. 194, VII, CF/88, estabelece o caráter democrático e descentralizado da gestão da Seguridade Social, incluindo a atuação de conselhos e entidades representativas.\\\`
      },
      {
        id: 3,
        title: 'Princípios Constitucionais Previdenciários',
        content: \\\`Os princípios são as vigas mestras do ordenamento previdenciário. Eles orientam a interpretação, a formulação normativa, a análise administrativa do INSS e o controle judicial, funcionando como um roteiro de decisão para o aplicador do Direito.

A doutrina divide os princípios em dois grupos: os **Princípios Expressos da Seguridade** (Art. 194, parágrafo único, CF/88) e os **Princípios Derivados ou Implícitos** que decorrem da estrutura constitucional e do desenho do sistema.

**Princípios Expressos (Constitucionais):**

1. **Universalidade da Cobertura e do Atendimento**
   - Cobertura: o sistema deve abranger os riscos sociais mais relevantes.
   - Atendimento: a proteção deve alcançar a maior quantidade possível de pessoas que vivem no país.

2. **Uniformidade e Equivalência entre Urbano e Rural**
   - A Constituição elimina a discriminação histórica entre trabalhador urbano e rural, preservando apenas as diferenças normativas justificadas pela atividade.

3. **Seletividade e Distributividade**
   - Seletividade: o Estado define prioridades entre as contingências sociais.
   - Distributividade: o sistema deve concentrar proteção nas camadas mais vulneráveis.

4. **Irredutibilidade do Valor dos Benefícios**
   - O benefício não pode ser reduzido por ato administrativo ou normativo, salvo o que a própria Constituição autoriza.

5. **Equidade na Forma de Participação no Custeio**
   - A carga tributária deve seguir a capacidade contributiva: quem pode mais paga mais.

6. **Diversidade da Base de Financiamento**
   - A Seguridade não pode depender exclusivamente da folha salarial.

7. **Caráter Democrático e Descentralizado da Gestão**
   - O sistema se organiza com participação de trabalhadores, empregadores, aposentados e Governo.

**Princípios Derivados ou Implícitos Essenciais:**

8. **Precedência da Fonte de Custeio (Art. 195, § 5º, CF/88)**
   - Nenhum benefício ou serviço pode ser criado, majorado ou estendido sem a correspondente fonte de custeio.

9. **Contrapartida**
   - O acesso ao benefício contributivo pressupõe o recolhimento prévio da contribuição.

10. **Favor Laboratoris**
    - Diante de dúvida na interpretação de normas protetivas, o aplicador deve escolher a opção mais favorável ao segurado.

11. **Vedação ao Retrocesso Social**
    - Direitos sociais conquistados não podem ser retirados de forma arbitrária.

12. **Dignidade da Pessoa Humana (Art. 1º, III, CF/88)**
    - O sistema deve assegurar subsistência mínima e preservação da dignidade.

**STF:** O Supremo Tribunal Federal tem reiterado a centralidade da previsão de custeio na expansão de direitos previdenciários, especialmente quando a alteração normativa pode comprometer a viabilidade financeira do sistema. Essa jurisprudência reforça o papel do art. 195, § 5º, como limite material à criação de novas prestações.

**Atenção:** O princípio da favorabilidade não elimina a exigência de prova suficiente. O segurado deve demonstrar o direito com base na documentação e na interpretação mais adequada ao caso concreto.

**Jurisprudência:** Em matéria previdenciária, os princípios constitucionais não são meramente retóricos; eles operam como parâmetros de decisão e, em muitas situações, funcionam como verdadeiro veto interpretativo contra excessos administrativos ou legislativos.\\\`
      },
      {
        id: 4,
        title: 'Fontes Normativas e Hierarquia do Direito Previdenciário',
        content: \\\`O Direito Previdenciário é um campo de alta volatilidade normativa, porque alterações legislativas, emendas constitucionais e portarias do INSS podem alterar de forma direta o acesso a benefícios, a forma de cálculo e os prazos processuais. Para o advogado, estudar as fontes não é um detalhe técnico; é a base da estratégia.

**Hierarquia das Fontes**

1. **Constituição Federal de 1988**: topo do ordenamento, define os limites materiais da Seguridade Social nos Arts. 194 a 204.
2. **Emendas Constitucionais (EC)**: alteram o texto constitucional; a **EC n.º 103/2019** é o marco central da Reforma da Previdência.
3. **Leis Complementares (LC)**: complementam a Constituição em temas reservados.
4. **Leis Ordinárias Federais**: disciplinam o custeio e os benefícios.
5. **Decretos Executivos**: conferem execução administrativa, como o **RPS (Decreto n.º 3.048/1999)**.
6. **Instruções Normativas e Portarias**: detalham procedimentos internos do INSS.

**Tratados Internacionais e Convenções da OIT**

A previdência social brasileira também se integra a um cenário internacional. A **Convenção 102 da OIT** estabelece parâmetros básicos de proteção social, especialmente em matéria de cobertura mínima, proteção contra velhice, doença e acidentes.

**Direito Adquirido e Expectativa de Direito**

**Direito Adquirido (Art. 5º, XXXVI, CF/88)**
   - Se o segurado preencheu todos os requisitos exigidos antes da mudança normativa, ele passa a ter direito assegurado à regra anterior.

**Expectativa de Direito**
   - Ocorre quando o segurado ainda não completou todos os requisitos antes da mudança normativa.

**Jurisprudência:** O STF tem repetidamente enfatizado que o direito adquirido protege a confiança do contribuinte e a estabilidade da relação jurídica, mesmo quando a norma posterior se mostra mais restritiva.

**Atenção:** Em causas previdenciárias, a documentação e o histórico contributivo no CNIS são decisivos. Um erro na baixa, em uma data de afastamento ou em um período de contribuição pode comprometer a análise e gerar indeferimento.

**Artigo de Lei:** Art. 201, § 4º, CF/88, consagra a irredutibilidade dos benefícios previdenciários contributivos.\\\`
      },
      {
        id: 5,
        title: 'Custeio da Seguridade Social',
        content: \\\`O financiamento da Seguridade Social é uma das áreas em que o Direito Previdenciário se conecta mais diretamente à economia, à gestão pública e à prática advocatícia. No caso do RGPS, o custeio depende de contribuições patronais e do trabalhador, além de uma estrutura complexa de receitas indiretas.

**A Tabela Progressiva de Contribuições do INSS**

A atual estrutura do INSS utiliza **alíquotas progressivas por faixa salarial**, o que significa que o trabalhador paga percentuais diferentes conforme o valor da contribuição base.

| Faixa Salarial de Contribuição | Alíquota Nominal | Cálculo da Faixa |
| --- | --- | --- |
| Até R$ 1.412,00 | 7,5% | R$ 1.412,00 × 7,5% = R$ 105,90 |
| De R$ 1.412,01 até R$ 2.666,68 | 9,0% | (R$ 2.666,68 - R$ 1.412,00) × 9% = R$ 112,92 |
| De R$ 2.666,69 até R$ 4.000,03 | 12,0% | (R$ 4.000,03 - R$ 2.666,68) × 12% = R$ 160,00 |
| De R$ 4.000,04 até R$ 7.786,02 | 14,0% | (R$ 5.000,00 - R$ 4.000,03) × 14% = R$ 139,99 |

**Atenção:** A alíquota progressiva não se aplica da mesma maneira a todos os segurados. Trabalhadores autônomos e facultativos podem estar sujeitos a tabelas fixas ou simplificadas, o que altera o desenho do custeio e pode impactar decisões de planejamento previdenciário.

**Exemplo Prático de Cálculo**

Considere um segurado empregado com salário de contribuição de **R$ 5.000,00**:

1. **Primeira faixa**: R$ 1.412,00 × 7,5% = **R$ 105,90**
2. **Segunda faixa**: (R$ 2.666,68 - R$ 1.412,00) × 9% = **R$ 112,92**
3. **Terceira faixa**: (R$ 4.000,03 - R$ 2.666,68) × 12% = **R$ 160,00**
4. **Quarta faixa**: (R$ 5.000,00 - R$ 4.000,03) × 14% = **R$ 139,99**
5. **Total do trabalhador**: R$ 105,90 + R$ 112,92 + R$ 160,00 + R$ 139,99 = **R$ 518,81**
6. **Alíquota efetiva real**: R$ 518,81 ÷ R$ 5.000,00 = **10,38%**

**Importante:** A alíquota efetiva é inferior à alíquota nominal da última faixa. Esse detalhe é relevante para o advogado que precisa traduzir a legislação para o cliente de forma objetiva e não enganosa.

**Custeio Patronal e a Prática Advocatícia**

As empresas também contribuem para o sistema por meio da **CPP (Contribuição Patronal Previdenciária)**, com base na folha salarial, e do **RAT**, que reflete o risco ambiental da atividade exercida. Na prática, esse conhecimento ajuda o profissional a identificar se a empresa está recolhendo corretamente e a orientar o cliente sobre eventual responsabilidade fiscal.

**Artigo de Lei:** Art. 195, § 5º, CF/88, determina que nenhum benefício ou serviço da Seguridade possa ser criado, majorado ou estendido sem a correspondente fonte de custeio.\\\`
      },
      {
        id: 6,
        title: 'Organização Administrativa e Competência Jurisdicional',
        content: \\\`**A Estrutura do INSS e a Gestão do CNIS**

O **INSS (Instituto Nacional do Seguro Social)** é uma autarquia federal vinculada à área da Previdência Social. Sua atividade se concentra na gestão administrativa do RGPS, na concessão e manutenção de benefícios, na cobrança e no acompanhamento da base de dados do segurado.

O **CNIS (Cadastro Nacional de Informações Sociais)** é o núcleo probatório desse sistema. Nele estão registrados vínculos laborais, períodos de contribuição, salários de contribuição e eventos que podem afetar o direito ao benefício. A análise correta do CNIS é um dos pilares da defesa previdenciária.

**Processo Administrativo Previdenciário (PAP) e CRPS**

O **PAP** é o procedimento administrativo pelo qual o segurado busca o reconhecimento de seu direito, entrando em contato com a agência do INSS a partir da **DER (Data de Entrada do Requerimento)**. Se houver indeferimento, o segurado pode recorrer ao **CRPS (Conselho de Recursos da Previdência Social)**.

O CRPS funciona em dois níveis:

- **Juntas de Recursos (JR)**: julgam os recursos ordinários.
- **Câmaras de Julgamento (CAJ)**: julgam os recursos especiais e revisões em patamar superior.

**Jurisprudência:** O entendimento administrativo e judicial converge para a ideia de que o CNIS e a correta instrução do processo são decisivos para a concessão do benefício. Na prática, uma documentação mal organizada pode transformar um pedido meritoriamente válido em um indeferimento técnico.

**Competência Jurisdicional em Previdenciário Judicial**

1. **Regra geral – Justiça Federal (Art. 109, I, CF/88)**
   - Ações contra o INSS, como benefícios comuns e muitas demandas de aposentadoria, são julgadas pela Justiça Federal.

2. **Exceção – Acidentes de trabalho (Art. 109, I, CF/88)**
   - Benefícios vinculados a acidente de trabalho, invalidez acidentária e doenças profissionais normalmente competem à Justiça Estadual.

3. **Juizados Especiais Federais (JEFs)**
   - Processam disputas até **60 salários mínimos**, com rito mais célere, ausência de preparo inicial e maior acessibilidade ao cidadão.

**Atenção:** A competência é um tema estratégico. Um erro na definição do foro pode gerar prejuízo processual, aumentar custos e retardar a concessão do benefício.

**Artigo de Lei:** Lei n.º 10.259/2001 (JEFs) e Art. 109, I, CF/88 são referências essenciais para quem trabalha com previdência judicial.\\\`
      },
      {
        id: 7,
        title: 'Regimes Próprios (RPPS) e Previdência Complementar',
        content: \\\`Além do RGPS, existem outros regimes previdenciários no Brasil:

**Regime Próprio de Previdência Social (RPPS)**

Destina-se aos servidores públicos titulares de cargos efetivos da União, Estados, Distrito Federal e Municípios. Cada ente federativo pode ter seu próprio RPPS, desde que atenda aos requisitos constitucionais e legais.

Características do RPPS:
- Filiação obrigatória para servidores efetivos
- Contribuições do servidor e do ente público
- Benefícios: aposentadoria, pensão por morte, auxílio-doença, salário-maternidade
- Pode instituir alíquotas complementares para equilibrar o déficit atuarial

**Regime de Previdência Complementar (RPC)**

É um regime facultativo, privado e de adesão voluntária, organizado em:

- **Entidades Fechadas de Previdência Complementar (EFPC)** – Fundos de pensão patrocinados por empresas (ex.: PREVI, Petros, Funcef)
- **Entidades Abertas de Previdência Complementar (EAPC)** – Planos individuais ou coletivos comercializados por bancos e seguradoras (PGBL, VGBL)

A reforma da previdência (EC 103/2019) tornou obrigatória a instituição de regime de previdência complementar para servidores públicos federais, limitando os benefícios do RPPS ao teto do RGPS.\\\`
      }
    ],
    quiz: [
      {
        question: 'Qual a característica fundamental do RGPS quanto à sua filiação?',
        options: [
          'É opcional e sem caráter de custeio',
          'É de filiação obrigatória para quem exerce atividade remunerada',
          'Apenas trabalhadores rurais são obrigados a se filiar',
          'É de filiação facultativa para empregados registrados'
        ],
        correctAnswer: 1,
        explanation: 'O RGPS tem caráter contributivo e filiação obrigatória, o que significa que qualquer pessoa que exerça atividade remunerada legal é automaticamente considerada segurada obrigatória.'
      },
      {
        question: 'Qual o teto máximo do salário de contribuição do RGPS (valor referencial de 2024)?',
        options: [
          'R$ 5.000,00',
          'R$ 7.786,02',
          'R$ 10.000,00',
          'R$ 13.500,00'
        ],
        correctAnswer: 1,
        explanation: 'O teto do RGPS é reajustado anualmente. Em 2024, o valor máximo do salário de contribuição é de R$ 7.786,02, que corresponde ao valor máximo dos benefícios do RGPS.'
      }
    ]
  },
`;

// Module 2 expanded (from conversation - took from the first read_files)
// For Module 2, I can extract it from the current file if it still exists... 
// but it was deleted! So I need to get it from the conversation.

// Actually, I have Module 2 content from the first read_files at the beginning.
// But that's very long to include in a script. Let me take a different approach:
// Extract Module 2 from the original file content I saved in memory.

// WAIT - I have Module 2 saved from the first read_files. Let me use it.
// Actually, I should separate this into a simpler approach. Let me just grep the needed sections.

console.log('This approach was too complex. Let me use a simpler method.');
process.exit(1);
