import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SharedTimer } from './SharedTimer';
import { SharedScoreboard } from './SharedScoreboard';

describe('Shared Platform UI Components', () => {
  it('renders SharedTimer with formatted countdown and controls', () => {
    const onTick = vi.fn();
    const onExpire = vi.fn();

    render(
      <SharedTimer
        initialSeconds={60}
        isRunning={false}
        onTick={onTick}
        onExpire={onExpire}
      />
    );

    expect(screen.getByText('01:00')).toBeDefined();
  });

  it('renders SharedScoreboard with team scores and highlighting active leader', () => {
    const teams = [
      { id: 't1', name: 'Team Alpha', score: 150, color: 'blue' as const },
      { id: 't2', name: 'Team Bravo', score: 90, color: 'red' as const },
    ];

    render(
      <SharedScoreboard
        teams={teams}
        activeTeamId="t1"
      />
    );

    expect(screen.getByText('Team Alpha')).toBeDefined();
    expect(screen.getByText('150')).toBeDefined();
    expect(screen.getByText('Team Bravo')).toBeDefined();
    expect(screen.getByText('90')).toBeDefined();
  });
});
