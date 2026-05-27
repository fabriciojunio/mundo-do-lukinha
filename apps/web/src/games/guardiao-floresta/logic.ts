import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface EcoScenario {
  id: string; situation: string; emoji: string; topic: string;
  options: Array<{ text: string; ecoImpact: number; feedback: string }>;
  difficulty: number;
}

const SCENARIOS: EcoScenario[] = [
  { id: 'e1', emoji: '🚿', topic: 'Água', difficulty: 1, situation: 'Você está escovando os dentes. A torneira está aberta.',
    options: [
      { text: 'Fechar a torneira enquanto escova', ecoImpact: 100, feedback: 'Perfeito! Fechar a torneira economiza até 12 litros por escovação!' },
      { text: 'Deixar aberta, é pouca água', ecoImpact: 20, feedback: 'Cada gota conta! Uma torneira aberta gasta 12 litros em 2 minutos!' },
      { text: 'Usar um copo com água', ecoImpact: 90, feedback: 'Ótima alternativa! Usar copo economiza ainda mais água!' },
    ],
  },
  { id: 'e2', emoji: '🗑️', topic: 'Reciclagem', difficulty: 1, situation: 'Você terminou de beber um suco de caixinha. O que fazer?',
    options: [
      { text: 'Jogar no lixo reciclável correto', ecoImpact: 100, feedback: 'Perfeito! Separar o lixo corretamente permite a reciclagem!' },
      { text: 'Jogar no chão', ecoImpact: 0, feedback: 'Nunca jogue lixo no chão! Polui rios, mata animais e faz mal a todos.' },
      { text: 'Jogar em qualquer lixeira', ecoImpact: 50, feedback: 'Melhor que no chão, mas separar no reciclável correto é o ideal!' },
    ],
  },
  { id: 'e3', emoji: '💡', topic: 'Energia', difficulty: 1, situation: 'Você saiu do quarto mas deixou a luz acesa e o ventilador ligado.',
    options: [
      { text: 'Voltar e desligar tudo', ecoImpact: 100, feedback: 'Ótimo! Economizar energia ajuda o planeta e o bolso da família!' },
      { text: 'Deixar ligado, vou voltar logo', ecoImpact: 30, feedback: 'Mesmo voltando logo, desligar economiza! Cada watt conta.' },
      { text: 'Pedir para alguém desligar', ecoImpact: 70, feedback: 'Funciona, mas o ideal é criar o hábito de desligar você mesmo!' },
    ],
  },
  { id: 'e4', emoji: '🌱', topic: 'Plantio', difficulty: 2, situation: 'Na escola, vocês podem escolher um projeto de meio ambiente.',
    options: [
      { text: 'Plantar uma horta comunitária', ecoImpact: 100, feedback: 'Incrível! Hortas produzem alimentos, melhoram o ar e ensinam sobre natureza!' },
      { text: 'Fazer cartazes sobre reciclagem', ecoImpact: 70, feedback: 'Bom! Conscientização é importante, mas ação prática impacta mais!' },
      { text: 'Não fazer nada, é só escola', ecoImpact: 10, feedback: 'Cada ação importa! Começar na escola inspira toda a comunidade!' },
    ],
  },
  { id: 'e5', emoji: '🐢', topic: 'Animais', difficulty: 2, situation: 'Você encontrou um pássaro machucado no parque.',
    options: [
      { text: 'Chamar um adulto ou ligar para resgate animal', ecoImpact: 100, feedback: 'Perfeito! Profissionais sabem como cuidar de animais silvestres com segurança!' },
      { text: 'Tentar cuidar em casa', ecoImpact: 40, feedback: 'A intenção é boa, mas animais silvestres precisam de cuidado profissional!' },
      { text: 'Ignorar, é só um pássaro', ecoImpact: 10, feedback: 'Cada animal importa no ecossistema! Ajudar é ser guardião da natureza.' },
    ],
  },
  { id: 'e6', emoji: '🛍️', topic: 'Consumo', difficulty: 2, situation: 'Você precisa de uma mochila nova. O que considerar?',
    options: [
      { text: 'Comprar uma durável que dure anos', ecoImpact: 100, feedback: 'Excelente! Produtos duráveis geram menos lixo e economizam dinheiro!' },
      { text: 'A mais barata, mesmo que dure pouco', ecoImpact: 30, feedback: 'Produtos descartáveis geram mais lixo. Às vezes o barato sai caro!' },
      { text: 'Ver se alguém tem uma pra doar', ecoImpact: 90, feedback: 'Reutilizar é uma das melhores formas de ajudar o planeta!' },
    ],
  },
];

export function getScenariosForAge(ageGroup: AgeGroup): EcoScenario[] {
  switch (ageGroup) { case 'explorer': return SCENARIOS.filter((s) => s.difficulty === 1); case 'adventurer': case 'master': return SCENARIOS; default: return SCENARIOS.filter((s) => s.difficulty === 1); }
}

export function selectScenarios(ageGroup: AgeGroup): EcoScenario[] {
  const pool = getScenariosForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'explorer' ? 3 : 5);
}

export function evaluateEcoChoice(scenario: EcoScenario, idx: number): { ecoImpact: number; feedback: string } {
  const opt = scenario.options[idx]; return opt ? { ecoImpact: opt.ecoImpact, feedback: opt.feedback } : { ecoImpact: 0, feedback: '' };
}

export function calculateEcoScore(totalImpact: number, maxImpact: number, timeSpent: number): GameResult {
  const accuracy = maxImpact > 0 ? totalImpact / maxImpact : 0; const stars = calculateStars(accuracy);
  return { score: totalImpact, maxScore: maxImpact, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
