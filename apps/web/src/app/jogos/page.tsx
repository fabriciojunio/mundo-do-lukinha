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

function SkeletonCards() {
  return (
    <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
      <div className="max-w-5xl mx-auto">
        <div className="h-8 bg-surface-2 rounded-xl w-44 mb-4 animate-pulse" />
        <div className="flex gap-2 mb-6 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 bg-surface-2 rounded-full w-24 shrink-0 animate-pulse" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-3 flex items-center gap-3 animate-pulse">
              <div className="w-14 h-14 bg-surface-2 rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-surface-2 rounded w-3/5 mb-2" />
                <div className="h-3 bg-surface-2 rounded w-full mb-2" />
                <div className="h-5 bg-surface-2 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

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
  );
}

export default function JogosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <Suspense fallback={<SkeletonCards />}>
          <JogosContent />
        </Suspense>
      </div>
      <Navigation />
    </div>
  );
}
