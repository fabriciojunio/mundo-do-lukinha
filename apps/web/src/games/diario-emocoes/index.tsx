import type { GameRegistryEntry } from '@/types/game';
import { diarioEmocoesConfig } from './config';
import { DiarioEmocoesGame } from './DiarioEmocoesGame';
export const diarioEmocoesGame: GameRegistryEntry = { config: diarioEmocoesConfig, Component: DiarioEmocoesGame };
