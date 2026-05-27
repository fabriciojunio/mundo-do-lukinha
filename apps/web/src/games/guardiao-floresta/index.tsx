import type { GameRegistryEntry } from '@/types/game';
import { guardiaoFlorestaConfig } from './config';
import { GuardiaoFlorestaGame } from './GuardiaoFlorestaGame';
export const guardiaoFlorestaGame: GameRegistryEntry = { config: guardiaoFlorestaConfig, Component: GuardiaoFlorestaGame };
