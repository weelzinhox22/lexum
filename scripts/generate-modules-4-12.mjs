import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'src', 'data', 'modules-4-12.ts');

const section = (id, title, body) => ({
  id,
  title,
  content: body.trim(),
});

const quiz = (question, options, correctAnswer, explanation) => ({
  question,
  options,
  correctAnswer,
  explanation,
});

const mod = (id, slug, title, description, sections, quizItems) => ({
  id,
  slug,
  title,
  description,
  duration: '6h',
  sections,
  quiz: quizItems,
});

const modules = [
  mod(
    4,
    'segurados-e-dependentes',
    'Segurados e Dependentes',
    'Classificação dos segurados obrigatórios e facultativos, dependentes, inscrição no RGPS e controvérsias práticas.',
    [
      section(1, 'Empregado, Empregado Doméstico e Vínculo Empregatício', `**Conceito de Empregado (Art. 12, Lei 8.213/91)**

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
| FGTS | Obrigatório desde a reforma |

**Atenção:** Motorista de aplicativo, entregador e trabalhador de plataforma digital têm enquadramento controvertido. O STF (ADI 5.870) e o STJ analisam caso a caso a subordinação algorítmica.

**Dica Prática:** Na ausência de CTPS, comprove o vínculo por holerites, extratos bancários, testemunhas e mensagens que demonstrem habitualidade e subordinação.

**Artigo de Lei:** Arts. 11, I, e 12 da Lei n.º 8.213/1991; LC n.º 150/2015.`),
      section(2, 'Contribuinte Individual, MEI e Trabalhador Avulso', `**Contribuinte Individual (Art. 11, V, Lei 8.213/91)**

Exerce atividade por conta própria, sem vínculo empregatício: autônomos, profissionais liberais, sócios que recebem pró-labore, cooperados, corretores autônomos.

| Categoria | Alíquota Segurado | Observação |
| --- | --- | --- |
| Contribuinte individual (plano normal) | 20% | Sobre remuneração até o teto |
| Plano simplificado | 11% | Sem aposentadoria programada |
| MEI | 5% do salário mínimo (via DAS) | Direito a aposentadoria por idade, auxílio-doença, salário-maternidade e pensão |

**Microempreendedor Individual (MEI)**

O MEI recolhe 5% de contribuição previdenciária pelo DAS mensal. A qualidade de segurado depende do pagamento em dia.

**Trabalhador Avulso (Art. 11, IV)**

Presta serviço a diversas empresas sem vínculo, com intermediação de OGMO ou sindicato: estivadores, carregadores portuários, ensacadores.

**Jurisprudência:** O STJ reconhece que o MEI que deixa de recolher o DAS perde a qualidade de segurado após o período de graça de 6 meses (facultativo equiparado).

**Artigo de Lei:** Arts. 11, IV e V, e 21 da Lei n.º 8.213/1991; Lei Complementar n.º 123/2006 (MEI).`),
      section(3, 'Segurado Especial e Trabalhador Rural', `**Segurado Especial (Art. 11, VII, Lei 8.213/91)**

Produtor rural em regime de economia familiar, pescador artesanal e cônjuge/companheiro que trabalhem em conjunto, sem empregados permanentes.

| Aspecto | Regra |
| --- | --- |
| Contribuição | 2,3% sobre a comercialização da produção (GILRURAL) |
| Comprovação | Início de prova material + prova testemunhal |
| Carência | 180 contribuições (ano safra) |
| Idade para aposentadoria | 60 anos (H) / 55 anos (M) |

**Início de Prova Material**

Documentos como ITR, DAP, notas fiscais de produtor, contratos de parceria, declaração de sindicato rural ou certidão de casamento com segurado especial.

**Atenção:** A Súmula 75 do STJ exige início de prova material contemporânea ao período que se pretende comprovar, não bastando documento recente para todo o período.

**Dica Prática:** Organize a prova por ano safra, com documentos que demonstrem plantio, colheita ou comercialização em cada período.

**Artigo de Lei:** Arts. 11, VII, 39 e 143 da Lei n.º 8.213/1991; Decreto n.º 3.048/1999.`),
      section(4, 'Segurado Facultativo: Alíquotas e Benefícios', `**Segurado Facultativo (Art. 14, Lei 8.213/91)**

Pessoa maior de 16 anos sem atividade remunerada obrigatória que opta por contribuir: estudante, dona de casa, desempregado, estagiário não remunerado.

| Plano | Alíquota | Benefícios com Direito |
| --- | --- | --- |
| Baixa renda (CadÚnico) | 5% do SM | Aposentadoria por idade e pensão por morte |
| Simplificado | 11% do SM | Todos, exceto aposentadoria programada |
| Normal | 20% até o teto | Todos os benefícios do RGPS |

**Complementação de Alíquota**

O facultativo que contribui com 5% ou 11% pode complementar para 20% dentro do prazo legal, ampliando o direito a benefícios.

**Período de Graça do Facultativo**

6 meses após deixar de contribuir (Art. 15, § 2º), prorrogável nas hipóteses legais gerais.

**Importante:** O facultativo de baixa renda não tem direito a auxílio-doença, salário-maternidade ou aposentadoria por incapacidade, salvo complementação da alíquota.

**Artigo de Lei:** Arts. 14, 15 e 21 da Lei n.º 8.213/1991.`),
      section(5, 'Dependentes: Classes, Presunção e Exclusão', `**Classificação dos Dependentes (Art. 16, Lei 8.213/91)**

| Classe | Dependentes | Dependência Econômica |
| --- | --- | --- |
| I | Cônjuge, companheiro(a), filhos menores de 21 ou inválidos/deficientes | Presumida |
| II | Pais | Deve ser comprovada |
| III | Irmãos menores de 21 ou inválidos | Deve ser comprovada |

**Regra de Exclusão entre Classes**

A existência de dependente de classe anterior exclui os das classes subsequentes. Exemplo: se há cônjuge (Classe I), os pais (Classe II) não concorrem à pensão.

**União Estável e Dependência**

Companheiro(a) em união estável reconhecida judicialmente ou por escritura pública tem dependência presumida.

**Filho Maior Inválido ou com Deficiência**

Mantém a qualidade de dependente sem limite etário, desde que a invalidez ou deficiência seja comprovada.

**Jurisprudência:** O STJ admite pensão ao companheiro de união estável homoafetiva e reconhece dependência de enteado quando comprovada a relação familiar e econômica (REsp 1.435.628/RJ).

**Artigo de Lei:** Arts. 16 a 18 da Lei n.º 8.213/1991.`),
      section(6, 'Filiação, Inscrição e Cadastro no INSS', `**Distinção Fundamental**

| Conceito | Natureza | Momento |
| --- | --- | --- |
| Filiação | Automática pelo exercício de atividade | Início da atividade remunerada |
| Inscrição | Cadastro formal no INSS | Registro em CTPS, CNPJ ou requerimento |

**CNIS e NIT**

O Cadastro Nacional de Informações Sociais consolida vínculos e contribuições. O NIT/PIS identifica o segurado no sistema.

**Segurado sem Inscrição**

A ausência de inscrição não impede o reconhecimento de direitos se comprovado o exercício de atividade (formalismo moderado).

**Dica Prática:** Solicite CNIS completo no Meu INSS antes de qualquer requerimento. Corrija vínculos e remunerações divergentes por processo de revisão do CNIS.

**Atenção:** Contribuições recolhidas sem vínculo no CNIS podem ser vinculadas mediante processo administrativo ou judicial.

**Artigo de Lei:** Arts. 11, 14 e 30 da Lei n.º 8.213/1991; IN INSS/PRES n.º 128/2022.`),
      section(7, 'Controvérsias sobre Segurados e Dependentes', `**Principais Temas Litigiosos**

1. **Trabalhador de plataforma digital:** subordinação algorítmica x autonomia
2. **Segurado especial:** comprovação de períodos rurais anteriores a 1991
3. **Dependência econômica de pais:** prova em famílias de baixa renda
4. **MEI e recolhimento em atraso:** efeitos na qualidade de segurado
5. **Empregado doméstico sem registro:** reconhecimento de vínculo retroativo

| Tema | Entendimento Dominante |
| --- | --- |
| Vínculo de plataforma | Análise caso a caso da subordinação |
| Prova rural | Início de prova material + testemunhas |
| Filho enteado | Possível com prova de dependência |
| Facultativo 5% | Sem auxílio-doença sem complementação |

**Súmula 75/STJ:** Para reconhecimento de tempo de serviço rural anterior à vigência da Lei 8.213/91, é necessário início de prova material contemporânea.

**Artigo de Lei:** Arts. 11 a 18 da Lei n.º 8.213/1991; Súmula 75/STJ.`),
    ],
    [
      quiz('Quem é considerado empregado doméstico para fins previdenciários?', ['Qualquer prestador de serviço residencial eventual', 'Pessoa que presta serviços contínuos, subordinados e pessoais no âmbito residencial por mais de 2 dias por semana', 'Apenas empregada com carteira assinada antes de 2013', 'Profissional autônomo que atende várias residências'], 1, 'O empregado doméstico presta serviços de forma contínua, subordinada, onerosa e pessoal no âmbito residencial, por mais de 2 dias por semana (LC 150/2015).'),
      quiz('Qual a alíquota de contribuição do MEI para o RGPS?', ['20% sobre o faturamento', '11% do salário mínimo', '5% do salário mínimo via DAS', '2,3% sobre a comercialização'], 2, 'O MEI recolhe 5% do salário mínimo a título de contribuição previdenciária por meio do DAS mensal.'),
      quiz('Quais dependentes possuem dependência econômica presumida?', ['Pais e irmãos', 'Cônjuge, companheiro(a) e filhos menores de 21 anos (ou inválidos/deficientes)', 'Qualquer parente que more com o segurado', 'Apenas filhos menores de 18 anos'], 1, 'Os dependentes de Classe I (cônjuge, companheiro e filhos) gozam de dependência econômica presumida em lei.'),
      quiz('Qual o período de graça do segurado facultativo que deixa de contribuir?', ['12 meses', '6 meses', '36 meses', '24 meses'], 1, 'O segurado facultativo mantém a qualidade de segurado por 6 meses após deixar de contribuir (Art. 15, § 2º, Lei 8.213/91).'),
      quiz('O que caracteriza o segurado especial?', ['Qualquer trabalhador rural com carteira assinada', 'Produtor rural em economia familiar sem empregados permanentes', 'Empregado de agroindústria', 'Contribuinte individual do setor agropecuário'], 1, 'O segurado especial é o produtor rural em regime de economia familiar, pescador artesanal e cônjuge que trabalhem em conjunto, sem empregados permanentes.'),
      quiz('Qual a diferença entre filiação e inscrição no RGPS?', ['São sinônimos', 'Filiação é automática pelo exercício de atividade; inscrição é o cadastro formal no INSS', 'Inscrição é automática; filiação exige pedido', 'Filiação vale apenas para empregados'], 1, 'A filiação decorre automaticamente do exercício de atividade remunerada; a inscrição é o cadastro formal do segurado junto ao INSS.'),
    ]
  ),
  // Module 5-12 continue in next part due to size - will append in same file
];

// Write partial - we'll extend with modules 5-12
console.log('Modules defined:', modules.length);
