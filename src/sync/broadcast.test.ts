import { describe, it, expect, vi } from 'vitest';
import { syncBus } from './broadcast';
import { GamePhase } from '../types/game';
import type { GameSession } from '../types/game';

describe('BroadcastChannel Synchronization Tests', () => {
  it('broadcasts state updates to subscribers across windows', async () => {
    const mockSession: GameSession = {
      id: 'test-sync-1',
      title: 'Sync Test Game',
      config: {
        roundsCount: 4,
        multipliers: [1, 1, 2, 3],
        targetScore: 300,
        fastMoneyTimer1: 20,
        fastMoneyTimer2: 25,
        fastMoneyTarget: 200,
        faceOffTieRule: 'hostDecision',
      },
      team1: { id: 'team1', name: 'Alpha', score: 50, color: 'blue' },
      team2: { id: 'team2', name: 'Beta', score: 0, color: 'red' },
      phase: GamePhase.REGULAR,
      packId: 'pack-1',
      rounds: [],
      currentRoundIndex: 0,
      fastMoney: null,
      winnerTeamId: null,
      scoreAdjustments: [],
      actionLog: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let receivedSession: GameSession | null = null;
    const unsubscribe = syncBus.subscribeState((session) => {
      receivedSession = session;
    });

    const remoteChannel = new BroadcastChannel('family-feud-sync-v1');
    remoteChannel.postMessage({ type: 'STATE_UPDATE', state: mockSession });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(receivedSession).toEqual(mockSession);
    unsubscribe();
    remoteChannel.close();
  });

  it('broadcasts and receives sound triggers from remote window', async () => {
    const soundSpy = vi.fn();
    const unsub = syncBus.subscribeSound(soundSpy);

    const remoteChannel = new BroadcastChannel('family-feud-sync-v1');
    remoteChannel.postMessage({ type: 'TRIGGER_SOUND', sound: 'strike' });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(soundSpy).toHaveBeenCalledWith('strike');

    unsub();
    remoteChannel.close();
  });

  it('handles sync requests from newly opened display windows', async () => {
    const syncReqSpy = vi.fn();
    const unsub = syncBus.subscribeRequestSync(syncReqSpy);

    const remoteDisplayChannel = new BroadcastChannel('family-feud-sync-v1');
    remoteDisplayChannel.postMessage({ type: 'REQUEST_SYNC' });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(syncReqSpy).toHaveBeenCalled();

    unsub();
    remoteDisplayChannel.close();
  });

  it('broadcasts and receives heartbeat ping and pong', async () => {
    const pingSpy = vi.fn();
    const pongSpy = vi.fn();
    const unsubPing = syncBus.subscribePing(pingSpy);
    const unsubPong = syncBus.subscribePong(pongSpy);

    const remoteChannel = new BroadcastChannel('family-feud-sync-v1');
    remoteChannel.postMessage({ type: 'HEARTBEAT_PING', timestamp: 12345 });
    remoteChannel.postMessage({ type: 'HEARTBEAT_PONG', timestamp: 67890 });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(pingSpy).toHaveBeenCalledWith(12345);
    expect(pongSpy).toHaveBeenCalledWith(67890);

    unsubPing();
    unsubPong();
    remoteChannel.close();
  });

  it('broadcasts and receives fullscreen request and close display command', async () => {
    const fsSpy = vi.fn();
    const closeSpy = vi.fn();
    const unsubFs = syncBus.subscribeRequestFullscreen(fsSpy);
    const unsubClose = syncBus.subscribeCloseDisplay(closeSpy);

    const remoteChannel = new BroadcastChannel('family-feud-sync-v1');
    remoteChannel.postMessage({ type: 'REQUEST_FULLSCREEN' });
    remoteChannel.postMessage({ type: 'CLOSE_DISPLAY' });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(fsSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();

    unsubFs();
    unsubClose();
    remoteChannel.close();
  });

  it('broadcasts and receives timer updates', async () => {
    const timerSpy = vi.fn();
    const unsub = syncBus.subscribeTimer(timerSpy);

    const remoteChannel = new BroadcastChannel('family-feud-sync-v1');
    remoteChannel.postMessage({ type: 'TIMER_UPDATE', remaining: 15, running: true });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(timerSpy).toHaveBeenCalledWith({ remaining: 15, running: true });

    unsub();
    remoteChannel.close();
  });

  it('broadcasts and receives BGM track controls', async () => {
    const bgmSpy = vi.fn();
    const unsub = syncBus.subscribeBgm(bgmSpy);

    const remoteChannel = new BroadcastChannel('family-feud-sync-v1');
    remoteChannel.postMessage({ type: 'TRIGGER_BGM', track: 'gameplay', action: 'play' });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(bgmSpy).toHaveBeenCalledWith({ track: 'gameplay', action: 'play' });

    unsub();
    remoteChannel.close();
  });
});
