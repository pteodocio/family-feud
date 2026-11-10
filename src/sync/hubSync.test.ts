import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HubSyncBus } from './hubSync';

describe('HubSyncBus (Multi-Screen Synchronization)', () => {
  let bus: HubSyncBus;

  beforeEach(() => {
    bus = new HubSyncBus('test-hub-channel-' + Math.random().toString(36).substring(2, 6));
  });

  it('registers and triggers state update callbacks', () => {
    const callback = vi.fn();
    const unsub = bus.onStateUpdate(callback);

    const testState = {
      gameId: 'family-trivia',
      phase: 'playing',
      scores: { t1: 10, t2: 20 },
      payload: { questionIndex: 1 },
    };

    bus.handleIncomingMessage({
      type: 'HUB_STATE_UPDATE',
      state: testState,
    });

    expect(callback).toHaveBeenCalledWith(testState);

    unsub();
    bus.handleIncomingMessage({
      type: 'HUB_STATE_UPDATE',
      state: testState,
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('handles canvas stroke and clear events for Pictionary', () => {
    const onStroke = vi.fn();
    const onClear = vi.fn();

    bus.onCanvasStroke(onStroke);
    bus.onCanvasClear(onClear);

    const stroke = {
      x0: 10,
      y0: 20,
      x1: 30,
      y1: 40,
      color: '#ff0000',
      size: 4,
    };

    bus.handleIncomingMessage({
      type: 'CANVAS_STROKE',
      stroke,
    });
    expect(onStroke).toHaveBeenCalledWith(stroke);

    bus.handleIncomingMessage({
      type: 'CANVAS_CLEAR',
    });
    expect(onClear).toHaveBeenCalled();
  });

  it('handles timer updates', () => {
    const onTimer = vi.fn();
    bus.onTimerUpdate(onTimer);

    bus.handleIncomingMessage({
      type: 'TIMER_UPDATE',
      timer: { remaining: 45, running: true },
    });

    expect(onTimer).toHaveBeenCalledWith({ remaining: 45, running: true });
  });
});
