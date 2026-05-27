import { describe, it, expect } from 'vitest';
import { ELEMENTS, getReactionsForAge, generateChemChallenge, generateChemChallenges, checkChemAnswer, calculateChemScore } from '../logic';
describe('Laboratório Químico', () => {
  it('has 8 elements', () => { expect(ELEMENTS.length).toBe(8); });
  it('adventurer reactions <= difficulty 2', () => { getReactionsForAge('adventurer').forEach((r) => expect(r.difficulty).toBeLessThanOrEqual(2)); });
  it('master all 7 reactions', () => { expect(getReactionsForAge('master').length).toBe(7); });
  it('generates valid challenge', () => { const c = generateChemChallenge(getReactionsForAge('adventurer')); expect(c.options.length).toBe(4); expect(c.correctIndex).toBeGreaterThanOrEqual(0); });
  it('correct answer', () => { const c = generateChemChallenge(getReactionsForAge('adventurer')); expect(checkChemAnswer(c, c.correctIndex)).toBe(true); });
  it('wrong answer', () => { const c = generateChemChallenge(getReactionsForAge('adventurer')); expect(checkChemAnswer(c, (c.correctIndex + 1) % 4)).toBe(false); });
  it('3 stars', () => { expect(calculateChemScore(5, 5, 60).stars).toBe(3); });
});
