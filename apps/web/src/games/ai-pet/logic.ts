import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface PetState {
  name: string;
  emoji: string;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'sleepy';
  hunger: number;   // 0-100
  energy: number;   // 0-100
  knowledge: number; // 0-100
  level: number;
  learnedPatterns: string[];
}

export interface TeachingChallenge {
  id: string;
  type: 'pattern' | 'sorting' | 'matching';
  question: string;
  sequence: string[];
  options: string[];
  correctIndex: number;
  explanation: string;
  patternName: string;
}

export function createPet(name: string): PetState {
  return { name, emoji: '🤖', mood: 'happy', hunger: 70, energy: 80, knowledge: 0, level: 1, learnedPatterns: [] };
}

export function getMoodEmoji(mood: PetState['mood']): string {
  const map = { happy: '😊', neutral: '😐', sad: '😢', excited: '🤩', sleepy: '😴' };
  return map[mood];
}

export function calculateMood(pet: PetState): PetState['mood'] {
  if (pet.energy < 20) return 'sleepy';
  if (pet.hunger < 30) return 'sad';
  if (pet.knowledge > 80) return 'excited';
  if (pet.hunger > 60 && pet.energy > 60) return 'happy';
  return 'neutral';
}

export function feedPet(pet: PetState): PetState {
  const hunger = Math.min(100, pet.hunger + 25);
  const mood = calculateMood({ ...pet, hunger });
  return { ...pet, hunger, mood };
}

export function restPet(pet: PetState): PetState {
  const energy = Math.min(100, pet.energy + 30);
  const mood = calculateMood({ ...pet, energy });
  return { ...pet, energy, mood };
}

export function teachPet(pet: PetState, patternName: string): PetState {
  const knowledge = Math.min(100, pet.knowledge + 15);
  const energy = Math.max(0, pet.energy - 10);
  const hunger = Math.max(0, pet.hunger - 5);
  const learnedPatterns = pet.learnedPatterns.includes(patternName)
    ? pet.learnedPatterns : [...pet.learnedPatterns, patternName];
  const level = Math.floor(learnedPatterns.length / 2) + 1;
  const mood = calculateMood({ ...pet, knowledge, energy, hunger });
  return { ...pet, knowledge, energy, hunger, learnedPatterns, level, mood };
}

const CHALLENGES: TeachingChallenge[] = [
  { id: 't1', type: 'pattern', question: 'Qual é o próximo? 🔴 🔵 🔴 🔵 🔴 ?', sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], options: ['🔵', '🔴', '🟢', '🟡'], correctIndex: 0, explanation: 'O padrão alterna vermelho e azul! A IA aprende padrões assim!', patternName: 'alternância' },
  { id: 't2', type: 'pattern', question: 'Qual é o próximo? 1, 2, 4, 8, ?', sequence: ['1', '2', '4', '8'], options: ['10', '12', '16', '15'], correctIndex: 2, explanation: 'Cada número dobra! Isso é uma progressão geométrica — IAs adoram padrões numéricos!', patternName: 'duplicação' },
  { id: 't3', type: 'pattern', question: 'Complete: ⭐⭐ ⭐⭐⭐ ⭐⭐⭐⭐ ?', sequence: ['⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'], options: ['⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐', '⭐'], correctIndex: 1, explanation: 'A cada passo, adicionamos mais uma estrela! A IA vê o crescimento!', patternName: 'crescimento' },
  { id: 't4', type: 'sorting', question: 'O que a IA precisa para aprender?', sequence: [], options: ['Muitos dados', 'Magia', 'Sorte', 'Nada'], correctIndex: 0, explanation: 'IAs aprendem com dados! Quanto mais exemplos, melhor ela fica!', patternName: 'dados' },
  { id: 't5', type: 'matching', question: 'Qual animal é um mamífero? (Ensine o pet a classificar)', sequence: [], options: ['🐶 Cachorro', '🐍 Cobra', '🐸 Sapo', '🐟 Peixe'], correctIndex: 0, explanation: 'Cachorro é mamífero! A IA aprende a classificar assim — vendo exemplos!', patternName: 'classificação' },
  { id: 't6', type: 'pattern', question: 'A B A B A B ?', sequence: ['A', 'B', 'A', 'B', 'A', 'B'], options: ['C', 'B', 'A', 'D'], correctIndex: 2, explanation: 'Padrão simples de repetição! É assim que a IA começa a entender sequências.', patternName: 'repetição' },
  { id: 't7', type: 'sorting', question: 'O que é "treinar" uma IA?', sequence: [], options: ['Fazer ela correr', 'Dar muitos exemplos para ela aprender', 'Desligá-la', 'Dar comida'], correctIndex: 1, explanation: 'Treinar IA = dar muitos exemplos para ela encontrar padrões!', patternName: 'treinamento' },
  { id: 't8', type: 'matching', question: 'A IA classificou: 🍎🍌🍇 como "frutas". O que mais é fruta?', sequence: [], options: ['🥕 Cenoura', '🍊 Laranja', '🥩 Carne', '🍞 Pão'], correctIndex: 1, explanation: 'Laranja é fruta! A IA usa os exemplos anteriores para classificar novos itens!', patternName: 'generalização' },
];

export function getChallengesForAge(ageGroup: AgeGroup): TeachingChallenge[] {
  switch (ageGroup) {
    case 'explorer': return CHALLENGES.slice(0, 4);
    case 'adventurer': return CHALLENGES.slice(0, 6);
    case 'master': return CHALLENGES;
    default: return CHALLENGES.slice(0, 4);
  }
}

export function selectChallenges(ageGroup: AgeGroup): TeachingChallenge[] {
  return shuffleArray(getChallengesForAge(ageGroup));
}

export function checkTeachingAnswer(challenge: TeachingChallenge, selectedIndex: number): boolean {
  return selectedIndex === challenge.correctIndex;
}

export function calculateAIPetScore(correct: number, total: number, petLevel: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0;
  const stars = calculateStars(accuracy);
  const score = correct * 15 + petLevel * 10;
  return { score, maxScore: total * 15 + 50, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
