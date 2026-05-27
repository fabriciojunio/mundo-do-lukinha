import type { AgeGroup } from './age-group';

export interface Player {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  avatarEmoji: string;
  xp: number;
  level: number;
  coins: number;
  achievements: string[];
  gamesPlayed: number;
  totalScore: number;
  streak: number;
  lastPlayedAt: string | null;
  createdAt: string;
}

export interface PlayerStats {
  totalGamesPlayed: number;
  totalXP: number;
  totalCoins: number;
  totalAchievements: number;
  averageAccuracy: number;
  favoriteCategory: string | null;
  currentStreak: number;
  longestStreak: number;
}

export interface GameHistory {
  gameId: string;
  playedAt: string;
  score: number;
  maxScore: number;
  accuracy: number;
  stars: 1 | 2 | 3;
  xpEarned: number;
  coinsEarned: number;
}

export function createDefaultPlayer(name: string, age: number, ageGroup: AgeGroup): Player {
  return {
    id: Math.random().toString(36).substring(2, 15),
    name,
    age,
    ageGroup,
    avatarEmoji: '🦊',
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
}
