import { usePlayerStore } from '@/stores/playerStore';
import type { AgeGroup, AgeGroupConfig } from '@/types/age-group';
import { AGE_GROUP_CONFIGS } from '@/types/age-group';

export function useAgeGroup(): {
  ageGroup: AgeGroup;
  config: AgeGroupConfig;
} {
  const player = usePlayerStore((s) => s.player);
  const ageGroup: AgeGroup = player?.ageGroup ?? 'explorer';
  const config = AGE_GROUP_CONFIGS[ageGroup];
  return { ageGroup, config };
}
