import type { AgeGroup } from './age-group';

export const GAME_CATEGORIES = [
  'math',
  'portuguese',
  'science',
  'geography',
  'history',
  'english',
  'arts',
  'music',
  'programming',
  'life-skills',
  'fun',
] as const;

export type GameCategory = (typeof GAME_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<GameCategory, string> = {
  math: 'Matemática',
  portuguese: 'Português',
  science: 'Ciências',
  geography: 'Geografia',
  history: 'História',
  english: 'Inglês',
  arts: 'Artes',
  music: 'Música',
  programming: 'Programação',
  'life-skills': 'Habilidades de Vida',
  fun: 'Diversão',
};

export const CATEGORY_EMOJIS: Record<GameCategory, string> = {
  math: '🔢',
  portuguese: '📖',
  science: '🔬',
  geography: '🌍',
  history: '🏛️',
  english: '🇬🇧',
  arts: '🎨',
  music: '🎵',
  programming: '💻',
  'life-skills': '💡',
  fun: '🎮',
};

export interface DifficultyRange {
  min: number;
  max: number;
}

export interface GameConfig {
  id: string;
  name: string;
  description: string;
  category: GameCategory;
  ageGroups: AgeGroup[];
  icon: string;
  color: string;
  difficulty: DifficultyRange;
  estimatedMinutes: number;
  skills: string[];
  version: string;
}

export interface GameResult {
  score: number;
  maxScore: number;
  timeSpent: number;
  accuracy: number;
  xpEarned: number;
  coinsEarned: number;
  achievements: string[];
  stars: 1 | 2 | 3;
}

export interface GameProps {
  ageGroup: AgeGroup;
  difficulty: number;
  onGameEnd: (result: GameResult) => void;
  onBack: () => void;
}

export interface GameRegistryEntry {
  config: GameConfig;
  Component: React.ComponentType<GameProps>;
}

export function calculateStars(accuracy: number): 1 | 2 | 3 {
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.7) return 2;
  return 1;
}

export function calculateXP(stars: 1 | 2 | 3): number {
  if (stars === 3) return 50;
  if (stars === 2) return 25;
  return 10;
}

export function calculateCoins(stars: 1 | 2 | 3): number {
  if (stars === 3) return 20;
  if (stars === 2) return 10;
  return 5;
}
