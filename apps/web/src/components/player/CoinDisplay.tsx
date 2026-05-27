'use client';

import { formatNumber } from '@/lib/utils';

interface CoinDisplayProps {
  coins: number;
  size?: 'sm' | 'md';
}

export function CoinDisplay({ coins, size = 'md' }: CoinDisplayProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 bg-sun/15 rounded-full font-body font-bold text-yellow-700 ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span>🪙</span>
      <span>{formatNumber(coins)}</span>
    </div>
  );
}
