import type { GameRegistryEntry } from '@/types/game';
import { memoryGameConfig } from './config';
import { MemoryGame } from './MemoryGame';

export const memoryGameGame: GameRegistryEntry = {
  config: memoryGameConfig,
  Component: MemoryGame,
};
