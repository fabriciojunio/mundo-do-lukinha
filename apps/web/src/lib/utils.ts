import { LEVEL_THRESHOLDS, LEVEL_NAMES, MAX_LEVEL } from './constants';

export function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = MAX_LEVEL; i >= 1; i--) {
    const threshold = LEVEL_THRESHOLDS[i];
    if (threshold !== undefined && xp >= threshold) {
      level = i;
      break;
    }
  }
  return level;
}

export function getXPForNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
  const level = calculateLevel(currentXP);
  if (level >= MAX_LEVEL) {
    return { current: currentXP, needed: currentXP, progress: 1 };
  }
  const currentLevelXP = LEVEL_THRESHOLDS[level] ?? 0;
  const nextLevelXP = LEVEL_THRESHOLDS[level + 1] ?? currentLevelXP;
  const progressInLevel = currentXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progress = xpNeededForLevel > 0 ? progressInLevel / xpNeededForLevel : 1;
  return { current: progressInLevel, needed: xpNeededForLevel, progress: Math.min(progress, 1) };
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[level] ?? 'Lenda';
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getRandomItem<T>(arr: readonly T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index] as T;
}

export function shuffleArray<T>(arr: readonly T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j] as T, shuffled[i] as T];
  }
  return shuffled;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isYesterday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}
