'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { generateBinaryChallenge, checkBinaryAnswer, getChallengeCount, calculateBinaryScore, type BinaryChallenge } from './logic';
import { binaryHeroConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function BinaryHeroGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const totalChallenges = getChallengeCount(ageGroup);
  const [challenge, setChallenge] = useState<BinaryChallenge>(() => generateBinaryChallenge(ageGroup));
  const [cIndex, setCIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'playing') return;
    const isCorrect = checkBinaryAnswer(challenge, idx);
    let nc = correct;
    if (isCorrect) { nc = correct + 1; setCorrect(nc); playSound('correct'); setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_CORRECT)} ${challenge.decimal} = ${challenge.binary}`, ok: true }); }
    else { playSound('wrong'); setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} ${challenge.decimal} = ${challenge.binary}`, ok: false }); }
    setPhase('feedback');
    setTimeout(() => {
      if (cIndex + 1 >= totalChallenges) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateBinaryScore(nc, totalChallenges, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setCIndex((i) => i + 1); setChallenge(generateBinaryChallenge(ageGroup)); setFeedback(null); setPhase('playing'); }
    }, 1800);
  }, [phase, challenge, correct, cIndex, totalChallenges, ageGroup, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    setChallenge(generateBinaryChallenge(ageGroup)); setCIndex(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={binaryHeroConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  return (
    <GameShell gameName={binaryHeroConfig.name} gameIcon={binaryHeroConfig.icon} score={correct * 15} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Desafio {cIndex + 1}/{totalChallenges}</p>
        <div className="flex gap-2 justify-center">
          {challenge.binary.split('').map((bit, i) => (
            <div key={i} className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-mono font-bold ${bit === '1' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>{bit}</div>
          ))}
        </div>
        <p className="text-xs font-body text-text-light">= {challenge.decimal} em decimal</p>
        <p className="font-display font-bold text-lg text-text-main text-center">{challenge.question}</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {challenge.options.map((opt, i) => (
            <Button key={`${challenge.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-primary hover:bg-primary/5 font-mono text-lg">{opt}</Button>
          ))}
        </div>
        {feedback && <p className={`text-sm font-body font-semibold text-center px-4 py-2 rounded-xl animate-pop-in ${feedback.ok ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>{feedback.msg}</p>}
      </div>
    </GameShell>
  );
}
