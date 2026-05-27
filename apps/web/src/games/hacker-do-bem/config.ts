import type { GameConfig } from '@/types/game';

export const hackerDoBemConfig: GameConfig = {
  id: 'hacker-do-bem',
  name: 'Hacker do Bem',
  description: 'Aprenda segurança digital! Crie senhas fortes, identifique golpes e proteja-se online!',
  category: 'programming',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🛡️',
  color: '#059669',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 5,
  skills: ['segurança digital', 'senhas', 'privacidade', 'golpes online'],
  version: '1.0.0',
};
