'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { GameGrid } from '@/components/games/GameGrid';
import { CategoryFilter } from '@/components/games/CategoryFilter';
import { useAgeGroup } from '@/hooks/useAgeGroup';
import { gameRegistry, getGamesForAgeGroup } from '@/games/registry';
import type { GameCategory } from '@/types/game';

export default function JogosPage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'all'>('all');
  const { ageGroup } = useAgeGroup();

  const filteredGames = useMemo(() => {
    let games = getGamesForAgeGroup(ageGroup);
    if (games.length === 0) games = gameRegistry;
    if (selectedCategory !== 'all') {
      games = games.filter((g) => g.config.category === selectedCategory);
    }
    return games;
  }, [ageGroup, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-text-main mb-4">
              🎮 Todos os Jogos
            </h1>

            <div className="mb-6">
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            <GameGrid games={filteredGames} />
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
}
