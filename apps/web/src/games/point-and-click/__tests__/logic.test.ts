import { describe, it, expect } from 'vitest';
import { getScenesForAge, checkItemClick, calculatePointClickScore } from '../logic';
describe('Point & Click', () => {
  it('explorer 2 scenes', () => { expect(getScenesForAge('explorer').length).toBe(2); });
  it('master all 4', () => { expect(getScenesForAge('master').length).toBe(4); });
  it('detects click on item', () => { expect(checkItemClick({ id: 'x', name: 'X', emoji: 'X', x: 50, y: 50, found: false, hint: '' }, 52, 48, 10)).toBe(true); });
  it('misses far click', () => { expect(checkItemClick({ id: 'x', name: 'X', emoji: 'X', x: 50, y: 50, found: false, hint: '' }, 90, 90, 10)).toBe(false); });
  it('3 stars all found', () => { expect(calculatePointClickScore(10, 10, 0, 60).stars).toBe(3); });
  it('hints reduce score', () => { const noHints = calculatePointClickScore(10, 10, 0, 60); const withHints = calculatePointClickScore(10, 10, 5, 60); expect(withHints.accuracy).toBeLessThan(noHints.accuracy); });
});
