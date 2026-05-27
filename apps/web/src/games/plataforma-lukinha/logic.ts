import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars as calcStars, calculateXP, calculateCoins } from '@/types/game';

export interface Platform { x: number; y: number; width: number; type: 'normal' | 'moving' | 'breakable'; }
export interface Star { x: number; y: number; collected: boolean; }
export interface PlayerState { x: number; y: number; vx: number; vy: number; onGround: boolean; facingRight: boolean; }

export interface PlatformLevel {
  id: string; name: string; platforms: Platform[]; stars: Star[]; startX: number; startY: number;
  goalX: number; goalY: number; difficulty: number;
}

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const GROUND_Y = 280;

export function getSpeedForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'chick': return 3; case 'explorer': return 4; case 'adventurer': return 5; case 'master': return 6; }
}

export function createPlayer(x: number, y: number): PlayerState {
  return { x, y, vx: 0, vy: 0, onGround: false, facingRight: true };
}

export function updatePlayer(player: PlayerState, input: { left: boolean; right: boolean; jump: boolean }, platforms: Platform[], speed: number): PlayerState {
  let { x, y, vx, vy, onGround, facingRight } = player;

  vx = 0;
  if (input.left) { vx = -speed; facingRight = false; }
  if (input.right) { vx = speed; facingRight = true; }
  if (input.jump && onGround) { vy = JUMP_FORCE; onGround = false; }

  vy += GRAVITY;
  x += vx;
  y += vy;

  onGround = false;
  if (y >= GROUND_Y) { y = GROUND_Y; vy = 0; onGround = true; }

  for (const plat of platforms) {
    if (vy > 0 && x + 15 > plat.x && x - 15 < plat.x + plat.width && y + 20 >= plat.y && y + 20 - vy <= plat.y + 5) {
      y = plat.y - 20;
      vy = 0;
      onGround = true;
    }
  }

  x = Math.max(10, Math.min(630, x));
  return { x, y, vx, vy, onGround, facingRight };
}

export function checkStarCollection(player: PlayerState, stars: Star[]): Star[] {
  return stars.map((star) => {
    if (star.collected) return star;
    const dx = Math.abs(player.x - star.x);
    const dy = Math.abs(player.y - star.y);
    if (dx < 20 && dy < 20) return { ...star, collected: true };
    return star;
  });
}

export function checkGoal(player: PlayerState, goalX: number, goalY: number): boolean {
  return Math.abs(player.x - goalX) < 25 && Math.abs(player.y - goalY) < 25;
}

const LEVELS: PlatformLevel[] = [
  { id: 'p1', name: 'Primeiro Pulo', difficulty: 1, startX: 50, startY: GROUND_Y, goalX: 580, goalY: GROUND_Y,
    platforms: [{ x: 150, y: 230, width: 80, type: 'normal' }, { x: 300, y: 190, width: 80, type: 'normal' }, { x: 450, y: 230, width: 80, type: 'normal' }],
    stars: [{ x: 190, y: 210, collected: false }, { x: 340, y: 170, collected: false }, { x: 490, y: 210, collected: false }],
  },
  { id: 'p2', name: 'Escadinha', difficulty: 1, startX: 50, startY: GROUND_Y, goalX: 580, goalY: 130,
    platforms: [{ x: 100, y: 240, width: 70, type: 'normal' }, { x: 220, y: 200, width: 70, type: 'normal' }, { x: 340, y: 160, width: 70, type: 'normal' }, { x: 480, y: 130, width: 120, type: 'normal' }],
    stars: [{ x: 135, y: 220, collected: false }, { x: 255, y: 180, collected: false }, { x: 375, y: 140, collected: false }],
  },
  { id: 'p3', name: 'Gaps', difficulty: 2, startX: 50, startY: GROUND_Y, goalX: 580, goalY: GROUND_Y,
    platforms: [{ x: 120, y: 220, width: 60, type: 'normal' }, { x: 260, y: 180, width: 50, type: 'normal' }, { x: 380, y: 220, width: 60, type: 'normal' }, { x: 500, y: 250, width: 60, type: 'normal' }],
    stars: [{ x: 150, y: 200, collected: false }, { x: 285, y: 160, collected: false }, { x: 410, y: 200, collected: false }, { x: 530, y: 230, collected: false }],
  },
  { id: 'p4', name: 'Sky High', difficulty: 3, startX: 50, startY: GROUND_Y, goalX: 320, goalY: 60,
    platforms: [
      { x: 80, y: 240, width: 60, type: 'normal' }, { x: 200, y: 200, width: 50, type: 'normal' },
      { x: 130, y: 150, width: 60, type: 'normal' }, { x: 280, y: 120, width: 50, type: 'normal' },
      { x: 380, y: 160, width: 60, type: 'normal' }, { x: 260, y: 60, width: 120, type: 'normal' },
    ],
    stars: [{ x: 110, y: 220, collected: false }, { x: 225, y: 180, collected: false }, { x: 160, y: 130, collected: false }, { x: 305, y: 100, collected: false }, { x: 320, y: 40, collected: false }],
  },
];

export function getLevelsForAge(ageGroup: AgeGroup): PlatformLevel[] {
  switch (ageGroup) { case 'chick': case 'explorer': return LEVELS.filter((l) => l.difficulty <= 1); case 'adventurer': return LEVELS.filter((l) => l.difficulty <= 2); case 'master': return LEVELS; default: return LEVELS.slice(0, 2); }
}

export function calculatePlatformScore(starsCollected: number, totalStars: number, levelsCompleted: number, totalLevels: number, timeSpent: number): GameResult {
  const starRatio = totalStars > 0 ? starsCollected / totalStars : 0;
  const levelRatio = totalLevels > 0 ? levelsCompleted / totalLevels : 0;
  const accuracy = (starRatio + levelRatio) / 2;
  const stars = calcStars(accuracy);
  return { score: starsCollected * 10 + levelsCompleted * 25, maxScore: totalStars * 10 + totalLevels * 25, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
