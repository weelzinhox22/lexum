export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GeneralExam {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const generalExam: GeneralExam = {
  id: 'exam-geral',
  title: 'Prova Geral - Direito Previdenciário',
  description: 'Avaliação abrangente com uma questão de cada módulo do curso.',
  questions: [
    // Módulo 1: Introdução ao Direito Previdenciário
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
    // Módulo 2: Regime Geral de Previdência Social (RGPS)
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
    // Módulo 3: Qualidade de Segurado e Carência
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
    // Módulo 4: Segurados e Dependentes
    {
      question: 'Quem é considerado empregado doméstico para fins previdenciários?',
      options: [
        'Qualquer pessoa que trabalhe em residência particular',
        'Pessoa que presta serviço contínuo a pessoa ou família em âmbito residencial, com subordinação e habitualidade',
        'Apenas trabalhadores com registro em CTPS',
        'Trabalhadores que recebem salário mínimo'
      ],
      correctAnswer: 1,
      explanation: 'O empregado doméstico é a pessoa física que presta serviço de natureza contínua a pessoa ou família, em âmbito residencial, em caráter não eventual, com subordinação e mediante remuneração (LC 150/2015).'
    },
    // Módulo 5: Benefícios Previdenciários: Visão Geral
    {
      question: 'Qual benefício é de natureza exclusivamente assistencial?',
      options: [
        'Aposentadoria por idade',
        'Pensão por morte',
        'BPC/LOAS',
        'Auxílio por incapacidade temporária'
      ],
      correctAnswer: 2,
      explanation: 'O Benefício de Prestação Continuada (BPC/LOAS) é de natureza assistencial, não previdenciária, sendo concedido a idosos e pessoas com deficiência em situação de miserabilidade, sem exigência de contribuição.'
    },
    // Módulo 6: Aposentadoria por Idade e Regras de Transição
    {
      question: 'Qual a idade mínima definitiva da mulher na aposentadoria por idade urbana?',
      options: [
        '60 anos',
        '62 anos',
        '65 anos',
        '57 anos'
      ],
      correctAnswer: 1,
      explanation: 'A EC 103/2019 estabeleceu a idade mínima definitiva de 62 anos para a mulher na aposentadoria por idade urbana (Art. 201, § 7º, CF/88).'
    },
    // Módulo 7: Aposentadoria Especial e Documentação
    {
      question: 'Qual documento comprova a exposição a agentes nocivos desde 2004?',
      options: [
        'CTPS',
        'PPP',
        'Holerite',
        'Contrato de trabalho'
      ],
      correctAnswer: 1,
      explanation: 'O PPP (Perfil Profissiográfico Previdenciário) é o documento obrigatório para comprovação da exposição a agentes nocivos desde 2004, conforme Lei 9.528/97 e IN 77/2015.'
    },
    // Módulo 8: Benefícios por Incapacidade
    {
      question: 'O auxílio-acidente pode ser acumulado com salário?',
      options: [
        'Não',
        'Sim, por natureza indenizatória',
        'Apenas por 6 meses',
        'Somente com autorização do empregador'
      ],
      correctAnswer: 1,
      explanation: 'O auxílio-acidente é de natureza indenizatória e pode ser acumulado com salário, pois visa compensar a redução da capacidade laboral do segurado (Art. 86, Lei 8.213/91).'
    },
    // Módulo 9: Pensão por Morte e Auxílio-Reclusão
    {
      question: 'A pensão por morte exige carência de quantas contribuições?',
      options: [
        '12',
        '24',
        '180',
        'Nenhuma'
      ],
      correctAnswer: 3,
      explanation: 'A pensão por morte não exige carência (Art. 26, I, Lei 8.213/91), mas exige que o instituidor mantenha a qualidade de segurado na data do óbito ou esteja dentro do período de graça.'
    },
    // Módulo 10: Benefício de Prestação Continuada (BPC/LOAS)
    {
      question: 'Qual o valor mensal do BPC/LOAS?',
      options: [
        'Meio salário mínimo',
        'Um salário mínimo',
        'Dois salários mínimos',
        'Varia conforme contribuições'
      ],
      correctAnswer: 1,
      explanation: 'O BPC/LOAS é pago no valor de um salário mínimo mensal, conforme Art. 20 da Lei 8.742/1993 (LOAS).'
    },
    // Módulo 11: Processo Administrativo Previdenciário (PAP)
    {
      question: 'Onde se interpõe recurso contra indeferimento do INSS na via administrativa?',
      options: [
        'Justiça Federal diretamente',
        'CRPS (Junta de Recursos)',
        'Ministério do Trabalho',
        'MPF'
      ],
      correctAnswer: 1,
      explanation: 'O recurso contra decisão do INSS deve ser interposto ao Conselho de Recursos da Previdência Social (CRPS), começando pela Junta de Recursos (1ª instância administrativa).'
    },
    // Módulo 12: Revisões de Benefícios e Prática Advocatícia
    {
      question: 'Qual o prazo decadencial para revisão do ato de concessão?',
      options: [
        '5 anos',
        '10 anos',
        '20 anos',
        'Sem prazo'
      ],
      correctAnswer: 1,
      explanation: 'O prazo decadencial para revisão do ato de concessão é de 10 anos, conforme Art. 103 da Lei 8.213/91, contados da data do primeiro pagamento ou da data da ciência da decisão indeferitória.'
    }
  ]
};
