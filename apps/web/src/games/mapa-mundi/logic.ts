import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: string;
  flag: string;
  funFact: string;
  difficulty: number;
}

const COUNTRIES: Country[] = [
  { id: 'br', name: 'Brasil', capital: 'Brasília', continent: 'América do Sul', flag: '🇧🇷', funFact: 'O Brasil é o maior país da América do Sul!', difficulty: 1 },
  { id: 'us', name: 'Estados Unidos', capital: 'Washington D.C.', continent: 'América do Norte', flag: '🇺🇸', funFact: 'Os EUA têm 50 estados!', difficulty: 1 },
  { id: 'fr', name: 'França', capital: 'Paris', continent: 'Europa', flag: '🇫🇷', funFact: 'A Torre Eiffel fica em Paris!', difficulty: 1 },
  { id: 'jp', name: 'Japão', capital: 'Tóquio', continent: 'Ásia', flag: '🇯🇵', funFact: 'O Japão é conhecido como "Terra do Sol Nascente"!', difficulty: 1 },
  { id: 'au', name: 'Austrália', capital: 'Camberra', continent: 'Oceania', flag: '🇦🇺', funFact: 'A Austrália é um país e um continente ao mesmo tempo!', difficulty: 1 },
  { id: 'eg', name: 'Egito', capital: 'Cairo', continent: 'África', flag: '🇪🇬', funFact: 'As pirâmides do Egito têm mais de 4.500 anos!', difficulty: 1 },
  { id: 'ar', name: 'Argentina', capital: 'Buenos Aires', continent: 'América do Sul', flag: '🇦🇷', funFact: 'A Argentina é famosa pelo tango!', difficulty: 2 },
  { id: 'de', name: 'Alemanha', capital: 'Berlim', continent: 'Europa', flag: '🇩🇪', funFact: 'A Alemanha é a maior economia da Europa!', difficulty: 2 },
  { id: 'it', name: 'Itália', capital: 'Roma', continent: 'Europa', flag: '🇮🇹', funFact: 'A Itália tem formato de uma bota!', difficulty: 2 },
  { id: 'cn', name: 'China', capital: 'Pequim', continent: 'Ásia', flag: '🇨🇳', funFact: 'A Muralha da China tem mais de 21.000 km!', difficulty: 2 },
  { id: 'in', name: 'Índia', capital: 'Nova Delhi', continent: 'Ásia', flag: '🇮🇳', funFact: 'A Índia é o segundo país mais populoso do mundo!', difficulty: 2 },
  { id: 'mx', name: 'México', capital: 'Cidade do México', continent: 'América do Norte', flag: '🇲🇽', funFact: 'O México é berço da civilização Asteca!', difficulty: 2 },
  { id: 'za', name: 'África do Sul', capital: 'Pretória', continent: 'África', flag: '🇿🇦', funFact: 'A África do Sul tem 3 capitais diferentes!', difficulty: 3 },
  { id: 'no', name: 'Noruega', capital: 'Oslo', continent: 'Europa', flag: '🇳🇴', funFact: 'Na Noruega, no verão o sol não se põe por meses!', difficulty: 3 },
  { id: 'nz', name: 'Nova Zelândia', capital: 'Wellington', continent: 'Oceania', flag: '🇳🇿', funFact: 'A Nova Zelândia foi o cenário de O Senhor dos Anéis!', difficulty: 3 },
  { id: 'pe', name: 'Peru', capital: 'Lima', continent: 'América do Sul', flag: '🇵🇪', funFact: 'Machu Picchu fica no Peru, a 2.430 metros de altitude!', difficulty: 3 },
];

export function getCountriesForAge(ageGroup: AgeGroup): Country[] {
  switch (ageGroup) {
    case 'explorer': return COUNTRIES.filter((c) => c.difficulty === 1);
    case 'adventurer': return COUNTRIES.filter((c) => c.difficulty <= 2);
    case 'master': return COUNTRIES;
    default: return COUNTRIES.filter((c) => c.difficulty === 1);
  }
}

export function getQuizCount(ageGroup: AgeGroup): number {
  switch (ageGroup) {
    case 'explorer': return 8;
    case 'adventurer': return 10;
    case 'master': return 12;
    default: return 8;
  }
}

export interface GeoQuiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  country: Country;
}

export function generateGeoQuiz(countries: Country[]): GeoQuiz {
  const country = countries[Math.floor(Math.random() * countries.length)] as Country;
  const questionTypes = [
    { q: `${country.flag} Qual é a capital de ${country.name}?`, correct: country.capital, pool: countries.map((c) => c.capital) },
    { q: `${country.flag} Em qual continente fica ${country.name}?`, correct: country.continent, pool: ['América do Sul', 'América do Norte', 'Europa', 'Ásia', 'África', 'Oceania'] },
    { q: `Qual país tem esta bandeira? ${country.flag}`, correct: country.name, pool: countries.map((c) => c.name) },
  ];

  const qData = questionTypes[Math.floor(Math.random() * questionTypes.length)]!;
  const wrongPool = qData.pool.filter((o) => o !== qData.correct);
  const wrongOptions = shuffleArray(wrongPool).slice(0, 3);
  const options = shuffleArray([qData.correct, ...wrongOptions]);
  const correctIndex = options.indexOf(qData.correct);

  return {
    id: Math.random().toString(36).substring(2, 9),
    question: qData.q,
    options,
    correctIndex: Math.max(0, correctIndex),
    explanation: country.funFact,
    country,
  };
}

export function generateGeoQuizSet(ageGroup: AgeGroup): GeoQuiz[] {
  const countries = getCountriesForAge(ageGroup);
  const count = getQuizCount(ageGroup);
  return Array.from({ length: count }, () => generateGeoQuiz(countries));
}

export function checkGeoAnswer(quiz: GeoQuiz, selectedIndex: number): boolean {
  return selectedIndex === quiz.correctIndex;
}

export function calculateGeoScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0;
  const stars = calculateStars(accuracy);
  return { score: correct * 15, maxScore: total * 15, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
