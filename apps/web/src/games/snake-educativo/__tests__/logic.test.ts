import { describe, it, expect } from 'vitest';
import { createSnakeState, moveSnake, changeDir, getGridSize, calculateSnakeScore } from '../logic';
describe('Snake Educativo', () => {
  it('creates state', () => { const s = createSnakeState('explorer'); expect(s.body.length).toBe(1); expect(s.gameOver).toBe(false); });
  it('moves right', () => { const s = createSnakeState('explorer'); const next = moveSnake(s, 10); expect(next.body[0]!.x).toBe(s.body[0]!.x + 1); });
  it('changeDir blocks reverse', () => { expect(changeDir('right', 'left')).toBe('right'); expect(changeDir('right', 'up')).toBe('up'); });
  it('grid sizes', () => { expect(getGridSize('explorer')).toBe(10); expect(getGridSize('master')).toBe(15); });
  it('score', () => { const r = calculateSnakeScore(100, 2, 30); expect([1, 2, 3]).toContain(r.stars); });
});
