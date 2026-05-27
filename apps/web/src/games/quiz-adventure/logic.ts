import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  ageGroups: AgeGroup[];
}

const QUESTION_BANK: QuizQuestion[] = [
  // Explorer questions
  { id: 'q1', text: 'Qual é o maior planeta do sistema solar?', options: ['Terra', 'Júpiter', 'Saturno', 'Marte'], correctIndex: 1, explanation: 'Júpiter é o maior planeta! É tão grande que caberiam mais de 1000 Terras dentro dele.', category: 'science', ageGroups: ['explorer', 'adventurer'] },
  { id: 'q2', text: 'Quantas patas tem uma aranha?', options: ['6', '8', '10', '4'], correctIndex: 1, explanation: 'Aranhas têm 8 patas! Por isso não são insetos (que têm 6).', category: 'science', ageGroups: ['explorer', 'adventurer'] },
  { id: 'q3', text: 'Qual é a cor do sol?', options: ['Amarelo', 'Branco', 'Laranja', 'Vermelho'], correctIndex: 1, explanation: 'O sol é na verdade branco! Parece amarelo por causa da atmosfera da Terra.', category: 'science', ageGroups: ['explorer'] },
  { id: 'q4', text: 'Em qual continente fica o Brasil?', options: ['Europa', 'América do Sul', 'África', 'Ásia'], correctIndex: 1, explanation: 'O Brasil fica na América do Sul! É o maior país do continente.', category: 'geography', ageGroups: ['explorer', 'adventurer'] },
  { id: 'q5', text: 'Qual animal é o mais rápido do mundo?', options: ['Leão', 'Águia', 'Guepardo', 'Cavalo'], correctIndex: 2, explanation: 'O guepardo pode correr a mais de 100 km/h!', category: 'science', ageGroups: ['explorer', 'adventurer'] },
  { id: 'q6', text: 'Quantos ossos tem o corpo humano adulto?', options: ['106', '156', '206', '306'], correctIndex: 2, explanation: 'O corpo humano adulto tem 206 ossos! Bebês nascem com cerca de 270.', category: 'science', ageGroups: ['explorer', 'adventurer'] },
  { id: 'q7', text: 'Qual é o oceano mais profundo?', options: ['Atlântico', 'Índico', 'Pacífico', 'Ártico'], correctIndex: 2, explanation: 'O Oceano Pacífico é o mais profundo e também o maior!', category: 'geography', ageGroups: ['explorer', 'adventurer'] },
  { id: 'q8', text: 'De que é feita a maior parte do ar que respiramos?', options: ['Oxigênio', 'Nitrogênio', 'Carbono', 'Hidrogênio'], correctIndex: 1, explanation: 'O ar é 78% nitrogênio! O oxigênio é apenas 21%.', category: 'science', ageGroups: ['adventurer', 'master'] },
  // Adventurer questions
  { id: 'q9', text: 'Qual cientista descobriu a gravidade?', options: ['Einstein', 'Newton', 'Galileu', 'Tesla'], correctIndex: 1, explanation: 'Isaac Newton formulou a lei da gravidade no século XVII.', category: 'history', ageGroups: ['adventurer', 'master'] },
  { id: 'q10', text: 'Qual é a fórmula da água?', options: ['CO2', 'H2O', 'O2', 'NaCl'], correctIndex: 1, explanation: 'H2O significa 2 átomos de hidrogênio e 1 de oxigênio!', category: 'science', ageGroups: ['adventurer', 'master'] },
  { id: 'q11', text: 'Em que ano o Brasil foi descoberto?', options: ['1400', '1500', '1600', '1700'], correctIndex: 1, explanation: 'Pedro Álvares Cabral chegou ao Brasil em 1500.', category: 'history', ageGroups: ['adventurer', 'master'] },
  { id: 'q12', text: 'Qual é a capital do Japão?', options: ['Pequim', 'Seul', 'Tóquio', 'Bangkok'], correctIndex: 2, explanation: 'Tóquio é a capital do Japão e uma das maiores cidades do mundo!', category: 'geography', ageGroups: ['adventurer', 'master'] },
  // Master questions
  { id: 'q13', text: 'Qual é a velocidade da luz?', options: ['300 km/s', '300.000 km/s', '3.000 km/s', '30.000 km/s'], correctIndex: 1, explanation: 'A luz viaja a aproximadamente 300.000 km/s no vácuo!', category: 'science', ageGroups: ['master'] },
  { id: 'q14', text: 'Quem pintou a Mona Lisa?', options: ['Michelangelo', 'Van Gogh', 'Da Vinci', 'Picasso'], correctIndex: 2, explanation: 'Leonardo da Vinci pintou a Mona Lisa no início do século XVI.', category: 'history', ageGroups: ['adventurer', 'master'] },
  { id: 'q15', text: 'O DNA tem formato de...', options: ['Escada reta', 'Dupla hélice', 'Círculo', 'Triângulo'], correctIndex: 1, explanation: 'O DNA tem formato de dupla hélice, descoberto por Watson e Crick em 1953.', category: 'science', ageGroups: ['master'] },
  { id: 'q16', text: 'Qual é o elemento químico mais abundante no universo?', options: ['Oxigênio', 'Carbono', 'Hidrogênio', 'Hélio'], correctIndex: 2, explanation: 'O hidrogênio compõe cerca de 75% de toda a matéria do universo!', category: 'science', ageGroups: ['master'] },
];

export function getQuestions(ageGroup: AgeGroup, count: number): QuizQuestion[] {
  const eligible = QUESTION_BANK.filter((q) => q.ageGroups.includes(ageGroup));
  const shuffled = shuffleArray(eligible);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function checkQuizAnswer(
  question: QuizQuestion,
  selectedIndex: number,
): { correct: boolean; explanation: string } {
  return {
    correct: selectedIndex === question.correctIndex,
    explanation: question.explanation,
  };
}

export function calculateQuizScore(correct: number, total: number, streak: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0;
  const stars = calculateStars(accuracy);
  const score = correct * 10 + streak * 5;
  const maxScore = total * 10 + total * 5;

  const achievements: string[] = [];
  if (correct === total && total >= 10) achievements.push('quiz-perfect');

  return {
    score,
    maxScore: Math.max(maxScore, score),
    timeSpent: 0,
    accuracy,
    xpEarned: calculateXP(stars),
    coinsEarned: calculateCoins(stars),
    achievements,
    stars,
  };
}

export function getQuestionCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 7;
    case 'adventurer': return 10;
    case 'master': return 10;
    default: return 7;
  }
}
