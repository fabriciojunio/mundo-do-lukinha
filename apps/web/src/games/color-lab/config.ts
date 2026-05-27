import type { GameConfig } from '@/types/game';

export const colorLabConfig: GameConfig = {
  id: 'color-lab',
  name: 'Laboratório de Cores',
  description: 'Misture cores e descubra novas! Aprenda como as cores funcionam.',
  category: 'arts',
  ageGroups: ['chick', 'explorer', 'adventurer'],
  icon: '🎨',
  color: '#EC4899',
  difficulty: { min: 1, max: 6 },
  estimatedMinutes: 4,
  skills: ['cores', 'mistura', 'criatividade', 'ciência das cores'],
  version: '1.0.0',
};
