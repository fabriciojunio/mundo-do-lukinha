import type { GameConfig } from '@/types/game';
export const construtorSitesConfig: GameConfig = {
  id: 'construtor-sites', name: 'Construtor de Sites', description: 'Aprenda HTML básico construindo sites visuais! Arraste elementos e veja o resultado!',
  category: 'programming', ageGroups: ['adventurer', 'master'], icon: '🏗️', color: '#F59E0B',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['HTML', 'web', 'design', 'criação digital'], version: '1.0.0',
};
