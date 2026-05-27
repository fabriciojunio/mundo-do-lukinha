import { useGameStore } from '@/stores/gameStore';
import type { AgeGroup } from '@/types/age-group';

export function useGame() {
  const store = useGameStore();

  return {
    currentGameId: store.currentGameId,
    status: store.status,
    score: store.score,
    timeElapsed: store.timeElapsed,
    difficulty: store.difficulty,
    combo: store.combo,
    maxCombo: store.maxCombo,
    correctAnswers: store.correctAnswers,
    totalAnswers: store.totalAnswers,
    accuracy: store.totalAnswers > 0 ? store.correctAnswers / store.totalAnswers : 0,
    isPlaying: store.status === 'playing',
    isPaused: store.status === 'paused',
    isFinished: store.status === 'finished',
    startGame: (gameId: string, ageGroup: AgeGroup) => store.startGame(gameId, ageGroup),
    pauseGame: store.pauseGame,
    resumeGame: store.resumeGame,
    endGame: store.endGame,
    addScore: store.addScore,
    incrementCombo: store.incrementCombo,
    resetCombo: store.resetCombo,
    addCorrectAnswer: store.addCorrectAnswer,
    addWrongAnswer: store.addWrongAnswer,
    setTimeElapsed: store.setTimeElapsed,
    setDifficulty: store.setDifficulty,
    resetGame: store.resetGame,
  };
}
