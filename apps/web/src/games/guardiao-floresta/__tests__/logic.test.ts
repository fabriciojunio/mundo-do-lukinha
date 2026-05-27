import { describe, it, expect } from 'vitest';
import { getScenariosForAge, selectScenarios, evaluateEcoChoice, calculateEcoScore } from '../logic';
describe('Guardião da Floresta Logic', () => {
  it('explorer easy', () => { getScenariosForAge('explorer').forEach((s) => expect(s.difficulty).toBe(1)); });
  it('master all 6', () => { expect(getScenariosForAge('master').length).toBe(6); });
  it('best choice 100', () => { const s = getScenariosForAge('explorer')[0]!; expect(evaluateEcoChoice(s, 0).ecoImpact).toBe(100); });
  it('3 stars', () => { expect(calculateEcoScore(500, 500, 60).stars).toBe(3); });
});
