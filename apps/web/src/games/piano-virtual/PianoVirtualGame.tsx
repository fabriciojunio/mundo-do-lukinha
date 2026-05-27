'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { PIANO_NOTES, getMelodiesForAge, getRoundCount, playNoteSound, playMelody, checkMelodyAttempt, calculatePianoScore, type Melody } from './logic';
import { pianoVirtualConfig } from './config';
import { playSound } from '@/lib/sounds';
import { shuffleArray } from '@/lib/utils';

type Phase = 'listening' | 'playing' | 'feedback' | 'finished';

export function PianoVirtualGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const melodies = useRef<Melody[]>(shuffleArray(getMelodiesForAge(ageGroup)).slice(0, getRoundCount(ageGroup)));
  const [mIndex, setMIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('listening');
  const [attempt, setAttempt] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const currentMelody = melodies.current[mIndex];
  const totalMelodies = melodies.current.length;

  const handleListen = useCallback(async () => {
    if (!currentMelody) return;
    setPhase('listening');
    await playMelody(currentMelody.notes, 500);
    setPhase('playing');
    setAttempt([]);
  }, [currentMelody]);

  const handleNoteClick = useCallback(
    (noteName: string, frequency: number) => {
      if (phase !== 'playing' || !currentMelody) return;
      playNoteSound(frequency);
      setActiveNote(noteName);
      setTimeout(() => setActiveNote(null), 200);

      const newAttempt = [...attempt, noteName];
      setAttempt(newAttempt);

      if (newAttempt.length === currentMelody.notes.length) {
        const isCorrect = checkMelodyAttempt(currentMelody.notes, newAttempt);
        let newCorrectCount = correctCount;

        if (isCorrect) {
          newCorrectCount = correctCount + 1;
          setCorrectCount(newCorrectCount);
          playSound('correct');
          setFeedback('Perfeito! Você tocou a melodia certinha! 🎵');
        } else {
          playSound('wrong');
          setFeedback(`Quase! A melodia era: ${currentMelody.notes.join(' → ')}`);
        }

        setPhase('feedback');
        setTimeout(() => {
          if (mIndex + 1 >= totalMelodies) {
            const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
            const r = calculatePianoScore(newCorrectCount, totalMelodies, timeSpent);
            setResult(r);
            setPhase('finished');
            playSound('gameOver');
            onGameEnd(r);
          } else {
            setMIndex((i) => i + 1);
            setFeedback(null);
            setAttempt([]);
            setPhase('listening');
          }
        }, 2000);
      }
    },
    [phase, currentMelody, attempt, correctCount, mIndex, totalMelodies, onGameEnd],
  );

  const handlePlayAgain = useCallback(() => {
    melodies.current = shuffleArray(getMelodiesForAge(ageGroup)).slice(0, getRoundCount(ageGroup));
    setMIndex(0);
    setPhase('listening');
    setAttempt([]);
    setCorrectCount(0);
    setFeedback(null);
    setResult(null);
    startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) {
    return <GameOverScreen result={result} gameName={pianoVirtualConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  }
  if (!currentMelody) return null;

  return (
    <GameShell gameName={pianoVirtualConfig.name} gameIcon={pianoVirtualConfig.icon} score={correctCount * 20} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-4">
        <p className="text-sm font-body text-text-light">Melodia {mIndex + 1}/{totalMelodies}: {currentMelody.name}</p>

        {phase === 'listening' && (
          <div className="text-center">
            <p className="font-display font-bold text-lg text-text-main mb-4">Ouça a melodia e depois repita!</p>
            <Button variant="secondary" size="lg" onClick={handleListen}>🎵 Ouvir Melodia</Button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="text-center">
            <p className="font-display font-bold text-lg text-text-main">Agora é sua vez! Toque as notas!</p>
            <p className="text-sm font-body text-text-light mt-1">
              {attempt.length}/{currentMelody.notes.length} notas
            </p>
          </div>
        )}

        {feedback && (
          <p className={`text-sm font-body font-semibold text-center px-4 py-2 rounded-xl animate-pop-in ${correctCount > (mIndex) ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>
            {feedback}
          </p>
        )}

        <div className="flex gap-1 justify-center">
          {PIANO_NOTES.map((note) => (
            <button
              key={note.name}
              onClick={() => handleNoteClick(note.name, note.frequency)}
              disabled={phase !== 'playing'}
              className={`
                relative flex flex-col items-center justify-end pb-2
                rounded-b-lg border-2 transition-all
                ${note.color === 'white'
                  ? `w-12 h-36 md:w-14 md:h-44 bg-white border-gray-300 hover:bg-gray-50 ${activeNote === note.name ? 'bg-primary/20 border-primary' : ''}`
                  : `w-8 h-24 bg-gray-800 border-gray-900 text-white hover:bg-gray-700 ${activeNote === note.name ? 'bg-secondary border-secondary' : ''}`
                }
                ${phase !== 'playing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
              `}
            >
              <span className={`text-xs font-display font-bold ${note.color === 'black' ? 'text-white' : 'text-text-main'}`}>
                {note.namePt}
              </span>
            </button>
          ))}
        </div>

        {phase === 'playing' && attempt.length > 0 && (
          <div className="flex gap-1 justify-center">
            {attempt.map((n, i) => (
              <span key={i} className="bg-secondary/20 text-secondary px-2 py-1 rounded text-xs font-mono font-bold">
                {n}
              </span>
            ))}
          </div>
        )}
      </div>
    </GameShell>
  );
}
