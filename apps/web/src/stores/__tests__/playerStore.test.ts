import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from '../playerStore';

describe('playerStore', () => {
  beforeEach(() => {
    usePlayerStore.getState().resetPlayer();
  });

  describe('createPlayer', () => {
    it('creates player with correct fields', () => {
      usePlayerStore.getState().createPlayer('Lukinha', 7, '🧑');
      const p = usePlayerStore.getState().player;
      expect(p).not.toBeNull();
      expect(p?.name).toBe('Lukinha');
      expect(p?.age).toBe(7);
      expect(p?.ageGroup).toBe('explorer');
      expect(p?.xp).toBe(0);
      expect(p?.level).toBe(1);
      expect(p?.coins).toBe(0);
      expect(p?.gamesPlayed).toBe(0);
      expect(p?.streak).toBe(0);
      expect(p?.avatarEmoji).toBe('🧑');
    });

    it('clears game history on create', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      expect(usePlayerStore.getState().gameHistory).toEqual([]);
    });
  });

  describe('updateAge', () => {
    it('updates age and ageGroup', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      usePlayerStore.getState().updateAge(12);
      const p = usePlayerStore.getState().player;
      expect(p?.age).toBe(12);
      expect(p?.ageGroup).toBe('master');
    });

    it('does nothing without player', () => {
      usePlayerStore.getState().updateAge(12);
      expect(usePlayerStore.getState().player).toBeNull();
    });
  });

  describe('addGameResult', () => {
    it('adds XP and coins', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      usePlayerStore.getState().addGameResult('math-battle', {
        score: 80, maxScore: 100, timeSpent: 30, accuracy: 0.8,
        xpEarned: 30, coinsEarned: 15, achievements: [], stars: 2,
      });
      const p = usePlayerStore.getState().player;
      expect(p?.xp).toBe(30);
      expect(p?.coins).toBe(15);
      expect(p?.gamesPlayed).toBe(1);
      expect(p?.totalScore).toBe(80);
    });

    it('unlocks first-game achievement', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      usePlayerStore.getState().addGameResult('test', {
        score: 10, maxScore: 10, timeSpent: 5, accuracy: 1,
        xpEarned: 10, coinsEarned: 5, achievements: [], stars: 3,
      });
      expect(usePlayerStore.getState().player?.achievements).toContain('first-game');
    });

    it('adds game history entry', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      usePlayerStore.getState().addGameResult('math-battle', {
        score: 50, maxScore: 100, timeSpent: 30, accuracy: 0.5,
        xpEarned: 20, coinsEarned: 10, achievements: [], stars: 1,
      });
      const history = usePlayerStore.getState().gameHistory;
      expect(history.length).toBe(1);
      expect(history[0]?.gameId).toBe('math-battle');
      expect(history[0]?.score).toBe(50);
    });

    it('sets streak to 1 on first play', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      usePlayerStore.getState().addGameResult('test', {
        score: 10, maxScore: 10, timeSpent: 5, accuracy: 1,
        xpEarned: 10, coinsEarned: 5, achievements: [], stars: 3,
      });
      expect(usePlayerStore.getState().player?.streak).toBe(1);
    });

    it('accumulates XP over multiple games', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      const result = { score: 10, maxScore: 10, timeSpent: 5, accuracy: 1, xpEarned: 25, coinsEarned: 10, achievements: [] as string[], stars: 3 as const };
      usePlayerStore.getState().addGameResult('g1', result);
      usePlayerStore.getState().addGameResult('g2', result);
      usePlayerStore.getState().addGameResult('g3', result);
      expect(usePlayerStore.getState().player?.xp).toBe(75);
      expect(usePlayerStore.getState().player?.gamesPlayed).toBe(3);
    });

    it('history is limited to 500 entries', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      const result = { score: 10, maxScore: 10, timeSpent: 5, accuracy: 1, xpEarned: 1, coinsEarned: 1, achievements: [] as string[], stars: 3 as const };
      for (let i = 0; i < 510; i++) {
        usePlayerStore.getState().addGameResult(`g${i}`, result);
      }
      expect(usePlayerStore.getState().gameHistory.length).toBe(500);
    });
  });

  describe('unlockAchievement', () => {
    it('adds achievement', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      usePlayerStore.getState().unlockAchievement('test-ach');
      expect(usePlayerStore.getState().player?.achievements).toContain('test-ach');
    });

    it('does not duplicate', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      usePlayerStore.getState().unlockAchievement('test-ach');
      usePlayerStore.getState().unlockAchievement('test-ach');
      expect(usePlayerStore.getState().player?.achievements.filter((a) => a === 'test-ach').length).toBe(1);
    });
  });

  describe('setAvatar', () => {
    it('changes avatar', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      usePlayerStore.getState().setAvatar('🦊');
      expect(usePlayerStore.getState().player?.avatarEmoji).toBe('🦊');
    });
  });

  describe('resetPlayer', () => {
    it('resets all data', () => {
      usePlayerStore.getState().createPlayer('Test', 7, '🧑');
      usePlayerStore.getState().addGameResult('test', { score: 10, maxScore: 10, timeSpent: 5, accuracy: 1, xpEarned: 10, coinsEarned: 5, achievements: [], stars: 3 });
      usePlayerStore.getState().resetPlayer();
      expect(usePlayerStore.getState().player).toBeNull();
      expect(usePlayerStore.getState().gameHistory).toEqual([]);
    });
  });
});
