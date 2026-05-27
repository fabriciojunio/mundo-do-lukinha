import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export interface DinoState {
  y: number;
  velocity: number;
  isJumping: boolean;
  isDucking: boolean;
}

export interface Obstacle {
  x: number;
  width: number;
  height: number;
  y: number;
  type: 'cactus-small' | 'cactus-tall' | 'bird';
}

export interface DinoGameState {
  dino: DinoState;
  obstacles: Obstacle[];
  score: number;
  speed: number;
  isGameOver: boolean;
  groundY: number;
}

const GRAVITY = 0.8;
const JUMP_FORCE = -14;
const GROUND_Y = 200;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 50;

export function getInitialSpeed(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'chick': return 3;
    case 'explorer': return 4;
    case 'adventurer': return 5;
    case 'master': return 6;
  }
}

export function getMaxSpeed(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'chick': return 6;
    case 'explorer': return 8;
    case 'adventurer': return 12;
    case 'master': return 15;
  }
}

export function createInitialState(ageGroup: AgeGroup): DinoGameState {
  return {
    dino: { y: GROUND_Y, velocity: 0, isJumping: false, isDucking: false },
    obstacles: [],
    score: 0,
    speed: getInitialSpeed(ageGroup),
    isGameOver: false,
    groundY: GROUND_Y,
  };
}

export function updateDino(dino: DinoState, jumpPressed: boolean, duckPressed: boolean): DinoState {
  let { y, velocity, isJumping } = dino;

  if (jumpPressed && !isJumping) {
    velocity = JUMP_FORCE;
    isJumping = true;
  }

  velocity += GRAVITY;
  y += velocity;

  if (y >= GROUND_Y) {
    y = GROUND_Y;
    velocity = 0;
    isJumping = false;
  }

  return { y, velocity, isJumping, isDucking: duckPressed && !isJumping };
}

export function shouldSpawnObstacle(lastObstacleX: number, canvasWidth: number, speed: number): boolean {
  const minGap = 200 + speed * 10;
  return lastObstacleX < canvasWidth - minGap;
}

export function spawnObstacle(canvasWidth: number, ageGroup: AgeGroup): Obstacle {
  const types: Array<Obstacle['type']> = ['cactus-small'];
  if (ageGroup !== 'chick') types.push('cactus-tall');
  if (ageGroup === 'adventurer' || ageGroup === 'master') types.push('bird');

  const type = types[Math.floor(Math.random() * types.length)] ?? 'cactus-small';

  switch (type) {
    case 'cactus-small':
      return { x: canvasWidth, width: 20, height: 35, y: GROUND_Y + DINO_HEIGHT - 35, type };
    case 'cactus-tall':
      return { x: canvasWidth, width: 25, height: 50, y: GROUND_Y + DINO_HEIGHT - 50, type };
    case 'bird':
      return { x: canvasWidth, width: 30, height: 20, y: GROUND_Y - 30, type };
  }
}

export function checkCollision(dino: DinoState, obstacle: Obstacle): boolean {
  const dinoLeft = 60;
  const dinoRight = dinoLeft + DINO_WIDTH - 10;
  const dinoTop = dino.y;
  const dinoBottom = dino.isDucking ? dino.y + DINO_HEIGHT - 15 : dino.y + DINO_HEIGHT;

  const obsLeft = obstacle.x;
  const obsRight = obstacle.x + obstacle.width;
  const obsTop = obstacle.y;
  const obsBottom = obstacle.y + obstacle.height;

  return dinoRight > obsLeft && dinoLeft < obsRight && dinoBottom > obsTop && dinoTop < obsBottom;
}

export function updateGameState(
  state: DinoGameState,
  jumpPressed: boolean,
  duckPressed: boolean,
  canvasWidth: number,
  ageGroup: AgeGroup,
): DinoGameState {
  if (state.isGameOver) return state;

  const dino = updateDino(state.dino, jumpPressed, duckPressed);
  let obstacles = state.obstacles
    .map((o) => ({ ...o, x: o.x - state.speed }))
    .filter((o) => o.x > -50);

  const lastObs = obstacles[obstacles.length - 1];
  const lastX = lastObs ? lastObs.x : -999;
  if (shouldSpawnObstacle(lastX, canvasWidth, state.speed)) {
    obstacles = [...obstacles, spawnObstacle(canvasWidth, ageGroup)];
  }

  for (const obs of obstacles) {
    if (checkCollision(dino, obs)) {
      return { ...state, dino, obstacles, isGameOver: true };
    }
  }

  const maxSpeed = getMaxSpeed(ageGroup);
  const newSpeed = Math.min(state.speed + 0.002, maxSpeed);
  const newScore = state.score + 1;

  return { dino, obstacles, score: newScore, speed: newSpeed, isGameOver: false, groundY: GROUND_Y };
}

export function calculateDinoScore(score: number): GameResult {
  const accuracy = Math.min(score / 500, 1);
  const stars = calculateStars(accuracy);

  const achievements: string[] = [];
  if (score >= 100) achievements.push('dino-100');

  return {
    score,
    maxScore: Math.max(score, 500),
    timeSpent: Math.floor(score / 5),
    accuracy,
    xpEarned: calculateXP(stars),
    coinsEarned: calculateCoins(stars),
    achievements,
    stars,
  };
}
