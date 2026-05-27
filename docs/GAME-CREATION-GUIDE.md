# Como Criar um Novo Jogo

## 1. Criar pasta em `src/games/meu-jogo/`

## 2. Criar `config.ts`
```typescript
import type { GameConfig } from '@/types/game';
export const meuJogoConfig: GameConfig = {
  id: 'meu-jogo', name: 'Meu Jogo', description: '...',
  category: 'math', ageGroups: ['explorer', 'adventurer', 'master'],
  icon: '🎮', color: '#4ECDC4', difficulty: { min: 1, max: 8 },
  estimatedMinutes: 4, skills: ['lógica'], version: '1.0.0',
};
```

## 3. Criar `logic.ts` (lógica pura, sem React)

## 4. Criar componente com `GameShell` + `GameOverScreen`

## 5. Criar `index.tsx` exportando `GameRegistryEntry`

## 6. Criar `__tests__/logic.test.ts`

## 7. Registrar em `games/registry.ts`
