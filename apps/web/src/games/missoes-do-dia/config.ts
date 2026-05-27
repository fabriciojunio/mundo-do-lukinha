import type { GameConfig } from '@/types/game';
export const missoesConfig: GameConfig = {
  id: 'missoes-do-dia', name: 'Missões do Dia', description: 'Complete tarefas diárias e aprenda sobre responsabilidade e rotina!',
  category: 'life-skills', ageGroups: ['chick', 'explorer', 'adventurer', 'master'], icon: '📋', color: '#3B82F6',
  difficulty: { min: 1, max: 6 }, estimatedMinutes: 4, skills: ['responsabilidade', 'rotina', 'organização', 'tarefas'], version: '1.0.0',
};
