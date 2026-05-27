import type { GameRegistryEntry } from '@/types/game';
import { cuidaBichinhoConfig } from './config';
import { CuidaBichinhoGame } from './CuidaBichinhoGame';
export const cuidaBichinhoGame: GameRegistryEntry = { config: cuidaBichinhoConfig, Component: CuidaBichinhoGame };
