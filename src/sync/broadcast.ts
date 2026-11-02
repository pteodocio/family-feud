import type { GameSession, SyncMessage, SoundEffectName, BgmTrackName } from '../types/game';

const CHANNEL_NAME = 'family-feud-sync-v1';

class SyncBus {
  private channel: BroadcastChannel | null = null;
  private onStateUpdateCallbacks: Set<(session: GameSession) => void> = new Set();
  private onSoundCallbacks: Set<(sound: SoundEffectName, id?: string, timestamp?: number) => void> = new Set();
  private onBgmCallbacks: Set<(bgm: { track: BgmTrackName; action: 'play' | 'stop' | 'pause' }) => void> = new Set();
  private onRequestSyncCallbacks: Set<() => void> = new Set();
  private onPingCallbacks: Set<(timestamp: number) => void> = new Set();
  private onPongCallbacks: Set<(timestamp: number) => void> = new Set();
  private onRequestFullscreenCallbacks: Set<() => void> = new Set();
  private onCloseDisplayCallbacks: Set<() => void> = new Set();
  private onTimerCallbacks: Set<(timer: { remaining: number; running: boolean }) => void> = new Set();

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
        this.onSoundCallbacks.forEach((cb) => {
          if (msg.id !== undefined && msg.timestamp !== undefined) {
            cb(msg.sound, msg.id, msg.timestamp);
          } else {
            cb(msg.sound);
          }
        });
        break;
      case 'TRIGGER_BGM':
        this.onBgmCallbacks.forEach((cb) => cb({ track: msg.track, action: msg.action }));
        break;
      case 'REQUEST_SYNC':
        this.onRequestSyncCallbacks.forEach((cb) => cb());
        break;
      case 'HEARTBEAT_PING':
        this.onPingCallbacks.forEach((cb) => cb(msg.timestamp));
        break;
      case 'HEARTBEAT_PONG':
        this.onPongCallbacks.forEach((cb) => cb(msg.timestamp));
        break;
      case 'REQUEST_FULLSCREEN':
        this.onRequestFullscreenCallbacks.forEach((cb) => cb());
        break;
      case 'CLOSE_DISPLAY':
        this.onCloseDisplayCallbacks.forEach((cb) => cb());
        break;
      case 'TIMER_UPDATE':
        this.onTimerCallbacks.forEach((cb) => cb({ remaining: msg.remaining, running: msg.running }));
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
        const id = `snd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        this.channel.postMessage({ type: 'TRIGGER_SOUND', sound, id, timestamp: Date.now() } as SyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast sound:', err);
      }
    }
  }

  public broadcastBgm(track: BgmTrackName, action: 'play' | 'stop' | 'pause' = 'play') {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'TRIGGER_BGM', track, action } as SyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast BGM:', err);
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

  public sendPing(timestamp: number = Date.now()) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'HEARTBEAT_PING', timestamp } as SyncMessage);
      } catch (err) {
        console.warn('Failed to send heartbeat ping:', err);
      }
    }
  }

  public sendPong(timestamp: number = Date.now()) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'HEARTBEAT_PONG', timestamp } as SyncMessage);
      } catch (err) {
        console.warn('Failed to send heartbeat pong:', err);
      }
    }
  }

  public requestFullscreen() {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'REQUEST_FULLSCREEN' } as SyncMessage);
      } catch (err) {
        console.warn('Failed to request fullscreen:', err);
      }
    }
  }

  public closeDisplay() {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'CLOSE_DISPLAY' } as SyncMessage);
      } catch (err) {
        console.warn('Failed to send close display command:', err);
      }
    }
  }

  public broadcastTimer(remaining: number, running: boolean) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'TIMER_UPDATE', remaining, running } as SyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast timer update:', err);
      }
    }
  }

  public subscribeState(callback: (session: GameSession) => void): () => void {
    this.onStateUpdateCallbacks.add(callback);
    return () => this.onStateUpdateCallbacks.delete(callback);
  }

  public subscribeSound(callback: (sound: SoundEffectName, id?: string, timestamp?: number) => void): () => void {
    this.onSoundCallbacks.add(callback);
    return () => this.onSoundCallbacks.delete(callback);
  }

  public subscribeBgm(callback: (bgm: { track: BgmTrackName; action: 'play' | 'stop' | 'pause' }) => void): () => void {
    this.onBgmCallbacks.add(callback);
    return () => this.onBgmCallbacks.delete(callback);
  }

  public subscribeRequestSync(callback: () => void): () => void {
    this.onRequestSyncCallbacks.add(callback);
    return () => this.onRequestSyncCallbacks.delete(callback);
  }

  public subscribePing(callback: (timestamp: number) => void): () => void {
    this.onPingCallbacks.add(callback);
    return () => this.onPingCallbacks.delete(callback);
  }

  public subscribePong(callback: (timestamp: number) => void): () => void {
    this.onPongCallbacks.add(callback);
    return () => this.onPongCallbacks.delete(callback);
  }

  public subscribeRequestFullscreen(callback: () => void): () => void {
    this.onRequestFullscreenCallbacks.add(callback);
    return () => this.onRequestFullscreenCallbacks.delete(callback);
  }

  public subscribeCloseDisplay(callback: () => void): () => void {
    this.onCloseDisplayCallbacks.add(callback);
    return () => this.onCloseDisplayCallbacks.delete(callback);
  }

  public subscribeTimer(callback: (timer: { remaining: number; running: boolean }) => void): () => void {
    this.onTimerCallbacks.add(callback);
    return () => this.onTimerCallbacks.delete(callback);
  }

  public close() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}

export const syncBus = new SyncBus();
