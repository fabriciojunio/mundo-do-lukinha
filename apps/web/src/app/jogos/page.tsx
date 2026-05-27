'use client';

import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { GameGrid } from '@/components/games/GameGrid';
import { CategoryFilter } from '@/components/games/CategoryFilter';
import { useAgeGroup } from '@/hooks/useAgeGroup';
import { gameRegistry, getGamesForAgeGroup } from '@/games/registry';
import { GAME_CATEGORIES, type GameCategory } from '@/types/game';

function JogosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ageGroup } = useAgeGroup();

  const rawParam = searchParams.get('categoria');
  const selectedCategory: GameCategory | 'all' =
    rawParam && (GAME_CATEGORIES as readonly string[]).includes(rawParam)
      ? (rawParam as GameCategory)
      : 'all';

  const handleSelect = (cat: GameCategory | 'all') => {
    if (cat === 'all') {
      router.push('/jogos');
    } else {
      router.push(`/jogos?categoria=${cat}`);
    }
  };

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
              <CategoryFilter selected={selectedCategory} onSelect={handleSelect} />
            </div>

            <GameGrid games={filteredGames} />
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
}

export default function JogosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <JogosContent />
    </Suspense>
  );
}
