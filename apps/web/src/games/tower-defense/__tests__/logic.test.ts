import { describe, it, expect } from 'vitest';
import { createTDState, placeTower, isPathCell, hasTower, spawnWave, updateEnemies, TOWER_TYPES, calculateTDScore } from '../logic';
describe('Tower Defense Logic', () => {
  it('creates state with gold and lives', () => { const s = createTDState('adventurer'); expect(s.gold).toBe(50); expect(s.lives).toBe(10); });
  it('isPathCell detects path', () => { expect(isPathCell(2, 0)).toBe(true); expect(isPathCell(0, 0)).toBe(false); });
  it('placeTower places on empty non-path cell', () => { const s = createTDState('adventurer'); const next = placeTower(s, 0, 0, 'arrow'); expect(next.towers.length).toBe(1); expect(next.gold).toBe(40); });
  it('cannot place on path', () => { const s = createTDState('adventurer'); const next = placeTower(s, 2, 0, 'arrow'); expect(next.towers.length).toBe(0); });
  it('cannot place without gold', () => { const s = { ...createTDState('adventurer'), gold: 0 }; const next = placeTower(s, 0, 0, 'arrow'); expect(next.towers.length).toBe(0); });
  it('spawnWave creates enemies', () => { const e = spawnWave(0); expect(e.length).toBe(3); });
  it('wave 2 has more enemies', () => { expect(spawnWave(2).length).toBeGreaterThan(spawnWave(0).length); });
  it('3 tower types', () => { expect(TOWER_TYPES.length).toBe(3); });
  it('3 stars all waves', () => { expect(calculateTDScore(5, 5, 10, 60).stars).toBe(3); });
});
