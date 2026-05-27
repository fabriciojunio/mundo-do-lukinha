import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export type BinaryMode = 'dec-to-bin' | 'bin-to-dec' | 'toggle-bits';

export interface BinaryChallenge {
  id: string;
  mode: BinaryMode;
  decimal: number;
  binary: string;
  question: string;
  options: string[];
  correctIndex: number;
  bits: number;
}

export function decimalToBinary(n: number, bits: number): string {
  return n.toString(2).padStart(bits, '0');
}

export function binaryToDecimal(bin: string): number {
  return parseInt(bin, 2);
}

export function getBitsForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'adventurer': return 4; case 'master': return 8; default: return 4; }
}

export function getRangeForAge(ageGroup: AgeGroup): { min: number; max: number } {
  switch (ageGroup) { case 'adventurer': return { min: 1, max: 15 }; case 'master': return { min: 1, max: 255 }; default: return { min: 1, max: 15 }; }
}

export function getChallengeCount(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'adventurer': return 8; case 'master': return 10; default: return 8; }
}

export function generateBinaryChallenge(ageGroup: AgeGroup): BinaryChallenge {
  const bits = getBitsForAge(ageGroup);
  const range = getRangeForAge(ageGroup);
  const decimal = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const binary = decimalToBinary(decimal, bits);
  const mode: BinaryMode = Math.random() > 0.5 ? 'dec-to-bin' : 'bin-to-dec';

  let question: string;
  let correct: string;
  let wrongPool: string[];

  if (mode === 'dec-to-bin') {
    question = `Converta ${decimal} para binário (${bits} bits):`;
    correct = binary;
    wrongPool = [];
    while (wrongPool.length < 3) {
      const wrongDec = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const wrongBin = decimalToBinary(wrongDec, bits);
      if (wrongBin !== correct && !wrongPool.includes(wrongBin)) wrongPool.push(wrongBin);
    }
  } else {
    question = `Converta ${binary} para decimal:`;
    correct = `${decimal}`;
    wrongPool = [];
    while (wrongPool.length < 3) {
      const wrongDec = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const wrongStr = `${wrongDec}`;
      if (wrongStr !== correct && !wrongPool.includes(wrongStr)) wrongPool.push(wrongStr);
    }
  }

  const options = shuffleArray([correct, ...wrongPool]);
  const correctIndex = options.indexOf(correct);

  return { id: Math.random().toString(36).substring(2, 9), mode, decimal, binary, question, options, correctIndex: Math.max(0, correctIndex), bits };
}

export function checkBinaryAnswer(challenge: BinaryChallenge, selectedIndex: number): boolean {
  return selectedIndex === challenge.correctIndex;
}

export function calculateBinaryScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0; const stars = calculateStars(accuracy);
  return { score: correct * 15, maxScore: total * 15, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
