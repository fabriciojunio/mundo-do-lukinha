'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectScenarios, evaluateMoneyChoice, calculateMoneyScore, type MoneyScenario } from './logic';
import { cofrinhoEspertoConfig } from './config';
import { playSound } from '@/lib/sounds';

export function CofrinhoEspertoGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const scenarios = useRef<MoneyScenario[]>(selectScenarios(ageGroup));
  const [sIndex, setSIndex] = useState(0);
  const [totalWisdom, setTotalWisdom] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; wisdom: number } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cs = scenarios.current[sIndex]; const total = scenarios.current.length;
  const maxWisdom = total * 100;

  const handleChoice = useCallback((idx: number) => {
    if (phase !== 'playing' || !cs) return;
    const { wisdom, feedback: fb } = evaluateMoneyChoice(cs, idx);
    setTotalWisdom((t) => t + wisdom);
    playSound(wisdom >= 80 ? 'correct' : wisdom >= 50 ? 'click' : 'wrong');
    setFeedback({ text: fb, wisdom });
    setPhase('feedback');
    setTimeout(() => {
      if (sIndex + 1 >= total) {
        const ts = Math.floor((Date.now() - startTime.current) / 1000);
        const r = calculateMoneyScore(totalWisdom + wisdom, maxWisdom, total, ts);
        setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r);
      } else { setSIndex((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 3000);
  }, [phase, cs, sIndex, total, totalWisdom, maxWisdom, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    scenarios.current = selectScenarios(ageGroup); setSIndex(0); setTotalWisdom(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={cofrinhoEspertoConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cs) return null;

  return (
    <GameShell gameName={cofrinhoEspertoConfig.name} gameIcon={cofrinhoEspertoConfig.icon} score={totalWisdom} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Situação {sIndex + 1}/{total}</p>
        <div className="bg-pink-50 rounded-2xl px-6 py-5 w-full text-center">
          <span className="text-4xl block mb-2">{cs.emoji}</span>
          <p className="font-body text-text-main text-base leading-relaxed">{cs.situation}</p>
        </div>
        {phase === 'playing' && (
          <div className="flex flex-col gap-3 w-full">
            {cs.options.map((opt, i) => (
              <Button key={`${cs.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleChoice(i)}
                className="border border-gray-200 hover:border-pink-400 hover:bg-pink-50 text-left justify-start text-sm">{opt.text}</Button>
            ))}
          </div>
        )}
        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.wisdom >= 80 ? 'bg-success/10' : feedback.wisdom >= 50 ? 'bg-warning/10' : 'bg-error/10'}`}>
            <p className="font-body text-sm text-text-main">{feedback.text}</p>
            <p className="text-xs font-body text-text-light mt-1">💡 Sabedoria: {feedback.wisdom >= 80 ? '⭐⭐⭐ Excelente!' : feedback.wisdom >= 50 ? '⭐⭐ Bom' : '⭐ Pode melhorar'}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
