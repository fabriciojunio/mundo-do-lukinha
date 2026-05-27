'use client';
import { useState, useCallback } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { construtorCivilizacoesConfig, BUILDINGS, createCivState, canBuild, buildStructure, endTurn, calculateCivScore, type CivState } from './logic';
import { playSound } from '@/lib/sounds';

export function ConstrutorCivilizacoesGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const [state, setState] = useState<CivState>(() => createCivState(ageGroup));
  const [result, setResult] = useState<GameResult | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const handleBuild = useCallback((buildingId: string) => {
    const building = BUILDINGS.find((b) => b.id === buildingId);
    if (!building) return;
    setState((s) => {
      if (!canBuild(s, building)) { setMsg('Recursos insuficientes! 😕'); setTimeout(() => setMsg(null), 1500); playSound('wrong'); return s; }
      playSound('correct'); setMsg(`Construiu ${building.emoji} ${building.name}!`); setTimeout(() => setMsg(null), 1500);
      return buildStructure(s, buildingId);
    });
  }, []);

  const handleEndTurn = useCallback(() => {
    setState((s) => {
      const next = endTurn(s);
      if (next.turn >= next.maxTurns) {
        const r = calculateCivScore(next); setResult(r); playSound('gameOver'); onGameEnd(r); return next;
      }
      playSound('whoosh'); return next;
    });
  }, [onGameEnd]);

  const handlePlayAgain = useCallback(() => { setState(createCivState(ageGroup)); setResult(null); setMsg(null); }, [ageGroup]);
  if (result) return <GameOverScreen result={result} gameName={construtorCivilizacoesConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  const r = state.resources;
  return (
    <GameShell gameName={construtorCivilizacoesConfig.name} gameIcon={construtorCivilizacoesConfig.icon} score={state.buildings.length * 10 + r.gold} onBack={onBack}>
      <div className="flex flex-col items-center gap-3 p-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-body flex-wrap justify-center">
          <span className="px-2 py-1 bg-amber-100 rounded-full">{state.era} | Turno {state.turn + 1}/{state.maxTurns}</span>
          <span>🌾{r.food}</span><span>🪵{r.wood}</span><span>⛏️{r.stone}</span><span>💰{r.gold}</span><span>👥{r.population}</span><span>😊{r.happiness}%</span>
        </div>

        {/* Built structures */}
        <div className="bg-amber-50 rounded-2xl p-3 w-full min-h-[60px]">
          <p className="text-xs font-body text-text-light mb-1">Sua cidade ({state.buildings.length} construções):</p>
          <div className="flex flex-wrap gap-1">
            {state.buildings.length === 0 ? <span className="text-sm text-text-light">Construa algo!</span> :
              state.buildings.map((bId, i) => { const b = BUILDINGS.find((x) => x.id === bId); return <span key={i} className="text-2xl" title={b?.name}>{b?.emoji}</span>; })}
          </div>
        </div>

        {msg && <p className="text-sm font-body font-semibold animate-pop-in text-center">{msg}</p>}

        {/* Build options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
          {BUILDINGS.map((b) => {
            const able = canBuild(state, b);
            return (
              <button key={b.id} onClick={() => handleBuild(b.id)} disabled={!able}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-center transition-all ${able ? 'border-amber-300 bg-white hover:bg-amber-50 active:scale-95' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                <span className="text-2xl">{b.emoji}</span>
                <span className="text-xs font-display font-bold">{b.name}</span>
                <span className="text-[10px] text-text-light">🌾{b.cost.food} 🪵{b.cost.wood} ⛏️{b.cost.stone}</span>
              </button>
            );
          })}
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={handleEndTurn}>
          ⏭️ Passar Turno ({state.turn + 1}/{state.maxTurns})
        </Button>
      </div>
    </GameShell>
  );
}

import type { GameRegistryEntry } from '@/types/game';
export const construtorCivilizacoesGame: GameRegistryEntry = { config: construtorCivilizacoesConfig, Component: ConstrutorCivilizacoesGame };
