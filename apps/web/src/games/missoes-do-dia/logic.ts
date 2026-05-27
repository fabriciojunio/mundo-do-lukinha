import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface DailyTask { id: string; name: string; emoji: string; priority: number; timeOfDay: 'morning' | 'afternoon' | 'night'; }
export interface MissionChallenge { id: string; question: string; tasks: DailyTask[]; correctOrder: string[]; options: string[][]; correctIndex: number; explanation: string; difficulty: number; }

const TASKS: DailyTask[] = [
  { id: 't1', name: 'Escovar os dentes', emoji: '🪥', priority: 1, timeOfDay: 'morning' },
  { id: 't2', name: 'Tomar café da manhã', emoji: '🥣', priority: 2, timeOfDay: 'morning' },
  { id: 't3', name: 'Ir para escola', emoji: '🏫', priority: 3, timeOfDay: 'morning' },
  { id: 't4', name: 'Fazer lição de casa', emoji: '📚', priority: 4, timeOfDay: 'afternoon' },
  { id: 't5', name: 'Brincar', emoji: '⚽', priority: 5, timeOfDay: 'afternoon' },
  { id: 't6', name: 'Tomar banho', emoji: '🚿', priority: 6, timeOfDay: 'night' },
  { id: 't7', name: 'Jantar', emoji: '🍽️', priority: 7, timeOfDay: 'night' },
  { id: 't8', name: 'Dormir', emoji: '😴', priority: 8, timeOfDay: 'night' },
];

const CHALLENGES: MissionChallenge[] = [
  { id: 'm1', difficulty: 1, question: 'Qual é a PRIMEIRA coisa a fazer ao acordar?',
    tasks: TASKS.slice(0, 3), correctOrder: ['Escovar os dentes', 'Tomar café da manhã', 'Ir para escola'],
    options: [['Escovar os dentes'], ['Ir para escola'], ['Brincar'], ['Dormir']], correctIndex: 0,
    explanation: 'Escovar os dentes é a primeira coisa ao acordar! Higiene em primeiro lugar!' },
  { id: 'm2', difficulty: 1, question: 'O que vem ANTES de ir pra escola?',
    tasks: TASKS.slice(0, 3), correctOrder: [],
    options: [['Tomar café'], ['Dormir'], ['Brincar'], ['Jantar']], correctIndex: 0,
    explanation: 'Precisamos comer antes de ir pra escola! Energia para o dia!' },
  { id: 'm3', difficulty: 1, question: 'Quando devemos fazer a lição de casa?',
    tasks: TASKS.slice(3, 6), correctOrder: [],
    options: [['À tarde, depois da escola'], ['De madrugada'], ['Nunca'], ['Na hora de dormir']], correctIndex: 0,
    explanation: 'Fazer lição à tarde garante que temos tempo e energia! Responsabilidade!' },
  { id: 'm4', difficulty: 2, question: 'Qual a ordem certa da rotina da manhã?',
    tasks: TASKS.slice(0, 3), correctOrder: [],
    options: [['Escovar dentes → Café → Escola'], ['Escola → Café → Escovar'], ['Café → Escola → Escovar'], ['Dormir → Café → Escola']], correctIndex: 0,
    explanation: 'Higiene primeiro, depois alimentação, depois escola! Essa é a rotina ideal.' },
  { id: 'm5', difficulty: 2, question: 'O que fazer ANTES de dormir?',
    tasks: TASKS.slice(5, 8), correctOrder: [],
    options: [['Banho → Jantar → Dormir'], ['Dormir → Banho → Jantar'], ['Jantar → Dormir → Banho'], ['Brincar a noite toda']], correctIndex: 0,
    explanation: 'Banho, jantar e depois dormir! Rotina noturna para um sono saudável.' },
  { id: 'm6', difficulty: 2, question: 'Responsabilidade primeiro, depois diversão. Qual a ordem certa?',
    tasks: TASKS.slice(3, 6), correctOrder: [],
    options: [['Lição → Brincar'], ['Brincar → Lição'], ['Só brincar'], ['Só lição']], correctIndex: 0,
    explanation: 'Fazer a lição primeiro e brincar depois! Disciplina traz recompensas!' },
];

export function getChallengesForAge(ageGroup: AgeGroup): MissionChallenge[] {
  switch (ageGroup) { case 'chick': case 'explorer': return CHALLENGES.filter((c) => c.difficulty === 1); case 'adventurer': case 'master': return CHALLENGES; default: return CHALLENGES.filter((c) => c.difficulty === 1); }
}

export function selectMissions(ageGroup: AgeGroup): MissionChallenge[] {
  const pool = getChallengesForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'chick' ? 3 : ageGroup === 'explorer' ? 3 : 5);
}

export function checkMissionAnswer(challenge: MissionChallenge, idx: number): boolean { return idx === challenge.correctIndex; }

export function calculateMissionScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0; const stars = calculateStars(accuracy);
  return { score: correct * 15, maxScore: total * 15, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
