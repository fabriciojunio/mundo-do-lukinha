'use client';

import { getLevelName } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
}

export function LevelBadge({ level }: LevelBadgeProps) {
  const bgColor =
    level >= 15 ? 'bg-sun text-yellow-900' : level >= 10 ? 'bg-secondary text-white' : level >= 5 ? 'bg-primary text-white' : 'bg-gray-200 text-text-main';

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-display font-bold ${bgColor}`}>
      <span>⭐</span>
      <span>{getLevelName(level)}</span>
    </span>
  );
}
