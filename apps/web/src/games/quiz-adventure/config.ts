import type { GameConfig } from '@/types/game';

export const quizAdventureConfig: GameConfig = {
  id: 'quiz-adventure',
  name: 'Quiz Aventura',
  description: 'Responda perguntas e viaje pelo mundo do conhecimento!',
  category: 'science',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🧪',
  color: '#EAB308',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 5,
  skills: ['conhecimento geral', 'ciências', 'geografia', 'história'],
  version: '1.0.0',
};
