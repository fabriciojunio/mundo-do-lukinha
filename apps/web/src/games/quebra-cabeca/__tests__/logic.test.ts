import { describe, it, expect } from 'vitest';
import { generatePuzzle, swapPieces, isPuzzleSolved, countCorrectPieces, getGridSize, calculatePuzzleScore } from '../logic';
describe('Quebra-Cabeça Logic', () => {
  it('generates correct number of pieces', () => { expect(generatePuzzle(3).length).toBe(9); expect(generatePuzzle(4).length).toBe(16); });
  it('all pieces have emojis', () => { generatePuzzle(3).forEach((p) => expect(p.emoji.length).toBeGreaterThan(0)); });
  it('swapPieces swaps correctly', () => { const p = generatePuzzle(2); const s = swapPieces(p, 0, 1); const at0 = s.find((x) => x.currentPos === 0); const at1 = s.find((x) => x.currentPos === 1); expect(at0).toBeDefined(); expect(at1).toBeDefined(); });
  it('solved puzzle is detected', () => { const p = [{ id: 0, currentPos: 0, correctPos: 0, emoji: '🐶' }, { id: 1, currentPos: 1, correctPos: 1, emoji: '🐱' }]; expect(isPuzzleSolved(p)).toBe(true); });
  it('unsolved puzzle detected', () => { const p = [{ id: 0, currentPos: 1, correctPos: 0, emoji: '🐶' }, { id: 1, currentPos: 0, correctPos: 1, emoji: '🐱' }]; expect(isPuzzleSolved(p)).toBe(false); });
  it('countCorrectPieces', () => { const p = [{ id: 0, currentPos: 0, correctPos: 0, emoji: '🐶' }, { id: 1, currentPos: 0, correctPos: 1, emoji: '🐱' }]; expect(countCorrectPieces(p)).toBe(1); });
  it('getGridSize', () => { expect(getGridSize('chick')).toBe(2); expect(getGridSize('master')).toBe(4); });
  it('3 stars', () => { expect(calculatePuzzleScore(3, 3, 10, 60).stars).toBe(3); });
});
