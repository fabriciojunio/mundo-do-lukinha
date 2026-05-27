import type { GameRegistryEntry } from '@/types/game';
import { binaryHeroConfig } from './config';
import { BinaryHeroGame } from './BinaryHeroGame';
export const binaryHeroGame: GameRegistryEntry = { config: binaryHeroConfig, Component: BinaryHeroGame };
