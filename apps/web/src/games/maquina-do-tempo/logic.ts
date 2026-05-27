import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface HistoricalEvent {
  id: string;
  title: string;
  year: number;
  era: string;
  emoji: string;
  description: string;
  funFact: string;
  difficulty: number;
}

export const EVENTS: HistoricalEvent[] = [
  { id: 'dinos', title: 'Extinção dos Dinossauros', year: -65000000, era: 'Pré-história', emoji: '🦕', description: 'Um asteroide gigante causou a extinção dos dinossauros', funFact: 'O asteroide tinha cerca de 10 km de diâmetro!', difficulty: 1 },
  { id: 'pyramids', title: 'Construção das Pirâmides', year: -2560, era: 'Antiguidade', emoji: '🏛️', description: 'Os egípcios construíram as grandes pirâmides de Gizé', funFact: 'A Grande Pirâmide tem 2,3 milhões de blocos de pedra!', difficulty: 1 },
  { id: 'rome', title: 'Fundação de Roma', year: -753, era: 'Antiguidade', emoji: '🏛️', description: 'Roma foi fundada, início de um dos maiores impérios', funFact: 'A lenda diz que Roma foi fundada por Rômulo e Remo!', difficulty: 2 },
  { id: 'discovery-br', title: 'Descobrimento do Brasil', year: 1500, era: 'Idade Moderna', emoji: '🇧🇷', description: 'Pedro Álvares Cabral chegou ao Brasil', funFact: 'Cabral chegou em Porto Seguro, na Bahia!', difficulty: 1 },
  { id: 'printing', title: 'Invenção da Imprensa', year: 1440, era: 'Renascimento', emoji: '📰', description: 'Gutenberg inventou a prensa de tipos móveis', funFact: 'Antes, cada livro era copiado à mão!', difficulty: 2 },
  { id: 'gravity', title: 'Lei da Gravidade', year: 1687, era: 'Idade Moderna', emoji: '🍎', description: 'Newton publicou as leis da gravidade', funFact: 'A história da maçã caindo é provavelmente verdade!', difficulty: 2 },
  { id: 'independence-br', title: 'Independência do Brasil', year: 1822, era: 'Idade Contemporânea', emoji: '🗣️', description: 'Dom Pedro I declarou a independência do Brasil', funFact: 'O grito de independência foi às margens do rio Ipiranga!', difficulty: 1 },
  { id: 'lightbulb', title: 'Invenção da Lâmpada', year: 1879, era: 'Idade Contemporânea', emoji: '💡', description: 'Thomas Edison criou a lâmpada elétrica prática', funFact: 'Edison testou mais de 3.000 materiais antes de acertar!', difficulty: 1 },
  { id: 'airplane', title: 'Invenção do Avião', year: 1906, era: 'Idade Contemporânea', emoji: '✈️', description: 'Santos Dumont voou com o 14-Bis em Paris', funFact: 'Santos Dumont é o pai da aviação!', difficulty: 1 },
  { id: 'moon', title: 'Homem na Lua', year: 1969, era: 'Idade Contemporânea', emoji: '🌙', description: 'Neil Armstrong pisou na Lua', funFact: 'A viagem até a Lua durou 4 dias!', difficulty: 1 },
  { id: 'internet', title: 'Criação da Internet', year: 1991, era: 'Idade Contemporânea', emoji: '🌐', description: 'Tim Berners-Lee criou a World Wide Web', funFact: 'O primeiro site da história ainda está no ar!', difficulty: 2 },
  { id: 'ww2', title: 'Segunda Guerra Mundial', year: 1939, era: 'Idade Contemporânea', emoji: '⚔️', description: 'Início do maior conflito da história', funFact: 'A guerra durou 6 anos e envolveu mais de 70 países', difficulty: 3 },
  { id: 'french-rev', title: 'Revolução Francesa', year: 1789, era: 'Idade Contemporânea', emoji: '🇫🇷', description: 'O povo francês derrubou a monarquia', funFact: 'O lema "Liberdade, Igualdade, Fraternidade" surgiu aqui!', difficulty: 3 },
  { id: 'dna', title: 'Descoberta do DNA', year: 1953, era: 'Idade Contemporânea', emoji: '🧬', description: 'Watson e Crick descobriram a estrutura do DNA', funFact: 'Rosalind Franklin fez a foto crucial do DNA!', difficulty: 3 },
];

export function getEventsForAge(ageGroup: AgeGroup): HistoricalEvent[] {
  switch (ageGroup) {
    case 'explorer': return EVENTS.filter((e) => e.difficulty === 1);
    case 'adventurer': return EVENTS.filter((e) => e.difficulty <= 2);
    case 'master': return EVENTS;
    default: return EVENTS.filter((e) => e.difficulty === 1);
  }
}

export function getQuizCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 8;
    case 'adventurer': return 10;
    case 'master': return 12;
    default: return 8;
  }
}

export interface HistoryQuiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  event: HistoricalEvent;
}

export function generateHistoryQuiz(events: HistoricalEvent[]): HistoryQuiz {
  const event = events[Math.floor(Math.random() * events.length)] as HistoricalEvent;
  const yearStr = event.year < 0 ? `${Math.abs(event.year)} a.C.` : `${event.year}`;
  const questionTypes = [
    { q: `${event.emoji} Em que ano aconteceu: "${event.title}"?`, correct: yearStr, pool: events.map((e) => e.year < 0 ? `${Math.abs(e.year)} a.C.` : `${e.year}`) },
    { q: `${event.emoji} O que aconteceu em ${yearStr}?`, correct: event.title, pool: events.map((e) => e.title) },
    { q: `"${event.description}" — Em qual era isso aconteceu?`, correct: event.era, pool: ['Pré-história', 'Antiguidade', 'Idade Média', 'Renascimento', 'Idade Moderna', 'Idade Contemporânea'] },
  ];

  const qData = questionTypes[Math.floor(Math.random() * questionTypes.length)]!;
  const wrongPool = qData.pool.filter((o) => o !== qData.correct);
  const wrongOptions = shuffleArray(wrongPool).slice(0, 3);
  const options = shuffleArray([qData.correct, ...wrongOptions]);
  const correctIndex = options.indexOf(qData.correct);

  return {
    id: Math.random().toString(36).substring(2, 9),
    question: qData.q,
    options,
    correctIndex: Math.max(0, correctIndex),
    explanation: event.funFact,
    event,
  };
}

export function generateHistoryQuizSet(ageGroup: AgeGroup): HistoryQuiz[] {
  const events = getEventsForAge(ageGroup);
  const count = getQuizCount(ageGroup);
  return Array.from({ length: count }, () => generateHistoryQuiz(events));
}

export function checkHistoryAnswer(quiz: HistoryQuiz, selectedIndex: number): boolean {
  return selectedIndex === quiz.correctIndex;
}

export function calculateHistoryScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0;
  const stars = calculateStars(accuracy);
  return { score: correct * 15, maxScore: total * 15, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
