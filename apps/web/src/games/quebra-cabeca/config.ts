import type { GameConfig } from '@/types/game';
export const quebraCabecaConfig: GameConfig = {
  id: 'quebra-cabeca', name: 'Quebra-Cabeça', description: 'Monte o quebra-cabeça! Arraste as peças para o lugar certo!',
  category: 'fun', ageGroups: ['chick', 'explorer', 'adventurer', 'master'], icon: '🧩', color: '#8B5CF6',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 4, skills: ['raciocínio', 'paciência', 'visual', 'coordenação'], version: '1.0.0',
};
