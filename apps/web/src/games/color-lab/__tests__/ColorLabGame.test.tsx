import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ColorLabGame } from '../ColorLabGame';

describe('ColorLabGame Component', () => {
  const defaultProps = {
    ageGroup: 'explorer' as const,
    difficulty: 1,
    onGameEnd: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders the game name', () => {
    render(<ColorLabGame {...defaultProps} />);
    expect(screen.getByText('Laboratório de Cores')).toBeInTheDocument();
  });

  it('renders available colors', () => {
    render(<ColorLabGame {...defaultProps} />);
    expect(screen.getByText('Vermelho')).toBeInTheDocument();
    expect(screen.getByText('Azul')).toBeInTheDocument();
    expect(screen.getByText('Amarelo')).toBeInTheDocument();
  });

  it('shows mission info', () => {
    render(<ColorLabGame {...defaultProps} />);
    expect(screen.getByText(/Missão 1/)).toBeInTheDocument();
  });
});
