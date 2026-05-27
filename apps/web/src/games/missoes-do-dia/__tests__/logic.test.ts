import { describe, it, expect } from 'vitest';
import { getChallengesForAge, selectMissions, checkMissionAnswer, calculateMissionScore } from '../logic';
describe('Missões do Dia Logic', () => {
  it('chick easy', () => { getChallengesForAge('chick').forEach((c) => expect(c.difficulty).toBe(1)); });
  it('master all 6', () => { expect(getChallengesForAge('master').length).toBe(6); });
  it('correct answer', () => { const c = getChallengesForAge('explorer')[0]!; expect(checkMissionAnswer(c, c.correctIndex)).toBe(true); });
  it('3 stars', () => { expect(calculateMissionScore(5, 5, 60).stars).toBe(3); });
});
