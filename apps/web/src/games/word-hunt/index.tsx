import type { GameRegistryEntry } from '@/types/game';
import { wordHuntConfig } from './config';
import { WordHuntGame } from './WordHuntGame';

export const wordHuntGame: GameRegistryEntry = {
  config: wordHuntConfig,
  Component: WordHuntGame,
};
