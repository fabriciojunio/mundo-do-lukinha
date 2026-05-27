import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Command = 'forward' | 'turn-left' | 'turn-right' | 'repeat-2' | 'repeat-3';
export type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'coin';

export interface Position { row: number; col: number; }
export interface RobotState { pos: Position; direction: Direction; coins: number; }

export interface CodeLevel {
  id: string;
  name: string;
  grid: CellType[][];
  start: Position;
  startDir: Direction;
  goal: Position;
  maxCommands: number;
  availableCommands: Command[];
  difficulty: number;
}

export const COMMAND_LABELS: Record<Command, string> = {
  'forward': '⬆️ Avançar',
  'turn-left': '⬅️ Virar Esquerda',
  'turn-right': '➡️ Virar Direita',
  'repeat-2': '🔁 Repetir 2x',
  'repeat-3': '🔁 Repetir 3x',
};

export const COMMAND_EMOJIS: Record<Command, string> = {
  'forward': '⬆️',
  'turn-left': '⬅️',
  'turn-right': '➡️',
  'repeat-2': '🔁²',
  'repeat-3': '🔁³',
};

const E: CellType = 'empty';
const W: CellType = 'wall';
const S: CellType = 'start';
const G: CellType = 'goal';

const LEVELS: CodeLevel[] = [
  {
    id: 'l1', name: 'Primeiro Passo', difficulty: 1,
    grid: [[S, E, E, G]], start: { row: 0, col: 0 }, startDir: 'right', goal: { row: 0, col: 3 },
    maxCommands: 5, availableCommands: ['forward'],
  },
  {
    id: 'l2', name: 'Virando', difficulty: 1,
    grid: [[E, S], [E, E], [G, E]], start: { row: 0, col: 1 }, startDir: 'down', goal: { row: 2, col: 0 },
    maxCommands: 5, availableCommands: ['forward', 'turn-right'],
  },
  {
    id: 'l3', name: 'Zigue-Zague', difficulty: 2,
    grid: [[S, W, E], [E, E, E], [E, W, G]], start: { row: 0, col: 0 }, startDir: 'down', goal: { row: 2, col: 2 },
    maxCommands: 8, availableCommands: ['forward', 'turn-left', 'turn-right'],
  },
  {
    id: 'l4', name: 'Repetição', difficulty: 2,
    grid: [[S, E, E, E, E, G]], start: { row: 0, col: 0 }, startDir: 'right', goal: { row: 0, col: 5 },
    maxCommands: 3, availableCommands: ['forward', 'repeat-2', 'repeat-3'],
  },
  {
    id: 'l5', name: 'Labirinto Simples', difficulty: 3,
    grid: [
      [S, E, W, E],
      [W, E, W, E],
      [E, E, E, E],
      [E, W, W, G],
    ],
    start: { row: 0, col: 0 }, startDir: 'right', goal: { row: 3, col: 3 },
    maxCommands: 12, availableCommands: ['forward', 'turn-left', 'turn-right'],
  },
  {
    id: 'l6', name: 'Desafio Loop', difficulty: 3,
    grid: [
      [S, E, E, E, E],
      [W, W, W, W, E],
      [G, E, E, E, E],
    ],
    start: { row: 0, col: 0 }, startDir: 'right', goal: { row: 2, col: 0 },
    maxCommands: 8, availableCommands: ['forward', 'turn-left', 'turn-right', 'repeat-2', 'repeat-3'],
  },
];

export function getLevelsForAge(ageGroup: AgeGroup): CodeLevel[] {
  switch (ageGroup) {
    case 'chick': return LEVELS.filter((l) => l.difficulty === 1);
    case 'explorer': return LEVELS.filter((l) => l.difficulty <= 2);
    case 'adventurer': return LEVELS.filter((l) => l.difficulty <= 3);
    case 'master': return LEVELS;
    default: return LEVELS.filter((l) => l.difficulty === 1);
  }
}

export function turnLeft(dir: Direction): Direction {
  const map: Record<Direction, Direction> = { up: 'left', left: 'down', down: 'right', right: 'up' };
  return map[dir];
}

export function turnRight(dir: Direction): Direction {
  const map: Record<Direction, Direction> = { up: 'right', right: 'down', down: 'left', left: 'up' };
  return map[dir];
}

export function moveForward(pos: Position, dir: Direction): Position {
  const delta: Record<Direction, Position> = { up: { row: -1, col: 0 }, down: { row: 1, col: 0 }, left: { row: 0, col: -1 }, right: { row: 0, col: 1 } };
  const d = delta[dir];
  return { row: pos.row + d.row, col: pos.col + d.col };
}

export function isValidPosition(pos: Position, grid: CellType[][]): boolean {
  const row = grid[pos.row];
  if (!row) return false;
  const cell = row[pos.col];
  return cell !== undefined && cell !== 'wall';
}

export function expandCommands(commands: Command[]): Command[] {
  const expanded: Command[] = [];
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i]!;
    if (cmd === 'repeat-2' || cmd === 'repeat-3') {
      const repeatCount = cmd === 'repeat-2' ? 2 : 3;
      // Repeat the previous command
      const prev = expanded[expanded.length - 1];
      if (prev && prev !== 'repeat-2' && prev !== 'repeat-3') {
        for (let r = 0; r < repeatCount - 1; r++) {
          expanded.push(prev);
        }
      }
    } else {
      expanded.push(cmd);
    }
  }
  return expanded;
}

export interface ExecutionStep {
  pos: Position;
  direction: Direction;
  command: Command;
  success: boolean;
}

export function executeCommands(commands: Command[], level: CodeLevel): { steps: ExecutionStep[]; reachedGoal: boolean } {
  const expanded = expandCommands(commands);
  const steps: ExecutionStep[] = [];
  let state: RobotState = { pos: { ...level.start }, direction: level.startDir, coins: 0 };

  for (const cmd of expanded) {
    let newPos = state.pos;
    let newDir = state.direction;
    let success = true;

    switch (cmd) {
      case 'forward': {
        const nextPos = moveForward(state.pos, state.direction);
        if (isValidPosition(nextPos, level.grid)) {
          newPos = nextPos;
        } else {
          success = false;
        }
        break;
      }
      case 'turn-left':
        newDir = turnLeft(state.direction);
        break;
      case 'turn-right':
        newDir = turnRight(state.direction);
        break;
      default:
        break;
    }

    state = { pos: newPos, direction: newDir, coins: state.coins };
    steps.push({ pos: { ...newPos }, direction: newDir, command: cmd, success });

    if (newPos.row === level.goal.row && newPos.col === level.goal.col) {
      return { steps, reachedGoal: true };
    }
  }

  return { steps, reachedGoal: false };
}

export function calculateCodeScore(levelsCompleted: number, totalLevels: number, totalCommands: number, timeSpent: number): GameResult {
  const accuracy = totalLevels > 0 ? levelsCompleted / totalLevels : 0;
  const stars = calculateStars(accuracy);
  const score = levelsCompleted * 25;
  const maxScore = totalLevels * 25;
  return { score, maxScore, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
