import type { GameRegistryEntry } from '@/types/game';
import { corridaMalucaConfig } from './config';
import { CorridaMalucaGame } from './CorridaMalucaGame';
export const corridaMalucaGame: GameRegistryEntry = { config: corridaMalucaConfig, Component: CorridaMalucaGame };
