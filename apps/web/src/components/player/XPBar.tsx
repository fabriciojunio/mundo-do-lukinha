'use client';

import { ProgressBar } from '@/components/ui/ProgressBar';

interface XPBarProps {
  current: number;
  needed: number;
  level: number;
}

export function XPBar({ current, needed, level }: XPBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-body font-semibold text-secondary">Nível {level}</span>
        <span className="text-xs font-body text-text-light">
          {current}/{needed} XP
        </span>
      </div>
      <ProgressBar value={current} max={needed} color="bg-secondary" height="sm" />
    </div>
  );
}
