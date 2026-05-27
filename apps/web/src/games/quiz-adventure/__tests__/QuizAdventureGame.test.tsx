import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizAdventureGame } from '../QuizAdventureGame';

describe('QuizAdventureGame Component', () => {
  const defaultProps = {
    ageGroup: 'explorer' as const,
    difficulty: 1,
    onGameEnd: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders the game name', () => {
    render(<QuizAdventureGame {...defaultProps} />);
    expect(screen.getByText('Quiz Aventura')).toBeInTheDocument();
  });

  it('shows a question', () => {
    render(<QuizAdventureGame {...defaultProps} />);
    expect(screen.getByText(/Pergunta 1/)).toBeInTheDocument();
  });

  it('shows answer options', () => {
    render(<QuizAdventureGame {...defaultProps} />);
    expect(screen.getByText('A.')).toBeInTheDocument();
    expect(screen.getByText('B.')).toBeInTheDocument();
  });
});
