'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { getLevelsForAge, createPlayer, updatePlayer, checkStarCollection, checkGoal, getSpeedForAge, calculatePlatformScore, type PlayerState, type PlatformLevel, type Star } from './logic';
import { plataformaLukinhaConfig } from './config';
import { playSound } from '@/lib/sounds';

export function PlataformaLukinhaGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const levels = useRef(getLevelsForAge(ageGroup));
  const [lIdx, setLIdx] = useState(0);
  const [starsTotal, setStarsTotal] = useState(0);
  const [levelsCompleted, setLevelsCompleted] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [started, setStarted] = useState(false);
  const keysRef = useRef({ left: false, right: false, jump: false });
  const playerRef = useRef<PlayerState>(createPlayer(50, 280));
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef(0);
  const startTime = useRef(Date.now());
  const speed = getSpeedForAge(ageGroup);
  const currentLevel = levels.current[lIdx];
  const totalLevels = levels.current.length;

  useEffect(() => {
    if (currentLevel) {
      playerRef.current = createPlayer(currentLevel.startX, currentLevel.startY);
      starsRef.current = currentLevel.stars.map((s) => ({ ...s }));
    }
  }, [lIdx, currentLevel]);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') { keysRef.current.jump = true; if (!started) setStarted(true); }
    };
    const ku = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.jump = false;
    };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, [started]);

  useEffect(() => {
    if (!started || result || !currentLevel) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    const loop = () => {
      playerRef.current = updatePlayer(playerRef.current, keysRef.current, currentLevel.platforms, speed);
      keysRef.current.jump = false;
      const newStars = checkStarCollection(playerRef.current, starsRef.current);
      const newlyCollected = newStars.filter((s, i) => s.collected && !starsRef.current[i]?.collected).length;
      if (newlyCollected > 0) { playSound('coin'); setStarsTotal((t) => t + newlyCollected); }
      starsRef.current = newStars;

      if (checkGoal(playerRef.current, currentLevel.goalX, currentLevel.goalY)) {
        playSound('correct');
        const nc = levelsCompleted + 1; setLevelsCompleted(nc);
        if (lIdx + 1 >= totalLevels) {
          const ts = Math.floor((Date.now() - startTime.current) / 1000);
          const totalStarsInGame = levels.current.reduce((a, l) => a + l.stars.length, 0);
          const r = calculatePlatformScore(starsTotal + newlyCollected, totalStarsInGame, nc, totalLevels, ts);
          setResult(r); playSound('gameOver'); onGameEnd(r); return;
        }
        setLIdx((i) => i + 1); return;
      }

      // Draw
      ctx.clearRect(0, 0, 640, 320);
      ctx.fillStyle = '#e5e7eb'; ctx.fillRect(0, 300, 640, 20); // ground
      currentLevel.platforms.forEach((p) => { ctx.fillStyle = '#4ECDC4'; ctx.fillRect(p.x, p.y, p.width, 10); ctx.fillStyle = '#3AA89E'; ctx.fillRect(p.x, p.y + 10, p.width, 4); });
      starsRef.current.forEach((s) => { if (!s.collected) { ctx.fillStyle = '#EAB308'; ctx.font = '18px sans-serif'; ctx.fillText('⭐', s.x - 9, s.y + 6); } });
      ctx.fillStyle = '#7C3AED'; ctx.font = '16px sans-serif'; ctx.fillText('🏁', currentLevel.goalX - 8, currentLevel.goalY + 6);
      // Player
      const p = playerRef.current;
      ctx.fillStyle = '#F97316'; ctx.fillRect(p.x - 10, p.y - 20, 20, 20);
      ctx.fillStyle = '#fff'; ctx.fillRect(p.facingRight ? p.x + 2 : p.x - 8, p.y - 16, 5, 5);
      ctx.fillStyle = '#000'; ctx.fillRect(p.facingRight ? p.x + 3 : p.x - 7, p.y - 15, 3, 3);

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [started, result, lIdx, currentLevel, speed, levelsCompleted, starsTotal, totalLevels, onGameEnd]);

  const handlePlayAgain = useCallback(() => { levels.current = getLevelsForAge(ageGroup); setLIdx(0); setStarsTotal(0); setLevelsCompleted(0); setResult(null); setStarted(false); startTime.current = Date.now(); }, [ageGroup]);

  if (result) return <GameOverScreen result={result} gameName={plataformaLukinhaConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
      <div className="flex items-center justify-between w-full max-w-2xl px-2">
        <button onClick={onBack} className="text-sm font-body text-text-light hover:text-text-main">← Voltar</button>
        <span className="font-display font-bold text-lg">🏃 {currentLevel?.name ?? 'Plataforma'}</span>
        <span className="font-mono text-sm text-text-light">⭐ {starsTotal}</span>
      </div>
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-sky-100 to-sky-50 rounded-2xl border border-gray-200 overflow-hidden shadow-md cursor-pointer"
        onPointerDown={() => { keysRef.current.jump = true; if (!started) setStarted(true); }}>
        <canvas ref={canvasRef} width={640} height={320} className="w-full h-auto" />
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <p className="text-5xl mb-3">🏃</p>
            <p className="font-display font-bold text-xl">Use ←→ para mover, Espaço para pular!</p>
            <p className="text-sm font-body text-text-light mt-1">Colete ⭐ e chegue na 🏁</p>
          </div>
        )}
      </div>
      <p className="text-xs font-body text-text-light">← → = Mover | Espaço/↑ = Pular | Nível {lIdx + 1}/{totalLevels}</p>
    </div>
  );
}
