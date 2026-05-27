import type { GameConfig } from '@/types/game';
export const respeitoEscolaConfig: GameConfig = {
  id: 'respeito-escola', name: 'Respeito na Escola', description: 'Aprenda sobre respeito, diversidade e como tratar todos com gentileza!',
  category: 'life-skills', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🤝', color: '#6366F1',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['respeito', 'diversidade', 'inclusão', 'gentileza', 'empatia'], version: '1.0.0',
};
