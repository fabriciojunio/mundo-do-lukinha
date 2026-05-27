import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface MoneyScenario {
  id: string;
  situation: string;
  emoji: string;
  options: Array<{ text: string; moneyEffect: number; savingsEffect: number; wisdom: number; feedback: string }>;
  topic: 'earning' | 'saving' | 'spending' | 'investing';
  difficulty: number;
}

const SCENARIOS: MoneyScenario[] = [
  { id: 'm1', emoji: '🎂', topic: 'earning', difficulty: 1,
    situation: 'Você ganhou R$50 de presente de aniversário! O que fazer?',
    options: [
      { text: 'Gastar tudo em doces', moneyEffect: -50, savingsEffect: 0, wisdom: 20, feedback: 'Gastar tudo de uma vez não é muito esperto... Os doces acabam rápido!' },
      { text: 'Guardar tudo no cofrinho', moneyEffect: 0, savingsEffect: 50, wisdom: 80, feedback: 'Ótimo! Guardar é muito importante! Mas também pode usar um pouquinho.' },
      { text: 'Guardar R$30 e usar R$20 para algo legal', moneyEffect: -20, savingsEffect: 30, wisdom: 100, feedback: 'Perfeito! Guardar a maior parte e usar um pouco é o equilíbrio ideal!' },
    ],
  },
  { id: 'm2', emoji: '🧸', topic: 'spending', difficulty: 1,
    situation: 'Você quer um brinquedo de R$30 mas só tem R$20. O que fazer?',
    options: [
      { text: 'Pedir emprestado para um amigo', moneyEffect: -30, savingsEffect: 0, wisdom: 20, feedback: 'Dívidas devem ser evitadas! É melhor esperar e juntar o dinheiro.' },
      { text: 'Esperar e juntar mais R$10', moneyEffect: 0, savingsEffect: 0, wisdom: 100, feedback: 'Excelente! Paciência é a chave! Esperar e juntar é a decisão mais inteligente!' },
      { text: 'Comprar outro brinquedo mais barato', moneyEffect: -15, savingsEffect: 0, wisdom: 70, feedback: 'Boa alternativa! Adaptar o desejo ao que você pode é esperto!' },
    ],
  },
  { id: 'm3', emoji: '🍕', topic: 'spending', difficulty: 1,
    situation: 'Você tem R$10. Uma pizza custa R$8 e um lanche R$4. O que comprar?',
    options: [
      { text: 'Pizza e ficar sem dinheiro', moneyEffect: -8, savingsEffect: 0, wisdom: 40, feedback: 'A pizza é gostosa, mas ficou sem nenhuma reserva!' },
      { text: 'Lanche e guardar R$6', moneyEffect: -4, savingsEffect: 6, wisdom: 100, feedback: 'Ótima escolha! Comeu bem e ainda guardou dinheiro!' },
      { text: 'Não comprar nada e guardar tudo', moneyEffect: 0, savingsEffect: 10, wisdom: 60, feedback: 'Guardar é bom, mas também precisa se alimentar! Equilíbrio é importante.' },
    ],
  },
  { id: 'm4', emoji: '💰', topic: 'saving', difficulty: 2,
    situation: 'Você juntou R$100 no cofrinho. Um amigo pede R$50 emprestado. O que fazer?',
    options: [
      { text: 'Emprestar os R$50', moneyEffect: -50, savingsEffect: -50, wisdom: 30, feedback: 'Emprestar muito pode ser arriscado. E se o amigo não devolver?' },
      { text: 'Emprestar R$20 e combinar a devolução', moneyEffect: -20, savingsEffect: -20, wisdom: 100, feedback: 'Perfeito! Ajuda o amigo sem arriscar muito, e combina a devolução!' },
      { text: 'Dizer não, é seu dinheiro', moneyEffect: 0, savingsEffect: 0, wisdom: 60, feedback: 'Proteger seu dinheiro é importante, mas ajudar amigos também!' },
    ],
  },
  { id: 'm5', emoji: '📈', topic: 'investing', difficulty: 2,
    situation: 'Você tem R$200 guardados. Descobre que pode "investir" e o dinheiro crescer. O que fazer?',
    options: [
      { text: 'Investir tudo de uma vez', moneyEffect: 0, savingsEffect: 0, wisdom: 40, feedback: 'Investir tudo é arriscado! Sempre mantenha uma reserva de emergência.' },
      { text: 'Investir R$100 e manter R$100 de reserva', moneyEffect: 0, savingsEffect: 0, wisdom: 100, feedback: 'Perfeito! Investir metade e manter reserva é a estratégia mais inteligente!' },
      { text: 'Não investir, deixar tudo no cofrinho', moneyEffect: 0, savingsEffect: 0, wisdom: 50, feedback: 'Seguro, mas o dinheiro parado perde valor com o tempo. Investir é aprender!' },
    ],
  },
  { id: 'm6', emoji: '🏪', topic: 'spending', difficulty: 2,
    situation: 'Uma loja tem promoção: "Compre 3, pague 2!" Você só precisa de 1. O que fazer?',
    options: [
      { text: 'Comprar 3, é promoção!', moneyEffect: -20, savingsEffect: 0, wisdom: 30, feedback: 'Promoção de algo que você não precisa não é economia — é gasto desnecessário!' },
      { text: 'Comprar só 1 que precisa', moneyEffect: -10, savingsEffect: 0, wisdom: 100, feedback: 'Excelente! Comprar só o necessário é a decisão mais inteligente!' },
      { text: 'Não comprar nada', moneyEffect: 0, savingsEffect: 0, wisdom: 50, feedback: 'Se você precisa de 1, não comprar não resolve. Comprar o necessário é o certo!' },
    ],
  },
  { id: 'm7', emoji: '🎮', topic: 'saving', difficulty: 3,
    situation: 'Você quer um videogame de R$500. Ganha R$50 por mês de mesada. O que fazer?',
    options: [
      { text: 'Esperar 10 meses poupando tudo', moneyEffect: 0, savingsEffect: 0, wisdom: 70, feedback: 'Bom plano, mas 10 meses sem gastar nada é difícil!' },
      { text: 'Poupar R$30/mês e usar R$20 para diversão', moneyEffect: 0, savingsEffect: 0, wisdom: 100, feedback: 'Perfeito! Em ~17 meses você alcança, e ainda se diverte no caminho!' },
      { text: 'Pedir para os pais comprarem', moneyEffect: 0, savingsEffect: 0, wisdom: 30, feedback: 'Aprender a conquistar com seu próprio esforço é mais valioso que o videogame!' },
    ],
  },
  { id: 'm8', emoji: '🏦', topic: 'investing', difficulty: 3,
    situation: 'O que significa "juros compostos"?',
    options: [
      { text: 'Juros sobre juros — o dinheiro cresce cada vez mais rápido', moneyEffect: 0, savingsEffect: 0, wisdom: 100, feedback: 'Exato! Juros compostos são o superpoder do investidor! O dinheiro cresce exponencialmente!' },
      { text: 'Juros que ficam parados', moneyEffect: 0, savingsEffect: 0, wisdom: 20, feedback: 'Não! Juros compostos são juros sobre juros — o dinheiro cresce acelerado!' },
      { text: 'Juros que o banco cobra', moneyEffect: 0, savingsEffect: 0, wisdom: 40, feedback: 'Parcialmente! Juros compostos podem trabalhar a seu favor (poupança) ou contra (dívida)!' },
    ],
  },
];

export function getScenariosForAge(ageGroup: AgeGroup): MoneyScenario[] {
  switch (ageGroup) {
    case 'explorer': return SCENARIOS.filter((s) => s.difficulty === 1);
    case 'adventurer': return SCENARIOS.filter((s) => s.difficulty <= 2);
    case 'master': return SCENARIOS;
    default: return SCENARIOS.filter((s) => s.difficulty === 1);
  }
}

export function selectScenarios(ageGroup: AgeGroup): MoneyScenario[] {
  const pool = getScenariosForAge(ageGroup);
  const count = ageGroup === 'explorer' ? 3 : ageGroup === 'adventurer' ? 5 : 7;
  return shuffleArray(pool).slice(0, count);
}

export function evaluateMoneyChoice(scenario: MoneyScenario, optionIndex: number): { wisdom: number; feedback: string } {
  const opt = scenario.options[optionIndex];
  return opt ? { wisdom: opt.wisdom, feedback: opt.feedback } : { wisdom: 0, feedback: '' };
}

export function calculateMoneyScore(totalWisdom: number, maxWisdom: number, scenarios: number, timeSpent: number): GameResult {
  const accuracy = maxWisdom > 0 ? totalWisdom / maxWisdom : 0;
  const stars = calculateStars(accuracy);
  return { score: totalWisdom, maxScore: maxWisdom, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
