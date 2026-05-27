import { describe, it, expect } from 'vitest';
import { generateBoard, checkMatch, calculateMemoryScore, getPairCountForAge } from '../logic';

describe('Memory Game Logic', () => {
  describe('generateBoard', () => {
    it('generates correct number of cards for chick (2 pairs = 4 cards)', () => {
      const board = generateBoard('chick');
      expect(board.length).toBe(4);
    });

    it('generates correct number of cards for explorer (6 pairs = 12 cards)', () => {
      const board = generateBoard('explorer');
      expect(board.length).toBe(12);
    });

    it('generates correct number of cards for adventurer (8 pairs = 16 cards)', () => {
      const board = generateBoard('adventurer');
      expect(board.length).toBe(16);
    });

    it('generates correct number of cards for master (10 pairs = 20 cards)', () => {
      const board = generateBoard('master');
      expect(board.length).toBe(20);
    });

    it('every card has a matching pair', () => {
      const board = generateBoard('explorer');
      const pairCounts = new Map<string, number>();
      board.forEach((card) => {
        pairCounts.set(card.pairId, (pairCounts.get(card.pairId) ?? 0) + 1);
      });
      for (const count of pairCounts.values()) {
        expect(count).toBe(2);
      }
    });

    it('all cards start face down and unmatched', () => {
      const board = generateBoard('explorer');
      board.forEach((card) => {
        expect(card.isFlipped).toBe(false);
        expect(card.isMatched).toBe(false);
      });
    });
  });

  describe('checkMatch', () => {
    it('returns true for matching pair', () => {
      const board = generateBoard('explorer');
      const first = board[0]!;
      const match = board.find((c) => c.pairId === first.pairId && c.id !== first.id);
      expect(match).toBeDefined();
      expect(checkMatch(first, match!)).toBe(true);
    });

    it('returns false for non-matching cards', () => {
      const board = generateBoard('explorer');
      const first = board[0]!;
      const nonMatch = board.find((c) => c.pairId !== first.pairId);
      expect(nonMatch).toBeDefined();
      expect(checkMatch(first, nonMatch!)).toBe(false);
    });

    it('returns false for same card', () => {
      const board = generateBoard('explorer');
      const card = board[0]!;
      expect(checkMatch(card, card)).toBe(false);
    });
  });

  describe('calculateMemoryScore', () => {
    it('gives 3 stars for perfect game (minimum moves)', () => {
      const pairs = 6;
      const result = calculateMemoryScore(pairs, pairs, 30, true);
      expect(result.stars).toBe(3);
      expect(result.achievements).toContain('memory-master');
    });

    it('gives lower stars for more moves', () => {
      const pairs = 6;
      const result = calculateMemoryScore(pairs * 3, pairs, 60, false);
      expect(result.stars).toBeLessThanOrEqual(2);
    });

    it('does not include memory-master achievement for imperfect game', () => {
      const result = calculateMemoryScore(20, 6, 60, false);
      expect(result.achievements).not.toContain('memory-master');
    });
  });

  describe('getPairCountForAge', () => {
    it('returns correct pair counts', () => {
      expect(getPairCountForAge('chick')).toBe(2);
      expect(getPairCountForAge('explorer')).toBe(6);
      expect(getPairCountForAge('adventurer')).toBe(8);
      expect(getPairCountForAge('master')).toBe(10);
    });
  });
});
