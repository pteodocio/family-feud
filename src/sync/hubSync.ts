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
  | { type: 'CANVAS_CLEAR' }
  | { type: 'TIMER_UPDATE'; timer: { remaining: number; running: boolean } }
  | { type: 'TRIGGER_SOUND'; cue: PartySoundCue }
  | { type: 'REQUEST_SYNC' }
  | { type: 'HEARTBEAT_PING'; timestamp: number }
  | { type: 'HEARTBEAT_PONG'; timestamp: number };

export class HubSyncBus {
  private channelName: string;
  private channel: BroadcastChannel | null = null;
  private onStateUpdateCallbacks: Set<(state: any) => void> = new Set();
  private onCanvasStrokeCallbacks: Set<(stroke: HubCanvasStroke) => void> = new Set();
  private onCanvasClearCallbacks: Set<() => void> = new Set();
  private onTimerCallbacks: Set<(timer: { remaining: number; running: boolean }) => void> = new Set();
  private onSoundCallbacks: Set<(cue: PartySoundCue) => void> = new Set();
  private onRequestSyncCallbacks: Set<() => void> = new Set();

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
        this.onStateUpdateCallbacks.forEach((cb) => cb(msg.state));
        break;
      case 'CANVAS_STROKE':
        this.onCanvasStrokeCallbacks.forEach((cb) => cb(msg.stroke));
        break;
      case 'CANVAS_CLEAR':
        this.onCanvasClearCallbacks.forEach((cb) => cb());
        break;
      case 'TIMER_UPDATE':
        this.onTimerCallbacks.forEach((cb) => cb(msg.timer));
        break;
      case 'TRIGGER_SOUND':
        this.onSoundCallbacks.forEach((cb) => cb(msg.cue));
        break;
      case 'REQUEST_SYNC':
        this.onRequestSyncCallbacks.forEach((cb) => cb());
        break;
    }
  }

  public broadcastState(state: any) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'HUB_STATE_UPDATE', state } as HubSyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast hub state:', err);
      }
    }
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

  public broadcastSound(cue: PartySoundCue) {
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'TRIGGER_SOUND', cue } as HubSyncMessage);
      } catch (err) {
        console.warn('Failed to broadcast sound cue:', err);
      }
    }
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

  public onCanvasClear(cb: () => void): () => void {
    this.onCanvasClearCallbacks.add(cb);
    return () => this.onCanvasClearCallbacks.delete(cb);
  }

  public onTimerUpdate(cb: (timer: { remaining: number; running: boolean }) => void): () => void {
    this.onTimerCallbacks.add(cb);
    return () => this.onTimerCallbacks.delete(cb);
  }

  public onSoundTrigger(cb: (cue: PartySoundCue) => void): () => void {
    this.onSoundCallbacks.add(cb);
    return () => this.onSoundCallbacks.delete(cb);
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
    this.onCanvasClearCallbacks.clear();
    this.onTimerCallbacks.clear();
    this.onSoundCallbacks.clear();
    this.onRequestSyncCallbacks.clear();
  }
}

export const hubSyncBus = new HubSyncBus();
