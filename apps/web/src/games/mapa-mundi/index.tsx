import type { GameRegistryEntry } from '@/types/game';
import { mapaMundiConfig } from './config';
import { MapaMundiGame } from './MapaMundiGame';

export const mapaMundiGame: GameRegistryEntry = {
  config: mapaMundiConfig,
  Component: MapaMundiGame,
};
