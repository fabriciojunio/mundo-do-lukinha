'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { snakeEducativoConfig, createSnakeState, moveSnake, changeDir, getGridSize, calculateSnakeScore, type SnakeState, type Dir } from './logic';
import { playSound } from '@/lib/sounds';

export function SnakeEducativoGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const gs = getGridSize(ageGroup);
  const [state, setState] = useState<SnakeState>(() => createSnakeState(ageGroup));
  const [result, setResult] = useState<GameResult | null>(null);
  const [started, setStarted] = useState(false);
  const dirRef = useRef<Dir>('right');
  const startTime = useRef(Date.now());

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right' };
      const d = map[e.code]; if (d) { dirRef.current = changeDir(dirRef.current, d); if (!started) setStarted(true); }
    };
    window.addEventListener('keydown', kd); return () => window.removeEventListener('keydown', kd);
  }, [started]);

  useEffect(() => {
    if (!started || result) return;
    const interval = setInterval(() => {
      setState((s) => {
        const next = moveSnake({ ...s, dir: dirRef.current }, gs);
        if (next.gameOver) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateSnakeScore(next.score, 0, ts); setResult(r); playSound('gameOver'); onGameEnd(r); }
        else if (next.score > s.score) playSound('coin');
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [started, result, gs, onGameEnd]);

  const handlePlayAgain = useCallback(() => { setState(createSnakeState(ageGroup)); setResult(null); setStarted(false); dirRef.current = 'right'; startTime.current = Date.now(); }, [ageGroup]);
  if (result) return <GameOverScreen result={result} gameName={snakeEducativoConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  const cellSize = Math.min(28, Math.floor(400 / gs));
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
      <div className="flex justify-between w-full max-w-md"><button onClick={onBack} className="text-sm text-text-light">← Voltar</button><span className="font-display font-bold">🐍 Snake Educativo</span><span className="font-mono text-sm">{state.score} pts</span></div>
      <p className="text-sm font-body">Palavra: <span className="font-bold text-primary">{state.collected}</span><span className="text-text-light">{state.word.slice(state.collected.length)}</span> | Próxima: <span className="font-bold text-accent">{state.food.letter}</span></p>
      <div className="inline-grid gap-0 bg-gray-800 rounded-xl p-1" style={{ gridTemplateColumns: `repeat(${gs}, ${cellSize}px)` }}>
        {Array.from({ length: gs * gs }).map((_, i) => {
          const x = i % gs; const y = Math.floor(i / gs);
          const isSnake = state.body.some((s) => s.x === x && s.y === y);
          const isHead = state.body[0]?.x === x && state.body[0]?.y === y;
          const isFood = state.food.x === x && state.food.y === y;
          return (<div key={i} className="flex items-center justify-center rounded-sm" style={{ width: cellSize, height: cellSize, backgroundColor: isHead ? '#22C55E' : isSnake ? '#4ADE80' : isFood ? '#FBBF24' : '#1F2937', fontSize: cellSize * 0.6 }}>
            {isFood ? state.food.letter : isHead ? '🐍' : ''}
          </div>);
        })}
      </div>
      {!started && <p className="font-body text-text-light text-sm">Use as setas para começar!</p>}
    </div>
  );
}

import type { GameRegistryEntry } from '@/types/game';
export const snakeEducativoGame: GameRegistryEntry = { config: snakeEducativoConfig, Component: SnakeEducativoGame };
