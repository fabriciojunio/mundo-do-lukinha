import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface Product { name: string; emoji: string; price: number; }
export interface ShopChallenge { id: string; product: Product; payment: number; correctChange: number; options: number[]; correctIndex: number; difficulty: number; }

const PRODUCTS: Product[] = [
  { name: 'Pirulito', emoji: '🍭', price: 1 }, { name: 'Suco', emoji: '🧃', price: 3 },
  { name: 'Bolo', emoji: '🍰', price: 5 }, { name: 'Sorvete', emoji: '🍦', price: 4 },
  { name: 'Biscoito', emoji: '🍪', price: 2 }, { name: 'Sanduíche', emoji: '🥪', price: 7 },
  { name: 'Pizza', emoji: '🍕', price: 12 }, { name: 'Brinquedo', emoji: '🧸', price: 15 },
  { name: 'Livro', emoji: '📖', price: 20 }, { name: 'Mochila', emoji: '🎒', price: 35 },
];

export function getProductsForAge(ageGroup: AgeGroup): Product[] {
  switch (ageGroup) { case 'explorer': return PRODUCTS.filter((p) => p.price <= 5); case 'adventurer': return PRODUCTS.filter((p) => p.price <= 15); case 'master': return PRODUCTS; default: return PRODUCTS.slice(0, 3); }
}

export function generateShopChallenge(products: Product[], difficulty: number): ShopChallenge {
  const product = products[Math.floor(Math.random() * products.length)] as Product;
  const paymentOptions = difficulty <= 1 ? [5, 10] : difficulty <= 2 ? [10, 20, 50] : [20, 50, 100];
  const validPayments = paymentOptions.filter((p) => p >= product.price);
  const payment = validPayments[Math.floor(Math.random() * validPayments.length)] ?? product.price * 2;
  const correctChange = payment - product.price;
  const wrongChanges = new Set<number>();
  while (wrongChanges.size < 3) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const wrong = Math.random() > 0.5 ? correctChange + offset : Math.max(0, correctChange - offset);
    if (wrong !== correctChange) wrongChanges.add(wrong);
  }
  const options = shuffleArray([correctChange, ...Array.from(wrongChanges)]);
  return { id: Math.random().toString(36).substring(2, 9), product, payment, correctChange, options, correctIndex: options.indexOf(correctChange), difficulty };
}

export function getChallengeCount(ageGroup: AgeGroup): number { return ageGroup === 'explorer' ? 6 : ageGroup === 'adventurer' ? 8 : 10; }

export function generateShopChallenges(ageGroup: AgeGroup): ShopChallenge[] {
  const products = getProductsForAge(ageGroup);
  const diff = ageGroup === 'explorer' ? 1 : ageGroup === 'adventurer' ? 2 : 3;
  return Array.from({ length: getChallengeCount(ageGroup) }, () => generateShopChallenge(products, diff));
}

export function checkChangeAnswer(challenge: ShopChallenge, idx: number): boolean { return idx === challenge.correctIndex; }

export function calculateShopScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0; const stars = calculateStars(accuracy);
  return { score: correct * 12, maxScore: total * 12, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
