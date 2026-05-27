import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface PetVirtual {
  name: string; emoji: string; happiness: number; health: number; energy: number; hygiene: number;
}

export function createVirtualPet(emoji: string): PetVirtual {
  return { name: 'Buddy', emoji, happiness: 60, health: 60, energy: 60, hygiene: 60 };
}

export interface CareChallenge {
  id: string; situation: string; emoji: string;
  options: Array<{ text: string; effects: { happiness: number; health: number; energy: number; hygiene: number }; wisdom: number; feedback: string }>;
  difficulty: number;
}

const CHALLENGES: CareChallenge[] = [
  { id: 'c1', emoji: '🍽️', difficulty: 1, situation: 'Seu bichinho está com fome! O que dar pra ele comer?',
    options: [
      { text: '🥗 Comida saudável e balanceada', effects: { happiness: 10, health: 20, energy: 15, hygiene: 0 }, wisdom: 100, feedback: 'Perfeito! Comida saudável dá energia e mantém a saúde!' },
      { text: '🍬 Só doces e guloseimas', effects: { happiness: 15, health: -10, energy: 5, hygiene: -5 }, wisdom: 20, feedback: 'Doces são gostosos mas fazem mal! O bichinho precisa de nutrientes.' },
      { text: '🍕 Fast food', effects: { happiness: 10, health: -5, energy: 10, hygiene: -5 }, wisdom: 40, feedback: 'De vez em quando tudo bem, mas não todo dia! Saúde primeiro!' },
    ],
  },
  { id: 'c2', emoji: '😴', difficulty: 1, situation: 'Seu bichinho está cansado. O que fazer?',
    options: [
      { text: '🛏️ Deixar descansar em uma cama quentinha', effects: { happiness: 10, health: 10, energy: 30, hygiene: 0 }, wisdom: 100, feedback: 'Descanso é essencial! Dormir bem faz crescer forte e saudável!' },
      { text: '🏃 Forçar a brincar mais', effects: { happiness: -10, health: -5, energy: -15, hygiene: 0 }, wisdom: 10, feedback: 'Quando está cansado, precisa descansar! Forçar faz mal.' },
      { text: '📺 Assistir TV até dormir', effects: { happiness: 5, health: 0, energy: 10, hygiene: 0 }, wisdom: 40, feedback: 'Telas antes de dormir atrapalham o sono! Melhor descansar de verdade.' },
    ],
  },
  { id: 'c3', emoji: '🏃', difficulty: 1, situation: 'Seu bichinho precisa de exercício! Qual atividade escolher?',
    options: [
      { text: '⚽ Brincar no parque por 30 minutos', effects: { happiness: 20, health: 15, energy: -10, hygiene: -5 }, wisdom: 100, feedback: 'Exercício ao ar livre é perfeito! Corpo e mente ficam mais saudáveis!' },
      { text: '🛋️ Ficar no sofá o dia todo', effects: { happiness: -5, health: -10, energy: 5, hygiene: 0 }, wisdom: 10, feedback: 'Ficar parado demais faz mal! O corpo precisa se mover!' },
      { text: '🏋️ Exercício intenso por 3 horas', effects: { happiness: 5, health: 5, energy: -25, hygiene: -10 }, wisdom: 40, feedback: 'Exercício é bom, mas demais pode machucar! Equilíbrio é a chave.' },
    ],
  },
  { id: 'c4', emoji: '🚿', difficulty: 1, situation: 'Seu bichinho está sujinho. Hora do banho?',
    options: [
      { text: '🛁 Dar um banho quentinho com carinho', effects: { happiness: 10, health: 10, energy: -5, hygiene: 30 }, wisdom: 100, feedback: 'Higiene é saúde! Banho com carinho deixa feliz e limpinho!' },
      { text: '💦 Jogar água fria nele', effects: { happiness: -15, health: 0, energy: -5, hygiene: 15 }, wisdom: 20, feedback: 'Funciona, mas água fria assusta! Cuidado e carinho fazem diferença.' },
      { text: '🤷 Não dar banho, tá bom assim', effects: { happiness: 0, health: -10, energy: 0, hygiene: -10 }, wisdom: 10, feedback: 'Sem higiene pode causar doenças! Banho regular é importante.' },
    ],
  },
  { id: 'c5', emoji: '🤒', difficulty: 2, situation: 'Seu bichinho está espirrando e parece doentinho. O que fazer?',
    options: [
      { text: '🏥 Levar ao veterinário', effects: { happiness: 5, health: 25, energy: -5, hygiene: 0 }, wisdom: 100, feedback: 'Perfeito! Quando está doente, o médico/veterinário é o melhor caminho!' },
      { text: '💊 Dar remédio por conta própria', effects: { happiness: -5, health: 5, energy: 0, hygiene: 0 }, wisdom: 30, feedback: 'Nunca tome ou dê remédio sem orientação médica! Pode ser perigoso.' },
      { text: '⏰ Esperar passar sozinho', effects: { happiness: -5, health: -10, energy: -10, hygiene: 0 }, wisdom: 20, feedback: 'Doenças podem piorar! Melhor procurar ajuda logo.' },
    ],
  },
  { id: 'c6', emoji: '😢', difficulty: 2, situation: 'Seu bichinho está triste e não quer brincar. O que fazer?',
    options: [
      { text: '🤗 Fazer carinho e ficar perto dele', effects: { happiness: 25, health: 5, energy: 0, hygiene: 0 }, wisdom: 100, feedback: 'Carinho e presença são os melhores remédios para tristeza! Empatia é tudo.' },
      { text: '😡 Ficar bravo porque ele não quer brincar', effects: { happiness: -15, health: -5, energy: 0, hygiene: 0 }, wisdom: 10, feedback: 'Ficar bravo piora a situação! Quando alguém está triste, precisa de paciência.' },
      { text: '🧸 Dar um brinquedo novo', effects: { happiness: 15, health: 0, energy: 0, hygiene: 0 }, wisdom: 60, feedback: 'Presentes ajudam, mas o que mais importa é estar presente e dar atenção!' },
    ],
  },
];

export function getChallengesForAge(ageGroup: AgeGroup): CareChallenge[] {
  switch (ageGroup) { case 'chick': case 'explorer': return CHALLENGES.filter((c) => c.difficulty === 1); case 'adventurer': case 'master': return CHALLENGES; default: return CHALLENGES.filter((c) => c.difficulty === 1); }
}

export function selectChallenges(ageGroup: AgeGroup): CareChallenge[] {
  const pool = getChallengesForAge(ageGroup);
  return shuffleArray(pool).slice(0, ageGroup === 'chick' ? 3 : ageGroup === 'explorer' ? 4 : 6);
}

export function evaluateCareChoice(challenge: CareChallenge, idx: number): { wisdom: number; feedback: string; effects: CareChallenge['options'][0]['effects'] } {
  const opt = challenge.options[idx];
  return opt ? { wisdom: opt.wisdom, feedback: opt.feedback, effects: opt.effects } : { wisdom: 0, feedback: '', effects: { happiness: 0, health: 0, energy: 0, hygiene: 0 } };
}

export function applyEffects(pet: PetVirtual, effects: { happiness: number; health: number; energy: number; hygiene: number }): PetVirtual {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return { ...pet, happiness: clamp(pet.happiness + effects.happiness), health: clamp(pet.health + effects.health), energy: clamp(pet.energy + effects.energy), hygiene: clamp(pet.hygiene + effects.hygiene) };
}

export function calculateCareScore(totalWisdom: number, maxWisdom: number, timeSpent: number): GameResult {
  const accuracy = maxWisdom > 0 ? totalWisdom / maxWisdom : 0; const stars = calculateStars(accuracy);
  return { score: totalWisdom, maxScore: maxWisdom, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
