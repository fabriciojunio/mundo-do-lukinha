import { describe, it, expect } from 'vitest';
import { selectWords, checkSpelling, getLetterFeedback, scrambleWord, getWordsForAge, calculateDitadoScore } from '../logic';

describe('Ditado Musical Logic', () => {
  describe('selectWords', () => {
    it('returns correct count for explorer', () => {
      const words = selectWords('explorer');
      expect(words.length).toBe(8);
    });

    it('returns correct count for master', () => {
      const words = selectWords('master');
      expect(words.length).toBe(10);
    });

    it('all words have required fields', () => {
      const words = selectWords('adventurer');
      words.forEach((w) => {
        expect(w.word.length).toBeGreaterThan(0);
        expect(w.hint.length).toBeGreaterThan(0);
        expect(w.category.length).toBeGreaterThan(0);
      });
    });
  });

  describe('checkSpelling', () => {
    it('correct spelling returns true', () => {
      expect(checkSpelling('GATO', 'GATO')).toBe(true);
    });

    it('case insensitive', () => {
      expect(checkSpelling('gato', 'GATO')).toBe(true);
      expect(checkSpelling('Gato', 'GATO')).toBe(true);
    });

    it('trims whitespace', () => {
      expect(checkSpelling('  GATO  ', 'GATO')).toBe(true);
    });

    it('wrong spelling returns false', () => {
      expect(checkSpelling('GATU', 'GATO')).toBe(false);
    });
  });

  describe('getLetterFeedback', () => {
    it('all correct for matching word', () => {
      const fb = getLetterFeedback('GATO', 'GATO');
      expect(fb.length).toBe(4);
      fb.forEach((l) => expect(l.status).toBe('correct'));
    });

    it('marks wrong letters', () => {
      const fb = getLetterFeedback('GATU', 'GATO');
      expect(fb[3]?.status).toBe('wrong');
    });

    it('marks missing letters', () => {
      const fb = getLetterFeedback('GAT', 'GATO');
      expect(fb[3]?.status).toBe('missing');
    });
  });

  describe('scrambleWord', () => {
    it('returns same letters shuffled', () => {
      const letters = scrambleWord('GATO');
      expect(letters.sort()).toEqual(['A', 'G', 'O', 'T']);
    });
  });

  describe('getWordsForAge', () => {
    it('explorer gets easy words', () => {
      const words = getWordsForAge('explorer');
      expect(words.length).toBeGreaterThan(0);
      words.forEach((w) => expect(w.word.length).toBeLessThanOrEqual(5));
    });

    it('master gets harder words', () => {
      const words = getWordsForAge('master');
      expect(words.some((w) => w.word.length > 8)).toBe(true);
    });
  });

  describe('calculateDitadoScore', () => {
    it('3 stars for perfect no hints', () => {
      expect(calculateDitadoScore(8, 8, 0, 30).stars).toBe(3);
    });

    it('hints reduce accuracy', () => {
      const noHints = calculateDitadoScore(8, 8, 0, 30);
      const withHints = calculateDitadoScore(8, 8, 5, 30);
      expect(withHints.accuracy).toBeLessThan(noHints.accuracy);
    });

    it('1 star for low score', () => {
      expect(calculateDitadoScore(2, 10, 3, 30).stars).toBe(1);
    });
  });
});
