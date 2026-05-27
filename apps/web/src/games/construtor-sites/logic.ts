import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface HTMLElement {
  tag: string; label: string; emoji: string; description: string; example: string;
}

export const HTML_ELEMENTS: HTMLElement[] = [
  { tag: 'h1', label: 'Título Grande', emoji: '📰', description: 'O título principal da página', example: '<h1>Meu Site</h1>' },
  { tag: 'p', label: 'Parágrafo', emoji: '📝', description: 'Um bloco de texto', example: '<p>Olá mundo!</p>' },
  { tag: 'img', label: 'Imagem', emoji: '🖼️', description: 'Mostra uma foto ou desenho', example: '<img src="foto.jpg">' },
  { tag: 'a', label: 'Link', emoji: '🔗', description: 'Leva para outra página', example: '<a href="url">Clique</a>' },
  { tag: 'button', label: 'Botão', emoji: '🔘', description: 'Um botão clicável', example: '<button>Enviar</button>' },
  { tag: 'ul', label: 'Lista', emoji: '📋', description: 'Uma lista com bolinhas', example: '<ul><li>Item</li></ul>' },
  { tag: 'div', label: 'Caixa', emoji: '📦', description: 'Um container que agrupa elementos', example: '<div>conteúdo</div>' },
  { tag: 'input', label: 'Campo de Texto', emoji: '✏️', description: 'Onde o usuário digita', example: '<input type="text">' },
];

export interface SiteMission {
  id: string; title: string; description: string; requiredTags: string[]; difficulty: number;
}

const MISSIONS: SiteMission[] = [
  { id: 's1', title: 'Página Simples', description: 'Crie uma página com título e parágrafo', requiredTags: ['h1', 'p'], difficulty: 1 },
  { id: 's2', title: 'Página com Imagem', description: 'Adicione um título, texto e uma imagem', requiredTags: ['h1', 'p', 'img'], difficulty: 1 },
  { id: 's3', title: 'Site com Links', description: 'Crie título, texto e um link para outra página', requiredTags: ['h1', 'p', 'a'], difficulty: 2 },
  { id: 's4', title: 'Formulário Básico', description: 'Título, campo de texto e botão de enviar', requiredTags: ['h1', 'input', 'button'], difficulty: 2 },
  { id: 's5', title: 'Site Completo', description: 'Título, texto, imagem, lista e link', requiredTags: ['h1', 'p', 'img', 'ul', 'a'], difficulty: 3 },
];

export function getMissionsForAge(ageGroup: AgeGroup): SiteMission[] {
  switch (ageGroup) { case 'adventurer': return MISSIONS.filter((m) => m.difficulty <= 2); case 'master': return MISSIONS; default: return MISSIONS.filter((m) => m.difficulty <= 2); }
}

export function selectMissions(ageGroup: AgeGroup): SiteMission[] {
  const pool = getMissionsForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'master' ? 4 : 3);
}

export function checkMission(mission: SiteMission, placedTags: string[]): { complete: boolean; missing: string[] } {
  const missing = mission.requiredTags.filter((t) => !placedTags.includes(t));
  return { complete: missing.length === 0, missing };
}

export function getElementByTag(tag: string): HTMLElement | undefined { return HTML_ELEMENTS.find((e) => e.tag === tag); }

export function calculateSiteScore(completed: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? completed / total : 0; const stars = calculateStars(accuracy);
  return { score: completed * 25, maxScore: total * 25, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
