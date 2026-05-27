import type { GameRegistryEntry } from '@/types/game';
import { missoesConfig } from './config';
import { MissoesDoDiaGame } from './MissoesDoDiaGame';
export const missoesDoDiaGame: GameRegistryEntry = { config: missoesConfig, Component: MissoesDoDiaGame };
