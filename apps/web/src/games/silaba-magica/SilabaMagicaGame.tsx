'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import {
  generateChallenge,
  checkSplitAnswer,
  checkBuildAnswer,
  getChallengeCountForAge,
  calculateSyllableScore,
  type SyllableChallenge,
} from './logic';
import { silabaMagicaConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function SilabaMagicaGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const totalChallenges = getChallengeCountForAge(ageGroup);
  const [challenge, setChallenge] = useState<SyllableChallenge>(() => generateChallenge(ageGroup));
  const [cIndex, setCIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [result, setResult] = useState<GameResult | null>(null);
  const [buildOrder, setBuildOrder] = useState<string[]>([]);
  const startTime = useRef(Date.now());

  const advance = useCallback(
    (newCorrect: number, newIndex: number) => {
      setTimeout(() => {
        if (newIndex + 1 >= totalChallenges) {
          const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
          const gameResult = calculateSyllableScore(newCorrect, newIndex + 1, timeSpent);
          setResult(gameResult);
          setPhase('finished');
          playSound('gameOver');
          onGameEnd(gameResult);
        } else {
          setCIndex(newIndex + 1);
          setChallenge(generateChallenge(ageGroup));
          setFeedback(null);
          setBuildOrder([]);
          setPhase('playing');
        }
      }, 1500);
    },
    [totalChallenges, ageGroup, onGameEnd],
  );

  const handleSplitAnswer = useCallback(
    (selected: string) => {
      if (phase !== 'playing') return;
      const isCorrect = checkSplitAnswer(challenge, selected);
      let newCorrect = correct;

      if (isCorrect) {
        newCorrect = correct + 1;
        setCorrect(newCorrect);
        playSound('correct');
        setFeedback({ msg: getRandomItem(ENCOURAGEMENT_CORRECT), ok: true });
      } else {
        playSound('wrong');
        setFeedback({
          msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} A resposta é: ${challenge.word.syllables.join('-')}`,
          ok: false,
        });
      }

      setPhase('feedback');
      advance(newCorrect, cIndex);
    },
    [phase, challenge, correct, cIndex, advance],
  );

  const handleBuildSyllableClick = useCallback(
    (syllable: string, index: number) => {
      if (phase !== 'playing') return;
      const newOrder = [...buildOrder, syllable];
      setBuildOrder(newOrder);
      playSound('click');

      if (newOrder.length === challenge.word.syllables.length) {
        const isCorrect = checkBuildAnswer(newOrder, challenge.word);
        let newCorrect = correct;

        if (isCorrect) {
          newCorrect = correct + 1;
          setCorrect(newCorrect);
          playSound('correct');
          setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_CORRECT)} ${challenge.word.word}! 🎉`, ok: true });
        } else {
          playSound('wrong');
          setFeedback({
            msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} A palavra é: ${challenge.word.word}`,
            ok: false,
          });
        }

        setPhase('feedback');
        advance(newCorrect, cIndex);
      }
    },
    [phase, buildOrder, challenge, correct, cIndex, advance],
  );

  const handlePlayAgain = useCallback(() => {
    setChallenge(generateChallenge(ageGroup));
    setCIndex(0);
    setCorrect(0);
    setFeedback(null);
    setBuildOrder([]);
    setPhase('playing');
    setResult(null);
    startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) {
    return (
      <GameOverScreen result={result} gameName={silabaMagicaConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />
    );
  }

  return (
    <GameShell gameName={silabaMagicaConfig.name} gameIcon={silabaMagicaConfig.icon} score={correct * 12} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <p className="text-sm font-body text-text-light">
          Desafio {cIndex + 1}/{totalChallenges}
        </p>

        <p className="font-display font-bold text-xl text-text-main text-center">
          {challenge.displayText}
        </p>

        {challenge.mode === 'split' && (
          <>
            <div className="bg-enchant/10 px-8 py-4 rounded-2xl">
              <p className="font-display font-bold text-3xl text-enchant">{challenge.word.word}</p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-sm">
              {challenge.options.map((opt, i) => (
                <Button
                  key={`${challenge.id}-${i}`}
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => handleSplitAnswer(opt)}
                  disabled={phase !== 'playing'}
                  className="border border-gray-200 hover:border-enchant hover:bg-enchant/5 font-mono text-lg"
                >
                  {opt}
                </Button>
              ))}
            </div>
          </>
        )}

        {challenge.mode === 'build' && (
          <>
            <div className="bg-gray-50 px-6 py-4 rounded-2xl min-h-[60px] flex items-center gap-1">
              {buildOrder.length > 0 ? (
                buildOrder.map((s, i) => (
                  <span
                    key={i}
                    className="bg-enchant text-white px-3 py-2 rounded-lg font-display font-bold text-lg animate-pop-in"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-text-light font-body">Toque nas sílabas na ordem certa</span>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {challenge.options.map((syl, i) => {
                const used = buildOrder.filter((b) => b === syl).length;
                const available = challenge.options.filter((o) => o === syl).length;
                const isUsed = used >= available && buildOrder.includes(syl);
                return (
                  <Button
                    key={`${challenge.id}-build-${i}`}
                    variant="secondary"
                    size="lg"
                    onClick={() => handleBuildSyllableClick(syl, i)}
                    disabled={phase !== 'playing' || isUsed}
                    className={`text-xl min-w-[70px] ${isUsed ? 'opacity-30' : ''}`}
                  >
                    {syl}
                  </Button>
                );
              })}
            </div>

            {buildOrder.length > 0 && phase === 'playing' && (
              <Button variant="ghost" size="sm" onClick={() => setBuildOrder([])}>
                🔄 Recomeçar
              </Button>
            )}
          </>
        )}

        {feedback && (
          <p
            className={`text-sm font-body font-semibold text-center px-4 py-2 rounded-xl animate-pop-in ${
              feedback.ok ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
            }`}
          >
            {feedback.msg}
          </p>
        )}
      </div>
    </GameShell>
  );
}
