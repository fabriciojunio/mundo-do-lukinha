import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export type Lane = 0 | 1 | 2;
export interface RaceObstacle { lane: Lane; y: number; type: 'rock' | 'oil' | 'cone'; }
export interface RaceCoin { lane: Lane; y: number; collected: boolean; }
export interface RaceState { playerLane: Lane; distance: number; coins: number; speed: number; obstacles: RaceObstacle[]; racCoins: RaceCoin[]; crashed: boolean; }

export function getInitialSpeed(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'chick': return 2; case 'explorer': return 3; case 'adventurer': return 4; case 'master': return 5; }
}

export function createRaceState(ageGroup: AgeGroup): RaceState {
  return { playerLane: 1, distance: 0, coins: 0, speed: getInitialSpeed(ageGroup), obstacles: [], racCoins: [], crashed: false };
}

export function moveLane(current: Lane, direction: 'left' | 'right'): Lane {
  if (direction === 'left' && current > 0) return (current - 1) as Lane;
  if (direction === 'right' && current < 2) return (current + 1) as Lane;
  return current;
}

export function updateRace(state: RaceState, ageGroup: AgeGroup): RaceState {
  if (state.crashed) return state;
  const newDistance = state.distance + state.speed;
  const newSpeed = Math.min(state.speed + 0.003, getInitialSpeed(ageGroup) * 2.5);

  let obstacles = state.obstacles.map((o) => ({ ...o, y: o.y + state.speed })).filter((o) => o.y < 350);
  if (Math.random() < 0.02 + state.speed * 0.002) {
    const lane = Math.floor(Math.random() * 3) as Lane;
    const types: RaceObstacle['type'][] = ['rock', 'oil', 'cone'];
    obstacles = [...obstacles, { lane, y: -30, type: types[Math.floor(Math.random() * types.length)]! }];
  }

  let racCoins = state.racCoins.map((c) => ({ ...c, y: c.y + state.speed })).filter((c) => c.y < 350);
  if (Math.random() < 0.03) {
    racCoins = [...racCoins, { lane: Math.floor(Math.random() * 3) as Lane, y: -30, collected: false }];
  }

  let crashed = false;
  for (const obs of obstacles) {
    if (obs.lane === state.playerLane && obs.y > 260 && obs.y < 310) { crashed = true; break; }
  }

  let newCoins = state.coins;
  racCoins = racCoins.map((c) => {
    if (!c.collected && c.lane === state.playerLane && c.y > 260 && c.y < 310) { newCoins++; return { ...c, collected: true }; }
    return c;
  });

  return { ...state, distance: newDistance, speed: newSpeed, obstacles, racCoins, coins: newCoins, crashed };
}

export function calculateRaceScore(distance: number, coins: number): GameResult {
  const distScore = Math.floor(distance / 100);
  const total = distScore + coins * 5;
  const accuracy = Math.min(total / 200, 1);
  const stars = calculateStars(accuracy);
  return { score: total, maxScore: Math.max(200, total), timeSpent: Math.floor(distance / 50), accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
