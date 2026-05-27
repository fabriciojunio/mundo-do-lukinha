'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { createInitialState, updateGameState, calculateDinoScore, type DinoGameState } from './logic';
import { dinoRunnerConfig } from './config';
import { playSound } from '@/lib/sounds';

export function DinoRunnerGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<DinoGameState>(() => createInitialState(ageGroup));
  const [result, setResult] = useState<GameResult | null>(null);
  const [started, setStarted] = useState(false);
  const keysRef = useRef({ jump: false, duck: false });
  const animFrameRef = useRef<number>(0);

  const handleGameOver = useCallback(
    (state: DinoGameState) => {
      const gameResult = calculateDinoScore(Math.floor(state.score / 10));
      setResult(gameResult);
      playSound('gameOver');
      onGameEnd(gameResult);
    },
    [onGameEnd],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        keysRef.current.jump = true;
        if (!started) setStarted(true);
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        keysRef.current.duck = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') keysRef.current.jump = false;
      if (e.code === 'ArrowDown') keysRef.current.duck = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [started]);

  useEffect(() => {
    if (!started || result) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentState = gameState;

    const loop = () => {
      const w = canvas.width;
      const nextState = updateGameState(currentState, keysRef.current.jump, keysRef.current.duck, w, ageGroup);
      keysRef.current.jump = false;
      currentState = nextState;
      setGameState(nextState);

      if (nextState.isGameOver) {
        handleGameOver(nextState);
        return;
      }

      ctx.clearRect(0, 0, w, canvas.height);

      // Ground
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(0, nextState.groundY + 50, w, 2);

      // Dino
      ctx.fillStyle = '#22C55E';
      const dinoH = nextState.dino.isDucking ? 35 : 50;
      const dinoY = nextState.dino.isDucking ? nextState.dino.y + 15 : nextState.dino.y;
      ctx.fillRect(60, dinoY, 40, dinoH);
      // Eye
      ctx.fillStyle = '#fff';
      ctx.fillRect(85, dinoY + 8, 8, 8);
      ctx.fillStyle = '#000';
      ctx.fillRect(88, dinoY + 10, 4, 4);

      // Obstacles
      nextState.obstacles.forEach((obs) => {
        ctx.fillStyle = obs.type === 'bird' ? '#F97316' : '#6b7280';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });

      // Score
      ctx.fillStyle = '#2D2D3F';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`Pontos: ${Math.floor(nextState.score / 10)}`, w - 140, 30);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [started, result, ageGroup, handleGameOver]);

  const handleTouch = useCallback(() => {
    keysRef.current.jump = true;
    if (!started) setStarted(true);
  }, [started]);

  const handlePlayAgain = useCallback(() => {
    setGameState(createInitialState(ageGroup));
    setResult(null);
    setStarted(false);
  }, [ageGroup]);

  if (result) {
    return (
      <GameOverScreen
        result={result}
        gameName={dinoRunnerConfig.name}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
      <div className="flex items-center justify-between w-full max-w-2xl px-2">
        <button onClick={onBack} className="text-sm font-body text-text-light hover:text-text-main">
          ← Voltar
        </button>
        <span className="font-display font-bold text-lg text-text-main">
          {dinoRunnerConfig.icon} {dinoRunnerConfig.name}
        </span>
        <span className="font-mono text-sm text-text-light">
          {Math.floor(gameState.score / 10)} pts
        </span>
      </div>

      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md cursor-pointer"
        onPointerDown={handleTouch}
      >
        <canvas ref={canvasRef} width={640} height={260} className="w-full h-auto" />
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <p className="text-5xl mb-3">🦕</p>
            <p className="font-display font-bold text-xl text-text-main">Toque ou aperte Espaço!</p>
            <p className="text-sm font-body text-text-light mt-1">Pule para desviar dos obstáculos</p>
          </div>
        )}
      </div>

      <p className="text-xs font-body text-text-light text-center">
        Espaço/↑ = Pular | ↓ = Agachar | Toque = Pular
      </p>
    </div>
  );
}
