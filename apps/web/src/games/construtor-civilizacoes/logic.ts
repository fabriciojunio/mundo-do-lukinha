import type { GameConfig } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export const construtorCivilizacoesConfig: GameConfig = {
  id: 'construtor-civilizacoes', name: 'Construtor de Civilizações', description: 'Construa uma civilização antiga! Gerencie recursos, construa prédios e faça seu povo prosperar!',
  category: 'history', ageGroups: ['adventurer', 'master'], icon: '🏛️', color: '#B45309',
  difficulty: { min: 1, max: 10 }, estimatedMinutes: 5, skills: ['estratégia', 'história', 'gestão de recursos', 'planejamento'], version: '1.0.0',
};

export interface Building { id: string; name: string; emoji: string; cost: { food: number; wood: number; stone: number }; produces: Partial<Resources>; populationCost: number; description: string; }
export interface Resources { food: number; wood: number; stone: number; gold: number; population: number; happiness: number; }
export interface CivState { resources: Resources; buildings: string[]; turn: number; maxTurns: number; era: string; }

export const BUILDINGS: Building[] = [
  { id: 'farm', name: 'Fazenda', emoji: '🌾', cost: { food: 0, wood: 10, stone: 0 }, produces: { food: 8 }, populationCost: 2, description: 'Produz comida para o povo' },
  { id: 'lumber', name: 'Serraria', emoji: '🪵', cost: { food: 5, wood: 0, stone: 5 }, produces: { wood: 6 }, populationCost: 2, description: 'Produz madeira para construção' },
  { id: 'quarry', name: 'Pedreira', emoji: '⛏️', cost: { food: 5, wood: 5, stone: 0 }, produces: { stone: 5 }, populationCost: 3, description: 'Extrai pedra das montanhas' },
  { id: 'house', name: 'Casa', emoji: '🏠', cost: { food: 0, wood: 15, stone: 5 }, produces: { population: 4 }, populationCost: 0, description: 'Aumenta a população' },
  { id: 'market', name: 'Mercado', emoji: '🏪', cost: { food: 10, wood: 10, stone: 10 }, produces: { gold: 5 }, populationCost: 2, description: 'Gera ouro através do comércio' },
  { id: 'temple', name: 'Templo', emoji: '🏛️', cost: { food: 10, wood: 15, stone: 20 }, produces: { happiness: 10 }, populationCost: 1, description: 'Aumenta a felicidade do povo' },
  { id: 'school', name: 'Escola', emoji: '🏫', cost: { food: 5, wood: 10, stone: 10 }, produces: { happiness: 5, gold: 2 }, populationCost: 2, description: 'Educa o povo e gera riqueza' },
  { id: 'wall', name: 'Muralha', emoji: '🧱', cost: { food: 0, wood: 5, stone: 25 }, produces: { happiness: 3 }, populationCost: 0, description: 'Protege a cidade' },
];

export function getTurnsForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'adventurer': return 8; case 'master': return 12; default: return 8; }
}

export function createCivState(ageGroup: AgeGroup): CivState {
  return {
    resources: { food: 30, wood: 20, stone: 10, gold: 0, population: 10, happiness: 50 },
    buildings: [], turn: 0, maxTurns: getTurnsForAge(ageGroup), era: 'Idade Antiga',
  };
}

export function canBuild(state: CivState, building: Building): boolean {
  const r = state.resources;
  return r.food >= building.cost.food && r.wood >= building.cost.wood && r.stone >= building.cost.stone && r.population >= building.populationCost;
}

export function buildStructure(state: CivState, buildingId: string): CivState {
  const building = BUILDINGS.find((b) => b.id === buildingId);
  if (!building || !canBuild(state, building)) return state;
  const r = { ...state.resources };
  r.food -= building.cost.food; r.wood -= building.cost.wood; r.stone -= building.cost.stone;
  r.population -= building.populationCost;
  return { ...state, resources: r, buildings: [...state.buildings, buildingId] };
}

export function endTurn(state: CivState): CivState {
  const r = { ...state.resources };
  // Production from all buildings
  for (const bId of state.buildings) {
    const building = BUILDINGS.find((b) => b.id === bId);
    if (building?.produces) {
      if (building.produces.food) r.food += building.produces.food;
      if (building.produces.wood) r.wood += building.produces.wood;
      if (building.produces.stone) r.stone += building.produces.stone;
      if (building.produces.gold) r.gold += building.produces.gold;
      if (building.produces.population) r.population += building.produces.population;
      if (building.produces.happiness) r.happiness = Math.min(100, r.happiness + building.produces.happiness);
    }
  }
  // Population eats
  const foodNeeded = Math.floor(r.population * 0.5);
  r.food -= foodNeeded;
  if (r.food < 0) { r.happiness = Math.max(0, r.happiness - 15); r.food = 0; }

  const newTurn = state.turn + 1;
  const era = newTurn >= 8 ? 'Era Imperial' : newTurn >= 4 ? 'Era Clássica' : 'Idade Antiga';
  return { ...state, resources: r, turn: newTurn, era };
}

export function calculateCivScore(state: CivState): GameResult {
  const buildingScore = state.buildings.length * 10;
  const goldScore = state.resources.gold;
  const happyBonus = Math.floor(state.resources.happiness / 10);
  const popBonus = Math.floor(state.resources.population / 2);
  const totalScore = buildingScore + goldScore + happyBonus + popBonus;
  const maxScore = state.maxTurns * 20;
  const accuracy = Math.min(1, totalScore / maxScore);
  const stars = calculateStars(accuracy);
  return { score: totalScore, maxScore, timeSpent: state.turn * 10, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
