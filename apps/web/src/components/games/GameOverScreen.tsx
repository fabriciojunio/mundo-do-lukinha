'use client';

import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { CoinDisplay } from '@/components/player/CoinDisplay';
import type { GameResult } from '@/types/game';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_GAME_OVER } from '@/lib/constants';

interface GameOverScreenProps {
  result: GameResult;
  gameName: string;
  onPlayAgain: () => void;
  onBack: () => void;
}

export function GameOverScreen({ result, gameName, onPlayAgain, onBack }: GameOverScreenProps) {
  const message = getRandomItem(ENCOURAGEMENT_GAME_OVER);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 max-w-sm mx-auto text-center animate-slide-up">
      <h2 className="font-display font-bold text-2xl text-text-main">{gameName}</h2>
      <p className="text-lg font-body text-text-light">{message}</p>

      <StarRating stars={result.stars} size={48} />

      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-secondary">+{result.xpEarned}</p>
          <p className="text-xs font-body text-text-light">XP</p>
        </div>
        <div className="text-center">
          <CoinDisplay coins={result.coinsEarned} />
          <p className="text-xs font-body text-text-light mt-1">Moedas</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 w-full">
        <div className="flex justify-between text-sm font-body">
          <span className="text-text-light">Pontuação</span>
          <span className="font-bold text-text-main">
            {result.score}/{result.maxScore}
          </span>
        </div>
        <div className="flex justify-between text-sm font-body mt-2">
          <span className="text-text-light">Precisão</span>
          <span className="font-bold text-text-main">{Math.round(result.accuracy * 100)}%</span>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <Button variant="ghost" onClick={onBack} fullWidth>
          Voltar
        </Button>
        <Button variant="primary" onClick={onPlayAgain} fullWidth>
          Jogar de Novo 🔄
        </Button>
      </div>
    </div>
  );
}
