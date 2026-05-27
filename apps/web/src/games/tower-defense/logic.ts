import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export interface Tower { id: string; row: number; col: number; type: 'arrow' | 'magic' | 'bomb'; damage: number; range: number; cooldown: number; lastShot: number; }
export interface Enemy { id: string; x: number; y: number; hp: number; maxHp: number; speed: number; pathIndex: number; }
export interface TDState { gold: number; lives: number; wave: number; maxWaves: number; towers: Tower[]; enemies: Enemy[]; score: number; phase: 'build' | 'battle' | 'won' | 'lost'; }

export const TOWER_TYPES = [
  { type: 'arrow' as const, name: 'Arqueiro', emoji: '🏹', cost: 10, damage: 2, range: 3, cooldown: 60 },
  { type: 'magic' as const, name: 'Mago', emoji: '🧙', cost: 20, damage: 4, range: 2, cooldown: 90 },
  { type: 'bomb' as const, name: 'Bombardeiro', emoji: '💣', cost: 30, damage: 8, range: 2, cooldown: 120 },
];

export const PATH: Array<{ row: number; col: number }> = [
  { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
  { row: 3, col: 3 }, { row: 4, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 5 },
  { row: 3, col: 5 }, { row: 2, col: 5 }, { row: 2, col: 6 }, { row: 2, col: 7 },
];

export function getWavesForAge(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'adventurer': return 3; case 'master': return 5; default: return 3; }
}

export function getStartGold(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'adventurer': return 50; case 'master': return 40; default: return 50; }
}

export function createTDState(ageGroup: AgeGroup): TDState {
  return { gold: getStartGold(ageGroup), lives: 10, wave: 0, maxWaves: getWavesForAge(ageGroup), towers: [], enemies: [], score: 0, phase: 'build' };
}

export function isPathCell(row: number, col: number): boolean {
  return PATH.some((p) => p.row === row && p.col === col);
}

export function hasTower(towers: Tower[], row: number, col: number): boolean {
  return towers.some((t) => t.row === row && t.col === col);
}

export function placeTower(state: TDState, row: number, col: number, type: Tower['type']): TDState {
  if (isPathCell(row, col) || hasTower(state.towers, row, col)) return state;
  const towerInfo = TOWER_TYPES.find((t) => t.type === type);
  if (!towerInfo || state.gold < towerInfo.cost) return state;
  const tower: Tower = { id: `t${Date.now()}`, row, col, type, damage: towerInfo.damage, range: towerInfo.range, cooldown: towerInfo.cooldown, lastShot: 0 };
  return { ...state, gold: state.gold - towerInfo.cost, towers: [...state.towers, tower] };
}

export function spawnWave(wave: number): Enemy[] {
  const count = 3 + wave * 2;
  const enemies: Enemy[] = [];
  for (let i = 0; i < count; i++) {
    const hp = 5 + wave * 3;
    enemies.push({ id: `e${wave}-${i}`, x: -i * 40, y: 0, hp, maxHp: hp, speed: 0.5 + wave * 0.1, pathIndex: 0 });
  }
  return enemies;
}

export function updateEnemies(enemies: Enemy[]): { updated: Enemy[]; leaked: number } {
  let leaked = 0;
  const updated = enemies.map((e) => {
    const target = PATH[e.pathIndex];
    if (!target) { leaked++; return { ...e, hp: 0 }; }
    const targetX = target.col * 60 + 30;
    const targetY = target.row * 60 + 30;
    const dx = targetX - e.x; const dy = targetY - e.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < e.speed * 2) {
      return { ...e, x: targetX, y: targetY, pathIndex: e.pathIndex + 1 };
    }
    return { ...e, x: e.x + (dx / dist) * e.speed, y: e.y + (dy / dist) * e.speed };
  }).filter((e) => e.hp > 0);
  return { updated, leaked };
}

export function towerAttack(towers: Tower[], enemies: Enemy[], tick: number): { enemies: Enemy[]; gold: number } {
  let gold = 0;
  let updatedEnemies = [...enemies];
  for (const tower of towers) {
    if (tick - tower.lastShot < tower.cooldown) continue;
    const tx = tower.col * 60 + 30; const ty = tower.row * 60 + 30;
    for (const enemy of updatedEnemies) {
      if (enemy.hp <= 0) continue;
      const dist = Math.sqrt((tx - enemy.x) ** 2 + (ty - enemy.y) ** 2);
      if (dist <= tower.range * 60) {
        enemy.hp -= tower.damage;
        tower.lastShot = tick;
        if (enemy.hp <= 0) gold += 5;
        break;
      }
    }
  }
  return { enemies: updatedEnemies.filter((e) => e.hp > 0), gold };
}

export function calculateTDScore(wavesCleared: number, totalWaves: number, livesRemaining: number, timeSpent: number): GameResult {
  const waveRatio = totalWaves > 0 ? wavesCleared / totalWaves : 0;
  const lifeBonus = livesRemaining / 10;
  const accuracy = Math.min(1, (waveRatio * 0.7 + lifeBonus * 0.3));
  const stars = calculateStars(accuracy);
  return { score: wavesCleared * 50 + livesRemaining * 10, maxScore: totalWaves * 50 + 100, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
