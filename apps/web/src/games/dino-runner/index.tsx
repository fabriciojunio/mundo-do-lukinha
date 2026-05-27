import type { GameRegistryEntry } from '@/types/game';
import { dinoRunnerConfig } from './config';
import { DinoRunnerGame } from './DinoRunnerGame';

export const dinoRunnerGame: GameRegistryEntry = {
  config: dinoRunnerConfig,
  Component: DinoRunnerGame,
};
