import { describe, it, expect } from 'vitest';
import { getWordsForAge, createBubbleRound, popBubble, calculateBubbleScore } from '../logic';
describe('Bubble Pop', () => {
  it('chick easy words', () => { expect(getWordsForAge('chick').length).toBe(5); });
  it('creates round with bubbles', () => { const r = createBubbleRound('SOL'); expect(r.word).toBe('SOL'); expect(r.bubbles.length).toBeGreaterThan(3); expect(r.targetIndex).toBe(0); });
  it('pops correct bubble', () => { const r = createBubbleRound('AB'); const sBubble = r.bubbles.find((b) => b.letter === 'A'); if (sBubble) { const { correct, wordComplete } = popBubble(r, sBubble.id); expect(correct).toBe(true); } });
  it('wrong bubble not correct', () => { const r = createBubbleRound('AB'); const wrongB = r.bubbles.find((b) => b.letter !== 'A' && !b.popped); if (wrongB) { const { correct } = popBubble(r, wrongB.id); expect(correct).toBe(false); } });
  it('3 stars', () => { expect(calculateBubbleScore(4, 4, 0, 30).stars).toBe(3); });
});
