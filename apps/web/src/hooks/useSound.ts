import { useCallback } from 'react';
import { playSound, type SoundName } from '@/lib/sounds';

export function useSound() {
  const play = useCallback((sound: SoundName) => {
    playSound(sound);
  }, []);

  return { play };
}
