import { describe, it, expect } from 'vitest';
import { createPet, feedPet, restPet, teachPet, calculateMood, getMoodEmoji, getChallengesForAge, checkTeachingAnswer, calculateAIPetScore } from '../logic';

describe('AI Pet Logic', () => {
  describe('createPet', () => {
    it('creates pet with name', () => { const p = createPet('Bit'); expect(p.name).toBe('Bit'); expect(p.level).toBe(1); expect(p.mood).toBe('happy'); });
  });
  describe('feedPet', () => {
    it('increases hunger', () => { const p = createPet('X'); const fed = feedPet({ ...p, hunger: 50 }); expect(fed.hunger).toBe(75); });
    it('caps at 100', () => { const p = createPet('X'); const fed = feedPet({ ...p, hunger: 90 }); expect(fed.hunger).toBe(100); });
  });
  describe('restPet', () => {
    it('increases energy', () => { const p = createPet('X'); const rested = restPet({ ...p, energy: 50 }); expect(rested.energy).toBe(80); });
  });
  describe('teachPet', () => {
    it('increases knowledge', () => { const p = createPet('X'); const taught = teachPet(p, 'test'); expect(taught.knowledge).toBeGreaterThan(p.knowledge); });
    it('adds pattern to learned', () => { const p = createPet('X'); const t = teachPet(p, 'alternância'); expect(t.learnedPatterns).toContain('alternância'); });
    it('no duplicate patterns', () => { const p = createPet('X'); const t1 = teachPet(p, 'a'); const t2 = teachPet(t1, 'a'); expect(t2.learnedPatterns.filter((x) => x === 'a').length).toBe(1); });
  });
  describe('calculateMood', () => {
    it('sleepy when low energy', () => { expect(calculateMood({ ...createPet('X'), energy: 10 })).toBe('sleepy'); });
    it('sad when hungry', () => { expect(calculateMood({ ...createPet('X'), hunger: 20, energy: 50 })).toBe('sad'); });
    it('excited when knowledge high', () => { expect(calculateMood({ ...createPet('X'), knowledge: 90, hunger: 70, energy: 70 })).toBe('excited'); });
  });
  describe('getMoodEmoji', () => {
    it('happy = 😊', () => { expect(getMoodEmoji('happy')).toBe('😊'); });
  });
  describe('getChallengesForAge', () => {
    it('explorer 4', () => { expect(getChallengesForAge('explorer').length).toBe(4); });
    it('master 8', () => { expect(getChallengesForAge('master').length).toBe(8); });
  });
  describe('checkTeachingAnswer', () => {
    it('correct', () => { const c = getChallengesForAge('explorer')[0]!; expect(checkTeachingAnswer(c, c.correctIndex)).toBe(true); });
  });
  describe('calculateAIPetScore', () => {
    it('3 stars', () => { expect(calculateAIPetScore(4, 4, 3, 60).stars).toBe(3); });
  });
});
