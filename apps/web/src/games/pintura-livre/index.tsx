'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { pinturaLivreConfig, PAINT_COLORS, BRUSH_SIZES, calculatePaintScore } from './logic';
import { playSound } from '@/lib/sounds';

export function PinturaLivreGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState(0);
  const [colorsUsed, setColorsUsed] = useState(new Set<string>());
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current; if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (canvas.width / rect.width), y: (e.clientY - rect.top) * (canvas.height / rect.height) };
  };

  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.strokeStyle = color; ctx.lineWidth = brushSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (lastPos.current) { ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(x, y); ctx.stroke(); }
    lastPos.current = { x, y };
  }, [color, brushSize]);

  const handlePointerDown = (e: React.PointerEvent) => { setIsDrawing(true); const pos = getPos(e); lastPos.current = pos; draw(pos.x, pos.y); setStrokes((s) => s + 1); setColorsUsed((prev) => new Set([...prev, color])); };
  const handlePointerMove = (e: React.PointerEvent) => { if (!isDrawing) return; const pos = getPos(e); draw(pos.x, pos.y); };
  const handlePointerUp = () => { setIsDrawing(false); lastPos.current = null; };

  const handleClear = () => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, canvas.width, canvas.height); };

  const handleFinish = useCallback(() => {
    const ts = Math.floor((Date.now() - startTime.current) / 1000);
    const r = calculatePaintScore(strokes, colorsUsed.size, ts);
    setResult(r); playSound('gameOver'); onGameEnd(r);
  }, [strokes, colorsUsed, onGameEnd]);

  const handlePlayAgain = useCallback(() => { handleClear(); setStrokes(0); setColorsUsed(new Set()); setResult(null); startTime.current = Date.now(); }, []);
  if (result) return <GameOverScreen result={result} gameName={pinturaLivreConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;

  return (
    <div className="flex flex-col items-center gap-3 p-4 h-full">
      <div className="flex justify-between w-full max-w-2xl"><button onClick={onBack} className="text-sm text-text-light">← Voltar</button><span className="font-display font-bold">🖌️ Pintura Livre</span><span className="text-sm text-text-light">{strokes} traços</span></div>
      <canvas ref={canvasRef} width={600} height={400} className="w-full max-w-2xl h-auto rounded-2xl border-2 border-gray-200 cursor-crosshair touch-none bg-white"
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} />
      <div className="flex gap-1 flex-wrap justify-center">
        {PAINT_COLORS.map((c) => (
          <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-text-main scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
        ))}
      </div>
      <div className="flex gap-2 items-center">
        {BRUSH_SIZES.map((s) => (
          <button key={s} onClick={() => setBrushSize(s)} className={`rounded-full bg-gray-800 ${brushSize === s ? 'ring-2 ring-primary' : ''}`} style={{ width: s + 8, height: s + 8 }} />
        ))}
      </div>
      <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={handleClear}>🗑️ Limpar</Button><Button variant="primary" size="lg" onClick={handleFinish}>✅ Pronto!</Button></div>
    </div>
  );
}

import type { GameRegistryEntry } from '@/types/game';
export const pinturaLivreGame: GameRegistryEntry = { config: pinturaLivreConfig, Component: PinturaLivreGame };
