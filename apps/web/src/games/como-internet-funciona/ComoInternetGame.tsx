'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectQuizzes, checkInternetAnswer, calculateInternetScore, type InternetQuiz } from './logic';
import { comoInternetConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function ComoInternetGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const quizzes = useRef<InternetQuiz[]>(selectQuizzes(ageGroup));
  const [qIndex, setQIndex] = useState(0); const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean; exp: string } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cq = quizzes.current[qIndex]; const total = quizzes.current.length;

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'playing' || !cq) return;
    const ok = checkInternetAnswer(cq, idx); let nc = correct;
    if (ok) { nc = correct + 1; setCorrect(nc); playSound('correct'); setFeedback({ msg: getRandomItem(ENCOURAGEMENT_CORRECT), ok: true, exp: cq.explanation }); }
    else { playSound('wrong'); setFeedback({ msg: getRandomItem(ENCOURAGEMENT_WRONG), ok: false, exp: cq.explanation }); }
    setPhase('feedback');
    setTimeout(() => {
      if (qIndex + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateInternetScore(nc, total, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setQIndex((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 2500);
  }, [phase, cq, correct, qIndex, total, onGameEnd]);

  const handlePlayAgain = useCallback(() => { quizzes.current = selectQuizzes(ageGroup); setQIndex(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);

  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={comoInternetConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cq) return null;

  return (
    <GameShell gameName={comoInternetConfig.name} gameIcon={comoInternetConfig.icon} score={correct * 15} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Pergunta {qIndex + 1}/{total}</p>
        <div className="bg-sky-50 rounded-2xl px-6 py-4 text-center w-full">
          <span className="text-4xl block mb-1">{cq.emoji}</span>
          <p className="text-xs font-body text-sky-600">{cq.topic}</p>
        </div>
        <p className="font-display font-bold text-lg text-text-main text-center">{cq.question}</p>
        <div className="flex flex-col gap-3 w-full">
          {cq.options.map((opt, i) => (
            <Button key={`${cq.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-sky-500 hover:bg-sky-50 text-left justify-start">
              <span className="font-display font-bold text-sky-600 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </Button>
          ))}
        </div>
        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.ok ? 'bg-success/10' : 'bg-error/10'}`}>
            <p className={`font-body font-semibold text-sm ${feedback.ok ? 'text-success' : 'text-error'}`}>{feedback.msg}</p>
            <p className="text-xs font-body text-text-light mt-1">🌐 {feedback.exp}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
