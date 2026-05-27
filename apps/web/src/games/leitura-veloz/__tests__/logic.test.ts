import { describe, it, expect } from 'vitest';
import { getPassagesForAge, selectPassages, checkReadingAnswer, calculateReadingScore } from '../logic';

describe('Leitura Veloz Logic', () => {
  describe('getPassagesForAge', () => {
    it('adventurer gets easy+medium', () => { const p = getPassagesForAge('adventurer'); p.forEach((x) => expect(x.difficulty).toBeLessThanOrEqual(2)); expect(p.length).toBe(4); });
    it('master gets all', () => { expect(getPassagesForAge('master').length).toBe(6); });
  });
  describe('selectPassages', () => {
    it('adventurer gets 3', () => { expect(selectPassages('adventurer').length).toBe(3); });
    it('master gets 4', () => { expect(selectPassages('master').length).toBe(4); });
    it('all have questions', () => { selectPassages('master').forEach((p) => expect(p.questions.length).toBeGreaterThan(0)); });
  });
  describe('checkReadingAnswer', () => {
    it('correct answer', () => {
      const passages = getPassagesForAge('adventurer');
      const p = passages[0]!;
      const q = p.questions[0]!;
      expect(checkReadingAnswer(p, 0, q.correctIndex)).toBe(true);
    });
    it('wrong answer', () => {
      const p = getPassagesForAge('adventurer')[0]!;
      const q = p.questions[0]!;
      expect(checkReadingAnswer(p, 0, (q.correctIndex + 1) % q.options.length)).toBe(false);
    });
  });
  describe('calculateReadingScore', () => {
    it('3 stars perfect', () => { expect(calculateReadingScore(9, 9, 60).stars).toBe(3); });
    it('1 star low', () => { expect(calculateReadingScore(2, 9, 60).stars).toBe(1); });
  });
});
