import { describe, it, expect } from 'vitest';
import { createRaceState, moveLane, updateRace, calculateRaceScore, getInitialSpeed } from '../logic';
describe('Corrida Maluca Logic', () => {
  it('creates initial state', () => { const s = createRaceState('explorer'); expect(s.playerLane).toBe(1); expect(s.crashed).toBe(false); expect(s.distance).toBe(0); });
  it('moveLane left from 1 = 0', () => { expect(moveLane(1, 'left')).toBe(0); });
  it('moveLane right from 1 = 2', () => { expect(moveLane(1, 'right')).toBe(2); });
  it('moveLane left from 0 stays 0', () => { expect(moveLane(0, 'left')).toBe(0); });
  it('moveLane right from 2 stays 2', () => { expect(moveLane(2, 'right')).toBe(2); });
  it('updateRace increases distance', () => { const s = createRaceState('explorer'); const next = updateRace(s, 'explorer'); expect(next.distance).toBeGreaterThan(0); });
  it('speed increases over time', () => { let s = createRaceState('explorer'); for (let i = 0; i < 100; i++) s = updateRace(s, 'explorer'); if (!s.crashed) expect(s.speed).toBeGreaterThan(getInitialSpeed('explorer')); });
  it('calculateRaceScore returns valid', () => { const r = calculateRaceScore(5000, 10); expect(r.score).toBeGreaterThan(0); expect([1, 2, 3]).toContain(r.stars); });
});
