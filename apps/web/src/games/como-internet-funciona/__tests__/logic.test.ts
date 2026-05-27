import { describe, it, expect } from 'vitest';
import { getQuizzesForAge, selectQuizzes, checkInternetAnswer, calculateInternetScore } from '../logic';
describe('Como Internet Funciona Logic', () => {
  it('explorer 4 quizzes', () => { expect(getQuizzesForAge('explorer').length).toBe(4); });
  it('master all 10', () => { expect(getQuizzesForAge('master').length).toBe(10); });
  it('selectQuizzes respects count', () => { expect(selectQuizzes('explorer').length).toBeLessThanOrEqual(4); });
  it('check correct', () => { const q = getQuizzesForAge('explorer')[0]!; expect(checkInternetAnswer(q, q.correctIndex)).toBe(true); });
  it('3 stars', () => { expect(calculateInternetScore(4, 4, 30).stars).toBe(3); });
});
