'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectDilemmas, evaluateChoice, calculateEthicsScore, type EthicalDilemma } from './logic';
import { cidadeDoFuturoConfig } from './config';
import { playSound } from '@/lib/sounds';

export function CidadeDoFuturoGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const dilemmas = useRef<EthicalDilemma[]>(selectDilemmas(ageGroup));
  const [dIndex, setDIndex] = useState(0);
  const [totalImpact, setTotalImpact] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; impact: number } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cd = dilemmas.current[dIndex]; const total = dilemmas.current.length;
  const maxImpact = total * 100;

  const handleChoice = useCallback((idx: number) => {
    if (phase !== 'playing' || !cd) return;
    const { impact, feedback: fb } = evaluateChoice(cd, idx);
    setTotalImpact((t) => t + impact);
    playSound(impact >= 80 ? 'correct' : impact >= 50 ? 'click' : 'wrong');
    setFeedback({ text: fb, impact });
    setPhase('feedback');
    setTimeout(() => {
      if (dIndex + 1 >= total) {
        const ts = Math.floor((Date.now() - startTime.current) / 1000);
        const r = calculateEthicsScore(totalImpact + impact, maxImpact, total, ts);
        setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r);
      } else { setDIndex((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 3000);
  }, [phase, cd, dIndex, total, totalImpact, maxImpact, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    dilemmas.current = selectDilemmas(ageGroup); setDIndex(0); setTotalImpact(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={cidadeDoFuturoConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cd) return null;

  return (
    <GameShell gameName={cidadeDoFuturoConfig.name} gameIcon={cidadeDoFuturoConfig.icon} score={totalImpact} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-body text-text-light">Dilema {dIndex + 1}/{total}</span>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-body font-bold rounded-full">{cd.topic}</span>
        </div>
        <div className="bg-indigo-50 rounded-2xl px-6 py-5 w-full text-center">
          <span className="text-4xl block mb-2">{cd.emoji}</span>
          <p className="font-body text-text-main text-base leading-relaxed">{cd.scenario}</p>
        </div>
        {phase === 'playing' && (
          <div className="flex flex-col gap-3 w-full">
            {cd.options.map((opt, i) => (
              <Button key={`${cd.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleChoice(i)}
                className="border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-left justify-start text-sm">{opt.text}</Button>
            ))}
          </div>
        )}
        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.impact >= 80 ? 'bg-success/10' : feedback.impact >= 50 ? 'bg-warning/10' : 'bg-error/10'}`}>
            <p className="font-body text-sm text-text-main">{feedback.text}</p>
            <p className="text-xs font-body text-text-light mt-1">Impacto: {feedback.impact >= 80 ? '🌟 Excelente' : feedback.impact >= 50 ? '👍 Bom' : '🤔 Pode melhorar'}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
