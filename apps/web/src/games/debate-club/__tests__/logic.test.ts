import { describe, it, expect } from 'vitest';
import { getTopicsForAge, selectTopics, evaluateDebateChoice, calculateDebateScore } from '../logic';
describe('Debate Club', () => {
  it('adventurer difficulty <= 2', () => { getTopicsForAge('adventurer').forEach((t) => expect(t.difficulty).toBeLessThanOrEqual(2)); });
  it('master all 6', () => { expect(getTopicsForAge('master').length).toBe(6); });
  it('selectTopics count', () => { expect(selectTopics('adventurer').length).toBeLessThanOrEqual(4); expect(selectTopics('master').length).toBeLessThanOrEqual(5); });
  it('best argument quality 100', () => { const t = getTopicsForAge('adventurer')[0]!; expect(evaluateDebateChoice(t, 0).quality).toBe(100); });
  it('fallacy has low quality', () => { const t = getTopicsForAge('adventurer')[0]!; const worst = evaluateDebateChoice(t, 1); expect(worst.quality).toBeLessThan(50); });
  it('3 stars max quality', () => { expect(calculateDebateScore(500, 500, 60).stars).toBe(3); });
  it('1 star low quality', () => { expect(calculateDebateScore(50, 500, 60).stars).toBe(1); });
});
