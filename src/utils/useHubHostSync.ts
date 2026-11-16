import { useEffect, useRef } from 'react';
import { hubSyncBus } from '../sync/hubSync';

/**
 * Broadcasts host state updates to the TV display and responds to late-join
 * REQUEST_SYNC messages with the latest state snapshot.
 */
export function useHubHostSync<T extends { gameId: string }>(state: T | null): void {
  const latestStateRef = useRef<T | null>(state);

  useEffect(() => {
    latestStateRef.current = state;
    if (state) {
      hubSyncBus.broadcastStateUpdate(state);
    }
  }, [state]);

  useEffect(() => {
    const unsub = hubSyncBus.onRequestSync(() => {
      if (latestStateRef.current) {
        hubSyncBus.broadcastStateUpdate(latestStateRef.current);
      }
    });
    return () => unsub();
  }, []);
}
