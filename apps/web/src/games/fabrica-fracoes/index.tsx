import type { GameRegistryEntry } from '@/types/game';
import { fabricaFracoesConfig } from './config';
import { FabricaFracoesGame } from './FabricaFracoesGame';

export const fabricaFracoesGame: GameRegistryEntry = {
  config: fabricaFracoesConfig,
  Component: FabricaFracoesGame,
};
