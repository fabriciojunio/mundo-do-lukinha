import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export interface PuzzlePiece { id: number; currentPos: number; correctPos: number; emoji: string; }

const EMOJI_SETS: Record<string, string[]> = {
  animals: ['🐶', '🐱', '🐼', '🦊', '🐨', '🐯', '🦁', '🐸', '🐙', '🦋', '🐬', '🐢', '🦜', '🐰', '🐻', '🐷'],
  food: ['🍎', '🍌', '🍕', '🍔', '🍦', '🧁', '🍩', '🍪', '🍉', '🍇', '🥑', '🌽', '🍓', '🥝', '🍑', '🫐'],
  nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌲', '🌈', '⭐', '🌙', '☀️', '❄️', '🔥', '💧', '🌊', '⚡'],
};

export function getGridSize(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'chick': return 2; case 'explorer': return 3; case 'adventurer': return 4; case 'master': return 4; default: return 3; }
}

export function getRounds(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'chick': return 3; case 'explorer': return 3; case 'adventurer': return 4; case 'master': return 5; default: return 3; }
}

export function generatePuzzle(size: number): PuzzlePiece[] {
  const total = size * size;
  const themeKeys = Object.keys(EMOJI_SETS);
  const theme = themeKeys[Math.floor(Math.random() * themeKeys.length)] ?? 'animals';
  const emojis = (EMOJI_SETS[theme] ?? []).slice(0, total);
  const pieces: PuzzlePiece[] = emojis.map((emoji, i) => ({ id: i, currentPos: i, correctPos: i, emoji }));
  // Shuffle positions
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tempPos = pieces[i]!.currentPos;
    pieces[i]!.currentPos = pieces[j]!.currentPos;
    pieces[j]!.currentPos = tempPos;
  }
  return pieces;
}

export function swapPieces(pieces: PuzzlePiece[], pos1: number, pos2: number): PuzzlePiece[] {
  return pieces.map((p) => {
    if (p.currentPos === pos1) return { ...p, currentPos: pos2 };
    if (p.currentPos === pos2) return { ...p, currentPos: pos1 };
    return p;
  });
}

export function isPuzzleSolved(pieces: PuzzlePiece[]): boolean {
  return pieces.every((p) => p.currentPos === p.correctPos);
}

export function countCorrectPieces(pieces: PuzzlePiece[]): number {
  return pieces.filter((p) => p.currentPos === p.correctPos).length;
}

export function calculatePuzzleScore(roundsCompleted: number, totalRounds: number, totalMoves: number, timeSpent: number): GameResult {
  const accuracy = totalRounds > 0 ? roundsCompleted / totalRounds : 0;
  const stars = calculateStars(accuracy);
  return { score: roundsCompleted * 20, maxScore: totalRounds * 20, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
