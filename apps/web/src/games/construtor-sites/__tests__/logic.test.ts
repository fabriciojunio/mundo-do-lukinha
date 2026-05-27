import { describe, it, expect } from 'vitest';
import { HTML_ELEMENTS, getMissionsForAge, checkMission, getElementByTag, calculateSiteScore } from '../logic';
describe('Construtor de Sites Logic', () => {
  it('has 8 HTML elements', () => { expect(HTML_ELEMENTS.length).toBe(8); });
  it('adventurer missions', () => { expect(getMissionsForAge('adventurer').length).toBe(4); });
  it('master all missions', () => { expect(getMissionsForAge('master').length).toBe(5); });
  it('checkMission complete', () => { const m = getMissionsForAge('adventurer')[0]!; const { complete } = checkMission(m, m.requiredTags); expect(complete).toBe(true); });
  it('checkMission missing', () => { const m = getMissionsForAge('adventurer')[0]!; const { complete, missing } = checkMission(m, []); expect(complete).toBe(false); expect(missing.length).toBeGreaterThan(0); });
  it('getElementByTag finds h1', () => { expect(getElementByTag('h1')?.label).toBe('Título Grande'); });
  it('3 stars', () => { expect(calculateSiteScore(3, 3, 60).stars).toBe(3); });
});
