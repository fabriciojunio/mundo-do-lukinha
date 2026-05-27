import { describe, it, expect } from 'vitest';
import { PALETTE, getPatternsForAge, createEmptyGrid, compareGrids, calculatePixelScore } from '../logic';

describe('Pixel Art Coder Logic', () => {
  describe('PALETTE', () => {
    it('has 8 colors', () => { expect(PALETTE.length).toBe(8); });
    it('all have hex', () => { PALETTE.forEach((c) => expect(c.hex).toMatch(/^#[0-9A-Fa-f]{6}$/)); });
  });
  describe('getPatternsForAge', () => {
    it('explorer easy', () => { expect(getPatternsForAge('explorer').length).toBe(2); });
    it('master all', () => { expect(getPatternsForAge('master').length).toBe(5); });
  });
  describe('createEmptyGrid', () => {
    it('creates 5x5 of nulls', () => {
      const g = createEmptyGrid(5);
      expect(g.length).toBe(5);
      g.forEach((r) => { expect(r.length).toBe(5); r.forEach((c) => expect(c).toBeNull()); });
    });
  });
  describe('compareGrids', () => {
    it('perfect match', () => {
      const target = [[0, 1], [null, 2]];
      const attempt = [[0, 1], [null, 2]];
      const { correct, total } = compareGrids(target, attempt);
      expect(correct).toBe(3); expect(total).toBe(3);
    });
    it('partial match', () => {
      const target = [[0, 1], [2, 3]];
      const attempt = [[0, 5], [2, 6]];
      const { correct, total } = compareGrids(target, attempt);
      expect(correct).toBe(2); expect(total).toBe(4);
    });
    it('ignores null cells in target', () => {
      const target = [[null, 1], [null, null]];
      const attempt = [[5, 1], [3, 4]];
      const { correct, total } = compareGrids(target, attempt);
      expect(total).toBe(1); expect(correct).toBe(1);
    });
  });
  describe('calculatePixelScore', () => {
    it('3 stars for perfect', () => { expect(calculatePixelScore(20, 20, 3, 3, 60).stars).toBe(3); });
    it('1 star for low', () => { expect(calculatePixelScore(5, 20, 1, 3, 60).stars).toBe(1); });
  });
});
