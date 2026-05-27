import type { GameConfig } from '@/types/game';
export const guardiaoFlorestaConfig: GameConfig = {
  id: 'guardiao-floresta', name: 'Guardião da Floresta', description: 'Proteja o meio ambiente! Tome decisões para salvar a floresta e o planeta!',
  category: 'life-skills', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🌳', color: '#16A34A',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['meio ambiente', 'ecologia', 'sustentabilidade', 'natureza'], version: '1.0.0',
};
