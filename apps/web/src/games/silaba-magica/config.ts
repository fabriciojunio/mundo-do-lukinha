import type { GameConfig } from '@/types/game';

export const silabaMagicaConfig: GameConfig = {
  id: 'silaba-magica',
  name: 'Sílaba Mágica',
  description: 'Separe sílabas e forme palavras! Domine o português brincando!',
  category: 'portuguese',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '✨',
  color: '#EC4899',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 4,
  skills: ['sílabas', 'leitura', 'escrita', 'vocabulário'],
  version: '1.0.0',
};
