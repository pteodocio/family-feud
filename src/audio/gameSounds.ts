export type PartySoundCue =
  | 'correct'
  | 'wrong'
  | 'tick'
  | 'fanfare'
  | 'bingoRoll'
  | 'bingoWin'
  | 'whistle'
  | 'drumroll';

/**
 * Synthesizes procedural Web Audio sound cues for party games.
 * Fallback-safe: functions return quietly if AudioContext or Destination is null.
 */
export function playProceduralPartyCue(
  ctx: AudioContext | null,
  destination: AudioNode | null,
  cue: PartySoundCue
): void {
  if (!ctx || !destination) return;

  try {
    const now = ctx.currentTime;

    switch (cue) {
      case 'tick': {
        // Crisp woodblock click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'correct': {
        // Bright upward 3-tone chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + i * 0.09;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.4, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
          osc.connect(gain);
          gain.connect(destination);
          osc.start(start);
          osc.stop(start + 0.25);
        });
        break;
      }

      case 'wrong': {
        // Low dissonant buzzer
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(130, now);
        osc2.frequency.setValueAtTime(138, now); // dissonance
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
        break;
      }

      case 'fanfare':
      case 'bingoWin': {
        // Grand celebratory fanfare: C4, G4, C5, E5, G5 sustained
        const chords = [
          { f: 261.63, d: 0.12, o: 0 },
          { f: 392.0, d: 0.12, o: 0.12 },
          { f: 523.25, d: 0.14, o: 0.24 },
          { f: 659.25, d: 0.14, o: 0.38 },
          { f: 783.99, d: 0.5, o: 0.52 },
        ];
        chords.forEach(({ f, d, o }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + o;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.3, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + d);
          osc.connect(gain);
          gain.connect(destination);
          osc.start(start);
          osc.stop(start + d);
        });
        break;
      }

      case 'bingoRoll': {
        // Tumbling ball click sequence
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + i * 0.05;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800 - i * 80, start);
          gain.gain.setValueAtTime(0.2, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.03);
          osc.connect(gain);
          gain.connect(destination);
          osc.start(start);
          osc.stop(start + 0.03);
        }
        break;
      }

      case 'whistle': {
        // Double whistle blast
        [0, 0.15].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + offset;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2200, start);
          osc.frequency.linearRampToValueAtTime(2600, start + 0.08);
          gain.gain.setValueAtTime(0.4, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
          osc.connect(gain);
          gain.connect(destination);
          osc.start(start);
          osc.stop(start + 0.12);
        });
        break;
      }

      case 'drumroll': {
        // Rapid snare-style noise pulses
        for (let i = 0; i < 8; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + i * 0.04;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180 + (i % 2) * 40, start);
          gain.gain.setValueAtTime(0.15 + (i / 8) * 0.2, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.03);
          osc.connect(gain);
          gain.connect(destination);
          osc.start(start);
          osc.stop(start + 0.03);
        }
        break;
      }
    }
  } catch (err) {
    console.warn('Error playing procedural party cue:', err);
  }
}
