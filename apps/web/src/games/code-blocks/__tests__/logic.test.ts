import { describe, it, expect } from 'vitest';
import { turnLeft, turnRight, moveForward, isValidPosition, expandCommands, executeCommands, getLevelsForAge, calculateCodeScore } from '../logic';

describe('Code Blocks Logic', () => {
  describe('turnLeft/turnRight', () => {
    it('turnLeft from up = left', () => { expect(turnLeft('up')).toBe('left'); });
    it('turnRight from up = right', () => { expect(turnRight('up')).toBe('right'); });
    it('4 lefts = full circle', () => { let d = turnLeft(turnLeft(turnLeft(turnLeft('up')))); expect(d).toBe('up'); });
  });

  describe('moveForward', () => {
    it('right increases col', () => { expect(moveForward({ row: 0, col: 0 }, 'right')).toEqual({ row: 0, col: 1 }); });
    it('down increases row', () => { expect(moveForward({ row: 0, col: 0 }, 'down')).toEqual({ row: 1, col: 0 }); });
    it('up decreases row', () => { expect(moveForward({ row: 1, col: 0 }, 'up')).toEqual({ row: 0, col: 0 }); });
  });

  describe('isValidPosition', () => {
    const grid = [['empty' as const, 'wall' as const], ['empty' as const, 'empty' as const]];
    it('empty is valid', () => { expect(isValidPosition({ row: 0, col: 0 }, grid)).toBe(true); });
    it('wall is invalid', () => { expect(isValidPosition({ row: 0, col: 1 }, grid)).toBe(false); });
    it('out of bounds is invalid', () => { expect(isValidPosition({ row: 5, col: 5 }, grid)).toBe(false); });
  });

  describe('expandCommands', () => {
    it('no repeats = same', () => { expect(expandCommands(['forward', 'forward'])).toEqual(['forward', 'forward']); });
    it('repeat-2 doubles previous', () => { expect(expandCommands(['forward', 'repeat-2'])).toEqual(['forward', 'forward']); });
    it('repeat-3 triples previous', () => { expect(expandCommands(['forward', 'repeat-3'])).toEqual(['forward', 'forward', 'forward']); });
  });

  describe('executeCommands', () => {
    it('solves level 1 with 3 forwards', () => {
      const levels = getLevelsForAge('chick');
      const l1 = levels[0]!;
      const { reachedGoal } = executeCommands(['forward', 'forward', 'forward'], l1);
      expect(reachedGoal).toBe(true);
    });
    it('fails with wrong commands', () => {
      const levels = getLevelsForAge('chick');
      const l1 = levels[0]!;
      const { reachedGoal } = executeCommands(['forward'], l1);
      expect(reachedGoal).toBe(false);
    });
  });

  describe('getLevelsForAge', () => {
    it('chick gets easy levels', () => { expect(getLevelsForAge('chick').length).toBe(2); });
    it('master gets all levels', () => { expect(getLevelsForAge('master').length).toBe(6); });
  });

  describe('calculateCodeScore', () => {
    it('3 stars perfect', () => { expect(calculateCodeScore(6, 6, 20, 60).stars).toBe(3); });
    it('1 star low', () => { expect(calculateCodeScore(1, 6, 5, 60).stars).toBe(1); });
  });
});
