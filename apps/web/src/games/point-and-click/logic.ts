import type { GameConfig } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export const pointClickConfig: GameConfig = {
  id: 'point-and-click', name: 'Aventura Point & Click', description: 'Explore cenários misteriosos! Encontre itens escondidos e resolva enigmas!',
  category: 'fun', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🔎', color: '#7C3AED',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 5, skills: ['observação', 'raciocínio', 'exploração', 'puzzles'], version: '1.0.0',
};

export interface HiddenItem { id: string; name: string; emoji: string; x: number; y: number; found: boolean; hint: string; }
export interface Scene { id: string; name: string; emoji: string; bg: string; items: HiddenItem[]; difficulty: number; }

const SCENES: Scene[] = [
  { id: 's1', name: 'Quarto Mágico', emoji: '🏠', bg: 'bg-gradient-to-b from-purple-100 to-purple-50', difficulty: 1,
    items: [
      { id: 'i1', name: 'Chave', emoji: '🔑', x: 75, y: 60, found: false, hint: 'Perto da janela' },
      { id: 'i2', name: 'Livro', emoji: '📕', x: 20, y: 80, found: false, hint: 'No chão' },
      { id: 'i3', name: 'Estrela', emoji: '⭐', x: 50, y: 20, found: false, hint: 'Olhe para cima' },
    ],
  },
  { id: 's2', name: 'Jardim Secreto', emoji: '🌳', bg: 'bg-gradient-to-b from-green-100 to-green-50', difficulty: 1,
    items: [
      { id: 'i4', name: 'Borboleta', emoji: '🦋', x: 30, y: 30, found: false, hint: 'Voando alto' },
      { id: 'i5', name: 'Cogumelo', emoji: '🍄', x: 60, y: 85, found: false, hint: 'Perto do chão' },
      { id: 'i6', name: 'Joaninha', emoji: '🐞', x: 85, y: 45, found: false, hint: 'Numa folha' },
    ],
  },
  { id: 's3', name: 'Fundo do Mar', emoji: '🌊', bg: 'bg-gradient-to-b from-blue-200 to-blue-400', difficulty: 2,
    items: [
      { id: 'i7', name: 'Tesouro', emoji: '💎', x: 45, y: 90, found: false, hint: 'No fundo' },
      { id: 'i8', name: 'Polvo', emoji: '🐙', x: 15, y: 50, found: false, hint: 'Escondido nas rochas' },
      { id: 'i9', name: 'Concha', emoji: '🐚', x: 70, y: 70, found: false, hint: 'Na areia' },
      { id: 'i10', name: 'Peixe', emoji: '🐠', x: 55, y: 25, found: false, hint: 'Nadando' },
    ],
  },
  { id: 's4', name: 'Castelo Antigo', emoji: '🏰', bg: 'bg-gradient-to-b from-gray-200 to-gray-300', difficulty: 3,
    items: [
      { id: 'i11', name: 'Coroa', emoji: '👑', x: 50, y: 15, found: false, hint: 'No trono' },
      { id: 'i12', name: 'Espada', emoji: '⚔️', x: 80, y: 55, found: false, hint: 'Na parede' },
      { id: 'i13', name: 'Mapa', emoji: '🗺️', x: 25, y: 70, found: false, hint: 'Enrolado no canto' },
      { id: 'i14', name: 'Fantasma', emoji: '👻', x: 10, y: 25, found: false, hint: 'Boo! Nas sombras' },
      { id: 'i15', name: 'Poção', emoji: '🧪', x: 65, y: 85, found: false, hint: 'Na mesa do alquimista' },
    ],
  },
];

export function getScenesForAge(ageGroup: AgeGroup): Scene[] {
  switch (ageGroup) { case 'explorer': return SCENES.filter((s) => s.difficulty === 1); case 'adventurer': return SCENES.filter((s) => s.difficulty <= 2); case 'master': return SCENES; default: return SCENES.slice(0, 2); }
}

export function checkItemClick(item: HiddenItem, clickX: number, clickY: number, tolerance: number): boolean {
  return Math.abs(clickX - item.x) <= tolerance && Math.abs(clickY - item.y) <= tolerance;
}

export function calculatePointClickScore(itemsFound: number, totalItems: number, hintsUsed: number, timeSpent: number): GameResult {
  const rawAccuracy = totalItems > 0 ? itemsFound / totalItems : 0;
  const accuracy = Math.max(0, rawAccuracy - hintsUsed * 0.05);
  const stars = calculateStars(Math.min(1, accuracy));
  return { score: itemsFound * 15, maxScore: totalItems * 15, timeSpent, accuracy: Math.min(1, accuracy), xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
