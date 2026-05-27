import type { GameConfig } from '@/types/game';

export const sistemaSolarConfig: GameConfig = {
  id: 'sistema-solar',
  name: 'Sistema Solar',
  description: 'Explore os planetas e descubra os segredos do nosso sistema solar!',
  category: 'science',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🪐',
  color: '#1E3A5F',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 5,
  skills: ['astronomia', 'planetas', 'espaço', 'ciências'],
  version: '1.0.0',
};
