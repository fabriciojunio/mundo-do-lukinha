'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import {
  generateGrid,
  checkWordSelection,
  calculateWordHuntScore,
  type LetterCell,
  type WordPosition,
} from './logic';
import { wordHuntConfig } from './config';
import { playSound } from '@/lib/sounds';

export function WordHuntGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const [gameData, setGameData] = useState(() => generateGrid(ageGroup));
  const [selectedCells, setSelectedCells] = useState<Array<{ row: number; col: number }>>([]);
  const [wordsFound, setWordsFound] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const startTime = useRef(Date.now());

  const totalWords = gameData.words.length;

  const isCellSelected = useCallback(
    (row: number, col: number) => selectedCells.some((c) => c.row === row && c.col === col),
    [selectedCells],
  );

  const isCellFound = useCallback(
    (row: number, col: number) => {
      return gameData.grid[row]?.[col]?.isHighlighted ?? false;
    },
    [gameData.grid],
  );

  const handleCellPointerDown = useCallback((row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  }, []);

  const handleCellPointerEnter = useCallback(
    (row: number, col: number) => {
      if (!isSelecting) return;
      setSelectedCells((prev) => {
        if (prev.some((c) => c.row === row && c.col === col)) return prev;
        return [...prev, { row, col }];
      });
    },
    [isSelecting],
  );

  const handlePointerUp = useCallback(() => {
    setIsSelecting(false);
    if (selectedCells.length < 2) {
      setSelectedCells([]);
      return;
    }

    const foundWord = checkWordSelection(gameData.words, selectedCells, gameData.grid);

    if (foundWord) {
      playSound('correct');
      const newWordsFound = wordsFound + 1;
      setWordsFound(newWordsFound);

      setGameData((prev) => ({
        ...prev,
        words: prev.words.map((w) => (w.word === foundWord ? { ...w, found: true } : w)),
        grid: prev.grid.map((row) =>
          row.map((cell) =>
            selectedCells.some((s) => s.row === cell.row && s.col === cell.col)
              ? { ...cell, isHighlighted: true }
              : cell,
          ),
        ),
      }));

      if (newWordsFound === totalWords) {
        const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
        const gameResult = calculateWordHuntScore(newWordsFound, totalWords, timeSpent, 0);
        setResult(gameResult);
        playSound('gameOver');
        onGameEnd(gameResult);
      }
    } else {
      playSound('wrong');
    }

    setSelectedCells([]);
  }, [selectedCells, gameData, wordsFound, totalWords, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    setGameData(generateGrid(ageGroup));
    setSelectedCells([]);
    setWordsFound(0);
    setResult(null);
    startTime.current = Date.now();
  }, [ageGroup]);

  if (result) {
    return (
      <GameOverScreen
        result={result}
        gameName={wordHuntConfig.name}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
      />
    );
  }

  return (
    <GameShell gameName={wordHuntConfig.name} gameIcon={wordHuntConfig.icon} score={wordsFound * 15} onBack={onBack}>
      <div className="flex flex-col lg:flex-row items-start justify-center gap-4 p-4 h-full">
        <div
          className="select-none touch-none"
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${gameData.grid[0]?.length ?? 8}, minmax(0, 1fr))` }}>
            {gameData.grid.map((row) =>
              row.map((cell) => (
                <button
                  key={`${cell.row}-${cell.col}`}
                  onPointerDown={() => handleCellPointerDown(cell.row, cell.col)}
                  onPointerEnter={() => handleCellPointerEnter(cell.row, cell.col)}
                  className={`
                    w-8 h-8 md:w-10 md:h-10 flex items-center justify-center
                    text-sm md:text-base font-mono font-bold rounded
                    transition-colors select-none
                    ${isCellFound(cell.row, cell.col)
                      ? 'bg-success/30 text-success'
                      : isCellSelected(cell.row, cell.col)
                        ? 'bg-primary/30 text-primary'
                        : 'bg-gray-100 text-text-main hover:bg-gray-200'
                    }
                  `}
                >
                  {cell.letter}
                </button>
              )),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[140px]">
          <p className="font-display font-bold text-sm text-text-main">
            Palavras ({wordsFound}/{totalWords})
          </p>
          {gameData.words.map((wp) => (
            <span
              key={wp.word}
              className={`text-sm font-body px-2 py-1 rounded ${
                wp.found ? 'line-through text-success bg-success/10' : 'text-text-main bg-gray-50'
              }`}
            >
              {wp.word}
            </span>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
