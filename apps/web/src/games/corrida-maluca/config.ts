import type { GameConfig } from '@/types/game';
export const corridaMalucaConfig: GameConfig = {
  id: 'corrida-maluca', name: 'Corrida Maluca', description: 'Corra e desvie dos obstáculos! Colete power-ups e chegue primeiro!',
  category: 'fun', ageGroups: ['chick', 'explorer', 'adventurer', 'master'], icon: '🏎️', color: '#EF4444',
  difficulty: { min: 1, max: 10 }, estimatedMinutes: 2, skills: ['reflexo', 'coordenação', 'velocidade'], version: '1.0.0',
};
