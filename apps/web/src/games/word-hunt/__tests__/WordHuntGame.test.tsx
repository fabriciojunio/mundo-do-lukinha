import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordHuntGame } from '../WordHuntGame';

describe('WordHuntGame Component', () => {
  const defaultProps = {
    ageGroup: 'explorer' as const,
    difficulty: 1,
    onGameEnd: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders the game name', () => {
    render(<WordHuntGame {...defaultProps} />);
    expect(screen.getByText('Caça-Palavras')).toBeInTheDocument();
  });

  it('renders word list', () => {
    render(<WordHuntGame {...defaultProps} />);
    const wordElements = screen.getAllByText(/Palavras/);
    expect(wordElements.length).toBeGreaterThan(0);
  });

  it('renders grid cells with letters', () => {
    render(<WordHuntGame {...defaultProps} />);
    const buttons = screen.getAllByRole('button').filter((b) => /^[A-Z]$/.test(b.textContent ?? ''));
    expect(buttons.length).toBe(64); // 8x8
  });
});
