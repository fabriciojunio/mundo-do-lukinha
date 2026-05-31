# 🌟 Mundo do Lukinha

Plataforma educativa com jogos divertidos para crianças de 3 a 14 anos.

## Sobre

Mundo do Lukinha é um ecossistema de jogos educativos que ensina matérias escolares, habilidades de vida, programação e valores humanos: tudo de forma divertida e encorajadora.

Feito com amor por um irmão mais velho para o Lukinha (7 anos) e futuras gerações.

## Filosofia

- **Divertido primeiro, educativo de forma natural**
- **Nunca punitivo, sempre encorajador**
- **Adaptação automática por faixa etária (3-14 anos)**
- **Custo zero: todas as ferramentas são gratuitas**

## Faixas Etárias

| Grupo | Idade | Nível |
|-------|-------|-------|
| 🐣 Pintinho | 3-5 anos | Pré-alfabetização |
| 🦊 Explorador | 6-8 anos | Alfabetizado |
| 🦁 Aventureiro | 9-11 anos | Leitura fluente |
| 🦅 Mestre | 12-14 anos | Desafios avançados |

## Jogos Incluídos (Fase 1)

- 🔢 **Batalha dos Números**: Matemática
- 🧠 **Jogo da Memória**: Raciocínio
- 🔍 **Caça-Palavras**: Português
- 🦕 **Dino Runner**: Coordenação
- 🎨 **Laboratório de Cores**: Artes/Ciências
- 🧪 **Quiz Aventura**: Conhecimento Geral

## Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Testes:** Vitest + React Testing Library
- **Monorepo:** pnpm workspaces

## Setup

```bash
# Instalar dependências
pnpm install

# Rodar em dev
pnpm dev

# Rodar testes
pnpm test

# Build
pnpm build

# Verificar tudo
pnpm check-all
```

## Estrutura

```
mundo-do-lukinha/
├── apps/web/           # Next.js app principal
│   └── src/
│       ├── app/        # Páginas (App Router)
│       ├── components/ # Componentes reutilizáveis
│       ├── games/      # Jogos (cada um é módulo independente)
│       ├── hooks/      # Custom hooks
│       ├── stores/     # Zustand stores
│       ├── lib/        # Utilitários e constantes
│       └── types/      # TypeScript types
└── docs/               # Documentação
```

## Como Adicionar um Novo Jogo

Veja `docs/GAME-CREATION-GUIDE.md`.

## Licença

Projeto pessoal e familiar. Uso privado.
