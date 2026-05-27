import type { GameRegistryEntry } from '@/types/game';
import { geometriaBuilderConfig } from './config';
import { GeometriaBuilderGame } from './GeometriaBuilderGame';
export const geometriaBuilderGame: GameRegistryEntry = { config: geometriaBuilderConfig, Component: GeometriaBuilderGame };
