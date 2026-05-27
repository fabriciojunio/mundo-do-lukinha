'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { getGameById } from '@/games/registry';
import { useAgeGroup } from '@/hooks/useAgeGroup';
import { usePlayer } from '@/hooks/usePlayer';
import { Button } from '@/components/ui/Button';
import type { GameResult } from '@/types/game';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const { ageGroup } = useAgeGroup();
  const { addGameResult } = usePlayer();
  const [difficulty] = useState(1);

  const gameId = typeof params.gameId === 'string' ? params.gameId : '';
  const game = getGameById(gameId);

  const handleGameEnd = useCallback(
    (result: GameResult) => {
      addGameResult(gameId, result);
    },
    [gameId, addGameResult],
  );

  const handleBack = useCallback(() => {
    router.push('/jogos');
  }, [router]);

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-4xl mb-4">😕</p>
        <h1 className="font-display font-bold text-2xl text-text-main mb-2">Jogo não encontrado</h1>
        <p className="font-body text-text-light mb-6">Parece que este jogo ainda não existe.</p>
        <Button onClick={() => router.push('/jogos')} variant="primary">
          Ver todos os jogos
        </Button>
      </div>
    );
  }

  const GameComponent = game.Component;

  return (
    <div className="min-h-screen">
      <GameComponent
        ageGroup={ageGroup}
        difficulty={difficulty}
        onGameEnd={handleGameEnd}
        onBack={handleBack}
      />
    </div>
  );
}
