import type { GameRegistryEntry } from '@/types/game';
import { quizAdventureConfig } from './config';
import { QuizAdventureGame } from './QuizAdventureGame';

export const quizAdventureGame: GameRegistryEntry = {
  config: quizAdventureConfig,
  Component: QuizAdventureGame,
};
