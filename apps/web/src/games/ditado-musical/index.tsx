import type { GameRegistryEntry } from '@/types/game';
import { ditadoMusicalConfig } from './config';
import { DitadoMusicalGame } from './DitadoMusicalGame';

export const ditadoMusicalGame: GameRegistryEntry = {
  config: ditadoMusicalConfig,
  Component: DitadoMusicalGame,
};
