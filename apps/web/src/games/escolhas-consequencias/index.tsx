import type { GameRegistryEntry } from '@/types/game';
import { escolhasConsequenciasConfig } from './config';
import { EscolhasConsequenciasGame } from './EscolhasConsequenciasGame';
export const escolhasConsequenciasGame: GameRegistryEntry = { config: escolhasConsequenciasConfig, Component: EscolhasConsequenciasGame };
