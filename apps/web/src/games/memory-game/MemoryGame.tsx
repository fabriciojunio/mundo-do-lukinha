'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import {
  generateBoard,
  checkMatch,
  calculateMemoryScore,
  getPairCountForAge,
  getGridColsForAge,
  type MemoryCard,
} from './logic';
import { memoryGameConfig } from './config';
import { playSound } from '@/lib/sounds';

export function MemoryGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const [cards, setCards] = useState<MemoryCard[]>(() => generateBoard(ageGroup));
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const startTime = useRef(Date.now());
  const totalPairs = getPairCountForAge(ageGroup);
  const gridCols = getGridColsForAge(ageGroup);

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (isChecking || flippedIds.length >= 2) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return;

      const newFlipped = [...flippedIds, cardId];
      setFlippedIds(newFlipped);

      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)));
      playSound('click');

      if (newFlipped.length === 2) {
        setIsChecking(true);
        setMoves((m) => m + 1);

        const card1 = cards.find((c) => c.id === newFlipped[0]);
        const card2 = cards.find((c) => c.id === newFlipped[1]);

        if (card1 && card2 && checkMatch(card1, card2)) {
          playSound('match');
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);

          setCards((prev) =>
            prev.map((c) =>
              c.pairId === card1.pairId ? { ...c, isMatched: true, isFlipped: true } : c,
            ),
          );
          setFlippedIds([]);
          setIsChecking(false);

          if (newMatchedPairs === totalPairs) {
            const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
            const gameResult = calculateMemoryScore(moves + 1, totalPairs, timeSpent, wrongGuesses === 0);
            setResult(gameResult);
            playSound('gameOver');
            onGameEnd(gameResult);
          }
        } else {
          setWrongGuesses((w) => w + 1);
          playSound('wrong');
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                newFlipped.includes(c.id) && !c.isMatched ? { ...c, isFlipped: false } : c,
              ),
            );
            setFlippedIds([]);
            setIsChecking(false);
          }, 800);
        }
      }
    },
    [cards, flippedIds, isChecking, matchedPairs, moves, totalPairs, wrongGuesses, onGameEnd],
  );

  const handlePlayAgain = useCallback(() => {
    setCards(generateBoard(ageGroup));
    setFlippedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsChecking(false);
    setResult(null);
    setWrongGuesses(0);
    startTime.current = Date.now();
  }, [ageGroup]);

  if (result) {
    return (
      <GameOverScreen
        result={result}
        gameName={memoryGameConfig.name}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
      />
    );
  }

  return (
    <GameShell
      gameName={memoryGameConfig.name}
      gameIcon={memoryGameConfig.icon}
      score={matchedPairs * 10}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
        <p className="text-sm font-body text-text-light">
          Jogadas: {moves} | Pares: {matchedPairs}/{totalPairs}
        </p>

        <div
          className="grid gap-2 md:gap-3 w-full max-w-lg"
          style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || isChecking}
              className={`
                aspect-square rounded-xl text-2xl md:text-3xl font-bold
                transition-all duration-300 min-h-[50px]
                flex items-center justify-center
                ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white border-2 border-primary shadow-md rotate-0'
                    : 'bg-gradient-to-br from-secondary to-primary text-white cursor-pointer hover:scale-105 active:scale-95'
                }
                ${card.isMatched ? 'opacity-70 border-success' : ''}
              `}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
