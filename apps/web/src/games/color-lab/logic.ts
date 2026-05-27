import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorMission {
  id: string;
  targetColor: RGB;
  targetName: string;
  hint: string;
}

export function mixColors(c1: RGB, c2: RGB): RGB {
  return {
    r: Math.round((c1.r + c2.r) / 2),
    g: Math.round((c1.g + c2.g) / 2),
    b: Math.round((c1.b + c2.b) / 2),
  };
}

export function colorToHex(rgb: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function hexToColor(hex: string): RGB {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16) || 0,
    g: parseInt(clean.substring(2, 4), 16) || 0,
    b: parseInt(clean.substring(4, 6), 16) || 0,
  };
}

export function colorToCSS(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function isColorClose(target: RGB, attempt: RGB, tolerance: number): boolean {
  const dr = Math.abs(target.r - attempt.r);
  const dg = Math.abs(target.g - attempt.g);
  const db = Math.abs(target.b - attempt.b);
  return dr <= tolerance && dg <= tolerance && db <= tolerance;
}

export function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

const PRIMARY_COLORS: Array<{ name: string; color: RGB }> = [
  { name: 'Vermelho', color: { r: 255, g: 0, b: 0 } },
  { name: 'Azul', color: { r: 0, g: 0, b: 255 } },
  { name: 'Amarelo', color: { r: 255, g: 255, b: 0 } },
];

const SECONDARY_MISSIONS: ColorMission[] = [
  { id: 'm-green', targetColor: { r: 0, g: 128, b: 0 }, targetName: 'Verde', hint: 'Azul + Amarelo' },
  { id: 'm-orange', targetColor: { r: 255, g: 128, b: 0 }, targetName: 'Laranja', hint: 'Vermelho + Amarelo' },
  { id: 'm-purple', targetColor: { r: 128, g: 0, b: 128 }, targetName: 'Roxo', hint: 'Vermelho + Azul' },
];

const IDENTIFY_MISSIONS: ColorMission[] = [
  { id: 'i-red', targetColor: { r: 255, g: 0, b: 0 }, targetName: 'Vermelho', hint: 'Toque no vermelho!' },
  { id: 'i-blue', targetColor: { r: 0, g: 0, b: 255 }, targetName: 'Azul', hint: 'Toque no azul!' },
  { id: 'i-yellow', targetColor: { r: 255, g: 255, b: 0 }, targetName: 'Amarelo', hint: 'Toque no amarelo!' },
];

export function getMissions(ageGroup: AgeGroup): ColorMission[] {
  switch (ageGroup) {
    case 'chick':
      return IDENTIFY_MISSIONS;
    case 'explorer':
      return SECONDARY_MISSIONS;
    case 'adventurer':
      return [...SECONDARY_MISSIONS, ...IDENTIFY_MISSIONS];
    default:
      return SECONDARY_MISSIONS;
  }
}

export function getAvailableColors(ageGroup: AgeGroup): Array<{ name: string; color: RGB }> {
  switch (ageGroup) {
    case 'chick':
      return PRIMARY_COLORS;
    case 'explorer':
      return PRIMARY_COLORS;
    case 'adventurer':
      return [
        ...PRIMARY_COLORS,
        { name: 'Branco', color: { r: 255, g: 255, b: 255 } },
        { name: 'Preto', color: { r: 0, g: 0, b: 0 } },
      ];
    default:
      return PRIMARY_COLORS;
  }
}

export function calculateColorLabScore(
  missionsComplete: number,
  totalMissions: number,
  mixesMade: number,
  timeSpent: number,
): GameResult {
  const accuracy = totalMissions > 0 ? missionsComplete / totalMissions : 0;
  const stars = calculateStars(accuracy);
  const score = missionsComplete * 20;
  const maxScore = totalMissions * 20;

  const achievements: string[] = [];
  if (mixesMade >= 10) achievements.push('color-mixer');

  return {
    score,
    maxScore,
    timeSpent,
    accuracy,
    xpEarned: calculateXP(stars),
    coinsEarned: calculateCoins(stars),
    achievements,
    stars,
  };
}
