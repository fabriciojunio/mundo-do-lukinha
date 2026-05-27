import { describe, it, expect } from 'vitest';
import { getCountriesForAge, generateGeoQuiz, generateGeoQuizSet, checkGeoAnswer, calculateGeoScore } from '../logic';

describe('Mapa Mundi Logic', () => {
  describe('getCountriesForAge', () => {
    it('explorer gets easy countries', () => { const c = getCountriesForAge('explorer'); expect(c.length).toBe(6); c.forEach((x) => expect(x.difficulty).toBe(1)); });
    it('master gets all', () => { expect(getCountriesForAge('master').length).toBe(16); });
  });

  describe('generateGeoQuiz', () => {
    it('valid quiz with 4 options', () => {
      const quiz = generateGeoQuiz(getCountriesForAge('explorer'));
      expect(quiz.options.length).toBe(4);
      expect(quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(quiz.correctIndex).toBeLessThan(4);
    });
  });

  describe('generateGeoQuizSet', () => {
    it('explorer gets 8', () => { expect(generateGeoQuizSet('explorer').length).toBe(8); });
    it('master gets 12', () => { expect(generateGeoQuizSet('master').length).toBe(12); });
  });

  describe('checkGeoAnswer', () => {
    it('correct', () => { const q = generateGeoQuiz(getCountriesForAge('explorer')); expect(checkGeoAnswer(q, q.correctIndex)).toBe(true); });
    it('wrong', () => { const q = generateGeoQuiz(getCountriesForAge('explorer')); expect(checkGeoAnswer(q, (q.correctIndex + 1) % 4)).toBe(false); });
  });

  describe('calculateGeoScore', () => {
    it('3 stars perfect', () => { expect(calculateGeoScore(8, 8, 30).stars).toBe(3); });
    it('1 star low', () => { expect(calculateGeoScore(2, 10, 30).stars).toBe(1); });
  });
});
