import type { GameSession, SyncMessage, SoundEffectName } from '../types/game';

const CHANNEL_NAME = 'family-feud-sync-v1';

class SyncBus {
  private channel: BroadcastChannel | null = null;
  private onStateUpdateCallbacks: Set<(session: GameSession) => void> = new Set();
  private onSoundCallbacks: Set<(sound: SoundEffectName) => void> = new Set();
  private onRequestSyncCallbacks: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
          this.handleMessage(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization failed:', err);
      }
    }
  }

  private handleMessage(msg: SyncMessage) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'STATE_UPDATE':
        this.onStateUpdateCallbacks.forEach((cb) => cb(msg.state));
        break;
      case 'TRIGGER_SOUND':
        this.onSoundCallbacks.forEach((cb) => cb(msg.sound));
        break;
      case 'REQUEST_SYNC':
        this.onRequestSyncCallbacks.forEach((cb) => cb());
        break;
    }
  }

  public broadcastState(session: GameSession) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'STATE_UPDATE', state: session } as SyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast state:', err);
      }
    }
  }

  public broadcastSound(sound: SoundEffectName) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'TRIGGER_SOUND', sound } as SyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast sound:', err);
      }
    }
  }

  public requestSync() {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'REQUEST_SYNC' } as SyncMessage);
      } catch (err) {
        console.warn('Failed to request sync:', err);
      }
    }
  }

  public subscribeState(callback: (session: GameSession) => void): () => void {
    this.onStateUpdateCallbacks.add(callback);
    return () => this.onStateUpdateCallbacks.delete(callback);
  }

  public subscribeSound(callback: (sound: SoundEffectName) => void): () => void {
    this.onSoundCallbacks.add(callback);
    return () => this.onSoundCallbacks.delete(callback);
  }

  public subscribeRequestSync(callback: () => void): () => void {
    this.onRequestSyncCallbacks.add(callback);
    return () => this.onRequestSyncCallbacks.delete(callback);
  }

  public close() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}

export const syncBus = new SyncBus();
