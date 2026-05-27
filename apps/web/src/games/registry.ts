import type { GameRegistryEntry, GameCategory } from '@/types/game';
import type { AgeGroup } from '@/types/age-group';
import { mathBattleGame } from './math-battle';
import { memoryGameGame } from './memory-game';
import { wordHuntGame } from './word-hunt';
import { dinoRunnerGame } from './dino-runner';
import { colorLabGame } from './color-lab';
import { quizAdventureGame } from './quiz-adventure';
import { tabuadaNinjaGame } from './tabuada-ninja';
import { fabricaFracoesGame } from './fabrica-fracoes';
import { silabaMagicaGame } from './silaba-magica';
import { ditadoMusicalGame } from './ditado-musical';
import { corpoHumanoGame } from './corpo-humano';
import { sistemaSolarGame } from './sistema-solar';
import { mapaMundiGame } from './mapa-mundi';
import { maquinaDoTempoGame } from './maquina-do-tempo';
import { englishWordsGame } from './english-words';
import { pianoVirtualGame } from './piano-virtual';
import { geometriaBuilderGame } from './geometria-builder';
import { leituraVelozGame } from './leitura-veloz';
import { codeBlocksGame } from './code-blocks';
import { hackerDoBemGame } from './hacker-do-bem';
import { binaryHeroGame } from './binary-hero';
import { pixelArtCoderGame } from './pixel-art-coder';
import { aiPetGame } from './ai-pet';
import { comoInternetGame } from './como-internet-funciona';
import { construtorSitesGame } from './construtor-sites';
import { cidadeDoFuturoGame } from './cidade-do-futuro';
import { cofrinhoEspertoGame } from './cofrinho-esperto';
import { lojinhaLukinhaGame } from './lojinha-lukinha';
import { diarioEmocoesGame } from './diario-emocoes';
import { escolhasConsequenciasGame } from './escolhas-consequencias';
import { cuidaBichinhoGame } from './cuida-bichinho';
import { guardiaoFlorestaGame } from './guardiao-floresta';
import { missoesDoDiaGame } from './missoes-do-dia';
import { respeitoEscolaGame } from './respeito-escola';
import { plataformaLukinhaGame } from './plataforma-lukinha';
import { quebraCabecaGame } from './quebra-cabeca';
import { velhaTurbinadoGame } from './velha-turbinado';
import { corridaMalucaGame } from './corrida-maluca';
import { towerDefenseGame } from './tower-defense';
import { construtorMundosGame } from './construtor-mundos';
import { pointClickGame } from './point-and-click';
import { snakeEducativoGame } from './snake-educativo';
import { bubblePopGame } from './bubble-pop';
import { pinturaLivreGame } from './pintura-livre';
import { construtorCivilizacoesGame } from './construtor-civilizacoes';
import { laboratorioQuimicoGame } from './laboratorio-quimico';
import { roboticaVirtualGame } from './robotica-virtual';
import { debateClubGame } from './debate-club';

export const gameRegistry: GameRegistryEntry[] = [
  mathBattleGame,
  memoryGameGame,
  wordHuntGame,
  dinoRunnerGame,
  colorLabGame,
  quizAdventureGame,
  tabuadaNinjaGame,
  fabricaFracoesGame,
  silabaMagicaGame,
  ditadoMusicalGame,
  corpoHumanoGame,
  sistemaSolarGame,
  mapaMundiGame,
  maquinaDoTempoGame,
  englishWordsGame,
  pianoVirtualGame,
  geometriaBuilderGame,
  leituraVelozGame,
  codeBlocksGame,
  hackerDoBemGame,
  binaryHeroGame,
  pixelArtCoderGame,
  aiPetGame,
  comoInternetGame,
  construtorSitesGame,
  cidadeDoFuturoGame,
  cofrinhoEspertoGame,
  lojinhaLukinhaGame,
  diarioEmocoesGame,
  escolhasConsequenciasGame,
  cuidaBichinhoGame,
  guardiaoFlorestaGame,
  missoesDoDiaGame,
  respeitoEscolaGame,
  plataformaLukinhaGame,
  quebraCabecaGame,
  velhaTurbinadoGame,
  corridaMalucaGame,
  towerDefenseGame,
  construtorMundosGame,
  pointClickGame,
  snakeEducativoGame,
  bubblePopGame,
  pinturaLivreGame,
  construtorCivilizacoesGame,
  laboratorioQuimicoGame,
  roboticaVirtualGame,
  debateClubGame,
];

export function getGameById(id: string): GameRegistryEntry | null {
  return gameRegistry.find((g) => g.config.id === id) ?? null;
}

export function getGamesByCategory(category: GameCategory): GameRegistryEntry[] {
  return gameRegistry.filter((g) => g.config.category === category);
}

export function getGamesForAgeGroup(ageGroup: AgeGroup): GameRegistryEntry[] {
  return gameRegistry.filter((g) => g.config.ageGroups.includes(ageGroup));
}
