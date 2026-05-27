import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MathBattleGame } from '../MathBattleGame';

describe('MathBattleGame Component', () => {
  const defaultProps = {
    ageGroup: 'explorer' as const,
    difficulty: 1,
    onGameEnd: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders the question display text', () => {
    render(<MathBattleGame {...defaultProps} />);
    const questionText = screen.getByText(/= \?/);
    expect(questionText).toBeInTheDocument();
  });

  it('renders answer option buttons for explorer', () => {
    render(<MathBattleGame {...defaultProps} />);
    const buttons = screen.getAllByRole('button').filter((btn) => !isNaN(Number(btn.textContent)));
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('shows game name in header', () => {
    render(<MathBattleGame {...defaultProps} />);
    expect(screen.getByText('Batalha dos Números')).toBeInTheDocument();
  });

  it('has a back button', () => {
    render(<MathBattleGame {...defaultProps} />);
    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<MathBattleGame {...defaultProps} />);
    await user.click(screen.getByText('Voltar'));
    expect(defaultProps.onBack).toHaveBeenCalled();
  });
});
