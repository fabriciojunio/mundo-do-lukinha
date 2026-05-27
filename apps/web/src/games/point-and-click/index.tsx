'use client';
import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { pointClickConfig, getScenesForAge, checkItemClick, calculatePointClickScore, type Scene, type HiddenItem } from './logic';
import { playSound } from '@/lib/sounds';

export function PointClickGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const scenes = useRef(getScenesForAge(ageGroup));
  const [sIdx, setSIdx] = useState(0);
  const [items, setItems] = useState<HiddenItem[]>(() => scenes.current[0]?.items.map((i) => ({ ...i })) ?? []);
  const [totalFound, setTotalFound] = useState(0); const [totalItems, setTotalItems] = useState(() => scenes.current.reduce((a, s) => a + s.items.length, 0));
  const [hintsUsed, setHintsUsed] = useState(0); const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cs = scenes.current[sIdx]; const total = scenes.current.length;

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    let found = false;
    setItems((prev) => prev.map((item) => {
      if (item.found) return item;
      if (checkItemClick(item, clickX, clickY, 12)) { found = true; playSound('coin'); setTotalFound((t) => t + 1); setFeedback(`Encontrou: ${item.emoji} ${item.name}!`); setTimeout(() => setFeedback(null), 1500); return { ...item, found: true }; }
      return item;
    }));
    if (!found) playSound('click');
  }, []);

  const handleNextScene = useCallback(() => {
    if (sIdx + 1 >= total) {
      const ts = Math.floor((Date.now() - startTime.current) / 1000);
      const r = calculatePointClickScore(totalFound, totalItems, hintsUsed, ts);
      setResult(r); playSound('gameOver'); onGameEnd(r);
    } else {
      const nextItems = scenes.current[sIdx + 1]?.items.map((i) => ({ ...i })) ?? [];
      setSIdx((i) => i + 1); setItems(nextItems); setShowHint(false);
    }
  }, [sIdx, total, totalFound, totalItems, hintsUsed, onGameEnd]);

  const allFoundInScene = items.every((i) => i.found);

  const handlePlayAgain = useCallback(() => { scenes.current = getScenesForAge(ageGroup); setSIdx(0); setItems(scenes.current[0]?.items.map((i) => ({ ...i })) ?? []); setTotalFound(0); setTotalItems(scenes.current.reduce((a, s) => a + s.items.length, 0)); setHintsUsed(0); setShowHint(false); setFeedback(null); setResult(null); startTime.current = Date.now(); }, [ageGroup]);
  if (result) return <GameOverScreen result={result} gameName={pointClickConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cs) return null;

  return (
    <GameShell gameName={pointClickConfig.name} gameIcon={pointClickConfig.icon} score={totalFound * 15} onBack={onBack}>
      <div className="flex flex-col items-center gap-3 p-4 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Cenário {sIdx + 1}/{total}: {cs.emoji} {cs.name}</p>
        <div className={`relative w-full aspect-video ${cs.bg} rounded-2xl cursor-pointer overflow-hidden border-2 border-gray-200`} onClick={handleClick}>
          {items.map((item) => (
            <div key={item.id} className={`absolute transition-all ${item.found ? 'scale-125' : 'opacity-30 hover:opacity-60'}`}
              style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)', fontSize: item.found ? '28px' : '20px' }}>
              {item.found ? item.emoji : '·'}
            </div>
          ))}
          {feedback && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-success/90 text-white px-4 py-2 rounded-full text-sm font-bold animate-pop-in">{feedback}</div>}
        </div>
        <p className="text-xs font-body text-text-light">Itens: {items.filter((i) => i.found).length}/{items.length} | Toque para encontrar!</p>
        {showHint && <div className="flex flex-col gap-1">{items.filter((i) => !i.found).map((i) => <p key={i.id} className="text-xs text-warning">💡 {i.name}: {i.hint}</p>)}</div>}
        <div className="flex gap-2">
          {!showHint && <Button variant="ghost" size="sm" onClick={() => { setShowHint(true); setHintsUsed((h) => h + 1); }}>💡 Dica</Button>}
          {allFoundInScene && <Button variant="primary" size="lg" onClick={handleNextScene}>{sIdx + 1 >= total ? '🏆 Finalizar' : '➡️ Próximo Cenário'}</Button>}
        </div>
      </div>
    </GameShell>
  );
}

import type { GameRegistryEntry } from '@/types/game';
export const pointClickGame: GameRegistryEntry = { config: pointClickConfig, Component: PointClickGame };
