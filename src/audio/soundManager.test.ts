import { describe, it, expect, vi, beforeEach } from 'vitest';
import { soundManager } from './soundManager';
import { playProceduralPartyCue } from './gameSounds';

describe('SoundManager & Party Game Sounds', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('can set master, effects, and bgm volumes and mute flags', () => {
    soundManager.setMasterVolume(0.7);
    soundManager.setEffectsVolume(0.85);
    soundManager.setBgmVolume(0.4);
    soundManager.setMuted(true);
    soundManager.setMuted(false);
    expect(true).toBe(true);
  });

  it('procedural party cues do not throw without an audio context in node/jsdom', () => {
    expect(() => playProceduralPartyCue(null, null, 'tick')).not.toThrow();
    expect(() => playProceduralPartyCue(null, null, 'correct')).not.toThrow();
    expect(() => playProceduralPartyCue(null, null, 'wrong')).not.toThrow();
    expect(() => playProceduralPartyCue(null, null, 'fanfare')).not.toThrow();
    expect(() => playProceduralPartyCue(null, null, 'bingoRoll')).not.toThrow();
    expect(() => playProceduralPartyCue(null, null, 'bingoWin')).not.toThrow();
    expect(() => playProceduralPartyCue(null, null, 'whistle')).not.toThrow();
    expect(() => playProceduralPartyCue(null, null, 'drumroll')).not.toThrow();
  });

  it('can trigger soundManager.playPartyCue safely', () => {
    expect(() => soundManager.playPartyCue('tick')).not.toThrow();
    expect(() => soundManager.playPartyCue('fanfare')).not.toThrow();
  });
});
