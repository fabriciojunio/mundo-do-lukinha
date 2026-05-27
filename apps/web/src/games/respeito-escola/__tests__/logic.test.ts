import { describe, it, expect } from 'vitest';
import { getScenariosForAge, selectScenarios, evaluateRespectChoice, calculateRespectScore } from '../logic';
describe('Respeito na Escola Logic', () => {
  it('explorer easy', () => { getScenariosForAge('explorer').forEach((s) => expect(s.difficulty).toBe(1)); });
  it('master all 6', () => { expect(getScenariosForAge('master').length).toBe(6); });
  it('best choice 100', () => { const s = getScenariosForAge('explorer')[0]!; expect(evaluateRespectChoice(s, 0).respect).toBe(100); });
  it('worst choice 0', () => { const s = getScenariosForAge('explorer')[0]!; expect(evaluateRespectChoice(s, 1).respect).toBe(0); });
  it('3 stars', () => { expect(calculateRespectScore(500, 500, 60).stars).toBe(3); });
  it('1 star low', () => { expect(calculateRespectScore(100, 500, 60).stars).toBe(1); });
});
