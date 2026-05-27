import type { GameConfig } from '@/types/game';

export const wordHuntConfig: GameConfig = {
  id: 'word-hunt',
  name: 'Caça-Palavras',
  description: 'Encontre as palavras escondidas na grade de letras!',
  category: 'portuguese',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🔍',
  color: '#F97316',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 5,
  skills: ['vocabulário', 'atenção', 'leitura', 'observação'],
  version: '1.0.0',
};
