'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { corridaMalucaConfig } from './config';
import { createRaceState, moveLane, updateRace, calculateRaceScore, type RaceState } from './logic';
import { playSound } from '@/lib/sounds';

const LANE_X = [140, 280, 420];
const OBS_EMOJI: Record<string, string> = { rock: '🪨', oil: '🛢️', cone: '🔶' };

export function CorridaMalucaGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<RaceState>(() => createRaceState(ageGroup));
  const [result, setResult] = useState<GameResult | null>(null);
  const [started, setStarted] = useState(false);
  const stateRef = useRef(state);
  const animRef = useRef(0);

  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (!started) setStarted(true);
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') setState((s) => ({ ...s, playerLane: moveLane(s.playerLane, 'left') }));
      if (e.code === 'ArrowRight' || e.code === 'KeyD') setState((s) => ({ ...s, playerLane: moveLane(s.playerLane, 'right') }));
    };
    window.addEventListener('keydown', kd);
    return () => window.removeEventListener('keydown', kd);
  }, [started]);

  useEffect(() => {
    if (!started || result) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const loop = () => {
      const s = updateRace(stateRef.current, ageGroup);
      stateRef.current = s; setState(s);
      if (s.crashed) { const r = calculateRaceScore(s.distance, s.coins); setResult(r); playSound('gameOver'); onGameEnd(r); return; }

      ctx.clearRect(0, 0, 560, 350);
      ctx.fillStyle = '#374151'; ctx.fillRect(100, 0, 360, 350); // road
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.setLineDash([20, 15]);
      ctx.beginPath(); ctx.moveTo(210, 0); ctx.lineTo(210, 350); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(350, 0); ctx.lineTo(350, 350); ctx.stroke();
      ctx.setLineDash([]);

      s.obstacles.forEach((o) => { ctx.font = '24px sans-serif'; ctx.fillText(OBS_EMOJI[o.type] ?? '🪨', (LANE_X[o.lane] ?? 280) - 12, o.y); });
      s.racCoins.forEach((c) => { if (!c.collected) { ctx.font = '18px sans-serif'; ctx.fillText('🪙', (LANE_X[c.lane] ?? 280) - 9, c.y); } });
      // Player car
      ctx.font = '30px sans-serif'; ctx.fillText('🏎️', (LANE_X[s.playerLane] ?? 280) - 15, 290);
      // HUD
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px monospace';
      ctx.fillText(`${Math.floor(s.distance / 10)}m`, 10, 25);
      ctx.fillText(`🪙 ${s.coins}`, 10, 50);

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [started, result, ageGroup, onGameEnd]);

  const handlePlayAgain = useCallback(() => { setState(createRaceState(ageGroup)); setResult(null); setStarted(false); }, [ageGroup]);
  if (result) return <GameOverScreen result={result} gameName={corridaMalucaConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
      <div className="flex justify-between w-full max-w-xl px-2">
        <button onClick={onBack} className="text-sm font-body text-text-light">← Voltar</button>
        <span className="font-display font-bold">🏎️ Corrida Maluca</span>
        <span className="font-mono text-sm">{Math.floor(state.distance / 10)}m | 🪙{state.coins}</span>
      </div>
      <div className="relative max-w-xl w-full bg-gray-800 rounded-2xl overflow-hidden shadow-md"
        onPointerDown={(e) => { if (!started) setStarted(true); const rect = e.currentTarget.getBoundingClientRect(); const x = e.clientX - rect.left; const relX = x / rect.width; setState((s) => ({ ...s, playerLane: relX < 0.33 ? 0 : relX > 0.66 ? 2 : 1 })); }}>
        <canvas ref={canvasRef} width={560} height={350} className="w-full h-auto" />
        {!started && (<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60"><p className="text-4xl mb-2">🏎️</p><p className="font-display font-bold text-xl text-white">Toque ou use ← → para correr!</p></div>)}
      </div>
    </div>
  );
}
