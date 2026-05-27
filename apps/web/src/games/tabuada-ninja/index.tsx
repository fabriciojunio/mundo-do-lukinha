import type { GameRegistryEntry } from '@/types/game';
import { tabuadaNinjaConfig } from './config';
import { TabuadaNinjaGame } from './TabuadaNinjaGame';

export const tabuadaNinjaGame: GameRegistryEntry = {
  config: tabuadaNinjaConfig,
  Component: TabuadaNinjaGame,
};
