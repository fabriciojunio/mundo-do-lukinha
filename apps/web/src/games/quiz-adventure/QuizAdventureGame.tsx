'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { getQuestions, checkQuizAnswer, calculateQuizScore, getQuestionCount, type QuizQuestion } from './logic';
import { quizAdventureConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

type Phase = 'question' | 'feedback' | 'finished';

export function QuizAdventureGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const questionCount = getQuestionCount(ageGroup);
  const questions = useRef<QuizQuestion[]>(getQuestions(ageGroup, questionCount));
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string; explanation: string } | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const currentQuestion = questions.current[qIndex];
  const totalQuestions = questions.current.length;

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (phase !== 'question' || !currentQuestion) return;

      const answer = checkQuizAnswer(currentQuestion, selectedIndex);
      let newStreak = streak;

      if (answer.correct) {
        newStreak = streak + 1;
        setCorrect((c) => c + 1);
        setStreak(newStreak);
        setMaxStreak((ms) => Math.max(ms, newStreak));
        playSound('correct');
        setFeedback({
          correct: true,
          message: getRandomItem(ENCOURAGEMENT_CORRECT),
          explanation: answer.explanation,
        });
      } else {
        newStreak = 0;
        setStreak(0);
        playSound('wrong');
        setFeedback({
          correct: false,
          message: getRandomItem(ENCOURAGEMENT_WRONG),
          explanation: answer.explanation,
        });
      }

      setPhase('feedback');
    },
    [phase, currentQuestion, streak],
  );

  const handleNext = useCallback(() => {
    if (qIndex + 1 >= totalQuestions) {
      const newCorrect = correct + (feedback?.correct ? 0 : 0); // already counted
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      const gameResult = calculateQuizScore(correct, totalQuestions, maxStreak);
      gameResult.timeSpent = timeSpent;
      setResult(gameResult);
      setPhase('finished');
      playSound('gameOver');
      onGameEnd(gameResult);
    } else {
      setQIndex((i) => i + 1);
      setFeedback(null);
      setPhase('question');
    }
  }, [qIndex, totalQuestions, correct, maxStreak, feedback, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    questions.current = getQuestions(ageGroup, questionCount);
    setQIndex(0);
    setCorrect(0);
    setStreak(0);
    setMaxStreak(0);
    setPhase('question');
    setFeedback(null);
    setResult(null);
    startTime.current = Date.now();
  }, [ageGroup, questionCount]);

  if (phase === 'finished' && result) {
    return (
      <GameOverScreen
        result={result}
        gameName={quizAdventureConfig.name}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
      />
    );
  }

  if (!currentQuestion) return null;

  return (
    <GameShell
      gameName={quizAdventureConfig.name}
      gameIcon={quizAdventureConfig.icon}
      score={correct * 10 + maxStreak * 5}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">
          Pergunta {qIndex + 1}/{totalQuestions}
          {streak >= 2 && <span className="ml-2 text-accent font-bold">🔥 x{streak}</span>}
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 w-full text-center">
          <p className="font-display font-bold text-xl text-text-main">{currentQuestion.text}</p>
        </div>

        {phase === 'question' && (
          <div className="flex flex-col gap-3 w-full">
            {currentQuestion.options.map((opt, i) => (
              <Button
                key={`${currentQuestion.id}-${i}`}
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => handleAnswer(i)}
                className="text-left justify-start border border-gray-200 hover:border-primary hover:bg-primary/5"
              >
                <span className="font-display font-bold text-primary mr-3">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </Button>
            ))}
          </div>
        )}

        {phase === 'feedback' && feedback && (
          <div className="w-full animate-slide-up">
            <div
              className={`p-4 rounded-xl mb-3 ${
                feedback.correct ? 'bg-success/10 border border-success/30' : 'bg-error/10 border border-error/30'
              }`}
            >
              <p className={`font-display font-bold ${feedback.correct ? 'text-success' : 'text-error'}`}>
                {feedback.message}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl mb-4">
              <p className="text-sm font-body text-blue-800">💡 {feedback.explanation}</p>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
              {qIndex + 1 >= totalQuestions ? 'Ver Resultado' : 'Próxima Pergunta →'}
            </Button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
