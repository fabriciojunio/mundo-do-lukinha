import { describe, it, expect } from 'vitest';
import { createInitialState, updateDino, checkCollision, spawnObstacle, updateGameState, calculateDinoScore, getInitialSpeed } from '../logic';

describe('Dino Runner Logic', () => {
  describe('createInitialState', () => {
    it('creates a valid initial state', () => {
      const state = createInitialState('explorer');
      expect(state.isGameOver).toBe(false);
      expect(state.score).toBe(0);
      expect(state.dino.isJumping).toBe(false);
      expect(state.obstacles.length).toBe(0);
    });
  });

  describe('updateDino', () => {
    it('initiates jump when jump pressed and not jumping', () => {
      const dino = { y: 200, velocity: 0, isJumping: false, isDucking: false };
      const result = updateDino(dino, true, false);
      expect(result.isJumping).toBe(true);
      expect(result.velocity).toBeLessThan(0);
    });

    it('does not double jump', () => {
      const dino = { y: 150, velocity: -5, isJumping: true, isDucking: false };
      const result = updateDino(dino, true, false);
      expect(result.velocity).not.toBeLessThan(-5);
    });

    it('applies gravity', () => {
      const dino = { y: 100, velocity: 0, isJumping: true, isDucking: false };
      const result = updateDino(dino, false, false);
      expect(result.velocity).toBeGreaterThan(0);
    });

    it('lands on ground', () => {
      const dino = { y: 199, velocity: 5, isJumping: true, isDucking: false };
      const result = updateDino(dino, false, false);
      expect(result.y).toBe(200);
      expect(result.isJumping).toBe(false);
    });

    it('ducks when duck pressed and on ground', () => {
      const dino = { y: 200, velocity: 0, isJumping: false, isDucking: false };
      const result = updateDino(dino, false, true);
      expect(result.isDucking).toBe(true);
    });
  });

  describe('checkCollision', () => {
    it('detects collision with obstacle', () => {
      const dino = { y: 200, velocity: 0, isJumping: false, isDucking: false };
      const obstacle = { x: 65, width: 20, height: 40, y: 210, type: 'cactus-small' as const };
      expect(checkCollision(dino, obstacle)).toBe(true);
    });

    it('no collision when dino jumps over', () => {
      const dino = { y: 100, velocity: 0, isJumping: true, isDucking: false };
      const obstacle = { x: 65, width: 20, height: 40, y: 210, type: 'cactus-small' as const };
      expect(checkCollision(dino, obstacle)).toBe(false);
    });

    it('no collision when obstacle is far', () => {
      const dino = { y: 200, velocity: 0, isJumping: false, isDucking: false };
      const obstacle = { x: 500, width: 20, height: 40, y: 210, type: 'cactus-small' as const };
      expect(checkCollision(dino, obstacle)).toBe(false);
    });
  });

  describe('spawnObstacle', () => {
    it('spawns obstacle at canvas edge', () => {
      const obs = spawnObstacle(640, 'explorer');
      expect(obs.x).toBe(640);
      expect(obs.width).toBeGreaterThan(0);
      expect(obs.height).toBeGreaterThan(0);
    });

    it('chick only gets cactus-small', () => {
      for (let i = 0; i < 20; i++) {
        const obs = spawnObstacle(640, 'chick');
        expect(obs.type).toBe('cactus-small');
      }
    });
  });

  describe('calculateDinoScore', () => {
    it('gives dino-100 achievement for 100+ score', () => {
      const result = calculateDinoScore(150);
      expect(result.achievements).toContain('dino-100');
    });

    it('no dino-100 for less than 100', () => {
      const result = calculateDinoScore(50);
      expect(result.achievements).not.toContain('dino-100');
    });

    it('returns valid stars', () => {
      const result = calculateDinoScore(300);
      expect([1, 2, 3]).toContain(result.stars);
    });
  });

  describe('getInitialSpeed', () => {
    it('chick is slowest', () => {
      expect(getInitialSpeed('chick')).toBeLessThan(getInitialSpeed('master'));
    });
  });
});
