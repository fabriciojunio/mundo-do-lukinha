'use client';

import { GAME_CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJIS, type GameCategory } from '@/types/game';

interface CategoryFilterProps {
  selected: GameCategory | 'all';
  onSelect: (category: GameCategory | 'all') => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect('all')}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-body font-semibold transition-colors ${
          selected === 'all'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-text-light hover:bg-gray-200'
        }`}
      >
        🎯 Todos
      </button>
      {GAME_CATEGORIES.map((cat: GameCategory) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-body font-semibold transition-colors ${
            selected === cat
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-text-light hover:bg-gray-200'
          }`}
        >
          {CATEGORY_EMOJIS[cat]} {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
