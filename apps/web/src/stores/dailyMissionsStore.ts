import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shuffleArray } from '@/lib/utils';

export interface DailyMission {
  id: string;
  gameId: string;
  title: string;
  emoji: string;
  description: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
}

const ALL_MISSIONS: Omit<DailyMission, 'completed'>[] = [
  { id: 'dm1', gameId: 'math-battle', title: 'Guerreiro dos Números', emoji: '⚔️', description: 'Jogue Batalha dos Números e ganhe 2+ estrelas', xpReward: 20, coinReward: 10 },
  { id: 'dm2', gameId: 'memory-game', title: 'Memória de Elefante', emoji: '🧠', description: 'Complete o Jogo da Memória', xpReward: 15, coinReward: 8 },
  { id: 'dm3', gameId: 'word-hunt', title: 'Caçador de Palavras', emoji: '🔍', description: 'Encontre todas as palavras no Caça-Palavras', xpReward: 20, coinReward: 10 },
  { id: 'dm4', gameId: 'tabuada-ninja', title: 'Ninja da Tabuada', emoji: '🥷', description: 'Ganhe o cinturão no Tabuada Ninja', xpReward: 25, coinReward: 12 },
  { id: 'dm5', gameId: 'english-words', title: 'Poliglota', emoji: '🌍', description: 'Traduza 8+ palavras em English Words', xpReward: 20, coinReward: 10 },
  { id: 'dm6', gameId: 'piano-virtual', title: 'Maestro', emoji: '🎵', description: 'Toque 3 melodias no Piano Virtual', xpReward: 20, coinReward: 10 },
  { id: 'dm7', gameId: 'code-blocks', title: 'Programador Iniciante', emoji: '💻', description: 'Complete um nível do Code Blocks', xpReward: 25, coinReward: 12 },
  { id: 'dm8', gameId: 'dino-runner', title: 'Dinossauro Veloz', emoji: '🦖', description: 'Marque 100+ pontos no Dino Runner', xpReward: 15, coinReward: 8 },
  { id: 'dm9', gameId: 'cofrinho-esperto', title: 'Mestre das Finanças', emoji: '💰', description: 'Tome 3 decisões sábias no Cofrinho Esperto', xpReward: 20, coinReward: 10 },
  { id: 'dm10', gameId: 'diario-emocoes', title: 'Inteligência Emocional', emoji: '💖', description: 'Identifique 4 emoções no Diário de Emoções', xpReward: 20, coinReward: 10 },
  { id: 'dm11', gameId: 'quiz-adventure', title: 'Sabichão', emoji: '🎓', description: 'Acerte 80%+ no Quiz Aventura', xpReward: 25, coinReward: 12 },
  { id: 'dm12', gameId: 'pintura-livre', title: 'Artista do Dia', emoji: '🎨', description: 'Crie uma obra-prima na Pintura Livre', xpReward: 15, coinReward: 8 },
];

interface DailyMissionsState {
  missions: DailyMission[];
  lastGeneratedDate: string | null;
  completedToday: number;
  streakDays: number;
  lastStreakDate: string | null;

  generateDailyMissions: () => void;
  completeMission: (missionId: string) => { xpReward: number; coinReward: number } | null;
  getMissions: () => DailyMission[];
  getStreakBonus: () => number;
}

function todayString(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0] ?? '';
}

export const useDailyMissionsStore = create<DailyMissionsState>()(
  persist(
    (set, get) => ({
      missions: [],
      lastGeneratedDate: null,
      completedToday: 0,
      streakDays: 0,
      lastStreakDate: null,

      generateDailyMissions: () => {
        const today = todayString();
        const { lastGeneratedDate, streakDays, lastStreakDate } = get();

        if (lastGeneratedDate === today) return;

        const selected = shuffleArray(ALL_MISSIONS).slice(0, 3);
        const missions: DailyMission[] = selected.map((m) => ({ ...m, completed: false }));

        let newStreak = streakDays;
        if (lastStreakDate === yesterdayString()) {
          newStreak = streakDays + 1;
        } else if (lastStreakDate !== today) {
          newStreak = 1;
        }

        set({ missions, lastGeneratedDate: today, completedToday: 0, streakDays: newStreak, lastStreakDate: today });
      },

      completeMission: (missionId) => {
        const { missions } = get();
        const mission = missions.find((m) => m.id === missionId);
        if (!mission || mission.completed) return null;

        const streakMultiplier = 1 + get().streakDays * 0.1;
        const xpReward = Math.floor(mission.xpReward * streakMultiplier);
        const coinReward = Math.floor(mission.coinReward * streakMultiplier);

        set((state) => ({
          missions: state.missions.map((m) => m.id === missionId ? { ...m, completed: true } : m),
          completedToday: state.completedToday + 1,
        }));

        return { xpReward, coinReward };
      },

      getMissions: () => {
        const { missions, lastGeneratedDate } = get();
        if (lastGeneratedDate !== todayString()) {
          get().generateDailyMissions();
          return get().missions;
        }
        return missions;
      },

      getStreakBonus: () => {
        const { streakDays } = get();
        return Math.floor(streakDays * 0.1 * 100);
      },
    }),
    { name: 'mundo-do-lukinha-daily-missions' },
  ),
);
