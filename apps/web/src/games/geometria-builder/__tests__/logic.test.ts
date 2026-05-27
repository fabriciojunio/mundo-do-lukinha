import { describe, it, expect } from 'vitest';
import { getShapesForAge, generateGeoQuiz, generateGeoQuizSet, checkGeoAnswer, calculateGeoScore } from '../logic';

describe('Geometria Builder Logic', () => {
  describe('getShapesForAge', () => {
    it('explorer easy shapes', () => { expect(getShapesForAge('explorer').length).toBe(4); });
    it('master all shapes', () => { expect(getShapesForAge('master').length).toBe(9); });
  });
  describe('generateGeoQuiz', () => {
    it('valid', () => { const q = generateGeoQuiz(getShapesForAge('explorer')); expect(q.options.length).toBe(4); });
  });
  describe('checkGeoAnswer', () => {
    it('correct', () => { const q = generateGeoQuiz(getShapesForAge('explorer')); expect(checkGeoAnswer(q, q.correctIndex)).toBe(true); });
  });
  describe('calculateGeoScore', () => {
    it('3 stars', () => { expect(calculateGeoScore(8, 8, 30).stars).toBe(3); });
  });
});
