import type { GameConfig } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export const laboratorioQuimicoConfig: GameConfig = {
  id: 'laboratorio-quimico', name: 'Laboratório Químico', description: 'Misture elementos e descubra reações! Aprenda química de forma divertida!',
  category: 'science', ageGroups: ['adventurer', 'master'], icon: '🧪', color: '#7C3AED',
  difficulty: { min: 1, max: 10 }, estimatedMinutes: 5, skills: ['química', 'ciências', 'reações', 'elementos', 'experimentação'], version: '1.0.0',
};

export interface ChemElement { symbol: string; name: string; emoji: string; color: string; }
export interface Reaction { elements: [string, string]; result: string; resultEmoji: string; explanation: string; difficulty: number; }
export interface ChemChallenge { id: string; question: string; reaction: Reaction; options: string[]; correctIndex: number; }

export const ELEMENTS: ChemElement[] = [
  { symbol: 'H₂', name: 'Hidrogênio', emoji: '💨', color: '#E5E7EB' },
  { symbol: 'O₂', name: 'Oxigênio', emoji: '🫧', color: '#93C5FD' },
  { symbol: 'Na', name: 'Sódio', emoji: '🧂', color: '#FDE68A' },
  { symbol: 'Cl', name: 'Cloro', emoji: '🟢', color: '#86EFAC' },
  { symbol: 'Fe', name: 'Ferro', emoji: '⚙️', color: '#9CA3AF' },
  { symbol: 'C', name: 'Carbono', emoji: '⬛', color: '#374151' },
  { symbol: 'H₂O', name: 'Água', emoji: '💧', color: '#60A5FA' },
  { symbol: 'CO₂', name: 'Gás Carbônico', emoji: '☁️', color: '#D1D5DB' },
];

const REACTIONS: Reaction[] = [
  { elements: ['H₂', 'O₂'], result: 'Água (H₂O)', resultEmoji: '💧', explanation: 'Hidrogênio + Oxigênio = Água! É assim que a água é formada!', difficulty: 1 },
  { elements: ['Na', 'Cl'], result: 'Sal de Cozinha (NaCl)', resultEmoji: '🧂', explanation: 'Sódio + Cloro = Sal! O sal que usamos na comida!', difficulty: 1 },
  { elements: ['C', 'O₂'], result: 'Gás Carbônico (CO₂)', resultEmoji: '☁️', explanation: 'Carbono queimando com Oxigênio produz CO₂ — é o que acontece em incêndios!', difficulty: 1 },
  { elements: ['Fe', 'O₂'], result: 'Ferrugem (Fe₂O₃)', resultEmoji: '🟤', explanation: 'Ferro + Oxigênio = Ferrugem! Por isso metais enferrujam na chuva!', difficulty: 2 },
  { elements: ['H₂O', 'CO₂'], result: 'Ácido Carbônico', resultEmoji: '🥤', explanation: 'Água + CO₂ = Ácido Carbônico — é o que dá as bolhas no refrigerante!', difficulty: 2 },
  { elements: ['Na', 'H₂O'], result: 'Explosão! (NaOH + H₂)', resultEmoji: '💥', explanation: 'Sódio na água causa explosão! O sódio reage violentamente com água. Nunca tente em casa!', difficulty: 3 },
  { elements: ['C', 'H₂'], result: 'Metano (CH₄)', resultEmoji: '🔥', explanation: 'Carbono + Hidrogênio = Metano, um gás inflamável encontrado na natureza!', difficulty: 3 },
];

export function getReactionsForAge(ageGroup: AgeGroup): Reaction[] {
  switch (ageGroup) { case 'adventurer': return REACTIONS.filter((r) => r.difficulty <= 2); case 'master': return REACTIONS; default: return REACTIONS.filter((r) => r.difficulty <= 2); }
}

export function generateChemChallenge(reactions: Reaction[]): ChemChallenge {
  const reaction = reactions[Math.floor(Math.random() * reactions.length)]!;
  const wrongResults = reactions.filter((r) => r.result !== reaction.result).map((r) => r.result);
  const options = shuffleArray([reaction.result, ...shuffleArray(wrongResults).slice(0, 3)]);
  return {
    id: Math.random().toString(36).substring(2, 9),
    question: `O que acontece quando misturamos ${reaction.elements[0]} + ${reaction.elements[1]}?`,
    reaction, options, correctIndex: Math.max(0, options.indexOf(reaction.result)),
  };
}

export function generateChemChallenges(ageGroup: AgeGroup): ChemChallenge[] {
  const reactions = getReactionsForAge(ageGroup);
  const count = ageGroup === 'master' ? 7 : 5;
  return Array.from({ length: count }, () => generateChemChallenge(reactions));
}

export function checkChemAnswer(challenge: ChemChallenge, idx: number): boolean { return idx === challenge.correctIndex; }

export function calculateChemScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0; const stars = calculateStars(accuracy);
  return { score: correct * 20, maxScore: total * 20, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
