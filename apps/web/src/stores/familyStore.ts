import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, GameHistory } from '@/types/player';
import type { AgeGroup } from '@/types/age-group';
import { getAgeGroupFromAge } from '@/types/age-group';
import { calculateLevel, isToday, isYesterday } from '@/lib/utils';
import type { GameResult } from '@/types/game';

export interface PlayerProfile {
  player: Player;
  gameHistory: GameHistory[];
}

interface FamilyState {
  profiles: PlayerProfile[];
  activeProfileId: string | null;
  parentPin: string | null;
  parentPinSet: boolean;
  timeLimitMinutes: number;

  addProfile: (name: string, age: number, avatarEmoji: string) => void;
  removeProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  getActiveProfile: () => PlayerProfile | null;
  updateProfileAge: (id: string, age: number) => void;
  addGameResult: (gameId: string, result: GameResult) => void;

  setParentPin: (pin: string) => void;
  verifyParentPin: (pin: string) => boolean;
  setTimeLimit: (minutes: number) => void;

  exportAllData: () => string;
  deleteAllData: () => void;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      parentPin: null,
      parentPinSet: false,
      timeLimitMinutes: 60,

      addProfile: (name, age, avatarEmoji) => {
        const newPlayer: Player = {
          id: Math.random().toString(36).substring(2, 15),
          name, age, ageGroup: getAgeGroupFromAge(age), avatarEmoji,
          xp: 0, level: 1, coins: 0, achievements: [], gamesPlayed: 0,
          totalScore: 0, streak: 0, lastPlayedAt: null, createdAt: new Date().toISOString(),
        };
        set((state) => ({
          profiles: [...state.profiles, { player: newPlayer, gameHistory: [] }],
          activeProfileId: state.activeProfileId ?? newPlayer.id,
        }));
      },

      removeProfile: (id) => {
        set((state) => {
          const newProfiles = state.profiles.filter((p) => p.player.id !== id);
          const newActive = state.activeProfileId === id
            ? (newProfiles[0]?.player.id ?? null)
            : state.activeProfileId;
          return { profiles: newProfiles, activeProfileId: newActive };
        });
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find((p) => p.player.id === activeProfileId) ?? null;
      },

      updateProfileAge: (id, age) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.player.id === id ? { ...p, player: { ...p.player, age, ageGroup: getAgeGroupFromAge(age) } } : p
          ),
        }));
      },

      addGameResult: (gameId, result) => {
        const { activeProfileId } = get();
        if (!activeProfileId) return;

        set((state) => ({
          profiles: state.profiles.map((profile) => {
            if (profile.player.id !== activeProfileId) return profile;
            const player = profile.player;
            const now = new Date().toISOString();
            let newStreak = player.streak;
            if (player.lastPlayedAt) {
              if (isYesterday(player.lastPlayedAt)) newStreak = player.streak + 1;
              else if (!isToday(player.lastPlayedAt)) newStreak = 1;
            } else { newStreak = 1; }

            const newXP = player.xp + result.xpEarned;
            const newAchievements = [...player.achievements];
            if (!newAchievements.includes('first-game')) newAchievements.push('first-game');
            if (newStreak >= 3 && !newAchievements.includes('streak-3')) newAchievements.push('streak-3');
            if (newStreak >= 7 && !newAchievements.includes('streak-7')) newAchievements.push('streak-7');

            const historyEntry: GameHistory = {
              gameId, playedAt: now, score: result.score, maxScore: result.maxScore,
              accuracy: result.accuracy, stars: result.stars, xpEarned: result.xpEarned, coinsEarned: result.coinsEarned,
            };

            return {
              player: { ...player, xp: newXP, level: calculateLevel(newXP), coins: player.coins + result.coinsEarned,
                achievements: newAchievements, gamesPlayed: player.gamesPlayed + 1,
                totalScore: player.totalScore + result.score, streak: newStreak, lastPlayedAt: now },
              gameHistory: [historyEntry, ...profile.gameHistory].slice(0, 500),
            };
          }),
        }));
      },

      setParentPin: (pin) => set({ parentPin: pin, parentPinSet: true }),
      verifyParentPin: (pin) => get().parentPin === pin,
      setTimeLimit: (minutes) => set({ timeLimitMinutes: minutes }),

      exportAllData: () => {
        const { profiles, activeProfileId } = get();
        return JSON.stringify({ profiles, activeProfileId, exportedAt: new Date().toISOString() }, null, 2);
      },

      deleteAllData: () => set({ profiles: [], activeProfileId: null, parentPin: null, parentPinSet: false }),
    }),
    { name: 'mundo-do-lukinha-family' },
  ),
);
