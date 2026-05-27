import { describe, it, expect } from 'vitest';
import { getOrgansForAge, generateBodyQuiz, generateQuizSet, checkBodyAnswer, calculateBodyScore } from '../logic';

describe('Corpo Humano Logic', () => {
  describe('getOrgansForAge', () => {
    it('explorer gets easy organs only', () => {
      const organs = getOrgansForAge('explorer');
      organs.forEach((o) => expect(o.difficulty).toBe(1));
      expect(organs.length).toBeGreaterThan(0);
    });
    it('master gets all organs', () => {
      const organs = getOrgansForAge('master');
      expect(organs.some((o) => o.difficulty === 3)).toBe(true);
    });
  });

  describe('generateBodyQuiz', () => {
    it('generates valid quiz', () => {
      const organs = getOrgansForAge('explorer');
      const quiz = generateBodyQuiz(organs);
      expect(quiz.question.length).toBeGreaterThan(0);
      expect(quiz.options.length).toBe(4);
      expect(quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(quiz.correctIndex).toBeLessThan(4);
      expect(quiz.explanation.length).toBeGreaterThan(0);
    });
  });

  describe('generateQuizSet', () => {
    it('generates correct count for explorer', () => {
      const set = generateQuizSet('explorer');
      expect(set.length).toBe(6);
    });
    it('generates correct count for master', () => {
      const set = generateQuizSet('master');
      expect(set.length).toBe(12);
    });
  });

  describe('checkBodyAnswer', () => {
    it('correct index returns true', () => {
      const quiz = generateBodyQuiz(getOrgansForAge('explorer'));
      expect(checkBodyAnswer(quiz, quiz.correctIndex)).toBe(true);
    });
    it('wrong index returns false', () => {
      const quiz = generateBodyQuiz(getOrgansForAge('explorer'));
      const wrong = (quiz.correctIndex + 1) % quiz.options.length;
      expect(checkBodyAnswer(quiz, wrong)).toBe(false);
    });
  });

  describe('calculateBodyScore', () => {
    it('3 stars for perfect', () => { expect(calculateBodyScore(6, 6, 30).stars).toBe(3); });
    it('1 star for low', () => { expect(calculateBodyScore(2, 10, 30).stars).toBe(1); });
  });
});
