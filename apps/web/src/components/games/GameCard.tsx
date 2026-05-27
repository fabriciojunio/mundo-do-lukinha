'use client';

import Link from 'next/link';
import type { GameConfig } from '@/types/game';
import { CATEGORY_LABELS } from '@/types/game';

interface GameCardProps {
  config: GameConfig;
}

export function GameCard({ config }: GameCardProps) {
  return (
    <Link href={`/jogos/${config.id}`}>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-primary/50 hover:bg-surface-2 cursor-pointer group">
        <div
          className="w-full h-24 flex items-center justify-center text-5xl"
          style={{ backgroundColor: `${config.color}18` }}
        >
          {config.icon}
        </div>
        <div className="p-4">
          <h3 className="font-display font-bold text-text-main text-base leading-tight group-hover:text-primary transition-colors">
            {config.name}
          </h3>
          <p className="text-xs font-body text-text-light mt-1 line-clamp-2">{config.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span
              className="text-xs font-body font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${config.color}20`, color: config.color }}
            >
              {CATEGORY_LABELS[config.category]}
            </span>
            <span className="text-xs text-text-light font-body">{config.estimatedMinutes} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
