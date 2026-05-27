import type { GameRegistryEntry } from '@/types/game';
import { pixelArtCoderConfig } from './config';
import { PixelArtCoderGame } from './PixelArtCoderGame';
export const pixelArtCoderGame: GameRegistryEntry = { config: pixelArtCoderConfig, Component: PixelArtCoderGame };
