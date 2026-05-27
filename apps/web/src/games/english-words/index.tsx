import type { GameRegistryEntry } from '@/types/game';
import { englishWordsConfig } from './config';
import { EnglishWordsGame } from './EnglishWordsGame';

export const englishWordsGame: GameRegistryEntry = {
  config: englishWordsConfig,
  Component: EnglishWordsGame,
};
