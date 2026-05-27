import { describe, it, expect } from 'vitest';
import { PLANETS, getPlanetsForAge, generateSolarQuiz, generateQuizSet, checkSolarAnswer, checkPlanetOrder, calculateSolarScore } from '../logic';

describe('Sistema Solar Logic', () => {
  describe('PLANETS', () => {
    it('has 8 planets in correct order', () => {
      expect(PLANETS.length).toBe(8);
      expect(PLANETS[0]?.name).toBe('Mercúrio');
      expect(PLANETS[7]?.name).toBe('Netuno');
      PLANETS.forEach((p, i) => expect(p.order).toBe(i + 1));
    });
  });

  describe('getPlanetsForAge', () => {
    it('explorer gets 4 main planets', () => { expect(getPlanetsForAge('explorer').length).toBe(4); });
    it('master gets all 8', () => { expect(getPlanetsForAge('master').length).toBe(8); });
  });

  describe('generateSolarQuiz', () => {
    it('generates valid quiz', () => {
      const quiz = generateSolarQuiz(PLANETS);
      expect(quiz.question.length).toBeGreaterThan(0);
      expect(quiz.options.length).toBe(4);
      expect(quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(quiz.correctIndex).toBeLessThan(4);
    });
  });

  describe('generateQuizSet', () => {
    it('correct count for explorer', () => { expect(generateQuizSet('explorer').length).toBe(8); });
    it('correct count for master', () => { expect(generateQuizSet('master').length).toBe(12); });
  });

  describe('checkSolarAnswer', () => {
    it('correct returns true', () => {
      const quiz = generateSolarQuiz(PLANETS);
      expect(checkSolarAnswer(quiz, quiz.correctIndex)).toBe(true);
    });
    it('wrong returns false', () => {
      const quiz = generateSolarQuiz(PLANETS);
      expect(checkSolarAnswer(quiz, (quiz.correctIndex + 1) % 4)).toBe(false);
    });
  });

  describe('checkPlanetOrder', () => {
    it('correct order returns true', () => {
      expect(checkPlanetOrder(PLANETS.map((p) => p.id))).toBe(true);
    });
    it('wrong order returns false', () => {
      expect(checkPlanetOrder(['neptune', 'mercury'])).toBe(false);
    });
  });

  describe('calculateSolarScore', () => {
    it('3 stars for perfect', () => { expect(calculateSolarScore(10, 10, 30).stars).toBe(3); });
  });
});
