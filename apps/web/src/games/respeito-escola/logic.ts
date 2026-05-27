import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface RespectScenario {
  id: string; situation: string; emoji: string; theme: string;
  responses: Array<{ text: string; respect: number; feedback: string }>;
  difficulty: number;
}

const SCENARIOS: RespectScenario[] = [
  { id: 'r1', emoji: '👧', theme: 'Inclusão', difficulty: 1, situation: 'Uma colega nova veio de outro país e fala diferente. Alguns estão rindo dela.',
    responses: [
      { text: 'Defender ela e dizer que rir de diferenças é errado', respect: 100, feedback: 'Corajoso e gentil! Defender os outros é a coisa certa. Todo mundo merece respeito!' },
      { text: 'Rir junto com os outros', respect: 0, feedback: 'Rir de alguém machuca muito. Imagine como você se sentiria no lugar dela.' },
      { text: 'Não falar nada, fingir que não viu', respect: 30, feedback: 'O silêncio pode parecer concordância. Falar algo faz diferença!' },
    ],
  },
  { id: 'r2', emoji: '🧑‍🦽', theme: 'Acessibilidade', difficulty: 1, situation: 'Um colega de cadeira de rodas não consegue alcançar algo na prateleira alta.',
    responses: [
      { text: 'Perguntar se ele quer ajuda e pegar pra ele', respect: 100, feedback: 'Perfeito! Oferecer ajuda com respeito é gentileza. Perguntar primeiro é importante!' },
      { text: 'Ignorar, não é problema seu', respect: 10, feedback: 'Todos podemos ajudar! Empatia é se colocar no lugar do outro.' },
      { text: 'Pegar sem perguntar', respect: 50, feedback: 'A intenção é boa, mas sempre pergunte antes! Respeite a autonomia da pessoa.' },
    ],
  },
  { id: 'r3', emoji: '📖', theme: 'Diferenças', difficulty: 1, situation: 'Seu amigo tem dificuldade pra ler e demora mais que os outros na lição.',
    responses: [
      { text: 'Ajudar com paciência e sem julgar', respect: 100, feedback: 'Incrível! Cada pessoa tem seu tempo. Ajudar com paciência é a melhor atitude!' },
      { text: 'Falar que ele é lento', respect: 0, feedback: 'Comentários assim machucam e desanimam. Cada pessoa aprende no seu ritmo!' },
      { text: 'Fazer a lição por ele', respect: 40, feedback: 'Melhor ajudar a entender do que fazer por ele. Assim ele aprende de verdade!' },
    ],
  },
  { id: 'r4', emoji: '🎨', theme: 'Expressão', difficulty: 2, situation: 'Um menino da classe gosta de desenhar flores e os outros dizem que é "coisa de menina".',
    responses: [
      { text: 'Dizer que arte não tem gênero — todo mundo pode gostar de tudo', respect: 100, feedback: 'Exato! Não existe "coisa de menino" ou "coisa de menina". Cada um gosta do que gosta!' },
      { text: 'Concordar com os outros', respect: 0, feedback: 'Rotular interesses por gênero limita a criatividade e machuca. Arte é para todos!' },
      { text: 'Não falar nada', respect: 30, feedback: 'Às vezes, falar uma palavra de apoio muda o dia de alguém!' },
    ],
  },
  { id: 'r5', emoji: '🍽️', theme: 'Cultura', difficulty: 2, situation: 'Um colega trouxe uma comida típica do país dele que tem um cheiro diferente. Alguns estão fazendo cara feia.',
    responses: [
      { text: 'Mostrar interesse e perguntar sobre a comida', respect: 100, feedback: 'Que legal! Conhecer culturas diferentes através da comida é incrível! Curiosidade é respeito.' },
      { text: 'Fazer cara de nojo', respect: 0, feedback: 'O que é diferente não é ruim! Cada cultura tem suas comidas especiais.' },
      { text: 'Comer só a sua comida sem comentar', respect: 40, feedback: 'Tudo bem, mas mostrar interesse seria mais gentil e inclusivo!' },
    ],
  },
  { id: 'r6', emoji: '🏳️‍🌈', theme: 'Família', difficulty: 2, situation: 'Um colega conta que tem dois pais (ou duas mães). Alguém diz que "isso é estranho".',
    responses: [
      { text: 'Dizer que existem muitos tipos de família e todas são válidas', respect: 100, feedback: 'Perfeito! O que importa é o amor e o cuidado, não o formato da família!' },
      { text: 'Concordar que é estranho', respect: 0, feedback: 'Famílias são diversas! Ter dois pais ou duas mães é uma forma de família como qualquer outra.' },
      { text: 'Mudar de assunto', respect: 30, feedback: 'Evitar o assunto não ajuda. Demonstrar apoio faz diferença!' },
    ],
  },
];

export function getScenariosForAge(ageGroup: AgeGroup): RespectScenario[] {
  switch (ageGroup) { case 'explorer': return SCENARIOS.filter((s) => s.difficulty === 1); case 'adventurer': case 'master': return SCENARIOS; default: return SCENARIOS.filter((s) => s.difficulty === 1); }
}

export function selectScenarios(ageGroup: AgeGroup): RespectScenario[] {
  const pool = getScenariosForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'explorer' ? 3 : 5);
}

export function evaluateRespectChoice(scenario: RespectScenario, idx: number): { respect: number; feedback: string } {
  const r = scenario.responses[idx]; return r ? { respect: r.respect, feedback: r.feedback } : { respect: 0, feedback: '' };
}

export function calculateRespectScore(totalRespect: number, maxRespect: number, timeSpent: number): GameResult {
  const accuracy = maxRespect > 0 ? totalRespect / maxRespect : 0; const stars = calculateStars(accuracy);
  return { score: totalRespect, maxScore: maxRespect, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
