import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface TabuadaQuestion {
  id: string;
  a: number;
  b: number;
  correctAnswer: number;
  options: number[];
  displayText: string;
}

export type NinjaBelt = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'black';

export function getTablesForAge(ageGroup: AgeGroup): number[] {
  switch (ageGroup) {
    case 'explorer':
      return [2, 3, 4, 5];
    case 'adventurer':
      return [2, 3, 4, 5, 6, 7, 8, 9];
    case 'master':
      return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    default:
      return [2, 3, 4, 5];
  }
}

export function getQuestionsPerRound(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer':
      return 10;
    case 'adventurer':
      return 15;
    case 'master':
      return 20;
    default:
      return 10;
  }
}

export function getTimeLimitMs(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer':
      return 8000;
    case 'adventurer':
      return 5000;
    case 'master':
      return 3000;
    default:
      return 8000;
  }
}

export function generateTabuadaQuestion(
  tables: number[],
  _difficulty: number,
): TabuadaQuestion {
  const a = tables[Math.floor(Math.random() * tables.length)] ?? 2;
  const b = Math.floor(Math.random() * 10) + 1;
  const correctAnswer = a * b;

  const wrongSet = new Set<number>();
  while (wrongSet.size < 3) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const wrong = Math.random() > 0.5
      ? correctAnswer + offset
      : Math.max(1, correctAnswer - offset);
    if (wrong !== correctAnswer) {
      wrongSet.add(wrong);
    }
  }

  const options = shuffleArray([correctAnswer, ...Array.from(wrongSet)]);

  return {
    id: Math.random().toString(36).substring(2, 9),
    a,
    b,
    correctAnswer,
    options,
    displayText: `${a} × ${b} = ?`,
  };
}

export function checkTabuadaAnswer(question: TabuadaQuestion, answer: number): boolean {
  return answer === question.correctAnswer;
}

export function getSpeedBonus(responseTimeMs: number, timeLimitMs: number): number {
  const ratio = 1 - responseTimeMs / timeLimitMs;
  if (ratio > 0.8) return 5;
  if (ratio > 0.6) return 3;
  if (ratio > 0.3) return 1;
  return 0;
}

export function getBelt(accuracy: number, avgSpeedRatio: number): NinjaBelt {
  const combined = accuracy * 0.6 + avgSpeedRatio * 0.4;
  if (combined >= 0.95) return 'black';
  if (combined >= 0.85) return 'red';
  if (combined >= 0.7) return 'blue';
  if (combined >= 0.55) return 'green';
  if (combined >= 0.4) return 'yellow';
  return 'white';
}

export const BELT_LABELS: Record<NinjaBelt, string> = {
  white: 'Faixa Branca',
  yellow: 'Faixa Amarela',
  green: 'Faixa Verde',
  blue: 'Faixa Azul',
  red: 'Faixa Vermelha',
  black: 'Faixa Preta',
};

export const BELT_EMOJIS: Record<NinjaBelt, string> = {
  white: '🤍',
  yellow: '💛',
  green: '💚',
  blue: '💙',
  red: '❤️',
  black: '🖤',
};

export function calculateTabuadaScore(
  correct: number,
  total: number,
  totalSpeedBonus: number,
  totalTimeMs: number,
  timeLimitMs: number,
): GameResult {
  const accuracy = total > 0 ? correct / total : 0;
  const avgResponseTime = total > 0 ? totalTimeMs / total : timeLimitMs;
  const avgSpeedRatio = Math.max(0, 1 - avgResponseTime / timeLimitMs);
  const stars = calculateStars(accuracy);
  const score = correct * 10 + totalSpeedBonus;
  const maxScore = total * 15;

  return {
    score,
    maxScore: Math.max(maxScore, score),
    timeSpent: Math.floor(totalTimeMs / 1000),
    accuracy,
    xpEarned: calculateXP(stars),
    coinsEarned: calculateCoins(stars),
    achievements: [],
    stars,
  };
}
