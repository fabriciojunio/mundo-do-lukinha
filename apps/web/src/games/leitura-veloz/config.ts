import type { GameConfig } from '@/types/game';

export const leituraVelozConfig: GameConfig = {
  id: 'leitura-veloz',
  name: 'Leitura Veloz',
  description: 'Leia o texto e responda rápido! Treine sua interpretação de texto!',
  category: 'portuguese',
  ageGroups: ['adventurer', 'master'],
  icon: '📖',
  color: '#10B981',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 5,
  skills: ['leitura', 'interpretação', 'compreensão', 'velocidade'],
  version: '1.0.0',
};
