import { describe, it, expect } from 'vitest';
import { EMOTIONS, getChallengesForAge, selectChallenges, checkEmotionAnswer, getEmotionByName, calculateEmotionScore } from '../logic';
describe('Diário de Emoções Logic', () => {
  it('has 8 emotions', () => { expect(EMOTIONS.length).toBe(8); });
  it('chick gets easy', () => { getChallengesForAge('chick').forEach((c) => expect(c.difficulty).toBe(1)); });
  it('master gets all', () => { expect(getChallengesForAge('master').length).toBe(8); });
  it('selectChallenges chick 3', () => { expect(selectChallenges('chick').length).toBe(3); });
  it('correct answer', () => { const c = getChallengesForAge('explorer')[0]!; expect(checkEmotionAnswer(c, c.correctIndex)).toBe(true); });
  it('getEmotionByName', () => { expect(getEmotionByName('Feliz')?.emoji).toBe('😊'); });
  it('3 stars', () => { expect(calculateEmotionScore(4, 4, 30).stars).toBe(3); });
});
