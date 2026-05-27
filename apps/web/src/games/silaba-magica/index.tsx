import type { GameRegistryEntry } from '@/types/game';
import { silabaMagicaConfig } from './config';
import { SilabaMagicaGame } from './SilabaMagicaGame';

export const silabaMagicaGame: GameRegistryEntry = {
  config: silabaMagicaConfig,
  Component: SilabaMagicaGame,
};
