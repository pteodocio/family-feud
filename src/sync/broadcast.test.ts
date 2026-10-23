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
});
