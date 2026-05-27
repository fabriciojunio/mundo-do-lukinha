import { usePlayerStore } from '@/stores/playerStore';
import { getXPForNextLevel, getLevelName } from '@/lib/utils';

export function usePlayer() {
  const player = usePlayerStore((s) => s.player);
  const gameHistory = usePlayerStore((s) => s.gameHistory);
  const createPlayer = usePlayerStore((s) => s.createPlayer);
  const addGameResult = usePlayerStore((s) => s.addGameResult);
  const unlockAchievement = usePlayerStore((s) => s.unlockAchievement);
  const setAvatar = usePlayerStore((s) => s.setAvatar);
  const updateAge = usePlayerStore((s) => s.updateAge);
  const resetPlayer = usePlayerStore((s) => s.resetPlayer);

  const xpProgress = player ? getXPForNextLevel(player.xp) : { current: 0, needed: 100, progress: 0 };
  const levelName = player ? getLevelName(player.level) : 'Iniciante';

  return {
    player,
    gameHistory,
    xpProgress,
    levelName,
    createPlayer,
    addGameResult,
    unlockAchievement,
    setAvatar,
    updateAge,
    resetPlayer,
    isLoggedIn: player !== null,
  };
}
