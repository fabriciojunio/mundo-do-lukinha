import type { GameRegistryEntry } from '@/types/game';
import { colorLabConfig } from './config';
import { ColorLabGame } from './ColorLabGame';

export const colorLabGame: GameRegistryEntry = {
  config: colorLabConfig,
  Component: ColorLabGame,
};
