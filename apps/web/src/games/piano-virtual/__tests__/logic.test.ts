import { describe, it, expect } from 'vitest';
import { PIANO_NOTES, getMelodiesForAge, getNoteByName, checkMelodyAttempt, calculatePianoScore } from '../logic';

describe('Piano Virtual Logic', () => {
  describe('PIANO_NOTES', () => {
    it('has 8 notes', () => { expect(PIANO_NOTES.length).toBe(8); });
    it('all have frequencies', () => { PIANO_NOTES.forEach((n) => expect(n.frequency).toBeGreaterThan(0)); });
    it('Dó is C', () => { expect(PIANO_NOTES[0]?.namePt).toBe('Dó'); expect(PIANO_NOTES[0]?.name).toBe('C'); });
  });
  describe('getMelodiesForAge', () => {
    it('explorer easy melodies', () => { const m = getMelodiesForAge('explorer'); m.forEach((x) => expect(x.difficulty).toBe(1)); });
    it('master all melodies', () => { expect(getMelodiesForAge('master').length).toBe(9); });
  });
  describe('getNoteByName', () => {
    it('finds C', () => { expect(getNoteByName('C')?.namePt).toBe('Dó'); });
    it('undefined for invalid', () => { expect(getNoteByName('Z')).toBeUndefined(); });
  });
  describe('checkMelodyAttempt', () => {
    it('correct attempt', () => { expect(checkMelodyAttempt(['C', 'D', 'E'], ['C', 'D', 'E'])).toBe(true); });
    it('wrong attempt', () => { expect(checkMelodyAttempt(['C', 'D', 'E'], ['C', 'E', 'D'])).toBe(false); });
    it('different length', () => { expect(checkMelodyAttempt(['C', 'D'], ['C'])).toBe(false); });
  });
  describe('calculatePianoScore', () => {
    it('3 stars perfect', () => { expect(calculatePianoScore(5, 5, 30).stars).toBe(3); });
  });
});
