import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface Planet {
  id: string;
  name: string;
  emoji: string;
  order: number;
  color: string;
  diameterKm: number;
  funFact: string;
  type: 'rocky' | 'gas';
}

export const PLANETS: Planet[] = [
  { id: 'mercury', name: 'Mercúrio', emoji: '⚪', order: 1, color: '#8c8c8c', diameterKm: 4879, funFact: 'Mercúrio é o planeta mais próximo do Sol e o menor do sistema solar!', type: 'rocky' },
  { id: 'venus', name: 'Vênus', emoji: '🟡', order: 2, color: '#e6c84c', diameterKm: 12104, funFact: 'Vênus é o planeta mais quente, com mais de 460°C na superfície!', type: 'rocky' },
  { id: 'earth', name: 'Terra', emoji: '🌍', order: 3, color: '#4a90d9', diameterKm: 12742, funFact: 'A Terra é o único planeta conhecido com vida! É a nossa casa!', type: 'rocky' },
  { id: 'mars', name: 'Marte', emoji: '🔴', order: 4, color: '#c1440e', diameterKm: 6779, funFact: 'Marte é chamado de Planeta Vermelho por causa do óxido de ferro!', type: 'rocky' },
  { id: 'jupiter', name: 'Júpiter', emoji: '🟠', order: 5, color: '#c88b3a', diameterKm: 139820, funFact: 'Júpiter é o maior planeta! Caberiam mais de 1000 Terras dentro dele!', type: 'gas' },
  { id: 'saturn', name: 'Saturno', emoji: '💍', order: 6, color: '#ead6a6', diameterKm: 116460, funFact: 'Saturno tem anéis lindos feitos de gelo e rocha!', type: 'gas' },
  { id: 'uranus', name: 'Urano', emoji: '🔵', order: 7, color: '#72b5c4', diameterKm: 50724, funFact: 'Urano gira "deitado"! Seu eixo é quase horizontal!', type: 'gas' },
  { id: 'neptune', name: 'Netuno', emoji: '🔷', order: 8, color: '#3f54ba', diameterKm: 49244, funFact: 'Netuno tem os ventos mais fortes do sistema solar, mais de 2000 km/h!', type: 'gas' },
];

export interface SolarQuiz {
  id: string;
  type: 'quiz' | 'order' | 'identify';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  planet: Planet;
}

export function getPlanetsForAge(ageGroup: AgeGroup): Planet[] {
  switch (ageGroup) {
    case 'explorer':
      return PLANETS.filter((p) => ['earth', 'mars', 'jupiter', 'saturn'].includes(p.id));
    case 'adventurer':
      return PLANETS;
    case 'master':
      return PLANETS;
    default:
      return PLANETS.slice(0, 4);
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

export function generateSolarQuiz(planets: Planet[]): SolarQuiz {
  const planet = planets[Math.floor(Math.random() * planets.length)] as Planet;
  const questionBank = [
    {
      q: `Qual planeta é o ${planet.order}º mais próximo do Sol?`,
      correct: planet.name,
      wrongPool: planets.filter((p) => p.id !== planet.id).map((p) => p.name),
    },
    {
      q: `${planet.emoji} De qual planeta é este emoji?`,
      correct: planet.name,
      wrongPool: planets.filter((p) => p.id !== planet.id).map((p) => p.name),
    },
    {
      q: `${planet.name} é um planeta de que tipo?`,
      correct: planet.type === 'rocky' ? 'Rochoso' : 'Gasoso',
      wrongPool: ['Rochoso', 'Gasoso', 'Anão', 'Líquido'].filter((t) => t !== (planet.type === 'rocky' ? 'Rochoso' : 'Gasoso')),
    },
  ];

  const qData = questionBank[Math.floor(Math.random() * questionBank.length)]!;
  const wrongOptions = shuffleArray(qData.wrongPool).slice(0, 3);
  const options = shuffleArray([qData.correct, ...wrongOptions]);
  const correctIndex = options.indexOf(qData.correct);

  return {
    id: Math.random().toString(36).substring(2, 9),
    type: 'quiz',
    question: qData.q,
    options,
    correctIndex: Math.max(0, correctIndex),
    explanation: planet.funFact,
    planet,
  };
}

export function generateQuizSet(ageGroup: AgeGroup): SolarQuiz[] {
  const planets = getPlanetsForAge(ageGroup);
  const count = getQuizCount(ageGroup);
  const quizzes: SolarQuiz[] = [];
  for (let i = 0; i < count; i++) {
    quizzes.push(generateSolarQuiz(planets));
  }
  return quizzes;
}

export function checkSolarAnswer(quiz: SolarQuiz, selectedIndex: number): boolean {
  return selectedIndex === quiz.correctIndex;
}

export function checkPlanetOrder(orderedIds: string[]): boolean {
  return orderedIds.every((id, i) => PLANETS[i]?.id === id);
}

export function calculateSolarScore(correct: number, total: number, timeSpent: number): GameResult {
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
