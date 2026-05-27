import type { GameRegistryEntry } from '@/types/game';
import { plataformaLukinhaConfig } from './config';
import { PlataformaLukinhaGame } from './PlataformaLukinhaGame';
export const plataformaLukinhaGame: GameRegistryEntry = { config: plataformaLukinhaConfig, Component: PlataformaLukinhaGame };
