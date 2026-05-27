import type { GameRegistryEntry } from '@/types/game';
import { quebraCabecaConfig } from './config';
import { QuebraCabecaGame } from './QuebraCabecaGame';
export const quebraCabecaGame: GameRegistryEntry = { config: quebraCabecaConfig, Component: QuebraCabecaGame };
