'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectMissions, checkMissionAnswer, calculateMissionScore, type MissionChallenge } from './logic';
import { missoesConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function MissoesDoDiaGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const missions = useRef<MissionChallenge[]>(selectMissions(ageGroup));
  const [mIdx, setMIdx] = useState(0); const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cm = missions.current[mIdx]; const total = missions.current.length;

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== 'playing' || !cm) return;
    const ok = checkMissionAnswer(cm, idx); let nc = correct;
    if (ok) { nc = correct + 1; setCorrect(nc); playSound('correct'); setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_CORRECT)} ${cm.explanation}`, ok: true }); }
    else { playSound('wrong'); setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} ${cm.explanation}`, ok: false }); }
    setPhase('feedback');
    setTimeout(() => {
      if (mIdx + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateMissionScore(nc, total, ts); setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r); }
      else { setMIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 2500);
  }, [phase, cm, correct, mIdx, total, onGameEnd]);

  const handlePlayAgain = useCallback(() => { missions.current = selectMissions(ageGroup); setMIdx(0); setCorrect(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={missoesConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cm) return null;

  return (
    <GameShell gameName={missoesConfig.name} gameIcon={missoesConfig.icon} score={correct * 15} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Missão {mIdx + 1}/{total}</p>
        <div className="bg-blue-50 rounded-2xl px-6 py-4 w-full text-center">
          <p className="font-display font-bold text-lg text-text-main">{cm.question}</p>
        </div>
        {phase === 'playing' && (<div className="flex flex-col gap-3 w-full">{cm.options.map((opt, i) => (
          <Button key={`${cm.id}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)}
            className="border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-left justify-start text-sm">{opt.join(' → ')}</Button>
        ))}</div>)}
        {feedback && (<div className={`w-full animate-pop-in rounded-xl p-4 ${feedback.ok ? 'bg-success/10' : 'bg-error/10'}`}>
          <p className={`font-body font-semibold text-sm ${feedback.ok ? 'text-success' : 'text-error'}`}>{feedback.msg}</p></div>)}
      </div>
    </GameShell>
  );
}
