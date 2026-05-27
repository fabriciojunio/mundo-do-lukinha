import type { GameConfig } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export const snakeEducativoConfig: GameConfig = {
  id: 'snake-educativo', name: 'Snake Educativo', description: 'A cobrinha precisa comer as letras na ordem certa para formar palavras!',
  category: 'fun', ageGroups: ['explorer', 'adventurer', 'master'], icon: '🐍', color: '#22C55E',
  difficulty: { min: 1, max: 8 }, estimatedMinutes: 3, skills: ['reflexo', 'coordenação', 'alfabeto', 'palavras'], version: '1.0.0',
};

export type Dir = 'up' | 'down' | 'left' | 'right';
export interface Pos { x: number; y: number; }
export interface SnakeState { body: Pos[]; dir: Dir; food: Pos & { letter: string }; word: string; collected: string; score: number; gameOver: boolean; }

const WORDS_EASY = ['GATO', 'SOL', 'LUA', 'RIO', 'MAR', 'COR'];
const WORDS_HARD = ['ESCOLA', 'LIVRO', 'MUNDO', 'PLANTA', 'PONTE'];

export function getWords(ageGroup: AgeGroup): string[] {
  return ageGroup === 'explorer' ? WORDS_EASY : [...WORDS_EASY, ...WORDS_HARD];
}

export function getGridSize(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'explorer': return 10; case 'adventurer': return 12; case 'master': return 15; default: return 10; }
}

export function randomPos(gridSize: number, exclude: Pos[]): Pos {
  let pos: Pos;
  do { pos = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) }; }
  while (exclude.some((e) => e.x === pos.x && e.y === pos.y));
  return pos;
}

export function createSnakeState(ageGroup: AgeGroup): SnakeState {
  const gs = getGridSize(ageGroup);
  const words = getWords(ageGroup);
  const word = words[Math.floor(Math.random() * words.length)] ?? 'GATO';
  const startPos = { x: Math.floor(gs / 2), y: Math.floor(gs / 2) };
  const foodPos = randomPos(gs, [startPos]);
  return { body: [startPos], dir: 'right', food: { ...foodPos, letter: word[0] ?? 'G' }, word, collected: '', score: 0, gameOver: false };
}

export function moveSnake(state: SnakeState, gridSize: number): SnakeState {
  if (state.gameOver) return state;
  const head = state.body[0]!;
  const delta: Record<Dir, Pos> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  const d = delta[state.dir];
  const newHead = { x: (head.x + d.x + gridSize) % gridSize, y: (head.y + d.y + gridSize) % gridSize };
  if (state.body.some((s) => s.x === newHead.x && s.y === newHead.y)) return { ...state, gameOver: true };

  const atFood = newHead.x === state.food.x && newHead.y === state.food.y;
  const newBody = atFood ? [newHead, ...state.body] : [newHead, ...state.body.slice(0, -1)];
  if (!atFood) return { ...state, body: newBody };

  const expectedLetter = state.word[state.collected.length];
  if (state.food.letter !== expectedLetter) return { ...state, body: newBody, gameOver: true };
  const newCollected = state.collected + state.food.letter;
  if (newCollected === state.word) {
    const words = getWords('explorer');
    const newWord = words[Math.floor(Math.random() * words.length)] ?? 'SOL';
    const fp = randomPos(gridSize, newBody);
    return { ...state, body: newBody, collected: '', word: newWord, food: { ...fp, letter: newWord[0] ?? 'S' }, score: state.score + state.word.length * 10 };
  }
  const nextLetter = state.word[newCollected.length] ?? '?';
  const fp = randomPos(gridSize, newBody);
  return { ...state, body: newBody, collected: newCollected, food: { ...fp, letter: nextLetter }, score: state.score + 5 };
}

export function changeDir(current: Dir, newDir: Dir): Dir {
  const opposites: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
  return opposites[current] === newDir ? current : newDir;
}

export function calculateSnakeScore(score: number, wordsCompleted: number, timeSpent: number): GameResult {
  const accuracy = Math.min(score / 150, 1);
  const stars = calculateStars(accuracy);
  return { score, maxScore: Math.max(150, score), timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
