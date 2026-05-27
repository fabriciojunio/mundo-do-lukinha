import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface MemoryCard {
  id: string;
  emoji: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const THEMES: Record<string, string[]> = {
  animals: ['🐶', '🐱', '🐼', '🐨', '🦁', '🐯', '🐸', '🐙', '🦋', '🐬'],
  emojis: ['😀', '😎', '🤩', '🥳', '😇', '🤖', '👻', '🎃', '🦄', '⭐'],
  flags: ['🇧🇷', '🇺🇸', '🇫🇷', '🇯🇵', '🇩🇪', '🇮🇹', '🇪🇸', '🇬🇧', '🇨🇦', '🇦🇺'],
  science: ['⚛️', '🧬', '🔬', '🧪', '🌡️', '💎', '🧲', '⚡', '🔭', '🌍'],
};

function getThemeForAge(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case 'chick':
      return 'animals';
    case 'explorer':
      return 'emojis';
    case 'adventurer':
      return 'flags';
    case 'master':
      return 'science';
  }
}

export function getPairCountForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'chick':
      return 2;
    case 'explorer':
      return 6;
    case 'adventurer':
      return 8;
    case 'master':
      return 10;
  }
}

export function getGridColsForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'chick':
      return 2;
    case 'explorer':
      return 4;
    case 'adventurer':
      return 4;
    case 'master':
      return 5;
  }
}

export function generateBoard(ageGroup: AgeGroup): MemoryCard[] {
  const theme = getThemeForAge(ageGroup);
  const pairCount = getPairCountForAge(ageGroup);
  const emojis = (THEMES[theme] ?? THEMES['animals'] ?? []).slice(0, pairCount);

  const cards: MemoryCard[] = [];
  emojis.forEach((emoji, index) => {
    const pairId = `pair-${index}`;
    cards.push({ id: `${pairId}-a`, emoji, pairId, isFlipped: false, isMatched: false });
    cards.push({ id: `${pairId}-b`, emoji, pairId, isFlipped: false, isMatched: false });
  });

  return shuffleArray(cards);
}

export function checkMatch(card1: MemoryCard, card2: MemoryCard): boolean {
  return card1.pairId === card2.pairId && card1.id !== card2.id;
}

export function calculateMemoryScore(
  moves: number,
  pairs: number,
  timeSpent: number,
  perfectGame: boolean,
): GameResult {
  const minMoves = pairs;
  const moveRatio = minMoves / Math.max(moves, 1);
  const accuracy = Math.min(moveRatio, 1);
  const stars = calculateStars(accuracy);
  const score = Math.round(accuracy * 100 * pairs);
  const maxScore = 100 * pairs;

  const achievements: string[] = [];
  if (perfectGame) achievements.push('memory-master');

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
