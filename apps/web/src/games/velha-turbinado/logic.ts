import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export type Cell = 'X' | 'O' | null;
export type Board = Cell[];

export function createBoard(): Board { return Array(9).fill(null) as Board; }

const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

export function checkWinner(board: Board): Cell {
  for (const [a, b, c] of WIN_LINES) {
    if (a !== undefined && b !== undefined && c !== undefined && board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export function isBoardFull(board: Board): boolean { return board.every((c) => c !== null); }

export function getAIMove(board: Board, aiSymbol: Cell, difficulty: AgeGroup): number {
  const playerSymbol: Cell = aiSymbol === 'X' ? 'O' : 'X';
  const empty = board.map((c, i) => c === null ? i : -1).filter((i) => i >= 0);
  if (empty.length === 0) return -1;

  // Easy: random
  if (difficulty === 'explorer') return empty[Math.floor(Math.random() * empty.length)] ?? 0;

  // Medium: block wins, take wins, else random
  // Check for AI win
  for (const pos of empty) { const test = [...board]; test[pos] = aiSymbol; if (checkWinner(test) === aiSymbol) return pos; }
  // Check for block player win
  for (const pos of empty) { const test = [...board]; test[pos] = playerSymbol; if (checkWinner(test) === playerSymbol) return pos; }

  // Hard: also prefer center and corners
  if (difficulty === 'master') {
    if (board[4] === null) return 4;
    const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)] ?? 0;
  }

  return empty[Math.floor(Math.random() * empty.length)] ?? 0;
}

export function makeMove(board: Board, pos: number, symbol: Cell): Board {
  if (board[pos] !== null) return board;
  const newBoard = [...board];
  newBoard[pos] = symbol;
  return newBoard;
}

export function getRoundsForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'explorer': return 3; case 'adventurer': return 5; case 'master': return 5; default: return 3; }
}

export function calculateTTTScore(wins: number, draws: number, losses: number, totalRounds: number, timeSpent: number): GameResult {
  const points = wins * 3 + draws * 1;
  const maxPoints = totalRounds * 3;
  const accuracy = maxPoints > 0 ? points / maxPoints : 0;
  const stars = calculateStars(accuracy);
  return { score: points * 10, maxScore: maxPoints * 10, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
