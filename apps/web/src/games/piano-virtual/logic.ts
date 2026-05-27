import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export interface PianoNote {
  name: string;
  namePt: string;
  frequency: number;
  color: 'white' | 'black';
  key: string;
}

export const PIANO_NOTES: PianoNote[] = [
  { name: 'C', namePt: 'Dó', frequency: 261.63, color: 'white', key: 'a' },
  { name: 'D', namePt: 'Ré', frequency: 293.66, color: 'white', key: 's' },
  { name: 'E', namePt: 'Mi', frequency: 329.63, color: 'white', key: 'd' },
  { name: 'F', namePt: 'Fá', frequency: 349.23, color: 'white', key: 'f' },
  { name: 'G', namePt: 'Sol', frequency: 392.0, color: 'white', key: 'g' },
  { name: 'A', namePt: 'Lá', frequency: 440.0, color: 'white', key: 'h' },
  { name: 'B', namePt: 'Si', frequency: 493.88, color: 'white', key: 'j' },
  { name: 'C2', namePt: 'Dó²', frequency: 523.25, color: 'white', key: 'k' },
];

export interface Melody {
  name: string;
  notes: string[];
  difficulty: number;
}

const MELODIES: Melody[] = [
  { name: 'Dó Ré Mi', notes: ['C', 'D', 'E'], difficulty: 1 },
  { name: 'Escadinha', notes: ['C', 'D', 'E', 'F', 'G'], difficulty: 1 },
  { name: 'Descendo', notes: ['G', 'F', 'E', 'D', 'C'], difficulty: 1 },
  { name: 'Pula-Pula', notes: ['C', 'E', 'G', 'E', 'C'], difficulty: 2 },
  { name: 'Brilha Brilha', notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G'], difficulty: 2 },
  { name: 'Vai e Volta', notes: ['C', 'D', 'E', 'F', 'G', 'F', 'E', 'D', 'C'], difficulty: 2 },
  { name: 'Zigzag', notes: ['C', 'E', 'D', 'F', 'E', 'G', 'F', 'A'], difficulty: 3 },
  { name: 'Saltos Grandes', notes: ['C', 'G', 'E', 'A', 'D', 'B', 'C2'], difficulty: 3 },
  { name: 'Desafio Final', notes: ['C', 'E', 'G', 'C2', 'G', 'E', 'C', 'D', 'F', 'A'], difficulty: 3 },
];

export function getMelodiesForAge(ageGroup: AgeGroup): Melody[] {
  switch (ageGroup) {
    case 'explorer': return MELODIES.filter((m) => m.difficulty === 1);
    case 'adventurer': return MELODIES.filter((m) => m.difficulty <= 2);
    case 'master': return MELODIES;
    default: return MELODIES.filter((m) => m.difficulty === 1);
  }
}

export function getRoundCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 3;
    case 'adventurer': return 5;
    case 'master': return 7;
    default: return 3;
  }
}

export function getNoteByName(name: string): PianoNote | undefined {
  return PIANO_NOTES.find((n) => n.name === name);
}

export function playNoteSound(frequency: number, duration = 0.4): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export async function playMelody(noteNames: string[], tempo = 400): Promise<void> {
  for (const name of noteNames) {
    const note = getNoteByName(name);
    if (note) {
      playNoteSound(note.frequency);
      await new Promise((r) => setTimeout(r, tempo));
    }
  }
}

export function checkMelodyAttempt(expected: string[], attempt: string[]): boolean {
  if (expected.length !== attempt.length) return false;
  return expected.every((note, i) => note === attempt[i]);
}

export function calculatePianoScore(correctMelodies: number, totalMelodies: number, timeSpent: number): GameResult {
  const accuracy = totalMelodies > 0 ? correctMelodies / totalMelodies : 0;
  const stars = calculateStars(accuracy);
  return { score: correctMelodies * 20, maxScore: totalMelodies * 20, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
