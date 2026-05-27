import type { GameConfig } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export const roboticaVirtualConfig: GameConfig = {
  id: 'robotica-virtual', name: 'Robótica Virtual', description: 'Programe robôs virtuais! Aprenda sobre sensores, motores e engenharia!',
  category: 'programming', ageGroups: ['adventurer', 'master'], icon: '🦾', color: '#0891B2',
  difficulty: { min: 1, max: 10 }, estimatedMinutes: 5, skills: ['robótica', 'engenharia', 'sensores', 'programação', 'mecânica'], version: '1.0.0',
};

export interface RobotChallenge {
  id: string; question: string; emoji: string; topic: string;
  options: string[]; correctIndex: number; explanation: string; difficulty: number;
}

const CHALLENGES: RobotChallenge[] = [
  { id: 'rb1', emoji: '🤖', topic: 'Básico', difficulty: 1, question: 'O que um robô precisa para se mover?', options: ['Motor e energia', 'Apenas software', 'Só uma bateria', 'Nada, ele anda sozinho'], correctIndex: 0, explanation: 'Robôs precisam de motores (para mover) e energia (bateria ou eletricidade)!' },
  { id: 'rb2', emoji: '👁️', topic: 'Sensores', difficulty: 1, question: 'O que um sensor faz no robô?', options: ['Faz o robô pensar', 'Permite perceber o ambiente (luz, distância, som)', 'Decora o robô', 'Controla a velocidade'], correctIndex: 1, explanation: 'Sensores são os "sentidos" do robô — detectam luz, som, distância e mais!' },
  { id: 'rb3', emoji: '🔋', topic: 'Energia', difficulty: 1, question: 'Qual fonte de energia é mais usada em robôs pequenos?', options: ['Gasolina', 'Bateria recarregável', 'Energia solar apenas', 'Carvão'], correctIndex: 1, explanation: 'Baterias recarregáveis são leves e eficientes para robôs portáteis!' },
  { id: 'rb4', emoji: '📡', topic: 'Sensores', difficulty: 2, question: 'Um sensor ultrassônico mede...', options: ['Temperatura', 'Distância usando ondas sonoras', 'Cor dos objetos', 'Peso dos objetos'], correctIndex: 1, explanation: 'Sensores ultrassônicos emitem som e medem o tempo do eco — como morcegos!' },
  { id: 'rb5', emoji: '⚙️', topic: 'Mecânica', difficulty: 2, question: 'Por que robôs usam engrenagens?', options: ['Para fazer barulho', 'Para mudar velocidade e força do motor', 'Para ficar bonito', 'Para pesar mais'], correctIndex: 1, explanation: 'Engrenagens multiplicam força ou velocidade — permitem o robô ser mais forte ou mais rápido!' },
  { id: 'rb6', emoji: '🧠', topic: 'Programação', difficulty: 2, question: 'Como um robô "decide" o que fazer?', options: ['Pensa sozinho', 'Segue instruções programadas (algoritmo)', 'Pergunta para as pessoas', 'Adivinha'], correctIndex: 1, explanation: 'Robôs seguem algoritmos — sequências de instruções programadas por humanos!' },
  { id: 'rb7', emoji: '🔄', topic: 'Controle', difficulty: 3, question: 'O que é um "loop de controle" em robótica?', options: ['O robô gira em círculos', 'Ciclo: sensor → processar → agir → repetir', 'Um tipo de motor', 'Um erro do robô'], correctIndex: 1, explanation: 'O loop de controle é: ler sensores → processar dados → executar ação → repetir! É o ciclo fundamental da robótica.' },
  { id: 'rb8', emoji: '🦿', topic: 'Tipos', difficulty: 3, question: 'O que diferencia um robô autônomo de um controlado?', options: ['A cor', 'O autônomo decide sozinho, o controlado precisa de humano', 'O tamanho', 'Nada, são iguais'], correctIndex: 1, explanation: 'Robôs autônomos tomam decisões com IA e sensores. Controlados são operados por humanos (como drones RC)!' },
  { id: 'rb9', emoji: '🏭', topic: 'Aplicações', difficulty: 2, question: 'Onde robôs são mais usados hoje?', options: ['Só em filmes', 'Fábricas, hospitais, exploração espacial', 'Apenas em laboratórios', 'Só para diversão'], correctIndex: 1, explanation: 'Robôs já trabalham em fábricas, ajudam cirurgias, exploram Marte e muito mais!' },
  { id: 'rb10', emoji: '🔧', topic: 'Construção', difficulty: 3, question: 'Qual é a ordem correta para construir um robô?', options: ['Programar → Montar → Testar', 'Projetar → Montar → Programar → Testar', 'Testar → Montar → Programar', 'Montar e torcer pra funcionar'], correctIndex: 1, explanation: 'O processo de engenharia: primeiro projeta, depois monta, programa e por fim testa e melhora!' },
];

export function getChallengesForAge(ageGroup: AgeGroup): RobotChallenge[] {
  switch (ageGroup) { case 'adventurer': return CHALLENGES.filter((c) => c.difficulty <= 2); case 'master': return CHALLENGES; default: return CHALLENGES.filter((c) => c.difficulty <= 2); }
}

export function selectChallenges(ageGroup: AgeGroup): RobotChallenge[] {
  const pool = getChallengesForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'master' ? 8 : 6);
}

export function checkRobotAnswer(challenge: RobotChallenge, idx: number): boolean { return idx === challenge.correctIndex; }

export function calculateRobotScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0; const stars = calculateStars(accuracy);
  return { score: correct * 18, maxScore: total * 18, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
