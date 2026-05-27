import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface ReadingPassage {
  id: string;
  title: string;
  text: string;
  questions: PassageQuestion[];
  difficulty: number;
  wordCount: number;
}

export interface PassageQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const PASSAGES: ReadingPassage[] = [
  {
    id: 'p1', title: 'O Cachorro Fiel', difficulty: 1, wordCount: 45,
    text: 'Pedro tinha um cachorro chamado Thor. Todo dia, Thor esperava Pedro voltar da escola na porta de casa. Quando Pedro chegava, Thor pulava de alegria e abanava o rabo. Eles brincavam juntos no quintal até o sol se pôr. Pedro amava Thor mais que tudo.',
    questions: [
      { question: 'Como se chamava o cachorro?', options: ['Rex', 'Thor', 'Bob', 'Max'], correctIndex: 1 },
      { question: 'Onde Thor esperava Pedro?', options: ['No quintal', 'Na escola', 'Na porta de casa', 'No parque'], correctIndex: 2 },
      { question: 'O que Thor fazia quando Pedro chegava?', options: ['Dormia', 'Pulava de alegria', 'Corria para longe', 'Latia com raiva'], correctIndex: 1 },
    ],
  },
  {
    id: 'p2', title: 'A Floresta Mágica', difficulty: 1, wordCount: 50,
    text: 'Ana encontrou uma floresta onde as árvores brilhavam à noite. As folhas eram azuis e os troncos tinham luzes douradas. Um coelho branco apareceu e disse que a floresta era protegida por fadas. Ana prometeu nunca contar o segredo para ninguém e voltou para casa feliz.',
    questions: [
      { question: 'De que cor eram as folhas?', options: ['Verdes', 'Vermelhas', 'Azuis', 'Amarelas'], correctIndex: 2 },
      { question: 'Quem protegia a floresta?', options: ['Dragões', 'Fadas', 'Bruxas', 'Gigantes'], correctIndex: 1 },
      { question: 'O que Ana prometeu?', options: ['Voltar todo dia', 'Plantar mais árvores', 'Nunca contar o segredo', 'Trazer amigos'], correctIndex: 2 },
    ],
  },
  {
    id: 'p3', title: 'Viagem ao Espaço', difficulty: 2, wordCount: 70,
    text: 'A astronauta Maria foi a primeira brasileira a pisar em Marte. A viagem durou seis meses dentro de uma nave chamada Esperança. Em Marte, o céu era vermelho e a gravidade muito menor que na Terra. Maria coletou amostras de solo e encontrou indícios de água congelada sob a superfície. Quando voltou, foi recebida como heroína nacional e seus dados ajudaram cientistas do mundo todo.',
    questions: [
      { question: 'Quanto tempo durou a viagem?', options: ['Três meses', 'Seis meses', 'Um ano', 'Duas semanas'], correctIndex: 1 },
      { question: 'Como se chamava a nave?', options: ['Coragem', 'Esperança', 'Descoberta', 'Vitória'], correctIndex: 1 },
      { question: 'O que Maria encontrou em Marte?', options: ['Vida alienígena', 'Ouro', 'Indícios de água congelada', 'Plantas'], correctIndex: 2 },
    ],
  },
  {
    id: 'p4', title: 'O Inventor', difficulty: 2, wordCount: 75,
    text: 'Carlos tinha 12 anos e adorava construir coisas. Um dia, usando peças de brinquedos velhos e um motor de ventilador quebrado, ele construiu um robô que conseguia separar lixo reciclável do orgânico. A professora de ciências ficou impressionada e inscreveu Carlos numa feira de ciências estadual. Ele ganhou o primeiro lugar e uma bolsa de estudos para um curso de robótica. Carlos provou que idade não é limite para inovar.',
    questions: [
      { question: 'Quantos anos Carlos tinha?', options: ['10', '11', '12', '13'], correctIndex: 2 },
      { question: 'O que o robô fazia?', options: ['Limpava a casa', 'Separava lixo reciclável', 'Cozinhava', 'Falava'], correctIndex: 1 },
      { question: 'O que Carlos ganhou na feira?', options: ['Um troféu', 'Primeiro lugar e bolsa de estudos', 'Um robô novo', 'Uma viagem'], correctIndex: 1 },
    ],
  },
  {
    id: 'p5', title: 'A Grande Muralha', difficulty: 3, wordCount: 90,
    text: 'A Grande Muralha da China é uma das maiores construções já feitas pelo ser humano. Com mais de 21.000 quilômetros de extensão, ela foi construída ao longo de vários séculos por diferentes dinastias chinesas, começando por volta de 700 a.C. O objetivo principal era proteger o território chinês contra invasões de povos nômades do norte. Milhões de trabalhadores participaram da construção, e estima-se que centenas de milhares morreram durante o processo. Hoje, a muralha é Patrimônio Mundial da UNESCO e recebe milhões de visitantes por ano, sendo um símbolo da engenharia e determinação humana.',
    questions: [
      { question: 'Qual era o objetivo da muralha?', options: ['Turismo', 'Proteção contra invasões', 'Comércio', 'Irrigação'], correctIndex: 1 },
      { question: 'Qual é a extensão aproximada?', options: ['5.000 km', '10.000 km', '21.000 km', '50.000 km'], correctIndex: 2 },
      { question: 'A muralha é classificada como...', options: ['Monumento Nacional', 'Patrimônio Mundial da UNESCO', 'Parque Natural', 'Reserva Indígena'], correctIndex: 1 },
    ],
  },
  {
    id: 'p6', title: 'Fotossíntese', difficulty: 3, wordCount: 85,
    text: 'A fotossíntese é o processo pelo qual as plantas transformam luz solar, água e gás carbônico em glicose e oxigênio. Esse processo acontece principalmente nas folhas, dentro de estruturas chamadas cloroplastos, que contêm clorofila — o pigmento verde responsável por capturar a energia luminosa. A fotossíntese é fundamental para a vida na Terra porque produz o oxigênio que respiramos e é a base de quase todas as cadeias alimentares. Sem ela, a maioria dos seres vivos não existiria. Cientistas estudam maneiras de replicar a fotossíntese artificialmente para gerar energia limpa.',
    questions: [
      { question: 'Onde acontece a fotossíntese principalmente?', options: ['Nas raízes', 'No caule', 'Nas folhas', 'Nas flores'], correctIndex: 2 },
      { question: 'O que é clorofila?', options: ['Um tipo de raiz', 'O pigmento verde que captura luz', 'Uma vitamina', 'Um mineral do solo'], correctIndex: 1 },
      { question: 'O que a fotossíntese produz?', options: ['Água e terra', 'Glicose e oxigênio', 'Gás carbônico', 'Nitrogênio'], correctIndex: 1 },
    ],
  },
];

export function getPassagesForAge(ageGroup: AgeGroup): ReadingPassage[] {
  switch (ageGroup) {
    case 'adventurer': return PASSAGES.filter((p) => p.difficulty <= 2);
    case 'master': return PASSAGES;
    default: return PASSAGES.filter((p) => p.difficulty <= 2);
  }
}

export function getRoundCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'adventurer': return 3;
    case 'master': return 4;
    default: return 3;
  }
}

export function selectPassages(ageGroup: AgeGroup): ReadingPassage[] {
  const pool = getPassagesForAge(ageGroup);
  const count = getRoundCount(ageGroup);
  return shuffleArray(pool).slice(0, count);
}

export function checkReadingAnswer(passage: ReadingPassage, questionIndex: number, selectedIndex: number): boolean {
  const question = passage.questions[questionIndex];
  return question !== undefined && selectedIndex === question.correctIndex;
}

export function calculateReadingScore(correctAnswers: number, totalAnswers: number, totalReadingTimeSec: number): GameResult {
  const accuracy = totalAnswers > 0 ? correctAnswers / totalAnswers : 0;
  const stars = calculateStars(accuracy);
  return {
    score: correctAnswers * 15,
    maxScore: totalAnswers * 15,
    timeSpent: totalReadingTimeSec,
    accuracy,
    xpEarned: calculateXP(stars),
    coinsEarned: calculateCoins(stars),
    achievements: [],
    stars,
  };
}
