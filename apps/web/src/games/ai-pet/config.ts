import type { GameConfig } from '@/types/game';
export const aiPetConfig: GameConfig = {
  id: 'ai-pet', name: 'AI Pet', description: 'Cuide do seu bichinho virtual inteligente! Ele aprende com você e evolui!',
  category: 'programming', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🤖', color: '#A855F7',
  difficulty: { min: 1, max: 6 }, estimatedMinutes: 5, skills: ['inteligência artificial', 'padrões', 'aprendizado', 'dados'], version: '1.0.0',
};
