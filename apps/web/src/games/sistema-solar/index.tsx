import type { GameRegistryEntry } from '@/types/game';
import { sistemaSolarConfig } from './config';
import { SistemaSolarGame } from './SistemaSolarGame';

export const sistemaSolarGame: GameRegistryEntry = {
  config: sistemaSolarConfig,
  Component: SistemaSolarGame,
};
