import { describe, it, expect } from 'vitest';
import { getWordsForAge, generateEnglishQuiz, generateEnglishQuizSet, checkEnglishAnswer, calculateEnglishScore } from '../logic';

describe('English Words Logic', () => {
  describe('getWordsForAge', () => {
    it('explorer gets easy words', () => { const w = getWordsForAge('explorer'); w.forEach((x) => expect(x.difficulty).toBe(1)); expect(w.length).toBe(12); });
    it('master gets all', () => { expect(getWordsForAge('master').length).toBe(26); });
  });
  describe('generateEnglishQuiz', () => {
    it('valid quiz', () => { const q = generateEnglishQuiz(getWordsForAge('explorer')); expect(q.options.length).toBe(4); expect(q.correctIndex).toBeGreaterThanOrEqual(0); });
    it('direction is en-to-pt or pt-to-en', () => { const q = generateEnglishQuiz(getWordsForAge('explorer')); expect(['en-to-pt', 'pt-to-en']).toContain(q.direction); });
  });
  describe('generateEnglishQuizSet', () => {
    it('explorer 8', () => { expect(generateEnglishQuizSet('explorer').length).toBe(8); });
    it('master 12', () => { expect(generateEnglishQuizSet('master').length).toBe(12); });
  });
  describe('checkEnglishAnswer', () => {
    it('correct', () => { const q = generateEnglishQuiz(getWordsForAge('explorer')); expect(checkEnglishAnswer(q, q.correctIndex)).toBe(true); });
    it('wrong', () => { const q = generateEnglishQuiz(getWordsForAge('explorer')); expect(checkEnglishAnswer(q, (q.correctIndex + 1) % 4)).toBe(false); });
  });
  describe('calculateEnglishScore', () => {
    it('3 stars', () => { expect(calculateEnglishScore(8, 8, 30).stars).toBe(3); });
  });
});
