'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { roboticaVirtualConfig, selectChallenges, checkRobotAnswer, calculateRobotScore, type RobotChallenge } from './logic';
import { playSound } from '@/lib/sounds';

export function RoboticaVirtualGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const challenges = useRef<RobotChallenge[]>(selectChallenges(ageGroup));
  const [cIdx, setCIdx] = useState(0); const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean; exp: string } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cc = challenges.current[cIdx]; const total = challenges.current.length;

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'playing' || !cc) return;
    const ok = checkRobotAnswer(cc, idx); let nc = correct;
    if (ok) { nc = correct + 1; setCorrect(nc); playSound('correct'); setFeedback({ msg: 'Correto! 🦾', ok: true, exp: cc.explanation }); }
    else { playSound('wrong'); setFeedback({ msg: `Resposta: ${cc.options[cc.correctIndex]}`, ok: false, exp: cc.explanation }); }
    setPhase('feedback');
    setTimeout(() => {
      if (cIdx + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateRobotScore(nc, total, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setCIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 2500);
  }, [phase, cc, correct, cIdx, total, onGameEnd]);

  const handlePlayAgain = useCallback(() => { challenges.current = selectChallenges(ageGroup); setCIdx(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={roboticaVirtualConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cc) return null;

  return (
    <GameShell gameName={roboticaVirtualConfig.name} gameIcon={roboticaVirtualConfig.icon} score={correct * 18} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-2"><span className="text-xs font-body text-text-light">Desafio {cIdx + 1}/{total}</span><span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-full">{cc.topic}</span></div>
        <div className="bg-cyan-50 rounded-2xl px-6 py-4 text-center w-full"><span className="text-4xl block mb-2">{cc.emoji}</span></div>
        <p className="font-display font-bold text-lg text-text-main text-center">{cc.question}</p>
        <div className="flex flex-col gap-3 w-full">
          {cc.options.map((opt, i) => (
            <Button key={`${cc.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-cyan-500 hover:bg-cyan-50 text-left justify-start text-sm">{opt}</Button>
          ))}
        </div>
        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.ok ? 'bg-success/10' : 'bg-error/10'}`}>
            <p className={`font-body font-semibold text-sm ${feedback.ok ? 'text-success' : 'text-error'}`}>{feedback.msg}</p>
            <p className="text-xs font-body text-text-light mt-1">🦾 {feedback.exp}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}

import type { GameRegistryEntry } from '@/types/game';
export const roboticaVirtualGame: GameRegistryEntry = { config: roboticaVirtualConfig, Component: RoboticaVirtualGame };
