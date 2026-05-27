import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export interface PixelColor {
  name: string;
  hex: string;
  emoji: string;
}

export const PALETTE: PixelColor[] = [
  { name: 'Vermelho', hex: '#EF4444', emoji: '🔴' },
  { name: 'Azul', hex: '#3B82F6', emoji: '🔵' },
  { name: 'Verde', hex: '#22C55E', emoji: '🟢' },
  { name: 'Amarelo', hex: '#EAB308', emoji: '🟡' },
  { name: 'Roxo', hex: '#8B5CF6', emoji: '🟣' },
  { name: 'Laranja', hex: '#F97316', emoji: '🟠' },
  { name: 'Preto', hex: '#1F2937', emoji: '⬛' },
  { name: 'Branco', hex: '#FFFFFF', emoji: '⬜' },
];

export interface PixelPattern {
  id: string;
  name: string;
  grid: (number | null)[][];
  gridSize: number;
  difficulty: number;
}

// Color indices reference PALETTE array
const PATTERNS: PixelPattern[] = [
  { id: 'heart', name: 'Coração', gridSize: 5, difficulty: 1, grid: [
    [null, 0, null, 0, null],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [null, 0, 0, 0, null],
    [null, null, 0, null, null],
  ]},
  { id: 'star', name: 'Estrela', gridSize: 5, difficulty: 1, grid: [
    [null, null, 3, null, null],
    [null, 3, 3, 3, null],
    [3, 3, 3, 3, 3],
    [null, 3, 3, 3, null],
    [null, 3, null, 3, null],
  ]},
  { id: 'tree', name: 'Árvore', gridSize: 5, difficulty: 2, grid: [
    [null, null, 2, null, null],
    [null, 2, 2, 2, null],
    [2, 2, 2, 2, 2],
    [null, null, 5, null, null],
    [null, null, 5, null, null],
  ]},
  { id: 'face', name: 'Carinha', gridSize: 6, difficulty: 2, grid: [
    [null, 3, 3, 3, 3, null],
    [3, 3, 3, 3, 3, 3],
    [3, 6, 3, 3, 6, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 0, 3, 3, 0, 3],
    [null, 3, 0, 0, 3, null],
  ]},
  { id: 'house', name: 'Casinha', gridSize: 7, difficulty: 3, grid: [
    [null, null, null, 0, null, null, null],
    [null, null, 0, 0, 0, null, null],
    [null, 0, 0, 0, 0, 0, null],
    [null, 5, 5, 5, 5, 5, null],
    [null, 5, 1, 5, 5, 5, null],
    [null, 5, 1, 5, 2, 5, null],
    [null, 5, 5, 5, 5, 5, null],
  ]},
];

export function getPatternsForAge(ageGroup: AgeGroup): PixelPattern[] {
  switch (ageGroup) {
    case 'explorer': return PATTERNS.filter((p) => p.difficulty === 1);
    case 'adventurer': return PATTERNS.filter((p) => p.difficulty <= 2);
    case 'master': return PATTERNS;
    default: return PATTERNS.filter((p) => p.difficulty === 1);
  }
}

export function getPatternCount(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'explorer': return 2; case 'adventurer': return 3; case 'master': return 4; default: return 2; }
}

export function createEmptyGrid(size: number): (number | null)[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

export function compareGrids(target: (number | null)[][], attempt: (number | null)[][]): { correct: number; total: number } {
  let correctCount = 0;
  let totalPixels = 0;
  for (let r = 0; r < target.length; r++) {
    for (let c = 0; c < (target[r]?.length ?? 0); c++) {
      const t = target[r]?.[c];
      if (t !== null && t !== undefined) {
        totalPixels++;
        if (attempt[r]?.[c] === t) correctCount++;
      }
    }
  }
  return { correct: correctCount, total: totalPixels };
}

export function calculatePixelScore(correctPixels: number, totalPixels: number, patternsCompleted: number, totalPatterns: number, timeSpent: number): GameResult {
  const pixelAccuracy = totalPixels > 0 ? correctPixels / totalPixels : 0;
  const patternAccuracy = totalPatterns > 0 ? patternsCompleted / totalPatterns : 0;
  const accuracy = (pixelAccuracy + patternAccuracy) / 2;
  const stars = calculateStars(accuracy);
  return { score: patternsCompleted * 30, maxScore: totalPatterns * 30, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
