import { describe, it, expect } from 'vitest';
import { createBoard, makeMove, checkWinner, isBoardFull, getAIMove, calculateTTTScore } from '../logic';
describe('Velha Turbinado Logic', () => {
  it('creates empty board', () => { const b = createBoard(); expect(b.length).toBe(9); b.forEach((c) => expect(c).toBeNull()); });
  it('makes move', () => { const b = makeMove(createBoard(), 0, 'X'); expect(b[0]).toBe('X'); });
  it('does not overwrite', () => { const b = makeMove(createBoard(), 0, 'X'); const b2 = makeMove(b, 0, 'O'); expect(b2[0]).toBe('X'); });
  it('detects winner row', () => { const b = createBoard(); b[0] = 'X'; b[1] = 'X'; b[2] = 'X'; expect(checkWinner(b)).toBe('X'); });
  it('detects winner col', () => { const b = createBoard(); b[0] = 'O'; b[3] = 'O'; b[6] = 'O'; expect(checkWinner(b)).toBe('O'); });
  it('detects winner diag', () => { const b = createBoard(); b[0] = 'X'; b[4] = 'X'; b[8] = 'X'; expect(checkWinner(b)).toBe('X'); });
  it('no winner on empty', () => { expect(checkWinner(createBoard())).toBeNull(); });
  it('board full detection', () => { const b: ('X' | 'O')[] = ['X','O','X','O','X','O','O','X','O']; expect(isBoardFull(b)).toBe(true); });
  it('AI returns valid move', () => { const b = createBoard(); const move = getAIMove(b, 'O', 'explorer'); expect(move).toBeGreaterThanOrEqual(0); expect(move).toBeLessThan(9); });
  it('AI takes winning move', () => { const b = createBoard(); b[0] = 'O'; b[1] = 'O'; const move = getAIMove(b, 'O', 'adventurer'); expect(move).toBe(2); });
  it('3 stars all wins', () => { expect(calculateTTTScore(5, 0, 0, 5, 60).stars).toBe(3); });
});
