import { describe, it, expect } from 'vitest';
import { createVirtualPet, getChallengesForAge, evaluateCareChoice, applyEffects, calculateCareScore } from '../logic';
describe('Cuida do Bichinho Logic', () => {
  it('creates pet with stats', () => { const p = createVirtualPet('🐶'); expect(p.happiness).toBe(60); expect(p.health).toBe(60); });
  it('chick easy challenges', () => { getChallengesForAge('chick').forEach((c) => expect(c.difficulty).toBe(1)); });
  it('master all 6', () => { expect(getChallengesForAge('master').length).toBe(6); });
  it('best choice 100 wisdom', () => { const c = getChallengesForAge('explorer')[0]!; expect(evaluateCareChoice(c, 0).wisdom).toBe(100); });
  it('applyEffects clamps 0-100', () => { const p = createVirtualPet('🐶'); const r = applyEffects(p, { happiness: 200, health: -200, energy: 0, hygiene: 0 }); expect(r.happiness).toBe(100); expect(r.health).toBe(0); });
  it('3 stars', () => { expect(calculateCareScore(600, 600, 60).stars).toBe(3); });
});
