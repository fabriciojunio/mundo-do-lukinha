import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface Organ {
  id: string;
  name: string;
  emoji: string;
  system: string;
  funFact: string;
  positionY: number; // 0-100 percentage from top of body
  difficulty: number; // 1=easy, 2=medium, 3=hard
}

export interface BodyQuiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  organ: Organ;
}

const ORGANS: Organ[] = [
  { id: 'brain', name: 'Cérebro', emoji: '🧠', system: 'Nervoso', funFact: 'O cérebro usa 20% de toda a energia do seu corpo!', positionY: 8, difficulty: 1 },
  { id: 'heart', name: 'Coração', emoji: '❤️', system: 'Circulatório', funFact: 'O coração bate mais de 100.000 vezes por dia!', positionY: 32, difficulty: 1 },
  { id: 'lungs', name: 'Pulmões', emoji: '🫁', system: 'Respiratório', funFact: 'Você respira cerca de 20.000 vezes por dia!', positionY: 30, difficulty: 1 },
  { id: 'stomach', name: 'Estômago', emoji: '🟤', system: 'Digestório', funFact: 'O estômago tem ácido forte o suficiente para dissolver metal!', positionY: 42, difficulty: 1 },
  { id: 'liver', name: 'Fígado', emoji: '🟫', system: 'Digestório', funFact: 'O fígado faz mais de 500 funções diferentes!', positionY: 38, difficulty: 2 },
  { id: 'kidneys', name: 'Rins', emoji: '🫘', system: 'Urinário', funFact: 'Os rins filtram todo o seu sangue 40 vezes por dia!', positionY: 48, difficulty: 2 },
  { id: 'intestine', name: 'Intestino', emoji: '🪢', system: 'Digestório', funFact: 'O intestino delgado tem cerca de 7 metros de comprimento!', positionY: 58, difficulty: 2 },
  { id: 'bones', name: 'Ossos', emoji: '🦴', system: 'Esquelético', funFact: 'Bebês nascem com 270 ossos, adultos têm 206!', positionY: 50, difficulty: 1 },
  { id: 'muscles', name: 'Músculos', emoji: '💪', system: 'Muscular', funFact: 'O corpo humano tem mais de 600 músculos!', positionY: 45, difficulty: 2 },
  { id: 'skin', name: 'Pele', emoji: '🤲', system: 'Tegumentar', funFact: 'A pele é o maior órgão do corpo humano!', positionY: 25, difficulty: 2 },
  { id: 'eyes', name: 'Olhos', emoji: '👁️', system: 'Nervoso', funFact: 'Seus olhos podem distinguir cerca de 10 milhões de cores!', positionY: 10, difficulty: 1 },
  { id: 'pancreas', name: 'Pâncreas', emoji: '🟡', system: 'Digestório', funFact: 'O pâncreas produz insulina que controla o açúcar no sangue!', positionY: 44, difficulty: 3 },
  { id: 'spleen', name: 'Baço', emoji: '🟣', system: 'Linfático', funFact: 'O baço ajuda a combater infecções e filtra o sangue velho!', positionY: 40, difficulty: 3 },
  { id: 'thyroid', name: 'Tireoide', emoji: '🦋', system: 'Endócrino', funFact: 'A tireoide controla a velocidade do seu metabolismo!', positionY: 18, difficulty: 3 },
];

export function getOrgansForAge(ageGroup: AgeGroup): Organ[] {
  switch (ageGroup) {
    case 'explorer':
      return ORGANS.filter((o) => o.difficulty === 1);
    case 'adventurer':
      return ORGANS.filter((o) => o.difficulty <= 2);
    case 'master':
      return ORGANS;
    default:
      return ORGANS.filter((o) => o.difficulty === 1);
  }
}

export function getChallengeCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 6;
    case 'adventurer': return 10;
    case 'master': return 12;
    default: return 6;
  }
}

export function generateBodyQuiz(organs: Organ[]): BodyQuiz {
  const organ = organs[Math.floor(Math.random() * organs.length)] as Organ;

  const questionTypes = [
    { q: `Qual é a função principal do(a) ${organ.name}?`, correctOpt: `Faz parte do sistema ${organ.system}` },
    { q: `O(A) ${organ.name} pertence a qual sistema?`, correctOpt: `Sistema ${organ.system}` },
    { q: `Onde fica o(a) ${organ.name} no corpo?`, correctOpt: organ.positionY < 20 ? 'Na cabeça' : organ.positionY < 40 ? 'No tronco superior' : 'No tronco inferior' },
  ];

  const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)]!;
  const systems = ['Nervoso', 'Circulatório', 'Respiratório', 'Digestório', 'Urinário', 'Esquelético', 'Muscular'];

  const wrongOptions = new Set<string>();
  while (wrongOptions.size < 3) {
    const wrongSys = systems[Math.floor(Math.random() * systems.length)]!;
    const wrongOpt = qType.correctOpt.includes('Sistema')
      ? `Sistema ${wrongSys}`
      : qType.correctOpt.includes('cabeça')
        ? ['No tronco superior', 'No tronco inferior', 'Nas pernas'][wrongOptions.size] ?? 'No tronco'
        : `Faz parte do sistema ${wrongSys}`;
    if (wrongOpt !== qType.correctOpt) wrongOptions.add(wrongOpt);
  }

  const options = shuffleArray([qType.correctOpt, ...Array.from(wrongOptions).slice(0, 3)]);
  const correctIndex = options.indexOf(qType.correctOpt);

  return {
    id: Math.random().toString(36).substring(2, 9),
    question: qType.q,
    options,
    correctIndex: Math.max(0, correctIndex),
    explanation: organ.funFact,
    organ,
  };
}

export function generateQuizSet(ageGroup: AgeGroup): BodyQuiz[] {
  const organs = getOrgansForAge(ageGroup);
  const count = getChallengeCount(ageGroup);
  const quizzes: BodyQuiz[] = [];
  const shuffledOrgans = shuffleArray(organs);

  for (let i = 0; i < count; i++) {
    const organ = shuffledOrgans[i % shuffledOrgans.length] as Organ;
    quizzes.push(generateBodyQuiz([organ]));
  }

  return quizzes;
}

export function checkBodyAnswer(quiz: BodyQuiz, selectedIndex: number): boolean {
  return selectedIndex === quiz.correctIndex;
}

export function calculateBodyScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0;
  const stars = calculateStars(accuracy);
  const score = correct * 15;
  const maxScore = total * 15;

  return {
    score,
    maxScore,
    timeSpent,
    accuracy,
    xpEarned: calculateXP(stars),
    coinsEarned: calculateCoins(stars),
    achievements: [],
    stars,
  };
}
