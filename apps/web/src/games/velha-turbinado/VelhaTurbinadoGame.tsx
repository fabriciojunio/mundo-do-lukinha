'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { createBoard, makeMove, checkWinner, isBoardFull, getAIMove, getRoundsForAge, calculateTTTScore, type Board } from './logic';
import { velhaTurbinadoConfig } from './config';
import { playSound } from '@/lib/sounds';

export function VelhaTurbinadoGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const totalRounds = getRoundsForAge(ageGroup);
  const [board, setBoard] = useState<Board>(createBoard); const [round, setRound] = useState(0);
  const [wins, setWins] = useState(0); const [draws, setDraws] = useState(0); const [losses, setLosses] = useState(0);
  const [msg, setMsg] = useState<string | null>(null); const [gameActive, setGameActive] = useState(true);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const finishRound = useCallback((w: number, d: number, l: number) => {
    setTimeout(() => {
      if (round + 1 >= totalRounds) {
        const ts = Math.floor((Date.now() - startTime.current) / 1000);
        const r = calculateTTTScore(w, d, l, totalRounds, ts);
        setResult(r); playSound('gameOver'); onGameEnd(r);
      } else { setRound((r) => r + 1); setBoard(createBoard()); setMsg(null); setGameActive(true); }
    }, 1500);
  }, [round, totalRounds, onGameEnd]);

  const handleCellClick = useCallback((pos: number) => {
    if (!gameActive || board[pos] !== null) return;
    let newBoard = makeMove(board, pos, 'X'); playSound('click');
    const playerWin = checkWinner(newBoard);
    if (playerWin) { setBoard(newBoard); setGameActive(false); playSound('correct'); setMsg('Você venceu! 🎉'); const nw = wins + 1; setWins(nw); finishRound(nw, draws, losses); return; }
    if (isBoardFull(newBoard)) { setBoard(newBoard); setGameActive(false); setMsg('Empate! 🤝'); const nd = draws + 1; setDraws(nd); finishRound(wins, nd, losses); return; }

    const aiPos = getAIMove(newBoard, 'O', ageGroup);
    if (aiPos >= 0) { newBoard = makeMove(newBoard, aiPos, 'O'); }
    const aiWin = checkWinner(newBoard);
    if (aiWin) { setBoard(newBoard); setGameActive(false); playSound('wrong'); setMsg('A IA venceu! Tente de novo! 💪'); const nl = losses + 1; setLosses(nl); finishRound(wins, draws, nl); return; }
    if (isBoardFull(newBoard)) { setBoard(newBoard); setGameActive(false); setMsg('Empate! 🤝'); const nd = draws + 1; setDraws(nd); finishRound(wins, nd, losses); return; }
    setBoard(newBoard);
  }, [gameActive, board, ageGroup, wins, draws, losses, finishRound]);

  const handlePlayAgain = useCallback(() => { setBoard(createBoard()); setRound(0); setWins(0); setDraws(0); setLosses(0); setMsg(null); setGameActive(true); setResult(null); startTime.current = Date.now(); }, []);
  if (result) return <GameOverScreen result={result} gameName={velhaTurbinadoConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  return (
    <GameShell gameName={velhaTurbinadoConfig.name} gameIcon={velhaTurbinadoConfig.icon} score={wins * 30 + draws * 10} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <p className="text-sm font-body text-text-light">Rodada {round + 1}/{totalRounds} | V:{wins} E:{draws} D:{losses}</p>
        <div className="inline-grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <button key={i} onClick={() => handleCellClick(i)} disabled={!gameActive || cell !== null}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-xl text-4xl font-bold flex items-center justify-center transition-all ${
                cell === 'X' ? 'bg-primary/15 text-primary' : cell === 'O' ? 'bg-error/15 text-error' : 'bg-gray-100 hover:bg-gray-200 active:scale-90'
              }`}>{cell === 'X' ? '❌' : cell === 'O' ? '⭕' : ''}</button>
          ))}
        </div>
        <p className="text-sm font-body text-text-light">Você é ❌ | IA é ⭕</p>
        {msg && <p className="font-display font-bold text-lg text-text-main animate-pop-in">{msg}</p>}
      </div>
    </GameShell>
  );
}
