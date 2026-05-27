'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Pause, Play, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatTime } from '@/lib/utils';

interface GameShellProps {
  gameName: string;
  gameIcon: string;
  score: number;
  showTimer?: boolean;
  timerSeconds?: number;
  onTimerEnd?: () => void;
  onBack: () => void;
  children: ReactNode;
}

export function GameShell({
  gameName,
  gameIcon,
  score,
  showTimer = false,
  timerSeconds = 60,
  onTimerEnd,
  onBack,
  children,
}: GameShellProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  useEffect(() => {
    if (!showTimer || isPaused || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          onTimerEnd?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimer, isPaused, timeLeft, onTimerEnd]);

  const togglePause = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-140px)] bg-bg">
      <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-text-light hover:text-text-main transition-colors min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-body hidden sm:inline">Voltar</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl">{gameIcon}</span>
          <span className="font-display font-bold text-text-main">{gameName}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-primary text-lg">{score} pts</span>
          {showTimer && (
            <span
              className={`font-mono font-bold text-sm px-2 py-1 rounded-lg ${
                timeLeft <= 10 ? 'bg-error/20 text-error animate-pulse' : 'bg-surface-2 text-text-main'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          )}
          <button
            onClick={togglePause}
            className="p-2 rounded-lg hover:bg-surface-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-text-light hover:text-text-main"
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {isPaused && (
          <div className="absolute inset-0 z-30 bg-bg/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <p className="text-4xl">⏸️</p>
            <p className="font-display font-bold text-xl text-text-main">Jogo Pausado</p>
            <Button onClick={togglePause} variant="primary" size="lg">
              Continuar
            </Button>
            <Button onClick={onBack} variant="ghost" size="md">
              Sair do Jogo
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
