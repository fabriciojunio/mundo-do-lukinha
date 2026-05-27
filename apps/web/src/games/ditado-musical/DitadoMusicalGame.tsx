'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { Volume2, HelpCircle } from 'lucide-react';
import {
  selectWords,
  speakWord,
  checkSpelling,
  getLetterFeedback,
  calculateDitadoScore,
  type DitadoWord,
} from './logic';
import { ditadoMusicalConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

export function DitadoMusicalGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const words = useRef<DitadoWord[]>(selectWords(ageGroup));
  const [wIndex, setWIndex] = useState(0);
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<{
    msg: string;
    ok: boolean;
    letters?: Array<{ letter: string; status: string }>;
  } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTime = useRef(Date.now());

  const currentWord = words.current[wIndex];
  const totalWords = words.current.length;

  useEffect(() => {
    if (phase === 'playing' && currentWord) {
      const timer = setTimeout(() => speakWord(currentWord.word), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [wIndex, phase, currentWord]);

  useEffect(() => {
    if (phase === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, wIndex]);

  const handleSpeak = useCallback(() => {
    if (currentWord) speakWord(currentWord.word);
  }, [currentWord]);

  const handleHint = useCallback(() => {
    setShowHint(true);
    setHintsUsed((h) => h + 1);
  }, []);

  const handleSubmit = useCallback(() => {
    if (phase !== 'playing' || !currentWord || input.trim().length === 0) return;

    const isCorrect = checkSpelling(input, currentWord.word);
    let newCorrect = correct;

    if (isCorrect) {
      newCorrect = correct + 1;
      setCorrect(newCorrect);
      playSound('correct');
      setFeedback({ msg: getRandomItem(ENCOURAGEMENT_CORRECT), ok: true });
    } else {
      playSound('wrong');
      const letters = getLetterFeedback(input, currentWord.word);
      setFeedback({
        msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} A palavra certa é: ${currentWord.word}`,
        ok: false,
        letters,
      });
    }

    setPhase('feedback');
    setTimeout(() => {
      if (wIndex + 1 >= totalWords) {
        const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
        const gameResult = calculateDitadoScore(newCorrect, totalWords, hintsUsed, timeSpent);
        setResult(gameResult);
        setPhase('finished');
        playSound('gameOver');
        onGameEnd(gameResult);
      } else {
        setWIndex((i) => i + 1);
        setInput('');
        setFeedback(null);
        setShowHint(false);
        setPhase('playing');
      }
    }, 2500);
  }, [phase, currentWord, input, correct, wIndex, totalWords, hintsUsed, onGameEnd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit();
    },
    [handleSubmit],
  );

  const handlePlayAgain = useCallback(() => {
    words.current = selectWords(ageGroup);
    setWIndex(0);
    setInput('');
    setCorrect(0);
    setHintsUsed(0);
    setFeedback(null);
    setShowHint(false);
    setPhase('playing');
    setResult(null);
    startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) {
    return (
      <GameOverScreen
        result={result}
        gameName={ditadoMusicalConfig.name}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <GameShell
      gameName={ditadoMusicalConfig.name}
      gameIcon={ditadoMusicalConfig.icon}
      score={correct * 12}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6 max-w-md mx-auto">
        <p className="text-sm font-body text-text-light">
          Palavra {wIndex + 1}/{totalWords}
        </p>

        <div className="text-center">
          <p className="font-display font-bold text-lg text-text-main mb-4">
            Ouça a palavra e escreva!
          </p>

          <button
            onClick={handleSpeak}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-enchant text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <Volume2 size={40} />
          </button>
          <p className="text-xs font-body text-text-light mt-2">Toque para ouvir</p>
        </div>

        {showHint && (
          <div className="bg-warning/10 px-4 py-2 rounded-xl animate-pop-in">
            <p className="text-sm font-body text-yellow-700">
              💡 Dica: {currentWord.hint} ({currentWord.category})
            </p>
          </div>
        )}

        <div className="w-full">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Digite a palavra aqui..."
            disabled={phase !== 'playing'}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 font-display font-bold text-xl text-center text-text-main focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none tracking-widest uppercase"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {feedback && (
          <div className={`w-full text-center animate-pop-in ${feedback.ok ? 'text-success' : 'text-error'}`}>
            <p className="font-body font-semibold text-sm">{feedback.msg}</p>
            {feedback.letters && (
              <div className="flex justify-center gap-1 mt-2">
                {feedback.letters.map((l, i) => (
                  <span
                    key={i}
                    className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-sm ${
                      l.status === 'correct'
                        ? 'bg-success/20 text-success'
                        : l.status === 'wrong'
                          ? 'bg-error/20 text-error'
                          : 'bg-gray-200 text-text-light'
                    }`}
                  >
                    {l.letter}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 w-full">
          {!showHint && phase === 'playing' && (
            <Button variant="ghost" size="md" onClick={handleHint} className="flex-1">
              <HelpCircle size={18} className="mr-1" /> Dica
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={phase !== 'playing' || input.trim().length === 0}
            className="flex-1"
          >
            Confirmar ✓
          </Button>
        </div>
      </div>
    </GameShell>
  );
}
