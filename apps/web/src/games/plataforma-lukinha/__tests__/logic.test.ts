import { describe, it, expect } from 'vitest';
import { createPlayer, updatePlayer, checkStarCollection, checkGoal, getLevelsForAge, calculatePlatformScore } from '../logic';
describe('Plataforma do Lukinha Logic', () => {
  it('creates player at position', () => { const p = createPlayer(50, 280); expect(p.x).toBe(50); expect(p.y).toBe(280); expect(p.onGround).toBe(false); });
  it('player falls with gravity', () => { const p = createPlayer(50, 100); const next = updatePlayer(p, { left: false, right: false, jump: false }, [], 4); expect(next.y).toBeGreaterThan(100); });
  it('player moves right', () => { const p = createPlayer(50, 280); const next = updatePlayer(p, { left: false, right: true, jump: false }, [], 4); expect(next.x).toBeGreaterThan(50); });
  it('collects nearby star', () => { const stars = [{ x: 55, y: 280, collected: false }]; const p = createPlayer(50, 280); const result = checkStarCollection(p, stars); expect(result[0]?.collected).toBe(true); });
  it('does not collect far star', () => { const stars = [{ x: 500, y: 100, collected: false }]; const p = createPlayer(50, 280); const result = checkStarCollection(p, stars); expect(result[0]?.collected).toBe(false); });
  it('reaches goal', () => { expect(checkGoal({ x: 580, y: 280, vx: 0, vy: 0, onGround: true, facingRight: true }, 580, 280)).toBe(true); });
  it('getLevelsForAge chick 2 levels', () => { expect(getLevelsForAge('chick').length).toBe(2); });
  it('getLevelsForAge master 4 levels', () => { expect(getLevelsForAge('master').length).toBe(4); });
  it('3 stars', () => { expect(calculatePlatformScore(10, 10, 4, 4, 60).stars).toBe(3); });
});
