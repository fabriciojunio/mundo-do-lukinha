import type { GameConfig } from '@/types/game';
export const lojinhaLukinhaConfig: GameConfig = {
  id: 'lojinha-lukinha', name: 'Lojinha do Lukinha', description: 'Administre sua própria lojinha! Compre, venda e aprenda sobre troco!',
  category: 'life-skills', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🏪', color: '#F97316',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['troco', 'compra', 'venda', 'matemática', 'comércio'], version: '1.0.0',
};
