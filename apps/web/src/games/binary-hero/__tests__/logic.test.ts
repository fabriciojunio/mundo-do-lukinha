import { describe, it, expect } from 'vitest';
import { decimalToBinary, binaryToDecimal, generateBinaryChallenge, checkBinaryAnswer, calculateBinaryScore } from '../logic';

describe('Binary Hero Logic', () => {
  describe('decimalToBinary', () => {
    it('5 = 0101 in 4 bits', () => { expect(decimalToBinary(5, 4)).toBe('0101'); });
    it('10 = 1010 in 4 bits', () => { expect(decimalToBinary(10, 4)).toBe('1010'); });
    it('255 = 11111111 in 8 bits', () => { expect(decimalToBinary(255, 8)).toBe('11111111'); });
    it('0 = 0000 in 4 bits', () => { expect(decimalToBinary(0, 4)).toBe('0000'); });
  });
  describe('binaryToDecimal', () => {
    it('0101 = 5', () => { expect(binaryToDecimal('0101')).toBe(5); });
    it('1010 = 10', () => { expect(binaryToDecimal('1010')).toBe(10); });
    it('11111111 = 255', () => { expect(binaryToDecimal('11111111')).toBe(255); });
  });
  describe('generateBinaryChallenge', () => {
    it('valid challenge', () => {
      const c = generateBinaryChallenge('adventurer');
      expect(c.options.length).toBe(4);
      expect(c.correctIndex).toBeGreaterThanOrEqual(0);
      expect(c.decimal).toBeGreaterThanOrEqual(1);
    });
    it('binary matches decimal', () => {
      for (let i = 0; i < 10; i++) {
        const c = generateBinaryChallenge('adventurer');
        expect(binaryToDecimal(c.binary)).toBe(c.decimal);
      }
    });
  });
  describe('checkBinaryAnswer', () => {
    it('correct', () => { const c = generateBinaryChallenge('adventurer'); expect(checkBinaryAnswer(c, c.correctIndex)).toBe(true); });
  });
  describe('calculateBinaryScore', () => {
    it('3 stars', () => { expect(calculateBinaryScore(8, 8, 30).stars).toBe(3); });
  });
});
