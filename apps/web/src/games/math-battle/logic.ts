import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export type MathOperation = '+' | '-' | '×' | '÷';

export interface MathQuestion {
  id: string;
  operand1: number;
  operand2: number;
  operation: MathOperation;
  correctAnswer: number;
  options: number[];
  displayText: string;
}

function getOperationsForAge(ageGroup: AgeGroup): MathOperation[] {
  switch (ageGroup) {
    case 'chick':
      return ['+'];
    case 'explorer':
      return ['+', '-'];
    case 'adventurer':
      return ['+', '-', '×', '÷'];
    case 'master':
      return ['+', '-', '×', '÷'];
  }
}

function getRangeForAge(ageGroup: AgeGroup, difficulty: number): { min: number; max: number } {
  const d = Math.max(1, difficulty);
  switch (ageGroup) {
    case 'chick':
      return { min: 1, max: 3 + d };
    case 'explorer':
      return { min: 1, max: 10 + d * 2 };
    case 'adventurer':
      return { min: 2, max: 20 + d * 5 };
    case 'master':
      return { min: 5, max: 50 + d * 10 };
  }
}

function getTimerForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'chick':
      return 0;
    case 'explorer':
      return 90;
    case 'adventurer':
      return 60;
    case 'master':
      return 45;
  }
}

function getOptionCountForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'chick':
      return 2;
    default:
      return 4;
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(ageGroup: AgeGroup, difficulty: number): MathQuestion {
  const operations = getOperationsForAge(ageGroup);
  const operation = operations[Math.floor(Math.random() * operations.length)] as MathOperation;
  const range = getRangeForAge(ageGroup, difficulty);

  let operand1: number;
  let operand2: number;
  let correctAnswer: number;

  switch (operation) {
    case '+':
      operand1 = randomInt(range.min, range.max);
      operand2 = randomInt(range.min, range.max);
      correctAnswer = operand1 + operand2;
      break;
    case '-':
      operand1 = randomInt(range.min, range.max);
      operand2 = randomInt(range.min, Math.min(operand1, range.max));
      correctAnswer = operand1 - operand2;
      break;
    case '×':
      operand1 = randomInt(1, Math.min(12, range.max));
      operand2 = randomInt(1, Math.min(12, range.max));
      correctAnswer = operand1 * operand2;
      break;
    case '÷':
      operand2 = randomInt(1, Math.min(10, range.max));
      correctAnswer = randomInt(1, Math.min(10, range.max));
      operand1 = operand2 * correctAnswer;
      break;
  }

  const optionCount = getOptionCountForAge(ageGroup);
  const wrongOptions = new Set<number>();
  while (wrongOptions.size < optionCount - 1) {
    const offset = randomInt(1, Math.max(5, Math.floor(correctAnswer * 0.5) + 1));
    const wrong = Math.random() > 0.5 ? correctAnswer + offset : Math.max(0, correctAnswer - offset);
    if (wrong !== correctAnswer) {
      wrongOptions.add(wrong);
    }
  }

  const options = shuffleArray([correctAnswer, ...Array.from(wrongOptions)]);

  return {
    id: Math.random().toString(36).substring(2, 9),
    operand1,
    operand2,
    operation,
    correctAnswer,
    options,
    displayText: `${operand1} ${operation} ${operand2} = ?`,
  };
}

export function checkAnswer(question: MathQuestion, answer: number): boolean {
  return answer === question.correctAnswer;
}

export function calculateScore(
  correct: number,
  total: number,
  _timeSpent: number,
  maxCombo: number,
): GameResult {
  const accuracy = total > 0 ? correct / total : 0;
  const stars = calculateStars(accuracy);
  const baseScore = correct * 10;
  const comboBonus = maxCombo * 5;
  const score = baseScore + comboBonus;
  const maxScore = total * 10 + total * 5;

  return {
    score,
    maxScore: Math.max(maxScore, score),
    timeSpent: _timeSpent,
    accuracy,
    xpEarned: calculateXP(stars),
    coinsEarned: calculateCoins(stars),
    achievements: correct >= 10 ? ['math-10'] : [],
    stars,
  };
}

export function getNextDifficulty(current: number, recentAccuracy: number): number {
  if (recentAccuracy >= 0.9) return Math.min(current + 1, 10);
  if (recentAccuracy <= 0.4) return Math.max(current - 1, 1);
  return current;
}

export { getTimerForAge, getOptionCountForAge };
