import type { GameRegistryEntry } from '@/types/game';
import { construtorSitesConfig } from './config';
import { ConstrutorSitesGame } from './ConstrutorSitesGame';
export const construtorSitesGame: GameRegistryEntry = { config: construtorSitesConfig, Component: ConstrutorSitesGame };
