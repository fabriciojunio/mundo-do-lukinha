import type { GameConfig } from '@/types/game';

export const maquinaDoTempoConfig: GameConfig = {
  id: 'maquina-do-tempo',
  name: 'Máquina do Tempo',
  description: 'Viaje pela história! Descubra civilizações, inventores e grandes momentos!',
  category: 'history',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '⏳',
  color: '#92400E',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 5,
  skills: ['história', 'civilizações', 'cronologia', 'cultura'],
  version: '1.0.0',
};
