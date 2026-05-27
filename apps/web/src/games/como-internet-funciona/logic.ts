import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export interface InternetQuiz {
  id: string; question: string; options: string[]; correctIndex: number; explanation: string; emoji: string; topic: string; difficulty: number;
}

const QUIZZES: InternetQuiz[] = [
  { id: 'i1', emoji: '🌐', topic: 'Web', difficulty: 1, question: 'O que é a Internet?', options: ['Um programa de computador', 'Uma rede que conecta computadores do mundo todo', 'Um site', 'Um tipo de celular'], correctIndex: 1, explanation: 'A Internet é uma rede gigante que conecta bilhões de dispositivos pelo mundo!' },
  { id: 'i2', emoji: '📡', topic: 'Wi-Fi', difficulty: 1, question: 'O que o Wi-Fi faz?', options: ['Gera energia', 'Conecta à internet sem fio', 'Carrega o celular', 'Faz ligações'], correctIndex: 1, explanation: 'Wi-Fi usa ondas de rádio para enviar dados pelo ar, sem precisar de cabo!' },
  { id: 'i3', emoji: '🖥️', topic: 'Servidor', difficulty: 1, question: 'O que é um servidor?', options: ['Um garçom digital', 'Um computador que guarda sites e dados', 'Uma parte do celular', 'Um tipo de app'], correctIndex: 1, explanation: 'Servidores são computadores poderosos que guardam sites, vídeos e dados para todos acessarem!' },
  { id: 'i4', emoji: '📧', topic: 'Email', difficulty: 1, question: 'Como um email viaja do remetente ao destinatário?', options: ['Por correio', 'Pela internet, de servidor para servidor', 'Pelo ar diretamente', 'Por satélite apenas'], correctIndex: 1, explanation: 'O email é dividido em pacotes de dados que viajam pela internet entre servidores!' },
  { id: 'i5', emoji: '🔒', topic: 'HTTPS', difficulty: 2, question: 'O que o cadeado 🔒 no navegador significa?', options: ['O site é lento', 'A conexão é criptografada e segura', 'O site é grátis', 'O site tem jogos'], correctIndex: 1, explanation: 'HTTPS criptografa os dados entre você e o site — ninguém pode ler no meio do caminho!' },
  { id: 'i6', emoji: '📦', topic: 'Pacotes', difficulty: 2, question: 'Como os dados viajam pela internet?', options: ['Inteiros de uma vez', 'Divididos em pequenos pacotes', 'Só texto viaja', 'Em ordem alfabética'], correctIndex: 1, explanation: 'Dados são divididos em pacotes pequenos que viajam por caminhos diferentes e se juntam no destino!' },
  { id: 'i7', emoji: '🌍', topic: 'DNS', difficulty: 2, question: 'O que o DNS faz?', options: ['Bloqueia vírus', 'Transforma nomes de sites em números (IPs)', 'Acelera a internet', 'Salva senhas'], correctIndex: 1, explanation: 'DNS é como uma agenda que transforma "google.com" no endereço real do servidor (IP)!' },
  { id: 'i8', emoji: '☁️', topic: 'Nuvem', difficulty: 2, question: 'O que é "a nuvem" (cloud)?', options: ['Nuvens no céu com dados', 'Computadores remotos que guardam dados', 'Um tipo de Wi-Fi', 'Armazenamento no celular'], correctIndex: 1, explanation: 'A nuvem são servidores em data centers que guardam seus arquivos para acessar de qualquer lugar!' },
  { id: 'i9', emoji: '🔌', topic: 'Cabos', difficulty: 3, question: 'Como continentes se conectam à internet?', options: ['Por satélite apenas', 'Cabos submarinos no fundo do oceano', 'Por Wi-Fi', 'Não se conectam'], correctIndex: 1, explanation: 'Mais de 400 cabos submarinos no fundo do oceano conectam os continentes! São a espinha dorsal da internet.' },
  { id: 'i10', emoji: '📱', topic: 'IP', difficulty: 3, question: 'O que é um endereço IP?', options: ['O nome do site', 'Um número que identifica cada dispositivo na rede', 'A senha do Wi-Fi', 'O modelo do celular'], correctIndex: 1, explanation: 'Cada dispositivo na internet tem um IP único, como o endereço da sua casa!' },
];

export function getQuizzesForAge(ageGroup: AgeGroup): InternetQuiz[] {
  switch (ageGroup) {
    case 'explorer': return QUIZZES.filter((q) => q.difficulty === 1);
    case 'adventurer': return QUIZZES.filter((q) => q.difficulty <= 2);
    case 'master': return QUIZZES;
    default: return QUIZZES.filter((q) => q.difficulty === 1);
  }
}

export function selectQuizzes(ageGroup: AgeGroup): InternetQuiz[] {
  const pool = getQuizzesForAge(ageGroup);
  const count = ageGroup === 'explorer' ? 4 : ageGroup === 'adventurer' ? 8 : 10;
  return shuffleArray(pool).slice(0, count);
}

export function checkInternetAnswer(quiz: InternetQuiz, idx: number): boolean { return idx === quiz.correctIndex; }

export function calculateInternetScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0; const stars = calculateStars(accuracy);
  return { score: correct * 15, maxScore: total * 15, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
