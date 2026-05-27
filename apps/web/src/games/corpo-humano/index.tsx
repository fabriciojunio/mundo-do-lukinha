import type { GameRegistryEntry } from '@/types/game';
import { corpoHumanoConfig } from './config';
import { CorpoHumanoGame } from './CorpoHumanoGame';

export const corpoHumanoGame: GameRegistryEntry = {
  config: corpoHumanoConfig,
  Component: CorpoHumanoGame,
};
