'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import {
  generateTabuadaQuestion,
  checkTabuadaAnswer,
  getTablesForAge,
  getQuestionsPerRound,
  getTimeLimitMs,
  getSpeedBonus,
  getBelt,
  calculateTabuadaScore,
  BELT_LABELS,
  BELT_EMOJIS,
  type TabuadaQuestion,
} from './logic';
import { tabuadaNinjaConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function TabuadaNinjaGame({ ageGroup, difficulty, onGameEnd, onBack }: GameProps) {
  const tables = getTablesForAge(ageGroup);
  const totalQuestions = getQuestionsPerRound(ageGroup);
  const timeLimitMs = getTimeLimitMs(ageGroup);

  const [question, setQuestion] = useState<TabuadaQuestion>(() =>
    generateTabuadaQuestion(tables, difficulty),
  );
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const [totalSpeedBonus, setTotalSpeedBonus] = useState(0);
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [timerProgress, setTimerProgress] = useState(1);
  const [result, setResult] = useState<GameResult | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');

  const questionStartTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== 'playing') return;
    questionStartTime.current = Date.now();
    setTimerProgress(1);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - questionStartTime.current;
      const remaining = Math.max(0, 1 - elapsed / timeLimitMs);
      setTimerProgress(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        handleTimeout();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question.id, phase]);

  const handleTimeout = useCallback(() => {
    playSound('wrong');
    setFeedback(`⏰ Tempo esgotado! A resposta era ${question.correctAnswer}`);
    setFeedbackCorrect(false);
    setTotalTimeMs((t) => t + timeLimitMs);
    setPhase('feedback');
    advanceAfterDelay(correct, qIndex);
  }, [question, correct, qIndex, timeLimitMs]);

  const advanceAfterDelay = useCallback(
    (newCorrect: number, newIndex: number) => {
      setTimeout(() => {
        if (newIndex + 1 >= totalQuestions) {
          finishGame(newCorrect, newIndex + 1);
        } else {
          setQIndex(newIndex + 1);
          setQuestion(generateTabuadaQuestion(tables, difficulty));
          setFeedback(null);
          setPhase('playing');
        }
      }, 1000);
    },
    [tables, difficulty, totalQuestions],
  );

  const finishGame = useCallback(
    (finalCorrect: number, finalTotal: number) => {
      const gameResult = calculateTabuadaScore(
        finalCorrect,
        finalTotal,
        totalSpeedBonus,
        totalTimeMs,
        timeLimitMs,
      );
      setResult(gameResult);
      setPhase('finished');
      playSound('gameOver');
      onGameEnd(gameResult);
    },
    [totalSpeedBonus, totalTimeMs, timeLimitMs, onGameEnd],
  );

  const handleAnswer = useCallback(
    (answer: number) => {
      if (phase !== 'playing') return;
      if (timerRef.current) clearInterval(timerRef.current);

      const responseTime = Date.now() - questionStartTime.current;
      const isCorrect = checkTabuadaAnswer(question, answer);

      let newCorrect = correct;
      let newScore = score;
      let newSpeedBonus = totalSpeedBonus;

      if (isCorrect) {
        newCorrect = correct + 1;
        const speedBonus = getSpeedBonus(responseTime, timeLimitMs);
        newScore = score + 10 + speedBonus;
        newSpeedBonus = totalSpeedBonus + speedBonus;
        setCorrect(newCorrect);
        setScore(newScore);
        setTotalSpeedBonus(newSpeedBonus);
        playSound('correct');
        const speedMsg = speedBonus >= 3 ? ' ⚡ Super rápido!' : '';
        setFeedback(getRandomItem(ENCOURAGEMENT_CORRECT) + speedMsg);
        setFeedbackCorrect(true);
      } else {
        playSound('wrong');
        setFeedback(
          `${getRandomItem(ENCOURAGEMENT_WRONG)} ${question.a} × ${question.b} = ${question.correctAnswer}`,
        );
        setFeedbackCorrect(false);
      }

      setTotalTimeMs((t) => t + responseTime);
      setPhase('feedback');
      advanceAfterDelay(newCorrect, qIndex);
    },
    [phase, question, correct, score, totalSpeedBonus, timeLimitMs, qIndex, advanceAfterDelay],
  );

  const handlePlayAgain = useCallback(() => {
    setQuestion(generateTabuadaQuestion(tables, difficulty));
    setQIndex(0);
    setCorrect(0);
    setScore(0);
    setTotalSpeedBonus(0);
    setTotalTimeMs(0);
    setFeedback(null);
    setResult(null);
    setPhase('playing');
  }, [tables, difficulty]);

  if (phase === 'finished' && result) {
    const accuracy = totalQuestions > 0 ? correct / totalQuestions : 0;
    const avgSpeed = totalQuestions > 0 ? totalTimeMs / totalQuestions : timeLimitMs;
    const avgSpeedRatio = Math.max(0, 1 - avgSpeed / timeLimitMs);
    const belt = getBelt(accuracy, avgSpeedRatio);

    return (
      <div>
        <div className="text-center py-4">
          <p className="text-4xl mb-1">{BELT_EMOJIS[belt]}</p>
          <p className="font-display font-bold text-lg text-text-main">
            Você conquistou: {BELT_LABELS[belt]}!
          </p>
        </div>
        <GameOverScreen
          result={result}
          gameName={tabuadaNinjaConfig.name}
          onPlayAgain={handlePlayAgain}
          onBack={onBack}
        />
      </div>
    );
  }

  return (
    <GameShell
      gameName={tabuadaNinjaConfig.name}
      gameIcon={tabuadaNinjaConfig.icon}
      score={score}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <p className="text-sm font-body text-text-light">
          Pergunta {qIndex + 1}/{totalQuestions}
        </p>

        {/* Timer bar */}
        <div className="w-full max-w-md h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              timerProgress > 0.3 ? 'bg-primary' : timerProgress > 0.1 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${timerProgress * 100}%` }}
          />
        </div>

        <div className="bg-bg-dark text-white rounded-2xl px-8 py-6 text-center">
          <p className="font-display font-bold text-4xl md:text-5xl">{question.displayText}</p>
        </div>

        {feedback && (
          <p
            className={`text-center px-4 py-2 rounded-xl text-sm font-body font-semibold animate-pop-in ${
              feedbackCorrect ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
            }`}
          >
            {feedback}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {question.options.map((opt) => (
            <Button
              key={`${question.id}-${opt}`}
              variant={phase === 'playing' ? 'secondary' : 'ghost'}
              size="xl"
              onClick={() => handleAnswer(opt)}
              disabled={phase !== 'playing'}
              fullWidth
              className="text-2xl"
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
