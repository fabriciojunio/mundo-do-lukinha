'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectChallenges, checkEmotionAnswer, getEmotionByName, calculateEmotionScore, type EmotionChallenge } from './logic';
import { diarioEmocoesConfig } from './config';
import { playSound } from '@/lib/sounds';

export function DiarioEmocoesGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const challenges = useRef<EmotionChallenge[]>(selectChallenges(ageGroup));
  const [cIdx, setCIdx] = useState(0); const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean; tip: string } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cc = challenges.current[cIdx]; const total = challenges.current.length;

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'playing' || !cc) return;
    const ok = checkEmotionAnswer(cc, idx); let nc = correct;
    if (ok) { nc = correct + 1; setCorrect(nc); playSound('correct'); setFeedback({ msg: 'Isso mesmo! Você entende bem as emoções! 💖', ok: true, tip: cc.tip }); }
    else { playSound('wrong'); setFeedback({ msg: `A emoção certa era: ${cc.correctEmotion} ${getEmotionByName(cc.correctEmotion)?.emoji ?? ''}`, ok: false, tip: cc.tip }); }
    setPhase('feedback');
    setTimeout(() => {
      if (cIdx + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateEmotionScore(nc, total, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setCIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 2500);
  }, [phase, cc, correct, cIdx, total, onGameEnd]);

  const handlePlayAgain = useCallback(() => { challenges.current = selectChallenges(ageGroup); setCIdx(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={diarioEmocoesConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cc) return null;

  return (
    <GameShell gameName={diarioEmocoesConfig.name} gameIcon={diarioEmocoesConfig.icon} score={correct * 15} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Situação {cIdx + 1}/{total}</p>
        <div className="bg-pink-50 rounded-2xl px-6 py-5 w-full text-center">
          <span className="text-4xl block mb-2">{cc.emoji}</span>
          <p className="font-body text-text-main text-base leading-relaxed">{cc.scenario}</p>
        </div>
        <p className="font-display font-bold text-lg text-text-main">Como essa pessoa se sente?</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {cc.options.map((opt, i) => { const em = getEmotionByName(opt); return (
            <Button key={`${cc.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-pink-400 hover:bg-pink-50 flex-col gap-1 py-3">
              <span className="text-2xl">{em?.emoji ?? '❓'}</span><span className="text-sm">{opt}</span>
            </Button>
          ); })}
        </div>
        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.ok ? 'bg-success/10' : 'bg-error/10'}`}>
            <p className={`font-body font-semibold text-sm ${feedback.ok ? 'text-success' : 'text-error'}`}>{feedback.msg}</p>
            <p className="text-xs font-body text-text-light mt-1">💡 {feedback.tip}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
