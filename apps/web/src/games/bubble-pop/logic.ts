import type { GameConfig } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export const bubblePopConfig: GameConfig = {
  id: 'bubble-pop', name: 'Bubble Pop Letras', description: 'Estoure as bolhas com as letras certas! Forme palavras estourando na ordem!',
  category: 'fun', ageGroups: ['chick', 'explorer', 'adventurer', 'master'], icon: '🫧', color: '#06B6D4',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 3, skills: ['letras', 'velocidade', 'coordenação', 'vocabulário'], version: '1.0.0',
};

export interface Bubble { id: string; letter: string; x: number; y: number; popped: boolean; speed: number; }
export interface BubbleRound { word: string; targetIndex: number; bubbles: Bubble[]; }

const WORDS_EASY = ['SOL', 'LUA', 'GIZ', 'PÃO', 'MEL'];
const WORDS_MED = ['GATO', 'BOLA', 'MESA', 'SAPO', 'FOGO'];
const WORDS_HARD = ['ESCOLA', 'BANANA', 'JARDIM', 'MUSICA'];

export function getWordsForAge(ageGroup: AgeGroup): string[] {
  switch (ageGroup) { case 'chick': return WORDS_EASY; case 'explorer': return [...WORDS_EASY, ...WORDS_MED]; case 'adventurer': case 'master': return [...WORDS_MED, ...WORDS_HARD]; default: return WORDS_EASY; }
}

export function getRounds(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'chick': return 3; case 'explorer': return 4; case 'adventurer': return 5; case 'master': return 6; default: return 3; }
}

export function createBubbleRound(word: string): BubbleRound {
  const letters = word.split('');
  const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((l) => !letters.includes(l));
  const extras = shuffleArray(extraLetters).slice(0, Math.max(3, letters.length));
  const allLetters = shuffleArray([...letters, ...extras]);
  const bubbles: Bubble[] = allLetters.map((letter, i) => ({
    id: `b${i}`, letter, x: 50 + Math.random() * 500, y: 50 + Math.random() * 200, popped: false, speed: 0.5 + Math.random(),
  }));
  return { word, targetIndex: 0, bubbles };
}

export function popBubble(round: BubbleRound, bubbleId: string): { correct: boolean; newRound: BubbleRound; wordComplete: boolean } {
  const bubble = round.bubbles.find((b) => b.id === bubbleId);
  if (!bubble || bubble.popped) return { correct: false, newRound: round, wordComplete: false };
  const expectedLetter = round.word[round.targetIndex];
  const correct = bubble.letter === expectedLetter;
  if (!correct) return { correct: false, newRound: round, wordComplete: false };
  const newBubbles = round.bubbles.map((b) => b.id === bubbleId ? { ...b, popped: true } : b);
  const newIndex = round.targetIndex + 1;
  const wordComplete = newIndex >= round.word.length;
  return { correct: true, newRound: { ...round, bubbles: newBubbles, targetIndex: newIndex }, wordComplete };
}

export function calculateBubbleScore(wordsComplete: number, totalRounds: number, wrongPops: number, timeSpent: number): GameResult {
  const accuracy = totalRounds > 0 ? Math.max(0, wordsComplete / totalRounds - wrongPops * 0.05) : 0;
  const stars = calculateStars(Math.min(1, accuracy));
  return { score: wordsComplete * 20, maxScore: totalRounds * 20, timeSpent, accuracy: Math.min(1, accuracy), xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
