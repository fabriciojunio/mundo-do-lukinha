import { describe, it, expect } from 'vitest';
import { calculateLevel, getXPForNextLevel, getLevelName, formatNumber, getRandomItem, shuffleArray, clamp, formatTime, isToday, isYesterday } from '../utils';

describe('Utils', () => {
  describe('calculateLevel', () => {
    it('level 1 at 0 XP', () => { expect(calculateLevel(0)).toBe(1); });
    it('level 1 at 50 XP', () => { expect(calculateLevel(50)).toBe(1); });
    it('level increases with XP', () => { expect(calculateLevel(200)).toBeGreaterThan(1); });
    it('high XP = high level', () => { expect(calculateLevel(10000)).toBeGreaterThan(10); });
  });

  describe('getXPForNextLevel', () => {
    it('returns progress object', () => { const r = getXPForNextLevel(0); expect(r).toHaveProperty('current'); expect(r).toHaveProperty('needed'); expect(r).toHaveProperty('progress'); });
    it('progress between 0-1', () => { const r = getXPForNextLevel(50); expect(r.progress).toBeGreaterThanOrEqual(0); expect(r.progress).toBeLessThanOrEqual(1); });
  });

  describe('getLevelName', () => {
    it('returns string for level 1', () => { expect(typeof getLevelName(1)).toBe('string'); expect(getLevelName(1).length).toBeGreaterThan(0); });
    it('returns Lenda for unknown levels', () => { expect(getLevelName(999)).toBe('Lenda'); });
  });

  describe('formatNumber', () => {
    it('small numbers unchanged', () => { expect(formatNumber(42)).toBe('42'); expect(formatNumber(999)).toBe('999'); });
    it('thousands use K', () => { expect(formatNumber(1500)).toBe('1.5K'); });
    it('millions use M', () => { expect(formatNumber(2500000)).toBe('2.5M'); });
    it('zero', () => { expect(formatNumber(0)).toBe('0'); });
  });

  describe('getRandomItem', () => {
    it('returns item from array', () => { const arr = [1, 2, 3]; expect(arr).toContain(getRandomItem(arr)); });
    it('works with strings', () => { const arr = ['a', 'b']; expect(arr).toContain(getRandomItem(arr)); });
  });

  describe('shuffleArray', () => {
    it('returns same length', () => { expect(shuffleArray([1, 2, 3, 4, 5]).length).toBe(5); });
    it('contains same elements', () => { const arr = [1, 2, 3]; const shuffled = shuffleArray(arr); arr.forEach((item) => expect(shuffled).toContain(item)); });
    it('does not mutate original', () => { const arr = [1, 2, 3]; shuffleArray(arr); expect(arr).toEqual([1, 2, 3]); });
  });

  describe('clamp', () => {
    it('clamps below min', () => { expect(clamp(-5, 0, 100)).toBe(0); });
    it('clamps above max', () => { expect(clamp(150, 0, 100)).toBe(100); });
    it('keeps value in range', () => { expect(clamp(50, 0, 100)).toBe(50); });
    it('edge cases', () => { expect(clamp(0, 0, 100)).toBe(0); expect(clamp(100, 0, 100)).toBe(100); });
  });

  describe('formatTime', () => {
    it('formats seconds', () => { expect(formatTime(5)).toBe('0:05'); });
    it('formats minutes', () => { expect(formatTime(65)).toBe('1:05'); });
    it('zero', () => { expect(formatTime(0)).toBe('0:00'); });
    it('exact minute', () => { expect(formatTime(120)).toBe('2:00'); });
  });

  describe('isToday', () => {
    it('today returns true', () => { expect(isToday(new Date().toISOString())).toBe(true); });
    it('yesterday returns false', () => { const y = new Date(); y.setDate(y.getDate() - 1); expect(isToday(y.toISOString())).toBe(false); });
  });

  describe('isYesterday', () => {
    it('yesterday returns true', () => { const y = new Date(); y.setDate(y.getDate() - 1); expect(isYesterday(y.toISOString())).toBe(true); });
    it('today returns false', () => { expect(isYesterday(new Date().toISOString())).toBe(false); });
  });
});
