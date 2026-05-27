'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { createPet, feedPet, restPet, teachPet, getMoodEmoji, selectChallenges, checkTeachingAnswer, calculateAIPetScore, type PetState, type TeachingChallenge } from './logic';
import { aiPetConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

type Phase = 'care' | 'teaching' | 'feedback' | 'finished';

export function AIPetGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const challenges = useRef<TeachingChallenge[]>(selectChallenges(ageGroup));
  const [pet, setPet] = useState<PetState>(() => createPet('Bit'));
  const [phase, setPhase] = useState<Phase>('care');
  const [cIndex, setCIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean; explanation: string } | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const currentChallenge = challenges.current[cIndex];
  const totalChallenges = challenges.current.length;

  const handleFeed = useCallback(() => { setPet((p) => feedPet(p)); playSound('coin'); }, []);
  const handleRest = useCallback(() => { setPet((p) => restPet(p)); playSound('whoosh'); }, []);
  const startTeaching = useCallback(() => { setPhase('teaching'); playSound('gameStart'); }, []);

  const handleTeachAnswer = useCallback((idx: number) => {
    if (phase !== 'teaching' || !currentChallenge) return;
    const isCorrect = checkTeachingAnswer(currentChallenge, idx);
    let nc = correct;
    if (isCorrect) {
      nc = correct + 1; setCorrect(nc); playSound('correct');
      setPet((p) => teachPet(p, currentChallenge.patternName));
      setFeedback({ msg: getRandomItem(ENCOURAGEMENT_CORRECT), ok: true, explanation: currentChallenge.explanation });
    } else {
      playSound('wrong');
      setFeedback({ msg: getRandomItem(ENCOURAGEMENT_WRONG), ok: false, explanation: currentChallenge.explanation });
    }
    setPhase('feedback');
    setTimeout(() => {
      if (cIndex + 1 >= totalChallenges) {
        const ts = Math.floor((Date.now() - startTime.current) / 1000);
        const r = calculateAIPetScore(nc, totalChallenges, pet.level, ts);
        setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r);
      } else { setCIndex((i) => i + 1); setFeedback(null); setPhase('teaching'); }
    }, 2500);
  }, [phase, currentChallenge, correct, cIndex, totalChallenges, pet.level, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    challenges.current = selectChallenges(ageGroup);
    setPet(createPet('Bit')); setPhase('care'); setCIndex(0); setCorrect(0); setFeedback(null); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={aiPetConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  return (
    <GameShell gameName={aiPetConfig.name} gameIcon={aiPetConfig.icon} score={correct * 15 + pet.level * 10} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 max-w-md mx-auto">
        {/* Pet display */}
        <div className="text-center bg-gradient-to-b from-purple-50 to-white rounded-2xl p-6 w-full">
          <span className="text-6xl block">{pet.emoji}</span>
          <span className="text-2xl">{getMoodEmoji(pet.mood)}</span>
          <p className="font-display font-bold text-lg text-text-main mt-1">{pet.name} (Nível {pet.level})</p>
          <p className="text-xs font-body text-text-light">Padrões aprendidos: {pet.learnedPatterns.length}</p>
          <div className="flex flex-col gap-2 mt-3">
            <ProgressBar value={pet.hunger} max={100} color="bg-accent" height="sm" label="🍔 Fome" showLabel />
            <ProgressBar value={pet.energy} max={100} color="bg-primary" height="sm" label="⚡ Energia" showLabel />
            <ProgressBar value={pet.knowledge} max={100} color="bg-secondary" height="sm" label="🧠 Conhecimento" showLabel />
          </div>
        </div>

        {phase === 'care' && (
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-body text-text-light text-center">Cuide do Bit antes de ensiná-lo!</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="md" onClick={handleFeed} fullWidth className="border border-gray-200">🍔 Alimentar</Button>
              <Button variant="ghost" size="md" onClick={handleRest} fullWidth className="border border-gray-200">😴 Descansar</Button>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={startTeaching} disabled={pet.energy < 20 || pet.hunger < 20}>
              🧠 Ensinar o Bit!
            </Button>
            {(pet.energy < 20 || pet.hunger < 20) && <p className="text-xs text-warning text-center">Cuide do Bit primeiro!</p>}
          </div>
        )}

        {(phase === 'teaching' || phase === 'feedback') && currentChallenge && (
          <div className="w-full">
            <p className="text-xs font-body text-text-light text-center mb-2">Lição {cIndex + 1}/{totalChallenges}</p>
            <p className="font-display font-bold text-base text-text-main text-center mb-3">{currentChallenge.question}</p>
            <div className="flex flex-col gap-2">
              {currentChallenge.options.map((opt, i) => (
                <Button key={`${currentChallenge.id}-${i}`} variant="ghost" size="md" fullWidth onClick={() => handleTeachAnswer(i)} disabled={phase !== 'teaching'}
                  className="border border-gray-200 hover:border-secondary hover:bg-secondary/5 text-left justify-start text-sm">{opt}</Button>
              ))}
            </div>
            {feedback && (
              <div className={`mt-3 animate-pop-in rounded-xl p-3 ${feedback.ok ? 'bg-success/10' : 'bg-error/10'}`}>
                <p className={`font-body font-semibold text-xs ${feedback.ok ? 'text-success' : 'text-error'}`}>{feedback.msg}</p>
                <p className="text-xs font-body text-text-light mt-1">🤖 {feedback.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
}
