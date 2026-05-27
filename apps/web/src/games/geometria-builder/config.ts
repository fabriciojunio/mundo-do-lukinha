import type { GameConfig } from '@/types/game';

export const geometriaBuilderConfig: GameConfig = {
  id: 'geometria-builder',
  name: 'Geometria Builder',
  description: 'Descubra formas geométricas! Identifique, conte lados e calcule áreas!',
  category: 'math',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '📐',
  color: '#06B6D4',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 4,
  skills: ['geometria', 'formas', 'lados', 'áreas', 'ângulos'],
  version: '1.0.0',
};
