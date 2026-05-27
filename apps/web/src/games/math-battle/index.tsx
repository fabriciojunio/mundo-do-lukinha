import type { GameRegistryEntry } from '@/types/game';
import { mathBattleConfig } from './config';
import { MathBattleGame } from './MathBattleGame';

export const mathBattleGame: GameRegistryEntry = {
  config: mathBattleConfig,
  Component: MathBattleGame,
};
