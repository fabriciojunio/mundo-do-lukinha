import type { GameConfig } from '@/types/game';

export const mathBattleConfig: GameConfig = {
  id: 'math-battle',
  name: 'Batalha dos Números',
  description: 'Resolva operações matemáticas e mostre que você é um gênio da matemática!',
  category: 'math',
  ageGroups: ['chick', 'explorer', 'adventurer', 'master'],
  icon: '🔢',
  color: '#4ECDC4',
  difficulty: { min: 1, max: 10 },
  estimatedMinutes: 3,
  skills: ['soma', 'subtração', 'multiplicação', 'divisão', 'raciocínio rápido'],
  version: '1.0.0',
};
