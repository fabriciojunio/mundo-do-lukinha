export interface Achievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  coinReward: number;
  icon: string;
  category: 'game' | 'streak' | 'level' | 'special';
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    name: 'Primeira Aventura',
    description: 'Jogou pela primeira vez!',
    xpReward: 50,
    coinReward: 25,
    icon: '🎯',
    category: 'special',
  },
  {
    id: 'math-10',
    name: 'Calculadora Humana',
    description: 'Acertou 10 contas seguidas!',
    xpReward: 100,
    coinReward: 50,
    icon: '🧮',
    category: 'game',
  },
  {
    id: 'memory-master',
    name: 'Memória de Elefante',
    description: 'Completou o jogo da memória sem errar!',
    xpReward: 150,
    coinReward: 75,
    icon: '🐘',
    category: 'game',
  },
  {
    id: 'word-finder',
    name: 'Detetive de Palavras',
    description: 'Encontrou todas as palavras no caça-palavras!',
    xpReward: 100,
    coinReward: 50,
    icon: '🔍',
    category: 'game',
  },
  {
    id: 'dino-100',
    name: 'Corredor Jurássico',
    description: 'Fez 100 pontos no Dino Runner!',
    xpReward: 75,
    coinReward: 35,
    icon: '🦕',
    category: 'game',
  },
  {
    id: 'color-mixer',
    name: 'Artista Mágico',
    description: 'Misturou 10 cores no Laboratório!',
    xpReward: 100,
    coinReward: 50,
    icon: '🎨',
    category: 'game',
  },
  {
    id: 'quiz-perfect',
    name: 'Sabe-Tudo',
    description: 'Acertou 10/10 no Quiz Aventura!',
    xpReward: 200,
    coinReward: 100,
    icon: '🏆',
    category: 'game',
  },
  {
    id: 'streak-3',
    name: 'Dedicado',
    description: 'Jogou 3 dias seguidos!',
    xpReward: 150,
    coinReward: 50,
    icon: '🔥',
    category: 'streak',
  },
  {
    id: 'streak-7',
    name: 'Imparável',
    description: 'Jogou 7 dias seguidos!',
    xpReward: 300,
    coinReward: 150,
    icon: '⚡',
    category: 'streak',
  },
  {
    id: 'level-5',
    name: 'Explorador',
    description: 'Chegou ao nível 5!',
    xpReward: 250,
    coinReward: 100,
    icon: '⭐',
    category: 'level',
  },
  {
    id: 'level-10',
    name: 'Aventureiro',
    description: 'Chegou ao nível 10!',
    xpReward: 500,
    coinReward: 250,
    icon: '🌟',
    category: 'level',
  },
  {
    id: 'all-games',
    name: 'Aventureiro Completo',
    description: 'Jogou todos os jogos disponíveis!',
    xpReward: 500,
    coinReward: 250,
    icon: '👑',
    category: 'special',
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getUnlockedAchievements(unlockedIds: string[]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id));
}

export function getLockedAchievements(unlockedIds: string[]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !unlockedIds.includes(a.id));
}
