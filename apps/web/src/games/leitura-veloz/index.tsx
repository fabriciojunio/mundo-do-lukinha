import type { GameRegistryEntry } from '@/types/game';
import { leituraVelozConfig } from './config';
import { LeituraVelozGame } from './LeituraVelozGame';
export const leituraVelozGame: GameRegistryEntry = { config: leituraVelozConfig, Component: LeituraVelozGame };
