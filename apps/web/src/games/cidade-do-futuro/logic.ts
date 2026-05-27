import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface EthicalDilemma {
  id: string;
  scenario: string;
  emoji: string;
  options: Array<{ text: string; impact: number; feedback: string }>;
  topic: string;
  difficulty: number;
}

const DILEMMAS: EthicalDilemma[] = [
  { id: 'd1', emoji: '🤖', topic: 'Robôs no trabalho', difficulty: 1, scenario: 'Uma fábrica quer substituir todos os trabalhadores por robôs. O que você acha?',
    options: [
      { text: 'Robôs fazem tudo, pessoas ficam em casa', impact: 30, feedback: 'Mas e o emprego das pessoas? Elas precisam trabalhar e se sentir úteis.' },
      { text: 'Robôs ajudam, mas pessoas ainda trabalham junto', impact: 100, feedback: 'Ótimo! Tecnologia funciona melhor quando ajuda as pessoas, não substitui.' },
      { text: 'Nada de robôs, só pessoas', impact: 50, feedback: 'Entendo a preocupação, mas a tecnologia pode ajudar a fazer trabalhos perigosos!' },
    ],
  },
  { id: 'd2', emoji: '📱', topic: 'Privacidade', difficulty: 1, scenario: 'Um app gratuito pede acesso a todas as suas fotos, contatos e localização. O que fazer?',
    options: [
      { text: 'Aceitar tudo, é grátis!', impact: 20, feedback: 'Cuidado! "Se é grátis, o produto é você." Seus dados valem muito!' },
      { text: 'Só aceitar o que o app realmente precisa', impact: 100, feedback: 'Perfeito! Sempre dê só as permissões necessárias. Menos é mais!' },
      { text: 'Nunca instalar nenhum app', impact: 40, feedback: 'Não precisa evitar tudo! Basta ser cuidadoso com permissões.' },
    ],
  },
  { id: 'd3', emoji: '🎓', topic: 'IA na escola', difficulty: 2, scenario: 'Um aluno usou IA para escrever toda a redação da escola. Isso é certo?',
    options: [
      { text: 'Sim, é esperto usar a tecnologia', impact: 20, feedback: 'Usar IA sem aprender nada não é esperto — é como copiar a prova!' },
      { text: 'Usar IA para ajudar a pensar, mas escrever com suas palavras', impact: 100, feedback: 'Exato! IA é uma ferramenta para aprender, não para substituir seu cérebro!' },
      { text: 'IA não deveria existir na escola', impact: 40, feedback: 'A IA pode ser muito útil se usada corretamente como ferramenta de aprendizado!' },
    ],
  },
  { id: 'd4', emoji: '🚗', topic: 'Carros autônomos', difficulty: 2, scenario: 'Um carro autônomo precisa decidir: desviar e bater num muro (machucando o passageiro) ou continuar e atingir um pedestre. Quem programa essa decisão?',
    options: [
      { text: 'O carro decide sozinho', impact: 30, feedback: 'Decisões de vida ou morte não podem ser só do algoritmo — humanos precisam definir as regras!' },
      { text: 'Engenheiros, filósofos e a sociedade decidem juntos', impact: 100, feedback: 'Perfeito! Decisões éticas complexas precisam de muitas perspectivas diferentes!' },
      { text: 'Ninguém, carros autônomos não deveriam existir', impact: 40, feedback: 'Eles podem salvar milhares de vidas! O desafio é fazer as regras certas.' },
    ],
  },
  { id: 'd5', emoji: '🗳️', topic: 'Fake news', difficulty: 2, scenario: 'Uma IA pode criar vídeos falsos perfeitos de qualquer pessoa. Como a sociedade deve lidar com isso?',
    options: [
      { text: 'Proibir toda IA de fazer vídeos', impact: 40, feedback: 'Proibir totalmente é difícil e impede usos bons como cinema e educação.' },
      { text: 'Criar leis e ferramentas para detectar vídeos falsos', impact: 100, feedback: 'Ótimo! Regulamentação + tecnologia de detecção é o caminho mais equilibrado!' },
      { text: 'Não fazer nada, as pessoas vão aprender', impact: 20, feedback: 'Fake news pode causar muito dano! Precisamos de ação ativa.' },
    ],
  },
  { id: 'd6', emoji: '🏥', topic: 'IA na saúde', difficulty: 3, scenario: 'Uma IA diagnostica doenças melhor que médicos humanos. Devemos confiar só na IA?',
    options: [
      { text: 'Sim, se é melhor, substitui o médico', impact: 30, feedback: 'IA pode errar de formas que humanos não erram. Saúde precisa de empatia e contexto!' },
      { text: 'IA ajuda o médico, mas a decisão final é humana', impact: 100, feedback: 'Perfeito! IA como assistente poderosa + médico humano = melhor resultado!' },
      { text: 'Não confiar em IA para saúde', impact: 30, feedback: 'IA pode salvar vidas detectando doenças cedo! O ideal é usar junto com médicos.' },
    ],
  },
];

export function getDilemmasForAge(ageGroup: AgeGroup): EthicalDilemma[] {
  switch (ageGroup) { case 'adventurer': return DILEMMAS.filter((d) => d.difficulty <= 2); case 'master': return DILEMMAS; default: return DILEMMAS.filter((d) => d.difficulty <= 2); }
}

export function selectDilemmas(ageGroup: AgeGroup): EthicalDilemma[] {
  const pool = getDilemmasForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'master' ? 5 : 4);
}

export function evaluateChoice(dilemma: EthicalDilemma, optionIndex: number): { impact: number; feedback: string } {
  const option = dilemma.options[optionIndex];
  return option ? { impact: option.impact, feedback: option.feedback } : { impact: 0, feedback: '' };
}

export function calculateEthicsScore(totalImpact: number, maxImpact: number, dilemmasAnswered: number, timeSpent: number): GameResult {
  const accuracy = maxImpact > 0 ? totalImpact / maxImpact : 0;
  const stars = calculateStars(accuracy);
  return { score: totalImpact, maxScore: maxImpact, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
