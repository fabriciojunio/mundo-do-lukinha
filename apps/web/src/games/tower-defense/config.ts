import type { GameConfig } from '@/types/game';
export const towerDefenseConfig: GameConfig = {
  id: 'tower-defense', name: 'Tower Defense Kids', description: 'Defenda sua base! Coloque torres e derrote as ondas de invasores!',
  category: 'fun', ageGroups: ['adventurer', 'master'], icon: '🏰', color: '#92400E',
  difficulty: { min: 1, max: 10 }, estimatedMinutes: 5, skills: ['estratégia', 'planejamento', 'lógica', 'gestão de recursos'], version: '1.0.0',
};
