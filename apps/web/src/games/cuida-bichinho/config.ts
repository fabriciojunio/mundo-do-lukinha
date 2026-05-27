import type { GameConfig } from '@/types/game';
export const cuidaBichinhoConfig: GameConfig = {
  id: 'cuida-bichinho', name: 'Cuida do Bichinho', description: 'Cuide do seu pet virtual! Alimente, exercite e mantenha ele saudável e feliz!',
  category: 'life-skills', ageGroups: ['chick', 'explorer', 'adventurer', 'master'], icon: '🐾', color: '#F59E0B',
  difficulty: { min: 1, max: 6 }, estimatedMinutes: 5, skills: ['saúde', 'responsabilidade', 'cuidado', 'rotina', 'nutrição'], version: '1.0.0',
};
