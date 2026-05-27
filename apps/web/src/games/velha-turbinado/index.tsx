import type { GameRegistryEntry } from '@/types/game';
import { velhaTurbinadoConfig } from './config';
import { VelhaTurbinadoGame } from './VelhaTurbinadoGame';
export const velhaTurbinadoGame: GameRegistryEntry = { config: velhaTurbinadoConfig, Component: VelhaTurbinadoGame };
