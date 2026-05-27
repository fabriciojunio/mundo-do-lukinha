import type { GameConfig } from '@/types/game';

export const memoryGameConfig: GameConfig = {
  id: 'memory-game',
  name: 'Jogo da Memória',
  description: 'Encontre todos os pares! Use sua memória para lembrar onde cada carta está.',
  category: 'fun',
  ageGroups: ['chick', 'explorer', 'adventurer', 'master'],
  icon: '🧠',
  color: '#7C3AED',
  difficulty: { min: 1, max: 5 },
  estimatedMinutes: 3,
  skills: ['memória', 'atenção', 'concentração', 'raciocínio'],
  version: '1.0.0',
};
