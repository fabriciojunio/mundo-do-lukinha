import { describe, it, expect } from 'vitest';
import { getEventsForAge, generateHistoryQuiz, generateHistoryQuizSet, checkHistoryAnswer, calculateHistoryScore, EVENTS } from '../logic';

describe('Máquina do Tempo Logic', () => {
  describe('EVENTS', () => {
    it('has 14 events', () => { expect(EVENTS.length).toBe(14); });
    it('all have required fields', () => {
      EVENTS.forEach((e) => {
        expect(e.title.length).toBeGreaterThan(0);
        expect(e.funFact.length).toBeGreaterThan(0);
        expect(e.era.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getEventsForAge', () => {
    it('explorer gets easy events', () => { const e = getEventsForAge('explorer'); e.forEach((x) => expect(x.difficulty).toBe(1)); });
    it('master gets all', () => { expect(getEventsForAge('master').length).toBe(14); });
  });

  describe('generateHistoryQuiz', () => {
    it('valid quiz', () => {
      const q = generateHistoryQuiz(getEventsForAge('explorer'));
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
    });
  });

  describe('generateHistoryQuizSet', () => {
    it('explorer gets 8', () => { expect(generateHistoryQuizSet('explorer').length).toBe(8); });
    it('master gets 12', () => { expect(generateHistoryQuizSet('master').length).toBe(12); });
  });

  describe('checkHistoryAnswer', () => {
    it('correct', () => { const q = generateHistoryQuiz(EVENTS); expect(checkHistoryAnswer(q, q.correctIndex)).toBe(true); });
    it('wrong', () => { const q = generateHistoryQuiz(EVENTS); expect(checkHistoryAnswer(q, (q.correctIndex + 1) % 4)).toBe(false); });
  });

  describe('calculateHistoryScore', () => {
    it('3 stars perfect', () => { expect(calculateHistoryScore(8, 8, 30).stars).toBe(3); });
    it('1 star low', () => { expect(calculateHistoryScore(2, 10, 30).stars).toBe(1); });
  });
});
