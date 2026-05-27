'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { generateGeoQuizSet, checkGeoAnswer, calculateGeoScore, type GeoQuiz } from './logic';
import { geometriaBuilderConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function GeometriaBuilderGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const quizzes = useRef<GeoQuiz[]>(generateGeoQuizSet(ageGroup));
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const currentQuiz = quizzes.current[qIndex];
  const totalQuizzes = quizzes.current.length;

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'playing' || !currentQuiz) return;
    const isCorrect = checkGeoAnswer(currentQuiz, idx);
    let nc = correct;
    if (isCorrect) { nc = correct + 1; setCorrect(nc); playSound('correct'); setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_CORRECT)} ${currentQuiz.explanation}`, ok: true }); }
    else { playSound('wrong'); setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} ${currentQuiz.explanation}`, ok: false }); }
    setPhase('feedback');
    setTimeout(() => {
      if (qIndex + 1 >= totalQuizzes) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateGeoScore(nc, totalQuizzes, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setQIndex((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 2000);
  }, [phase, currentQuiz, correct, qIndex, totalQuizzes, onGameEnd]);

  const handlePlayAgain = useCallback(() => { quizzes.current = generateGeoQuizSet(ageGroup); setQIndex(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);

  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={geometriaBuilderConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!currentQuiz) return null;

  return (
    <GameShell gameName={geometriaBuilderConfig.name} gameIcon={geometriaBuilderConfig.icon} score={correct * 12} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Pergunta {qIndex + 1}/{totalQuizzes}</p>
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          <path d={currentQuiz.shape.svgPath} fill="#4ECDC4" stroke="#2D2D3F" strokeWidth="2" opacity="0.8" />
        </svg>
        <p className="font-display font-bold text-lg text-text-main text-center">{currentQuiz.question}</p>
        <div className="flex flex-col gap-3 w-full">
          {currentQuiz.options.map((opt, i) => (
            <Button key={`${currentQuiz.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-cyan-500 hover:bg-cyan-50 text-left justify-start">
              <span className="font-display font-bold text-cyan-600 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </Button>
          ))}
        </div>
        {feedback && <p className={`text-sm font-body font-semibold text-center px-4 py-2 rounded-xl animate-pop-in ${feedback.ok ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>{feedback.msg}</p>}
      </div>
    </GameShell>
  );
}
