'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { generateEnglishQuizSet, checkEnglishAnswer, calculateEnglishScore, type EnglishQuiz } from './logic';
import { englishWordsConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function EnglishWordsGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const quizzes = useRef<EnglishQuiz[]>(generateEnglishQuizSet(ageGroup));
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const currentQuiz = quizzes.current[qIndex];
  const totalQuizzes = quizzes.current.length;

  const handleAnswer = useCallback((selectedIndex: number) => {
    if (phase !== 'playing' || !currentQuiz) return;
    const isCorrect = checkEnglishAnswer(currentQuiz, selectedIndex);
    let newCorrect = correct;
    if (isCorrect) {
      newCorrect = correct + 1; setCorrect(newCorrect); playSound('correct');
      setFeedback({ msg: getRandomItem(ENCOURAGEMENT_CORRECT), ok: true });
    } else {
      playSound('wrong');
      const correctOpt = currentQuiz.options[currentQuiz.correctIndex] ?? '';
      setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} A resposta é: ${correctOpt}`, ok: false });
    }
    setPhase('feedback');
    setTimeout(() => {
      if (qIndex + 1 >= totalQuizzes) {
        const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
        const r = calculateEnglishScore(newCorrect, totalQuizzes, timeSpent);
        setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r);
      } else { setQIndex((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 1500);
  }, [phase, currentQuiz, correct, qIndex, totalQuizzes, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    quizzes.current = generateEnglishQuizSet(ageGroup);
    setQIndex(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) {
    return <GameOverScreen result={result} gameName={englishWordsConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  }
  if (!currentQuiz) return null;

  return (
    <GameShell gameName={englishWordsConfig.name} gameIcon={englishWordsConfig.icon} score={correct * 12} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Pergunta {qIndex + 1}/{totalQuizzes}</p>
        <div className="bg-blue-50 rounded-2xl px-6 py-4 text-center w-full">
          <span className="text-4xl block mb-2">{currentQuiz.word.emoji}</span>
          <p className="text-xs font-body text-blue-500">{currentQuiz.direction === 'en-to-pt' ? 'Inglês → Português' : 'Português → Inglês'}</p>
        </div>
        <p className="font-display font-bold text-lg text-text-main text-center">{currentQuiz.question}</p>
        <div className="flex flex-col gap-3 w-full">
          {currentQuiz.options.map((opt, i) => (
            <Button key={`${currentQuiz.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-left justify-start">
              <span className="font-display font-bold text-blue-600 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </Button>
          ))}
        </div>
        {feedback && (
          <p className={`text-sm font-body font-semibold text-center px-4 py-2 rounded-xl animate-pop-in ${feedback.ok ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>
            {feedback.msg}
          </p>
        )}
      </div>
    </GameShell>
  );
}
