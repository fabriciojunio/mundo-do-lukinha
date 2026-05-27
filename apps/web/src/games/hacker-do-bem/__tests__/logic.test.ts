import { describe, it, expect } from 'vitest';
import { evaluatePasswordStrength, getChallengesForAge, selectChallenges, checkSecurityAnswer, calculateSecurityScore } from '../logic';

describe('Hacker do Bem Logic', () => {
  describe('evaluatePasswordStrength', () => {
    it('weak for "123456"', () => { expect(evaluatePasswordStrength('123456').level).toBe('weak'); });
    it('strong for complex password', () => { const r = evaluatePasswordStrength('MinhaSenh@F0rte!'); expect(['strong', 'very-strong']).toContain(r.level); });
    it('gives tips for weak', () => { expect(evaluatePasswordStrength('abc').tips.length).toBeGreaterThan(0); });
    it('score between 0-100', () => { const r = evaluatePasswordStrength('test'); expect(r.score).toBeGreaterThanOrEqual(0); expect(r.score).toBeLessThanOrEqual(100); });
  });
  describe('getChallengesForAge', () => {
    it('explorer easy', () => { getChallengesForAge('explorer').forEach((c) => expect(c.difficulty).toBe(1)); });
    it('master all', () => { expect(getChallengesForAge('master').length).toBe(12); });
  });
  describe('selectChallenges', () => {
    it('explorer 6', () => { expect(selectChallenges('explorer').length).toBeLessThanOrEqual(6); });
    it('master 10', () => { expect(selectChallenges('master').length).toBeLessThanOrEqual(10); });
  });
  describe('checkSecurityAnswer', () => {
    it('correct', () => { const c = selectChallenges('explorer')[0]!; expect(checkSecurityAnswer(c, c.correctIndex)).toBe(true); });
  });
  describe('calculateSecurityScore', () => {
    it('3 stars', () => { expect(calculateSecurityScore(6, 6, 30).stars).toBe(3); });
  });
});
