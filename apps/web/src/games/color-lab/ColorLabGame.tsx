'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import {
  getMissions,
  getAvailableColors,
  mixColors,
  isColorClose,
  colorToCSS,
  type RGB,
  type ColorMission,
  calculateColorLabScore,
} from './logic';
import { colorLabConfig } from './config';
import { playSound } from '@/lib/sounds';

export function ColorLabGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const missions = useRef(getMissions(ageGroup));
  const availableColors = getAvailableColors(ageGroup);
  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState<RGB[]>([]);
  const [mixResult, setMixResult] = useState<RGB | null>(null);
  const [mixesMade, setMixesMade] = useState(0);
  const [completedMissions, setCompletedMissions] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const currentMission: ColorMission | undefined = missions.current[missionIndex];
  const isChick = ageGroup === 'chick';

  const handleColorSelect = useCallback(
    (color: RGB) => {
      if (!currentMission) return;

      if (isChick) {
        // For chick: just identify colors
        if (isColorClose(currentMission.targetColor, color, 10)) {
          playSound('correct');
          setFeedback('Isso mesmo! 🎉');
          const newCompleted = completedMissions + 1;
          setCompletedMissions(newCompleted);

          setTimeout(() => {
            if (missionIndex + 1 >= missions.current.length) {
              const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
              const gameResult = calculateColorLabScore(newCompleted, missions.current.length, mixesMade, timeSpent);
              setResult(gameResult);
              playSound('gameOver');
              onGameEnd(gameResult);
            } else {
              setMissionIndex((i) => i + 1);
              setFeedback(null);
            }
          }, 1000);
        } else {
          playSound('wrong');
          setFeedback('Tenta outra cor! 💪');
          setTimeout(() => setFeedback(null), 800);
        }
        return;
      }

      // For explorer+: mix colors
      const newSelected = [...selectedColors, color];
      setSelectedColors(newSelected);

      if (newSelected.length === 2) {
        const mixed = mixColors(newSelected[0]!, newSelected[1]!);
        setMixResult(mixed);
        setMixesMade((m) => m + 1);

        if (isColorClose(currentMission.targetColor, mixed, 60)) {
          playSound('correct');
          setFeedback(`Perfeito! Você criou ${currentMission.targetName}! 🎨`);
          const newCompleted = completedMissions + 1;
          setCompletedMissions(newCompleted);

          setTimeout(() => {
            if (missionIndex + 1 >= missions.current.length) {
              const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
              const gameResult = calculateColorLabScore(newCompleted, missions.current.length, mixesMade + 1, timeSpent);
              setResult(gameResult);
              playSound('gameOver');
              onGameEnd(gameResult);
            } else {
              setMissionIndex((i) => i + 1);
              setSelectedColors([]);
              setMixResult(null);
              setFeedback(null);
            }
          }, 1500);
        } else {
          playSound('wrong');
          setFeedback('Hmm, não é essa cor... Tenta de novo! 🌈');
          setTimeout(() => {
            setSelectedColors([]);
            setMixResult(null);
            setFeedback(null);
          }, 1200);
        }
      }
    },
    [currentMission, selectedColors, isChick, completedMissions, missionIndex, mixesMade, onGameEnd],
  );

  const handlePlayAgain = useCallback(() => {
    missions.current = getMissions(ageGroup);
    setMissionIndex(0);
    setSelectedColors([]);
    setMixResult(null);
    setMixesMade(0);
    setCompletedMissions(0);
    setFeedback(null);
    setResult(null);
    startTime.current = Date.now();
  }, [ageGroup]);

  if (result) {
    return (
      <GameOverScreen
        result={result}
        gameName={colorLabConfig.name}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
      />
    );
  }

  if (!currentMission) return null;

  return (
    <GameShell
      gameName={colorLabConfig.name}
      gameIcon={colorLabConfig.icon}
      score={completedMissions * 20}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="text-center">
          <p className="font-display font-bold text-xl text-text-main mb-2">
            Missão {missionIndex + 1}/{missions.current.length}
          </p>
          <p className="font-body text-lg text-text-light">{currentMission.hint}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs font-body text-text-light mb-1">Objetivo</p>
            <div
              className="w-20 h-20 rounded-2xl border-4 border-gray-200 shadow-inner"
              style={{ backgroundColor: colorToCSS(currentMission.targetColor) }}
            />
            <p className="text-sm font-display font-bold mt-1">{currentMission.targetName}</p>
          </div>

          {mixResult && (
            <>
              <span className="text-2xl">=</span>
              <div className="text-center">
                <p className="text-xs font-body text-text-light mb-1">Sua mistura</p>
                <div
                  className="w-20 h-20 rounded-2xl border-4 border-primary shadow-inner animate-pop-in"
                  style={{ backgroundColor: colorToCSS(mixResult) }}
                />
              </div>
            </>
          )}
        </div>

        {feedback && (
          <p className="font-body font-semibold text-center animate-pop-in px-4 py-2 rounded-xl bg-gray-50">
            {feedback}
          </p>
        )}

        {!isChick && selectedColors.length === 1 && (
          <p className="text-sm font-body text-text-light">Agora escolha a segunda cor para misturar!</p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {availableColors.map(({ name, color }) => (
            <button
              key={name}
              onClick={() => handleColorSelect(color)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition-colors active:scale-95"
            >
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-white shadow-md transition-transform hover:scale-110"
                style={{ backgroundColor: colorToCSS(color) }}
              />
              <span className="text-xs font-body font-semibold text-text-main">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
