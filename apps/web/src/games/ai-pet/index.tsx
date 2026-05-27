import type { GameRegistryEntry } from '@/types/game';
import { aiPetConfig } from './config';
import { AIPetGame } from './AIPetGame';
export const aiPetGame: GameRegistryEntry = { config: aiPetConfig, Component: AIPetGame };
