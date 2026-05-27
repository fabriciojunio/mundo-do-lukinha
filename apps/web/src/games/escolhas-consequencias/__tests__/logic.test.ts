import { describe, it, expect } from 'vitest';
import { getStoriesForAge, selectStories, evaluateStoryChoice, calculateStoryScore } from '../logic';
describe('Escolhas & Consequências Logic', () => {
  it('explorer easy stories', () => { getStoriesForAge('explorer').forEach((s) => expect(s.difficulty).toBe(1)); });
  it('master all 6', () => { expect(getStoriesForAge('master').length).toBe(6); });
  it('selectStories explorer 3', () => { expect(selectStories('explorer').length).toBe(3); });
  it('best choice gives 100 kindness', () => { const s = getStoriesForAge('explorer')[0]!; expect(evaluateStoryChoice(s, 0).kindness).toBe(100); });
  it('worst choice gives low kindness', () => { const s = getStoriesForAge('explorer')[0]!; expect(evaluateStoryChoice(s, 2).kindness).toBeLessThan(50); });
  it('3 stars max kindness', () => { expect(calculateStoryScore(500, 500, 5, 60).stars).toBe(3); });
  it('1 star low', () => { expect(calculateStoryScore(100, 500, 5, 60).stars).toBe(1); });
});
