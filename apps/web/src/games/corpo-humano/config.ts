import type { GameConfig } from '@/types/game';

export const corpoHumanoConfig: GameConfig = {
  id: 'corpo-humano',
  name: 'Corpo Humano Explorer',
  description: 'Descubra os órgãos e sistemas do corpo humano! Arraste cada órgão para o lugar certo.',
  category: 'science',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🫀',
  color: '#EF4444',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 5,
  skills: ['anatomia', 'ciências', 'corpo humano', 'órgãos'],
  version: '1.0.0',
};
