import type { GameConfig } from '@/types/game';

export const englishWordsConfig: GameConfig = {
  id: 'english-words',
  name: 'English Words',
  description: 'Aprenda inglês! Traduza palavras e amplie seu vocabulário!',
  category: 'english',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🇬🇧',
  color: '#1D4ED8',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 4,
  skills: ['inglês', 'vocabulário', 'tradução', 'idiomas'],
  version: '1.0.0',
};
