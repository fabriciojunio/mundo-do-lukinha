import type { GameRegistryEntry } from '@/types/game';
import { towerDefenseConfig } from './config';
import { TowerDefenseGame } from './TowerDefenseGame';
export const towerDefenseGame: GameRegistryEntry = { config: towerDefenseConfig, Component: TowerDefenseGame };
