import { describe, it, expect } from 'vitest';
import { getProductsForAge, generateShopChallenge, generateShopChallenges, checkChangeAnswer, calculateShopScore } from '../logic';
describe('Lojinha do Lukinha Logic', () => {
  it('explorer cheap products', () => { getProductsForAge('explorer').forEach((p) => expect(p.price).toBeLessThanOrEqual(5)); });
  it('challenge has correct change', () => { const c = generateShopChallenge(getProductsForAge('explorer'), 1); expect(c.correctChange).toBe(c.payment - c.product.price); expect(c.options).toContain(c.correctChange); });
  it('correct answer', () => { const c = generateShopChallenge(getProductsForAge('explorer'), 1); expect(checkChangeAnswer(c, c.correctIndex)).toBe(true); });
  it('generateShopChallenges count', () => { expect(generateShopChallenges('explorer').length).toBe(6); });
  it('3 stars', () => { expect(calculateShopScore(6, 6, 30).stars).toBe(3); });
});
