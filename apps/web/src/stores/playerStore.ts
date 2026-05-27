import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, GameHistory } from '@/types/player';
import type { GameResult } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { getAgeGroupFromAge } from '@/types/age-group';
import { calculateLevel } from '@/lib/utils';
import { isToday, isYesterday } from '@/lib/utils';

interface PlayerState {
  player: Player | null;
  gameHistory: GameHistory[];
  createPlayer: (name: string, age: number, avatarEmoji: string) => void;
  updateAge: (age: number) => void;
  addGameResult: (gameId: string, result: GameResult) => void;
  unlockAchievement: (achievementId: string) => void;
  setAvatar: (emoji: string) => void;
  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player: null,
      gameHistory: [],

      createPlayer: (name: string, age: number, avatarEmoji: string) => {
        const player: Player = {
          id: Math.random().toString(36).substring(2, 15),
          name,
          age,
          ageGroup: getAgeGroupFromAge(age),
          avatarEmoji,
          xp: 0,
          level: 1,
          coins: 0,
          achievements: [],
          gamesPlayed: 0,
          totalScore: 0,
          streak: 0,
          lastPlayedAt: null,
          createdAt: new Date().toISOString(),
        };
        set({ player, gameHistory: [] });
      },

      updateAge: (age: number) => {
        const { player } = get();
        if (!player) return;
        set({
          player: {
            ...player,
            age,
            ageGroup: getAgeGroupFromAge(age),
          },
        });
      },

      addGameResult: (gameId: string, result: GameResult) => {
        const { player, gameHistory } = get();
        if (!player) return;

        const now = new Date().toISOString();
        let newStreak = player.streak;

        if (player.lastPlayedAt) {
          if (isYesterday(player.lastPlayedAt)) {
            newStreak = player.streak + 1;
          } else if (!isToday(player.lastPlayedAt)) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        const newXP = player.xp + result.xpEarned;
        const newLevel = calculateLevel(newXP);

        const newAchievements = [...player.achievements];
        for (const achId of result.achievements) {
          if (!newAchievements.includes(achId)) {
            newAchievements.push(achId);
          }
        }

        if (!newAchievements.includes('first-game')) {
          newAchievements.push('first-game');
        }
        if (newStreak >= 3 && !newAchievements.includes('streak-3')) {
          newAchievements.push('streak-3');
        }
        if (newStreak >= 7 && !newAchievements.includes('streak-7')) {
          newAchievements.push('streak-7');
        }
        if (newLevel >= 5 && !newAchievements.includes('level-5')) {
          newAchievements.push('level-5');
        }
        if (newLevel >= 10 && !newAchievements.includes('level-10')) {
          newAchievements.push('level-10');
        }

        const historyEntry: GameHistory = {
          gameId,
          playedAt: now,
          score: result.score,
          maxScore: result.maxScore,
          accuracy: result.accuracy,
          stars: result.stars,
          xpEarned: result.xpEarned,
          coinsEarned: result.coinsEarned,
        };

        set({
          player: {
            ...player,
            xp: newXP,
            level: newLevel,
            coins: player.coins + result.coinsEarned,
            achievements: newAchievements,
            gamesPlayed: player.gamesPlayed + 1,
            totalScore: player.totalScore + result.score,
            streak: newStreak,
            lastPlayedAt: now,
          },
          gameHistory: [historyEntry, ...gameHistory].slice(0, 500),
        });
      },

      unlockAchievement: (achievementId: string) => {
        const { player } = get();
        if (!player) return;
        if (player.achievements.includes(achievementId)) return;
        set({
          player: {
            ...player,
            achievements: [...player.achievements, achievementId],
          },
        });
      },

      setAvatar: (emoji: string) => {
        const { player } = get();
        if (!player) return;
        set({ player: { ...player, avatarEmoji: emoji } });
      },

      resetPlayer: () => {
        set({ player: null, gameHistory: [] });
      },
    }),
    {
      name: 'mundo-do-lukinha-player',
    },
  ),
);
