export type Item = {
  k: string;
  t: string;
  y: "s" | "t" | "r" | "c" | "n";
  a?: number;
  b?: number;
  lo?: string;
  hi?: string;
  o?: string[];
  na?: boolean;
  ax?: string;
  dim?: string;
  R?: boolean;
};
export type Section = { h: string; n?: string; i: Item[] };
export type FormKey = "um" | "pdi" | "f3" | "cl";
export type Form = { n: string; ic: string; s: Section[] };

const sc = (
  k: string,
  t: string,
  a = 1,
  b = 5,
  lo = "discordo",
  hi = "concordo",
  x: Partial<Item> = {},
): Item => ({ k, t, y: "s", a, b, lo, hi, ...x });
const tx = (k: string, t: string): Item => ({ k, t, y: "t" });
const rd = (k: string, t: string, o: string[]): Item => ({ k, t, y: "r", o });
const ck = (k: string, t: string, o: string[]): Item => ({ k, t, y: "c", o });
const nm = (k: string, t: string): Item => ({ k, t, y: "n" });
const FR = (k: string, t: string, ax: string) =>
  sc(k, t, 1, 5, "quase nunca", "quase sempre", { na: true, ax });
const DT = "discordo totalmente",
  CT = "concordo totalmente";

export const FORMS: Record<FormKey, Form> = {
  um: {
    n: "1:1",
    ic: "♡",
    s: [
      {
        h: "0. Combinados do 1:1 anterior (2 min)",
        n: "Combinado não cumprido não é culpa: pergunte primeiro o que atrapalhou (carga, clareza, recurso, tempo).",
        i: [
          tx("ant", "Combinados anteriores (combinado · quem · observação)"),
          rd("antS", "Status geral", ["feito", "parcial", "não"]),
        ],
      },
      {
        h: "1. Check-in rápido (liderado responde, 3 min)",
        i: [
          sc(
            "bem",
            "1.1 De 0 a 10, como você está se sentindo na Konvex hoje?",
            0,
            10,
            "muito mal",
            "muito bem",
          ),
          sc(
            "en",
            "1.2 De 0 a 10, quanta energia você tem hoje (bateria)?",
            0,
            10,
            "zerada",
            "cheia",
          ),
          rd("car", "1.3 Sua carga nas próximas semanas está:", [
            "leve",
            "ok",
            "pesada",
            "insustentável",
          ]),
          nm("hrs", "1.4 Mapa de capacidade: horas por semana com que você conta com segurança"),
          tx("per", "Períodos críticos (provas, estágio, viagem) e datas"),
          sc("aut", "1.5 Autonomia: tenho voz e escolha sobre como faço meu trabalho."),
          sc("comp", "1.6 Competência: sei fazer o que me pedem e sinto que estou aprendendo."),
          sc("per2", "1.7 Pertencimento: me sinto parte do time e valorizado por ele."),
          sc("cla", "1.8 Clareza: está claro o que se espera de mim nas próximas semanas."),
          sc("seg", "1.9 Segurança: posso errar, discordar ou pedir ajuda sem medo."),
        ],
      },
      {
        h: "2. Conversa (liderado primeiro, 15 min)",
        n: "Qualquer pergunta pode ser pulada (“hoje prefiro não falar disso”). Líder: perguntas abertas, reflita com as palavras da pessoa e espere alguns segundos.",
        i: [
          tx("c1", "2.1 O que foi melhor e o que foi mais difícil desde o nosso último 1:1?"),
          tx(
            "c2",
            "2.2 O que está te ajudando e o que está te atrapalhando para entregar o que combinamos?",
          ),
          tx(
            "c3",
            "2.3 Em que momento recente você se sentiu parte do time? E de fora ou invisível?",
          ),
          tx(
            "c4",
            "2.4 Qual RNN foi mais fácil e qual foi mais difícil de viver neste período? Pode dar um exemplo?",
          ),
          tx(
            "c5",
            "2.5 Tem algum problema que você percebeu e ainda não levou ao time? Se tiver uma ideia de saída, qual?",
          ),
          tx(
            "c6",
            "2.6 O que você quer aprender até o próximo trimestre? Como está o PDI e o que travou?",
          ),
        ],
      },
      {
        h: "3. Bloco do mês (um, em rodízio, 5 min)",
        n: "Rodízio: mês 1 Autonomia · 2 Competência · 3 Pertencimento · 4 Energia e segurança. Se algum termômetro veio 1 ou 2, use o bloco dele.",
        i: [
          rd("bl", "Bloco usado", [
            "A. Autonomia",
            "B. Competência",
            "C. Pertencimento",
            "D. Energia e segurança",
          ]),
          tx(
            "blt",
            "Anotações do bloco (A: em que partes tem voz e escolha? · B: última vez que se sentiu perdido e o que ajudaria? · C: com quem trabalha mais e o que ajudaria a pertencer? · D: o que gasta e recarrega energia; o que evita dizer?)",
          ),
        ],
      },
      {
        h: "4. Fechamento (líder, 5 min)",
        i: [
          tx("rec", "4.1 Reconhecimento específico (comportamento ou RNN vivida, com exemplo)"),
          tx("sS", "4.2 Feedback em SCI · Situação"),
          tx("sC", "SCI · Comportamento"),
          tx("sI", "SCI · Impacto"),
          tx("cb", "4.3 Combinados de hoje (1 a 3: o quê, quem, prazo)"),
          tx("dif", "4.4 O que o líder ou a Konvex podem fazer diferente para você crescer aqui?"),
          tx("prox", "Próximo 1:1 agendado para (data)"),
        ],
      },
      {
        h: "5. Registro interno (líder, após a conversa)",
        n: "Nas palavras do membro, sem diagnósticos e sem detalhes de saúde (só a categoria). Risco imediato à vida ou à segurança: SAMU 192 ou CVV 188.",
        i: [
          ck("pa", "Pontos de atenção", [
            "carga",
            "clima",
            "relacionamento",
            "vontade de sair",
            "clareza",
            "saúde/pessoal",
            "nenhum",
          ]),
          rd("enc", "Encaminhar para Pessoas?", ["sim", "não"]),
          rd("cons", "Com o consentimento do membro?", ["sim", "não"]),
          tx("obs", "Motivo / observações"),
        ],
      },
    ],
  },
  pdi: {
    n: "PDI",
    ic: "◎",
    s: [
      {
        h: "Pré-diagnóstico · Bloco 1 · Onde estou",
        n: "O membro preenche antes do encontro (10 min). Temas pessoais sensíveis não vão para a calibragem da diretoria.",
        i: [
          tx(
            "comp",
            "Competências da minha área e meu nível em cada (1 iniciante · 2 básico · 3 autônomo · 4 consigo ensinar)",
          ),
          tx("lim", "Qual habilidade técnica mais limita minhas entregas hoje?"),
        ],
      },
      {
        h: "Bloco 2 · Como eu atuo (1 raramente · 5 sempre)",
        i: [
          ["b1", "Cumpro o que combino ou aviso antes quando não consigo. (comprometimento)"],
          ["b2", "Reviso meu trabalho antes de entregar. (qualidade e eficiência)"],
          ["b3", "Defino metas com prazo para minhas tarefas. (estabelecimento de metas)"],
          [
            "b4",
            "Acompanho meu progresso e ajusto quando sai do plano. (planejamento e monitoramento)",
          ],
          ["b5", "Insisto diante de obstáculos antes de pedir ajuda. (persistência)"],
          ["b6", "Proponho melhorias sem esperar que me peçam. (iniciativa)"],
        ].map(([k, t]) => sc(k!, t!, 1, 5, "raramente", "sempre")),
      },
      {
        h: "Bloco 3 · Meu tempo",
        i: [
          nm("h", "Horas por semana disponíveis para a Konvex (média realista)"),
          tx("pc", "Períodos de maior carga na faculdade (datas)"),
          tx("fe", "Ferramenta que uso para organizar tarefas"),
          tx("fo", "O que mais me faz perder o foco"),
        ],
      },
      {
        h: "Bloco 4 · Meu futuro (opcional)",
        i: [
          tx("f1", "Cargo ou experiência que quero ter na Konvex"),
          tx("f2", "O que quero aprender nos próximos 6 meses"),
          tx("f3", "O que me faria querer ficar mais tempo no MEJ"),
        ],
      },
      {
        h: "Bloco 5 · Roda da Vida (opcional e voluntária)",
        n: "Você decide o que compartilha; o líder não faz papel de terapeuta.",
        i: [
          "Saúde",
          "Estudos",
          "Carreira",
          "Finanças",
          "Relações",
          "Lazer",
          "Crescimento pessoal",
          "Equilíbrio emocional",
        ].map((t, j) => sc("r" + j, t, 1, 10, "", "")),
      },
      ...[1, 2, 3].map((n) => ({
        h: "Meta " + n + (n > 1 ? " (opcional)" : "") + " · máximo 3 metas, regra 70-20-10",
        i: [
          tx("m" + n, "Meta (verbo + resultado + prazo)"),
          rd("t" + n, "Tipo", ["experiência (70)", "relacionamento (20)", "formal (10)"]),
          tx("k" + n, "Competência ou comportamento trabalhado"),
          rd("rn" + n, "RNN que ela fortalece (opcional)", [
            "1 Elo mais fraco",
            "2 Problema com proposta",
            "3 Entrega",
            "4 Iniciativa",
          ]),
          tx("i" + n, "Indicador de sucesso"),
          tx("a" + n, "Apoio necessário (mentor, curso, tempo de projeto)"),
          tx("p" + n, "Passos de curto prazo (quinzenais ou mensais, com data)"),
          rd("s" + n, "Status mensal", ["não iniciada", "em andamento", "concluída", "bloqueada"]),
        ],
      })),
    ],
  },
  f3: {
    n: "Feedback 360",
    ic: "◈",
    s: [
      {
        h: "Respondente",
        n: "Desenvolvimento, não punição. Anonimato entre pares; o líder direto se identifica. Cada pessoa avalia no máximo 3 colegas por rodada. Use N quando não tiver como observar.",
        i: [
          rd("rel", "Sua relação com essa pessoa", [
            "colega",
            "líder direto",
            "liderado",
            "autoavaliação",
          ]),
        ],
      },
      {
        h: "Eixo Realização",
        i: [
          FR(
            "a1",
            "Comprometimento: cumpre o que combina ou avisa com antecedência quando não vai conseguir.",
            "Realização",
          ),
          FR(
            "a2",
            "Comprometimento: assume a responsabilidade quando algo sai errado.",
            "Realização",
          ),
          FR(
            "a3",
            "Qualidade e eficiência: revisa o próprio trabalho antes de entregar.",
            "Realização",
          ),
          FR(
            "a4",
            "Qualidade e eficiência: busca fazer melhor e mais rápido sem abrir mão do padrão combinado.",
            "Realização",
          ),
          FR(
            "a5",
            "Persistência: não desiste diante de obstáculos e tenta caminhos diferentes antes de pedir ajuda.",
            "Realização",
          ),
          FR("a6", "Iniciativa: propõe soluções ou melhorias sem esperar que peçam.", "Realização"),
        ],
      },
      {
        h: "Eixo Planejamento",
        i: [
          FR(
            "p1",
            "Estabelecimento de metas: deixa claro o que quer entregar e até quando.",
            "Planejamento",
          ),
          FR(
            "p2",
            "Planejamento e monitoramento: acompanha o próprio progresso e ajusta o plano quando necessário.",
            "Planejamento",
          ),
          FR(
            "p3",
            "Busca de informações: procura dados e consulta quem sabe antes de decidir.",
            "Planejamento",
          ),
        ],
      },
      {
        h: "Eixo Relacionamento e Liderança",
        i: [
          FR("r1", "Escuta e respeita opiniões diferentes.", "Relacionamento e Liderança"),
          FR("r2", "Dá e recebe feedback de forma respeitosa.", "Relacionamento e Liderança"),
          FR("r3", "Ajuda colegas quando percebe que precisam.", "Relacionamento e Liderança"),
          FR(
            "r4",
            "(Apenas para quem lidera) Delega com clareza e acompanha sem microgerenciar.",
            "Relacionamento e Liderança",
          ),
          FR(
            "r5",
            "(Apenas para quem lidera) Reconhece publicamente o bom trabalho da equipe.",
            "Relacionamento e Liderança",
          ),
        ],
      },
      {
        h: "Perguntas abertas",
        n: "Cite situações, não julgamentos. Pessoas remove ofensas e identificações antes da entrega. Conduta grave (assédio, desonestidade) vai para o Comitê de Ética (Anexo F), não para o 360.",
        i: [
          tx("o1", "1. O que essa pessoa faz bem e deveria continuar fazendo? Cite uma situação."),
          tx("o2", "2. O que ela poderia começar a fazer para entregar ou colaborar melhor?"),
          tx(
            "o3",
            "3. Principal oportunidade de melhoria, em SCI: Situação · Comportamento observado · Impacto",
          ),
        ],
      },
    ],
  },
  cl: {
    n: "Clima",
    ic: "☁",
    s: [
      {
        h: "Bloco 1 · eNPS",
        n: "Pesquisa anônima: não guardamos seu nome. Resultados só aparecem em grupos de 5 pessoas ou mais.",
        i: [
          sc(
            "e",
            "De 0 a 10, qual a chance de você recomendar a Konvex a um colega universitário como lugar para participar?",
            0,
            10,
            "nenhuma chance",
            "total chance",
          ),
          tx("em", "Qual o principal motivo da sua nota?"),
        ],
      },
      {
        h: "Bloco 2 · Como é trabalhar em equipe aqui",
        i: [
          "Se você comete um erro nesta equipe, isso costuma ser usado contra você.",
          "Os membros desta equipe conseguem levantar problemas e assuntos difíceis.",
          "Pessoas nesta equipe às vezes rejeitam outras por serem diferentes.",
          "É seguro assumir riscos nesta equipe.",
          "É difícil pedir ajuda a outros membros desta equipe.",
          "Ninguém nesta equipe agiria de propósito de modo a prejudicar meu trabalho.",
          "Ao trabalhar com os membros desta equipe, minhas habilidades e talentos são valorizados e aproveitados.",
        ].map((t, j) => sc("s" + j, t, 1, 5, DT, CT, { R: [0, 2, 4].includes(j) })),
      },
      ...(
        [
          [
            "Liderança",
            [
              "Meu líder direto me dá feedback claro e respeitoso.",
              "Sinto que meu líder se importa comigo como pessoa.",
              "Sinto que posso falar com meu líder sobre como estou de verdade.",
              "Minhas opiniões são levadas em conta nas decisões da minha área.",
            ],
          ],
          [
            "Comunicação",
            [
              "Sei o que está acontecendo na Konvex além da minha área.",
              "Sei o que se espera de mim nas próximas semanas.",
            ],
          ],
          [
            "Carga de trabalho",
            [
              "Minha carga na Konvex é compatível com meu tempo disponível.",
              "Consigo conciliar a Konvex com a faculdade e outros compromissos.",
              "Tenho as ferramentas e informações de que preciso para entregar bem.",
            ],
          ],
          [
            "Valores, cultura e RNNs",
            [
              "Vejo os valores da Konvex praticados no dia a dia.",
              "Sei explicar o que cada uma das RNNs significa na prática.",
              "Vejo as RNNs sendo praticadas por líderes e colegas.",
              "Os colegas se comprometem com a qualidade do trabalho.",
              "Quem entrega bem é reconhecido.",
            ],
          ],
          [
            "Desenvolvimento",
            [
              "Tenho oportunidades de aprender e crescer aqui.",
              "Meu 1:1 me ajuda.",
              "Meu PDI me ajuda a evoluir.",
              "O feedback que recebo me ajuda a melhorar.",
            ],
          ],
          [
            "Ambiente e espaço",
            [
              "O espaço físico permite que eu me concentre quando preciso.",
              "Consigo usar a sala nos horários em que preciso.",
              "Sinto-me confortável e seguro no espaço em que trabalho.",
            ],
          ],
          [
            "Ação sobre a pesquisa (a partir da 2ª rodada)",
            ["O plano de ação da pesquisa anterior realmente acontece."],
          ],
        ] as [string, string[]][]
      ).map(([h, l], j) => ({
        h: "Bloco 3 · " + h,
        i: l.map((t, x) => sc("d" + j + "_" + x, t, 1, 5, DT, CT, { dim: h })),
      })),
      {
        h: "Bloco 4 · Perguntas abertas",
        i: [
          tx("p1", "Uma coisa que a Konvex deveria continuar fazendo."),
          tx("p2", "Uma coisa que a Konvex deveria começar a fazer."),
          tx("p3", "Uma coisa que a Konvex deveria parar de fazer ou mudar."),
        ],
      },
      {
        h: "Bloco 5 · Recorte opcional",
        n: "Só aparece nos resultados se cada recorte tiver 5 ou mais pessoas.",
        i: [
          rd("ar", "Área", ["Pessoas", "Projetos", "Mercado", "Financeiro", "Outra"]),
          rd("tc", "Tempo de casa", [
            "até 6 meses",
            "6 a 12 meses",
            "1 a 2 anos",
            "mais de 2 anos",
          ]),
        ],
      },
    ],
  },
};

export const ITEMS = (f: FormKey) => FORMS[f].s.flatMap((s) => s.i);
