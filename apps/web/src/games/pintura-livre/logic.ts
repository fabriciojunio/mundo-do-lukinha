import type { GameConfig } from '@/types/game';
import { type GameResult, calculateXP, calculateCoins } from '@/types/game';

export const pinturaLivreConfig: GameConfig = {
  id: 'pintura-livre', name: 'Pintura Livre', description: 'Libere sua criatividade! Desenhe e pinte livremente no canvas digital!',
  category: 'arts', ageGroups: ['chick', 'explorer', 'adventurer', 'master'], icon: '🖌️', color: '#F43F5E',
  difficulty: { min: 1, max: 1 }, estimatedMinutes: 5, skills: ['criatividade', 'arte', 'cores', 'expressão'], version: '1.0.0',
};

export const PAINT_COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#000000', '#FFFFFF', '#92400E'];
export const BRUSH_SIZES = [4, 8, 16, 24];

export function calculatePaintScore(strokes: number, colorsUsed: number, timeSpent: number): GameResult {
  const creativity = Math.min(1, (strokes / 20) * 0.5 + (colorsUsed / 5) * 0.5);
  return { score: Math.round(creativity * 100), maxScore: 100, timeSpent, accuracy: creativity, xpEarned: calculateXP(3), coinsEarned: calculateCoins(3), achievements: [], stars: 3 };
}
