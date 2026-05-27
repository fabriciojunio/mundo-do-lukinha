'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { createVirtualPet, selectChallenges, evaluateCareChoice, applyEffects, calculateCareScore, type PetVirtual, type CareChallenge } from './logic';
import { cuidaBichinhoConfig } from './config';
import { playSound } from '@/lib/sounds';

const PET_OPTIONS = ['🐶', '🐱', '🐰', '🐹', '🐻', '🐼'];

export function CuidaBichinhoGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const [petEmoji] = useState(() => PET_OPTIONS[Math.floor(Math.random() * PET_OPTIONS.length)] ?? '🐶');
  const [pet, setPet] = useState<PetVirtual>(() => createVirtualPet(petEmoji));
  const challenges = useRef<CareChallenge[]>(selectChallenges(ageGroup));
  const [cIdx, setCIdx] = useState(0); const [totalWisdom, setTotalWisdom] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; wisdom: number } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cc = challenges.current[cIdx]; const total = challenges.current.length;
  const maxWisdom = total * 100;

  const handleChoice = useCallback((idx: number) => {
    if (phase !== 'playing' || !cc) return;
    const { wisdom, feedback: fb, effects } = evaluateCareChoice(cc, idx);
    setPet((p) => applyEffects(p, effects));
    setTotalWisdom((t) => t + wisdom);
    playSound(wisdom >= 80 ? 'correct' : wisdom >= 40 ? 'click' : 'wrong');
    setFeedback({ text: fb, wisdom });
    setPhase('feedback');
    setTimeout(() => {
      if (cIdx + 1 >= total) {
        const ts = Math.floor((Date.now() - startTime.current) / 1000);
        const r = calculateCareScore(totalWisdom + wisdom, maxWisdom, ts);
        setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r);
      } else { setCIdx((i) => i + 1); setFeedback(null); setPhase('playing'); }
    }, 2500);
  }, [phase, cc, cIdx, total, totalWisdom, maxWisdom, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    setPet(createVirtualPet(petEmoji)); challenges.current = selectChallenges(ageGroup);
    setCIdx(0); setTotalWisdom(0); setFeedback(null); setPhase('playing'); setResult(null); startTime.current = Date.now();
  }, [ageGroup, petEmoji]);

  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={cuidaBichinhoConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cc) return null;

  return (
    <GameShell gameName={cuidaBichinhoConfig.name} gameIcon={cuidaBichinhoConfig.icon} score={totalWisdom} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 max-w-lg mx-auto">
        <div className="bg-amber-50 rounded-2xl p-4 w-full text-center">
          <span className="text-5xl block">{pet.emoji}</span>
          <p className="font-display font-bold text-sm mt-1">{pet.name}</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <ProgressBar value={pet.happiness} max={100} color="bg-sun" height="sm" label="😊 Felicidade" />
            <ProgressBar value={pet.health} max={100} color="bg-success" height="sm" label="❤️ Saúde" />
            <ProgressBar value={pet.energy} max={100} color="bg-primary" height="sm" label="⚡ Energia" />
            <ProgressBar value={pet.hygiene} max={100} color="bg-sky-400" height="sm" label="🧼 Higiene" />
          </div>
        </div>
        <p className="text-sm font-body text-text-light">Situação {cIdx + 1}/{total}</p>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 w-full text-center">
          <span className="text-2xl">{cc.emoji}</span>
          <p className="font-body text-text-main text-sm mt-2">{cc.situation}</p>
        </div>
        {phase === 'playing' && (
          <div className="flex flex-col gap-2 w-full">
            {cc.options.map((opt, i) => (
              <Button key={`${cc.id}-${i}`} variant="ghost" size="md" fullWidth onClick={() => handleChoice(i)}
                className="border border-gray-200 hover:border-amber-400 hover:bg-amber-50 text-left justify-start text-sm">{opt.text}</Button>
            ))}
          </div>
        )}
        {feedback && (
          <div className={`w-full animate-pop-in rounded-xl p-3 ${feedback.wisdom >= 80 ? 'bg-success/10' : feedback.wisdom >= 40 ? 'bg-warning/10' : 'bg-error/10'}`}>
            <p className="font-body text-sm text-text-main">{feedback.text}</p>
          </div>
        )}
      </div>
    </GameShell>
  );
}
