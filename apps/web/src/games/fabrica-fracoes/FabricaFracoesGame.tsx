'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import {
  generateChallenge,
  checkFractionAnswer,
  getChallengeCount,
  calculateFractionScore,
  type FractionChallenge,
} from './logic';
import { fabricaFracoesConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

function FractionVisual({ numerator, denominator, visual }: { numerator: number; denominator: number; visual: string }) {
  if (visual === 'pizza') {
    const sliceAngle = 360 / denominator;
    return (
      <div className="relative w-40 h-40 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {Array.from({ length: denominator }).map((_, i) => {
            const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
            const x1 = 50 + 45 * Math.cos(startAngle);
            const y1 = 50 + 45 * Math.sin(startAngle);
            const x2 = 50 + 45 * Math.cos(endAngle);
            const y2 = 50 + 45 * Math.sin(endAngle);
            const largeArc = sliceAngle > 180 ? 1 : 0;
            const filled = i < numerator;
            return (
              <path
                key={i}
                d={`M50,50 L${x1},${y1} A45,45 0 ${largeArc},1 ${x2},${y2} Z`}
                fill={filled ? '#F97316' : '#e5e7eb'}
                stroke="white"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  // Bar/chocolate visual
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: denominator }).map((_, i) => (
        <div
          key={i}
          className={`h-16 rounded-lg border-2 border-white shadow-sm ${
            i < numerator
              ? visual === 'chocolate' ? 'bg-amber-800' : 'bg-primary'
              : 'bg-gray-200'
          }`}
          style={{ width: `${Math.max(24, 200 / denominator)}px` }}
        />
      ))}
    </div>
  );
}

export function FabricaFracoesGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const totalChallenges = getChallengeCount(ageGroup);
  const [challenge, setChallenge] = useState<FractionChallenge>(() => generateChallenge(ageGroup));
  const [cIndex, setCIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (phase !== 'playing') return;
      const isCorrect = checkFractionAnswer(challenge, selectedIndex);
      let newCorrect = correct;

      if (isCorrect) {
        newCorrect = correct + 1;
        setCorrect(newCorrect);
        playSound('correct');
        setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_CORRECT)} ${challenge.explanation}`, ok: true });
      } else {
        playSound('wrong');
        setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} ${challenge.explanation}`, ok: false });
      }

      setPhase('feedback');
      setTimeout(() => {
        if (cIndex + 1 >= totalChallenges) {
          const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
          const gameResult = calculateFractionScore(newCorrect, cIndex + 1, timeSpent);
          setResult(gameResult);
          setPhase('finished');
          playSound('gameOver');
          onGameEnd(gameResult);
        } else {
          setCIndex((i) => i + 1);
          setChallenge(generateChallenge(ageGroup));
          setFeedback(null);
          setPhase('playing');
        }
      }, 2000);
    },
    [phase, challenge, correct, cIndex, totalChallenges, ageGroup, onGameEnd],
  );

  const handlePlayAgain = useCallback(() => {
    setChallenge(generateChallenge(ageGroup));
    setCIndex(0);
    setCorrect(0);
    setFeedback(null);
    setPhase('playing');
    setResult(null);
    startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) {
    return (
      <GameOverScreen result={result} gameName={fabricaFracoesConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />
    );
  }

  return (
    <GameShell gameName={fabricaFracoesConfig.name} gameIcon={fabricaFracoesConfig.icon} score={correct * 15} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <p className="text-sm font-body text-text-light">
          Desafio {cIndex + 1}/{totalChallenges}
        </p>

        <FractionVisual numerator={challenge.numerator} denominator={challenge.denominator} visual={challenge.visual} />

        <p className="font-display font-bold text-xl text-text-main text-center">{challenge.displayText}</p>

        {feedback && (
          <p className={`text-sm font-body font-semibold text-center px-4 py-2 rounded-xl animate-pop-in ${feedback.ok ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>
            {feedback.msg}
          </p>
        )}

        <div className="flex flex-col gap-3 w-full max-w-sm">
          {challenge.options.map((opt, i) => (
            <Button
              key={`${challenge.id}-${i}`}
              variant={phase === 'playing' ? 'ghost' : 'ghost'}
              size="lg"
              fullWidth
              onClick={() => handleAnswer(i)}
              disabled={phase !== 'playing'}
              className="border border-gray-200 hover:border-accent hover:bg-accent/5 text-left justify-start"
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
