'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { createTDState, placeTower, spawnWave, updateEnemies, towerAttack, isPathCell, hasTower, TOWER_TYPES, calculateTDScore, type TDState, type Tower } from './logic';
import { towerDefenseConfig } from './config';
import { playSound } from '@/lib/sounds';

const GRID_ROWS = 6; const GRID_COLS = 8;

export function TowerDefenseGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const [state, setState] = useState<TDState>(() => createTDState(ageGroup));
  const [selectedTower, setSelectedTower] = useState<Tower['type']>('arrow');
  const [result, setResult] = useState<GameResult | null>(null);
  const tickRef = useRef(0);
  const startTime = useRef(Date.now());

  const handleCellClick = useCallback((row: number, col: number) => {
    if (state.phase !== 'build') return;
    setState((s) => placeTower(s, row, col, selectedTower));
    playSound('click');
  }, [state.phase, selectedTower]);

  const startWave = useCallback(() => {
    const enemies = spawnWave(state.wave);
    setState((s) => ({ ...s, enemies, phase: 'battle' }));
    playSound('gameStart');
  }, [state.wave]);

  useEffect(() => {
    if (state.phase !== 'battle') return;
    const interval = setInterval(() => {
      tickRef.current++;
      setState((s) => {
        const { updated, leaked } = updateEnemies(s.enemies);
        const { enemies: afterAttack, gold } = towerAttack(s.towers, updated, tickRef.current);
        const newLives = s.lives - leaked;
        const newGold = s.gold + gold;

        if (newLives <= 0) { return { ...s, lives: 0, enemies: [], phase: 'lost' as const }; }
        if (afterAttack.length === 0 && updated.length > 0 && afterAttack.length === 0) {
          const nextWave = s.wave + 1;
          if (nextWave >= s.maxWaves) return { ...s, enemies: [], gold: newGold, wave: nextWave, score: s.score + 50, phase: 'won' as const };
          return { ...s, enemies: [], gold: newGold + 10, wave: nextWave, score: s.score + 50, lives: newLives, phase: 'build' as const };
        }
        return { ...s, enemies: afterAttack, gold: newGold, lives: newLives };
      });
    }, 50);
    return () => clearInterval(interval);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === 'won' || state.phase === 'lost') {
      const ts = Math.floor((Date.now() - startTime.current) / 1000);
      const r = calculateTDScore(state.wave, state.maxWaves, state.lives, ts);
      setResult(r); playSound('gameOver'); onGameEnd(r);
    }
  }, [state.phase, state.wave, state.maxWaves, state.lives, onGameEnd]);

  const handlePlayAgain = useCallback(() => { setState(createTDState(ageGroup)); setResult(null); tickRef.current = 0; startTime.current = Date.now(); }, [ageGroup]);
  if (result) return <GameOverScreen result={result} gameName={towerDefenseConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  return (
    <GameShell gameName={towerDefenseConfig.name} gameIcon={towerDefenseConfig.icon} score={state.score} onBack={onBack}>
      <div className="flex flex-col items-center gap-3 p-3">
        <div className="flex items-center gap-4 text-sm font-body">
          <span>💰 {state.gold}</span><span>❤️ {state.lives}</span><span>🌊 Onda {state.wave + 1}/{state.maxWaves}</span>
        </div>
        <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 48px)` }}>
          {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
            const row = Math.floor(i / GRID_COLS); const col = i % GRID_COLS;
            const isPath = isPathCell(row, col);
            const tower = state.towers.find((t) => t.row === row && t.col === col);
            const tInfo = tower ? TOWER_TYPES.find((t) => t.type === tower.type) : null;
            return (
              <button key={i} onClick={() => handleCellClick(row, col)}
                className={`w-12 h-12 rounded text-lg flex items-center justify-center ${isPath ? 'bg-amber-200' : tower ? 'bg-blue-100' : 'bg-green-100 hover:bg-green-200'}`}>
                {tower ? tInfo?.emoji ?? '🏹' : isPath ? '' : ''}
              </button>
            );
          })}
        </div>
        {/* Enemies overlay would be Canvas in production - simplified here */}
        {state.enemies.length > 0 && <p className="text-xs text-text-light">🐛 {state.enemies.length} invasores restantes</p>}
        <div className="flex gap-2">
          {TOWER_TYPES.map((t) => (
            <button key={t.type} onClick={() => setSelectedTower(t.type)}
              className={`px-3 py-2 rounded-lg text-sm font-body ${selectedTower === t.type ? 'bg-primary text-white' : 'bg-gray-100'}`}>
              {t.emoji} {t.name} (💰{t.cost})
            </button>
          ))}
        </div>
        {state.phase === 'build' && <Button variant="primary" size="lg" onClick={startWave}>🌊 Iniciar Onda {state.wave + 1}</Button>}
      </div>
    </GameShell>
  );
}
