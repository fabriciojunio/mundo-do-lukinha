import { describe, it, expect } from 'vitest';
import { BUILDINGS, createCivState, canBuild, buildStructure, endTurn, calculateCivScore } from '../logic';
describe('Construtor de Civilizações', () => {
  it('has 8 buildings', () => { expect(BUILDINGS.length).toBe(8); });
  it('creates initial state', () => { const s = createCivState('adventurer'); expect(s.turn).toBe(0); expect(s.resources.food).toBe(30); expect(s.buildings.length).toBe(0); });
  it('canBuild farm with enough resources', () => { const s = createCivState('adventurer'); const farm = BUILDINGS.find((b) => b.id === 'farm')!; expect(canBuild(s, farm)).toBe(true); });
  it('cannot build without resources', () => { const s = { ...createCivState('adventurer'), resources: { food: 0, wood: 0, stone: 0, gold: 0, population: 0, happiness: 50 } }; const farm = BUILDINGS.find((b) => b.id === 'farm')!; expect(canBuild(s, farm)).toBe(false); });
  it('buildStructure adds building', () => { const s = createCivState('adventurer'); const next = buildStructure(s, 'farm'); expect(next.buildings.length).toBe(1); expect(next.buildings[0]).toBe('farm'); });
  it('buildStructure costs resources', () => { const s = createCivState('adventurer'); const next = buildStructure(s, 'farm'); expect(next.resources.wood).toBeLessThan(s.resources.wood); });
  it('endTurn advances turn', () => { const s = createCivState('adventurer'); const next = endTurn(s); expect(next.turn).toBe(1); });
  it('endTurn produces from buildings', () => { let s = createCivState('adventurer'); s = buildStructure(s, 'farm'); const before = s.resources.food; const next = endTurn(s); expect(next.resources.food).toBeGreaterThan(before - 10); });
  it('era changes at turn 4', () => { let s = createCivState('adventurer'); for (let i = 0; i < 4; i++) s = endTurn(s); expect(s.era).toBe('Era Clássica'); });
  it('calculateCivScore returns valid', () => { const s = createCivState('adventurer'); s.buildings.push('farm', 'house'); const r = calculateCivScore(s); expect([1, 2, 3]).toContain(r.stars); });
});
