import type { PartySoundCue } from '../audio/gameSounds';

export interface HubCanvasStroke {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  size: number;
}

export type HubSyncMessage =
  | { type: 'HUB_STATE_UPDATE'; state: any }
  | { type: 'CANVAS_STROKE'; stroke: HubCanvasStroke }
  | { type: 'CANVAS_HISTORY'; strokes: HubCanvasStroke[] }
  | { type: 'CANVAS_CLEAR' }
  | { type: 'TIMER_UPDATE'; timer: { remaining: number; running: boolean } }
  | { type: 'TRIGGER_SOUND'; cue: PartySoundCue }
  | { type: 'REQUEST_SYNC' }
  | { type: 'LIVE_ANNOUNCEMENT'; text: string; durationSeconds: number }
  | { type: 'TV_PULSE'; connected: boolean }
  | { type: 'HEARTBEAT_PING'; timestamp: number }
  | { type: 'HEARTBEAT_PONG'; timestamp: number };

export class HubSyncBus {
  private channelName: string;
  private channel: BroadcastChannel | null = null;
  private lastState: any = null;
  private lastTimer: { remaining: number; running: boolean } | null = null;
  private onStateUpdateCallbacks: Set<(state: any) => void> = new Set();
  private onCanvasStrokeCallbacks: Set<(stroke: HubCanvasStroke) => void> = new Set();
  private onCanvasHistoryCallbacks: Set<(strokes: HubCanvasStroke[]) => void> = new Set();
  private onCanvasClearCallbacks: Set<() => void> = new Set();
  private onTimerCallbacks: Set<(timer: { remaining: number; running: boolean }) => void> = new Set();
  private onSoundCallbacks: Set<(cue: PartySoundCue) => void> = new Set();
  private onRequestSyncCallbacks: Set<() => void> = new Set();
  private onAnnouncementCallbacks: Set<(announcement: { text: string; durationSeconds: number }) => void> = new Set();
  private onTvPulseCallbacks: Set<(pulse: { connected: boolean }) => void> = new Set();

  constructor(channelName: string = 'family-game-hub-sync-v1') {
    this.channelName = channelName;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event: MessageEvent<HubSyncMessage>) => {
          this.handleIncomingMessage(event.data);
        };
      } catch (err) {
        console.warn('Hub BroadcastChannel initialization error:', err);
      }
    }
  }

  public handleIncomingMessage(msg: HubSyncMessage) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'HUB_STATE_UPDATE':
        this.lastState = msg.state;
        try {
          if (msg.state?.gameId && typeof window !== 'undefined') {
            sessionStorage.setItem(`hub_last_state_${msg.state.gameId}`, JSON.stringify(msg.state));
            sessionStorage.setItem('hub_active_game_id', msg.state.gameId);
          }
        } catch {}
        this.onStateUpdateCallbacks.forEach((cb) => cb(msg.state));
        break;

      case 'CANVAS_STROKE':
        this.onCanvasStrokeCallbacks.forEach((cb) => cb(msg.stroke));
        break;

      case 'CANVAS_HISTORY':
        this.onCanvasHistoryCallbacks.forEach((cb) => cb(msg.strokes));
        break;

      case 'CANVAS_CLEAR':
        this.onCanvasClearCallbacks.forEach((cb) => cb());
        break;

      case 'TIMER_UPDATE':
        this.lastTimer = msg.timer;
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('hub_last_timer', JSON.stringify(msg.timer));
          }
        } catch {}
        this.onTimerCallbacks.forEach((cb) => cb(msg.timer));
        break;

      case 'TRIGGER_SOUND':
        this.onSoundCallbacks.forEach((cb) => cb(msg.cue));
        break;

      case 'LIVE_ANNOUNCEMENT':
        this.onAnnouncementCallbacks.forEach((cb) =>
          cb({ text: msg.text, durationSeconds: msg.durationSeconds })
        );
        break;

      case 'TV_PULSE':
        this.onTvPulseCallbacks.forEach((cb) => cb({ connected: msg.connected }));
        break;

      case 'REQUEST_SYNC':
        // Notify host listeners to re-broadcast
        this.onRequestSyncCallbacks.forEach((cb) => cb());
        // Also automatically re-broadcast lastState and lastTimer if host listener hasn't already done so
        if (this.lastState && this.channel) {
          try {
            this.channel.postMessage({
              type: 'HUB_STATE_UPDATE',
              state: this.lastState,
            } as HubSyncMessage);
          } catch {}
        }
        if (this.lastTimer && this.channel) {
          try {
            this.channel.postMessage({
              type: 'TIMER_UPDATE',
              timer: this.lastTimer,
            } as HubSyncMessage);
          } catch {}
        }
        break;
    }
  }

  public broadcastState(state: any) {
    this.lastState = state;
    try {
      if (state?.gameId && typeof window !== 'undefined') {
        sessionStorage.setItem(`hub_last_state_${state.gameId}`, JSON.stringify(state));
        sessionStorage.setItem('hub_active_game_id', state.gameId);
      }
    } catch {}

    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'HUB_STATE_UPDATE', state } as HubSyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast hub state:', err);
      }
    }
  }

  public broadcastStateUpdate(state: any) {
    this.broadcastState(state);
  }

  public getLastState(gameId?: string): any {
    if (this.lastState && (!gameId || this.lastState.gameId === gameId)) {
      return this.lastState;
    }
    if (typeof window !== 'undefined') {
      try {
        const targetId = gameId || sessionStorage.getItem('hub_active_game_id');
        if (targetId) {
          const raw = sessionStorage.getItem(`hub_last_state_${targetId}`);
          if (raw) return JSON.parse(raw);
        }
      } catch {}
    }
    return null;
  }

  public broadcastCanvasStroke(stroke: HubCanvasStroke) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'CANVAS_STROKE', stroke } as HubSyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast stroke:', err);
      }
    }
  }

  public broadcastCanvasHistory(strokes: HubCanvasStroke[]) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'CANVAS_HISTORY', strokes } as HubSyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast canvas history:', err);
      }
    }
  }

  public broadcastCanvasClear() {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'CANVAS_CLEAR' } as HubSyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast canvas clear:', err);
      }
    }
  }

  public broadcastTimer(remaining: number, running: boolean) {
    this.lastTimer = { remaining, running };
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('hub_last_timer', JSON.stringify(this.lastTimer));
      }
    } catch {}

    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'TIMER_UPDATE',
          timer: { remaining, running },
        } as HubSyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast timer update:', err);
      }
    }
  }

  public getLastTimer(): { remaining: number; running: boolean } | null {
    if (this.lastTimer) return this.lastTimer;
    try {
      if (typeof window !== 'undefined') {
        const raw = sessionStorage.getItem('hub_last_timer');
        if (raw) return JSON.parse(raw);
      }
    } catch {}
    return null;
  }

  public broadcastSound(cue: PartySoundCue) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'TRIGGER_SOUND', cue } as HubSyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast sound cue:', err);
      }
    }
  }

  public broadcastSoundTrigger(cue: any) {
    this.broadcastSound(cue);
  }

  public requestSync() {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'REQUEST_SYNC' } as HubSyncMessage);
      } catch (err) {
        console.warn('Failed to request sync:', err);
      }
    }
  }

  public onStateUpdate(cb: (state: any) => void): () => void {
    this.onStateUpdateCallbacks.add(cb);
    return () => this.onStateUpdateCallbacks.delete(cb);
  }

  public onCanvasStroke(cb: (stroke: HubCanvasStroke) => void): () => void {
    this.onCanvasStrokeCallbacks.add(cb);
    return () => this.onCanvasStrokeCallbacks.delete(cb);
  }

  public onCanvasHistory(cb: (strokes: HubCanvasStroke[]) => void): () => void {
    this.onCanvasHistoryCallbacks.add(cb);
    return () => this.onCanvasHistoryCallbacks.delete(cb);
  }

  public onCanvasClear(cb: () => void): () => void {
    this.onCanvasClearCallbacks.add(cb);
    return () => this.onCanvasClearCallbacks.delete(cb);
  }

  public onTimerUpdate(cb: (timer: { remaining: number; running: boolean }) => void): () => void {
    if (this.lastTimer) {
      try {
        cb(this.lastTimer);
      } catch {}
    }
    this.onTimerCallbacks.add(cb);
    return () => this.onTimerCallbacks.delete(cb);
  }

  public onSoundTrigger(cb: (cue: PartySoundCue) => void): () => void {
    this.onSoundCallbacks.add(cb);
    return () => this.onSoundCallbacks.delete(cb);
  }

  public broadcastAnnouncement(text: string, durationSeconds: number = 6): void {
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'LIVE_ANNOUNCEMENT',
          text,
          durationSeconds,
        } as HubSyncMessage);
      } catch {}
    }
  }

  public onAnnouncement(
    cb: (announcement: { text: string; durationSeconds: number }) => void
  ): () => void {
    this.onAnnouncementCallbacks.add(cb);
    return () => this.onAnnouncementCallbacks.delete(cb);
  }

  public broadcastTvPulse(connected: boolean = true): void {
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'TV_PULSE',
          connected,
        } as HubSyncMessage);
      } catch {}
    }
  }

  public onTvPulse(cb: (pulse: { connected: boolean }) => void): () => void {
    this.onTvPulseCallbacks.add(cb);
    return () => this.onTvPulseCallbacks.delete(cb);
  }

  public onRequestSync(cb: () => void): () => void {
    this.onRequestSyncCallbacks.add(cb);
    return () => this.onRequestSyncCallbacks.delete(cb);
  }

  public destroy() {
    if (this.channel) {
      try {
        this.channel.close();
      } catch {}
      this.channel = null;
    }
    this.onStateUpdateCallbacks.clear();
    this.onCanvasStrokeCallbacks.clear();
    this.onCanvasHistoryCallbacks.clear();
    this.onCanvasClearCallbacks.clear();
    this.onTimerCallbacks.clear();
    this.onSoundCallbacks.clear();
    this.onRequestSyncCallbacks.clear();
  }
}

export const hubSyncBus = new HubSyncBus();
