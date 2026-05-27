import type { GameConfig } from '@/types/game';
export const cofrinhoEspertoConfig: GameConfig = {
  id: 'cofrinho-esperto', name: 'Cofrinho Esperto', description: 'Aprenda sobre dinheiro! Ganhe, poupe e invista com sabedoria!',
  category: 'life-skills', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🐷', color: '#EC4899',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['dinheiro', 'poupança', 'investimento', 'matemática financeira'], version: '1.0.0',
};
