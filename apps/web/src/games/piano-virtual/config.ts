import type { GameConfig } from '@/types/game';

export const pianoVirtualConfig: GameConfig = {
  id: 'piano-virtual',
  name: 'Piano Virtual',
  description: 'Toque piano e aprenda notas musicais! Repita as melodias e ganhe pontos!',
  category: 'music',
  ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🎹',
  color: '#7C3AED',
  difficulty: { min: 1, max: 8 },
  estimatedMinutes: 4,
  skills: ['música', 'notas', 'ritmo', 'memória auditiva'],
  version: '1.0.0',
};
