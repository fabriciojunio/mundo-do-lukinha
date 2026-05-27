import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface WordPair {
  english: string;
  portuguese: string;
  emoji: string;
  category: string;
  difficulty: number;
}

const WORD_PAIRS: WordPair[] = [
  // Easy
  { english: 'Cat', portuguese: 'Gato', emoji: '🐱', category: 'animals', difficulty: 1 },
  { english: 'Dog', portuguese: 'Cachorro', emoji: '🐶', category: 'animals', difficulty: 1 },
  { english: 'House', portuguese: 'Casa', emoji: '🏠', category: 'places', difficulty: 1 },
  { english: 'Sun', portuguese: 'Sol', emoji: '☀️', category: 'nature', difficulty: 1 },
  { english: 'Moon', portuguese: 'Lua', emoji: '🌙', category: 'nature', difficulty: 1 },
  { english: 'Water', portuguese: 'Água', emoji: '💧', category: 'nature', difficulty: 1 },
  { english: 'Apple', portuguese: 'Maçã', emoji: '🍎', category: 'food', difficulty: 1 },
  { english: 'Red', portuguese: 'Vermelho', emoji: '🔴', category: 'colors', difficulty: 1 },
  { english: 'Blue', portuguese: 'Azul', emoji: '🔵', category: 'colors', difficulty: 1 },
  { english: 'Book', portuguese: 'Livro', emoji: '📖', category: 'objects', difficulty: 1 },
  { english: 'Star', portuguese: 'Estrela', emoji: '⭐', category: 'nature', difficulty: 1 },
  { english: 'Tree', portuguese: 'Árvore', emoji: '🌳', category: 'nature', difficulty: 1 },
  // Medium
  { english: 'Butterfly', portuguese: 'Borboleta', emoji: '🦋', category: 'animals', difficulty: 2 },
  { english: 'School', portuguese: 'Escola', emoji: '🏫', category: 'places', difficulty: 2 },
  { english: 'Friend', portuguese: 'Amigo', emoji: '🤝', category: 'people', difficulty: 2 },
  { english: 'Dream', portuguese: 'Sonho', emoji: '💭', category: 'abstract', difficulty: 2 },
  { english: 'Happy', portuguese: 'Feliz', emoji: '😊', category: 'feelings', difficulty: 2 },
  { english: 'Strong', portuguese: 'Forte', emoji: '💪', category: 'adjectives', difficulty: 2 },
  { english: 'Kitchen', portuguese: 'Cozinha', emoji: '🍳', category: 'places', difficulty: 2 },
  { english: 'Bridge', portuguese: 'Ponte', emoji: '🌉', category: 'places', difficulty: 2 },
  // Hard
  { english: 'Knowledge', portuguese: 'Conhecimento', emoji: '🧠', category: 'abstract', difficulty: 3 },
  { english: 'Environment', portuguese: 'Meio Ambiente', emoji: '🌍', category: 'nature', difficulty: 3 },
  { english: 'Achievement', portuguese: 'Conquista', emoji: '🏆', category: 'abstract', difficulty: 3 },
  { english: 'Development', portuguese: 'Desenvolvimento', emoji: '📈', category: 'abstract', difficulty: 3 },
  { english: 'Responsibility', portuguese: 'Responsabilidade', emoji: '✅', category: 'abstract', difficulty: 3 },
  { english: 'Neighborhood', portuguese: 'Vizinhança', emoji: '🏘️', category: 'places', difficulty: 3 },
];

export function getWordsForAge(ageGroup: AgeGroup): WordPair[] {
  switch (ageGroup) {
    case 'explorer': return WORD_PAIRS.filter((w) => w.difficulty === 1);
    case 'adventurer': return WORD_PAIRS.filter((w) => w.difficulty <= 2);
    case 'master': return WORD_PAIRS;
    default: return WORD_PAIRS.filter((w) => w.difficulty === 1);
  }
}

export function getQuizCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 8;
    case 'adventurer': return 10;
    case 'master': return 12;
    default: return 8;
  }
}

export type QuizDirection = 'en-to-pt' | 'pt-to-en';

export interface EnglishQuiz {
  id: string;
  direction: QuizDirection;
  word: WordPair;
  question: string;
  options: string[];
  correctIndex: number;
}

export function generateEnglishQuiz(words: WordPair[]): EnglishQuiz {
  const word = words[Math.floor(Math.random() * words.length)] as WordPair;
  const direction: QuizDirection = Math.random() > 0.5 ? 'en-to-pt' : 'pt-to-en';

  const correctAnswer = direction === 'en-to-pt' ? word.portuguese : word.english;
  const question = direction === 'en-to-pt'
    ? `${word.emoji} Como se diz "${word.english}" em português?`
    : `${word.emoji} Como se diz "${word.portuguese}" em inglês?`;

  const wrongPool = words.filter((w) => w.english !== word.english)
    .map((w) => direction === 'en-to-pt' ? w.portuguese : w.english);
  const wrongOptions = shuffleArray(wrongPool).slice(0, 3);
  const options = shuffleArray([correctAnswer, ...wrongOptions]);
  const correctIndex = options.indexOf(correctAnswer);

  return { id: Math.random().toString(36).substring(2, 9), direction, word, question, options, correctIndex: Math.max(0, correctIndex) };
}

export function generateEnglishQuizSet(ageGroup: AgeGroup): EnglishQuiz[] {
  const words = getWordsForAge(ageGroup);
  const count = getQuizCount(ageGroup);
  return Array.from({ length: count }, () => generateEnglishQuiz(words));
}

export function checkEnglishAnswer(quiz: EnglishQuiz, selectedIndex: number): boolean {
  return selectedIndex === quiz.correctIndex;
}

export function calculateEnglishScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0;
  const stars = calculateStars(accuracy);
  return { score: correct * 12, maxScore: total * 12, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
