import type { GameConfig } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export const construtorMundosConfig: GameConfig = {
  id: 'construtor-mundos', name: 'Construtor de Mundos', description: 'Construa seu mundo! Coloque blocos e crie paisagens incríveis!',
  category: 'fun', ageGroups: ['chick', 'explorer', 'adventurer', 'master'], icon: '🧱', color: '#78716C',
  difficulty: { min: 1, max: 6 }, estimatedMinutes: 5, skills: ['criatividade', 'construção', 'planejamento'], version: '1.0.0',
};

export interface Block { emoji: string; name: string; color: string; }
export const BLOCKS: Block[] = [
  { emoji: '🟫', name: 'Terra', color: '#92400E' }, { emoji: '🟩', name: 'Grama', color: '#22C55E' },
  { emoji: '🟦', name: 'Água', color: '#3B82F6' }, { emoji: '🪨', name: 'Pedra', color: '#6B7280' },
  { emoji: '🌳', name: 'Árvore', color: '#166534' }, { emoji: '🏠', name: 'Casa', color: '#F59E0B' },
  { emoji: '🌸', name: 'Flor', color: '#EC4899' }, { emoji: '☁️', name: 'Nuvem', color: '#E5E7EB' },
];

export function getGridSize(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'chick': return 5; case 'explorer': return 8; case 'adventurer': return 10; case 'master': return 12; }
}

export function createGrid(size: number): (number | null)[][] { return Array.from({ length: size }, () => Array.from({ length: size }, () => null)); }

export function countBlocks(grid: (number | null)[][]): number { return grid.flat().filter((c) => c !== null).length; }

export function calculateBuildScore(blocksPlaced: number, gridSize: number, timeSpent: number): GameResult {
  const maxBlocks = gridSize * gridSize;
  const accuracy = Math.min(blocksPlaced / (maxBlocks * 0.3), 1);
  const stars = calculateStars(accuracy);
  return { score: blocksPlaced * 5, maxScore: maxBlocks * 5, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
