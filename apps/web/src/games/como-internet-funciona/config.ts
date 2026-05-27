import type { GameConfig } from '@/types/game';
export const comoInternetConfig: GameConfig = {
  id: 'como-internet-funciona', name: 'Como a Internet Funciona', description: 'Viaje pelos servidores e descubra como a internet funciona por dentro!',
  category: 'programming', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🌐', color: '#0EA5E9',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['internet', 'redes', 'servidores', 'dados', 'tecnologia'], version: '1.0.0',
};
