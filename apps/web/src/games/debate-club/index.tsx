'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { debateClubConfig, selectTopics, evaluateDebateChoice, calculateDebateScore, type DebateTopic } from './logic';
import { playSound } from '@/lib/sounds';

export function DebateClubGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const topics = useRef<DebateTopic[]>(selectTopics(ageGroup));
  const [tIdx, setTIdx] = useState(0); const [totalQuality, setTotalQuality] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; quality: number; type: string } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const ct = topics.current[tIdx]; const total = topics.current.length;
  const maxQuality = total * 100;

  const handleChoice = useCallback((idx: number) => {
    if (phase !== 'playing' || !ct) return;
    const { quality, feedback: fb, type } = evaluateDebateChoice(ct, idx);
    setTotalQuality((t) => t + quality);
    playSound(quality >= 80 ? 'correct' : quality >= 30 ? 'click' : 'wrong');
    setFeedback({ text: fb, quality, type });
    setPhase('feedback');
    setTimeout(() => {
      if (tIdx + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateDebateScore(totalQuality + quality, maxQuality, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setTIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 3500);
  }, [phase, ct, tIdx, total, totalQuality, maxQuality, onGameEnd]);

  const handlePlayAgain = useCallback(() => { topics.current = selectTopics(ageGroup); setTIdx(0); setTotalQuality(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={debateClubConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!ct) return null;

  return (
    <GameShell gameName={debateClubConfig.name} gameIcon={debateClubConfig.icon} score={totalQuality} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Debate {tIdx + 1}/{total}</p>
        <div className="bg-red-50 rounded-2xl px-6 py-5 w-full text-center">
          <span className="text-4xl block mb-2">{ct.emoji}</span>
          <p className="font-display font-bold text-lg text-text-main">{ct.topic}</p>
          <p className="text-sm font-body text-text-light mt-2">{ct.context}</p>
        </div>
        <p className="font-display font-bold text-base text-text-main text-center">Qual argumento é mais forte?</p>
        {phase === 'playing' && (
          <div className="flex flex-col gap-3 w-full">
            {ct.arguments.map((arg, i) => (
              <Button key={`${ct.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleChoice(i)}
                className="border border-gray-200 hover:border-red-400 hover:bg-red-50 text-left justify-start text-sm">{arg.text}</Button>
            ))}
          </div>
        )}
        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.quality >= 80 ? 'bg-success/10' : feedback.quality >= 30 ? 'bg-warning/10' : 'bg-error/10'}`}>
            <p className="font-body text-sm text-text-main">{feedback.text}</p>
            <p className="text-xs font-body text-text-light mt-1">
              {feedback.type === 'strong' ? '💪 Argumento forte!' : feedback.type === 'fallacy' ? '⚠️ Isso é uma falácia!' : '🤔 Argumento fraco'}
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
}

import type { GameRegistryEntry } from '@/types/game';
export const debateClubGame: GameRegistryEntry = { config: debateClubConfig, Component: DebateClubGame };
