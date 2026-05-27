import type { GameRegistryEntry } from '@/types/game';
import { lojinhaLukinhaConfig } from './config';
import { LojinhaLukinhaGame } from './LojinhaLukinhaGame';
export const lojinhaLukinhaGame: GameRegistryEntry = { config: lojinhaLukinhaConfig, Component: LojinhaLukinhaGame };
