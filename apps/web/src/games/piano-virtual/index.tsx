import type { GameRegistryEntry } from '@/types/game';
import { pianoVirtualConfig } from './config';
import { PianoVirtualGame } from './PianoVirtualGame';

export const pianoVirtualGame: GameRegistryEntry = {
  config: pianoVirtualConfig,
  Component: PianoVirtualGame,
};
