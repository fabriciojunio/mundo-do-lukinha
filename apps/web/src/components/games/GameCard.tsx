'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { GameConfig } from '@/types/game';
import { CATEGORY_LABELS } from '@/types/game';
import { AGE_GROUP_CONFIGS, type AgeGroup } from '@/types/age-group';

interface GameCardProps {
  config: GameConfig;
}

export function GameCard({ config }: GameCardProps) {
  return (
    <Link href={`/jogos/${config.id}`}>
      <Card hover padding="md" className="h-full">
        <div className="flex flex-col gap-3">
          <div
            className="w-full aspect-video rounded-xl flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${config.color}20` }}
          >
            {config.icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-text-main text-lg leading-tight">{config.name}</h3>
            <p className="text-sm font-body text-text-light mt-1 line-clamp-2">{config.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="accent" size="sm">
              {CATEGORY_LABELS[config.category]}
            </Badge>
            <div className="flex gap-0.5">
              {config.ageGroups.map((ag: AgeGroup) => (
                <span key={ag} className="text-sm" title={AGE_GROUP_CONFIGS[ag].labelPt}>
                  {AGE_GROUP_CONFIGS[ag].emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
