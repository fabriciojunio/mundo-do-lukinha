import type { GameConfig } from '@/types/game';

export const tabuadaNinjaConfig: GameConfig = {
  id: 'tabuada-ninja',
  name: 'Tabuada Ninja',
  description: 'Treine a tabuada com velocidade ninja! Quanto mais rápido, mais pontos!',
  category: 'math',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🥷',
  color: '#1A1A2E',
  difficulty: { min: 1, max: 10 },
  estimatedMinutes: 3,
  skills: ['tabuada', 'multiplicação', 'velocidade', 'memória'],
  version: '1.0.0',
};
