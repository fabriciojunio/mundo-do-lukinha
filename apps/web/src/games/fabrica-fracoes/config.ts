import type { GameConfig } from '@/types/game';

export const fabricaFracoesConfig: GameConfig = {
  id: 'fabrica-fracoes',
  name: 'Fábrica de Frações',
  description: 'Aprenda frações cortando pizzas e barras de chocolate! Delicioso e educativo!',
  category: 'math',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🍕',
  color: '#F97316',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 4,
  skills: ['frações', 'partes', 'divisão', 'proporção'],
  version: '1.0.0',
};
