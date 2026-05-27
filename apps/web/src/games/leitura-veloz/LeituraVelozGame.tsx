'use client';

import { useState, useCallback, useRef } from 'react';
import type { GameProps, GameResult } from '@/types/game';
import { GameShell } from '@/components/games/GameShell';
import { GameOverScreen } from '@/components/games/GameOverScreen';
import { Button } from '@/components/ui/Button';
import { selectPassages, checkReadingAnswer, calculateReadingScore, type ReadingPassage } from './logic';
import { leituraVelozConfig } from './config';
import { playSound } from '@/lib/sounds';
import { getRandomItem } from '@/lib/utils';
import { ENCOURAGEMENT_CORRECT, ENCOURAGEMENT_WRONG } from '@/lib/constants';

type Phase = 'reading' | 'question' | 'feedback' | 'finished';

export function LeituraVelozGame({ ageGroup, onGameEnd, onBack }: GameProps) {
  const passages = useRef<ReadingPassage[]>(selectPassages(ageGroup));
  const [pIndex, setPIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('reading');
  const [correctTotal, setCorrectTotal] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const startTime = useRef(Date.now());

  const currentPassage = passages.current[pIndex];
  const totalPassages = passages.current.length;
  const currentQuestion = currentPassage?.questions[qIndex];

  const handleFinishedReading = useCallback(() => {
    setPhase('question');
    setQIndex(0);
  }, []);

  const handleAnswer = useCallback((selectedIndex: number) => {
    if (phase !== 'question' || !currentPassage || !currentQuestion) return;
    const isCorrect = checkReadingAnswer(currentPassage, qIndex, selectedIndex);
    const newCorrect = isCorrect ? correctTotal + 1 : correctTotal;
    const newTotal = totalAnswered + 1;
    if (isCorrect) { setCorrectTotal(newCorrect); playSound('correct'); setFeedback({ msg: getRandomItem(ENCOURAGEMENT_CORRECT), ok: true }); }
    else { playSound('wrong'); const correctOpt = currentQuestion.options[currentQuestion.correctIndex] ?? ''; setFeedback({ msg: `${getRandomItem(ENCOURAGEMENT_WRONG)} Resposta: ${correctOpt}`, ok: false }); }
    setTotalAnswered(newTotal);
    setPhase('feedback');

    setTimeout(() => {
      const nextQ = qIndex + 1;
      if (nextQ < currentPassage.questions.length) {
        setQIndex(nextQ);
        setFeedback(null);
        setPhase('question');
      } else {
        const nextP = pIndex + 1;
        if (nextP < totalPassages) {
          setPIndex(nextP);
          setQIndex(0);
          setFeedback(null);
          setPhase('reading');
        } else {
          const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
          const r = calculateReadingScore(newCorrect, newTotal, timeSpent);
          setResult(r); setPhase('finished'); playSound('gameOver'); onGameEnd(r);
        }
      }
    }, 1800);
  }, [phase, currentPassage, currentQuestion, qIndex, pIndex, correctTotal, totalAnswered, totalPassages, onGameEnd]);

  const handlePlayAgain = useCallback(() => {
    passages.current = selectPassages(ageGroup);
    setPIndex(0); setQIndex(0); setPhase('reading'); setCorrectTotal(0); setTotalAnswered(0); setFeedback(null); setResult(null); startTime.current = Date.now();
  }, [ageGroup]);

  if (phase === 'finished' && result) return <GameOverScreen result={result} gameName={leituraVelozConfig.name} onPlayAgain={handlePlayAgain} onBack={onBack} />;
  if (!currentPassage) return null;

  return (
    <GameShell gameName={leituraVelozConfig.name} gameIcon={leituraVelozConfig.icon} score={correctTotal * 15} onBack={onBack}>
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 max-w-lg mx-auto">
        <p className="text-sm font-body text-text-light">Texto {pIndex + 1}/{totalPassages}</p>

        {phase === 'reading' && (
          <div className="w-full">
            <h3 className="font-display font-bold text-lg text-text-main mb-3 text-center">{currentPassage.title}</h3>
            <div className="bg-gray-50 rounded-2xl p-5 mb-4 max-h-[300px] overflow-y-auto">
              <p className="font-body text-text-main leading-relaxed text-base">{currentPassage.text}</p>
            </div>
            <p className="text-xs font-body text-text-light text-center mb-3">{currentPassage.wordCount} palavras</p>
            <Button variant="primary" size="lg" fullWidth onClick={handleFinishedReading}>
              Terminei de ler! Vamos às perguntas 📝
            </Button>
          </div>
        )}

        {(phase === 'question' || phase === 'feedback') && currentQuestion && (
          <div className="w-full">
            <p className="text-xs font-body text-text-light mb-2 text-center">
              Pergunta {qIndex + 1}/{currentPassage.questions.length} sobre &quot;{currentPassage.title}&quot;
            </p>
            <p className="font-display font-bold text-lg text-text-main text-center mb-4">{currentQuestion.question}</p>
            <div className="flex flex-col gap-3 w-full">
              {currentQuestion.options.map((opt, i) => (
                <Button key={`${currentPassage.id}-q${qIndex}-${i}`} variant="ghost" size="lg" fullWidth onClick={() => handleAnswer(i)} disabled={phase !== 'question'}
                  className="border border-gray-200 hover:border-success hover:bg-success/5 text-left justify-start">
                  <span className="font-display font-bold text-success mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                </Button>
              ))}
            </div>
            {feedback && (
              <p className={`mt-4 text-sm font-body font-semibold text-center px-4 py-2 rounded-xl animate-pop-in ${feedback.ok ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>
                {feedback.msg}
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
}
