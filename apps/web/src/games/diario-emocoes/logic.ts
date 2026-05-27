import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface Emotion { name: string; emoji: string; color: string; description: string; }

export const EMOTIONS: Emotion[] = [
  { name: 'Feliz', emoji: '😊', color: '#FBBF24', description: 'Quando algo bom acontece e você se sente bem!' },
  { name: 'Triste', emoji: '😢', color: '#60A5FA', description: 'Quando algo ruim acontece e dá vontade de chorar.' },
  { name: 'Com raiva', emoji: '😠', color: '#EF4444', description: 'Quando algo parece injusto e dá vontade de gritar.' },
  { name: 'Com medo', emoji: '😨', color: '#A78BFA', description: 'Quando algo assusta ou parece perigoso.' },
  { name: 'Ansioso', emoji: '😰', color: '#F97316', description: 'Quando você fica preocupado com algo que vai acontecer.' },
  { name: 'Orgulhoso', emoji: '🥳', color: '#10B981', description: 'Quando você consegue algo difícil e se sente incrível!' },
  { name: 'Entediado', emoji: '😐', color: '#6B7280', description: 'Quando nada parece interessante ou divertido.' },
  { name: 'Envergonhado', emoji: '😳', color: '#EC4899', description: 'Quando faz algo na frente de outros e fica sem jeito.' },
];

export interface EmotionChallenge { id: string; scenario: string; emoji: string; correctEmotion: string; options: string[]; correctIndex: number; tip: string; difficulty: number; }

const CHALLENGES: EmotionChallenge[] = [
  { id: 'e1', difficulty: 1, emoji: '🎁', scenario: 'Você ganhou um presente surpresa do seu melhor amigo!', correctEmotion: 'Feliz', options: ['Feliz', 'Triste', 'Com raiva', 'Com medo'], correctIndex: 0, tip: 'Presentes inesperados nos deixam felizes! Que bom ter amigos assim!' },
  { id: 'e2', difficulty: 1, emoji: '🐶', scenario: 'Seu cachorrinho está doente e precisa ir ao veterinário.', correctEmotion: 'Triste', options: ['Feliz', 'Triste', 'Entediado', 'Orgulhoso'], correctIndex: 1, tip: 'É normal ficar triste quando quem amamos não está bem. Cuidar é um ato de amor!' },
  { id: 'e3', difficulty: 1, emoji: '🏆', scenario: 'Você estudou muito e tirou a melhor nota da classe!', correctEmotion: 'Orgulhoso', options: ['Com medo', 'Triste', 'Orgulhoso', 'Entediado'], correctIndex: 2, tip: 'Quando nosso esforço dá resultado, sentimos orgulho! Você merece!' },
  { id: 'e4', difficulty: 1, emoji: '⛈️', scenario: 'Está trovejando muito forte e as luzes apagaram!', correctEmotion: 'Com medo', options: ['Feliz', 'Orgulhoso', 'Com medo', 'Com raiva'], correctIndex: 2, tip: 'Ter medo é normal! Falar sobre o medo com alguém ajuda muito.' },
  { id: 'e5', difficulty: 2, emoji: '🤥', scenario: 'Seu amigo contou seu segredo para todo mundo.', correctEmotion: 'Com raiva', options: ['Feliz', 'Com raiva', 'Orgulhoso', 'Entediado'], correctIndex: 1, tip: 'Sentir raiva é normal quando a confiança é quebrada. Conversar sobre isso ajuda!' },
  { id: 'e6', difficulty: 2, emoji: '📝', scenario: 'Amanhã tem prova e você não estudou quase nada.', correctEmotion: 'Ansioso', options: ['Feliz', 'Ansioso', 'Orgulhoso', 'Entediado'], correctIndex: 1, tip: 'Ansiedade é o corpo avisando que algo precisa de atenção. Respire fundo e organize-se!' },
  { id: 'e7', difficulty: 2, emoji: '🎤', scenario: 'Você vai cantar sozinho na frente de toda a escola.', correctEmotion: 'Envergonhado', options: ['Entediado', 'Com raiva', 'Envergonhado', 'Triste'], correctIndex: 2, tip: 'Vergonha antes de se apresentar é super normal! Respire e confie em você!' },
  { id: 'e8', difficulty: 2, emoji: '🧩', scenario: 'Você está tentando montar um quebra-cabeça de 1000 peças há 3 horas.', correctEmotion: 'Ansioso', options: ['Feliz', 'Ansioso', 'Com medo', 'Orgulhoso'], correctIndex: 1, tip: 'Tarefas longas podem causar ansiedade. Fazer pausas e celebrar pequenas vitórias ajuda!' },
];

export function getChallengesForAge(ageGroup: AgeGroup): EmotionChallenge[] {
  switch (ageGroup) { case 'chick': case 'explorer': return CHALLENGES.filter((c) => c.difficulty === 1); case 'adventurer': case 'master': return CHALLENGES; default: return CHALLENGES.filter((c) => c.difficulty === 1); }
}

export function selectChallenges(ageGroup: AgeGroup): EmotionChallenge[] {
  const pool = getChallengesForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'chick' ? 3 : ageGroup === 'explorer' ? 4 : 6);
}

export function checkEmotionAnswer(challenge: EmotionChallenge, idx: number): boolean { return idx === challenge.correctIndex; }

export function getEmotionByName(name: string): Emotion | undefined { return EMOTIONS.find((e) => e.name === name); }

export function calculateEmotionScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0; const stars = calculateStars(accuracy);
  return { score: correct * 15, maxScore: total * 15, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
