# Arquitetura — Mundo do Lukinha

## Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript strict + Tailwind CSS
- **Estado:** Zustand com persist (localStorage)
- **Testes:** Vitest + React Testing Library
- **Jogos:** HTML5 Canvas + Web Audio API

## Camadas
```
Pages (app/) → Components → Hooks → Stores → Types/Lib
                              ↓
                         Games (48 módulos independentes)
```

## Estrutura de Pastas
- `apps/web/src/app/` — Páginas: Home, Jogos, Perfil, Conquistas, Pais
- `apps/web/src/components/` — UI (Button, Card, Modal), Layout (Header, Sidebar), Player (Avatar, XP), Games (GameShell)
- `apps/web/src/games/` — 48 jogos, cada um com config, logic, component, index, tests
- `apps/web/src/stores/` — playerStore, gameStore, familyStore, dailyMissionsStore
- `apps/web/src/hooks/` — usePlayer, useGame, useAgeGroup, useSound, useAdaptiveDifficulty
- `apps/web/src/types/` — AgeGroup, Game, Player, Achievement
- `apps/web/src/lib/` — utils, sounds (Web Audio), constants, ageAdapter

## Fluxo de Dados
1. Responsável cria perfil com nome, idade e avatar
2. Sistema calcula faixa etária (🐣🦊🦁🦅)
3. Jogos filtrados e adaptados à faixa
4. Resultado do jogo → XP + moedas + conquistas → playerStore
5. Progresso persistido em localStorage
