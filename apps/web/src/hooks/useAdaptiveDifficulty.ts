import { useState, useCallback } from 'react';
import { clamp } from '@/lib/utils';

interface AdaptiveDifficultyOptions {
  minDifficulty?: number;
  maxDifficulty?: number;
  increaseAfter?: number;
  decreaseAfter?: number;
}

export function useAdaptiveDifficulty(options: AdaptiveDifficultyOptions = {}) {
  const {
    minDifficulty = 1,
    maxDifficulty = 10,
    increaseAfter = 5,
    decreaseAfter = 3,
  } = options;

  const [difficulty, setDifficulty] = useState(minDifficulty);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  const onCorrect = useCallback(() => {
    setConsecutiveWrong(0);
    setConsecutiveCorrect((prev) => {
      const next = prev + 1;
      if (next >= increaseAfter) {
        setDifficulty((d) => clamp(d + 1, minDifficulty, maxDifficulty));
        return 0;
      }
      return next;
    });
  }, [increaseAfter, minDifficulty, maxDifficulty]);

  const onWrong = useCallback(() => {
    setConsecutiveCorrect(0);
    setConsecutiveWrong((prev) => {
      const next = prev + 1;
      if (next >= decreaseAfter) {
        setDifficulty((d) => clamp(d - 1, minDifficulty, maxDifficulty));
        return 0;
      }
      return next;
    });
  }, [decreaseAfter, minDifficulty, maxDifficulty]);

  const reset = useCallback(() => {
    setDifficulty(minDifficulty);
    setConsecutiveCorrect(0);
    setConsecutiveWrong(0);
  }, [minDifficulty]);

  return {
    difficulty,
    consecutiveCorrect,
    consecutiveWrong,
    onCorrect,
    onWrong,
    reset,
  };
}
