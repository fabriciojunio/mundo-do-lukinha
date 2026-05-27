'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { generateQuestion, checkAnswer, calculateScore, getTimerForAge, type MathQuestion } from './logic';
import { mathBattleConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

type GamePhase = 'playing' | 'feedback' | 'finished';

export function MathBattleGame({ ageGroup, difficulty, onGameEnd, onBack }: GameProps) {
  const [phase, setPhase] = useState<GamePhase>('playing');
  const [question, setQuestion] = useState<MathQuestion>(() => generateQuestion(ageGroup, difficulty));
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const timerSeconds = getTimerForAge(ageGroup);
  const showTimer = timerSeconds > 0;

  const finishGame = useCallback(
    (c: number, t: number, mc: number) => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      const gameResult = calculateScore(c, t, timeSpent, mc);
      setResult(gameResult);
      setPhase('finished');
      playSound('gameOver');
      onGameEnd(gameResult);
    },
    [onGameEnd],
  );

  const handleAnswer = useCallback(
    (answer: number) => {
      if (phase !== 'playing') return;
      const isCorrect = checkAnswer(question, answer);
      const newTotal = total + 1;
      let newCorrect = correct;
      let newCombo = combo;
      let newMaxCombo = maxCombo;

      if (isCorrect) {
        newCorrect = correct + 1;
        newCombo = combo + 1;
        newMaxCombo = Math.max(maxCombo, newCombo);
        setScore((s) => s + 10 + newCombo * 2);
        playSound('correct');
        setFeedback({ correct: true, message: getRandomItem(ENCOURAGEMENT_CORRECT) });
      } else {
        newCombo = 0;
        playSound('wrong');
        setFeedback({
          correct: false,
          message: `${getRandomItem(ENCOURAGEMENT_WRONG)} A resposta era ${question.correctAnswer}`,
        });
      }

      setCorrect(newCorrect);
      setTotal(newTotal);
      setCombo(newCombo);
      setMaxCombo(newMaxCombo);
      setPhase('feedback');

      setTimeout(() => {
        if (!showTimer && newTotal >= 10) {
          finishGame(newCorrect, newTotal, newMaxCombo);
        } else {
          setQuestion(generateQuestion(ageGroup, difficulty));
          setFeedback(null);
          setPhase('playing');
        }
      }, 1200);
    },
    [phase, question, total, correct, combo, maxCombo, ageGroup, difficulty, showTimer, finishGame],
  );

  const handleTimerEnd = useCallback(() => {
    finishGame(correct, total, maxCombo);
  }, [correct, total, maxCombo, finishGame]);

  const handlePlayAgain = useCallback(() => {
    setPhase('playing');
    setQuestion(generateQuestion(ageGroup, difficulty));
    setScore(0);
    setCorrect(0);
    setTotal(0);
    setCombo(0);
    setMaxCombo(0);
    setFeedback(null);
    setResult(null);
    startTime.current = Date.now();
  }, [ageGroup, difficulty]);

  if (phase === 'finished' && result) {
    return (
      <GameOverScreen
        result={result}
        gameName={mathBattleConfig.name}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
      />
    );
  }

  return (
    <GameShell
      gameName={mathBattleConfig.name}
      gameIcon={mathBattleConfig.icon}
      score={score}
      showTimer={showTimer}
      timerSeconds={timerSeconds}
      onTimerEnd={handleTimerEnd}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
        {combo >= 3 && (
          <div className="text-center animate-bounce-slow">
            <span className="text-sm font-display font-bold text-accent">🔥 Combo x{combo}!</span>
          </div>
        )}

        <div className="text-center">
          <p className="font-display font-bold text-4xl md:text-5xl text-text-main">{question.displayText}</p>
        </div>

        {feedback && (
          <div
            className={`text-center px-4 py-2 rounded-xl text-sm font-body font-semibold animate-pop-in ${
              feedback.correct ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {question.options.map((option) => (
            <Button
              key={`${question.id}-${option}`}
              variant={phase === 'playing' ? 'primary' : 'ghost'}
              size="xl"
              onClick={() => handleAnswer(option)}
              disabled={phase !== 'playing'}
              fullWidth
              className="text-2xl"
            >
              {option}
            </Button>
          ))}
        </div>

        <p className="text-sm font-body text-text-light">
          Pergunta {total + 1} {!showTimer ? '/ 10' : ''}
        </p>
      </div>
    </GameShell>
  );
}
