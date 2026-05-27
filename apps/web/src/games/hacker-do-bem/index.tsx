import type { GameRegistryEntry } from '@/types/game';
import { hackerDoBemConfig } from './config';
import { HackerDoBemGame } from './HackerDoBemGame';
export const hackerDoBemGame: GameRegistryEntry = { config: hackerDoBemConfig, Component: HackerDoBemGame };
