import type { GameConfig } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export const debateClubConfig: GameConfig = {
  id: 'debate-club', name: 'Debate Club', description: 'Desenvolva o pensamento crítico! Analise argumentos e forme opiniões fundamentadas!',
  category: 'life-skills', ageGroups: ['adventurer', 'master'], icon: '🗣️', color: '#DC2626',
  difficulty: { min: 1, max: 10 }, estimatedMinutes: 5, skills: ['pensamento crítico', 'argumentação', 'debate', 'análise', 'opinião'], version: '1.0.0',
};

export interface DebateTopic {
  id: string; topic: string; emoji: string; context: string;
  arguments: Array<{ text: string; quality: number; type: 'strong' | 'weak' | 'fallacy'; feedback: string }>;
  difficulty: number;
}

const TOPICS: DebateTopic[] = [
  { id: 'd1', emoji: '📱', topic: 'Crianças devem ter celular?', difficulty: 1,
    context: 'Muitos pais se perguntam com que idade dar um celular para os filhos.',
    arguments: [
      { text: 'Sim, mas com limites de tempo e supervisão dos pais', quality: 100, type: 'strong', feedback: 'Excelente argumento! Reconhece benefícios com responsabilidade.' },
      { text: 'Sim, sem nenhum limite, crianças sabem se cuidar', quality: 20, type: 'weak', feedback: 'Argumento fraco. Crianças precisam de orientação — até adultos têm dificuldade com limites digitais.' },
      { text: 'Não, celular é perigoso e deve ser proibido até os 18', quality: 40, type: 'weak', feedback: 'Muito extremo. Tecnologia faz parte da vida moderna e pode ser educativa com moderação.' },
    ],
  },
  { id: 'd2', emoji: '🏫', topic: 'A escola deveria ter mais aulas de arte e música?', difficulty: 1,
    context: 'Algumas pessoas acham que só matérias como português e matemática importam.',
    arguments: [
      { text: 'Sim, arte e música desenvolvem criatividade, empatia e expressão', quality: 100, type: 'strong', feedback: 'Argumento forte! Estudos mostram que artes melhoram o desempenho em todas as matérias.' },
      { text: 'Não, é perda de tempo — só importa português e matemática', quality: 20, type: 'fallacy', feedback: 'Falácia! Educação completa inclui artes. Grandes cientistas também eram artistas.' },
      { text: 'Tanto faz, deixa como está', quality: 30, type: 'weak', feedback: 'Argumento fraco. Não questionar o sistema é perder oportunidades de melhoria.' },
    ],
  },
  { id: 'd3', emoji: '🎮', topic: 'Videogames fazem mal para crianças?', difficulty: 2,
    context: 'Videogames são muito populares, mas há debate sobre seus efeitos.',
    arguments: [
      { text: 'Depende — com moderação trazem benefícios (lógica, reflexo, criatividade); em excesso causam problemas', quality: 100, type: 'strong', feedback: 'Argumento excelente! Nuanced e baseado em evidências. O problema é o excesso, não o videogame.' },
      { text: 'Sim, videogames sempre fazem mal e deixam violento', quality: 15, type: 'fallacy', feedback: 'Falácia da generalização! Pesquisas não comprovam essa relação direta. Existem jogos educativos!' },
      { text: 'Não, videogames são perfeitos e sem nenhum risco', quality: 25, type: 'weak', feedback: 'Argumento exagerado. Tudo em excesso pode ser prejudicial — equilíbrio é fundamental.' },
    ],
  },
  { id: 'd4', emoji: '🌍', topic: 'Quem é responsável por combater as mudanças climáticas?', difficulty: 2,
    context: 'O planeta está esquentando. De quem é a responsabilidade?',
    arguments: [
      { text: 'É responsabilidade de todos — governos, empresas E cidadãos devem agir juntos', quality: 100, type: 'strong', feedback: 'Argumento forte! A crise climática precisa de ação em todos os níveis — individual e coletiva.' },
      { text: 'Só os governos e empresas, pessoas comuns não fazem diferença', quality: 30, type: 'weak', feedback: 'Parcialmente verdade — empresas poluem mais, mas bilhões de pequenas ações individuais fazem enorme diferença!' },
      { text: 'Mudanças climáticas não existem', quality: 5, type: 'fallacy', feedback: 'Negação da ciência. 97% dos cientistas do clima confirmam o aquecimento global causado por humanos.' },
    ],
  },
  { id: 'd5', emoji: '🤖', topic: 'IA vai substituir os professores?', difficulty: 3,
    context: 'Inteligência Artificial está ficando cada vez mais presente na educação.',
    arguments: [
      { text: 'IA será uma ferramenta poderosa, mas professores humanos são insubstituíveis pela empatia e conexão', quality: 100, type: 'strong', feedback: 'Argumento brilhante! IA pode personalizar o ensino, mas o fator humano — empatia, inspiração, exemplo — é único.' },
      { text: 'Sim, IA é melhor que humanos em tudo', quality: 15, type: 'fallacy', feedback: 'Falácia. IA é ótima em dados, mas não tem empatia, criatividade original ou capacidade de inspirar.' },
      { text: 'Não, IA é inútil na educação', quality: 20, type: 'weak', feedback: 'Argumento fraco. IA já ajuda milhões de estudantes com tutoria personalizada, tradução e mais.' },
    ],
  },
  { id: 'd6', emoji: '📚', topic: 'Lição de casa é necessária?', difficulty: 2,
    context: 'Alguns países reduziram ou eliminaram lição de casa. Será que funciona?',
    arguments: [
      { text: 'Em quantidade moderada sim — reforça o aprendizado, mas excesso causa estresse e tira tempo de brincar', quality: 100, type: 'strong', feedback: 'Argumento equilibrado! Pesquisas mostram que lição moderada ajuda, mas excesso prejudica saúde mental.' },
      { text: 'Quanto mais lição, melhor — crianças devem estudar o dia todo', quality: 15, type: 'weak', feedback: 'Estudos mostram que excesso de lição não melhora o aprendizado e causa burnout!' },
      { text: 'Zero lição, escola deve resolver tudo no horário escolar', quality: 35, type: 'weak', feedback: 'Tem mérito, mas um pouco de prática em casa pode consolidar o aprendizado — o segredo é o equilíbrio.' },
    ],
  },
];

export function getTopicsForAge(ageGroup: AgeGroup): DebateTopic[] {
  switch (ageGroup) { case 'adventurer': return TOPICS.filter((t) => t.difficulty <= 2); case 'master': return TOPICS; default: return TOPICS.filter((t) => t.difficulty <= 2); }
}

export function selectTopics(ageGroup: AgeGroup): DebateTopic[] {
  const pool = getTopicsForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'master' ? 5 : 4);
}

export function evaluateDebateChoice(topic: DebateTopic, idx: number): { quality: number; feedback: string; type: string } {
  const arg = topic.arguments[idx];
  return arg ? { quality: arg.quality, feedback: arg.feedback, type: arg.type } : { quality: 0, feedback: '', type: '' };
}

export function calculateDebateScore(totalQuality: number, maxQuality: number, timeSpent: number): GameResult {
  const accuracy = maxQuality > 0 ? totalQuality / maxQuality : 0;
  const stars = calculateStars(accuracy);
  return { score: totalQuality, maxScore: maxQuality, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
