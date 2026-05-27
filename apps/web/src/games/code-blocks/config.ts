import type { GameConfig } from '@/types/game';

export const codeBlocksConfig: GameConfig = {
  id: 'code-blocks',
  name: 'Code Blocks',
  description: 'Programe com blocos visuais! Guie o robô pelo labirinto usando comandos!',
  category: 'programming',
  ageGroups: ['chick', 'explorer', 'adventurer', 'master'],
  icon: '🤖',
  color: '#06B6D4',
  difficulty: { min: 1, max: 10 },
  estimatedMinutes: 5,
  skills: ['programação', 'lógica', 'sequência', 'loops', 'condicionais'],
  version: '1.0.0',
};
