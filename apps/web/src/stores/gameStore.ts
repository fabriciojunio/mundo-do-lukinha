import { create } from 'zustand';
import type { AgeGroup } from '@/types/age-group';

type GameStatus = 'idle' | 'playing' | 'paused' | 'finished';

interface GameState {
  currentGameId: string | null;
  status: GameStatus;
  score: number;
  timeElapsed: number;
  difficulty: number;
  combo: number;
  maxCombo: number;
  correctAnswers: number;
  totalAnswers: number;

  startGame: (gameId: string, ageGroup: AgeGroup) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  addScore: (points: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  addCorrectAnswer: () => void;
  addWrongAnswer: () => void;
  setTimeElapsed: (time: number) => void;
  setDifficulty: (difficulty: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()((set) => ({
  currentGameId: null,
  status: 'idle',
  score: 0,
  timeElapsed: 0,
  difficulty: 1,
  combo: 0,
  maxCombo: 0,
  correctAnswers: 0,
  totalAnswers: 0,

  startGame: (gameId: string, _ageGroup: AgeGroup) => {
    set({
      currentGameId: gameId,
      status: 'playing',
      score: 0,
      timeElapsed: 0,
      combo: 0,
      maxCombo: 0,
      correctAnswers: 0,
      totalAnswers: 0,
    });
  },

  pauseGame: () => set({ status: 'paused' }),
  resumeGame: () => set({ status: 'playing' }),
  endGame: () => set({ status: 'finished' }),

  addScore: (points: number) =>
    set((state) => ({ score: state.score + points })),

  incrementCombo: () =>
    set((state) => ({
      combo: state.combo + 1,
      maxCombo: Math.max(state.maxCombo, state.combo + 1),
    })),

  resetCombo: () => set({ combo: 0 }),

  addCorrectAnswer: () =>
    set((state) => ({
      correctAnswers: state.correctAnswers + 1,
      totalAnswers: state.totalAnswers + 1,
    })),

  addWrongAnswer: () =>
    set((state) => ({ totalAnswers: state.totalAnswers + 1 })),

  setTimeElapsed: (time: number) => set({ timeElapsed: time }),
  setDifficulty: (difficulty: number) => set({ difficulty }),

  resetGame: () =>
    set({
      currentGameId: null,
      status: 'idle',
      score: 0,
      timeElapsed: 0,
      difficulty: 1,
      combo: 0,
      maxCombo: 0,
      correctAnswers: 0,
      totalAnswers: 0,
    }),
}));
