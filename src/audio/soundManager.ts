import type { SoundEffectName, BgmTrackName } from '../types/game';

interface SoundConfig {
  file: string;
  defaultGain?: number;
}

const SOUND_FILE_MAP: Record<SoundEffectName, SoundConfig> = {
  strike: { file: '/audio/strike.wav', defaultGain: 1.0 },
  strike3: { file: '/audio/strike3.wav', defaultGain: 1.0 },
  correct: { file: '/audio/correct.wav', defaultGain: 0.9 },
  reveal: { file: '/audio/reveal.wav', defaultGain: 0.85 },
  wrong: { file: '/audio/wrong.wav', defaultGain: 0.85 },
  score_update: { file: '/audio/score_update.wav', defaultGain: 0.75 },
  countdown: { file: '/audio/countdown.wav', defaultGain: 0.65 },
  timer_end: { file: '/audio/timer_end.wav', defaultGain: 1.0 },
  round_win: { file: '/audio/round_win.wav', defaultGain: 0.9 },
  round_start: { file: '/audio/round_start.wav', defaultGain: 0.85 },
  round_transition: { file: '/audio/round_transition.wav', defaultGain: 0.85 },
  steal_success: { file: '/audio/steal_success.wav', defaultGain: 0.9 },
  steal_fail: { file: '/audio/steal_fail.wav', defaultGain: 0.85 },
  fast_money_bell: { file: '/audio/fast_money_bell.wav', defaultGain: 0.9 },
  fast_money_buzz: { file: '/audio/fast_money_buzz.wav', defaultGain: 0.85 },
  intro: { file: '/audio/intro.wav', defaultGain: 0.95 },
  game_win: { file: '/audio/game_win.wav', defaultGain: 1.0 },
  game_over: { file: '/audio/game_over.wav', defaultGain: 0.9 },
  ui_click: { file: '/audio/ui_click.wav', defaultGain: 0.4 },
  ui_hover: { file: '/audio/ui_hover.wav', defaultGain: 0.25 },
  ui_select: { file: '/audio/ui_select.wav', defaultGain: 0.5 },
  ui_start: { file: '/audio/ui_start.wav', defaultGain: 0.8 },
};

const BGM_FILE_MAP: Record<Exclude<BgmTrackName, 'none'>, string> = {
  gameplay: '/audio/bgm_gameplay.wav',
  final: '/audio/bgm_final.wav',
  intro: '/audio/intro.wav',
};

export class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private effectsVolume: number = 0.9;
  private bgmVolume: number = 0.5;
  private effectsEnabled: boolean = true;
  private bgmEnabled: boolean = true;
  private initialized: boolean = false;

  // Audio nodes
  private masterGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;

  // Cached audio buffers
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private loadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();

  // Active BGM state
  private activeBgmSource: AudioBufferSourceNode | null = null;
  private currentBgmTrack: BgmTrackName = 'none';

  // Debounce tracking
  private lastTriggerTimes: Map<string, number> = new Map();

  public init() {
    if (this.initialized && this.ctx && this.ctx.state === 'running') return;

    try {
      if (typeof window === 'undefined') return;

      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioCtxClass) return;

      if (!this.ctx) {
        this.ctx = new AudioCtxClass();
        this.setupAudioGraph();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      this.initialized = true;

      // Preload primary sound effects in the background
      this.preloadCoreSounds();
    } catch (err) {
      console.warn('AudioContext failed to initialize:', err);
    }
  }

  private setupAudioGraph() {
    if (!this.ctx) return;

    this.masterGain = this.ctx.createGain();
    this.effectsGain = this.ctx.createGain();
    this.bgmGain = this.ctx.createGain();

    this.effectsGain.connect(this.masterGain);
    this.bgmGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.updateGainLevels();
  }

  private updateGainLevels() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const effectiveMaster = this.isMuted ? 0 : this.masterVolume;
    const effectiveEffects = this.effectsEnabled ? this.effectsVolume : 0;
    const effectiveBgm = this.bgmEnabled ? this.bgmVolume : 0;

    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(effectiveMaster, now);
    }
    if (this.effectsGain) {
      this.effectsGain.gain.setValueAtTime(effectiveEffects, now);
    }
    if (this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(effectiveBgm, now);
    }
  }

  // Preloads the most frequent game show sounds
  private preloadCoreSounds() {
    const coreList: SoundEffectName[] = [
      'strike',
      'strike3',
      'correct',
      'reveal',
      'wrong',
      'score_update',
      'countdown',
      'round_win',
      'ui_click',
    ];

    coreList.forEach((effect) => {
      const cfg = SOUND_FILE_MAP[effect];
      if (cfg) {
        this.loadAudioBuffer(cfg.file);
      }
    });
  }

  private async loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url)!;
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const loadPromise = (async () => {
      try {
        if (!this.ctx) this.init();
        if (!this.ctx) return null;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} fetching ${url}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const decoded = await this.ctx.decodeAudioData(arrayBuffer);
        this.bufferCache.set(url, decoded);
        return decoded;
      } catch (err) {
        console.warn(`Could not load audio file ${url}, falling back to synthetic generator:`, err);
        return null;
      } finally {
        this.loadingPromises.delete(url);
      }
    })();

    this.loadingPromises.set(url, loadPromise);
    return loadPromise;
  }

  // Volume & Preferences Controls
  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.updateGainLevels();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    this.updateGainLevels();
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  // Alias for backward compatibility
  public setVolume(vol: number) {
    this.setMasterVolume(vol);
  }

  public getVolume(): number {
    return this.getMasterVolume();
  }

  public setEffectsVolume(vol: number) {
    this.effectsVolume = Math.max(0, Math.min(1, vol));
    this.updateGainLevels();
  }

  public getEffectsVolume(): number {
    return this.effectsVolume;
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    this.updateGainLevels();
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public setEffectsEnabled(enabled: boolean) {
    this.effectsEnabled = enabled;
    this.updateGainLevels();
  }

  public getEffectsEnabled(): boolean {
    return this.effectsEnabled;
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    this.updateGainLevels();
    if (!enabled && this.activeBgmSource) {
      this.stopBgm();
    }
  }

  public getBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  // Play a sound effect
  public async play(effect: SoundEffectName) {
    if (this.isMuted || !this.effectsEnabled || this.masterVolume <= 0 || this.effectsVolume <= 0) {
      return;
    }

    // Debounce rapid identical sound triggers within 60ms
    const now = Date.now();
    const lastTime = this.lastTriggerTimes.get(effect) || 0;
    if (now - lastTime < 60) {
      return;
    }
    this.lastTriggerTimes.set(effect, now);

    this.init();
    if (!this.ctx || !this.effectsGain) return;

    const cfg = SOUND_FILE_MAP[effect];
    if (!cfg) return;

    // Try playing pre-rendered WAV asset
    try {
      const buffer = await this.loadAudioBuffer(cfg.file);
      if (buffer && this.ctx && this.effectsGain) {
        const source = this.ctx.createBufferSource();
        const individualGain = this.ctx.createGain();

        individualGain.gain.value = cfg.defaultGain ?? 1.0;
        source.buffer = buffer;
        source.connect(individualGain);
        individualGain.connect(this.effectsGain);

        source.start();
        return;
      }
    } catch {
      // Fallback to procedural synthesis below
    }

    // Procedural synthesis fallback
    this.playSyntheticFallback(effect);
  }

  // Background Music (BGM) Controls
  public async playBgm(track: BgmTrackName) {
    if (track === 'none') {
      this.stopBgm();
      return;
    }

    if (this.currentBgmTrack === track && this.activeBgmSource) {
      return;
    }

    if (this.isMuted || !this.bgmEnabled || this.masterVolume <= 0 || this.bgmVolume <= 0) {
      this.currentBgmTrack = track;
      return;
    }

    this.init();
    if (!this.ctx || !this.bgmGain) return;

    const fileUrl = BGM_FILE_MAP[track];
    if (!fileUrl) return;

    try {
      const buffer = await this.loadAudioBuffer(fileUrl);
      if (!buffer || !this.ctx || !this.bgmGain) return;

      // Smoothly stop existing BGM
      this.stopBgm(0.3);

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(this.bgmGain);

      // Fade in
      const now = this.ctx.currentTime;
      this.bgmGain.gain.setValueAtTime(0, now);
      this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, now + 0.5);

      source.start();
      this.activeBgmSource = source;
      this.currentBgmTrack = track;
    } catch (err) {
      console.warn(`Failed to play BGM track ${track}:`, err);
    }
  }

  public stopBgm(fadeTime = 0.4) {
    if (!this.activeBgmSource) {
      this.currentBgmTrack = 'none';
      return;
    }

    try {
      if (this.ctx && this.bgmGain && fadeTime > 0) {
        const now = this.ctx.currentTime;
        this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
        this.bgmGain.gain.linearRampToValueAtTime(0, now + fadeTime);

        const oldSource = this.activeBgmSource;
        setTimeout(() => {
          try {
            oldSource.stop();
            oldSource.disconnect();
          } catch {}
        }, fadeTime * 1000);
      } else {
        this.activeBgmSource.stop();
        this.activeBgmSource.disconnect();
      }
    } catch {}

    this.activeBgmSource = null;
    this.currentBgmTrack = 'none';
  }

  public getCurrentBgm(): BgmTrackName {
    return this.currentBgmTrack;
  }

  // -------------------------------------------------------------
  // PROCEDURAL SYNTHESIS FALLBACK (Safety net for tests & offline)
  // -------------------------------------------------------------
  private playSyntheticFallback(effect: SoundEffectName) {
    if (!this.ctx || !this.effectsGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      switch (effect) {
        case 'strike':
        case 'strike3':
        case 'wrong':
        case 'timer_end':
        case 'fast_money_buzz':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130, now);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + (effect === 'strike3' ? 0.8 : 0.4));
          osc.connect(gain);
          gain.connect(this.effectsGain);
          osc.start(now);
          osc.stop(now + (effect === 'strike3' ? 0.8 : 0.4));
          break;

        case 'reveal':
        case 'correct':
        case 'fast_money_bell':
        case 'ui_click':
        case 'ui_hover':
        case 'ui_select':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.connect(gain);
          gain.connect(this.effectsGain);
          osc.start(now);
          osc.stop(now + 0.3);
          break;

        default:
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          osc.connect(gain);
          gain.connect(this.effectsGain);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
      }
    } catch {}
  }
}

export const soundManager = new SoundManager();
