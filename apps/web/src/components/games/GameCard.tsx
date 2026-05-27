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
      {/* Mobile: horizontal | Desktop: vertical */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-primary/50 hover:bg-surface-2 cursor-pointer group">

        {/* Mobile layout: horizontal */}
        <div className="flex sm:hidden items-center gap-3 p-3">
          <div
            className="w-14 h-14 shrink-0 flex items-center justify-center text-3xl rounded-xl"
            style={{ backgroundColor: `${config.color}18` }}
          >
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-text-main text-sm leading-tight group-hover:text-primary transition-colors truncate">
              {config.name}
            </h3>
            <p className="text-xs font-body text-text-light mt-0.5 line-clamp-1">{config.description}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="text-xs font-body font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}
              >
                {CATEGORY_LABELS[config.category]}
              </span>
              <span className="text-xs text-text-light font-body">{config.estimatedMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Desktop layout: vertical */}
        <div className="hidden sm:block">
          <div
            className="w-full h-20 flex items-center justify-center text-4xl"
            style={{ backgroundColor: `${config.color}18` }}
          >
            {config.icon}
          </div>
          <div className="p-3">
            <h3 className="font-display font-bold text-text-main text-sm leading-tight group-hover:text-primary transition-colors">
              {config.name}
            </h3>
            <p className="text-xs font-body text-text-light mt-1 line-clamp-2">{config.description}</p>
            <div className="flex items-center justify-between mt-2">
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

      </div>
    </Link>
  );
}
