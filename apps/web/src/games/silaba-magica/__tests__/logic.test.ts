import { describe, it, expect } from 'vitest';
import { generateSplitChallenge, generateBuildChallenge, checkSplitAnswer, checkBuildAnswer, getWordsForAge, getSyllableCount, calculateSyllableScore } from '../logic';

describe('Sílaba Mágica Logic', () => {
  describe('generateSplitChallenge', () => {
    it('generates challenge with correct answer in options', () => {
      const words = getWordsForAge('explorer');
      const c = generateSplitChallenge(words);
      expect(c.options).toContain(c.correctAnswer);
      expect(c.mode).toBe('split');
    });

    it('correct answer matches word syllables', () => {
      const words = getWordsForAge('explorer');
      const c = generateSplitChallenge(words);
      expect(c.correctAnswer).toBe(c.word.syllables.join('-'));
    });
  });

  describe('generateBuildChallenge', () => {
    it('generates build challenge with shuffled syllables', () => {
      const words = getWordsForAge('adventurer');
      const c = generateBuildChallenge(words);
      expect(c.mode).toBe('build');
      expect(c.options.length).toBe(c.word.syllables.length);
      expect(c.options.sort()).toEqual([...c.word.syllables].sort());
    });
  });

  describe('checkSplitAnswer', () => {
    it('returns true for correct split', () => {
      const words = getWordsForAge('explorer');
      const c = generateSplitChallenge(words);
      expect(checkSplitAnswer(c, c.correctAnswer)).toBe(true);
    });

    it('returns false for wrong split', () => {
      const words = getWordsForAge('explorer');
      const c = generateSplitChallenge(words);
      expect(checkSplitAnswer(c, 'WRONG-SPLIT')).toBe(false);
    });
  });

  describe('checkBuildAnswer', () => {
    it('returns true for correct order', () => {
      const word = { word: 'GATO', syllables: ['GA', 'TO'], syllableCount: 2 };
      expect(checkBuildAnswer(['GA', 'TO'], word)).toBe(true);
    });

    it('returns false for wrong order', () => {
      const word = { word: 'GATO', syllables: ['GA', 'TO'], syllableCount: 2 };
      expect(checkBuildAnswer(['TO', 'GA'], word)).toBe(false);
    });
  });

  describe('getWordsForAge', () => {
    it('explorer only gets 2-syllable words', () => {
      const words = getWordsForAge('explorer');
      words.forEach((w) => expect(w.syllableCount).toBeLessThanOrEqual(2));
    });

    it('master gets all words', () => {
      const words = getWordsForAge('master');
      expect(words.some((w) => w.syllableCount >= 4)).toBe(true);
    });
  });

  describe('getSyllableCount', () => {
    it('returns correct count for known word', () => {
      expect(getSyllableCount('BANANA')).toBe(3);
      expect(getSyllableCount('GATO')).toBe(2);
    });

    it('returns 0 for unknown word', () => {
      expect(getSyllableCount('XYZABC')).toBe(0);
    });
  });

  describe('calculateSyllableScore', () => {
    it('3 stars for perfect', () => {
      expect(calculateSyllableScore(10, 10, 30).stars).toBe(3);
    });
    it('1 star for low', () => {
      expect(calculateSyllableScore(3, 10, 30).stars).toBe(1);
    });
  });
});
