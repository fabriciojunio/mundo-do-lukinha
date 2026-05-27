import { describe, it, expect } from 'vitest';
import { generateIdentifyChallenge, generateCompareChallenge, checkFractionAnswer, simplifyFraction, fractionToString, getDenominators, calculateFractionScore } from '../logic';

describe('Fábrica de Frações Logic', () => {
  describe('generateIdentifyChallenge', () => {
    it('generates valid challenge with correct answer in options', () => {
      const c = generateIdentifyChallenge([2, 3, 4]);
      expect(c.options.length).toBeGreaterThanOrEqual(3);
      expect(c.correctIndex).toBeGreaterThanOrEqual(0);
      expect(c.correctIndex).toBeLessThan(c.options.length);
      expect(c.numerator).toBeGreaterThan(0);
      expect(c.numerator).toBeLessThanOrEqual(c.denominator);
    });

    it('correct option matches fraction', () => {
      const c = generateIdentifyChallenge([4]);
      const correctOpt = c.options[c.correctIndex];
      expect(correctOpt).toBe(fractionToString(c.numerator, c.denominator));
    });
  });

  describe('generateCompareChallenge', () => {
    it('generates valid compare with 3 options', () => {
      const c = generateCompareChallenge([2, 3, 4]);
      expect(c.options.length).toBe(3);
      expect(c.type).toBe('compare');
    });
  });

  describe('checkFractionAnswer', () => {
    it('returns true for correct index', () => {
      const c = generateIdentifyChallenge([2, 4]);
      expect(checkFractionAnswer(c, c.correctIndex)).toBe(true);
    });

    it('returns false for wrong index', () => {
      const c = generateIdentifyChallenge([2, 4]);
      const wrong = (c.correctIndex + 1) % c.options.length;
      expect(checkFractionAnswer(c, wrong)).toBe(false);
    });
  });

  describe('simplifyFraction', () => {
    it('simplifies 2/4 to 1/2', () => { expect(simplifyFraction(2, 4)).toEqual([1, 2]); });
    it('simplifies 6/8 to 3/4', () => { expect(simplifyFraction(6, 8)).toEqual([3, 4]); });
    it('keeps 1/3 as is', () => { expect(simplifyFraction(1, 3)).toEqual([1, 3]); });
  });

  describe('fractionToString', () => {
    it('formats correctly', () => { expect(fractionToString(3, 4)).toBe('3/4'); });
  });

  describe('getDenominators', () => {
    it('explorer gets simpler denoms', () => { expect(getDenominators('explorer')).toEqual([2, 3, 4]); });
    it('master gets complex denoms', () => { expect(getDenominators('master').length).toBe(8); });
  });

  describe('calculateFractionScore', () => {
    it('3 stars for perfect', () => { expect(calculateFractionScore(8, 8, 30).stars).toBe(3); });
    it('1 star for low accuracy', () => { expect(calculateFractionScore(3, 10, 30).stars).toBe(1); });
  });
});
