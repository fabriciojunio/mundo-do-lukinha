import { describe, it, expect } from 'vitest';
import { BLOCKS, getGridSize, createGrid, countBlocks, calculateBuildScore } from '../logic';
describe('Construtor de Mundos', () => {
  it('8 blocks', () => { expect(BLOCKS.length).toBe(8); });
  it('grid sizes', () => { expect(getGridSize('chick')).toBe(5); expect(getGridSize('master')).toBe(12); });
  it('empty grid', () => { const g = createGrid(5); expect(countBlocks(g)).toBe(0); });
  it('count blocks', () => { const g = createGrid(3); g[0]![0] = 0; g[1]![1] = 1; expect(countBlocks(g)).toBe(2); });
  it('score', () => { expect(calculateBuildScore(20, 10, 60).score).toBe(100); });
});
