import type { GameConfig } from '@/types/game';
export const velhaTurbinadoConfig: GameConfig = {
  id: 'velha-turbinado', name: 'Jogo da Velha Turbinado', description: 'O clássico jogo da velha com superpoderes! Jogue contra a IA!',
  category: 'fun', ageGroups: ['explorer', 'adventurer', 'master'], icon: '❌', color: '#EF4444',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 3, skills: ['estratégia', 'lógica', 'raciocínio', 'planejamento'], version: '1.0.0',
};
