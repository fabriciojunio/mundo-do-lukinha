'use client';

import { GameCard } from './GameCard';
import type { GameRegistryEntry } from '@/types/game';

interface GameGridProps {
  games: GameRegistryEntry[];
}

export function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-body text-text-light">Nenhum jogo encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
      {games.map((game) => (
        <GameCard key={game.config.id} config={game.config} />
      ))}
    </div>
  );
}
