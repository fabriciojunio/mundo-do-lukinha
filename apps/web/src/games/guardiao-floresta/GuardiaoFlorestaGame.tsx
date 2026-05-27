'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectScenarios, evaluateEcoChoice, calculateEcoScore, type EcoScenario } from './logic';
import { guardiaoFlorestaConfig } from './config';
import { playSound } from '@/lib/sounds';

export function GuardiaoFlorestaGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const scenarios = useRef<EcoScenario[]>(selectScenarios(ageGroup));
  const [sIdx, setSIdx] = useState(0); const [totalImpact, setTotalImpact] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; impact: number } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cs = scenarios.current[sIdx]; const total = scenarios.current.length; const maxImpact = total * 100;

  const handleChoice = useCallback((idx: number) => {
    if (phase !== 'playing' || !cs) return;
    const { ecoImpact, feedback: fb } = evaluateEcoChoice(cs, idx);
    setTotalImpact((t) => t + ecoImpact);
    playSound(ecoImpact >= 80 ? 'correct' : ecoImpact >= 40 ? 'click' : 'wrong');
    setFeedback({ text: fb, impact: ecoImpact });
    setPhase('feedback');
    setTimeout(() => {
      if (sIdx + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateEcoScore(totalImpact + ecoImpact, maxImpact, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setSIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 3000);
  }, [phase, cs, sIdx, total, totalImpact, maxImpact, onGameEnd]);

  const handlePlayAgain = useCallback(() => { scenarios.current = selectScenarios(ageGroup); setSIdx(0); setTotalImpact(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={guardiaoFlorestaConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cs) return null;

  return (
    <GameShell gameName={guardiaoFlorestaConfig.name} gameIcon={guardiaoFlorestaConfig.icon} score={totalImpact} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-2"><span className="text-xs font-body text-text-light">Missão {sIdx + 1}/{total}</span><span className="px-2 py-0.5 bg-nature/15 text-nature text-xs font-bold rounded-full">{cs.topic}</span></div>
        <div className="bg-green-50 rounded-2xl px-6 py-5 w-full text-center"><span className="text-4xl block mb-2">{cs.emoji}</span><p className="font-body text-text-main text-base">{cs.situation}</p></div>
        {phase === 'playing' && (<div className="flex flex-col gap-3 w-full">{cs.options.map((opt, i) => (
          <Button key={`${cs.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleChoice(i)} className="border border-gray-200 hover:border-nature hover:bg-green-50 text-left justify-start text-sm">{opt.text}</Button>
        ))}</div>)}
        {feedback && (<div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.impact >= 80 ? 'bg-success/10' : feedback.impact >= 40 ? 'bg-warning/10' : 'bg-error/10'}`}>
          <p className="font-body text-sm text-text-main">{feedback.text}</p><p className="text-xs text-text-light mt-1">🌍 Impacto: {feedback.impact >= 80 ? '🌟 Excelente!' : feedback.impact >= 40 ? '👍 Bom' : '🤔 Pode melhorar'}</p>
        </div>)}
      </div>
    </GameShell>
  );
}
