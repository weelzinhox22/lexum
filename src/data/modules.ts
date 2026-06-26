export interface ModuleSummary {
  id: number;
  slug: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  status: 'liberado' | 'bloqueado' | 'concluido';
}

export interface ModuleSection {
  id: number;
  title: string;
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CourseModuleData {
  id: number;
  slug: string;
  title: string;
  description: string;
  duration: string;
  sections: ModuleSection[];
  quiz: QuizQuestion[];
}

// Backward-compatible type alias
export type Module = ModuleSummary;

// Simplified module summary for grid/list display
export const moduleSummaries: ModuleSummary[] = [
  {
    id: 1,
    slug: 'introducao-ao-direito-previdenciario',
    title: 'Introdução ao Direito Previdenciário',
    description: 'Fundamentos históricos, princípios constitucionais, fontes normativas, custeio e organização administrativa da Previdência Social no Brasil.',
    duration: '6h',
    lessons: 6,
    status: 'liberado',
  },
  {
    id: 2,
    slug: 'regime-geral-de-previdencia-social-rgps',
    title: 'Regime Geral de Previdência Social (RGPS)',
    description: 'Conceito, características, estrutura administrativa, financiamento, espécies de segurados, prestações previdenciárias e distinção dos demais regimes.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 3,
    slug: 'qualidade-de-segurado-e-carencia',
    title: 'Qualidade de Segurado e Carência',
    description: 'Conceitos fundamentais de qualidade de segurado, período de graça, carência, perda e manutenção da condição de segurado e regras específicas para concessão de benefícios.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 4,
    slug: 'segurados-e-dependentes',
    title: 'Segurados e Dependentes',
    description: 'Classificação dos segurados obrigatórios e facultativos, dependentes, filiação, inscrição no RGPS e controvérsias práticas.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 5,
    slug: 'beneficios-previdenciarios-visao-geral',
    title: 'Benefícios Previdenciários: Visão Geral',
    description: 'Visão geral dos benefícios administrados pelo INSS, espécies, requisitos genéricos, não acumulação e cálculo.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 6,
    slug: 'aposentadoria-por-idade-e-regras-de-transicao',
    title: 'Aposentadoria por Idade e Regras de Transição',
    description: 'Regras gerais, requisitos urbanos e rurais, cálculo do benefício e regras de transição pós-Reforma da Previdência.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 7,
    slug: 'aposentadoria-especial-e-documentacao',
    title: 'Aposentadoria Especial e Documentação',
    description: 'Agentes nocivos, PPP, LTCAT, comprovação de períodos especiais e requisitos pós-Reforma.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 8,
    slug: 'beneficios-por-incapacidade',
    title: 'Benefícios por Incapacidade',
    description: 'Auxílio por incapacidade temporária, aposentadoria por incapacidade permanente, auxílio-acidente, perícia e judicialização.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 9,
    slug: 'pensao-por-morte-e-auxilio-reclusao',
    title: 'Pensão por Morte e Auxílio-Reclusão',
    description: 'Requisitos, cálculo em cotas, duração do benefício, classes de dependentes e auxílio-reclusão.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 10,
    slug: 'beneficio-de-prestacao-continuada-bpc-loas',
    title: 'Benefício de Prestação Continuada (BPC/LOAS)',
    description: 'Benefício assistencial ao idoso e à pessoa com deficiência, critérios de miserabilidade, processo e judicialização.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 11,
    slug: 'processo-administrativo-previdenciario-pap',
    title: 'Processo Administrativo Previdenciário (PAP)',
    description: 'Fases do PAP junto ao INSS, instrução de provas, recursos no CRPS e relação com a via judicial.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
  {
    id: 12,
    slug: 'revisoes-de-beneficios-e-pratica-advocaticia',
    title: 'Revisões de Benefícios e Prática Advocatícia',
    description: 'Teses de revisão, prazos decadenciais, prática advocatícia previdenciária e simulações.',
    duration: '6h',
    lessons: 7,
    status: 'liberado',
  },
];

import { courseModulesExtended } from './modules-4-12';

// Full module data with text content (material didático) and quizzes
export const courseModules: CourseModuleData[] = [
{
    id: 1,
    slug: 'introducao-ao-direito-previdenciario',
    title: 'Introdução ao Direito Previdenciário',
    description: 'Fundamentos históricos, conceitos básicos, princípios constitucionais, fontes normativas, custeio e organização administrativa da Previdência Social no Brasil.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'História da Previdência no Mundo e no Brasil',
        content: `**Origens Internacionais**

A Previdência Social como política pública de proteção ao trabalhador tem raízes profundas na história social e política mundial. O primeiro sistema de seguro social obrigatório foi criado na Alemanha, sob o chanceler Otto von Bismarck, entre 1883 e 1889.

| Período | Acontecimento | País | Importância |
| --- | --- | --- | --- |
| 1883 | Lei do Seguro-Doença | Alemanha (Bismarck) | Primeiro sistema de seguro social obrigatório |
| 1884 | Lei do Seguro-Acidente | Alemanha | Expansão da proteção ao trabalhador |
| 1889 | Lei do Seguro-Invalidez e Velhice | Alemanha | Consolidação do modelo bismarckiano |
| 1919 | Constituição de Weimar | Alemanha | Previdência como direito social constitucional |
| 1935 | Social Security Act | EUA | Primeiro sistema moderno de seguridade social |
| 1942 | Plano Beveridge | Reino Unido | Novo modelo universalista de proteção social |
| 1948 | Declaração Universal dos Direitos Humanos | ONU | Previdência como direito humano fundamental |

**A Evolução no Brasil**

A previdência brasileira passou por diversas fases:

1. **Período de Assistência Privada (até 1923):** Sociedades de auxílio mútuo e montepios privados organizados por categorias profissionais.

2. **Era das CAPs (1923-1933):** A Lei Eloy Chaves (Decreto-Lei 4.682/1923) criou as Caixas de Aposentadorias e Pensões (CAPs) por empresa. Considerada o marco inicial da previdência social brasileira.

3. **Era dos IAPs (1933-1966):** Os Institutos de Aposentadorias e Pensões (IAPs) substituíram as CAPs, organizados por categoria profissional (IAPC, IAPI, IAPETEC etc.).

4. **Unificação no INPS (1966):** O Decreto-Lei 72/1966 unificou todos os IAPs no Instituto Nacional de Previdência Social (INPS).

5. **Criação do INSS (1990):** Fusão do INPS com o IAPAS, criando o Instituto Nacional do Seguro Social.

6. **Pós-Constituição de 1988:** A CF/88 instituiu o conceito de Seguridade Social (Saúde + Previdência + Assistência).

**Atenção:** A Lei Eloy Chaves (1923) é considerada o marco inicial da previdência social brasileira. Apesar de mais de 100 anos, é um dos pontos mais cobrados em concursos públicos e exames da OAB.

**Dica Prática:** O marco legal da Previdência brasileira não se confunde com a criação do INSS (1990), do INPS (1966) ou da CF/88. O marco zero é a Lei Eloy Chaves, de 1923.

**Artigo de Lei:** Lei Eloy Chaves (Decreto n.º 4.682/1923); Arts. 201 e 202 da Constituição Federal de 1988.`
      },
      {
        id: 2,
        title: 'Princípios Constitucionais da Previdência Social',
        content: `**Fundamentos Constitucionais**

A Constituição Federal de 1988 estabeleceu a Seguridade Social como um conjunto integrado de ações destinadas a assegurar os direitos relativos à saúde, à previdência e à assistência social (Art. 194, CF/88).

**Princípios Constitucionais Específicos**

| Princípio | Descrição | Base Constitucional |
| --- | --- | --- |
| Solidariedade | A previdência é financiada por toda a sociedade, com participação de trabalhadores, empregadores e Estado | Art. 195, CF/88 |
| Universalidade da Cobertura | Todos os trabalhadores devem estar protegidos pelo sistema previdenciário | Art. 194, parágrafo único, I |
| Equidade na Participação | As contribuições devem ser proporcionais à capacidade econômica de cada um | Art. 194, parágrafo único, IV |
| Seletividade e Distributividade | Os benefícios devem ser concedidos conforme a necessidade de cada segurado | Art. 194, parágrafo único, III |
| Irredutibilidade do Valor | O valor dos benefícios não pode ser reduzido nominalmente | Art. 194, parágrafo único, IV |
| Gestão Quadripartite | Participação de trabalhadores, empregadores, aposentados e governo na gestão | Art. 194, parágrafo único, VII |

**Princípios da Previdência Social (Art. 201, CF/88)**

Além dos princípios gerais da Seguridade, a Previdência Social tem princípios próprios:

1. **Filiação Obrigatória:** Todo trabalhador que exerce atividade remunerada é automaticamente filiado ao RGPS, independentemente de vontade.
2. **Caráter Contributivo:** O acesso aos benefícios previdenciários depende de contribuição prévia, diferentemente da Assistência Social.
3. **Preservação do Valor Real:** Os benefícios devem ser reajustados periodicamente para manter o poder de compra.
4. **Cálculo Atuarial:** O sistema deve ser financiado com base em cálculos atuariais que garantam seu equilíbrio financeiro.

**Importante:** A EC 103/2019 (Reforma da Previdência) alterou profundamente o sistema, introduzindo regras de transição e novas formas de cálculo que impactam diretamente os princípios de universalidade e solidariedade.

**Jurisprudência:** O STF, no julgamento das ADIs 6.421 a 6.424, considerou constitucionais as principais alterações da EC 103/2019, reafirmando a necessidade de equilíbrio financeiro e atuarial do sistema previdenciário.

**Dica Prática:** Memorize: Seguridade Social (Art. 194-195) = saúde + previdência + assistência; Previdência Social (Art. 201) = regime geral contributivo; Assistência Social (Art. 203-204) = não contributiva.

**Artigo de Lei:** Arts. 194 e 201 da Constituição Federal de 1988; EC n.º 103/2019.`
      },
      {
        id: 3,
        title: 'Fontes Normativas e Hierarquia das Leis Previdenciárias',
        content: `**O Sistema Normativo Previdenciário**

O Direito Previdenciário brasileiro é regido por um conjunto complexo de normas, organizadas hierarquicamente:

| Nível | Norma | Exemplos |
| --- | --- | --- |
| 1º | Constituição Federal | Arts. 194 a 204 |
| 2º | Emendas Constitucionais | EC 20/98, EC 47/2005, EC 103/2019 |
| 3º | Leis Ordinárias | Lei 8.212/91 (Custeio), Lei 8.213/91 (Benefícios) |
| 4º | Leis Complementares | LC 123/2006 (MEI), LC 150/2015 (Doméstica) |
| 5º | Decretos Regulamentadores | Decreto 3.048/99 (RPS) |
| 6º | Instruções Normativas (INSS) | IN 128/2022 |
| 7º | Portarias e Atos Administrativos | Portarias Interministeriais |

**As Principais Leis Previdenciárias**

**Lei n.º 8.212/1991 (Lei de Custeio):** Dispõe sobre o Plano de Custeio da Previdência Social, estabelecendo alíquotas de contribuição para empregados, empregadores, trabalhadores avulsos e contribuintes individuais.

**Lei n.º 8.213/1991 (Lei de Benefícios):** Dispõe sobre os Planos de Benefícios da Previdência Social, definindo requisitos para concessão de cada benefício, regras de carência, cálculo e manutenção.

**Decreto n.º 3.048/1999 (Regulamento da Previdência Social - RPS):** Consolida e regulamenta as disposições das Leis 8.212/91 e 8.213/91, detalhando procedimentos administrativos e regras operacionais.

**Atenção:** O Decreto 3.048/99 (RPS) é o guia prático mais completo para a atuação do advogado previdenciarista. Sempre consulte a versão mais recente.

**Tratados Internacionais**

O Brasil é signatário de diversos acordos internacionais de previdência social, incluindo acordos bilaterais (Portugal, Japão, Espanha, Itália, Alemanha) e multilaterais (Mercosul, Convenção Ibero-Americana de Seguridade Social), além das Convenções da OIT (Convenção 102 - Normas Mínimas, Convenção 128 - Invalidez, Velhice e Morte).

**Dica Prática:** Os acordos internacionais permitem a soma de períodos de contribuição em diferentes países para fins de carência.

**Artigo de Lei:** Lei n.º 8.212/1991; Lei n.º 8.213/1991; Decreto n.º 3.048/1999; CF/88, Arts. 194-204.`
      },
      {
        id: 4,
        title: 'Custeio da Seguridade Social',
        content: `**Financiamento do Sistema**

A Seguridade Social é financiada por toda a sociedade, de forma direta e indireta, mediante recursos dos orçamentos da União, Estados, DF e Municípios, e das contribuições sociais (Art. 195, CF/88).

**Fontes de Receita da Seguridade Social**

| Fonte | Alíquota | Base Legal |
| --- | --- | --- |
| Contribuição do Empregado | 7,5% a 14% (tabela progressiva) | Art. 20, Lei 8.212/91 |
| Contribuição do Empregador (CPP) | 20% sobre a folha | Art. 22, Lei 8.212/91 |
| RAT (antigo SAT) | 1%, 2% ou 3% (conforme grau de risco) | Art. 22, II, Lei 8.212/91 |
| FAP (Fator Acidentário) | Multiplicador de 0,5 a 2,0 sobre o RAT | Lei 10.666/2003 |
| Contribuição do MEI | 5% do salário mínimo (DAS) | LC 123/2006 |
| Contribuição do Facultativo | 5%, 11% ou 20% | Art. 21, Lei 8.212/91 |
| COFINS | 7,6% (regime não cumulativo) | Art. 195, I, CF/88 |
| CSLL | 9% sobre o lucro | Art. 195, I, CF/88 |
| PIS/PASEP | 1,65% (não cumulativo) | Art. 195, I, CF/88 |
| Concurso de Prognósticos | 100% da receita líquida | Art. 195, III, CF/88 |

**Tabela Progressiva de Contribuição do Segurado Empregado (2024)**

| Salário de Contribuição (R$) | Alíquota |
| --- | --- |
| Até R$ 1.412,00 | 7,5% |
| De R$ 1.412,01 a R$ 2.666,68 | 9% |
| De R$ 2.666,69 a R$ 4.000,03 | 12% |
| De R$ 4.000,04 a R$ 7.786,02 (teto) | 14% |

**Importante:** O RAT é calculado com base na atividade preponderante da empresa e pode ser majorado ou reduzido pelo FAP (Fator Acidentário de Prevenção), que reflete o histórico de acidentes da empresa.

**Salário de Contribuição e Teto do RGPS**

O salário de contribuição é o valor sobre o qual incidem as contribuições previdenciárias. Para o empregado, é a remuneração total recebida, limitada ao teto do RGPS (R$ 7.786,02 em 2024). O piso dos benefícios é de 1 salário mínimo (R$ 1.412,00 em 2024).

**Dica Prática:** O teto do RGPS é atualizado anualmente pelo INSS. Para cálculos de benefícios futuros, utilize o teto vigente na data do requerimento.

**Artigo de Lei:** Art. 195 da CF/88; Arts. 20 a 30 da Lei n.º 8.212/1991.`
      },
      {
        id: 5,
        title: 'Organização Administrativa da Previdência Social',
        content: `**Estrutura Organizacional**

A Previdência Social brasileira é operada por diferentes entidades:

**INSS (Instituto Nacional do Seguro Social)**
Autarquia federal vinculada ao Ministério da Previdência Social, responsável pela concessão e manutenção dos benefícios previdenciários, gestão do CNIS, realização de perícias médicas e operacionalização do processo administrativo.

**Receita Federal do Brasil (RFB)**
Responsável pela arrecadação das contribuições previdenciárias e envio dos dados ao CNIS.

**Conselho de Recursos da Previdência Social (CRPS)**
Órgão colegiado responsável pelo julgamento de recursos administrativos contra decisões do INSS, com três instâncias: Junta de Recursos (1ª), Câmara de Julgamento (2ª) e Conselho Pleno (3ª).

**Ministério da Previdência Social**
Órgão do Poder Executivo responsável pela formulação de políticas públicas previdenciárias.

**Canais de Atendimento ao Segurado**

| Canal | Descrição | Disponibilidade |
| --- | --- | --- |
| Meu INSS (site/aplicativo) | Plataforma digital de serviços | 24 horas |
| Central 135 | Atendimento telefônico | Seg a sáb, 7h às 22h |
| Agências da Previdência Social (APS) | Atendimento presencial | Dias úteis, 7h às 17h |

**O CNIS (Cadastro Nacional de Informações Sociais)**

Principal banco de dados da Previdência Social, contendo vínculos empregatícios, contribuições, períodos de atividade, dados cadastrais e informações sobre benefícios concedidos.

**Atenção:** O CNIS é a principal ferramenta de trabalho do advogado previdenciarista. Divergências no CNIS são uma das causas mais comuns de indeferimento de benefícios. Sempre solicite o CNIS completo do cliente antes de iniciar qualquer planejamento.

**O Processo Administrativo Previdenciário (PAP)**

O requerimento de benefício ao INSS segue o rito: (1) protocolo do pedido, (2) instrução do processo (análise documental, perícia), (3) decisão administrativa, (4) recurso ao CRPS (se indeferido).

**Artigo de Lei:** Lei n.º 8.213/1991; Lei n.º 9.784/1999; Decreto n.º 3.048/1999.`
      },
      {
        id: 6,
        title: 'Regimes Previdenciários no Brasil',
        content: `**Os Três Pilares da Previdência Brasileira**

O sistema previdenciário brasileiro é composto por três regimes distintos:

**1. Regime Geral de Previdência Social (RGPS)**
- Gestão: INSS
- Cobertura: Trabalhadores da iniciativa privada
- Caráter: Contributivo e obrigatório
- Base Legal: Lei 8.212/91 e Lei 8.213/91

**2. Regime Próprio de Previdência Social (RPPS)**
- Gestão: Cada ente federativo
- Cobertura: Servidores públicos titulares de cargos efetivos
- Base Legal: Art. 40 da CF/88; Lei 9.717/98

**3. Regime de Previdência Complementar (RPC)**
- Gestão: Entidades abertas (bancos) ou fechadas (fundos de pensão)
- Cobertura: Adesão facultativa
- Base Legal: Lei Complementar 109/2001 e LC 108/2001

**Comparativo entre os Regimes**

| Aspecto | RGPS | RPPS | RPC |
| --- | --- | --- | --- |
| Natureza | Obrigatório | Obrigatório | Facultativo |
| Gestão | INSS (federal) | Ente federativo | Entidades públicas/privadas |
| Benefício | Teto do RGPS | Integralidade/paridade (antes EC 103) | Conforme capitalização |
| Filiação | Automática | Automática | Por adesão |
| Contribuição | Progressiva (7,5 a 14%) | Conforme lei do ente | Conforme plano |

**A Reforma da Previdência (EC 103/2019)**

Principais mudanças: extinção da aposentadoria por tempo de contribuição (para novos filiados), estabelecimento de idade mínima para aposentadoria programada, alteração da fórmula de cálculo (60% + 2% ao ano), unificação de regras entre RGPS e RPPS, e criação de regras de transição.

**Jurisprudência:** O STF declarou constitucional a maioria dos dispositivos da EC 103/2019, inclusive o novo sistema de cálculo e a exigência de idade mínima (ADIs 6.421 a 6.424).

**Dica Prática:** A distinção entre RGPS, RPPS e RPC é um dos temas mais cobrados na OAB e em concursos. RGPS = INSS (trabalhadores privados), RPPS = servidores públicos efetivos, RPC = previdência complementar (facultativo).

**Artigo de Lei:** Art. 40 e 201 da CF/88; EC n.º 103/2019; Lei Complementar n.º 109/2001.`
      }
    ],
    quiz: [
      {
        question: 'Qual foi o marco inicial da Previdência Social no Brasil?',
        options: [
          'A Constituição Federal de 1988',
          'A Lei Eloy Chaves (Decreto 4.682/1923)',
          'A criação do INSS em 1990',
          'A Consolidação das Leis do Trabalho (CLT) em 1943'
        ],
        correctAnswer: 1,
        explanation: 'A Lei Eloy Chaves, de 24 de janeiro de 1923, é considerada o marco inicial da previdência social brasileira, criando as Caixas de Aposentadorias e Pensões (CAPs).'
      },
      {
        question: 'Qual princípio constitucional da Seguridade Social determina a participação de trabalhadores, empregadores, aposentados e governo na gestão?',
        options: [
          'Universalidade da cobertura',
          'Equidade na participação',
          'Gestão quadripartite',
          'Solidariedade financeira'
        ],
        correctAnswer: 2,
        explanation: 'O princípio da gestão quadripartite (Art. 194, VII, CF/88) estabelece a participação dos trabalhadores, empregadores, aposentados e do governo nos órgãos colegiados.'
      },
      {
        question: 'Qual a principal lei que dispõe sobre os benefícios previdenciários no Brasil?',
        options: [
          'Lei 8.212/1991',
          'Lei 8.213/1991',
          'Decreto 3.048/1999',
          'Lei 9.876/1999'
        ],
        correctAnswer: 1,
        explanation: 'A Lei 8.213/1991 (Lei de Benefícios) é a principal norma que dispõe sobre os Planos de Benefícios da Previdência Social.'
      },
      {
        question: 'Qual o valor do teto do RGPS em 2024?',
        options: [
          'R$ 7.089,26',
          'R$ 7.786,02',
          'R$ 6.433,57',
          'R$ 8.542,13'
        ],
        correctAnswer: 1,
        explanation: 'O teto do RGPS em 2024 é de R$ 7.786,02, sendo este o valor máximo que um benefício do INSS pode pagar.'
      },
      {
        question: 'Qual o regime previdenciário destinado aos servidores públicos titulares de cargos efetivos?',
        options: [
          'RGPS',
          'RPPS',
          'RPC',
          'INSS'
        ],
        correctAnswer: 1,
        explanation: 'O Regime Próprio de Previdência Social (RPPS) é destinado aos servidores públicos titulares de cargos efetivos (Art. 40, CF/88).'
      }
    ]
  },
{
    id: 2,
    slug: 'regime-geral-de-previdencia-social-rgps',
    title: 'Regime Geral de Previdência Social (RGPS)',
    description: 'Conceito, características, estrutura administrativa, financiamento, espécies de segurados, prestações previdenciárias e distinção dos demais regimes.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Conceito, Características e Fundamentos do RGPS',
        content: `**Definição Legal e Doutrinária**

O Regime Geral de Previdência Social (RGPS) é o regime previdenciário básico e obrigatório aplicável a todos os trabalhadores da iniciativa privada, incluindo empregados, empregados domésticos, trabalhadores avulsos, contribuintes individuais, segurados especiais e facultativos.

**Características Essenciais**

| Característica | Descrição |
| --- | --- |
| Natureza | Contributiva e obrigatória |
| Filiação | Automática (decorre do exercício de atividade) |
| Gestão | INSS (Instituto Nacional do Seguro Social) |
| Base Legal | Lei 8.212/91 (Custeio) e Lei 8.213/91 (Benefícios) |
| Teto | Valor máximo do benefício (R$ 7.786,02 em 2024) |
| Piso | Salário mínimo nacional |
| Organização | Sistema de repartição simples (solidariedade entre gerações) |

**Sistema de Repartição Simples**

O RGPS adota o regime financeiro de repartição simples, no qual as contribuições dos trabalhadores ativos financiam os benefícios dos aposentados e pensionistas atuais. Esse modelo baseia-se no pacto intergeracional: cada geração contribui para a geração anterior.

**Atenção:** O sistema de repartição simples é diferente do regime de capitalização individual, adotado pela previdência complementar, onde cada trabalhador acumula recursos em conta individual.

**Distinção: Filiação x Inscrição**

- **Filiação:** Vínculo jurídico automático entre o trabalhador e o RGPS pelo simples exercício de atividade remunerada. Independe de ato formal.
- **Inscrição:** Ato formal de cadastro do segurado junto ao INSS. Para segurados obrigatórios, ocorre com o registro em CTPS; para facultativos, exige solicitação.

**Jurisprudência:** O STJ consolidou que a filiação ao RGPS é automática e decorre do exercício de atividade remunerada, não podendo o INSS negar reconhecimento de vínculo por ausência de inscrição formal (AgInt no AREsp 1.542.369/SP).

**Artigo de Lei:** Art. 201 da Constituição Federal; Art. 11 da Lei n.º 8.213/1991.`
      },
      {
        id: 2,
        title: 'Estrutura Administrativa e Órgãos de Gestão',
        content: `**O INSS na Prática Administrativa**

O INSS é a autarquia federal responsável pela operacionalização do RGPS. Sua estrutura inclui Agências da Previdência Social (APS) para atendimento presencial, Superintendências Regionais, Diretoria de Benefícios e Diretoria de Saúde do Trabalhador.

**O Conselho de Recursos da Previdência Social (CRPS)**

Órgão colegiado responsável pelo julgamento de recursos administrativos:

| Instância | Órgão Julgador | Competência |
| --- | --- | --- |
| 1ª | Junta de Recursos | Julga recursos ordinários contra decisões do INSS |
| 2ª | Câmara de Julgamento | Julga recursos contra decisões da Junta |
| 3ª | Conselho Pleno | Julga recursos especiais e revisões |

**Gestão Quadripartite**

A gestão do RGPS, por determinação constitucional, é quadripartite, com participação de: trabalhadores, empregadores, aposentados/pensionistas e governo.

**O CNIS e a Arrecadação**

O Cadastro Nacional de Informações Sociais (CNIS) é o principal banco de dados do RGPS, mantido pelo INSS em parceria com a Receita Federal do Brasil (RFB), que é responsável pela arrecadação das contribuições.

**Dica Prática:** A RFB é responsável pela arrecadação, enquanto o INSS é responsável pela concessão dos benefícios. Problemas de arrecadação são tratados na RFB; problemas de concessão, no INSS.

**Atenção:** O CNIS é a principal fonte de prova documental no processo administrativo previdenciário. Verifique sempre se os dados do CNIS do cliente estão corretos.

**Artigo de Lei:** Lei n.º 11.457/2007; Decreto n.º 3.048/1999.`
      },
      {
        id: 3,
        title: 'Financiamento e Custeio do RGPS',
        content: `**Fontes de Custeio do RGPS**

O financiamento do RGPS é tripartite, envolvendo contribuições de trabalhadores, empregadores e do Estado.

**Contribuições dos Segurados**

| Categoria | Alíquota | Base de Cálculo |
| --- | --- | --- |
| Empregado (incluído doméstico) | 7,5% a 14% (tabela progressiva) | Remuneração total |
| Trabalhador avulso | 7,5% a 14% (tabela progressiva) | Remuneração total |
| Contribuinte individual | 20% (ou 11% plano simplificado) | Até o teto do RGPS |
| Segurado facultativo | 5%, 11% ou 20% | Até o teto do RGPS |
| Segurado especial | 2,3% sobre a comercialização | Produção rural |

**Tabela Progressiva 2024**

| Faixa Salarial (R$) | Alíquota |
| --- | --- |
| Até R$ 1.412,00 | 7,5% |
| De R$ 1.412,01 a R$ 2.666,68 | 9% |
| De R$ 2.666,69 a R$ 4.000,03 | 12% |
| De R$ 4.000,04 a R$ 7.786,02 | 14% |

**Contribuições dos Empregadores**

| Contribuição | Alíquota | Finalidade |
| --- | --- | --- |
| CPP (Contribuição Patronal) | 20% sobre a folha | Custeio geral |
| RAT (Risco de Acidente) | 1%, 2% ou 3% | Cobertura acidentária |
| FAP (Fator Acidentário) | Multiplicador 0,5 a 2,0 | Incentivo à prevenção |
| Terceiros (SESI, SENAI etc.) | Até 5,8% | Formação profissional |

**Exemplo Prático de Cálculo**

Empregado com salário de R$ 5.000,00 em 2024:
- 1ª faixa: R$ 1.412,00 × 7,5% = R$ 105,90
- 2ª faixa: R$ 1.254,68 × 9% = R$ 112,92
- 3ª faixa: R$ 1.333,35 × 12% = R$ 160,00
- 4ª faixa: R$ 1.000,00 × 14% = R$ 140,00
- **Total: R$ 518,82**

**O Teto do RGPS**

O teto do RGPS em 2024 é de R$ 7.786,02. Contribuições acima do teto não são contabilizadas para cálculo de benefícios.

**Artigo de Lei:** Arts. 20 a 30 da Lei n.º 8.212/1991; Art. 195 da CF/88.`
      },
      {
        id: 4,
        title: 'Espécies de Segurados do RGPS',
        content: `**Classificação dos Segurados**

Os segurados do RGPS dividem-se em segurados obrigatórios e facultativos.

**Segurados Obrigatórios (Art. 11, Lei 8.213/91)**

| Categoria | Descrição | Exemplos |
| --- | --- | --- |
| **Empregado** | Pessoa física que presta serviço a empresa, com subordinação e habitualidade | Trabalhador com CTPS, diretor empregado, aprendiz |
| **Empregado Doméstico** | Serviços contínuos a pessoa/família no âmbito residencial | Empregada doméstica, cuidador, caseiro |
| **Contribuinte Individual** | Atividade econômica por conta própria, sem subordinação | Autônomo, empresário, MEI, motorista de aplicativo |
| **Trabalhador Avulso** | Serviço a diversas empresas com intermediação sindical ou OGMO | Estivador, carregador, ensacador |
| **Segurado Especial** | Produtor rural em regime de economia familiar | Agricultor familiar, pescador artesanal |

**Segurado Facultativo (Art. 14, Lei 8.213/91)**

Pessoa física maior de 16 anos que não exerce atividade remunerada obrigatória, mas opta por contribuir ao RGPS. Exemplos: estudante, dona de casa, desempregado, estagiário não remunerado, bolsista.

**Alíquotas do Facultativo**

| Plano | Alíquota | Direito a Benefícios |
| --- | --- | --- |
| Plano Normal | 20% | Todos os benefícios |
| Plano Simplificado | 11% | Todos, exceto aposentadoria programada |
| Facultativo de Baixa Renda | 5% | Apenas aposentadoria por idade e pensão por morte |

**Perda da Qualidade de Segurado e Período de Graça**

A qualidade de segurado é perdida no dia seguinte ao término do período de graça (Art. 15, Lei 8.213/91):

| Hipótese | Prazo |
| --- | --- |
| Segurado obrigatório que deixa de exercer atividade | 12 meses |
| Segurado com mais de 120 contribuições | 24 meses |
| Segurado desempregado (comprovação) | 36 meses |
| Segurado facultativo | 6 meses |
| Prorrogação máxima (desempregado + 120 contribuições) | Até 48 meses |

**Dica Prática:** A perda da qualidade não anula as contribuições já realizadas. O segurado que readquire a qualidade precisa cumprir metade da carência exigida (Art. 27, Lei 8.213/91).

**Artigo de Lei:** Arts. 11 a 17 da Lei n.º 8.213/1991.`
      },
      {
        id: 5,
        title: 'Prestações Previdenciárias do RGPS',
        content: `**Rol de Benefícios**

O RGPS concede um conjunto amplo de prestações:

| Benefício | Requisito Principal | Carência |
| --- | --- | --- |
| Aposentadoria por Idade | 65 anos (H) / 62 anos (M) | 180 contribuições |
| Aposentadoria por Incapacidade Permanente | Incapacidade total e permanente | 12 contribuições |
| Aposentadoria Especial | Exposição a agentes nocivos (15/20/25 anos) | 180 contribuições |
| Aposentadoria Programada | Tempo de contribuição + idade mínima | 180 contribuições |
| Auxílio por Incapacidade Temporária | Incapacidade temporária > 15 dias | 12 contribuições |
| Auxílio-Acidente | Redução da capacidade laboral | Nenhuma |
| Pensão por Morte | Óbito do segurado | Nenhuma |
| Auxílio-Reclusão | Prisão do segurado de baixa renda | 24 contribuições |
| Salário-Maternidade | Parto, adoção ou guarda judicial | 10 contribuições |
| Salário-Família | Filhos menores de 14 anos | Nenhuma |
| Reabilitação Profissional | Incapacidade para atividade habitual | Nenhuma |

**Regras de Não Acumulação**

| Situação | Pode Acumular? |
| --- | --- |
| Aposentadoria + Pensão por Morte | Sim |
| Aposentadoria + Auxílio-Acidente | Sim |
| Aposentadoria + Salário-Família | Sim |
| Duas aposentadorias do RGPS | Não |
| Pensão por Morte + Auxílio-Reclusão | Sim (mesmo instituidor) |
| Aposentadoria + Auxílio por Incapacidade Temporária | Não |

**Jurisprudência:** O STF, no Tema 999 (RE 1.276.977), reconheceu o direito do segurado à Revisão da Vida Toda, permitindo que o cálculo do benefício considere todas as contribuições, inclusive anteriores a julho/1994, quando mais favorável.

**Artigo de Lei:** Arts. 18 a 80 da Lei n.º 8.213/1991.`
      },
      {
        id: 6,
        title: 'RPPS e Previdência Complementar',
        content: `**Distinção Entre os Regimes**

| Aspecto | RGPS | RPPS | RPC |
| --- | --- | --- | --- |
| Natureza | Contributivo e obrigatório | Contributivo e obrigatório | Facultativo |
| Cobertura | Trabalhadores da iniciativa privada | Servidores públicos efetivos | Qualquer cidadão |
| Gestão | INSS (federal) | Cada ente federativo | Entidades abertas/fechadas |
| Benefício | Teto limitado | Pode ser integral (pré-reforma) | Conforme capitalização |
| Regime Financeiro | Repartição simples | Repartição simples | Capitalização individual |

**Características do RPPS**

O RPPS é o regime dos servidores públicos titulares de cargos efetivos, organizado por ente federativo, regido pelo Art. 40 da CF/88.

**O Impacto da EC 103/2019**

No RGPS: extinção da aposentadoria por tempo de contribuição, idade mínima de 65/62 anos, nova fórmula de cálculo (60% + 2% ao ano).
No RPPS: idade mínima de 65/62 anos, exigência de 25 anos de contribuição + 10 anos no serviço público + 5 anos no cargo.

**Previdência Complementar (RPC)**

Sistema de capitalização individual, facultativo, que permite acumular recursos adicionais para a aposentadoria. Modalidades:
- **Entidades Abertas:** Instituições financeiras (PGBL, VGBL)
- **Entidades Fechadas:** Fundos de pensão patrocinados por empresas (PREVI, PETROS, FUNCEF)

**Benefícios Fiscais:** Planos PGBL permitem dedução de até 12% da renda bruta anual no IR.

**Dica Prática:** Um cliente pode ter contribuições em regimes diferentes e precisar da Certidão de Tempo de Contribuição (CTC) para averbar períodos.

**Artigo de Lei:** Art. 40 e 202 da CF/88; Lei Complementar n.º 109/2001.`
      },
      {
        id: 7,
        title: 'Controvérsias e Perspectivas do RGPS',
        content: `**Desafios Atuais do RGPS**

O RGPS enfrenta desafios relacionados ao envelhecimento populacional, mudanças no mercado de trabalho e sustentabilidade financeira.

**Indicadores Demográficos**

| Indicador | 2010 | 2020 | 2030 (projeção) |
| --- | --- | --- | --- |
| Razão de dependência (idosos/ativos) | 11,2% | 15,3% | 21,5% |
| Expectativa de vida aos 65 anos | 18,5 anos | 19,8 anos | 21,2 anos |
| Taxa de fecundidade | 1,9 filhos/mulher | 1,7 filhos/mulher | 1,5 filhos/mulher |

**Principais Controvérsias**

**1. Revisão da Vida Toda (Tema 999/STF):** Reconhecimento do direito do segurado de optar pelo cálculo mais vantajoso considerando todas as contribuições, inclusive anteriores a julho/1994.

**2. Desaposentação (Tema 503/STF):** STF vedou a renúncia à aposentadoria para obter novo benefício mais vantajoso.

**3. Contribuição sobre Aviso Prévio Indenizado (Tema 1.025/STF):** Não incide contribuição previdenciária sobre o aviso prévio indenizado.

**4. Terço Constitucional de Férias (Tema 985/STF):** Não incide contribuição previdenciária sobre o terço constitucional de férias.

**Perspectivas Legislativas**

O Congresso Nacional discute propostas como: reforma paramétrica (ajustes nas alíquotas, idade mínima), capitalização individual (sistema misto), simplificação do sistema e previdência complementar obrigatória.

**Dica Prática:** Acompanhe regularmente as publicações do STF e STJ sobre temas previdenciários. Muitas teses de revisão dependem do andamento de recursos extraordinários e especiais.

**Artigo de Lei:** EC n.º 103/2019; Leis n.º 8.212/1991 e 8.213/1991; Decreto n.º 3.048/1999.`
      }
    ],
    quiz: [
      {
        question: 'O que caracteriza o sistema de repartição simples adotado pelo RGPS?',
        options: [
          'Cada trabalhador acumula recursos em conta individual para sua aposentadoria',
          'As contribuições dos trabalhadores ativos financiam os benefícios dos atuais aposentados',
          'O governo arca integralmente com os custos dos benefícios',
          'As empresas são as únicas responsáveis pelo financiamento dos benefícios'
        ],
        correctAnswer: 1,
        explanation: 'O sistema de repartição simples é baseado no pacto intergeracional: as contribuições dos trabalhadores ativos financiam os benefícios dos atuais aposentados e pensionistas.'
      },
      {
        question: 'Qual a principal diferença entre filiação e inscrição no RGPS?',
        options: [
          'São sinônimos legais, não havendo diferença prática',
          'Filiação é automática pelo exercício de atividade remunerada; inscrição é o cadastro formal junto ao INSS',
          'Inscrição é automática; filiação exige requerimento administrativo',
          'Filiação é para segurados obrigatórios; inscrição é para facultativos'
        ],
        correctAnswer: 1,
        explanation: 'A filiação decorre automaticamente do exercício de atividade remunerada, enquanto a inscrição é o cadastro formal do segurado junto ao INSS.'
      },
      {
        question: 'Qual o órgão responsável pela arrecadação das contribuições previdenciárias?',
        options: [
          'INSS',
          'CRPS',
          'Receita Federal do Brasil (RFB)',
          'Ministério do Trabalho'
        ],
        correctAnswer: 2,
        explanation: 'A Receita Federal do Brasil (RFB) é responsável pela arrecadação das contribuições previdenciárias, enquanto o INSS é responsável pela concessão dos benefícios.'
      },
      {
        question: 'O que ocorre com a carência já cumprida quando o segurado perde a qualidade de segurado?',
        options: [
          'A carência é totalmente perdida',
          'É mantida, mas o segurado precisa cumprir metade da carência ao reingressar',
          'A carência é reduzida pela metade automaticamente',
          'O INSS descarta 50% das contribuições mais baixas'
        ],
        correctAnswer: 1,
        explanation: 'A perda da qualidade não elimina contribuições anteriores. A carência já cumprida é mantida, mas ao reingressar o segurado precisa cumprir metade da carência original (Art. 27, Lei 8.213/91).'
      },
      {
        question: 'Qual benefício previdenciário NÃO exige carência, mas exige qualidade de segurado do instituidor?',
        options: [
          'Auxílio-reclusão',
          'Salário-maternidade',
          'Pensão por morte',
          'Auxílio por incapacidade temporária'
        ],
        correctAnswer: 2,
        explanation: 'A pensão por morte não exige carência (Art. 26, I, Lei 8.213/91), mas exige que o instituidor mantenha a qualidade de segurado na data do óbito.'
      }
    ]
  },
{
    id: 3,
    slug: 'qualidade-de-segurado-e-carencia',
    title: 'Qualidade de Segurado e Carência',
    description: 'Conceitos fundamentais de qualidade de segurado, período de graça, carência, perda e manutenção da condição de segurado e regras específicas para concessão de benefícios.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Manutenção da Qualidade de Segurado e o Período de Graça',
        content: `A **qualidade de segurado** é a condição jurídica atribuída à pessoa física que está filiada ao RGPS e que mantém esse vínculo enquanto exerce atividade remunerada (segurado obrigatório) ou contribui como facultativo, ou ainda durante o chamado **período de graça**.

**O Período de Graça (Art. 15 da Lei n.º 8.213/91)**

O período de graça é o lapso temporal no qual o segurado conserva todos os seus direitos perante o INSS, mesmo sem efetuar qualquer contribuição. Durante esse interregno, a qualidade de segurado é mantida integralmente para todos os fins legais.

| Hipótese Legal | Prazo | Base Legal |
| --- | --- | --- |
| Segurado obrigatório que deixa de exercer atividade remunerada | 12 meses | Art. 15, II, Lei 8.213/91 |
| Segurado em gozo de auxílio por incapacidade temporária | Até o término do benefício | Art. 15, I, Lei 8.213/91 |
| Segurado facultativo que deixa de contribuir | 6 meses | Art. 15, § 2º, Lei 8.213/91 |
| Segurado com mais de 120 contribuições sem perda da qualidade | 24 meses | Art. 15, § 1º, Lei 8.213/91 |
| Segurado desempregado (comprovação involuntária) | 36 meses | Art. 15, § 2º, Lei 8.213/91 |
| Segurado incorporado às Forças Armadas para serviço militar | 3 meses após a incorporação | Art. 15, V, Lei 8.213/91 |

**Atenção:** O prazo de 36 meses para o segurado desempregado não exige mais registro formal no Sine, conforme jurisprudência consolidada do STJ. Basta a comprovação da situação de desemprego involuntário por outros meios de prova.

**Prorrogação do Período de Graça**

O período de graça pode ser ampliado quando mais de uma hipótese legal se aplicar ao mesmo segurado. Exemplo: um segurado que contribuiu por mais de 120 meses e está desempregado pode somar os prazos, totalizando até 48 meses de manutenção da qualidade de segurado.

**Dica Prática:** Na prática, é fundamental orientar o cliente a não deixar o período de graça expirar sem retornar ao sistema. O segurado pode efetuar uma contribuição como facultativo para zerar o período e obter mais prazo, mesmo que ainda não tenha retornado ao mercado formal.

**Perda da Qualidade de Segurado**

A perda da qualidade de segurado ocorre no dia seguinte ao término do período de graça, sem a necessidade de qualquer ato formal do INSS. As consequências são imediatas.

**Jurisprudência:** O STJ firmou entendimento de que a perda da qualidade de segurado não implica a perda das contribuições já realizadas. O segurado mantém o direito ao cômputo do tempo de contribuição e da carência já cumprida, mas precisa reingressar no sistema para requerer novos benefícios (AgInt no REsp 1.936.325/SP).

**Artigo de Lei:** Art. 15 e §§ 1º a 5º da Lei n.º 8.213/1991; Art. 13 do Decreto n.º 3.048/1999.`
      },
      {
        id: 2,
        title: 'Carência: Conceito, Distinções e Regras Gerais',
        content: `**Conceito Legal de Carência**

A **carência** é o número mínimo de contribuições mensais indispensáveis para que o beneficiário faça jus ao benefício previdenciário, conforme definido no Art. 24 da Lei n.º 8.213/91.

**Distinções Fundamentais**

É essencial distinguir três conceitos que frequentemente são confundidos na prática:

| Conceito | Definição | Natureza |
| --- | --- | --- |
| **Carência** | Número mínimo de contribuições mensais para fazer jus ao benefício | Quantitativo de meses contribuídos |
| **Tempo de Contribuição** | Período total de atividade laboral com efetivo recolhimento | Período cronológico |
| **Período de Graça** | Prazo sem contribuição em que se mantém a qualidade de segurado | Manutenção do vínculo jurídico |

**Exemplo Prático:** Um segurado que contribuiu por 15 anos (180 meses) para a aposentadoria por idade cumpriu simultaneamente a carência (180 contribuições) e o tempo de contribuição (15 anos). Já um segurado que contribuiu por 10 anos (120 meses) e depois ficou 5 anos sem contribuir perdeu a qualidade de segurado, mas mantém as 120 contribuições para fins de carência — ao retornar, precisará de mais 60 contribuições para completar a carência.

**Carência Mínima por Benefício**

| Benefício | Carência Exigida | Base Legal |
| --- | --- | --- |
| Aposentadoria por Idade | 180 contribuições (15 anos) | Art. 25, II, Lei 8.213/91 |
| Aposentadoria por Incapacidade Permanente | 12 contribuições | Art. 25, I, Lei 8.213/91 |
| Aposentadoria Especial | 180 contribuições (15 anos) | Art. 25, II, c/c Art. 57, Lei 8.213/91 |
| Aposentadoria Programada (tempo de contribuição) | 180 contribuições (15 anos) | Art. 25, II, Lei 8.213/91 |
| Auxílio por Incapacidade Temporária (Auxílio-Doença) | 12 contribuições | Art. 25, I, Lei 8.213/91 |
| Pensão por Morte | Nenhuma (carência dispensada) | Art. 26, I, Lei 8.213/91 |
| Auxílio-Reclusão | 24 contribuições | Art. 25, III, Lei 8.213/91 |
| Salário-Maternidade | 10 contribuições | Art. 25, III, Lei 8.213/91 |
| Salário-Família | Nenhuma | Art. 26, II, Lei 8.213/91 |
| Auxílio-Acidente | Nenhuma | Art. 26, III, Lei 8.213/91 |

**Atenção:** A pensão por morte não exige carência, mas exige que o instituidor mantenha a qualidade de segurado na data do óbito ou esteja dentro do período de graça. Esse é um dos pontos mais cobrados em provas e concursos.

**Dispensa de Carência**

O Art. 26 da Lei 8.213/91 prevê hipóteses em que a carência é dispensada:

1. Pensão por morte e auxílio-reclusão (para os dependentes)
2. Salário-família
3. Auxílio-acidente
4. Reabilitação profissional
5. Benefícios decorrentes de acidente de trabalho ou doença profissional
6. Aposentadoria por incapacidade permanente decorrente de doença grave, contagiosa ou incurável (lista do Art. 151 da Lei 8.213/91)

**Importante:** A dispensa de carência não dispensa a qualidade de segurado. Mesmo nos casos de dispensa, o segurado deve estar filiado ao RGPS e manter a qualidade de segurado na data do evento gerador do benefício.

**Artigo de Lei:** Arts. 24 a 30 da Lei n.º 8.213/1991; Arts. 15 a 19 do Decreto n.º 3.048/1999.`
      },
      {
        id: 3,
        title: 'Perda da Qualidade de Segurado e suas Consequências',
        content: `**Quando Ocorre a Perda da Qualidade**

A perda da qualidade de segurado é automática e ocorre no dia seguinte ao término do período de graça sem que o segurado tenha retornado ao sistema.

**Consequências Imediatas da Perda**

1. **Suspensão do direito aos benefícios previdenciários** — enquanto não readquirir a qualidade, o segurado não pode requerer novos benefícios
2. **Manutenção das contribuições anteriores** — o tempo de contribuição e a carência já cumprida não são perdidos
3. **Necessidade de reingresso** — para requerer benefícios, o segurado precisa retornar ao sistema e cumprir novas regras de carência

**O Reingresso e a Carência Residual (Art. 27 da Lei 8.213/91)**

Quando o segurado perde a qualidade e posteriormente retorna ao sistema, aplica-se a regra da **carência residual**:

| Situação | Carência Exigida |
| --- | --- |
| Perda da qualidade e reingresso | Metade da carência original do benefício |
| Reingresso antes da perda da qualidade | Carência já cumprida + novas contribuições até atingir o mínimo |
| Segurado que nunca perdeu a qualidade | Carência integral exigida para cada benefício |

**Exemplo Prático de Carência Residual:**

Um segurado que contribuiu por 10 anos (120 contribuições) perdeu a qualidade de segurado e ficou 2 anos sem contribuir. Ao retornar, para requerer aposentadoria por idade (que exige 180 contribuições):

- Carência original: 180 contribuições
- Carência já cumprida: 120 contribuições (mantidas mesmo após a perda)
- Carência residual exigida: metade de 180 = 90 contribuições
- Total necessário após reingresso: 90 contribuições (e não 180)

**Atenção:** Esse cálculo é uma simplificação didática. Na prática, o INSS aplica o Art. 27 da Lei 8.213/91 e o segurado que perdeu a qualidade deve cumprir metade da carência exigida para o benefício pretendido, contada a partir do novo ingresso.

**Direitos Mantidos e Direitos Suspensos**

| Direito | Efeito da Perda |
| --- | --- |
| Tempo de contribuição acumulado | Mantido integralmente |
| Carência já cumprida | Mantida, mas exige-se carência residual |
| Qualidade de segurado | Suspensa até nova contribuição |
| Acesso a benefícios | Suspenso até readquirir a qualidade |
| Período de graça existente | Encerrado no momento da perda |

**Jurisprudência:** O STJ consolidou o entendimento de que o segurado que perde a qualidade de segurado não precisa refazer integralmente a carência para todos os benefícios. A carência residual de 50% é a regra, salvo disposição legal mais benéfica (Súmula 33 da TNU).

**Dica Prática:** Para o advogado previdenciarista, é essencial verificar no CNIS do cliente se houve perda da qualidade de segurado e, em caso positivo, calcular corretamente a carência residual aplicável. Um erro nesse cálculo pode resultar em indeferimento do benefício.

**Como Readquirir a Qualidade de Segurado**

A readquisição da qualidade de segurado ocorre com o simples retorno ao exercício de atividade remunerada (para segurados obrigatórios) ou com o pagamento de uma contribuição como segurado facultativo (para quem não exerce atividade remunerada).

**Atenção:** O pagamento de uma única contribuição como facultativo já restabelece a qualidade de segurado, mas a carência para benefícios específicos dependerá do número de contribuições efetivamente realizadas após o reingresso.

**Artigo de Lei:** Art. 15, § 4º e Art. 27 da Lei n.º 8.213/1991; Súmula 33 da Turma Nacional de Uniformização dos Juizados Especiais Federais.`
      },
      {
        id: 4,
        title: 'Cômputo e Averbação do Período de Carência',
        content: `**Como é Contada a Carência**

A carência é contada mês a mês, considerando as contribuições efetivamente recolhidas ao RGPS. O cômputo obedece a regras específicas estabelecidas no Art. 27 da Lei n.º 8.213/91 e nos Arts. 19 a 21 do Decreto n.º 3.048/1999.

**Regras de Cômputo**

1. **Contribuições mensais** — cada mês em que houver efetivo recolhimento conta como uma contribuição para a carência
2. **Contribuições em atraso** — podem ser computadas desde que pagas dentro do prazo de decadência
3. **Compensação de contribuições** — o segurado pode compensar contribuições em atraso para completar a carência
4. **Contribuições para o segurado facultativo** — contam normalmente para a carência

| Tipo de Período | Cômputo para Carência | Base Legal |
| --- | --- | --- |
| Período de trabalho com CTPS assinada | Sim | Art. 27, I, Lei 8.213/91 |
| Período como contribuinte individual com recolhimento | Sim | Art. 27, II, Lei 8.213/91 |
| Período de graça | Não (não há contribuição) | Art. 15, Lei 8.213/91 |
| Período militar obrigatório (remunerado) | Sim | Art. 55, III, Lei 8.213/91 |
| Período rural anterior a 1991 | Sim (desde que comprovado) | Art. 55, § 2º, Lei 8.213/91 |
| Período de benefício por incapacidade intercalado | Sim | Art. 27, I, Lei 8.213/91 |

**Importante:** O período de gozo de auxílio por incapacidade temporária (auxílio-doença), quando intercalado com períodos de atividade, conta como tempo de contribuição e, portanto, para a carência.

**A Averbação de Períodos Anteriores**

A averbação é o ato administrativo pelo qual o INSS reconhece e registra períodos de contribuição ou atividade anteriores, permitindo seu cômputo na carência e no tempo de contribuição.

**Períodos que podem ser averbados:**

- Tempo de serviço público com Certidão de Tempo de Contribuição (CTC)
- Tempo de atividade rural anterior a 1991
- Tempo de atividade especial convertido em tempo comum
- Tempo de contribuição em outros regimes (RPPS)
- Tempo de serviço militar (remunerado)
- Período de atividade no exterior (com acordo internacional)

**Dica Prática:** A averbação de períodos anteriores pode ser decisiva para completar a carência de um cliente que está próximo de se aposentar. Sempre verifique se o cliente possui períodos averbáveis não registrados no CNIS.

**Acordos Internacionais de Previdência**

O Brasil possui acordos de previdência com diversos países, permitindo a soma de períodos de contribuição para fins de carência:

| País/Bloco | Acordo | Períodos Somáveis |
| --- | --- | --- |
| Portugal | Acordo Brasil-Portugal (Decreto n.º 7.468/2011) | Sim |
| Japão | Acordo Brasil-Japão (Decreto n.º 6.762/2009) | Sim |
| Espanha | Acordo Brasil-Espanha (Decreto n.º 5.502/2005) | Sim |
| Itália | Acordo Brasil-Itália (Decreto n.º 88.292/1983) | Sim |
| Alemanha | Acordo Brasil-Alemanha | Sim |
| Uruguai | Acordo Multilateral do Mercosul | Sim |

**Jurisprudência:** O STJ reconhece que os períodos de contribuição no exterior, quando amparados por acordo internacional, devem ser computados para fins de carência no Brasil, desde que o segurado comprove o efetivo recolhimento das contribuições no país estrangeiro.

**Atenção:** Os acordos internacionais não dispensam o cumprimento da carência mínima no Brasil. O segurado deve ter, no mínimo, 180 contribuições no Brasil para aposentadoria por idade, podendo somar períodos no exterior para completar o tempo de contribuição.

**Artigo de Lei:** Arts. 27 a 30 da Lei n.º 8.213/1991; Arts. 19 a 21 do Decreto n.º 3.048/1999; Decretos legislativos que ratificam acordos internacionais.`
      },
      {
        id: 5,
        title: 'Carência Específica por Tipo de Benefício e Exceções',
        content: `Cada benefício previdenciário possui regras específicas de carência, que devem ser analisadas individualmente para a correta orientação do cliente. Além disso, existem exceções importantes que dispensam ou reduzem a carência em situações específicas.

**Análise Detalhada por Benefício**

**1. Aposentadoria por Idade**
- **Carência:** 180 contribuições (15 anos)
- **Exceções:** Trabalhadores rurais (segurados especiais) — carência de 180 contribuições, mas computada de forma diferenciada (por ano safra)
- **Regra de transição:** Para segurados já filiados antes da EC 103/2019, o tempo de contribuição mínimo para homens é de 15 anos (mantido)

**2. Auxílio por Incapacidade Temporária (Auxílio-Doença)**
- **Carência:** 12 contribuições
- **Exceções:** Dispensa de carência para acidente de qualquer natureza, doenças graves listadas no Art. 151 da Lei 8.213/91 (tuberculose ativa, hanseníase, alienação mental, neoplasia maligna, cegueira, paralisia irreversível, cardiopatia grave, doença de Parkinson, esclerose múltipla, entre outras)

**3. Aposentadoria por Incapacidade Permanente (Invalidez)**
- **Carência:** 12 contribuições
- **Exceções:** Dispensa quando decorrente de acidente de trabalho, doença profissional ou doença grave listada no Art. 151

**4. Auxílio-Reclusão**
- **Carência:** 24 contribuições
- **Exceções:** Nenhuma

**5. Salário-Maternidade**
- **Carência:** 10 contribuições
- **Exceções:** Para a segurada especial (rural), a carência é de 10 contribuições, mas pode ser comprovada pela atividade rural

**6. Pensão por Morte**
- **Carência:** Nenhuma
- **Exceções:** O instituidor deve ter qualidade de segurado ou estar em período de graça na data do óbito

**7. Auxílio-Acidente**
- **Carência:** Nenhuma
- **Exceções:** O segurado deve ter qualidade de segurado na data do acidente

**Tabela Completa de Carências e Exceções**

| Benefício | Carência Padrão | Dispensa de Carência | Observações |
| --- | --- | --- | --- |
| Aposentadoria por Idade | 180 contribuições | Não há | Rural: 180 contribuições especiais |
| Aposentadoria por Incapacidade Permanente | 12 contribuições | Acidente, doença grave | Perícia médica obrigatória |
| Aposentadoria Especial | 180 contribuições | Não há | Exige PPP completo |
| Aposentadoria Programada | 180 contribuições | Não há | Extinta para novos filiados |
| Auxílio Incapacidade Temporária | 12 contribuições | Acidente, doença grave | Perícia médica obrigatória |
| Pensão por Morte | Nenhuma | — | Exige qualidade de segurado |
| Auxílio-Reclusão | 24 contribuições | Não há | Segurado de baixa renda |
| Auxílio-Acidente | Nenhuma | — | Caráter indenizatório |
| Salário-Maternidade | 10 contribuições | Não há | Empregada doméstica: 10 contribuições |
| Salário-Família | Nenhuma | — | Renda familiar limitada |
| Reabilitação Profissional | Nenhuma | — | Serviço, não benefício |

**Importante:** A lista de doenças graves para dispensa de carência (Art. 151 da Lei 8.213/91) é taxativa, mas o STJ tem flexibilizado sua interpretação em casos excepcionais. A doença deve ser contemporânea ao requerimento do benefício.

**Dica Prática:** Quando o cliente tiver uma doença grave listada no Art. 151, o advogado deve instruir o pedido administrativo com laudos médicos detalhados que comprovem a data de início da doença e sua relação com a incapacidade. A dispensa de carência não dispensa a comprovação da incapacidade.

**Jurisprudência:** O STJ, no REsp 1.842.415/RS, firmou que a dispensa de carência para doenças graves (Art. 151 da Lei 8.213/91) exige que a doença seja diagnosticada antes do requerimento e que a incapacidade decorra diretamente dela, não sendo suficiente o simples diagnóstico.

**Artigo de Lei:** Arts. 24, 25, 26 e 151 da Lei n.º 8.213/1991; Art. 19 do Decreto n.º 3.048/1999.`
      },
      {
        id: 6,
        title: 'Manutenção da Qualidade e Planejamento Previdenciário',
        content: `A manutenção da qualidade de segurado e o cumprimento da carência são elementos centrais do **planejamento previdenciário**. O advogado especializado deve orientar o cliente sobre estratégias para preservar seus direitos e otimizar o acesso aos benefícios.

**Estratégias para Manutenção da Qualidade**

**1. Contribuição como Segurado Facultativo**
- Ideal para quem deixou o mercado de trabalho formal
- Alíquotas de 5% (baixa renda), 11% (plano simplificado) ou 20% (plano normal)
- Permite manter a qualidade sem interrupção
- Útil durante períodos de desemprego, estudo ou doença

**2. Pagamento de Contribuições em Atraso**
- Possível para contribuintes individuais e facultativos
- Prazo decadencial de 5 anos para contribuições em atraso
- Evita a perda da qualidade durante o período de graça
- Necessário comprovar a atividade no período

**3. Planejamento do Período de Graça**
- Conhecer o prazo exato aplicável ao caso
- Evitar a expiração sem uma nova contribuição
- Utilizar a soma de prazos quando houver múltiplas hipóteses

**4. Retorno ao Mercado de Trabalho**
- O simples retorno a atividade remunerada restabelece a qualidade
- Mesmo um período curto de trabalho já reativa o vínculo
- Orientar o cliente sobre a data de retorno e o registro em CTPS

**Tabela de Planejamento por Perfil**

| Perfil do Cliente | Estratégia Recomendada | Objetivo |
| --- | --- | --- |
| Trabalhador formal demitido | Verificar período de graça + contribuição facultativa | Evitar perda da qualidade |
| Autônomo com renda variável | Contribuição como facultativo nos meses sem renda | Manter carência contínua |
| Estudante maior de 16 anos | Contribuição facultativa com alíquota de 5% ou 11% | Iniciar carência cedo |
| Dono de casa sem renda | Segurado facultativo de baixa renda (5%) | Acesso a aposentadoria por idade |
| MEI | Recolhimento mensal do DAS | Manter qualidade e carência |
| Trabalhador rural | Comprovação da atividade safra a safra | Carência rural especial |

**Cálculo da Carência para Planejamento**

Para o planejamento previdenciário, o advogado deve calcular quantas contribuições o cliente já possui e quantas ainda são necessárias para cada benefício:

**Fórmula prática:**
- Carência necessária = Carência exigida — Contribuições já realizadas
- Considerar a carência residual (50%) se houve perda da qualidade
- Verificar períodos averbáveis não contabilizados

**Exemplo de Planejamento:**

Maria, 55 anos, contribuiu por 8 anos (96 contribuições) como empregada, depois ficou 3 anos desempregada sem contribuir, e agora quer se planejar para a aposentadoria por idade (62 anos).

**Análise:**
1. Perdeu a qualidade de segurado? Sim (período de graça de 12 ou 24 meses já expirou)
2. Carência já cumprida: 96 contribuições (mantidas)
3. Carência necessária para aposentadoria por idade: 180 contribuições
4. Carência residual: 180 ÷ 2 = 90 contribuições (após reingresso)
5. Contribuições que precisa fazer: 90 contribuições = 7,5 anos
6. Idade atual: 55 anos → se contribuir por 7,5 anos, terá 62,5 anos e cumprirá idade e carência

**Dica Prática:** No planejamento previdenciário, sempre verifique se o cliente possui períodos de contribuição anteriores a 1994, que podem ser excluídos do cálculo do benefício (descartados os 20% menores), ou incluídos na Revisão da Vida Toda, conforme o caso.

**Ferramentas de Simulação**

O advogado pode utilizar as seguintes ferramentas para simulações:
- **CNIS completo** — base de dados oficial do INSS
- **Site Meu INSS** — simulador de tempo de contribuição
- **Planilhas de cálculos** — para projeções de carência e valor do benefício
- **Sistemas jurídicos especializados** — com cálculo de carência residual

**Atenção:** A simulação de carência no Meu INSS considera automaticamente a carência já cumprida e projeta a data de cumprimento. No entanto, o sistema pode não considerar corretamente a carência residual para quem perdeu a qualidade. O advogado deve verificar manualmente.

**Artigo de Lei:** Arts. 14, 15 e 27 da Lei n.º 8.213/1991; Súmula 33 da TNU.`
      },
      {
        id: 7,
        title: 'Controvérsias Atuais sobre Qualidade de Segurado e Carência',
        content: `O tema da qualidade de segurado e da carência é objeto de constantes debates doutrinários e jurisprudenciais. Conhecer as principais controvérsias é essencial para a atuação estratégica na área previdenciária.

**1. A Comprovação do Desemprego Involuntário**

O Art. 15, § 2º da Lei 8.213/91 prevê o prazo de 36 meses de período de graça para o segurado comprovadamente desempregado. A controvérsia reside na forma de comprovação:

| Entendimento | Exigência | Fundamento |
| --- | --- | --- |
| INSS (estrito) | Exige registro no Sine (Sistema Nacional de Emprego) | Instrução Normativa INSS |
| STJ (flexível) | Aceita outros meios de prova (declaração, extratos, testemunhas) | REsp 1.293.693/RS |
| Doutrina majoritária | Basta a declaração do trabalhador corroborada por indícios | Princípio do formalismo moderado |

**Jurisprudência:** O STJ consolidou que a ausência de registro no Sine não impede a comprovação do desemprego involuntário por outros meios de prova (AgInt no AREsp 2.016.042/SP).

**2. A Carência Residual e a Teoria da Reafiliação**

A aplicação da carência residual (Art. 27 da Lei 8.213/91) gera debates sobre o momento exato em que o segurado readquire a qualidade e a partir de quando a nova carência começa a ser contada.

**Posições divergentes:**
- **Posição 1:** A carência residual começa a contar da data do primeiro pagamento após o reingresso
- **Posição 2:** A carência residual começa a contar do exercício da atividade, mesmo sem o pagamento imediato
- **Posição 3:** A carência residual exige que o segurado tenha efetuado pelo menos uma contribuição após o reingresso

**3. A Perda da Qualidade e o Direito Adquirido ao Benefício**

Uma das questões mais relevantes é se o segurado que preencheu todos os requisitos para a aposentadoria antes da perda da qualidade mantém o direito adquirido ao benefício.

| Caso Concreto | Entendimento |
| --- | --- |
| Segurado cumpriu carência e tempo de contribuição, mas não requereu o benefício antes da perda da qualidade | Mantém o direito adquirido, pois os requisitos foram preenchidos antes da perda |
| Segurado perdeu a qualidade antes de cumprir a carência | Não tem direito adquirido; precisa reingressar e cumprir carência residual |
| Segurado requereu o benefício após a perda mas tinha direito adquirido anterior | Favorável ao segurado (Súmula 41/TNU) |

**Súmula 41 da TNU:** O direito à aposentadoria por tempo de contribuição, com base no art. 53, I, da Lei n. 8.213/91, não é prejudicado pela perda da qualidade de segurado, desde que o segurado preencha os requisitos legais antes da perda.

**4. A Carência do Segurado Especial (Trabalhador Rural)**

A comprovação da carência para o segurado especial é uma das áreas mais litigiosas:

| Aspecto | Regra | Problema Prático |
| --- | --- | --- |
| Carência rural | 180 contribuições (contadas por ano safra) | Dificuldade de comprovação documental |
| Início de prova material | Documentos que comprovem a atividade rural | Ausência de documentos formais |
| Prova testemunhal | Admitida como complemento | Necessita de início de prova material |

**5. A Contagem de Períodos de Atividade Especial para Carência**

| Aspecto | Entendimento Atual |
| --- | --- |
| Conversão de tempo especial para comum | Sim, com multiplicadores (1,4 homem / 1,2 mulher) |
| Carência especial para aposentadoria especial | Carência de 180 contribuições independentemente do tempo de exposição |
| Período especial não averbado | Pode ser averbado a qualquer tempo, desde que comprovado |

**6. A Aplicação da Carência aos Segurados Facultativos**

Uma controvérsia relevante é a restrição aos benefícios para o segurado facultativo de baixa renda (alíquota de 5%):

| Alíquota | Benefícios com Direito |
| --- | --- |
| 5% (baixa renda) | Aposentadoria por idade e pensão por morte |
| 11% (plano simplificado) | Todos os benefícios, exceto aposentadoria programada |
| 20% (plano normal) | Todos os benefícios |

**Dica Prática:** O segurado facultativo que contribui com 5% ou 11% pode complementar a contribuição para atingir a alíquota de 20%, desde que faça o recolhimento complementar dentro do prazo legal. Isso permite o acesso à aposentadoria programada.

**Atenção:** O cenário de constantes mudanças normativas e jurisprudenciais exige que o profissional da área previdenciária mantenha atualização permanente. As súmulas e os precedentes vinculantes dos tribunais superiores devem ser consultados regularmente.

**Artigo de Lei:** Arts. 15, 24, 27 e 151 da Lei n.º 8.213/1991; Súmulas 33 e 41 da Turma Nacional de Uniformização; Decreto n.º 3.048/1999.`
      }
    ],
    quiz: [
      {
        question: 'O que é o período de graça no âmbito do RGPS?',
        options: [
          'O período em que o INSS concede um desconto nas contribuições do segurado',
          'O lapso temporal em que o segurado mantém a qualidade de segurado sem efetuar contribuições',
          'O prazo para o segurado pagar contribuições em atraso sem multa',
          'O período de carência para a concessão do auxílio-doença'
        ],
        correctAnswer: 1,
        explanation: 'O período de graça é o lapso temporal previsto em lei (Art. 15 da Lei 8.213/91) durante o qual o segurado conserva todos os seus direitos perante o INSS mesmo sem efetuar qualquer contribuição financeira.'
      },
      {
        question: 'Qual a diferença fundamental entre carência e tempo de contribuição?',
        options: [
          'Carência é o número mínimo de contribuições mensais para o benefício; tempo de contribuição é o período total de atividade laboral contributiva',
          'Carência e tempo de contribuição são sinônimos legais',
          'Tempo de contribuição é o número mínimo de contribuições; carência é o período total',
          'Carência só se aplica a segurados facultativos'
        ],
        correctAnswer: 0,
        explanation: 'Carência é o número mínimo de contribuições mensais indispensáveis para a concessão de cada benefício (Art. 24, Lei 8.213/91). Tempo de contribuição é o período total de atividade laboral com efetivo recolhimento. Eles não se confundem.'
      },
      {
        question: 'Qual a carência exigida para o auxílio por incapacidade temporária (antigo auxílio-doença)?',
        options: [
          '6 contribuições mensais',
          '12 contribuições mensais',
          '24 contribuições mensais',
          '180 contribuições mensais'
        ],
        correctAnswer: 1,
        explanation: 'O auxílio por incapacidade temporária exige carência de 12 contribuições mensais, conforme o Art. 25, I da Lei 8.213/91. A carência é dispensada em casos de acidente de qualquer natureza ou doenças graves listadas no Art. 151.'
      },
      {
        question: 'O que ocorre com a carência já cumprida quando o segurado perde a qualidade de segurado?',
        options: [
          'A carência é totalmente perdida e o segurado começa do zero',
          'A carência é mantida, mas o segurado precisa cumprir metade da carência original ao reingressar',
          'A carência é reduzida pela metade automaticamente',
          'O INSS descarta 50% das contribuições mais baixas'
        ],
        correctAnswer: 1,
        explanation: 'A perda da qualidade de segurado não elimina as contribuições anteriores. A carência já cumprida é mantida, mas ao reingressar, o segurado precisa cumprir metade da carência original do benefício pretendido (Art. 27 da Lei 8.213/91).'
      },
      {
        question: 'Qual benefício previdenciário NÃO exige carência, mas exige qualidade de segurado do instituidor?',
        options: [
          'Auxílio-reclusão',
          'Salário-maternidade',
          'Pensão por morte',
          'Auxílio por incapacidade temporária'
        ],
        correctAnswer: 2,
        explanation: 'A pensão por morte não exige carência (Art. 26, I, Lei 8.213/91), mas exige que o instituidor mantenha a qualidade de segurado na data do óbito ou esteja dentro do período de graça. Os demais benefícios listados exigem carência específica.'
      },
      {
        question: 'Qual o prazo de período de graça para o segurado que comprovadamente se encontra em situação de desemprego involuntário?',
        options: [
          '12 meses',
          '24 meses',
          '36 meses',
          '48 meses'
        ],
        correctAnswer: 2,
        explanation: 'O segurado desempregado tem direito a 36 meses de período de graça, conforme o Art. 15, § 2º da Lei 8.213/91. Esse prazo pode ser acrescido de 12 meses extras se o segurado tiver mais de 120 contribuições, totalizando até 48 meses.'
      }
    ]
  },
  
  ...courseModulesExtended,
];


// Module Progress delegates to progress service
export interface ModuleProgress {
  [moduleId: number]: {
    status: 'liberado' | 'bloqueado' | 'concluido';
    grade?: number;
  };
}

import {
  getModuleProgress as getProgressAsync,
  getModuleStatus as getStatusAsync,
  getModuleGrade as getGradeAsync,
  unlockModule as unlockModuleAsync,
  completeModule as completeModuleAsync,
  getModuleProgressSync,
  getModuleStatusSync,
} from '../lib/progress';

// Re-export async versions that use Supabase when userId is provided
export { getProgressAsync, getStatusAsync, getGradeAsync, unlockModuleAsync, completeModuleAsync };

// Sync versions (localStorage fallback) for immediate UI rendering
export function getModuleProgress(): ModuleProgress {
  return getModuleProgressSync();
}

export function saveModuleProgress(progress: ModuleProgress): void {
  localStorage.setItem('oryon_modules_progress', JSON.stringify(progress));
}

export function getModuleStatus(moduleId: number): 'liberado' | 'bloqueado' | 'concluido' {
  return getModuleStatusSync(moduleId);
}

export function getModuleGrade(moduleId: number): number | undefined {
  const progress = getModuleProgressSync();
  return progress[moduleId]?.grade;
}

export function unlockModule(moduleId: number): void {
  const progress = getModuleProgressSync();
  progress[moduleId] = { status: 'liberado' };
  saveModuleProgress(progress);
}

export function completeModule(moduleId: number, grade: number): void {
  const progress = getModuleProgressSync();
  progress[moduleId] = { status: 'concluido', grade };
  if (moduleId < courseModules.length) {
    progress[moduleId + 1] = { status: 'liberado' };
  }
  saveModuleProgress(progress);
}

// Keep legacy exports for backward compatibility
export const modules = moduleSummaries;

export const certificateExample = {
  studentName: 'Maria Oliveira Santos',
  courseName: 'Direito Previdenciário na Prática: Benefícios, Segurados e Processo Administrativo',
  workload: '40 horas',
  code: 'ORY-2026-0001',
  completionDate: '15 de março de 2026',
  status: 'válido' as const,
};

export const faqItems = [
  {
    question: 'O curso é reconhecido pelo MEC?',
    answer: 'Trata-se de curso livre de formação complementar, conforme modalidade de educação não formal. A aceitação para horas complementares depende das regras da instituição de ensino do aluno.',
  },
  {
    question: 'Qual a carga horária?',
    answer: 'O curso possui carga horária total de 40 horas, distribuídas em 12 módulos com aulas teóricas, quizzes e avaliação final.',
  },
  {
    question: 'Como recebo o certificado?',
    answer: 'Após concluir todos os módulos, quizzes e a avaliação final com nota mínima de 70%, você poderá baixar o certificado digital diretamente na plataforma.',
  },
  {
    question: 'O certificado tem validação?',
    answer: 'Sim! Todo certificado emitido possui um código único e um QR Code que permitem a validação online por qualquer instituição ou empregador.',
  },
  {
    question: 'Preciso pagar?',
    answer: 'O curso possui valor institucional de R$ 197,00, mas está com bolsa acadêmica de 100% aplicada, liberando o acesso gratuito para fins de formação complementar.',
  },
];

export interface RecentModule {
  id: number;
  title: string;
  status: 'concluido' | 'liberado';
  grade: number | null;
}

export interface DashboardData {
  studentName: string;
  email: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  averageGrade: number;
  lastAccess: string;
  recentModules: RecentModule[];
}

export const dashboardData: DashboardData = {
  studentName: 'Maria Oliveira',
  email: 'maria.oliveira@email.com',
  progress: 25,
  completedModules: 3,
  totalModules: 12,
  averageGrade: 82,
  lastAccess: '20/05/2026',
  recentModules: [
    { id: 1, title: 'Introdução ao Direito Previdenciário', status: 'concluido', grade: 85 },
    { id: 2, title: 'Regime Geral de Previdência Social', status: 'concluido', grade: 78 },
    { id: 3, title: 'Qualidade de Segurado e Carência', status: 'concluido', grade: 82 },
    { id: 4, title: 'Segurados e Dependentes', status: 'liberado', grade: null },
  ],
};