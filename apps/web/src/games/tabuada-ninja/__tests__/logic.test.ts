import { describe, it, expect } from 'vitest';
import {
  generateTabuadaQuestion,
  checkTabuadaAnswer,
  getSpeedBonus,
  getBelt,
  getTablesForAge,
  getQuestionsPerRound,
  calculateTabuadaScore,
} from '../logic';

describe('Tabuada Ninja Logic', () => {
  describe('generateTabuadaQuestion', () => {
    it('generates valid multiplication', () => {
      const q = generateTabuadaQuestion([2, 3], 1);
      expect(q.correctAnswer).toBe(q.a * q.b);
      expect(q.options).toContain(q.correctAnswer);
      expect(q.options.length).toBe(4);
    });

    it('uses provided tables', () => {
      for (let i = 0; i < 20; i++) {
        const q = generateTabuadaQuestion([5], 1);
        expect(q.a).toBe(5);
      }
    });

    it('b is between 1 and 10', () => {
      for (let i = 0; i < 30; i++) {
        const q = generateTabuadaQuestion([2, 3, 4], 1);
        expect(q.b).toBeGreaterThanOrEqual(1);
        expect(q.b).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('checkTabuadaAnswer', () => {
    it('correct', () => {
      const q = generateTabuadaQuestion([3], 1);
      expect(checkTabuadaAnswer(q, q.correctAnswer)).toBe(true);
    });
    it('wrong', () => {
      const q = generateTabuadaQuestion([3], 1);
      expect(checkTabuadaAnswer(q, q.correctAnswer + 999)).toBe(false);
    });
  });

  describe('getSpeedBonus', () => {
    it('max bonus for fast', () => { expect(getSpeedBonus(500, 5000)).toBe(5); });
    it('no bonus for slow', () => { expect(getSpeedBonus(4500, 5000)).toBe(0); });
  });

  describe('getBelt', () => {
    it('black belt for perfect', () => { expect(getBelt(1, 0.9)).toBe('black'); });
    it('white belt for poor', () => { expect(getBelt(0.2, 0.1)).toBe('white'); });
  });

  describe('getTablesForAge', () => {
    it('explorer gets 4 tables', () => { expect(getTablesForAge('explorer').length).toBe(4); });
    it('master gets 11 tables', () => { expect(getTablesForAge('master').length).toBe(11); });
  });

  describe('calculateTabuadaScore', () => {
    it('3 stars for high accuracy', () => {
      expect(calculateTabuadaScore(9, 10, 20, 15000, 5000).stars).toBe(3);
    });
  });
});
