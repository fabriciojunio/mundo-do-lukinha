import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface SyllableWord {
  word: string;
  syllables: string[];
  syllableCount: number;
}

export type ChallengeMode = 'split' | 'build';

export interface SyllableChallenge {
  id: string;
  mode: ChallengeMode;
  word: SyllableWord;
  options: string[];
  correctAnswer: string;
  displayText: string;
}

const WORD_BANK: SyllableWord[] = [
  // 2 sílabas (fácil)
  { word: 'GATO', syllables: ['GA', 'TO'], syllableCount: 2 },
  { word: 'CASA', syllables: ['CA', 'SA'], syllableCount: 2 },
  { word: 'BOLA', syllables: ['BO', 'LA'], syllableCount: 2 },
  { word: 'MESA', syllables: ['ME', 'SA'], syllableCount: 2 },
  { word: 'LIVRO', syllables: ['LI', 'VRO'], syllableCount: 2 },
  { word: 'PORTA', syllables: ['POR', 'TA'], syllableCount: 2 },
  { word: 'SAPO', syllables: ['SA', 'PO'], syllableCount: 2 },
  { word: 'PATO', syllables: ['PA', 'TO'], syllableCount: 2 },
  { word: 'DEDO', syllables: ['DE', 'DO'], syllableCount: 2 },
  { word: 'FOGO', syllables: ['FO', 'GO'], syllableCount: 2 },
  // 3 sílabas (médio)
  { word: 'BANANA', syllables: ['BA', 'NA', 'NA'], syllableCount: 3 },
  { word: 'ESCOLA', syllables: ['ES', 'CO', 'LA'], syllableCount: 3 },
  { word: 'BONECA', syllables: ['BO', 'NE', 'CA'], syllableCount: 3 },
  { word: 'CAVALO', syllables: ['CA', 'VA', 'LO'], syllableCount: 3 },
  { word: 'JANELA', syllables: ['JA', 'NE', 'LA'], syllableCount: 3 },
  { word: 'MACACO', syllables: ['MA', 'CA', 'CO'], syllableCount: 3 },
  { word: 'SAPATO', syllables: ['SA', 'PA', 'TO'], syllableCount: 3 },
  { word: 'MENINO', syllables: ['ME', 'NI', 'NO'], syllableCount: 3 },
  { word: 'COMIDA', syllables: ['CO', 'MI', 'DA'], syllableCount: 3 },
  { word: 'GALINHA', syllables: ['GA', 'LI', 'NHA'], syllableCount: 3 },
  // 4+ sílabas (difícil)
  { word: 'BORBOLETA', syllables: ['BOR', 'BO', 'LE', 'TA'], syllableCount: 4 },
  { word: 'CHOCOLATE', syllables: ['CHO', 'CO', 'LA', 'TE'], syllableCount: 4 },
  { word: 'ELEFANTE', syllables: ['E', 'LE', 'FAN', 'TE'], syllableCount: 4 },
  { word: 'DINOSSAURO', syllables: ['DI', 'NOS', 'SAU', 'RO'], syllableCount: 4 },
  { word: 'COMPUTADOR', syllables: ['COM', 'PU', 'TA', 'DOR'], syllableCount: 4 },
  { word: 'ABACAXI', syllables: ['A', 'BA', 'CA', 'XI'], syllableCount: 4 },
  { word: 'MACARRONADA', syllables: ['MA', 'CAR', 'RO', 'NA', 'DA'], syllableCount: 5 },
  { word: 'UNIVERSIDADE', syllables: ['U', 'NI', 'VER', 'SI', 'DA', 'DE'], syllableCount: 6 },
];

export function getWordsForAge(ageGroup: AgeGroup): SyllableWord[] {
  switch (ageGroup) {
    case 'explorer':
      return WORD_BANK.filter((w) => w.syllableCount <= 2);
    case 'adventurer':
      return WORD_BANK.filter((w) => w.syllableCount <= 3);
    case 'master':
      return WORD_BANK;
    default:
      return WORD_BANK.filter((w) => w.syllableCount <= 2);
  }
}

export function getChallengeCountForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 8;
    case 'adventurer': return 10;
    case 'master': return 12;
    default: return 8;
  }
}

export function generateSplitChallenge(words: SyllableWord[]): SyllableChallenge {
  const word = words[Math.floor(Math.random() * words.length)] as SyllableWord;
  const correct = word.syllables.join('-');

  const wrongOptions = new Set<string>();
  while (wrongOptions.size < 3) {
    const otherWord = words[Math.floor(Math.random() * words.length)] as SyllableWord;
    // Create a wrong split of the current word
    const shuffledSyl = shuffleArray([...word.syllables]);
    const wrongSplit = shuffledSyl.join('-');
    if (wrongSplit !== correct) {
      wrongOptions.add(wrongSplit);
    }
    // Also add splits of other words
    const otherSplit = otherWord.syllables.join('-');
    if (otherSplit !== correct) {
      wrongOptions.add(otherSplit);
    }
  }

  const options = shuffleArray([correct, ...Array.from(wrongOptions).slice(0, 3)]);

  return {
    id: Math.random().toString(36).substring(2, 9),
    mode: 'split',
    word,
    options,
    correctAnswer: correct,
    displayText: `Como separamos "${word.word}" em sílabas?`,
  };
}

export function generateBuildChallenge(words: SyllableWord[]): SyllableChallenge {
  const word = words[Math.floor(Math.random() * words.length)] as SyllableWord;
  const shuffledSyllables = shuffleArray([...word.syllables]);

  return {
    id: Math.random().toString(36).substring(2, 9),
    mode: 'build',
    word,
    options: shuffledSyllables,
    correctAnswer: word.syllables.join(''),
    displayText: `Monte a palavra com essas sílabas:`,
  };
}

export function generateChallenge(ageGroup: AgeGroup): SyllableChallenge {
  const words = getWordsForAge(ageGroup);
  if (ageGroup === 'explorer' || Math.random() > 0.5) {
    return generateSplitChallenge(words);
  }
  return generateBuildChallenge(words);
}

export function checkSplitAnswer(challenge: SyllableChallenge, selected: string): boolean {
  return selected === challenge.correctAnswer;
}

export function checkBuildAnswer(orderedSyllables: string[], word: SyllableWord): boolean {
  return orderedSyllables.join('') === word.syllables.join('');
}

export function getSyllableCount(word: string): number {
  const found = WORD_BANK.find((w) => w.word === word);
  return found ? found.syllableCount : 0;
}

export function calculateSyllableScore(
  correct: number,
  total: number,
  timeSpent: number,
): GameResult {
  const accuracy = total > 0 ? correct / total : 0;
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
