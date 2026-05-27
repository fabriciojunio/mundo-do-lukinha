import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DinoRunnerGame } from '../DinoRunnerGame';

describe('DinoRunnerGame Component', () => {
  const defaultProps = {
    ageGroup: 'explorer' as const,
    difficulty: 1,
    onGameEnd: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders the start screen', () => {
    render(<DinoRunnerGame {...defaultProps} />);
    expect(screen.getByText(/Toque ou aperte Espaço/)).toBeInTheDocument();
  });

  it('renders game name', () => {
    render(<DinoRunnerGame {...defaultProps} />);
    expect(screen.getByText(/Dino Runner/)).toBeInTheDocument();
  });

  it('renders the canvas', () => {
    render(<DinoRunnerGame {...defaultProps} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
