import type { GameRegistryEntry } from '@/types/game';
import { maquinaDoTempoConfig } from './config';
import { MaquinaDoTempoGame } from './MaquinaDoTempoGame';

export const maquinaDoTempoGame: GameRegistryEntry = {
  config: maquinaDoTempoConfig,
  Component: MaquinaDoTempoGame,
};
