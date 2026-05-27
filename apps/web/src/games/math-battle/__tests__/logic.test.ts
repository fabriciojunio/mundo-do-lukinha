import { describe, it, expect } from 'vitest';
import { generateQuestion, checkAnswer, calculateScore, getNextDifficulty } from '../logic';

describe('Math Battle Logic', () => {
  describe('generateQuestion', () => {
    it('generates a valid question for chick age group', () => {
      const q = generateQuestion('chick', 1);
      expect(q.operation).toBe('+');
      expect(q.options).toContain(q.correctAnswer);
      expect(q.options.length).toBe(2);
      expect(q.displayText).toContain('=');
    });

    it('generates a question with 4 options for explorer', () => {
      const q = generateQuestion('explorer', 1);
      expect(q.options.length).toBe(4);
      expect(q.options).toContain(q.correctAnswer);
    });

    it('uses +/- for explorer', () => {
      const operations = new Set<string>();
      for (let i = 0; i < 50; i++) {
        const q = generateQuestion('explorer', 3);
        operations.add(q.operation);
      }
      expect(operations.has('+')).toBe(true);
      expect(operations.has('-')).toBe(true);
      expect(operations.has('×')).toBe(false);
    });

    it('uses all 4 operations for adventurer', () => {
      const operations = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const q = generateQuestion('adventurer', 5);
        operations.add(q.operation);
      }
      expect(operations.has('+')).toBe(true);
      expect(operations.has('-')).toBe(true);
      expect(operations.has('×')).toBe(true);
      expect(operations.has('÷')).toBe(true);
    });

    it('always has correct answer in options', () => {
      for (let i = 0; i < 30; i++) {
        const q = generateQuestion('master', 5);
        expect(q.options).toContain(q.correctAnswer);
      }
    });

    it('subtraction never produces negative results', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateQuestion('explorer', 3);
        if (q.operation === '-') {
          expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('division always produces whole numbers', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateQuestion('adventurer', 5);
        if (q.operation === '÷') {
          expect(Number.isInteger(q.correctAnswer)).toBe(true);
        }
      }
    });
  });

  describe('checkAnswer', () => {
    it('returns true for correct answer', () => {
      const q = generateQuestion('explorer', 1);
      expect(checkAnswer(q, q.correctAnswer)).toBe(true);
    });

    it('returns false for wrong answer', () => {
      const q = generateQuestion('explorer', 1);
      const wrong = q.correctAnswer + 999;
      expect(checkAnswer(q, wrong)).toBe(false);
    });
  });

  describe('calculateScore', () => {
    it('gives 3 stars for 90%+ accuracy', () => {
      const result = calculateScore(9, 10, 30, 5);
      expect(result.stars).toBe(3);
      expect(result.xpEarned).toBe(50);
    });

    it('gives 2 stars for 70-89% accuracy', () => {
      const result = calculateScore(8, 10, 30, 3);
      expect(result.stars).toBe(2);
      expect(result.xpEarned).toBe(25);
    });

    it('gives 1 star for below 70%', () => {
      const result = calculateScore(5, 10, 30, 1);
      expect(result.stars).toBe(1);
      expect(result.xpEarned).toBe(10);
    });

    it('includes math-10 achievement for 10+ correct', () => {
      const result = calculateScore(10, 12, 60, 5);
      expect(result.achievements).toContain('math-10');
    });

    it('does not include math-10 for less than 10 correct', () => {
      const result = calculateScore(9, 10, 30, 5);
      expect(result.achievements).not.toContain('math-10');
    });
  });

  describe('getNextDifficulty', () => {
    it('increases difficulty at 90%+ accuracy', () => {
      expect(getNextDifficulty(3, 0.95)).toBe(4);
    });

    it('decreases difficulty at 40% or less', () => {
      expect(getNextDifficulty(5, 0.3)).toBe(4);
    });

    it('keeps difficulty for moderate accuracy', () => {
      expect(getNextDifficulty(5, 0.7)).toBe(5);
    });

    it('never goes below 1', () => {
      expect(getNextDifficulty(1, 0.1)).toBe(1);
    });

    it('never goes above 10', () => {
      expect(getNextDifficulty(10, 0.99)).toBe(10);
    });
  });
});
