import { describe, it, expect } from 'vitest';
import { getScenariosForAge, selectScenarios, evaluateMoneyChoice, calculateMoneyScore } from '../logic';
describe('Cofrinho Esperto Logic', () => {
  it('explorer 3 scenarios', () => { expect(getScenariosForAge('explorer').length).toBe(3); });
  it('master all 8', () => { expect(getScenariosForAge('master').length).toBe(8); });
  it('selectScenarios count', () => { expect(selectScenarios('explorer').length).toBe(3); expect(selectScenarios('master').length).toBeLessThanOrEqual(7); });
  it('best choice gives 100 wisdom', () => { const s = getScenariosForAge('explorer')[0]!; const r = evaluateMoneyChoice(s, 2); expect(r.wisdom).toBe(100); });
  it('3 stars max wisdom', () => { expect(calculateMoneyScore(300, 300, 3, 60).stars).toBe(3); });
  it('1 star low wisdom', () => { expect(calculateMoneyScore(60, 300, 3, 60).stars).toBe(1); });
});
