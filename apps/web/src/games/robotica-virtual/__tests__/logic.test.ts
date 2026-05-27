import { describe, it, expect } from 'vitest';
import { getChallengesForAge, selectChallenges, checkRobotAnswer, calculateRobotScore } from '../logic';
describe('Robótica Virtual', () => {
  it('adventurer difficulty <= 2', () => { getChallengesForAge('adventurer').forEach((c) => expect(c.difficulty).toBeLessThanOrEqual(2)); });
  it('master all 10', () => { expect(getChallengesForAge('master').length).toBe(10); });
  it('selectChallenges count', () => { expect(selectChallenges('adventurer').length).toBeLessThanOrEqual(6); expect(selectChallenges('master').length).toBeLessThanOrEqual(8); });
  it('correct answer', () => { const c = selectChallenges('adventurer')[0]!; expect(checkRobotAnswer(c, c.correctIndex)).toBe(true); });
  it('3 stars', () => { expect(calculateRobotScore(8, 8, 60).stars).toBe(3); });
});
