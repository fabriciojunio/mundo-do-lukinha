import type { GameConfig } from '@/types/game';
export const diarioEmocoesConfig: GameConfig = {
  id: 'diario-emocoes', name: 'Diário de Emoções', description: 'Aprenda a identificar e expressar seus sentimentos! Inteligência emocional é superpoder!',
  category: 'life-skills', ageGroups: ['chick', 'explorer', 'adventurer', 'master'], icon: '💖', color: '#F472B6',
  difficulty: { min: 1, max: 6 }, estimatedMinutes: 4, skills: ['emoções', 'empatia', 'autoconhecimento', 'sentimentos'], version: '1.0.0',
};
