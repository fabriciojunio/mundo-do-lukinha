export const AGE_GROUPS = ['chick', 'explorer', 'adventurer', 'master'] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export interface AgeGroupConfig {
  id: AgeGroup;
  emoji: string;
  label: string;
  labelPt: string;
  minAge: number;
  maxAge: number;
  fontSize: {
    title: number;
    body: number;
    button: number;
  };
  buttonSize: number;
  showText: boolean;
  showTimer: boolean;
  useAudio: boolean;
}

export const AGE_GROUP_CONFIGS: Record<AgeGroup, AgeGroupConfig> = {
  chick: {
    id: 'chick',
    emoji: '🐣',
    label: 'Chick',
    labelPt: 'Pintinho',
    minAge: 3,
    maxAge: 5,
    fontSize: { title: 32, body: 24, button: 20 },
    buttonSize: 80,
    showText: false,
    showTimer: false,
    useAudio: true,
  },
  explorer: {
    id: 'explorer',
    emoji: '🦊',
    label: 'Explorer',
    labelPt: 'Explorador',
    minAge: 6,
    maxAge: 8,
    fontSize: { title: 28, body: 20, button: 18 },
    buttonSize: 60,
    showText: true,
    showTimer: false,
    useAudio: true,
  },
  adventurer: {
    id: 'adventurer',
    emoji: '🦁',
    label: 'Adventurer',
    labelPt: 'Aventureiro',
    minAge: 9,
    maxAge: 11,
    fontSize: { title: 24, body: 16, button: 16 },
    buttonSize: 44,
    showText: true,
    showTimer: true,
    useAudio: false,
  },
  master: {
    id: 'master',
    emoji: '🦅',
    label: 'Master',
    labelPt: 'Mestre',
    minAge: 12,
    maxAge: 14,
    fontSize: { title: 22, body: 14, button: 14 },
    buttonSize: 36,
    showText: true,
    showTimer: true,
    useAudio: false,
  },
};

export function getAgeGroupFromAge(age: number): AgeGroup {
  if (age <= 5) return 'chick';
  if (age <= 8) return 'explorer';
  if (age <= 11) return 'adventurer';
  return 'master';
}
