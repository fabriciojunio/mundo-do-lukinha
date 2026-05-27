import type { GameConfig } from '@/types/game';
export const escolhasConsequenciasConfig: GameConfig = {
  id: 'escolhas-consequencias', name: 'Escolhas & Consequências', description: 'Suas escolhas mudam a história! Aprenda que cada ação tem uma consequência.',
  category: 'life-skills', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🔀', color: '#8B5CF6',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['empatia', 'consequências', 'responsabilidade', 'decisão', 'valores'], version: '1.0.0',
};
