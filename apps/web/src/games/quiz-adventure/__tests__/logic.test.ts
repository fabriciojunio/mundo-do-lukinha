import { describe, it, expect } from 'vitest';
import { getQuestions, checkQuizAnswer, calculateQuizScore, getQuestionCount } from '../logic';

describe('Quiz Adventure Logic', () => {
  describe('getQuestions', () => {
    it('returns questions for explorer', () => {
      const qs = getQuestions('explorer', 5);
      expect(qs.length).toBeGreaterThan(0);
      expect(qs.length).toBeLessThanOrEqual(5);
    });

    it('returns questions for master', () => {
      const qs = getQuestions('master', 10);
      expect(qs.length).toBeGreaterThan(0);
    });

    it('all questions have required fields', () => {
      const qs = getQuestions('adventurer', 10);
      qs.forEach((q) => {
        expect(q.id).toBeDefined();
        expect(q.text.length).toBeGreaterThan(0);
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanation.length).toBeGreaterThan(0);
      });
    });

    it('returns shuffled results', () => {
      const results1 = getQuestions('adventurer', 10).map((q) => q.id);
      const results2 = getQuestions('adventurer', 10).map((q) => q.id);
      // Run enough times — at least one should differ (probabilistic but near-certain)
      let anyDifferent = false;
      for (let i = 0; i < 10; i++) {
        const a = getQuestions('adventurer', 10).map((q) => q.id).join(',');
        const b = getQuestions('adventurer', 10).map((q) => q.id).join(',');
        if (a !== b) { anyDifferent = true; break; }
      }
      expect(anyDifferent).toBe(true);
    });
  });

  describe('checkQuizAnswer', () => {
    it('returns correct for right answer', () => {
      const qs = getQuestions('explorer', 5);
      if (qs.length === 0) return;
      const q = qs[0]!;
      const result = checkQuizAnswer(q, q.correctIndex);
      expect(result.correct).toBe(true);
      expect(result.explanation.length).toBeGreaterThan(0);
    });

    it('returns incorrect for wrong answer', () => {
      const qs = getQuestions('explorer', 5);
      if (qs.length === 0) return;
      const q = qs[0]!;
      const wrongIndex = (q.correctIndex + 1) % q.options.length;
      const result = checkQuizAnswer(q, wrongIndex);
      expect(result.correct).toBe(false);
    });
  });

  describe('calculateQuizScore', () => {
    it('gives 3 stars for 90%+ accuracy', () => {
      const result = calculateQuizScore(9, 10, 5);
      expect(result.stars).toBe(3);
    });

    it('gives quiz-perfect for 10/10', () => {
      const result = calculateQuizScore(10, 10, 10);
      expect(result.achievements).toContain('quiz-perfect');
    });

    it('no quiz-perfect for imperfect score', () => {
      const result = calculateQuizScore(9, 10, 5);
      expect(result.achievements).not.toContain('quiz-perfect');
    });

    it('streak adds to score', () => {
      const noStreak = calculateQuizScore(5, 10, 0);
      const withStreak = calculateQuizScore(5, 10, 5);
      expect(withStreak.score).toBeGreaterThan(noStreak.score);
    });
  });

  describe('getQuestionCount', () => {
    it('explorer gets 7 questions', () => {
      expect(getQuestionCount('explorer')).toBe(7);
    });

    it('master gets 10 questions', () => {
      expect(getQuestionCount('master')).toBe(10);
    });
  });
});
