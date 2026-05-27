import type { GameRegistryEntry } from '@/types/game';
import { respeitoEscolaConfig } from './config';
import { RespeitoEscolaGame } from './RespeitoEscolaGame';
export const respeitoEscolaGame: GameRegistryEntry = { config: respeitoEscolaConfig, Component: RespeitoEscolaGame };
