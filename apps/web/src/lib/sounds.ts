export const SOUNDS = {
  CORRECT: 'correct',
  WRONG: 'wrong',
  CLICK: 'click',
  STAR: 'star',
  COIN: 'coin',
  LEVEL_UP: 'levelUp',
  ACHIEVEMENT: 'achievement',
  GAME_START: 'gameStart',
  GAME_OVER: 'gameOver',
  COMBO: 'combo',
  COUNTDOWN: 'countdown',
  MATCH: 'match',
  JUMP: 'jump',
  WHOOSH: 'whoosh',
} as const;

export type SoundName = (typeof SOUNDS)[keyof typeof SOUNDS];

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available, silently ignore
  }
}

function playChime(frequencies: number[], duration: number, delay = 0.1): void {
  frequencies.forEach((freq, i) => {
    setTimeout(() => playTone(freq, duration), i * delay * 1000);
  });
}

export function playSound(sound: SoundName): void {
  switch (sound) {
    case 'correct':
      playChime([523, 659, 784], 0.2, 0.08);
      break;
    case 'wrong':
      playTone(220, 0.3, 'square', 0.15);
      break;
    case 'click':
      playTone(800, 0.05, 'sine', 0.2);
      break;
    case 'star':
      playChime([784, 988, 1175], 0.3, 0.1);
      break;
    case 'coin':
      playChime([988, 1319], 0.15, 0.06);
      break;
    case 'levelUp':
      playChime([523, 659, 784, 1047], 0.3, 0.12);
      break;
    case 'achievement':
      playChime([440, 554, 659, 880], 0.4, 0.15);
      break;
    case 'gameStart':
      playChime([440, 554, 659], 0.2, 0.1);
      break;
    case 'gameOver':
      playChime([659, 784, 988, 1175], 0.3, 0.12);
      break;
    case 'combo':
      playChime([659, 880, 1175], 0.15, 0.05);
      break;
    case 'countdown':
      playTone(440, 0.1, 'sine', 0.25);
      break;
    case 'match':
      playChime([659, 784], 0.2, 0.08);
      break;
    case 'jump':
      playTone(440, 0.1, 'square', 0.15);
      break;
    case 'whoosh':
      playTone(300, 0.15, 'sawtooth', 0.1);
      break;
  }
}
