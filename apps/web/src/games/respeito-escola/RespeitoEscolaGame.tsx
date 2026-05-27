'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectScenarios, evaluateRespectChoice, calculateRespectScore, type RespectScenario } from './logic';
import { respeitoEscolaConfig } from './config';
import { playSound } from '@/lib/sounds';

export function RespeitoEscolaGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const scenarios = useRef<RespectScenario[]>(selectScenarios(ageGroup));
  const [sIdx, setSIdx] = useState(0); const [totalRespect, setTotalRespect] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; respect: number } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cs = scenarios.current[sIdx]; const total = scenarios.current.length; const maxRespect = total * 100;

  const handleChoice = useCallback((idx: number) => {
    if (phase !== 'playing' || !cs) return;
    const { respect, feedback: fb } = evaluateRespectChoice(cs, idx);
    setTotalRespect((t) => t + respect);
    playSound(respect >= 80 ? 'correct' : respect >= 30 ? 'click' : 'wrong');
    setFeedback({ text: fb, respect });
    setPhase('feedback');
    setTimeout(() => {
      if (sIdx + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateRespectScore(totalRespect + respect, maxRespect, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setSIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 3000);
  }, [phase, cs, sIdx, total, totalRespect, maxRespect, onGameEnd]);

  const handlePlayAgain = useCallback(() => { scenarios.current = selectScenarios(ageGroup); setSIdx(0); setTotalRespect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={respeitoEscolaConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cs) return null;

  return (
    <GameShell gameName={respeitoEscolaConfig.name} gameIcon={respeitoEscolaConfig.icon} score={totalRespect} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-2"><span className="text-xs font-body text-text-light">Situação {sIdx + 1}/{total}</span><span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">{cs.theme}</span></div>
        <div className="bg-indigo-50 rounded-2xl px-6 py-5 w-full text-center"><span className="text-4xl block mb-2">{cs.emoji}</span><p className="font-body text-text-main text-base">{cs.situation}</p></div>
        {phase === 'playing' && (<div className="flex flex-col gap-3 w-full"><p className="font-display font-bold text-base text-text-main text-center">Como você responde?</p>
          {cs.responses.map((r, i) => (<Button key={`${cs.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleChoice(i)} className="border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-left justify-start text-sm">{r.text}</Button>))}
        </div>)}
        {feedback && (<div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.respect >= 80 ? 'bg-success/10' : feedback.respect >= 30 ? 'bg-warning/10' : 'bg-error/10'}`}>
          <p className="font-body text-sm text-text-main">{feedback.text}</p></div>)}
      </div>
    </GameShell>
  );
}
