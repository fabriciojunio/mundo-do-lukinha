import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface Shape {
  id: string; name: string; sides: number; emoji: string; svgPath: string;
  area?: string; perimeter?: string; difficulty: number;
}

const SHAPES: Shape[] = [
  { id: 'circle', name: 'Círculo', sides: 0, emoji: '🔵', svgPath: 'M50,10 A40,40 0 1,1 49.99,10', area: 'π × r²', perimeter: '2 × π × r', difficulty: 1 },
  { id: 'triangle', name: 'Triângulo', sides: 3, emoji: '🔺', svgPath: 'M50,10 L90,90 L10,90 Z', area: '(b × h) / 2', perimeter: 'a + b + c', difficulty: 1 },
  { id: 'square', name: 'Quadrado', sides: 4, emoji: '🟦', svgPath: 'M15,15 L85,15 L85,85 L15,85 Z', area: 'l × l', perimeter: '4 × l', difficulty: 1 },
  { id: 'rectangle', name: 'Retângulo', sides: 4, emoji: '🟩', svgPath: 'M10,25 L90,25 L90,75 L10,75 Z', area: 'b × h', perimeter: '2(b + h)', difficulty: 1 },
  { id: 'pentagon', name: 'Pentágono', sides: 5, emoji: '⬠', svgPath: 'M50,10 L90,40 L75,85 L25,85 L10,40 Z', difficulty: 2 },
  { id: 'hexagon', name: 'Hexágono', sides: 6, emoji: '⬡', svgPath: 'M50,10 L87,30 L87,70 L50,90 L13,70 L13,30 Z', difficulty: 2 },
  { id: 'rhombus', name: 'Losango', sides: 4, emoji: '🔷', svgPath: 'M50,10 L90,50 L50,90 L10,50 Z', area: '(D × d) / 2', difficulty: 2 },
  { id: 'trapezoid', name: 'Trapézio', sides: 4, emoji: '⏢', svgPath: 'M30,20 L70,20 L90,80 L10,80 Z', area: '(B + b) × h / 2', difficulty: 3 },
  { id: 'octagon', name: 'Octógono', sides: 8, emoji: '🛑', svgPath: 'M35,10 L65,10 L90,35 L90,65 L65,90 L35,90 L10,65 L10,35 Z', difficulty: 3 },
];

export function getShapesForAge(ageGroup: AgeGroup): Shape[] {
  switch (ageGroup) {
    case 'explorer': return SHAPES.filter((s) => s.difficulty === 1);
    case 'adventurer': return SHAPES.filter((s) => s.difficulty <= 2);
    case 'master': return SHAPES;
    default: return SHAPES.filter((s) => s.difficulty === 1);
  }
}

export function getQuizCount(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'explorer': return 8; case 'adventurer': return 10; case 'master': return 12; default: return 8; }
}

export interface GeoQuiz {
  id: string; question: string; options: string[]; correctIndex: number; explanation: string; shape: Shape;
}

export function generateGeoQuiz(shapes: Shape[]): GeoQuiz {
  const shape = shapes[Math.floor(Math.random() * shapes.length)] as Shape;
  const qTypes = [
    { q: `Qual é esta forma? ${shape.emoji}`, correct: shape.name, pool: shapes.map((s) => s.name) },
    { q: `Quantos lados tem o ${shape.name}?`, correct: shape.sides === 0 ? 'Nenhum (é curvo)' : `${shape.sides} lados`, pool: ['Nenhum (é curvo)', '3 lados', '4 lados', '5 lados', '6 lados', '8 lados'] },
  ];
  if (shape.area) {
    qTypes.push({ q: `Como calculamos a área do ${shape.name}?`, correct: `Área = ${shape.area}`, pool: shapes.filter((s) => s.area).map((s) => `Área = ${s.area}`) });
  }
  const qData = qTypes[Math.floor(Math.random() * qTypes.length)]!;
  const wrongPool = qData.pool.filter((o) => o !== qData.correct);
  const options = shuffleArray([qData.correct, ...shuffleArray(wrongPool).slice(0, 3)]);
  const correctIndex = options.indexOf(qData.correct);
  const explanation = shape.sides === 0 ? `O ${shape.name} não tem lados retos!` : `O ${shape.name} tem ${shape.sides} lados${shape.area ? ` e área = ${shape.area}` : ''}.`;
  return { id: Math.random().toString(36).substring(2, 9), question: qData.q, options, correctIndex: Math.max(0, correctIndex), explanation, shape };
}

export function generateGeoQuizSet(ageGroup: AgeGroup): GeoQuiz[] {
  const shapes = getShapesForAge(ageGroup);
  return Array.from({ length: getQuizCount(ageGroup) }, () => generateGeoQuiz(shapes));
}

export function checkGeoAnswer(quiz: GeoQuiz, idx: number): boolean { return idx === quiz.correctIndex; }

export function calculateGeoScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0; const stars = calculateStars(accuracy);
  return { score: correct * 12, maxScore: total * 12, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
