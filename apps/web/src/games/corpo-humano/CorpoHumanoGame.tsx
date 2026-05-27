'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { generateQuizSet, checkBodyAnswer, calculateBodyScore, type BodyQuiz } from './logic';
import { corpoHumanoConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function CorpoHumanoGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const quizzes = useRef<BodyQuiz[]>(generateQuizSet(ageGroup));
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean; fact: string } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const currentQuiz = quizzes.current[qIndex];
  const totalQuizzes = quizzes.current.length;

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (phase !== 'playing' || !currentQuiz) return;
      const isCorrect = checkBodyAnswer(currentQuiz, selectedIndex);
      let newCorrect = correct;

      if (isCorrect) {
        newCorrect = correct + 1;
        setCorrect(newCorrect);
        playSound('correct');
        setFeedback({ msg: getRandomItem(ENCOURAGEMENT_CORRECT), ok: true, fact: currentQuiz.explanation });
      } else {
        playSound('wrong');
        setFeedback({ msg: getRandomItem(ENCOURAGEMENT_WRONG), ok: false, fact: currentQuiz.explanation });
      }

      setPhase('feedback');
      setTimeout(() => {
        if (qIndex + 1 >= totalQuizzes) {
          const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
          const gameResult = calculateBodyScore(newCorrect, totalQuizzes, timeSpent);
          setResult(gameResult);
          setPhase('finished');
          playSound('gameOver');
          onGameEnd(gameResult);
        } else {
          setQIndex((i) => i + 1);
          setFeedback(null);
          setPhase('playing');
        }
      }, 2500);
    },
    [phase, currentQuiz, correct, qIndex, totalQuizzes, onGameEnd],
  );

  const handlePlayAgain = useCallback(() => {
    quizzes.current = generateQuizSet(ageGroup);
    setQIndex(0);
    setCorrect(0);
    setFeedback(null);
    setPhase('playing');
    setResult(null);
    startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) {
    return <GameOverScreen result={result} gameName={corpoHumanoConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  }

  if (!currentQuiz) return null;

  return (
    <GameShell gameName={corpoHumanoConfig.name} gameIcon={corpoHumanoConfig.icon} score={correct * 15} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Pergunta {qIndex + 1}/{totalQuizzes}</p>

        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-6 py-4 w-full">
          <span className="text-4xl">{currentQuiz.organ.emoji}</span>
          <div>
            <p className="font-display font-bold text-lg text-text-main">{currentQuiz.organ.name}</p>
            <p className="text-xs font-body text-text-light">Sistema {currentQuiz.organ.system}</p>
          </div>
        </div>

        <p className="font-display font-bold text-lg text-text-main text-center">{currentQuiz.question}</p>

        <div className="flex flex-col gap-3 w-full">
          {currentQuiz.options.map((opt, i) => (
            <Button
              key={`${currentQuiz.id}-${i}`}
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => handleAnswer(i)}
              disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-error hover:bg-error/5 text-left justify-start"
            >
              <span className="font-display font-bold text-error mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </Button>
          ))}
        </div>

        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.ok ? 'bg-success/10' : 'bg-error/10'}`}>
            <p className={`font-body font-semibold text-sm ${feedback.ok ? 'text-success' : 'text-error'}`}>
              {feedback.msg}
            </p>
            <p className="text-xs font-body text-text-light mt-1">💡 {feedback.fact}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
