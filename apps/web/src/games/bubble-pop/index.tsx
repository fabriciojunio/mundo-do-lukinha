'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { bubblePopConfig, getWordsForAge, getRounds, createBubbleRound, popBubble, calculateBubbleScore, type BubbleRound } from './logic';
import { playSound } from '@/lib/sounds';
import { shuffleArray } from '@/lib/utils';

export function BubblePopGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const words = useRef(shuffleArray(getWordsForAge(ageGroup)).slice(0, getRounds(ageGroup)));
  const [rIdx, setRIdx] = useState(0);
  const [round, setRound] = useState<BubbleRound>(() => createBubbleRound(words.current[0] ?? 'SOL'));
  const [completed, setCompleted] = useState(0); const [wrongPops, setWrongPops] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const totalRounds = words.current.length;

  const handleBubbleClick = useCallback((id: string) => {
    const { correct, newRound, wordComplete } = popBubble(round, id);
    if (correct) { playSound('coin'); setRound(newRound);
      if (wordComplete) { playSound('correct'); const nc = completed + 1; setCompleted(nc);
        setTimeout(() => {
          if (rIdx + 1 >= totalRounds) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateBubbleScore(nc, totalRounds, wrongPops, ts); setResult(r); playSound('gameOver'); onGameEnd(r); }
          else { setRIdx((i) => i + 1); setRound(createBubbleRound(words.current[rIdx + 1] ?? 'SOL')); }
        }, 800);
      }
    } else { playSound('wrong'); setWrongPops((w) => w + 1); }
  }, [round, completed, rIdx, totalRounds, wrongPops, onGameEnd]);

  const handlePlayAgain = useCallback(() => { words.current = shuffleArray(getWordsForAge(ageGroup)).slice(0, getRounds(ageGroup)); setRIdx(0); setRound(createBubbleRound(words.current[0] ?? 'SOL')); setCompleted(0); setWrongPops(0); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (result) return <GameOverScreen result={result} gameName={bubblePopConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  return (
    <GameShell gameName={bubblePopConfig.name} gameIcon={bubblePopConfig.icon} score={completed * 20} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
        <p className="text-sm font-body text-text-light">Rodada {rIdx + 1}/{totalRounds}</p>
        <p className="font-display font-bold text-lg">Forme: <span className="text-primary">{round.word.slice(0, round.targetIndex)}</span><span className="text-text-light">{round.word.slice(round.targetIndex)}</span></p>
        <p className="text-xs text-text-light">Próxima letra: <span className="font-bold text-accent text-lg">{round.word[round.targetIndex] ?? '✅'}</span></p>
        <div className="relative w-full max-w-lg h-64 bg-gradient-to-b from-cyan-50 to-white rounded-2xl overflow-hidden border border-gray-200">
          {round.bubbles.filter((b) => !b.popped).map((b) => (
            <button key={b.id} onClick={() => handleBubbleClick(b.id)}
              className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 text-white font-display font-bold text-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
              style={{ left: `${(b.x / 600) * 100}%`, top: `${(b.y / 300) * 100}%` }}>{b.letter}</button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}

import type { GameRegistryEntry } from '@/types/game';
export const bubblePopGame: GameRegistryEntry = { config: bubblePopConfig, Component: BubblePopGame };
