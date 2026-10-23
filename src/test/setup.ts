import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';

// Polyfill BroadcastChannel if not available in jsdom
if (typeof window !== 'undefined' && !window.BroadcastChannel) {
  class MockBroadcastChannel {
    name: string;
    onmessage: ((event: MessageEvent) => void) | null = null;
    static channels = new Map<string, Set<MockBroadcastChannel>>();

    constructor(name: string) {
      this.name = name;
      if (!MockBroadcastChannel.channels.has(name)) {
        MockBroadcastChannel.channels.set(name, new Set());
      }
      MockBroadcastChannel.channels.get(name)!.add(this);
    }

    postMessage(data: unknown) {
      const peers = MockBroadcastChannel.channels.get(this.name);
      if (!peers) return;
      peers.forEach(peer => {
        if (peer !== this && peer.onmessage) {
          peer.onmessage(new MessageEvent('message', { data }));
        }
      });
    }

    close() {
      const peers = MockBroadcastChannel.channels.get(this.name);
      if (peers) {
        peers.delete(this);
      }
    }
  }

  (window as unknown as { BroadcastChannel: typeof MockBroadcastChannel }).BroadcastChannel = MockBroadcastChannel;
}

// Polyfill window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill AudioContext
class MockAudioContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 440, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {},
      disconnect: () => {},
    };
  }
  createGain() {
    return {
      gain: { value: 1, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
      connect: () => {},
      disconnect: () => {},
    };
  }
  createBufferSource() {
    return {
      buffer: null,
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 1000, setValueAtTime: () => {} },
      connect: () => {},
    };
  }
  resume() {
    return Promise.resolve();
  }
  close() {
    return Promise.resolve();
  }
}

(window as unknown as { AudioContext: typeof MockAudioContext }).AudioContext = MockAudioContext;
(window as unknown as { webkitAudioContext: typeof MockAudioContext }).webkitAudioContext = MockAudioContext;
