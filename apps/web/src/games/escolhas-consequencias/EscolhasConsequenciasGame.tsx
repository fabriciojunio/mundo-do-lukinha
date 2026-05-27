'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectStories, evaluateStoryChoice, calculateStoryScore, type StoryScenario } from './logic';
import { escolhasConsequenciasConfig } from './config';
import { playSound } from '@/lib/sounds';

export function EscolhasConsequenciasGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const stories = useRef<StoryScenario[]>(selectStories(ageGroup));
  const [sIdx, setSIdx] = useState(0); const [totalKindness, setTotalKindness] = useState(0);
  const [feedback, setFeedback] = useState<{ consequence: string; kindness: number; emoji: string } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cs = stories.current[sIdx]; const total = stories.current.length;
  const maxKindness = total * 100;

  const handleChoice = useCallback((idx: number) => {
    if (phase !== 'playing' || !cs) return;
    const { kindness, consequence, emoji } = evaluateStoryChoice(cs, idx);
    setTotalKindness((t) => t + kindness);
    playSound(kindness >= 80 ? 'correct' : kindness >= 40 ? 'click' : 'wrong');
    setFeedback({ consequence, kindness, emoji });
    setPhase('feedback');
    setTimeout(() => {
      if (sIdx + 1 >= total) {
        const ts = Math.floor((Date.now() - startTime.current) / 1000);
        const r = calculateStoryScore(totalKindness + kindness, maxKindness, total, ts);
        setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r);
      } else { setSIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 3500);
  }, [phase, cs, sIdx, total, totalKindness, maxKindness, onGameEnd]);

  const handlePlayAgain = useCallback(() => { stories.current = selectStories(ageGroup); setSIdx(0); setTotalKindness(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={escolhasConsequenciasConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cs) return null;

  return (
    <GameShell gameName={escolhasConsequenciasConfig.name} gameIcon={escolhasConsequenciasConfig.icon} score={totalKindness} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-body text-text-light">História {sIdx + 1}/{total}</span>
          <span className="px-2 py-0.5 bg-secondary/15 text-secondary text-xs font-body font-bold rounded-full">{cs.theme}</span>
        </div>
        <div className="bg-violet-50 rounded-2xl px-6 py-5 w-full text-center">
          <span className="text-4xl block mb-2">{cs.emoji}</span>
          <p className="font-body text-text-main text-base leading-relaxed">{cs.story}</p>
        </div>
        {phase === 'playing' && (
          <div className="flex flex-col gap-3 w-full">
            <p className="font-display font-bold text-base text-text-main text-center">O que você faz?</p>
            {cs.choices.map((choice, i) => (
              <Button key={`${cs.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleChoice(i)}
                className="border border-gray-200 hover:border-violet-400 hover:bg-violet-50 text-left justify-start text-sm">{choice.text}</Button>
            ))}
          </div>
        )}
        {feedback && (
          <div className={`w-full animate-pop-in rounded-2xl p-5 ${feedback.kindness >= 80 ? 'bg-success/10 border border-success/20' : feedback.kindness >= 40 ? 'bg-warning/10 border border-warning/20' : 'bg-error/10 border border-error/20'}`}>
            <span className="text-3xl block text-center mb-2">{feedback.emoji}</span>
            <p className="font-body text-sm text-text-main text-center">{feedback.consequence}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
