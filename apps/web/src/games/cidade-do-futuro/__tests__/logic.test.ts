import { describe, it, expect } from 'vitest';
import { getDilemmasForAge, selectDilemmas, evaluateChoice, calculateEthicsScore } from '../logic';

describe('Cidade do Futuro Logic', () => {
  it('adventurer gets difficulty<=2', () => { getDilemmasForAge('adventurer').forEach((d) => expect(d.difficulty).toBeLessThanOrEqual(2)); });
  it('master gets all 6', () => { expect(getDilemmasForAge('master').length).toBe(6); });
  it('selectDilemmas adventurer 4', () => { expect(selectDilemmas('adventurer').length).toBeLessThanOrEqual(4); });
  it('selectDilemmas master 5', () => { expect(selectDilemmas('master').length).toBeLessThanOrEqual(5); });
  it('evaluateChoice returns impact', () => {
    const d = getDilemmasForAge('adventurer')[0]!;
    const r = evaluateChoice(d, 1);
    expect(r.impact).toBe(100);
    expect(r.feedback.length).toBeGreaterThan(0);
  });
  it('evaluateChoice worst option', () => {
    const d = getDilemmasForAge('adventurer')[0]!;
    const r = evaluateChoice(d, 0);
    expect(r.impact).toBeLessThan(100);
  });
  it('3 stars for max impact', () => { expect(calculateEthicsScore(500, 500, 5, 60).stars).toBe(3); });
  it('1 star for low impact', () => { expect(calculateEthicsScore(100, 500, 5, 60).stars).toBe(1); });
});
