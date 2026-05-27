import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';

describe('gameStore', () => {
  beforeEach(() => { useGameStore.getState().resetGame(); });

  it('starts idle', () => { expect(useGameStore.getState().status).toBe('idle'); expect(useGameStore.getState().currentGameId).toBeNull(); });

  it('startGame sets state', () => {
    useGameStore.getState().startGame('math-battle', 'explorer');
    const s = useGameStore.getState();
    expect(s.currentGameId).toBe('math-battle');
    expect(s.status).toBe('playing');
    expect(s.score).toBe(0);
  });

  it('pause and resume', () => {
    useGameStore.getState().startGame('test', 'explorer');
    useGameStore.getState().pauseGame();
    expect(useGameStore.getState().status).toBe('paused');
    useGameStore.getState().resumeGame();
    expect(useGameStore.getState().status).toBe('playing');
  });

  it('addScore accumulates', () => {
    useGameStore.getState().addScore(10);
    useGameStore.getState().addScore(20);
    expect(useGameStore.getState().score).toBe(30);
  });

  it('combo increments and tracks max', () => {
    useGameStore.getState().incrementCombo();
    useGameStore.getState().incrementCombo();
    useGameStore.getState().incrementCombo();
    expect(useGameStore.getState().combo).toBe(3);
    expect(useGameStore.getState().maxCombo).toBe(3);
    useGameStore.getState().resetCombo();
    expect(useGameStore.getState().combo).toBe(0);
    expect(useGameStore.getState().maxCombo).toBe(3);
  });

  it('correct/wrong answers', () => {
    useGameStore.getState().addCorrectAnswer();
    useGameStore.getState().addCorrectAnswer();
    useGameStore.getState().addWrongAnswer();
    expect(useGameStore.getState().correctAnswers).toBe(2);
    expect(useGameStore.getState().totalAnswers).toBe(3);
  });

  it('setTimeElapsed', () => { useGameStore.getState().setTimeElapsed(42); expect(useGameStore.getState().timeElapsed).toBe(42); });
  it('setDifficulty', () => { useGameStore.getState().setDifficulty(5); expect(useGameStore.getState().difficulty).toBe(5); });
  it('endGame sets finished', () => { useGameStore.getState().startGame('t', 'explorer'); useGameStore.getState().endGame(); expect(useGameStore.getState().status).toBe('finished'); });
  it('resetGame clears all', () => { useGameStore.getState().startGame('t', 'explorer'); useGameStore.getState().addScore(100); useGameStore.getState().resetGame(); expect(useGameStore.getState().score).toBe(0); expect(useGameStore.getState().currentGameId).toBeNull(); });
});
