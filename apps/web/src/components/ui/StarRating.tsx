'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  stars: 1 | 2 | 3;
  size?: number;
  animated?: boolean;
}

export function StarRating({ stars, size = 40, animated = true }: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          size={size}
          className={`
            ${i <= stars ? 'fill-sun text-sun' : 'fill-gray-200 text-gray-200'}
            ${animated && i <= stars ? 'animate-pop-in' : ''}
          `}
          style={animated ? { animationDelay: `${i * 0.15}s` } : undefined}
        />
      ))}
    </div>
  );
}
