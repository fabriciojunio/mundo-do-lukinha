import type { GameConfig } from '@/types/game';
export const cidadeDoFuturoConfig: GameConfig = {
  id: 'cidade-do-futuro', name: 'Cidade do Futuro', description: 'Tome decisões éticas sobre tecnologia! Robôs, IA e o futuro dependem de você!',
  category: 'programming', ageGroups: ['adventurer', 'master'], icon: '🏙️', color: '#6366F1',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['ética', 'IA', 'tecnologia', 'pensamento crítico', 'sociedade'], version: '1.0.0',
};
