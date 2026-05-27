import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface FractionChallenge {
  id: string;
  type: 'identify' | 'compare' | 'create';
  numerator: number;
  denominator: number;
  displayText: string;
  visual: 'pizza' | 'bar' | 'chocolate';
  options: string[];
  correctIndex: number;
  explanation: string;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export function getDenominators(ageGroup: AgeGroup): number[] {
  switch (ageGroup) {
    case 'explorer': return [2, 3, 4];
    case 'adventurer': return [2, 3, 4, 5, 6, 8];
    case 'master': return [2, 3, 4, 5, 6, 8, 10, 12];
    default: return [2, 4];
  }
}

export function getChallengeCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 8;
    case 'adventurer': return 10;
    case 'master': return 12;
    default: return 8;
  }
}

export function fractionToString(num: number, den: number): string {
  return `${num}/${den}`;
}

export function simplifyFraction(num: number, den: number): [number, number] {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(Math.abs(num), Math.abs(den));
  return [num / g, den / g];
}

export function generateIdentifyChallenge(denoms: number[]): FractionChallenge {
  const denominator = randomChoice(denoms);
  const numerator = Math.floor(Math.random() * denominator) + 1;
  const visual = randomChoice<'pizza' | 'bar' | 'chocolate'>(['pizza', 'bar', 'chocolate']);
  const correct = fractionToString(numerator, denominator);

  const wrongOptions = new Set<string>();
  while (wrongOptions.size < 3) {
    const wn = Math.floor(Math.random() * denominator) + 1;
    const wd = randomChoice(denoms);
    const wrong = fractionToString(wn, wd);
    if (wrong !== correct) wrongOptions.add(wrong);
  }

  const allOptions = shuffleArray([correct, ...Array.from(wrongOptions)]);
  const correctIndex = allOptions.indexOf(correct);

  return {
    id: Math.random().toString(36).substring(2, 9),
    type: 'identify',
    numerator,
    denominator,
    displayText: `Qual fração está pintada?`,
    visual,
    options: allOptions,
    correctIndex,
    explanation: `${numerator} de ${denominator} partes estão pintadas, então é ${correct}!`,
  };
}

export function generateCompareChallenge(denoms: number[]): FractionChallenge {
  const d1 = randomChoice(denoms);
  const d2 = randomChoice(denoms);
  const n1 = Math.floor(Math.random() * d1) + 1;
  const n2 = Math.floor(Math.random() * d2) + 1;
  const val1 = n1 / d1;
  const val2 = n2 / d2;

  let correctAnswer: string;
  if (Math.abs(val1 - val2) < 0.001) {
    correctAnswer = 'São iguais';
  } else if (val1 > val2) {
    correctAnswer = `${n1}/${d1} é maior`;
  } else {
    correctAnswer = `${n2}/${d2} é maior`;
  }

  const options = shuffleArray([
    `${n1}/${d1} é maior`,
    `${n2}/${d2} é maior`,
    'São iguais',
  ]);
  const correctIndex = options.indexOf(correctAnswer);

  return {
    id: Math.random().toString(36).substring(2, 9),
    type: 'compare',
    numerator: n1,
    denominator: d1,
    displayText: `Compare: ${n1}/${d1} e ${n2}/${d2}`,
    visual: 'bar',
    options,
    correctIndex: Math.max(0, correctIndex),
    explanation: `${n1}/${d1} = ${(val1 * 100).toFixed(0)}% e ${n2}/${d2} = ${(val2 * 100).toFixed(0)}%`,
  };
}

export function generateChallenge(ageGroup: AgeGroup): FractionChallenge {
  const denoms = getDenominators(ageGroup);
  if (ageGroup === 'explorer' || Math.random() > 0.5) {
    return generateIdentifyChallenge(denoms);
  }
  return generateCompareChallenge(denoms);
}

export function checkFractionAnswer(challenge: FractionChallenge, selectedIndex: number): boolean {
  return selectedIndex === challenge.correctIndex;
}

export function calculateFractionScore(
  correct: number,
  total: number,
  timeSpent: number,
): GameResult {
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
