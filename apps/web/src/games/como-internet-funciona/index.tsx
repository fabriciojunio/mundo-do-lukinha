import type { GameRegistryEntry } from '@/types/game';
import { comoInternetConfig } from './config';
import { ComoInternetGame } from './ComoInternetGame';
export const comoInternetGame: GameRegistryEntry = { config: comoInternetConfig, Component: ComoInternetGame };
