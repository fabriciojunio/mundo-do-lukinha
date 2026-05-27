import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryGame } from '../MemoryGame';

describe('MemoryGame Component', () => {
  const defaultProps = {
    ageGroup: 'explorer' as const,
    difficulty: 1,
    onGameEnd: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders the game with correct number of cards', () => {
    render(<MemoryGame {...defaultProps} />);
    const cards = screen.getAllByRole('button').filter((btn) => btn.textContent === '?');
    expect(cards.length).toBe(12);
  });

  it('shows game name', () => {
    render(<MemoryGame {...defaultProps} />);
    expect(screen.getByText('Jogo da Memória')).toBeInTheDocument();
  });

  it('shows move counter', () => {
    render(<MemoryGame {...defaultProps} />);
    expect(screen.getByText(/Jogadas: 0/)).toBeInTheDocument();
  });

  it('shows pair counter', () => {
    render(<MemoryGame {...defaultProps} />);
    expect(screen.getByText(/Pares: 0\/6/)).toBeInTheDocument();
  });
});
