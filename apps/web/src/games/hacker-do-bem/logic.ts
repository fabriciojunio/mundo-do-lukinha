import type { AgeGroup } from '@/types/age-group';
import { type GameResult, calculateStars, calculateXP, calculateCoins } from '@/types/game';
import { shuffleArray } from '@/lib/utils';

export type ChallengeType = 'password-strength' | 'phishing' | 'quiz';

export interface SecurityChallenge {
  id: string;
  type: ChallengeType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: number;
}

export function evaluatePasswordStrength(password: string): { score: number; level: 'weak' | 'medium' | 'strong' | 'very-strong'; tips: string[] } {
  let score = 0;
  const tips: string[] = [];
  if (password.length >= 8) score += 25; else tips.push('Use pelo menos 8 caracteres');
  if (password.length >= 12) score += 10;
  if (/[A-Z]/.test(password)) score += 20; else tips.push('Adicione letras maiúsculas');
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 20; else tips.push('Adicione números');
  if (/[!@#$%^&*()_+\-=[\]{};':"|,.<>?/]/.test(password)) score += 15; else tips.push('Adicione símbolos (!@#$)');
  if (new Set(password).size > password.length * 0.7) score += 5;
  const common = ['123456', 'senha', 'password', 'abc123', 'qwerty', '111111'];
  if (common.some((c) => password.toLowerCase().includes(c))) { score = Math.max(score - 30, 0); tips.push('Não use senhas comuns!'); }

  const level = score >= 80 ? 'very-strong' : score >= 60 ? 'strong' : score >= 35 ? 'medium' : 'weak';
  return { score: Math.min(score, 100), level, tips };
}

const CHALLENGES: SecurityChallenge[] = [
  // Password
  { id: 'pw1', type: 'password-strength', difficulty: 1, question: 'Qual é a senha MAIS FORTE?', options: ['123456', 'MeuGato2024!', 'senha', 'aaaaaa'], correctIndex: 1, explanation: 'Uma senha forte tem letras maiúsculas, minúsculas, números e símbolos!' },
  { id: 'pw2', type: 'password-strength', difficulty: 1, question: 'O que torna uma senha forte?', options: ['Ser curta', 'Usar só números', 'Misturar letras, números e símbolos', 'Usar o nome do pet'], correctIndex: 2, explanation: 'Quanto mais variada, mais difícil de adivinhar!' },
  { id: 'pw3', type: 'password-strength', difficulty: 2, question: 'Quantos caracteres uma senha forte deve ter no mínimo?', options: ['3', '6', '8', '4'], correctIndex: 2, explanation: 'Especialistas recomendam no mínimo 8 caracteres, idealmente 12+!' },
  // Phishing
  { id: 'ph1', type: 'phishing', difficulty: 1, question: 'Você recebeu: "Parabéns! Ganhou um iPhone! Clique aqui!" Isso é...', options: ['Verdade! Vou clicar!', 'Um golpe (phishing)', 'Uma promoção real', 'Um presente de amigo'], correctIndex: 1, explanation: 'Prêmios que chegam do nada são quase sempre golpes! Nunca clique!' },
  { id: 'ph2', type: 'phishing', difficulty: 2, question: 'Um email pede sua senha do banco. O que fazer?', options: ['Enviar a senha', 'Ignorar e apagar', 'Responder pedindo mais info', 'Enviar pra um amigo verificar'], correctIndex: 1, explanation: 'Bancos NUNCA pedem senha por email! Isso é golpe!' },
  { id: 'ph3', type: 'phishing', difficulty: 2, question: 'Um link diz "banco-seguro.xyz" mas seu banco é "banco.com.br". Isso é...', options: ['Normal', 'Site falso (golpe)', 'Versão nova do site', 'Site de backup'], correctIndex: 1, explanation: 'Sempre verifique o endereço! Sites falsos usam nomes parecidos para enganar.' },
  // Quiz
  { id: 'q1', type: 'quiz', difficulty: 1, question: 'Você deve compartilhar sua senha com...', options: ['Melhor amigo', 'Professor', 'Ninguém', 'Irmão'], correctIndex: 2, explanation: 'Senhas são PESSOAIS! Não compartilhe com ninguém!' },
  { id: 'q2', type: 'quiz', difficulty: 2, question: 'O que é um "vírus de computador"?', options: ['Uma doença', 'Um programa ruim que danifica o computador', 'Um jogo', 'Um tipo de email'], correctIndex: 1, explanation: 'Vírus são programas maliciosos que podem roubar dados ou danificar o computador.' },
  { id: 'q3', type: 'quiz', difficulty: 3, question: 'O que significa "criptografia"?', options: ['Apagar dados', 'Transformar dados em código secreto', 'Fazer backup', 'Enviar emails'], correctIndex: 1, explanation: 'Criptografia embaralha os dados para que só quem tem a "chave" possa ler!' },
  { id: 'q4', type: 'quiz', difficulty: 1, question: 'É seguro usar a mesma senha em todos os sites?', options: ['Sim, mais fácil de lembrar', 'Não, é muito perigoso', 'Sim, se for forte', 'Depende'], correctIndex: 1, explanation: 'Se um site for hackeado, todos os outros ficam comprometidos! Use senhas diferentes!' },
  { id: 'q5', type: 'quiz', difficulty: 3, question: 'O que é autenticação de dois fatores (2FA)?', options: ['Duas senhas', 'Usar senha + outro código (ex: celular)', 'Login em dois sites', 'Senha com 2 caracteres'], correctIndex: 1, explanation: '2FA adiciona uma camada extra: além da senha, você confirma com outro dispositivo!' },
  { id: 'q6', type: 'quiz', difficulty: 2, question: 'Qual Wi-Fi é mais seguro?', options: ['Wi-Fi aberto do shopping', 'Wi-Fi com senha de casa', 'Wi-Fi do vizinho', 'Qualquer Wi-Fi grátis'], correctIndex: 1, explanation: 'Wi-Fi aberto pode ser espionado! Sempre prefira redes protegidas com senha.' },
];

export function getChallengesForAge(ageGroup: AgeGroup): SecurityChallenge[] {
  switch (ageGroup) {
    case 'explorer': return CHALLENGES.filter((c) => c.difficulty === 1);
    case 'adventurer': return CHALLENGES.filter((c) => c.difficulty <= 2);
    case 'master': return CHALLENGES;
    default: return CHALLENGES.filter((c) => c.difficulty === 1);
  }
}

export function getChallengeCount(ageGroup: AgeGroup): number {
  switch (ageGroup) { case 'explorer': return 6; case 'adventurer': return 8; case 'master': return 10; default: return 6; }
}

export function selectChallenges(ageGroup: AgeGroup): SecurityChallenge[] {
  const pool = getChallengesForAge(ageGroup);
  return shuffleArray(pool).slice(0, getChallengeCount(ageGroup));
}

export function checkSecurityAnswer(challenge: SecurityChallenge, selectedIndex: number): boolean {
  return selectedIndex === challenge.correctIndex;
}

export function calculateSecurityScore(correct: number, total: number, timeSpent: number): GameResult {
  const accuracy = total > 0 ? correct / total : 0; const stars = calculateStars(accuracy);
  return { score: correct * 15, maxScore: total * 15, timeSpent, accuracy, xpEarned: calculateXP(stars), coinsEarned: calculateCoins(stars), achievements: [], stars };
}
