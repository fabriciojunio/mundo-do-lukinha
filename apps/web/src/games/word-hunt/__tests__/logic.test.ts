import { describe, it, expect } from 'vitest';
import { generateGrid, checkWordSelection, calculateWordHuntScore, getGridSize, getWordCount } from '../logic';

describe('Word Hunt Logic', () => {
  describe('generateGrid', () => {
    it('generates correct grid size for explorer', () => {
      const { grid } = generateGrid('explorer');
      expect(grid.length).toBe(8);
      expect(grid[0]?.length).toBe(8);
    });

    it('generates correct grid size for adventurer', () => {
      const { grid } = generateGrid('adventurer');
      expect(grid.length).toBe(10);
    });

    it('places words on the grid', () => {
      const { words } = generateGrid('explorer');
      expect(words.length).toBeGreaterThan(0);
      expect(words.length).toBeLessThanOrEqual(getWordCount('explorer'));
    });

    it('all cells have letters', () => {
      const { grid } = generateGrid('explorer');
      grid.forEach((row) => {
        row.forEach((cell) => {
          expect(cell.letter).toMatch(/[A-Z]/);
        });
      });
    });

    it('words start as not found', () => {
      const { words } = generateGrid('explorer');
      words.forEach((w) => expect(w.found).toBe(false));
    });
  });

  describe('checkWordSelection', () => {
    it('finds a word when cells match', () => {
      const { grid, words } = generateGrid('explorer');
      if (words.length === 0) return;
      const word = words[0]!;

      const cells: Array<{ row: number; col: number }> = [];
      for (let i = 0; i < word.word.length; i++) {
        const dr = word.direction === 'vertical' || word.direction === 'diagonal' ? 1 : 0;
        const dc = word.direction === 'horizontal' || word.direction === 'diagonal' ? 1 : 0;
        cells.push({ row: word.startRow + i * dr, col: word.startCol + i * dc });
      }

      const found = checkWordSelection(words, cells, grid);
      expect(found).toBe(word.word);
    });

    it('returns null for random selection', () => {
      const { grid, words } = generateGrid('explorer');
      const randomCells = [{ row: 0, col: 0 }];
      const found = checkWordSelection(words, randomCells, grid);
      expect(found).toBeNull();
    });
  });

  describe('calculateWordHuntScore', () => {
    it('gives 3 stars for finding all words', () => {
      const result = calculateWordHuntScore(5, 5, 30, 0);
      expect(result.stars).toBe(3);
      expect(result.achievements).toContain('word-finder');
    });

    it('gives lower stars for partial completion', () => {
      const result = calculateWordHuntScore(3, 5, 30, 0);
      expect(result.stars).toBeLessThanOrEqual(2);
    });

    it('reduces score for hints used', () => {
      const withHints = calculateWordHuntScore(5, 5, 30, 3);
      const withoutHints = calculateWordHuntScore(5, 5, 30, 0);
      expect(withHints.accuracy).toBeLessThan(withoutHints.accuracy);
    });
  });

  describe('getGridSize', () => {
    it('returns correct sizes', () => {
      expect(getGridSize('explorer')).toBe(8);
      expect(getGridSize('adventurer')).toBe(10);
      expect(getGridSize('master')).toBe(12);
    });
  });
});
