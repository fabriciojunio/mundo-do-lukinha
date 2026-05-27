import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface DitadoWord {
  word: string;
  hint: string;
  category: string;
}

const WORD_BANK_EASY: DitadoWord[] = [
  { word: 'GATO', hint: 'Animal que mia', category: 'animais' },
  { word: 'CASA', hint: 'Onde moramos', category: 'lugares' },
  { word: 'BOLA', hint: 'Brinquedo redondo', category: 'objetos' },
  { word: 'MESA', hint: 'Móvel para comer', category: 'objetos' },
  { word: 'SAPO', hint: 'Animal verde que pula', category: 'animais' },
  { word: 'PATO', hint: 'Ave que nada', category: 'animais' },
  { word: 'RATO', hint: 'Animal pequeno', category: 'animais' },
  { word: 'DADO', hint: 'Cubo com números', category: 'objetos' },
  { word: 'FOGO', hint: 'É quente e queima', category: 'natureza' },
  { word: 'LOBO', hint: 'Animal que uiva', category: 'animais' },
  { word: 'NUVEM', hint: 'Branca no céu', category: 'natureza' },
  { word: 'FLOR', hint: 'Planta bonita e cheirosa', category: 'natureza' },
];

const WORD_BANK_MEDIUM: DitadoWord[] = [
  { word: 'ESCOLA', hint: 'Onde aprendemos', category: 'lugares' },
  { word: 'JANELA', hint: 'Para ver lá fora', category: 'objetos' },
  { word: 'ESTRELA', hint: 'Brilha no céu à noite', category: 'natureza' },
  { word: 'FLORESTA', hint: 'Muitas árvores juntas', category: 'natureza' },
  { word: 'CACHORRO', hint: 'Melhor amigo do homem', category: 'animais' },
  { word: 'PROFESSOR', hint: 'Quem ensina na escola', category: 'pessoas' },
  { word: 'BRINQUEDO', hint: 'Para se divertir', category: 'objetos' },
  { word: 'PRESENTE', hint: 'Ganhamos no aniversário', category: 'objetos' },
  { word: 'DESENHO', hint: 'Arte com lápis', category: 'arte' },
  { word: 'CAMINHO', hint: 'Estrada para andar', category: 'lugares' },
];

const WORD_BANK_HARD: DitadoWord[] = [
  { word: 'EXCURSÃO', hint: 'Viagem em grupo', category: 'atividades' },
  { word: 'EXPERIÊNCIA', hint: 'Teste científico', category: 'ciência' },
  { word: 'CONSCIÊNCIA', hint: 'Saber o certo e errado', category: 'sentimentos' },
  { word: 'EXCEÇÃO', hint: 'Fora da regra', category: 'conceitos' },
  { word: 'EXPRESSÃO', hint: 'Forma de se comunicar', category: 'conceitos' },
  { word: 'IMPRESSÃO', hint: 'O que achamos de algo', category: 'sentimentos' },
  { word: 'PARALELEPÍPEDO', hint: 'Forma geométrica 3D', category: 'matemática' },
  { word: 'HELICÓPTERO', hint: 'Voa com hélices', category: 'veículos' },
  { word: 'AQUARELA', hint: 'Tinta para pintar', category: 'arte' },
  { word: 'DESENVOLVIMENTO', hint: 'Crescer e evoluir', category: 'conceitos' },
];

export function getWordsForAge(ageGroup: AgeGroup): DitadoWord[] {
  switch (ageGroup) {
    case 'explorer': return WORD_BANK_EASY;
    case 'adventurer': return [...WORD_BANK_EASY, ...WORD_BANK_MEDIUM];
    case 'master': return [...WORD_BANK_MEDIUM, ...WORD_BANK_HARD];
    default: return WORD_BANK_EASY;
  }
}

export function getWordCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 8;
    case 'adventurer': return 10;
    case 'master': return 10;
    default: return 8;
  }
}

export function selectWords(ageGroup: AgeGroup): DitadoWord[] {
  const pool = getWordsForAge(ageGroup);
  const count = getWordCount(ageGroup);
  return shuffleArray(pool).slice(0, count);
}

export function speakWord(word: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
  utterance.lang = 'pt-BR';
  utterance.rate = 0.8;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

export function scrambleWord(word: string): string[] {
  return shuffleArray(word.split(''));
}

export function checkSpelling(attempt: string, correct: string): boolean {
  return attempt.toUpperCase().trim() === correct.toUpperCase().trim();
}

export function getLetterFeedback(
  attempt: string,
  correct: string,
): Array<{ letter: string; status: 'correct' | 'wrong' | 'missing' }> {
  const result: Array<{ letter: string; status: 'correct' | 'wrong' | 'missing' }> = [];
  const upperAttempt = attempt.toUpperCase();
  const upperCorrect = correct.toUpperCase();

  for (let i = 0; i < Math.max(upperAttempt.length, upperCorrect.length); i++) {
    const attemptChar = upperAttempt[i];
    const correctChar = upperCorrect[i];

    if (attemptChar === correctChar) {
      result.push({ letter: correctChar ?? '', status: 'correct' });
    } else if (attemptChar && correctChar) {
      result.push({ letter: correctChar, status: 'wrong' });
    } else if (!attemptChar && correctChar) {
      result.push({ letter: correctChar, status: 'missing' });
    }
  }

  return result;
}

export function calculateDitadoScore(
  correct: number,
  total: number,
  hintsUsed: number,
  timeSpent: number,
): GameResult {
  const rawAccuracy = total > 0 ? correct / total : 0;
  const hintPenalty = Math.min(hintsUsed * 0.05, 0.3);
  const accuracy = Math.max(0, rawAccuracy - hintPenalty);
  const stars = calculateStars(accuracy);
  const score = correct * 12;
  const maxScore = total * 12;

  return {
    score,
    maxScore,
    timeSpent,
    accuracy,
    xpEarned: calculateXP(stars),
    coinsEarned: calculateCoins(stars),
    achievements: [],
    stars,
  };
}
