import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export type Direction = 'horizontal' | 'vertical' | 'diagonal';

export interface WordPosition {
  word: string;
  startRow: number;
  startCol: number;
  direction: Direction;
  found: boolean;
}

export interface LetterCell {
  letter: string;
  row: number;
  col: number;
  isPartOfWord: boolean;
  isHighlighted: boolean;
}

const WORD_LISTS: Record<string, string[]> = {
  easy: ['GATO', 'SOL', 'LUA', 'MAR', 'RIO', 'COR', 'PAZ', 'AVE', 'REI', 'MEL'],
  medium: ['ESCOLA', 'JARDIM', 'MUSICA', 'ANIMAL', 'LIVRO', 'MUNDO', 'TERRA', 'PLANTA', 'PONTE', 'CAMPO'],
  hard: ['ASTRONOMIA', 'DINOSSAURO', 'BORBOLETA', 'CHOCOLATE', 'DESCOBERTA', 'AVENTURA', 'UNIVERSO', 'NATUREZA', 'HISTORIA', 'CIENCIAS'],
};

export function getGridSize(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 8;
    case 'adventurer': return 10;
    case 'master': return 12;
    default: return 8;
  }
}

export function getWordCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 5;
    case 'adventurer': return 8;
    case 'master': return 10;
    default: return 5;
  }
}

function getDirections(ageGroup: AgeGroup): Direction[] {
  switch (ageGroup) {
    case 'explorer': return ['horizontal', 'vertical'];
    case 'adventurer': return ['horizontal', 'vertical', 'diagonal'];
    case 'master': return ['horizontal', 'vertical', 'diagonal'];
    default: return ['horizontal', 'vertical'];
  }
}

function getWordList(ageGroup: AgeGroup): string[] {
  switch (ageGroup) {
    case 'explorer': return WORD_LISTS['easy'] ?? [];
    case 'adventurer': return WORD_LISTS['medium'] ?? [];
    case 'master': return WORD_LISTS['hard'] ?? [];
    default: return WORD_LISTS['easy'] ?? [];
  }
}

function randomLetter(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)] ?? 'A';
}

export function tryPlaceWord(
  grid: string[][],
  word: string,
  size: number,
  directions: Direction[],
): WordPosition | null {
  const maxAttempts = 100;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const dir = directions[Math.floor(Math.random() * directions.length)] ?? 'horizontal';
    let dr = 0;
    let dc = 0;

    switch (dir) {
      case 'horizontal': dr = 0; dc = 1; break;
      case 'vertical': dr = 1; dc = 0; break;
      case 'diagonal': dr = 1; dc = 1; break;
    }

    const maxRow = size - (dir === 'horizontal' ? 1 : word.length);
    const maxCol = size - (dir === 'vertical' ? 1 : word.length);

    if (maxRow < 0 || maxCol < 0) continue;

    const startRow = Math.floor(Math.random() * (maxRow + 1));
    const startCol = Math.floor(Math.random() * (maxCol + 1));

    let canPlace = true;
    for (let i = 0; i < word.length; i++) {
      const r = startRow + i * dr;
      const c = startCol + i * dc;
      const existing = grid[r]?.[c];
      if (existing !== '' && existing !== word[i]) {
        canPlace = false;
        break;
      }
    }

    if (canPlace) {
      for (let i = 0; i < word.length; i++) {
        const r = startRow + i * dr;
        const c = startCol + i * dc;
        if (grid[r]) {
          grid[r][c] = word[i] ?? '';
        }
      }
      return { word, startRow, startCol, direction: dir, found: false };
    }
  }
  return null;
}

export function generateGrid(ageGroup: AgeGroup): { grid: LetterCell[][]; words: WordPosition[] } {
  const size = getGridSize(ageGroup);
  const wordCount = getWordCount(ageGroup);
  const directions = getDirections(ageGroup);
  const wordList = getWordList(ageGroup);

  const rawGrid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
  const shuffled = [...wordList].sort(() => Math.random() - 0.5);
  const placedWords: WordPosition[] = [];

  for (const word of shuffled) {
    if (placedWords.length >= wordCount) break;
    if (word.length > size) continue;
    const position = tryPlaceWord(rawGrid, word, size, directions);
    if (position) {
      placedWords.push(position);
    }
  }

  const grid: LetterCell[][] = rawGrid.map((row, r) =>
    row.map((letter, c) => ({
      letter: letter || randomLetter(),
      row: r,
      col: c,
      isPartOfWord: letter !== '',
      isHighlighted: false,
    })),
  );

  return { grid, words: placedWords };
}

export function checkWordSelection(
  words: WordPosition[],
  selectedCells: Array<{ row: number; col: number }>,
  grid: LetterCell[][],
): string | null {
  const selectedWord = selectedCells
    .map((cell) => grid[cell.row]?.[cell.col]?.letter ?? '')
    .join('');

  const reversedWord = selectedWord.split('').reverse().join('');

  for (const wp of words) {
    if (!wp.found && (wp.word === selectedWord || wp.word === reversedWord)) {
      return wp.word;
    }
  }
  return null;
}

export function calculateWordHuntScore(
  wordsFound: number,
  totalWords: number,
  timeSpent: number,
  hintsUsed: number,
): GameResult {
  const accuracy = totalWords > 0 ? wordsFound / totalWords : 0;
  const hintPenalty = Math.max(0, accuracy - hintsUsed * 0.1);
  const finalAccuracy = Math.max(0, Math.min(1, hintPenalty));
  const stars = calculateStars(finalAccuracy);
  const score = wordsFound * 15;
  const maxScore = totalWords * 15;

  const achievements: string[] = [];
  if (wordsFound === totalWords) achievements.push('word-finder');

  return {
    score,
    maxScore,
    timeSpent,
    accuracy: finalAccuracy,
    xpEarned: calculateXP(stars),
    coinsEarned: calculateCoins(stars),
    achievements,
    stars,
  };
}
