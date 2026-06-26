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

export interface CourseModuleDataPart {
  id: number;
  slug: string;
  title: string;
  description: string;
  duration: string;
  sections: ModuleSection[];
  quiz: QuizQuestion[];
}

export const courseModulesExtended: CourseModuleDataPart[] = [
  {
    id: 4,
    slug: 'segurados-e-dependentes',
    title: 'Segurados e Dependentes',
    description: 'Classificação dos segurados obrigatórios e facultativos, dependentes, inscrição no RGPS e controvérsias práticas.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Empregado, Empregado Doméstico e Vínculo Empregatício',
        content: `**Conceito de Empregado (Art. 12, Lei 8.213/91)**

O empregado é a pessoa física que presta serviço de natureza urbana ou rural a empresa ou equiparada, em caráter não eventual, sob subordinação e mediante remuneração.

| Elemento | Descrição | Consequência Previdenciária |
| --- | --- | --- |
| Pessoalidade | O serviço deve ser prestado pessoalmente | Vínculo individual com o RGPS |
| Habitualidade | Não eventualidade na prestação | Filiação automática ao RGPS |
| Subordinação | Dependência jurídica do empregador | Contribuição patronal obrigatória |
| Onerosidade | Remuneração pelo trabalho | Base de cálculo das contribuições |

**Empregado Doméstico (LC 150/2015)**

Desde a EC 72/2013 e a LC 150/2015, o empregado doméstico integra plenamente o RGPS, com direito a todos os benefícios previdenciários.

| Requisito | Regra |
| --- | --- |
| Frequência | Mais de 2 dias por semana na mesma residência |
| Subordinação | Relação de emprego doméstico |
| Contribuição patronal | 8% (empregador) + encargos |
| FGTS | Obrigatório |

**Atenção:** Motorista de aplicativo e trabalhador de plataforma digital têm enquadramento controvertido. O STF (ADI 5.870) e o STJ analisam caso a caso a subordinação algorítmica.

**Dica Prática:** Na ausência de CTPS, comprove o vínculo por holerites, extratos bancários, testemunhas e mensagens que demonstrem habitualidade e subordinação.

**Artigo de Lei:** Arts. 11, I, e 12 da Lei n.º 8.213/1991; LC n.º 150/2015.`,
      },
      {
        id: 2,
        title: 'Contribuinte Individual, MEI e Trabalhador Avulso',
        content: `**Contribuinte Individual (Art. 11, V, Lei 8.213/91)**

Exerce atividade por conta própria, sem vínculo empregatício: autônomos, profissionais liberais, sócios com pró-labore, cooperados.

| Categoria | Alíquota Segurado | Observação |
| --- | --- | --- |
| Contribuinte individual (plano normal) | 20% | Sobre remuneração até o teto |
| Plano simplificado | 11% | Sem aposentadoria programada |
| MEI | 5% do salário mínimo (via DAS) | Aposentadoria por idade, auxílio-doença, salário-maternidade e pensão |

**Microempreendedor Individual (MEI)**

O MEI recolhe 5% de contribuição previdenciária pelo DAS mensal. A qualidade de segurado depende do pagamento em dia.

**Trabalhador Avulso (Art. 11, IV)**

Presta serviço a diversas empresas sem vínculo, com intermediação de OGMO ou sindicato: estivadores, carregadores portuários.

**Jurisprudência:** O STJ reconhece que o MEI que deixa de recolher o DAS perde a qualidade de segurado após o período de graça.

**Artigo de Lei:** Arts. 11, IV e V, e 21 da Lei n.º 8.213/1991; LC n.º 123/2006.`,
      },
      {
        id: 3,
        title: 'Segurado Especial e Trabalhador Rural',
        content: `**Segurado Especial (Art. 11, VII, Lei 8.213/91)**

Produtor rural em regime de economia familiar, pescador artesanal e cônjuge/companheiro que trabalhem em conjunto, sem empregados permanentes.

| Aspecto | Regra |
| --- | --- |
| Contribuição | 2,3% sobre a comercialização (GILRURAL) |
| Comprovação | Início de prova material + prova testemunhal |
| Carência | 180 contribuições (ano safra) |
| Idade para aposentadoria | 60 anos (H) / 55 anos (M) |

**Início de Prova Material**

ITR, DAP, notas fiscais de produtor, contratos de parceria, declaração de sindicato rural.

**Atenção:** A Súmula 75 do STJ exige início de prova material contemporânea ao período que se pretende comprovar.

**Dica Prática:** Organize a prova por ano safra, com documentos que demonstrem plantio, colheita ou comercialização em cada período.

**Artigo de Lei:** Arts. 11, VII, 39 e 143 da Lei n.º 8.213/1991.`,
      },
      {
        id: 4,
        title: 'Segurado Facultativo: Alíquotas e Benefícios',
        content: `**Segurado Facultativo (Art. 14, Lei 8.213/91)**

Pessoa maior de 16 anos sem atividade remunerada obrigatória que opta por contribuir.

| Plano | Alíquota | Benefícios com Direito |
| --- | --- | --- |
| Baixa renda (CadÚnico) | 5% do SM | Aposentadoria por idade e pensão por morte |
| Simplificado | 11% do SM | Todos, exceto aposentadoria programada |
| Normal | 20% até o teto | Todos os benefícios do RGPS |

**Complementação de Alíquota**

O facultativo que contribui com 5% ou 11% pode complementar para 20% dentro do prazo legal.

**Período de Graça do Facultativo:** 6 meses após deixar de contribuir.

**Importante:** O facultativo de baixa renda não tem direito a auxílio-doença sem complementação da alíquota.

**Artigo de Lei:** Arts. 14, 15 e 21 da Lei n.º 8.213/1991.`,
      },
      {
        id: 5,
        title: 'Dependentes: Classes, Presunção e Exclusão',
        content: `**Classificação dos Dependentes (Art. 16, Lei 8.213/91)**

| Classe | Dependentes | Dependência Econômica |
| --- | --- | --- |
| I | Cônjuge, companheiro(a), filhos menores de 21 ou inválidos/deficientes | Presumida |
| II | Pais | Deve ser comprovada |
| III | Irmãos menores de 21 ou inválidos | Deve ser comprovada |

**Regra de Exclusão entre Classes**

A existência de dependente de classe anterior exclui os das classes subsequentes.

**Filho Maior Inválido ou com Deficiência**

Mantém a qualidade de dependente sem limite etário, desde que comprovada a condição.

**Jurisprudência:** O STJ reconhece pensão ao companheiro de união estável e dependência de enteado quando comprovada relação familiar e econômica.

**Artigo de Lei:** Arts. 16 a 18 da Lei n.º 8.213/1991.`,
      },
      {
        id: 6,
        title: 'Filiação, Inscrição e Cadastro no INSS',
        content: `**Distinção Fundamental**

| Conceito | Natureza | Momento |
| --- | --- | --- |
| Filiação | Automática pelo exercício de atividade | Início da atividade remunerada |
| Inscrição | Cadastro formal no INSS | Registro em CTPS, CNPJ ou requerimento |

**CNIS e NIT**

O Cadastro Nacional de Informações Sociais consolida vínculos e contribuições.

**Segurado sem Inscrição**

A ausência de inscrição não impede o reconhecimento de direitos se comprovado o exercício de atividade.

**Dica Prática:** Solicite CNIS completo no Meu INSS antes de qualquer requerimento.

**Artigo de Lei:** Arts. 11, 14 e 30 da Lei n.º 8.213/1991.`,
      },
      {
        id: 7,
        title: 'Controvérsias sobre Segurados e Dependentes',
        content: `**Principais Temas Litigiosos**

1. Trabalhador de plataforma digital: subordinação algorítmica x autonomia
2. Segurado especial: comprovação de períodos rurais anteriores a 1991
3. Dependência econômica de pais em famílias de baixa renda
4. MEI e recolhimento em atraso
5. Empregado doméstico sem registro: reconhecimento retroativo

| Tema | Entendimento Dominante |
| --- | --- |
| Vínculo de plataforma | Análise caso a caso da subordinação |
| Prova rural | Início de prova material + testemunhas |
| Facultativo 5% | Sem auxílio-doença sem complementação |

**Súmula 75/STJ:** Para tempo rural anterior à Lei 8.213/91, é necessário início de prova material contemporânea.

**Artigo de Lei:** Arts. 11 a 18 da Lei n.º 8.213/1991; Súmula 75/STJ.`,
      },
    ],
    quiz: [
      {
        question: 'Quem é considerado empregado doméstico para fins previdenciários?',
        options: [
          'Qualquer prestador de serviço residencial eventual',
          'Pessoa que presta serviços contínuos, subordinados e pessoais no âmbito residencial por mais de 2 dias por semana',
          'Apenas empregada com carteira assinada antes de 2013',
          'Profissional autônomo que atende várias residências',
        ],
        correctAnswer: 1,
        explanation: 'O empregado doméstico presta serviços de forma contínua, subordinada, onerosa e pessoal no âmbito residencial, por mais de 2 dias por semana (LC 150/2015).',
      },
      {
        question: 'Qual a alíquota de contribuição do MEI para o RGPS?',
        options: ['20% sobre o faturamento', '11% do salário mínimo', '5% do salário mínimo via DAS', '2,3% sobre a comercialização'],
        correctAnswer: 2,
        explanation: 'O MEI recolhe 5% do salário mínimo a título de contribuição previdenciária por meio do DAS mensal.',
      },
      {
        question: 'Quais dependentes possuem dependência econômica presumida?',
        options: [
          'Pais e irmãos',
          'Cônjuge, companheiro(a) e filhos menores de 21 anos (ou inválidos/deficientes)',
          'Qualquer parente que more com o segurado',
          'Apenas filhos menores de 18 anos',
        ],
        correctAnswer: 1,
        explanation: 'Os dependentes de Classe I gozam de dependência econômica presumida em lei.',
      },
      {
        question: 'Qual o período de graça do segurado facultativo que deixa de contribuir?',
        options: ['12 meses', '6 meses', '36 meses', '24 meses'],
        correctAnswer: 1,
        explanation: 'O segurado facultativo mantém a qualidade de segurado por 6 meses após deixar de contribuir (Art. 15, § 2º, Lei 8.213/91).',
      },
      {
        question: 'O que caracteriza o segurado especial?',
        options: [
          'Qualquer trabalhador rural com carteira assinada',
          'Produtor rural em economia familiar sem empregados permanentes',
          'Empregado de agroindústria',
          'Contribuinte individual do setor agropecuário',
        ],
        correctAnswer: 1,
        explanation: 'O segurado especial é o produtor rural em regime de economia familiar, sem empregados permanentes.',
      },
      {
        question: 'Qual a diferença entre filiação e inscrição no RGPS?',
        options: [
          'São sinônimos',
          'Filiação é automática pelo exercício de atividade; inscrição é o cadastro formal no INSS',
          'Inscrição é automática; filiação exige pedido',
          'Filiação vale apenas para empregados',
        ],
        correctAnswer: 1,
        explanation: 'A filiação decorre automaticamente do exercício de atividade remunerada; a inscrição é o cadastro formal junto ao INSS.',
      },
    ],
  },
  {
    id: 5,
    slug: 'beneficios-previdenciarios-visao-geral',
    title: 'Benefícios Previdenciários: Visão Geral',
    description: 'Visão geral dos benefícios administrados pelo INSS, espécies, requisitos genéricos, não acumulação e cálculo.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Natureza Jurídica e Classificação dos Benefícios',
        content: `**Benefícios Previdenciários x Assistenciais**

| Tipo | Natureza | Exige Contribuição | Gestão |
| --- | --- | --- | --- |
| Previdenciário | Contributivo | Sim | INSS (RGPS) |
| Assistencial | Não contributivo | Não | CRAS/INSS (BPC) |

**Classificação por Finalidade**

1. **Proteção à incapacidade:** auxílio por incapacidade temporária, aposentadoria por incapacidade permanente, auxílio-acidente, reabilitação profissional
2. **Proteção à velhice:** aposentadoria por idade, programada, especial
3. **Proteção à morte:** pensão por morte, auxílio-reclusão
4. **Proteção à maternidade:** salário-maternidade
5. **Proteção à renda familiar:** salário-família

**Atenção:** O BPC/LOAS não é benefício previdenciário, embora seja pago pelo INSS.

**Artigo de Lei:** Arts. 18 a 80 da Lei n.º 8.213/1991; Lei n.º 8.742/1993 (LOAS).`,
      },
      {
        id: 2,
        title: 'Aposentadorias no RGPS',
        content: `**Espécies de Aposentadoria**

| Benefício | Requisito Principal | Carência |
| --- | --- | --- |
| Por idade | 65 anos (H) / 62 anos (M) + tempo mínimo | 180 contribuições |
| Por incapacidade permanente | Incapacidade total e permanente | 12 contribuições |
| Especial | Exposição a agentes nocivos (15/20/25 anos) | 180 contribuições |
| Programada | Tempo + idade mínima | 180 contribuições |

**Pós-EC 103/2019**

A aposentadoria por tempo de contribuição pura foi extinta para novos filiados. Segurados anteriores à reforma acessam regras de transição.

**Dica Prática:** Simule todas as regras de transição antes de protocolar o pedido — a regra mais vantajosa nem sempre é a óbvia.

**Artigo de Lei:** Arts. 48 a 57 da Lei n.º 8.213/1991; EC n.º 103/2019.`,
      },
      {
        id: 3,
        title: 'Benefícios por Incapacidade e Acidente',
        content: `**Auxílio por Incapacidade Temporária**

Concedido quando o segurado fica incapaz por mais de 15 dias consecutivos. Carência de 12 contribuições (dispensada em acidente e doenças graves do Art. 151).

**Aposentadoria por Incapacidade Permanente**

Incapacidade total e permanente para qualquer atividade. Valor: 60% da média + 2% por ano excedente. Acréscimo de 25% se necessitar de assistência de terceiros (Art. 45).

**Auxílio-Acidente**

Natureza indenizatória: 50% do salário de benefício. Pode acumular com salário. Não exige carência.

| Benefício | Caráter | Acumula com Salário? |
| --- | --- | --- |
| Auxílio temporário | Substitutivo | Não |
| Aposentadoria por invalidez | Substitutivo | Não |
| Auxílio-acidente | Indenizatório | Sim |

**Artigo de Lei:** Arts. 59 a 86 da Lei n.º 8.213/1991.`,
      },
      {
        id: 4,
        title: 'Benefícios aos Dependentes',
        content: `**Pensão por Morte**

Concedida aos dependentes do segurado falecido. Não exige carência, mas exige qualidade de segurado do instituidor na data do óbito.

**Cálculo em Cotas (pós-reforma):**
- Cota base: 50%
- Cota adicional: 10% por dependente (máximo 100%)

**Auxílio-Reclusão**

Para dependentes de segurado de baixa renda preso em regime fechado. Carência de 24 contribuições.

**Salário-Maternidade**

Gestante, adotante ou guarda judicial para adoção. Carência de 10 contribuições.

**Artigo de Lei:** Arts. 74 a 80 e 93 da Lei n.º 8.213/1991.`,
      },
      {
        id: 5,
        title: 'Requisitos Genéricos: Qualidade, Carência e Cálculo',
        content: `**Tríade dos Requisitos**

| Requisito | Conceito |
| --- | --- |
| Qualidade de segurado | Vínculo ativo ou período de graça na data do fato gerador |
| Carência | Número mínimo de contribuições mensais |
| Fato gerador | Evento que autoriza o benefício (idade, morte, incapacidade) |

**Cálculo Pós-Reforma (regra geral)**

- Média de 100% dos salários de contribuição desde julho/1994
- 60% da média + 2% por ano que exceder 20 anos (H) ou 15 anos (M)

**Teto do RGPS (2024):** R$ 7.786,02

**Jurisprudência:** Tema 999/STF — Revisão da Vida Toda permite cálculo com todas as contribuições quando mais favorável.

**Artigo de Lei:** Arts. 24 a 30 e 29 da Lei n.º 8.213/1991.`,
      },
      {
        id: 6,
        title: 'Regras de Não Acumulação',
        content: `**Princípio Geral**

Não é permitido receber mais de um benefício previdenciário do RGPS, salvo exceções legais.

| Combinação | Pode Acumular? |
| --- | --- |
| Aposentadoria + Pensão por morte | Sim |
| Aposentadoria + Auxílio-acidente | Sim |
| Duas aposentadorias do RGPS | Não |
| Aposentadoria + Auxílio temporário | Não |
| Pensão + Auxílio-reclusão (mesmo instituidor) | Sim |

**Atenção:** A acumulação com benefício assistencial (BPC) é vedada, salvo assistência médica.

**Artigo de Lei:** Art. 20 da Lei n.º 8.213/1991.`,
      },
      {
        id: 7,
        title: 'Controvérsias e Tendências dos Benefícios',
        content: `**Temas em Debate**

1. Revisão da Vida Toda e cálculo do benefício
2. Equiparação de nomenclaturas (auxílio-doença x auxílio por incapacidade temporária)
3. Benefícios para trabalhadores de plataforma
4. Sustentabilidade financeira do RGPS

**Dica Prática:** Antes de ajuizar ação, verifique se há tese de revisão administrativa pendente no STF que possa beneficiar o cliente.

**Artigo de Lei:** Lei n.º 8.213/1991; EC n.º 103/2019.`,
      },
    ],
    quiz: [
      {
        question: 'Qual benefício é de natureza exclusivamente assistencial?',
        options: ['Aposentadoria por idade', 'Pensão por morte', 'BPC/LOAS', 'Auxílio por incapacidade temporária'],
        correctAnswer: 2,
        explanation: 'O BPC/LOAS é benefício assistencial, não exigindo contribuições prévias ao RGPS.',
      },
      {
        question: 'Qual a carência do auxílio por incapacidade temporária?',
        options: ['6 contribuições', '12 contribuições', '24 contribuições', '180 contribuições'],
        correctAnswer: 1,
        explanation: 'O auxílio por incapacidade temporária exige 12 contribuições mensais (Art. 25, I, Lei 8.213/91).',
      },
      {
        question: 'O auxílio-acidente pode ser acumulado com salário?',
        options: ['Não, nunca', 'Sim, por ter natureza indenizatória', 'Apenas com aposentadoria', 'Somente por 12 meses'],
        correctAnswer: 1,
        explanation: 'O auxílio-acidente é indenizatório e pode ser recebido cumulativamente com remuneração do trabalho.',
      },
      {
        question: 'Quantas cotas compõem o cálculo da pensão por morte (cota base)?',
        options: ['30%', '40%', '50%', '70%'],
        correctAnswer: 2,
        explanation: 'A cota base da pensão por morte é de 50% do valor da aposentadoria que o instituidor recebia ou teria direito.',
      },
      {
        question: 'É possível acumular duas aposentadorias do RGPS?',
        options: ['Sim, sempre', 'Sim, se forem de regimes diferentes', 'Não', 'Sim, com autorização judicial'],
        correctAnswer: 2,
        explanation: 'O Art. 20 da Lei 8.213/91 veda a acumulação de mais de um benefício previdenciário do RGPS, salvo exceções.',
      },
      {
        question: 'Qual o percentual inicial do cálculo da aposentadoria pós-reforma?',
        options: ['50% da média', '60% da média', '70% da média', '100% da média'],
        correctAnswer: 1,
        explanation: 'O cálculo inicia em 60% da média de todos os salários de contribuição, com acréscimo de 2% por ano excedente.',
      },
    ],
  },
  {
    id: 6,
    slug: 'aposentadoria-por-idade-e-regras-de-transicao',
    title: 'Aposentadoria por Idade e Regras de Transição',
    description: 'Regras gerais, requisitos urbanos e rurais, cálculo do benefício e regras de transição pós-Reforma da Previdência.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Regra Definitiva da Aposentadoria por Idade',
        content: `**EC 103/2019 — Regra para Novos Filiados**

| Requisito | Homem | Mulher |
| --- | --- | --- |
| Idade mínima | 65 anos | 62 anos |
| Tempo de contribuição | 20 anos | 15 anos |
| Carência | 180 contribuições | 180 contribuições |

**Atenção:** Para homens que já eram segurados antes da reforma, o tempo mínimo de 20 anos aplica-se gradualmente conforme regras de transição.

**Cálculo:** 60% da média de todos os salários desde julho/1994 + 2% por ano que exceder 20 anos (H) ou 15 anos (M).

**Artigo de Lei:** Art. 201, § 7º, CF/88; Arts. 48 e 49 da Lei n.º 8.213/1991.`,
      },
      {
        id: 2,
        title: 'Aposentadoria Rural por Idade',
        content: `**Segurado Especial (Trabalhador Rural)**

| Requisito | Homem | Mulher |
| --- | --- | --- |
| Idade | 60 anos | 55 anos |
| Carência | 180 contribuições (ano safra) | 180 contribuições |

**Comprovação:** Início de prova material + prova testemunhal sobre atividade rural.

**Dica Prática:** A aposentadoria rural exige planejamento documental por décadas — oriente o cliente a preservar ITR, DAP e notas de produtor.

**Artigo de Lei:** Art. 48, § 1º, e Art. 143 da Lei n.º 8.213/1991.`,
      },
      {
        id: 3,
        title: 'Regra dos Pontos (86/96)',
        content: `**Sistema de Pontos**

Soma da idade + tempo de contribuição:
- **Mulher:** 86 pontos + 30 anos de contribuição
- **Homem:** 96 pontos + 35 anos de contribuição

A pontuação aumenta 1 ponto por ano a partir de 2020 até atingir os patamares definitivos.

| Ano | Pontos (M) | Pontos (H) |
| --- | --- | --- |
| 2020 | 87 | 97 |
| 2025 | 92 | 102 |
| 2033 | 100 | 105 |

**Importante:** Exige filiação ao RGPS antes de 13/11/2019.

**Artigo de Lei:** EC n.º 103/2019, art. 15.`,
      },
      {
        id: 4,
        title: 'Idade Mínima Progressiva',
        content: `**Requisitos**

- **Mulher:** 56 anos (2019) + 30 anos de contribuição — idade sobe 6 meses/ano até 62 anos
- **Homem:** 61 anos (2019) + 35 anos de contribuição — idade sobe 6 meses/ano até 65 anos

**Exemplo:** Em 2024, a idade mínima da mulher é 58 anos (56 + 5 semestres).

**Dica Prática:** Compare sistematicamente pontos x idade progressiva x pedágio para cada ano de simulação.

**Artigo de Lei:** EC n.º 103/2019, art. 16.`,
      },
      {
        id: 5,
        title: 'Pedágio 50% e Pedágio 100%',
        content: `**Pedágio 50%**

Para quem faltavam até 2 anos para o tempo mínimo em 13/11/2019:
- Cumprir o tempo que faltava + 50% desse período
- Idade mínima: 57 anos (M) / 60 anos (H)

**Pedágio 100%**

- Idade: 57 anos (M) / 60 anos (H)
- Tempo total: 30/35 anos + 100% do tempo que faltava na data da reforma
- Sem redução por idade

**Atenção:** O pedágio 100% costuma ser vantajoso para quem estava muito próximo da aposentadoria por tempo.

**Artigo de Lei:** EC n.º 103/2019, arts. 20 e 21.`,
      },
      {
        id: 6,
        title: 'Cálculo do Benefício e Planejamento',
        content: `**Fórmula Pós-Reforma**

Valor = 60% × média + (2% × média × anos excedentes)

**Sem descarte dos 20% menores** — todos os salários desde jul/1994 entram na média.

**Planejamento Previdenciário**

1. Extrair CNIS completo
2. Simular todas as regras de transição
3. Verificar períodos rurais ou especiais averbáveis
4. Escolher a data de requerimento mais vantajosa

**Jurisprudência:** Tema 999/STF — opção pelo cálculo da vida toda quando mais benéfico.

**Artigo de Lei:** Art. 29 da Lei n.º 8.213/1991.`,
      },
      {
        id: 7,
        title: 'Controvérsias sobre Aposentadoria por Idade',
        content: `**Temas Recorrentes**

1. Direito adquirido antes da EC 103/2019
2. Conversão de tempo especial em comum
3. Comprovação de atividade rural
4. Revisão da Vida Toda para aposentados

**Súmula 41/TNU:** A perda da qualidade de segurado não prejudica aposentadoria se os requisitos foram preenchidos antes da perda.

**Artigo de Lei:** EC n.º 103/2019; Lei n.º 8.213/1991.`,
      },
    ],
    quiz: [
      {
        question: 'Qual a idade mínima definitiva da mulher na aposentadoria por idade urbana?',
        options: ['60 anos', '62 anos', '65 anos', '57 anos'],
        correctAnswer: 1,
        explanation: 'A EC 103/2019 fixou 62 anos como idade mínima definitiva para mulheres na aposentadoria por idade urbana.',
      },
      {
        question: 'Qual a idade mínima do trabalhador rural (segurado especial) homem?',
        options: ['55 anos', '60 anos', '65 anos', '62 anos'],
        correctAnswer: 1,
        explanation: 'O segurado especial homem aposenta por idade aos 60 anos, com carência de 180 contribuições rurais.',
      },
      {
        question: 'Na regra dos pontos, quantos pontos o homem precisa alcançar?',
        options: ['86', '90', '96', '100'],
        correctAnswer: 2,
        explanation: 'O homem precisa de 96 pontos (idade + tempo de contribuição) e 35 anos de contribuição na regra dos pontos.',
      },
      {
        question: 'O pedágio 50% exige cumprimento de qual percentual do tempo que faltava?',
        options: ['25%', '50%', '75%', '100%'],
        correctAnswer: 1,
        explanation: 'O pedágio 50% exige cumprir o tempo que faltava em 13/11/2019 mais 50% desse período.',
      },
      {
        question: 'Qual o percentual inicial do cálculo da aposentadoria pós-reforma?',
        options: ['50%', '60%', '70%', '100%'],
        correctAnswer: 1,
        explanation: 'O benefício inicia em 60% da média de todos os salários de contribuição desde julho/1994.',
      },
      {
        question: 'A aposentadoria por tempo de contribuição pura foi extinta para quem?',
        options: [
          'Todos os segurados',
          'Novos filiados após 13/11/2019',
          'Apenas servidores públicos',
          'Segurados rurais',
        ],
        correctAnswer: 1,
        explanation: 'A EC 103/2019 extinguiu a aposentadoria por tempo de contribuição para quem se filiou após a reforma.',
      },
    ],
  },
  {
    id: 7,
    slug: 'aposentadoria-especial-e-documentacao',
    title: 'Aposentadoria Especial e Documentação',
    description: 'Agentes nocivos, PPP, LTCAT, comprovação de períodos especiais e requisitos pós-Reforma.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Conceito e Fundamentação da Aposentadoria Especial',
        content: `**Definição**

Benefício concedido ao segurado exposto a agentes nocivos à saúde ou integridade física, em condições especiais de trabalho.

**Base Legal:** Art. 57 da Lei 8.213/91; Decreto 3.048/99 (Anexos IV e V).

**Atenção:** A aposentadoria especial não se confunde com adicional de insalubridade na CLT — são institutos distintos.

**Artigo de Lei:** Arts. 57 a 58 da Lei n.º 8.213/1991.`,
      },
      {
        id: 2,
        title: 'Agentes Nocivos e Tempo de Exposição',
        content: `**Classificação dos Agentes**

| Tipo | Exemplos |
| --- | --- |
| Físicos | Ruído acima de 85 dB, calor, vibração, radiação |
| Químicos | Benzeno, amianto, chumbo, sílica |
| Biológicos | Vírus, bactérias (profissionais de saúde) |

**Tempo de Exposição**

| Tempo | Atividades Típicas |
| --- | --- |
| 15 anos | Mineração subterrânea frente de produção |
| 20 anos | Amianto, radiação ionizante |
| 25 anos | Ruído, químicos, biológicos (regra geral) |

**Artigo de Lei:** Decreto n.º 3.048/1999, Anexos IV e V.`,
      },
      {
        id: 3,
        title: 'PPP e LTCAT: Documentação Essencial',
        content: `**Perfil Profissiográfico Previdenciário (PPP)**

Documento emitido pela empresa desde 2004, com histórico de exposição a agentes nocivos.

**Conteúdo obrigatório:**
- Dados do trabalhador e empresa
- Agentes nocivos e intensidade
- EPIs utilizados e eficácia
- Referência ao LTCAT

**LTCAT (Laudo Técnico das Condições Ambientais de Trabalho)**

Fundamenta tecnicamente as informações do PPP.

**Dica Prática:** Solicite o PPP a todas as empresas do histórico laboral — a ausência pode inviabilizar o reconhecimento.

**Artigo de Lei:** IN INSS/PRES n.º 128/2022; NR-15 e NR-16.`,
      },
      {
        id: 4,
        title: 'Comprovação de Períodos Especiais Anteriores',
        content: `**Documentos Aceitos**

| Período | Documentos |
| --- | --- |
| Até 28/04/1995 | SB-40, DISES, formulários DSS |
| Após 1995 | PPP, LTCAT, laudos periciais |
| Ruído | Medição acima do limite legal |

**SB-40:** Formulário antigo que comprovava exposição antes do PPP.

**Jurisprudência:** O STJ admite prova pericial judicial para suprir ausência de PPP quando há indícios de exposição.

**Artigo de Lei:** Art. 58, § 4º, Lei n.º 8.213/1991.`,
      },
      {
        id: 5,
        title: 'Requisitos Pós-Reforma da Aposentadoria Especial',
        content: `**Idade Mínima (EC 103/2019)**

| Tempo Especial | Idade Mínima |
| --- | --- |
| 15 anos | 55 anos |
| 20 anos | 58 anos |
| 25 anos | 60 anos |

**Cálculo:** 60% da média + 2% por ano que exceder 15/20/25 anos de contribuição.

**Carência:** 180 contribuições.

**Artigo de Lei:** EC n.º 103/2019; Art. 57 da Lei n.º 8.213/1991.`,
      },
      {
        id: 6,
        title: 'Conversão de Tempo Especial em Comum',
        content: `**Multiplicadores**

| Sexo | Fator |
| --- | --- |
| Homem | 1,4 |
| Mulher | 1,2 |

**Exemplo:** 10 anos especiais (homem) = 14 anos comuns.

**Atenção:** A conversão pode ser usada para aposentadoria por idade ou regras de transição, mas não para aposentadoria especial propriamente dita.

**Artigo de Lei:** Art. 57, § 5º, Lei n.º 8.213/1991.`,
      },
      {
        id: 7,
        title: 'Controvérsias e Jurisprudência da Aposentadoria Especial',
        content: `**Temas Litigiosos**

1. Eficácia do EPI para neutralizar agente nocivo
2. Ruído: limite de 85 dB (NR-15) x interpretação do INSS
3. Ausência de PPP e prova emprestada
4. Atividade especial não constante nos anexos

**Tema 1.070/STF:** Discussão sobre neutralização por EPI.

**Dica Prática:** Em ações judiciais, produza perícia técnica ambiental quando o PPP estiver incompleto.

**Artigo de Lei:** Lei n.º 8.213/1991; Decreto n.º 3.048/1999.`,
      },
    ],
    quiz: [
      {
        question: 'Qual documento comprova a exposição a agentes nocivos desde 2004?',
        options: ['CTPS', 'PPP', 'Holerite', 'Contrato de trabalho'],
        correctAnswer: 1,
        explanation: 'O PPP (Perfil Profissiográfico Previdenciário) é o documento obrigatório desde 2004 para comprovar exposição.',
      },
      {
        question: 'Qual a idade mínima para aposentadoria especial com 25 anos de exposição (pós-reforma)?',
        options: ['55 anos', '58 anos', '60 anos', '65 anos'],
        correctAnswer: 2,
        explanation: 'Após a EC 103/2019, o trabalhador com 25 anos de atividade especial precisa de idade mínima de 60 anos.',
      },
      {
        question: 'Qual o fator de conversão de tempo especial para homens?',
        options: ['1,2', '1,4', '2,0', '1,0'],
        correctAnswer: 1,
        explanation: 'O tempo especial do homem é convertido em comum pelo fator 1,4.',
      },
      {
        question: 'Qual o tempo de exposição para atividades com ruído acima de 85 dB (regra geral)?',
        options: ['15 anos', '20 anos', '25 anos', '30 anos'],
        correctAnswer: 2,
        explanation: 'A regra geral para agentes como ruído, químicos e biológicos exige 25 anos de exposição.',
      },
      {
        question: 'O que fundamenta tecnicamente as informações do PPP?',
        options: ['CTPS', 'LTCAT', 'CNIS', 'GFIP'],
        correctAnswer: 1,
        explanation: 'O LTCAT (Laudo Técnico das Condições Ambientais de Trabalho) fundamenta as informações constantes no PPP.',
      },
      {
        question: 'A aposentadoria especial exige carência de quantas contribuições?',
        options: ['12', '24', '120', '180'],
        correctAnswer: 3,
        explanation: 'A aposentadoria especial exige carência de 180 contribuições mensais.',
      },
    ],
  },
  {
    id: 8,
    slug: 'beneficios-por-incapacidade',
    title: 'Benefícios por Incapacidade',
    description: 'Auxílio por incapacidade temporária, aposentadoria por incapacidade permanente, auxílio-acidente, perícia e judicialização.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Auxílio por Incapacidade Temporária (Auxílio-Doença)',
        content: `**Conceito e Requisitos**

Concedido ao segurado temporariamente incapaz para o trabalho por mais de 15 dias consecutivos.

| Requisito | Regra |
| --- | --- |
| Qualidade de segurado | Na data do afastamento |
| Carência | 12 contribuições (dispensada em acidente e doenças do Art. 151) |
| Perícia médica | Obrigatória (INSS) |
| Valor | 91% da média dos salários de contribuição |

**Primeiros 15 dias:** Custeados pelo empregador (empregado celetista).

**Dica Prática:** Protocolar CAT em acidente de trabalho para dispensar carência e facilitar a perícia.

**Artigo de Lei:** Arts. 59 a 63 da Lei n.º 8.213/1991.`,
      },
      {
        id: 2,
        title: 'Aposentadoria por Incapacidade Permanente',
        content: `**Requisitos**

Incapacidade total e permanente para qualquer atividade, sem possibilidade de reabilitação.

| Aspecto | Regra |
| --- | --- |
| Carência | 12 contribuições (dispensada em acidente/doença grave) |
| Cálculo | 60% da média + 2% por ano excedente |
| Revisão | A cada 2 anos pelo INSS |
| Acréscimo 25% | Se necessitar assistência permanente de terceiros |

**Atenção:** A conversão de auxílio temporário em aposentadoria por invalidez depende de nova perícia.

**Artigo de Lei:** Arts. 42 a 47 da Lei n.º 8.213/1991.`,
      },
      {
        id: 3,
        title: 'Auxílio-Acidente e sua Natureza Indenizatória',
        content: `**Conceito**

Benefício devido ao segurado que sofre acidente e fica com sequelas que reduzem a capacidade laboral, sem impedir o trabalho.

| Aspecto | Regra |
| --- | --- |
| Carência | Nenhuma |
| Valor | 50% do salário de benefício |
| Natureza | Indenizatória |
| Acumulação | Com salário e outras aposentadorias (exceto invalidez) |

**Diferença do Auxílio Temporário:** O auxílio-acidente paga sequelas consolidadas; o temporário substitui a renda durante o tratamento.

**Artigo de Lei:** Arts. 86 e 86 da Lei n.º 8.213/1991.`,
      },
      {
        id: 4,
        title: 'Perícia Médica e Administrativa do INSS',
        content: `**Perícia Médica**

Realizada por médico perito federal. Avalia a incapacidade e a data de início (DII).

**Documentos Úteis:** laudos, exames, relatórios de tratamento, histórico clínico.

**Perícia Administrativa (BPC):** Avaliação biopsicossocial para pessoa com deficiência.

**Jurisprudência:** O Judiciário pode antecipar benefício com base em perícia judicial quando o INSS demora (Tema 1.013/STJ).

**Dica Prática:** Prepare o cliente para a perícia: leve exames recentes e descreva limitações funcionais concretas.

**Artigo de Lei:** Decreto n.º 3.048/1999; IN INSS/PRES n.º 128/2022.`,
      },
      {
        id: 5,
        title: 'Acidente de Trabalho x Doença Comum',
        content: `**Acidente de Trabalho (Art. 19, Lei 8.213/91)**

- Acidente típico (no trabalho)
- Doença ocupacional ou do trabalho
- Acidente de trajeto

**Consequências do Enquadramento como Acidente:**

| Benefício | Efeito |
| --- | --- |
| Auxílio temporário | Dispensa de carência |
| Aposentadoria por invalidez | Dispensa de carência |
| Auxílio-acidente | Possível após consolidação |
| Estabilidade (CLT) | 12 meses após alta |

**CAT:** Comunicação de Acidente de Trabalho — deve ser emitida em até 1 dia útil.

**Artigo de Lei:** Arts. 19 a 23 da Lei n.º 8.213/1991.`,
      },
      {
        id: 6,
        title: 'Tutela de Urgência e Judicialização',
        content: `**Antecipação de Tutela**

Possível quando há prova inequívoca da incapacidade e do direito ao benefício.

**Prova Pericial Judicial:** Substitui ou complementa a perícia do INSS.

**Demora do INSS:** Justifica tutela de urgência para restabelecer renda.

**Súmula 729/STF:** O auxílio-doença não será concedido quando o segurado estiver exercendo atividade que o INSS entenda incompatível (controvérsia).

**Artigo de Lei:** CPC/2015, art. 300; Lei n.º 8.213/1991.`,
      },
      {
        id: 7,
        title: 'Controvérsias nos Benefícios por Incapacidade',
        content: `**Temas Atuais**

1. Nexo técnico epidemiológico (NTEP) em doenças ocupacionais
2. Limite de 15 dias pagos pelo empregador
3. Revisão de aposentadoria por invalidez
4. Auxílio-doença durante pandemia e teleperícia

**Importante:** A alta médica programada não impede recurso se a incapacidade persistir.

**Artigo de Lei:** Lei n.º 8.213/1991; jurisprudência STJ/STF.`,
      },
    ],
    quiz: [
      {
        question: 'O auxílio-acidente pode ser acumulado com salário?',
        options: ['Não', 'Sim, por natureza indenizatória', 'Apenas por 6 meses', 'Somente com autorização do empregador'],
        correctAnswer: 1,
        explanation: 'O auxílio-acidente é indenizatório e pode ser recebido cumulativamente com remuneração do trabalho.',
      },
      {
        question: 'Qual o acréscimo para aposentado por invalidez que necessita de assistência de terceiros?',
        options: ['15%', '20%', '25%', '30%'],
        correctAnswer: 2,
        explanation: 'O Art. 45 da Lei 8.213/91 prevê acréscimo de 25% sobre o valor do benefício.',
      },
      {
        question: 'Quem paga os primeiros 15 dias de afastamento do empregado celetista?',
        options: ['INSS', 'Empregador', 'Segurado', 'Sindicato'],
        correctAnswer: 1,
        explanation: 'Os primeiros 15 dias de afastamento por incapacidade são pagos pelo empregador ao empregado celetista.',
      },
      {
        question: 'A carência do auxílio por incapacidade temporária é dispensada em caso de:',
        options: ['Doença comum leve', 'Acidente de qualquer natureza', 'Aposentadoria anterior', 'Desemprego'],
        correctAnswer: 1,
        explanation: 'A carência é dispensada em caso de acidente de qualquer natureza e doenças graves listadas no Art. 151.',
      },
      {
        question: 'Qual o valor do auxílio-acidente em relação ao salário de benefício?',
        options: ['30%', '50%', '91%', '100%'],
        correctAnswer: 1,
        explanation: 'O auxílio-acidente corresponde a 50% do salário de benefício.',
      },
      {
        question: 'O que é a CAT?',
        options: [
          'Certidão de Aposentadoria por Tempo',
          'Comunicação de Acidente de Trabalho',
          'Cadastro de Afastamento Temporário',
          'Cálculo de Aposentadoria por Tempo',
        ],
        correctAnswer: 1,
        explanation: 'A CAT (Comunicação de Acidente de Trabalho) deve ser emitida para registrar acidentes e doenças ocupacionais.',
      },
    ],
  },
  {
    id: 9,
    slug: 'pensao-por-morte-e-auxilio-reclusao',
    title: 'Pensão por Morte e Auxílio-Reclusão',
    description: 'Requisitos, cálculo em cotas, duração do benefício, classes de dependentes e auxílio-reclusão.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Pensão por Morte: Requisitos e Concessão',
        content: `**Requisitos**

| Requisito | Descrição |
| --- | --- |
| Óbito do segurado | Obrigatório ou facultativo |
| Qualidade de segurado | Na data do óbito ou período de graça |
| Dependente | Conforme Art. 16 da Lei 8.213/91 |
| Carência | Nenhuma |

**Atenção:** A pensão independe de carência, mas exige qualidade de segurado do instituidor.

**Artigo de Lei:** Arts. 74 a 79 da Lei n.º 8.213/1991.`,
      },
      {
        id: 2,
        title: 'Cálculo em Cotas e Rateio',
        content: `**Sistema de Cotas (pós EC 103/2019)**

- Cota base: 50%
- Cota adicional: 10% por dependente (máximo 100%)

**Exemplo:** Viúva + 2 filhos = 50% + 10% + 10% = 70%

**Extinção de cota:** Quando dependente perde a qualidade (ex.: filho completa 21 anos), a cota de 10% extingue-se.

**Rateio:** O valor é dividido entre os dependentes da mesma classe.

**Artigo de Lei:** Art. 77 da Lei n.º 8.213/1991.`,
      },
      {
        id: 3,
        title: 'Duração da Pensão para Cônjuge e Companheiro(a)',
        content: `**Pensão Vitalícia de 4 Meses**

Quando casamento/união tiver menos de 2 anos OU instituidor tiver menos de 18 contribuições.

**Duração Gradual (casamento > 2 anos):**

| Idade do Cônjuge | Duração |
| --- | --- |
| Até 21 anos | 3 anos |
| 22 a 26 anos | 6 anos |
| 27 a 29 anos | 10 anos |
| 30 a 40 anos | 15 anos |
| 41 a 43 anos | 20 anos |
| Acima de 44 anos | Vitalícia |

**Artigo de Lei:** Art. 77, § 2º, V, Lei n.º 8.213/1991.`,
      },
      {
        id: 4,
        title: 'Classes de Dependentes e Exclusão',
        content: `**Classes (Art. 16)**

| Classe | Quem são | Dependência |
| --- | --- | --- |
| I | Cônjuge, companheiro, filhos | Presumida |
| II | Pais | Comprovada |
| III | Irmãos | Comprovada |

**Exclusão:** Classe I exclui II e III; Classe II exclui III.

**Filho inválido ou com deficiência:** Sem limite de idade.

**Artigo de Lei:** Arts. 16 a 18 da Lei n.º 8.213/1991.`,
      },
      {
        id: 5,
        title: 'Auxílio-Reclusão',
        content: `**Conceito**

Benefício aos dependentes do segurado de baixa renda recolhido à prisão em regime fechado.

| Requisito | Regra |
| --- | --- |
| Baixa renda | Último salário ≤ limite legal |
| Regime | Fechado |
| Carência | 24 contribuições |
| Qualidade | Na data da prisão |

**Suspensão:** Durante fuga ou livramento condicional.

**Valor:** Mesma regra de cotas da pensão por morte.

**Artigo de Lei:** Art. 80 da Lei n.º 8.213/1991.`,
      },
      {
        id: 6,
        title: 'Acumulação e Planejamento Sucessório',
        content: `**Acumulações Permitidas**

- Pensão por morte + aposentadoria própria
- Pensão + auxílio-reclusão (mesmo instituidor)
- Pensão + salário (em alguns casos)

**Planejamento:** Verifique duração da pensão para cônjuge jovem e impacto na renda familiar.

**Dica Prática:** Calcule o valor líquido após extinção de cotas de filhos que completam 21 anos.

**Artigo de Lei:** Art. 20 da Lei n.º 8.213/1991.`,
      },
      {
        id: 7,
        title: 'Controvérsias sobre Pensão e Auxílio-Reclusão',
        content: `**Temas Litigiosos**

1. União estável sem documento
2. Dependência econômica de pais idosos
3. Pensão vitalícia x duração limitada
4. Auxílio-reclusão e regime semiaberto

**Jurisprudência:** STJ reconhece pensão a companheiro(a) mediante prova da união estável.

**Artigo de Lei:** Lei n.º 8.213/1991.`,
      },
    ],
    quiz: [
      {
        question: 'A pensão por morte exige carência de quantas contribuições?',
        options: ['12', '24', '180', 'Nenhuma'],
        correctAnswer: 3,
        explanation: 'A pensão por morte não exige carência, mas exige qualidade de segurado do instituidor na data do óbito.',
      },
      {
        question: 'Qual o percentual da cota base da pensão por morte?',
        options: ['30%', '40%', '50%', '60%'],
        correctAnswer: 2,
        explanation: 'A cota base da pensão por morte é de 50% do valor da aposentadoria do instituidor.',
      },
      {
        question: 'Qual a duração da pensão para cônjuge entre 30 e 40 anos (casamento > 2 anos)?',
        options: ['10 anos', '15 anos', '20 anos', 'Vitalícia'],
        correctAnswer: 1,
        explanation: 'Para cônjuge entre 30 e 40 anos, a pensão tem duração de 15 anos.',
      },
      {
        question: 'Qual a carência do auxílio-reclusão?',
        options: ['12', '24', '180', 'Nenhuma'],
        correctAnswer: 1,
        explanation: 'O auxílio-reclusão exige carência de 24 contribuições mensais.',
      },
      {
        question: 'Quais dependentes têm dependência econômica presumida?',
        options: ['Pais', 'Irmãos', 'Cônjuge e filhos da Classe I', 'Todos os parentes'],
        correctAnswer: 2,
        explanation: 'Os dependentes de Classe I têm dependência econômica presumida em lei.',
      },
      {
        question: 'Quando a pensão ao cônjuge é vitalícia de apenas 4 meses?',
        options: [
          'Sempre',
          'Casamento com menos de 2 anos ou instituidor com menos de 18 contribuições',
          'Cônjuge com mais de 60 anos',
          'Quando há filhos menores',
        ],
        correctAnswer: 1,
        explanation: 'A pensão de 4 meses aplica-se quando o casamento tem menos de 2 anos ou o instituidor tinha menos de 18 contribuições.',
      },
    ],
  },
  {
    id: 10,
    slug: 'beneficio-de-prestacao-continuada-bpc-loas',
    title: 'Benefício de Prestação Continuada (BPC/LOAS)',
    description: 'Benefício assistencial ao idoso e à pessoa com deficiência, critérios de miserabilidade, processo e judicialização.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Fundamentação e Natureza do BPC/LOAS',
        content: `**Conceito**

Benefício assistencial de 1 salário mínimo mensal ao idoso (65+) ou pessoa com deficiência de baixa renda.

| Característica | BPC | Benefício Previdenciário |
| --- | --- | --- |
| Contributivo | Não | Sim |
| 13º salário | Não | Sim |
| Pensão por morte | Não deixa | Pode deixar |
| Natureza | Assistencial | Previdenciária |

**Base Legal:** Lei n.º 8.742/1993 (LOAS); Art. 203, CF/88.

**Artigo de Lei:** Lei n.º 8.742/1993; Art. 203 da CF/88.`,
      },
      {
        id: 2,
        title: 'Requisitos para o Idoso e para a Pessoa com Deficiência',
        content: `**Idoso (Art. 20, LOAS)**

- 65 anos ou mais
- Renda per capita familiar inferior a 1/4 do SM
- Não receber outro benefício da Seguridade (exceto assistência médica)

**Pessoa com Deficiência**

- Impedimento de longo prazo (físico, mental, intelectual ou sensorial)
- Obstáculo à participação plena na sociedade
- Avaliação biopsicossocial pelo INSS

**Atenção:** A deficiência deve ser comprovada por avaliação médica e social, não apenas por laudo particular.

**Artigo de Lei:** Art. 20, §§ 2º a 11, Lei n.º 8.742/1993.`,
      },
      {
        id: 3,
        title: 'Critério de Renda e Miserabilidade',
        content: `**Critério Legal**

Renda familiar per capita inferior a 1/4 do salário mínimo.

**Composição da Família**

Requerente, cônjuge, pais, irmãos solteiros, filhos e enteados solteiros no mesmo domicílio.

**Tema 27/STF (RE 580.963):** O critério de 1/4 do SM não é absoluto — pode ser relativizado diante de circunstâncias que demonstrem miserabilidade.

**Dica Prática:** Em ações judiciais, demonstre gastos com saúde, medicamentos e aluguel que comprometem a renda.

**Artigo de Lei:** Art. 20, § 3º, Lei n.º 8.742/1993; STF Tema 27.`,
      },
      {
        id: 4,
        title: 'Avaliação Biopsicossocial e Perícia',
        content: `**Processo de Avaliação (PcD)**

1. Avaliação social (assistente social)
2. Avaliação médica (médico perito)
3. Análise conjunta da deficiência e do grau de impedimento

**Revisão a cada 2 anos** para pessoa com deficiência.

**Documentos:** laudos, relatórios escolares, histórico de tratamento, CID.

**Jurisprudência:** Tribunais admitem prova pericial judicial quando a perícia do INSS é contraditória.

**Artigo de Lei:** Decreto n.º 6.214/2007; IN INSS/PRES n.º 128/2022.`,
      },
      {
        id: 5,
        title: 'Processo Administrativo do BPC',
        content: `**Etapas**

1. Agendamento (Meu INSS ou 135)
2. Entrega de documentos (identidade, CPF, comprovante de residência, renda)
3. Avaliação social e médica (PcD)
4. Decisão do INSS (prazo de 45 a 90 dias)

**Indeferimento:** Recurso ao CRPS em 30 dias.

**CadÚnico:** Inscrição obrigatória para concessão e manutenção.

**Artigo de Lei:** Lei n.º 8.742/1993; Decreto n.º 6.214/2007.`,
      },
      {
        id: 6,
        title: 'Judicialização do BPC',
        content: `**Motivos da Judicialização**

- Critério de renda aplicado rigidamente
- Negativa de deficiência pelo INSS
- Demora excessiva na análise

**Tutela de Urgência:** Possível quando demonstrada miserabilidade e probabilidade do direito.

**Competência:** Juizados Especiais Federais (JEF) ou Vara Federal.

**Dica Prática:** Una laudos médicos atualizados com relatório social detalhado sobre as despesas da família.

**Artigo de Lei:** Lei n.º 10.259/2001 (JEF).`,
      },
      {
        id: 7,
        title: 'Controvérsias do BPC/LOAS',
        content: `**Temas em Debate**

1. Flexibilização do critério de 1/4 do SM
2. Acumulação com auxílio por incapacidade temporária
3. BPC e transferência de renda (Bolsa Família)
4. Revisão e cessação indevida do benefício

**Importante:** O BPC não pode ser acumulado com outro benefício da Seguridade, salvo assistência médica.

**Artigo de Lei:** Lei n.º 8.742/1993; jurisprudência STF/STJ.`,
      },
    ],
    quiz: [
      {
        question: 'Qual o valor mensal do BPC/LOAS?',
        options: ['Meio salário mínimo', 'Um salário mínimo', 'Dois salários mínimos', 'Varia conforme contribuições'],
        correctAnswer: 1,
        explanation: 'O BPC garante o pagamento de 1 salário mínimo mensal ao idoso ou pessoa com deficiência em situação de vulnerabilidade.',
      },
      {
        question: 'O BPC gera direito a 13º salário e pensão por morte?',
        options: ['Sim, para ambos', 'Gera 13º, mas não pensão', 'Não gera 13º nem pensão por morte', 'Gera pensão, mas não 13º'],
        correctAnswer: 2,
        explanation: 'Por ser benefício assistencial, o BPC não gera 13º salário nem deixa pensão por morte.',
      },
      {
        question: 'Qual a idade mínima para o BPC ao idoso?',
        options: ['60 anos', '62 anos', '65 anos', '70 anos'],
        correctAnswer: 2,
        explanation: 'O BPC ao idoso exige idade mínima de 65 anos completos.',
      },
      {
        question: 'O critério de renda de 1/4 do salário mínimo é absoluto?',
        options: [
          'Sim, sem exceções',
          'Não, pode ser relativizado conforme Tema 27/STF',
          'Apenas para pessoas com deficiência',
          'Somente na via judicial',
        ],
        correctAnswer: 1,
        explanation: 'O STF (Tema 27) reconheceu que o critério de 1/4 do SM pode ser relativizado diante da miserabilidade comprovada.',
      },
      {
        question: 'Com que periodicidade o BPC da pessoa com deficiência é revisado?',
        options: ['Anualmente', 'A cada 2 anos', 'A cada 5 anos', 'Nunca'],
        correctAnswer: 1,
        explanation: 'O BPC da pessoa com deficiência está sujeito a revisão a cada 2 anos quanto à manutenção da deficiência.',
      },
      {
        question: 'O BPC é benefício de natureza:',
        options: ['Previdenciária contributiva', 'Assistencial não contributiva', 'Trabalhista', 'Tributária'],
        correctAnswer: 1,
        explanation: 'O BPC é benefício assistencial, não exigindo contribuições prévias ao RGPS.',
      },
    ],
  },
  {
    id: 11,
    slug: 'processo-administrativo-previdenciario-pap',
    title: 'Processo Administrativo Previdenciário (PAP)',
    description: 'Fases do PAP junto ao INSS, instrução de provas, recursos no CRPS e relação com a via judicial.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Fundamentos e Princípios do PAP',
        content: `**Base Legal**

Lei n.º 9.784/1999 (processo administrativo federal) + normas previdenciárias específicas.

**Princípios Aplicáveis**

| Princípio | Aplicação no PAP |
| --- | --- |
| Legalidade | INSS só pode agir conforme a lei |
| Imparcialidade | Decisão técnica e objetiva |
| Contraditório | Segurado pode se manifestar |
| Ampla defesa | Produção de provas |
| Formalismo moderado | Formalidades não impedem análise do mérito |

**Artigo de Lei:** Lei n.º 9.784/1999; Lei n.º 8.213/1991.`,
      },
      {
        id: 2,
        title: 'Fase de Requerimento e Exigências',
        content: `**Como Requerer**

- Site Meu INSS (gov.br/meuinss)
- Central 135
- Agências da Previdência Social

**Prazo para Decisão:** 30 a 90 dias conforme complexidade.

**Cumprimento de Exigência:** 30 dias (prorrogável) para entregar documentos solicitados pelo INSS.

**Dica Prática:** Guarde o protocolo e o número do requerimento — são essenciais para recursos e ações judiciais.

**Artigo de Lei:** Lei n.º 9.784/1999; IN INSS/PRES n.º 128/2022.`,
      },
      {
        id: 3,
        title: 'Instrução do Processo e Dever de Fundamentar',
        content: `**Dever de Instrução**

O INSS deve buscar a verdade real, solicitando documentos e realizando perícias necessárias.

**CNIS:** Principal fonte de dados sobre vínculos e contribuições.

**Decisão Fundamentada:** Deve indicar motivos de fato e de direito. Decisão genérica é nula.

**Indeferimento:** Deve ser claro sobre o recurso cabível e o prazo.

**Artigo de Lei:** Lei n.º 9.784/1999, art. 2º, parágrafo único, IV.`,
      },
      {
        id: 4,
        title: 'Perícia Médica e Avaliação Social no PAP',
        content: `**Perícia Médica**

Obrigatória para benefícios por incapacidade. Define DII (data de início da incapacidade) e DCB.

**Avaliação Social**

Obrigatória para BPC/LOAS à pessoa com deficiência.

**Não Comparecimento:** Pode levar ao arquivamento do pedido — reagende pelo Meu INSS.

**Artigo de Lei:** Decreto n.º 3.048/1999.`,
      },
      {
        id: 5,
        title: 'Recursos no CRPS',
        content: `**Estrutura do CRPS**

| Instância | Órgão | Competência |
| --- | --- | --- |
| 1ª | Junta de Recursos | Recursos ordinários |
| 2ª | Câmara de Julgamento | Recursos contra Junta |
| 3ª | Conselho Pleno | Recursos especiais |

**Prazo:** 30 dias para recurso ordinário.

**Efeito Suspensivo:** Sim, na via administrativa.

**Artigo de Lei:** Lei n.º 9.784/1999; Decreto n.º 3.048/1999.`,
      },
      {
        id: 6,
        title: 'Revisão Administrativa e Revisão de Ofício',
        content: `**Revisão a Pedido do Segurado**

Até 10 anos da concessão (prazo decadencial do Art. 103).

**Revisão de Ofício pelo INSS**

Quando constata erro que prejudique a Previdência ou o segurado.

**Correção de Erro Material:** Sem prazo decadencial.

**Artigo de Lei:** Art. 103 da Lei n.º 8.213/1991.`,
      },
      {
        id: 7,
        title: 'Via Judicial e Esgotamento Administrativo',
        content: `**Acesso ao Judiciário**

Não é obrigatório esgotar a via administrativa (SV 5/STF em matéria disciplinar — aplicável por analogia à necessidade de defesa).

**Competência:** Justiça Federal (JEF ou Vara Federal).

**Prova emprestada:** Decisão do CRPS pode ser usada na ação judicial.

**Dica Prática:** Avalie se o recurso administrativo é estratégico antes de ajuizar — em alguns casos, a demora do CRPS compensa; em outros, a tutela judicial é mais rápida.

**Artigo de Lei:** CF/88, art. 109; Lei n.º 10.259/2001.`,
      },
    ],
    quiz: [
      {
        question: 'Onde se interpõe recurso contra indeferimento do INSS na via administrativa?',
        options: ['Justiça Federal diretamente', 'CRPS (Junta de Recursos)', 'Ministério do Trabalho', 'MPF'],
        correctAnswer: 1,
        explanation: 'O recurso administrativo é julgado pelo CRPS, iniciando na Junta de Recursos.',
      },
      {
        question: 'Qual o prazo para recurso ordinário contra decisão do INSS?',
        options: ['10 dias', '15 dias', '30 dias', '60 dias'],
        correctAnswer: 2,
        explanation: 'O prazo para recurso ordinário é de 30 dias contados da ciência da decisão.',
      },
      {
        question: 'O INSS deve fundamentar suas decisões administrativas?',
        options: ['Não, pode decidir sumariamente', 'Sim, indicando motivos de fato e de direito', 'Apenas em benefícios acima do teto', 'Somente se o segurado solicitar'],
        correctAnswer: 1,
        explanation: 'A Lei 9.784/99 exige decisão fundamentada com motivação de fato e de direito.',
      },
      {
        question: 'Qual o principal banco de dados de vínculos previdenciários?',
        options: ['eSocial', 'CNIS', 'RAIS', 'CAGED'],
        correctAnswer: 1,
        explanation: 'O CNIS (Cadastro Nacional de Informações Sociais) consolida vínculos e contribuições do segurado.',
      },
      {
        question: 'O recurso administrativo tem efeito suspensivo?',
        options: ['Não', 'Sim', 'Apenas para aposentadoria', 'Somente com depósito'],
        correctAnswer: 1,
        explanation: 'O recurso administrativo previdenciário tem efeito suspensivo, mantendo suspensa a decisão recorrida.',
      },
      {
        question: 'Qual lei regula o processo administrativo federal?',
        options: ['Lei 8.213/91', 'Lei 9.784/99', 'Lei 8.742/93', 'Lei 8.212/91'],
        correctAnswer: 1,
        explanation: 'A Lei n.º 9.784/1999 disciplina o processo administrativo no âmbito da Administração Pública Federal.',
      },
    ],
  },
  {
    id: 12,
    slug: 'revisoes-de-beneficios-e-pratica-advocaticia',
    title: 'Revisões de Benefícios e Prática Advocatícia',
    description: 'Teses de revisão, prazos decadenciais, prática advocatícia previdenciária e simulações.',
    duration: '6h',
    sections: [
      {
        id: 1,
        title: 'Prazo Decadencial e Prescrição nas Revisões',
        content: `**Decadência (Art. 103, Lei 8.213/91)**

10 anos para pleitear revisão do ato de concessão, contados do 1º dia do mês seguinte ao recebimento da 1ª prestação.

**Não se aplica a:**
- Revisão de ofício pelo INSS
- Correção de erro material
- Benefícios anteriores à Lei 9.528/97 (em parte)

**Prescrição das Parcelas:** 5 anos (contagem retroativa a partir da distribuição da ação).

**Artigo de Lei:** Art. 103 da Lei n.º 8.213/1991; Art. 54 da Lei n.º 9.528/1997.`,
      },
      {
        id: 2,
        title: 'Revisão da Vida Toda (Tema 999/STF)',
        content: `**Conceito**

Direito de optar pelo cálculo que considere todas as contribuições (inclusive anteriores a julho/1994) quando mais favorável que a média dos 80% maiores salários.

**Impacto:** Aposentados com salários altos antes de 1994 podem aumentar significativamente o benefício.

**Status:** Direito reconhecido pelo STF (RE 1.276.977).

**Dica Prática:** Compare os dois cálculos antes de propor a revisão — nem sempre a vida toda é mais vantajosa.

**Artigo de Lei:** Art. 29 da Lei n.º 8.213/1991; STF Tema 999.`,
      },
      {
        id: 3,
        title: 'Outras Teses de Revisão Relevantes',
        content: `**Principais Teses**

| Tese | Objeto |
| --- | --- |
| Buraco Negro (Tema 1.100/STF) | Meses sem contribuição no fator previdenciário |
| Art. 29, II | Inclusão de todos os salários (80% x 100%) |
| Conversão de tempo especial | Períodos não reconhecidos |
| Desaposentação (Tema 503) | Vedada pelo STF |

**Revisão por Equiparação:** Quando o INSS aplicou índice de correção inferior ao devido.

**Artigo de Lei:** Lei n.º 8.213/1991; jurisprudência STF/STJ.`,
      },
      {
        id: 4,
        title: 'Revisão de Ofício pelo INSS',
        content: `**Hipóteses**

- Erro que prejudique a Previdência ou o segurado
- Fraude ou má-fé
- Documentos falsos

**Efeito:** Pode aumentar ou reduzir o benefício.

**Defesa:** O segurado deve ser notificado e pode apresentar defesa.

**Atenção:** A revisão de ofício que reduz benefício exige processo com contraditório.

**Artigo de Lei:** Art. 103 da Lei n.º 8.213/1991.`,
      },
      {
        id: 5,
        title: 'Prática Advocatícia Previdenciária',
        content: `**Atuação do Advogado**

1. Análise do CNIS e documentação
2. Requerimento administrativo (Meu INSS)
3. Recurso ao CRPS quando necessário
4. Ação judicial com pedido de tutela de urgência
5. Execução de sentença e revisões

**Honorários:** Contratuais, sucumbenciais ou assistenciais (Defensoria).

**Ética:** Transparência sobre chances de êxito e custos processuais.

**Artigo de Lei:** Estatuto da OAB; CPC/2015.`,
      },
      {
        id: 6,
        title: 'Simulações, CNIS e Planejamento',
        content: `**Ferramentas**

- Meu INSS (simulador)
- CNIS completo
- Planilhas de cálculo especializadas
- Sistemas jurídicos (Jusprev, Prevjud etc.)

**Planejamento:** Compare regras de transição, data de requerimento e teses de revisão.

**Dica Prática:** Antes de ajuizar revisão, calcule o valor das parcelas retroativas (prescrição quinquenal) x custos do processo.

**Artigo de Lei:** IN INSS/PRES n.º 128/2022.`,
      },
      {
        id: 7,
        title: 'Perspectivas e Atualização Profissional',
        content: `**Tendências**

- Digitalização do PAP (100% digital)
- Teleperícia médica
- Reformas paramétricas em discussão
- Uso de IA na análise de processos

**Atualização:** Acompanhe súmulas, temas de repercussão geral e instruções normativas do INSS.

**Atenção:** A advocacia previdenciária exige estudo contínuo — a legislação e a jurisprudência mudam com frequência.

**Artigo de Lei:** EC n.º 103/2019; portarias e instruções normativas do INSS.`,
      },
    ],
    quiz: [
      {
        question: 'Qual o prazo decadencial para revisão do ato de concessão?',
        options: ['5 anos', '10 anos', '20 anos', 'Sem prazo'],
        correctAnswer: 1,
        explanation: 'O direito de pleitear revisão decai em 10 anos (Art. 103, Lei 8.213/91).',
      },
      {
        question: 'A Revisão da Vida Toda permite considerar:',
        options: [
          'Apenas salários após 1994',
          'Todas as contribuições quando mais favorável',
          'Apenas tempo rural',
          'Somente os 20% maiores salários',
        ],
        correctAnswer: 1,
        explanation: 'O Tema 999/STF permite optar pelo cálculo com todas as contribuições quando resultar em benefício maior.',
      },
      {
        question: 'Qual o prazo de prescrição das parcelas em ação de revisão?',
        options: ['2 anos', '5 anos', '10 anos', '20 anos'],
        correctAnswer: 1,
        explanation: 'As parcelas anteriores aos 5 anos que precedem o ajuizamento da ação estão prescritas.',
      },
      {
        question: 'A desaposentação (renúncia à aposentadoria) é permitida?',
        options: ['Sim, sempre', 'Sim, com pedágio', 'Vedada pelo STF (Tema 503)', 'Apenas para aposentadoria especial'],
        correctAnswer: 2,
        explanation: 'O STF (Tema 503) vedou a desaposentação para obter novo benefício mais vantajoso.',
      },
      {
        question: 'A revisão de ofício pelo INSS pode:',
        options: [
          'Apenas aumentar o benefício',
          'Aumentar ou reduzir o benefício',
          'Apenas reduzir',
          'Ser feita sem notificação',
        ],
        correctAnswer: 1,
        explanation: 'A revisão de ofício pode corrigir erros em favor ou contra o segurado, com observância do contraditório.',
      },
      {
        question: 'Qual documento é essencial na análise prévia de qualquer caso previdenciário?',
        options: ['CTPS apenas', 'CNIS', 'Contrato social', 'IPTU'],
        correctAnswer: 1,
        explanation: 'O CNIS consolida vínculos e contribuições e é a principal base para simulações e revisões.',
      },
    ],
  },
];
