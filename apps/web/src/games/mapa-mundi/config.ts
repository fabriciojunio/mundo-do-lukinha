import type { GameConfig } from '@/types/game';

export const mapaMundiConfig: GameConfig = {
  id: 'mapa-mundi',
  name: 'Mapa Mundi',
  description: 'Viaje pelo mundo! Descubra países, capitais e bandeiras!',
  category: 'geography',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🌍',
  color: '#22C55E',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 5,
  skills: ['geografia', 'países', 'capitais', 'bandeiras', 'continentes'],
  version: '1.0.0',
};
