# API — Mundo do Lukinha

## Status Atual
A plataforma roda 100% no cliente (localStorage). Não há backend/API REST ainda.

## Stores (API Local)
### playerStore
- `createPlayer(name, age, avatarEmoji)` — Cria perfil
- `addGameResult(gameId, result)` — Registra resultado
- `unlockAchievement(id)` — Desbloqueia conquista
- `resetPlayer()` — Limpa dados

### familyStore
- `addProfile / removeProfile / setActiveProfile` — Gerencia perfis
- `setParentPin / verifyParentPin` — PIN parental
- `exportAllData()` — Exporta JSON (LGPD)
- `deleteAllData()` — Exclui tudo (LGPD)

### dailyMissionsStore
- `generateDailyMissions()` — Gera 3 missões do dia
- `completeMission(id)` — Marca como completa
- `getStreakBonus()` — Bônus por dias consecutivos

## API Futura (quando backend for adicionado)
- `POST /api/auth/login` — Login do responsável
- `GET /api/players` — Lista perfis
- `POST /api/players/:id/game-result` — Salva resultado
- `GET /api/players/:id/progress` — Dashboard
- `DELETE /api/account` — Exclusão LGPD
