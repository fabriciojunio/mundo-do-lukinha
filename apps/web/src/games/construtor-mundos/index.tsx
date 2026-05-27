'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { construtorMundosConfig, BLOCKS, getGridSize, createGrid, countBlocks, calculateBuildScore } from './logic';
import { playSound } from '@/lib/sounds';

export function ConstrutorMundosGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const size = getGridSize(ageGroup);
  const [grid, setGrid] = useState(() => createGrid(size));
  const [selected, setSelected] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const handleCell = useCallback((r: number, c: number) => {
    playSound('click');
    setGrid((g) => { const ng = g.map((row) => [...row]); if (ng[r]) ng[r][c] = ng[r][c] === selected ? null : selected; return ng; });
  }, [selected]);

  const handleFinish = useCallback(() => {
    const blocks = countBlocks(grid);
    const ts = Math.floor((Date.now() - startTime.current) / 1000);
    const r = calculateBuildScore(blocks, size, ts);
    setResult(r); playSound('gameOver'); onGameEnd(r);
  }, [grid, size, onGameEnd]);

  const handlePlayAgain = useCallback(() => { setGrid(createGrid(size)); setResult(null); startTime.current = Date.now(); }, [size]);
  if (result) return <GameOverScreen result={result} gameName={construtorMundosConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  return (
    <GameShell gameName={construtorMundosConfig.name} gameIcon={construtorMundosConfig.icon} score={countBlocks(grid) * 5} onBack={onBack}>
      <div className="flex flex-col items-center gap-3 p-3">
        <div className="flex gap-1 flex-wrap justify-center">
          {BLOCKS.map((b, i) => (
            <button key={b.name} onClick={() => { setSelected(i); playSound('click'); }}
              className={`px-2 py-1 rounded-lg text-sm ${selected === i ? 'ring-2 ring-text-main bg-gray-200' : 'bg-gray-50'}`}>{b.emoji}</button>
          ))}
        </div>
        <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${size}, ${size > 8 ? '28px' : '36px'})` }}>
          {grid.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`} onClick={() => handleCell(r, c)}
              className="rounded-sm border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 active:scale-90"
              style={{ width: size > 8 ? 28 : 36, height: size > 8 ? 28 : 36, backgroundColor: cell !== null ? BLOCKS[cell]?.color ?? '#f3f4f6' : '#f9fafb' }}>
              {cell !== null ? BLOCKS[cell]?.emoji ?? '' : ''}
            </button>
          )))}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setGrid(createGrid(size))}>🗑️ Limpar</Button>
          <Button variant="primary" size="lg" onClick={handleFinish}>✅ Pronto!</Button>
        </div>
      </div>
    </GameShell>
  );
}

import type { GameRegistryEntry } from '@/types/game';
export const construtorMundosGame: GameRegistryEntry = { config: construtorMundosConfig, Component: ConstrutorMundosGame };
