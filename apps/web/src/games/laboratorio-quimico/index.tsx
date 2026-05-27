'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { laboratorioQuimicoConfig, ELEMENTS, generateChemChallenges, checkChemAnswer, calculateChemScore, type ChemChallenge } from './logic';
import { playSound } from '@/lib/sounds';

export function LaboratorioQuimicoGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const challenges = useRef<ChemChallenge[]>(generateChemChallenges(ageGroup));
  const [cIdx, setCIdx] = useState(0); const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean; explanation: string } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cc = challenges.current[cIdx]; const total = challenges.current.length;

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'playing' || !cc) return;
    const ok = checkChemAnswer(cc, idx); let nc = correct;
    if (ok) { nc = correct + 1; setCorrect(nc); playSound('correct'); setFeedback({ msg: `${cc.reaction.resultEmoji} Correto!`, ok: true, explanation: cc.reaction.explanation }); }
    else { playSound('wrong'); setFeedback({ msg: `Resultado: ${cc.reaction.result}`, ok: false, explanation: cc.reaction.explanation }); }
    setPhase('feedback');
    setTimeout(() => {
      if (cIdx + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateChemScore(nc, total, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setCIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 3000);
  }, [phase, cc, correct, cIdx, total, onGameEnd]);

  const handlePlayAgain = useCallback(() => { challenges.current = generateChemChallenges(ageGroup); setCIdx(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={laboratorioQuimicoConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cc) return null;

  const el1 = ELEMENTS.find((e) => e.symbol === cc.reaction.elements[0]);
  const el2 = ELEMENTS.find((e) => e.symbol === cc.reaction.elements[1]);

  return (
    <GameShell gameName={laboratorioQuimicoConfig.name} gameIcon={laboratorioQuimicoConfig.icon} score={correct * 20} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Experimento {cIdx + 1}/{total}</p>
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-xl flex flex-col items-center justify-center text-2xl" style={{ backgroundColor: el1?.color ?? '#eee' }}>
            {el1?.emoji}<span className="text-xs font-mono font-bold mt-1">{el1?.symbol}</span>
          </div>
          <span className="text-3xl font-bold text-text-main">+</span>
          <div className="w-20 h-20 rounded-xl flex flex-col items-center justify-center text-2xl" style={{ backgroundColor: el2?.color ?? '#eee' }}>
            {el2?.emoji}<span className="text-xs font-mono font-bold mt-1">{el2?.symbol}</span>
          </div>
          <span className="text-3xl font-bold text-text-main">=</span>
          <span className="text-4xl">❓</span>
        </div>
        <p className="font-display font-bold text-base text-text-main text-center">{cc.question}</p>
        <div className="flex flex-col gap-2 w-full">
          {cc.options.map((opt, i) => (
            <Button key={`${cc.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-violet-400 hover:bg-violet-50 text-left justify-start text-sm">{opt}</Button>
          ))}
        </div>
        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.ok ? 'bg-success/10' : 'bg-error/10'}`}>
            <p className={`font-body font-semibold text-sm ${feedback.ok ? 'text-success' : 'text-error'}`}>{feedback.msg}</p>
            <p className="text-xs font-body text-text-light mt-1">🧪 {feedback.explanation}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}

import type { GameRegistryEntry } from '@/types/game';
export const laboratorioQuimicoGame: GameRegistryEntry = { config: laboratorioQuimicoConfig, Component: LaboratorioQuimicoGame };
