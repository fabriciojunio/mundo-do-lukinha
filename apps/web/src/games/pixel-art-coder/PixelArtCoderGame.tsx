'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { PALETTE, getPatternsForAge, getPatternCount, createEmptyGrid, compareGrids, calculatePixelScore, type PixelPattern } from './logic';
import { pixelArtCoderConfig } from './config';
import { playSound } from '@/lib/sounds';
import { shuffleArray } from '@/lib/utils';

export function PixelArtCoderGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const patterns = useRef<PixelPattern[]>(shuffleArray(getPatternsForAge(ageGroup)).slice(0, getPatternCount(ageGroup)));
  const [pIndex, setPIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [playerGrid, setPlayerGrid] = useState<(number | null)[][]>(() => createEmptyGrid(patterns.current[0]?.gridSize ?? 5));
  const [completed, setCompleted] = useState(0);
  const [totalCorrectPixels, setTotalCorrectPixels] = useState(0);
  const [totalPixels, setTotalPixels] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const currentPattern = patterns.current[pIndex];
  const totalPatterns = patterns.current.length;

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!currentPattern) return;
    playSound('click');
    setPlayerGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      if (newGrid[row]) { newGrid[row][col] = newGrid[row][col] === selectedColor ? null : selectedColor; }
      return newGrid;
    });
  }, [selectedColor, currentPattern]);

  const handleCheckPattern = useCallback(() => {
    if (!currentPattern) return;
    const { correct, total } = compareGrids(currentPattern.grid, playerGrid);
    const newTotalCorrect = totalCorrectPixels + correct;
    const newTotalPixels = totalPixels + total;
    setTotalCorrectPixels(newTotalCorrect);
    setTotalPixels(newTotalPixels);
    const accuracy = total > 0 ? correct / total : 0;

    if (accuracy >= 0.8) {
      playSound('correct');
      const nc = completed + 1;
      setCompleted(nc);
      if (pIndex + 1 >= totalPatterns) {
        const ts = Math.floor((Date.now() - startTime.current) / 1000);
        const r = calculatePixelScore(newTotalCorrect, newTotalPixels, nc, totalPatterns, ts);
        setResult(r); playSound('gameOver'); onGameEnd(r);
      } else {
        const nextPattern = patterns.current[pIndex + 1];
        setPIndex((i) => i + 1);
        setPlayerGrid(createEmptyGrid(nextPattern?.gridSize ?? 5));
      }
    } else {
      playSound('wrong');
    }
  }, [currentPattern, playerGrid, totalCorrectPixels, totalPixels, completed, pIndex, totalPatterns, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    patterns.current = shuffleArray(getPatternsForAge(ageGroup)).slice(0, getPatternCount(ageGroup));
    setPIndex(0); setSelectedColor(0); setPlayerGrid(createEmptyGrid(patterns.current[0]?.gridSize ?? 5));
    setCompleted(0); setTotalCorrectPixels(0); setTotalPixels(0); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (result) return <GameOverScreen result={result} gameName={pixelArtCoderConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!currentPattern) return null;

  return (
    <GameShell gameName={pixelArtCoderConfig.name} gameIcon={pixelArtCoderConfig.icon} score={completed * 30} onBack={onBack}>
      <div className="flex flex-col items-center gap-4 p-4">
        <p className="text-sm font-body text-text-light">Padrão {pIndex + 1}/{totalPatterns}: {currentPattern.name}</p>
        <div className="flex gap-6 flex-col lg:flex-row items-center">
          {/* Target */}
          <div className="text-center">
            <p className="text-xs font-body text-text-light mb-1">Modelo</p>
            <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${currentPattern.gridSize}, 28px)` }}>
              {currentPattern.grid.map((row, r) => row.map((cell, c) => (
                <div key={`t-${r}-${c}`} className="w-7 h-7 rounded-sm border border-gray-200"
                  style={{ backgroundColor: cell !== null ? PALETTE[cell]?.hex ?? '#fff' : '#f9fafb' }} />
              )))}
            </div>
          </div>
          {/* Player grid */}
          <div className="text-center">
            <p className="text-xs font-body text-text-light mb-1">Sua arte</p>
            <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${currentPattern.gridSize}, 32px)` }}>
              {playerGrid.map((row, r) => row.map((cell, c) => (
                <button key={`p-${r}-${c}`} onClick={() => handleCellClick(r, c)}
                  className="w-8 h-8 rounded-sm border-2 border-gray-200 hover:border-gray-400 active:scale-90 transition-all"
                  style={{ backgroundColor: cell !== null ? PALETTE[cell]?.hex ?? '#fff' : '#f9fafb' }} />
              )))}
            </div>
          </div>
        </div>
        {/* Palette */}
        <div className="flex gap-2 flex-wrap justify-center">
          {PALETTE.map((color, i) => (
            <button key={color.name} onClick={() => { setSelectedColor(i); playSound('click'); }}
              className={`w-10 h-10 rounded-lg border-3 transition-all ${selectedColor === i ? 'border-text-main scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: color.hex, borderWidth: selectedColor === i ? '3px' : '2px', borderColor: selectedColor === i ? '#2D2D3F' : 'transparent' }} />
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={() => setPlayerGrid(createEmptyGrid(currentPattern.gridSize))}>🗑️ Limpar</Button>
          <Button variant="primary" size="lg" onClick={handleCheckPattern}>✅ Verificar</Button>
        </div>
      </div>
    </GameShell>
  );
}
