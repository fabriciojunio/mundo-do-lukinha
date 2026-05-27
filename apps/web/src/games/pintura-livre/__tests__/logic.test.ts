import { describe, it, expect } from 'vitest';
import { PAINT_COLORS, BRUSH_SIZES, calculatePaintScore } from '../logic';
describe('Pintura Livre', () => {
  it('has 10 colors', () => { expect(PAINT_COLORS.length).toBe(10); });
  it('has 4 brush sizes', () => { expect(BRUSH_SIZES.length).toBe(4); });
  it('always gives 3 stars (creative mode)', () => { expect(calculatePaintScore(5, 3, 60).stars).toBe(3); });
  it('score based on creativity', () => { const r = calculatePaintScore(30, 8, 120); expect(r.score).toBeGreaterThan(0); expect(r.score).toBeLessThanOrEqual(100); });
});
