import type { GameConfig } from '@/types/game';

export const dinoRunnerConfig: GameConfig = {
  id: 'dino-runner',
  name: 'Dino Runner',
  description: 'Corra com o dinossauro e desvie dos obstáculos! Quanto mais longe, mais pontos!',
  category: 'fun',
  ageGroups: ['chick', 'explorer', 'adventurer', 'master'],
  icon: '🦕',
  color: '#22C55E',
  difficulty: { min: 1, max: 10 },
  estimatedMinutes: 2,
  skills: ['reflexo', 'coordenação', 'timing'],
  version: '1.0.0',
};
