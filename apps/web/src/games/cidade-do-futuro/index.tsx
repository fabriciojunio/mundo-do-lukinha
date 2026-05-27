import type { GameRegistryEntry } from '@/types/game';
import { cidadeDoFuturoConfig } from './config';
import { CidadeDoFuturoGame } from './CidadeDoFuturoGame';
export const cidadeDoFuturoGame: GameRegistryEntry = { config: cidadeDoFuturoConfig, Component: CidadeDoFuturoGame };
