import type { GameRegistryEntry } from '@/types/game';
import { cofrinhoEspertoConfig } from './config';
import { CofrinhoEspertoGame } from './CofrinhoEspertoGame';
export const cofrinhoEspertoGame: GameRegistryEntry = { config: cofrinhoEspertoConfig, Component: CofrinhoEspertoGame };
