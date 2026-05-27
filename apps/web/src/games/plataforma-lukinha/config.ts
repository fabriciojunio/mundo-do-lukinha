import type { GameConfig } from '@/types/game';
export const plataformaLukinhaConfig: GameConfig = {
  id: 'plataforma-lukinha', name: 'Plataforma do Lukinha', description: 'Pule entre plataformas e colete estrelas neste jogo estilo Mario!',
  category: 'fun', ageGroups: ['chick', 'explorer', 'adventurer', 'master'], icon: '🏃', color: '#4ECDC4',
  difficulty: { min: 1, max: 10 }, estimatedMinutes: 3, skills: ['reflexo', 'coordenação', 'timing', 'estratégia'], version: '1.0.0',
};
