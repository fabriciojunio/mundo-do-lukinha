import type { GameConfig } from '@/types/game';
export const pixelArtCoderConfig: GameConfig = {
  id: 'pixel-art-coder', name: 'Pixel Art Coder', description: 'Crie arte com coordenadas! Pinte pixels na grade usando código de cores!',
  category: 'programming', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🎨', color: '#8B5CF6',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['coordenadas', 'cores', 'pixel art', 'programação visual'], version: '1.0.0',
};
