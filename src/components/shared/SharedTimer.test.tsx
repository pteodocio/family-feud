import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SharedTimer } from './SharedTimer';
import { hubSyncBus } from '../../sync/hubSync';

describe('SharedTimer - Robust Engine & Synchronization Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(hubSyncBus, 'broadcastTimer').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders initial formatted time and controls', () => {
    render(<SharedTimer initialSeconds={60} isRunning={false} />);
    expect(screen.getByText('01:00')).toBeDefined();
    expect(screen.getByTitle('Start Timer')).toBeDefined();
    expect(screen.getByTitle('Reset Timer')).toBeDefined();
  });

  it('calls onToggle when Play/Pause button is clicked in controlled mode', () => {
    const onToggle = vi.fn();
    render(<SharedTimer initialSeconds={30} isRunning={false} onToggle={onToggle} />);

    const playBtn = screen.getByTitle('Start Timer');
    fireEvent.click(playBtn);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onReset and restores initial time when Reset button is clicked in controlled mode', () => {
    const onReset = vi.fn();
    render(
      <SharedTimer initialSeconds={45} isRunning={true} onReset={onReset} />
    );

    // Advance 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const resetBtn = screen.getByTitle('Reset Timer');
    fireEvent.click(resetBtn);

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByText('00:45')).toBeDefined();
  });

  it('resets remaining time back to initialSeconds when resetKey changes even if initialSeconds is unchanged', () => {
    const { rerender } = render(
      <SharedTimer initialSeconds={20} isRunning={true} resetKey={1} />
    );

    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByText('00:13')).toBeDefined();

    // Next round / question with same duration 20s
    rerender(<SharedTimer initialSeconds={20} isRunning={false} resetKey={2} />);
    expect(screen.getByText('00:20')).toBeDefined();
  });

  it('stops at 0, calls onExpire, and does not go negative', () => {
    const onExpire = vi.fn();
    render(<SharedTimer initialSeconds={3} isRunning={true} onExpire={onExpire} />);

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.getByText('00:00')).toBeDefined();
    expect(onExpire).toHaveBeenCalledTimes(1);

    // Further time advance should stay at 0
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('00:00')).toBeDefined();
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('broadcasts timer ticks and status to hubSyncBus when broadcastOnHub is enabled', () => {
    render(<SharedTimer initialSeconds={10} isRunning={true} broadcastOnHub={true} />);

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(hubSyncBus.broadcastTimer).toHaveBeenCalledWith(9, true);
  });

  it('cleans up interval on unmount without memory leaks or ghost ticks', () => {
    const onTick = vi.fn();
    const { unmount } = render(
      <SharedTimer initialSeconds={10} isRunning={true} onTick={onTick} />
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onTick).toHaveBeenCalled();

    const callCount = onTick.mock.calls.length;
    unmount();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    // No more ticks after unmount
    expect(onTick.mock.calls.length).toBe(callCount);
  });
});
