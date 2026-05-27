import type { GameConfig } from '@/types/game';

export const ditadoMusicalConfig: GameConfig = {
  id: 'ditado-musical',
  name: 'Ditado Musical',
  description: 'Ouça a palavra e escreva corretamente! Treine sua ortografia com sons!',
  category: 'portuguese',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🎵',
  color: '#7C3AED',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 4,
  skills: ['ortografia', 'escrita', 'escuta', 'vocabulário'],
  version: '1.0.0',
};
