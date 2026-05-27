import type { GameConfig } from '@/types/game';
export const binaryHeroConfig: GameConfig = {
  id: 'binary-hero', name: 'Binary Hero', description: 'Desvende o sistema binário! Converta números entre decimal e binário!',
  category: 'programming', ageGroups: ['adventurer', 'master'], icon: '🔢', color: '#14B8A6',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 4, skills: ['binário', 'decimal', 'computação', 'conversão'], version: '1.0.0',
};
