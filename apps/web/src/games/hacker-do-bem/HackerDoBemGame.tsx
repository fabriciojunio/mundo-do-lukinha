'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectChallenges, checkSecurityAnswer, calculateSecurityScore, type SecurityChallenge } from './logic';
import { hackerDoBemConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function HackerDoBemGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const challenges = useRef<SecurityChallenge[]>(selectChallenges(ageGroup));
  const [cIndex, setCIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean; explanation: string } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const currentChallenge = challenges.current[cIndex];
  const totalChallenges = challenges.current.length;

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'playing' || !currentChallenge) return;
    const isCorrect = checkSecurityAnswer(currentChallenge, idx);
    let nc = correct;
    if (isCorrect) { nc = correct + 1; setCorrect(nc); playSound('correct'); setFeedback({ msg: getRandomItem(ENCOURAGEMENT_CORRECT), ok: true, explanation: currentChallenge.explanation }); }
    else { playSound('wrong'); setFeedback({ msg: getRandomItem(ENCOURAGEMENT_WRONG), ok: false, explanation: currentChallenge.explanation }); }
    setPhase('feedback');
    setTimeout(() => {
      if (cIndex + 1 >= totalChallenges) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateSecurityScore(nc, totalChallenges, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setCIndex((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 2500);
  }, [phase, currentChallenge, correct, cIndex, totalChallenges, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    challenges.current = selectChallenges(ageGroup); setCIndex(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={hackerDoBemConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!currentChallenge) return null;

  const typeLabel = currentChallenge.type === 'password-strength' ? '🔑 Senhas' : currentChallenge.type === 'phishing' ? '🎣 Golpes' : '🛡️ Segurança';

  return (
    <GameShell gameName={hackerDoBemConfig.name} gameIcon={hackerDoBemConfig.icon} score={correct * 15} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-body text-text-light">Desafio {cIndex + 1}/{totalChallenges}</span>
          <span className="px-2 py-0.5 bg-success/15 text-success text-xs font-body font-bold rounded-full">{typeLabel}</span>
        </div>
        <p className="font-display font-bold text-lg text-text-main text-center">{currentChallenge.question}</p>
        <div className="flex flex-col gap-3 w-full">
          {currentChallenge.options.map((opt, i) => (
            <Button key={`${currentChallenge.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-success hover:bg-success/5 text-left justify-start">
              <span className="font-display font-bold text-success mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </Button>
          ))}
        </div>
        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.ok ? 'bg-success/10' : 'bg-error/10'}`}>
            <p className={`font-body font-semibold text-sm ${feedback.ok ? 'text-success' : 'text-error'}`}>{feedback.msg}</p>
            <p className="text-xs font-body text-text-light mt-1">🛡️ {feedback.explanation}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
