import type { AgeGroup } from '@/types/age-group';
import { AGE_GROUP_CONFIGS } from '@/types/age-group';

export function getButtonClass(ageGroup: AgeGroup): string {
  const config = AGE_GROUP_CONFIGS[ageGroup];
  const size = config.buttonSize;
  if (size >= 80) return 'min-h-[80px] min-w-[80px] text-xl rounded-3xl';
  if (size >= 60) return 'min-h-[60px] min-w-[60px] text-lg rounded-2xl';
  if (size >= 44) return 'min-h-[44px] min-w-[44px] text-base rounded-xl';
  return 'min-h-[36px] min-w-[36px] text-sm rounded-lg';
}

export function getTitleClass(ageGroup: AgeGroup): string {
  const size = AGE_GROUP_CONFIGS[ageGroup].fontSize.title;
  if (size >= 32) return 'text-3xl md:text-4xl';
  if (size >= 28) return 'text-2xl md:text-3xl';
  if (size >= 24) return 'text-xl md:text-2xl';
  return 'text-lg md:text-xl';
}

export function getBodyClass(ageGroup: AgeGroup): string {
  const size = AGE_GROUP_CONFIGS[ageGroup].fontSize.body;
  if (size >= 24) return 'text-xl md:text-2xl';
  if (size >= 20) return 'text-lg md:text-xl';
  if (size >= 16) return 'text-base';
  return 'text-sm';
}

export function getGridCols(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case 'chick':
      return 'grid-cols-1 sm:grid-cols-2';
    case 'explorer':
      return 'grid-cols-2 sm:grid-cols-3';
    case 'adventurer':
      return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
    case 'master':
      return 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5';
  }
}

export function getCardPadding(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case 'chick':
      return 'p-6';
    case 'explorer':
      return 'p-5';
    case 'adventurer':
      return 'p-4';
    case 'master':
      return 'p-3';
  }
}
