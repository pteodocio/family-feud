import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnswerSlotTile } from './AnswerSlotTile';
import type { Answer } from '../../types/game';

describe('AnswerSlotTile Component', () => {
  const mockAnswer: Answer = {
    id: 'ans-1',
    text: 'Lechon',
    points: 42,
    acceptedVariants: ['roast pig'],
    displayOrder: 1,
  };

  it('renders slot index when unrevealed', () => {
    render(
      <AnswerSlotTile
        index={0}
        answer={mockAnswer}
        isRevealed={false}
        totalSlots={4}
      />
    );

    // Number 1 displayed
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders answer text and point value when revealed', () => {
    render(
      <AnswerSlotTile
        index={0}
        answer={mockAnswer}
        isRevealed={true}
        totalSlots={4}
      />
    );

    expect(screen.getByText('Lechon')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
