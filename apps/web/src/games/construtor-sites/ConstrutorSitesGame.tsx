'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { HTML_ELEMENTS, selectMissions, checkMission, getElementByTag, calculateSiteScore, type SiteMission } from './logic';
import { construtorSitesConfig } from './config';
import { playSound } from '@/lib/sounds';

export function ConstrutorSitesGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const missions = useRef<SiteMission[]>(selectMissions(ageGroup));
  const [mIndex, setMIndex] = useState(0);
  const [placedTags, setPlacedTags] = useState<string[]>([]);
  const [completed, setCompleted] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const cm = missions.current[mIndex]; const total = missions.current.length;

  const addElement = useCallback((tag: string) => {
    if (!cm) return;
    setPlacedTags((p) => [...p, tag]); playSound('click');
  }, [cm]);

  const removeElement = useCallback((idx: number) => {
    setPlacedTags((p) => p.filter((_, i) => i !== idx));
  }, []);

  const handleCheck = useCallback(() => {
    if (!cm) return;
    const { complete, missing } = checkMission(cm, placedTags);
    if (complete) {
      playSound('correct'); const nc = completed + 1; setCompleted(nc);
      setFeedback('🎉 Site completo! Muito bem!');
      setTimeout(() => {
        if (mIndex + 1 >= total) { const ts = Math.floor((Date.now() - startTime.current) / 1000); const r = calculateSiteScore(nc, total, ts); setResult(r); playSound('gameOver'); onGameEnd(r); }
        else { setMIndex((i) => i + 1); setPlacedTags([]); setFeedback(null); }
      }, 1500);
    } else {
      playSound('wrong');
      setFeedback(`Faltam: ${missing.map((t) => getElementByTag(t)?.label ?? t).join(', ')}`);
    }
  }, [cm, placedTags, completed, mIndex, total, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    missions.current = selectMissions(ageGroup); setMIndex(0); setPlacedTags([]); setCompleted(0); setFeedback(null); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (result) return <GameOverScreen result={result} gameName={construtorSitesConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!cm) return null;

  return (
    <GameShell gameName={construtorSitesConfig.name} gameIcon={construtorSitesConfig.icon} score={completed * 25} onBack={onBack}>
      <div className="flex flex-col items-center gap-4 p-4 max-w-2xl mx-auto">
        <p className="text-sm font-body text-text-light">Missão {mIndex + 1}/{total}: {cm.title}</p>
        <p className="font-display font-bold text-base text-text-main text-center">{cm.description}</p>
        {/* Page preview */}
        <div className="w-full bg-white border-2 border-gray-300 rounded-xl p-4 min-h-[120px]">
          {placedTags.length === 0 ? <p className="text-text-light text-sm text-center">Arraste elementos aqui</p> : (
            <div className="flex flex-col gap-2">
              {placedTags.map((tag, i) => {
                const el = getElementByTag(tag);
                return (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 group">
                    <span>{el?.emoji}</span>
                    <code className="text-xs font-mono text-secondary flex-1">{el?.example}</code>
                    <button onClick={() => removeElement(i)} className="text-error opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Elements palette */}
        <div className="flex flex-wrap gap-2 justify-center">
          {HTML_ELEMENTS.map((el) => (
            <button key={el.tag} onClick={() => addElement(el.tag)}
              className="flex items-center gap-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm font-body hover:bg-amber-100 active:scale-95 transition-all">
              <span>{el.emoji}</span><span className="font-mono text-xs text-amber-800">&lt;{el.tag}&gt;</span>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={() => setPlacedTags([])}>🗑️ Limpar</Button>
          <Button variant="primary" size="lg" onClick={handleCheck}>✅ Verificar Site</Button>
        </div>
        {feedback && <p className={`text-sm font-body font-semibold text-center px-4 py-2 rounded-xl animate-pop-in ${feedback.includes('🎉') ? 'bg-success/15 text-success' : 'bg-warning/15 text-yellow-700'}`}>{feedback}</p>}
      </div>
    </GameShell>
  );
}
