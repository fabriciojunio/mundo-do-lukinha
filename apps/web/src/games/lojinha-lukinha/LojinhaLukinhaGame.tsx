'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { generateShopChallenges, checkChangeAnswer, calculateShopScore, type ShopChallenge } from './logic';
import { lojinhaLukinhaConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function LojinhaLukinhaGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const challenges = useRef<ShopChallenge[]>(generateShopChallenges(ageGroup));
  const [cIdx, setCIdx] = useState(0); const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cc = challenges.current[cIdx]; const total = challenges.current.length;

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'playing' || !cc) return;
    const ok = checkChangeAnswer(cc, idx); let nc = correct;
    if (ok) { nc = correct + 1; setCorrect(nc); playSound('correct'); setFeedback({ msg: getRandomItem(ENCOURAGEMENT_CORRECT), ok: true }); }
    else { playSound('wrong'); setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} O troco certo é R$${cc.correctChange}`, ok: false }); }
    setPhase('feedback');
    setTimeout(() => {
      if (cIdx + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateShopScore(nc, total, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setCIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 1800);
  }, [phase, cc, correct, cIdx, total, onGameEnd]);

  const handlePlayAgain = useCallback(() => { challenges.current = generateShopChallenges(ageGroup); setCIdx(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={lojinhaLukinhaConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cc) return null;

  return (
    <GameShell gameName={lojinhaLukinhaConfig.name} gameIcon={lojinhaLukinhaConfig.icon} score={correct * 12} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Venda {cIdx + 1}/{total}</p>
        <div className="bg-orange-50 rounded-2xl px-6 py-4 text-center w-full">
          <span className="text-5xl block mb-2">{cc.product.emoji}</span>
          <p className="font-display font-bold text-lg">{cc.product.name} — R${cc.product.price}</p>
          <p className="font-body text-text-light">Cliente pagou com R${cc.payment}</p>
        </div>
        <p className="font-display font-bold text-lg text-text-main">Quanto é o troco?</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {cc.options.map((opt, i) => (
            <Button key={`${cc.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-accent hover:bg-accent/5 text-xl font-mono">R${opt}</Button>
          ))}
        </div>
        {feedback && <p className={`text-sm font-body font-semibold text-center px-4 py-2 rounded-xl animate-pop-in ${feedback.ok ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>{feedback.msg}</p>}
      </div>
    </GameShell>
  );
}
