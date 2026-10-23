import type { SoundEffectName } from '../types/game';

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private initialized: boolean = false;

  public init() {
    if (this.initialized && this.ctx && this.ctx.state === 'running') return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        if (!this.ctx) {
          this.ctx = new AudioCtxClass();
        }
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.initialized = true;
      }
    } catch (err) {
      console.warn('AudioContext failed to initialize:', err);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public play(effect: SoundEffectName) {
    if (this.isMuted || this.volume <= 0) return;
    this.init();
    if (!this.ctx) return;

    try {
      switch (effect) {
        case 'reveal':
          this.playRevealSound();
          break;
        case 'correct':
          this.playCorrectChime();
          break;
        case 'strike':
          this.playStrikeBuzzer(false);
          break;
        case 'strike3':
          this.playStrikeBuzzer(true);
          break;
        case 'countdown':
          this.playTick();
          break;
        case 'round_win':
          this.playRoundWin();
          break;
        case 'steal_success':
          this.playStealSuccess();
          break;
        case 'steal_fail':
          this.playStealFail();
          break;
        case 'fast_money_bell':
          this.playBell();
          break;
        case 'fast_money_buzz':
          this.playZeroBuzz();
          break;
        case 'intro':
          this.playIntroFanfare();
          break;
        case 'game_win':
          this.playVictoryFanfare();
          break;
      }
    } catch (e) {
      console.warn(`Failed to play sound "${effect}":`, e);
    }
  }

  // Answer card flip / reveal click
  private playRevealSound() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.3 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Correct answer bell/ding
  private playCorrectChime() {
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.4 * this.volume, this.ctx!.currentTime + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.05 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.05);
      osc.stop(this.ctx!.currentTime + idx * 0.05 + 0.6);
    });
  }

  // Strike buzzer sound
  private playStrikeBuzzer(isTriple: boolean) {
    if (!this.ctx) return;
    const count = isTriple ? 2 : 1;

    for (let i = 0; i < count; i++) {
      const startTime = this.ctx.currentTime + i * 0.35;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(125, startTime);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(132, startTime); // dissonant low beat

      gain.gain.setValueAtTime(0.6 * this.volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(startTime);
      osc1.stop(startTime + 0.3);
      osc2.start(startTime);
      osc2.stop(startTime + 0.3);
    }
  }

  // Timer tick
  private playTick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Single bell (Fast Money survey points reveal)
  private playBell() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5

    gain.gain.setValueAtTime(0.5 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  // Zero points blip buzz
  private playZeroBuzz() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.4 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Steal success fanfare
  private playStealSuccess() {
    if (!this.ctx) return;
    const chords = [
      [523.25, 659.25], // C5, E5
      [587.33, 698.46], // D5, F5
      [659.25, 783.99], // E5, G5
      [783.99, 1046.5], // G5, C6
    ];

    chords.forEach((chord, i) => {
      const time = this.ctx!.currentTime + i * 0.12;
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.35 * this.volume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(time);
        osc.stop(time + 0.3);
      });
    });
  }

  // Steal fail sad slide
  private playStealFail() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(130, this.ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.4 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  // Round Win fanfare
  private playRoundWin() {
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      const time = this.ctx!.currentTime + idx * 0.14;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.4 * this.volume, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(time);
      osc.stop(time + 0.5);
    });
  }

  // Intro fanfare
  private playIntroFanfare() {
    if (!this.ctx) return;
    const melody = [
      { f: 392, d: 0.15 }, // G4
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.35 }, // G5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.5 }, // G5
    ];

    let curr = this.ctx.currentTime;
    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, curr);

      gain.gain.setValueAtTime(0.45 * this.volume, curr);
      gain.gain.exponentialRampToValueAtTime(0.01, curr + note.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(curr);
      osc.stop(curr + note.d);

      curr += note.d * 0.85;
    });
  }

  // Game Victory Celebration
  private playVictoryFanfare() {
    if (!this.ctx) return;
    const sequence = [
      { f: 523.25, t: 0.0, d: 0.2 },
      { f: 659.25, t: 0.2, d: 0.2 },
      { f: 783.99, t: 0.4, d: 0.2 },
      { f: 1046.5, t: 0.6, d: 0.6 },
      { f: 880.0, t: 1.2, d: 0.25 },
      { f: 1046.5, t: 1.45, d: 0.8 },
    ];

    sequence.forEach(({ f, t, d }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      const startTime = this.ctx!.currentTime + t;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.5 * this.volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + d);
    });
  }
}

export const soundManager = new SoundManager();
