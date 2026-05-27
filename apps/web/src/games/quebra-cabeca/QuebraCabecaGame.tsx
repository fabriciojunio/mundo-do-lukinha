'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { generatePuzzle, swapPieces, isPuzzleSolved, getGridSize, getRounds, calculatePuzzleScore, type PuzzlePiece } from './logic';
import { quebraCabecaConfig } from './config';
import { playSound } from '@/lib/sounds';

export function QuebraCabecaGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const gridSize = getGridSize(ageGroup); const totalRounds = getRounds(ageGroup);
  const [pieces, setPieces] = useState<PuzzlePiece[]>(() => generatePuzzle(gridSize));
  const [selected, setSelected] = useState<number | null>(null);
  const [round, setRound] = useState(0); const [completed, setCompleted] = useState(0); const [moves, setMoves] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const handlePieceClick = useCallback((pos: number) => {
    if (result) return;
    if (selected === null) { setSelected(pos); playSound('click'); return; }
    if (selected === pos) { setSelected(null); return; }
    const newPieces = swapPieces(pieces, selected, pos);
    setPieces(newPieces); setSelected(null); setMoves((m) => m + 1); playSound('whoosh');
    if (isPuzzleSolved(newPieces)) {
      playSound('correct'); const nc = completed + 1; setCompleted(nc);
      setTimeout(() => {
        if (round + 1 >= totalRounds) {
          const ts = Math.floor((Date.now() - startTime.current) / 1000);
          const r = calculatePuzzleScore(nc, totalRounds, moves + 1, ts);
          setResult(r); playSound('gameOver'); onGameEnd(r);
        } else { setRound((r) => r + 1); setPieces(generatePuzzle(gridSize)); setMoves(0); }
      }, 1000);
    }
  }, [selected, pieces, completed, round, totalRounds, gridSize, moves, result, onGameEnd]);

  const handlePlayAgain = useCallback(() => { setPieces(generatePuzzle(gridSize)); setSelected(null); setRound(0); setCompleted(0); setMoves(0); setResult(null); startTime.current = Date.now(); }, [gridSize]);
  if (result) return <GameOverScreen result={result} gameName={quebraCabecaConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  const sortedPieces = [...pieces].sort((a, b) => a.currentPos - b.currentPos);
  return (
    <GameShell gameName={quebraCabecaConfig.name} gameIcon={quebraCabecaConfig.icon} score={completed * 20} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <p className="text-sm font-body text-text-light">Rodada {round + 1}/{totalRounds} | Jogadas: {moves}</p>
        <div className="inline-grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {sortedPieces.map((piece) => {
            const isCorrect = piece.currentPos === piece.correctPos;
            const isSelected = selected === piece.currentPos;
            return (
              <button key={piece.id} onClick={() => handlePieceClick(piece.currentPos)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-xl text-3xl flex items-center justify-center transition-all active:scale-90 ${
                  isSelected ? 'ring-4 ring-primary bg-primary/10 scale-105' : isCorrect ? 'bg-success/10 border-2 border-success/30' : 'bg-gray-100 border-2 border-gray-200 hover:bg-gray-200'
                }`}>{piece.emoji}</button>
            );
          })}
        </div>
        <p className="text-xs font-body text-text-light">Toque em 2 peças para trocar de posição!</p>
      </div>
    </GameShell>
  );
}
