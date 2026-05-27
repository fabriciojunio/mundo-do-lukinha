import type { GameRegistryEntry } from '@/types/game';
import { codeBlocksConfig } from './config';
import { CodeBlocksGame } from './CodeBlocksGame';
export const codeBlocksGame: GameRegistryEntry = { config: codeBlocksConfig, Component: CodeBlocksGame };
