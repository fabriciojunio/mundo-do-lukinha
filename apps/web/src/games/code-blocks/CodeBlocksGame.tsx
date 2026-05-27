'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { getLevelsForAge, executeCommands, COMMAND_LABELS, COMMAND_EMOJIS, type Command, type CodeLevel, type ExecutionStep, calculateCodeScore } from './logic';
import { codeBlocksConfig } from './config';
import { playSound } from '@/lib/sounds';

const DIR_ARROWS: Record<string, string> = { up: '↑', down: '↓', left: '←', right: '→' };

export function CodeBlocksGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const levels = useRef<CodeLevel[]>(getLevelsForAge(ageGroup));
  const [lIndex, setLIndex] = useState(0);
  const [commands, setCommands] = useState<Command[]>([]);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [completed, setCompleted] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const currentLevel = levels.current[lIndex];
  const totalLevels = levels.current.length;

  const addCommand = useCallback((cmd: Command) => {
    if (!currentLevel || running) return;
    if (commands.length >= currentLevel.maxCommands) return;
    setCommands((prev) => [...prev, cmd]);
    playSound('click');
  }, [commands, currentLevel, running]);

  const removeLastCommand = useCallback(() => {
    if (running) return;
    setCommands((prev) => prev.slice(0, -1));
  }, [running]);

  const clearCommands = useCallback(() => {
    if (running) return;
    setCommands([]);
    setSteps([]);
    setStepIndex(-1);
    setFeedback(null);
  }, [running]);

  const runProgram = useCallback(() => {
    if (!currentLevel || commands.length === 0 || running) return;
    const { steps: execSteps, reachedGoal } = executeCommands(commands, currentLevel);
    setSteps(execSteps);
    setRunning(true);
    setFeedback(null);

    let i = 0;
    const interval = setInterval(() => {
      setStepIndex(i);
      const step = execSteps[i];
      if (step && !step.success) playSound('wrong');
      else playSound('click');
      i++;
      if (i >= execSteps.length) {
        clearInterval(interval);
        setRunning(false);
        if (reachedGoal) {
          playSound('correct');
          setFeedback('🎉 Parabéns! O robô chegou ao objetivo!');
          const newCompleted = completed + 1;
          setCompleted(newCompleted);
          setTimeout(() => {
            if (lIndex + 1 >= totalLevels) {
              const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
              const r = calculateCodeScore(newCompleted, totalLevels, commands.length, timeSpent);
              setResult(r); playSound('gameOver'); onGameEnd(r);
            } else {
              setLIndex((l) => l + 1); setCommands([]); setSteps([]); setStepIndex(-1); setFeedback(null);
            }
          }, 1500);
        } else {
          playSound('wrong');
          setFeedback('🤔 O robô não chegou! Tente outra sequência.');
        }
      }
    }, 500);
  }, [currentLevel, commands, running, completed, lIndex, totalLevels, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    levels.current = getLevelsForAge(ageGroup);
    setLIndex(0); setCommands([]); setRunning(false); setSteps([]); setStepIndex(-1); setCompleted(0); setFeedback(null); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (result) return <GameOverScreen result={result} gameName={codeBlocksConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!currentLevel) return null;

  const robotPos = stepIndex >= 0 && steps[stepIndex] ? steps[stepIndex].pos : currentLevel.start;
  const robotDir = stepIndex >= 0 && steps[stepIndex] ? steps[stepIndex].direction : currentLevel.startDir;

  return (
    <GameShell gameName={codeBlocksConfig.name} gameIcon={codeBlocksConfig.icon} score={completed * 25} onBack={onBack}>
      <div className="flex flex-col lg:flex-row items-start justify-center gap-4 p-4 h-full">
        {/* Grid */}
        <div className="flex flex-col items-center gap-2">
          <p className="font-display font-bold text-sm text-text-main">Nível {lIndex + 1}: {currentLevel.name}</p>
          <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${currentLevel.grid[0]?.length ?? 1}, 48px)` }}>
            {currentLevel.grid.map((row, r) =>
              row.map((cell, c) => {
                const isRobot = robotPos.row === r && robotPos.col === c;
                const isGoal = currentLevel.goal.row === r && currentLevel.goal.col === c;
                return (
                  <div key={`${r}-${c}`} className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                    cell === 'wall' ? 'bg-gray-700' : isGoal ? 'bg-success/30 border-2 border-success' : 'bg-gray-100'
                  }`}>
                    {isRobot && <span className="text-2xl">{DIR_ARROWS[robotDir] ?? '🤖'}</span>}
                    {!isRobot && isGoal && '⭐'}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <p className="text-xs font-body text-text-light">Comandos ({commands.length}/{currentLevel.maxCommands})</p>
          <div className="flex flex-wrap gap-2">
            {currentLevel.availableCommands.map((cmd) => (
              <button key={cmd} onClick={() => addCommand(cmd)} disabled={running || commands.length >= currentLevel.maxCommands}
                className="px-3 py-2 bg-cyan-100 text-cyan-800 rounded-lg text-sm font-body font-semibold hover:bg-cyan-200 active:scale-95 transition-all disabled:opacity-40">
                {COMMAND_EMOJIS[cmd]} {COMMAND_LABELS[cmd].split(' ').slice(1).join(' ')}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-3 min-h-[60px]">
            {commands.length === 0 ? (
              <p className="text-xs font-body text-text-light text-center">Adicione comandos acima</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {commands.map((cmd, i) => (
                  <span key={i} className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    stepIndex === i ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-text-main'
                  }`}>
                    {COMMAND_EMOJIS[cmd]}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={removeLastCommand} disabled={running || commands.length === 0}>↩️ Desfazer</Button>
            <Button variant="ghost" size="sm" onClick={clearCommands} disabled={running}>🗑️ Limpar</Button>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={runProgram} disabled={running || commands.length === 0}>
            {running ? '⏳ Executando...' : '▶️ Rodar Programa'}
          </Button>

          {feedback && (
            <p className={`text-sm font-body font-semibold text-center px-3 py-2 rounded-xl animate-pop-in ${
              feedback.includes('Parabéns') ? 'bg-success/15 text-success' : 'bg-warning/15 text-yellow-700'
            }`}>{feedback}</p>
          )}
        </div>
      </div>
    </GameShell>
  );
}
