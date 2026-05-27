import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface StoryScenario {
  id: string; story: string; emoji: string;
  choices: Array<{ text: string; consequence: string; kindness: number; emoji: string }>;
  theme: string; difficulty: number;
}

const STORIES: StoryScenario[] = [
  { id: 'st1', emoji: '👦', theme: 'Gentileza', difficulty: 1,
    story: 'Um colega novo chegou na escola e não conhece ninguém. Ele parece tímido e está sozinho no recreio.',
    choices: [
      { text: 'Ir conversar e convidar para brincar', consequence: 'O colega ficou super feliz e vocês viraram amigos! Ele sorriu o dia todo.', kindness: 100, emoji: '🤝' },
      { text: 'Ficar observando de longe', consequence: 'O colega continuou sozinho e ficou triste. Talvez amanhã ele não queira mais vir à escola.', kindness: 30, emoji: '👀' },
      { text: 'Falar dele com os amigos e rir', consequence: 'O colega ouviu e ficou muito magoado. Agora ele tem medo de ir à escola.', kindness: 0, emoji: '😢' },
    ],
  },
  { id: 'st2', emoji: '📱', theme: 'Honestidade', difficulty: 1,
    story: 'Você encontrou um celular perdido no chão do parque. Ninguém está olhando.',
    choices: [
      { text: 'Tentar devolver ao dono', consequence: 'O dono ficou muito grato e te agradeceu mil vezes! Você se sentiu orgulhoso.', kindness: 100, emoji: '✅' },
      { text: 'Levar para os pais decidirem', consequence: 'Boa ideia! Seus pais ajudaram a encontrar o dono. Trabalho em equipe!', kindness: 80, emoji: '👨‍👩‍👦' },
      { text: 'Guardar para você', consequence: 'O dono ficou desesperado sem o celular. Tinha fotos importantes da família.', kindness: 0, emoji: '😔' },
    ],
  },
  { id: 'st3', emoji: '🍰', theme: 'Compartilhar', difficulty: 1,
    story: 'Você ganhou o último pedaço de bolo. Seu irmão menor também queria.',
    choices: [
      { text: 'Dividir o bolo pela metade', consequence: 'Os dois ficaram felizes! Compartilhar é mais gostoso que comer sozinho.', kindness: 100, emoji: '💕' },
      { text: 'Comer tudo sozinho rapidinho', consequence: 'Seu irmão ficou chorando e seus pais ficaram decepcionados com você.', kindness: 10, emoji: '😭' },
      { text: 'Dar tudo para ele', consequence: 'Seu irmão ficou feliz, mas você ficou com fome. Dividir seria melhor!', kindness: 70, emoji: '🤷' },
    ],
  },
  { id: 'st4', emoji: '📝', theme: 'Responsabilidade', difficulty: 2,
    story: 'Você quebrou sem querer o vaso favorito da sua mãe. Ninguém viu.',
    choices: [
      { text: 'Contar a verdade e pedir desculpas', consequence: 'Sua mãe ficou triste mas orgulhosa da sua honestidade. A confiança ficou mais forte!', kindness: 100, emoji: '💪' },
      { text: 'Culpar o gato', consequence: 'Sua mãe descobriu a verdade depois e ficou decepcionada com a mentira.', kindness: 10, emoji: '🐱' },
      { text: 'Tentar colar com cola', consequence: 'Boa intenção, mas a cola não segurou. Melhor ter sido honesto desde o início!', kindness: 50, emoji: '🔧' },
    ],
  },
  { id: 'st5', emoji: '🏫', theme: 'Bullying', difficulty: 2,
    story: 'Você vê um grupo de colegas zoando e rindo de um menino por causa do jeito que ele se veste.',
    choices: [
      { text: 'Defender o menino e dizer que isso é errado', consequence: 'O menino ficou aliviado e grato. Os colegas pararam e até pediram desculpas!', kindness: 100, emoji: '🦸' },
      { text: 'Fingir que não viu', consequence: 'O bullying continuou e o menino ficou cada vez mais isolado. Ele precisava de ajuda.', kindness: 20, emoji: '🙈' },
      { text: 'Contar para um professor', consequence: 'O professor conversou com todos e a situação melhorou. Pedir ajuda é corajoso!', kindness: 90, emoji: '👩‍🏫' },
    ],
  },
  { id: 'st6', emoji: '🌳', theme: 'Meio Ambiente', difficulty: 2,
    story: 'Você e seus amigos estão no parque e alguém joga lixo no chão.',
    choices: [
      { text: 'Juntar o lixo e jogar na lixeira', consequence: 'Seus amigos viram e começaram a fazer igual! O parque ficou limpinho.', kindness: 100, emoji: '♻️' },
      { text: 'Ignorar, não foi você quem jogou', consequence: 'O lixo ficou lá e mais gente jogou também. O parque ficou sujo.', kindness: 20, emoji: '🗑️' },
      { text: 'Falar para quem jogou pegar de volta', consequence: 'A pessoa ficou com vergonha mas pegou. Ter coragem para falar é importante!', kindness: 80, emoji: '💬' },
    ],
  },
];

export function getStoriesForAge(ageGroup: AgeGroup): StoryScenario[] {
  switch (ageGroup) { case 'explorer': return STORIES.filter((s) => s.difficulty === 1); case 'adventurer': case 'master': return STORIES; default: return STORIES.filter((s) => s.difficulty === 1); }
}

export function selectStories(ageGroup: AgeGroup): StoryScenario[] {
  const pool = getStoriesForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'explorer' ? 3 : 5);
}

export function evaluateStoryChoice(story: StoryScenario, choiceIndex: number): { kindness: number; consequence: string; emoji: string } {
  const choice = story.choices[choiceIndex];
  return choice ? { kindness: choice.kindness, consequence: choice.consequence, emoji: choice.emoji } : { kindness: 0, consequence: '', emoji: '' };
}

export function calculateStoryScore(totalKindness: number, maxKindness: number, stories: number, timeSpent: number): GameResult {
  const accuracy = maxKindness > 0 ? totalKindness / maxKindness : 0; const stars = calculateStars(accuracy);
  return { score: totalKindness, maxScore: maxKindness, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
