const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// -------------------------------------------------------------
// WAV ENCODER UTILITY (16-bit PCM Stereo)
// -------------------------------------------------------------
function encodeWav(left, right = null, sampleRate = SAMPLE_RATE) {
  const numChannels = right ? 2 : 1;
  const numSamples = left.length;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = numSamples * numChannels * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Clamp to -1.0 .. +1.0
    let sL = Math.max(-1.0, Math.min(1.0, left[i]));
    let intSampleL = sL < 0 ? Math.round(sL * 32768) : Math.round(sL * 32767);
    buffer.writeInt16LE(intSampleL, offset);
    offset += 2;

    if (numChannels === 2) {
      let sR = Math.max(-1.0, Math.min(1.0, right[i]));
      let intSampleR = sR < 0 ? Math.round(sR * 32768) : Math.round(sR * 32767);
      buffer.writeInt16LE(intSampleR, offset);
      offset += 2;
    }
  }

  return buffer;
}

// -------------------------------------------------------------
// DSP FILTER & REVERB HELPERS
// -------------------------------------------------------------
function softClip(x) {
  return Math.tanh(x * 1.25);
}

// Simple Schroeder Reverb
function applyReverb(samples, wet = 0.3, roomSize = 0.7) {
  const delays = [1116, 1188, 1277, 1356].map(d => Math.floor(d * (SAMPLE_RATE / 44100)));
  const combBuffers = delays.map(d => new Float32Array(d));
  const combIndices = new Array(delays.length).fill(0);
  const out = new Float32Array(samples.length);

  for (let i = 0; i < samples.length; i++) {
    let combSum = 0;
    for (let c = 0; c < delays.length; c++) {
      const idx = combIndices[c];
      const buf = combBuffers[c];
      const delayed = buf[idx];
      buf[idx] = samples[i] + delayed * (roomSize * 0.85);
      combIndices[c] = (idx + 1) % delays[c];
      combSum += delayed;
    }
    out[i] = samples[i] * (1 - wet) + (combSum * 0.25) * wet;
  }
  return out;
}

// Biquad Bandpass Filter
function bandpassFilter(samples, centerFreq, q = 2.0) {
  const w0 = (2 * Math.PI * centerFreq) / SAMPLE_RATE;
  const alpha = Math.sin(w0) / (2 * q);
  const b0 = alpha;
  const b1 = 0;
  const b2 = -alpha;
  const a0 = 1 + alpha;
  const a1 = -2 * Math.cos(w0);
  const a2 = 1 - alpha;

  const out = new Float32Array(samples.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

  for (let i = 0; i < samples.length; i++) {
    const x = samples[i];
    const y = (b0 / a0) * x + (b1 / a0) * x1 + (b2 / a0) * x2 - (a1 / a0) * y1 - (a2 / a0) * y2;
    x2 = x1; x1 = x;
    y2 = y1; y1 = y;
    out[i] = y;
  }
  return out;
}

// Biquad Lowpass Filter
function lowpassFilter(samples, cutoff) {
  const w0 = (2 * Math.PI * cutoff) / SAMPLE_RATE;
  const cosw0 = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * 0.707);
  const b0 = (1 - cosw0) / 2;
  const b1 = 1 - cosw0;
  const b2 = (1 - cosw0) / 2;
  const a0 = 1 + alpha;
  const a1 = -2 * cosw0;
  const a2 = 1 - alpha;

  const out = new Float32Array(samples.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

  for (let i = 0; i < samples.length; i++) {
    const x = samples[i];
    const y = (b0 / a0) * x + (b1 / a0) * x1 + (b2 / a0) * x2 - (a1 / a0) * y1 - (a2 / a0) * y2;
    x2 = x1; x1 = x;
    y2 = y1; y1 = y;
    out[i] = y;
  }
  return out;
}

// Crowd Clapping & Cheering Generator
function generateCrowd(durationSeconds, cheerIntensity = 0.5) {
  const length = Math.floor(durationSeconds * SAMPLE_RATE);
  const output = new Float32Array(length);

  // Claps: 120 asynchronous clappers
  const numClappers = 80;
  for (let c = 0; c < numClappers; c++) {
    const clapRate = 2.5 + Math.random() * 2.2; // claps per second
    const interval = Math.floor(SAMPLE_RATE / clapRate);
    let nextClap = Math.floor(Math.random() * interval * 0.5);

    while (nextClap < length) {
      // Individual hand clap is a micro-burst of filtered noise (15ms)
      const clapLen = Math.floor(0.018 * SAMPLE_RATE);
      const amp = (0.2 + Math.random() * 0.3) / Math.sqrt(numClappers);
      for (let j = 0; j < clapLen && nextClap + j < length; j++) {
        const decay = Math.exp(-j / (0.005 * SAMPLE_RATE));
        const noise = (Math.random() * 2 - 1);
        output[nextClap + j] += noise * decay * amp;
      }
      nextClap += interval + Math.floor((Math.random() - 0.5) * interval * 0.35);
    }
  }

  // Cheering formants: filtered noise with vocal formant peaks (~700Hz, 1200Hz, 2400Hz)
  if (cheerIntensity > 0) {
    const cheerNoise = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      cheerNoise[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const f1 = bandpassFilter(cheerNoise, 650, 2.5);
    const f2 = bandpassFilter(cheerNoise, 1200, 3.0);
    const f3 = bandpassFilter(cheerNoise, 2200, 2.8);

    for (let i = 0; i < length; i++) {
      const envelope = Math.sin(Math.min(Math.PI, (i / length) * Math.PI));
      const cheer = (f1[i] * 0.4 + f2[i] * 0.35 + f3[i] * 0.25) * cheerIntensity * envelope;
      output[i] += cheer;
    }
  }

  return applyReverb(output, 0.45, 0.8);
}

// -------------------------------------------------------------
// SOUND GENERATORS
// -------------------------------------------------------------

// 1. Strike Buzzer (Authentic Game Show Dual-Reed Buzzer)
function generateStrikeBuzzer(isTriple = false) {
  const duration = isTriple ? 1.1 : 0.65;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  const bursts = isTriple ? [0, 0.4] : [0];
  const burstDuration = isTriple ? 0.32 : 0.55;

  bursts.forEach(startSec => {
    const startIdx = Math.floor(startSec * SAMPLE_RATE);
    const burstLen = Math.floor(burstDuration * SAMPLE_RATE);

    for (let i = 0; i < burstLen && startIdx + i < length; i++) {
      const t = i / SAMPLE_RATE;
      // Dissonant dual square/saw fundamentals: ~124 Hz and ~131 Hz
      let val = 0;
      for (let h = 1; h <= 15; h += 2) {
        const weight = 1 / Math.sqrt(h);
        val += Math.sin(2 * Math.PI * 124.5 * h * t) * weight * 0.4;
        val += Math.sin(2 * Math.PI * 131.2 * h * t) * weight * 0.4;
        val += Math.sin(2 * Math.PI * 62.2 * h * t) * weight * 0.15; // low rumble
      }

      // Hard attack, constant sustain, fast release
      let env = 1.0;
      if (t < 0.015) env = t / 0.015;
      else if (t > burstDuration - 0.04) env = (burstDuration - t) / 0.04;

      // Heavy analog saturation
      samples[startIdx + i] += softClip(val * env * 1.6) * 0.85;
    }
  });

  // Low punch sub-thump for 3rd strike
  if (isTriple) {
    for (let i = 0; i < Math.min(length, SAMPLE_RATE * 0.4); i++) {
      const t = i / SAMPLE_RATE;
      const sub = Math.sin(2 * Math.PI * 65 * Math.exp(-t * 4) * t) * Math.exp(-t * 6);
      samples[i] += sub * 0.5;
    }
  }

  // Bandpass through horn speaker characteristics
  const horn = bandpassFilter(samples, 1100, 1.2);
  const blended = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    blended[i] = softClip(samples[i] * 0.65 + horn[i] * 0.45);
  }

  return applyReverb(blended, 0.28, 0.65);
}

// 2. Correct Answer Ding (Orchestral Chime / Bell Chord)
function generateCorrectChime() {
  const duration = 1.6;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  // C6, E6, G6, C7 arpeggiated chime
  const notes = [
    { freq: 1046.50, delay: 0.00, weight: 0.35 },
    { freq: 1318.51, delay: 0.04, weight: 0.35 },
    { freq: 1567.98, delay: 0.08, weight: 0.35 },
    { freq: 2093.00, delay: 0.12, weight: 0.45 },
  ];

  notes.forEach(({ freq, delay, weight }) => {
    const startIdx = Math.floor(delay * SAMPLE_RATE);
    for (let i = startIdx; i < length; i++) {
      const t = (i - startIdx) / SAMPLE_RATE;
      const decay = Math.exp(-t * 3.2);

      // Bell partials (fundamental + metallic overtones)
      let bell = Math.sin(2 * Math.PI * freq * t) * 0.6;
      bell += Math.sin(2 * Math.PI * freq * 2.76 * t) * 0.25;
      bell += Math.sin(2 * Math.PI * freq * 5.40 * t) * 0.15;

      samples[i] += bell * decay * weight;
    }
  });

  return applyReverb(samples, 0.35, 0.75);
}

// 3. Answer Reveal (Satisfying mechanical card flip + chime)
function generateRevealSound() {
  const duration = 0.55;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  // Part 1: Fast mechanical whir / card flip snap (0.0s - 0.1s)
  const clickCount = 5;
  for (let c = 0; c < clickCount; c++) {
    const clickPos = Math.floor((c * 0.015) * SAMPLE_RATE);
    for (let j = 0; j < 300 && clickPos + j < length; j++) {
      const decay = Math.exp(-j / 40);
      samples[clickPos + j] += (Math.random() * 2 - 1) * decay * 0.35;
    }
  }

  // Part 2: Bright rising stinger tone
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const f = 450 + 600 * Math.sin(Math.min(1, t / 0.15) * (Math.PI / 2));
    const decay = Math.exp(-t * 6.5);
    const chime = Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2 * t);
    samples[i] += chime * decay * 0.45;
  }

  return applyReverb(samples, 0.25, 0.6);
}

// 4. Wrong Answer Buzz (Short game-show negative buzz)
function generateWrongBuzz() {
  const duration = 0.45;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const f = 160 - 45 * t; // falling buzz
    let buzz = 0;
    for (let h = 1; h <= 9; h++) {
      buzz += Math.sin(2 * Math.PI * f * h * t) / h;
    }
    const env = t < 0.02 ? t / 0.02 : Math.exp(-t * 4.5);
    samples[i] = softClip(buzz * env * 1.5) * 0.65;
  }
  return applyReverb(samples, 0.2, 0.5);
}

// 5. Score Update Counter (Rapid mechanical point roll)
function generateScoreUpdate() {
  const duration = 0.65;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  // 8 fast ratchet ticks
  const ticks = 8;
  for (let k = 0; k < ticks; k++) {
    const pos = Math.floor((k * 0.055) * SAMPLE_RATE);
    const f = 1200 + k * 80;
    for (let j = 0; j < 600 && pos + j < length; j++) {
      const t = j / SAMPLE_RATE;
      const decay = Math.exp(-t * 120);
      samples[pos + j] += Math.sin(2 * Math.PI * f * t) * decay * 0.45;
    }
  }

  // Finishing ding
  const finishPos = Math.floor(0.45 * SAMPLE_RATE);
  for (let j = 0; j < length - finishPos; j++) {
    const t = j / SAMPLE_RATE;
    const decay = Math.exp(-t * 8);
    samples[finishPos + j] += Math.sin(2 * Math.PI * 1760 * t) * decay * 0.4;
  }

  return applyReverb(samples, 0.25, 0.5);
}

// 6. Countdown Tick (Crisp TV studio woodblock)
function generateCountdownTick() {
  const duration = 0.12;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const f = 920 * Math.exp(-t * 25);
    const decay = Math.exp(-t * 45);
    const click = Math.sin(2 * Math.PI * f * t) + 0.3 * (Math.random() * 2 - 1);
    samples[i] = click * decay * 0.5;
  }

  return applyReverb(samples, 0.15, 0.4);
}

// 7. Timer End Horn (Dramatic Klaxon)
function generateTimerEnd() {
  const duration = 1.0;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    let horn = Math.sin(2 * Math.PI * 220 * t) * 0.5;
    horn += Math.sin(2 * Math.PI * 277.18 * t) * 0.4; // C#4
    horn += Math.sin(2 * Math.PI * 440 * t) * 0.3;
    const env = t < 0.04 ? t / 0.04 : Math.exp(-t * 2.2);
    samples[i] = softClip(horn * env * 1.5) * 0.75;
  }
  return applyReverb(samples, 0.35, 0.7);
}

// 8. Round Win & Steal Success Fanfares
function generateRoundWin(isSteal = false) {
  const duration = 2.4;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  // Brass sequence: C5, E5, G5, C6 triumph
  const sequence = [
    { freq: 523.25, t: 0.00, d: 0.18 },
    { freq: 659.25, t: 0.18, d: 0.18 },
    { freq: 783.99, t: 0.36, d: 0.22 },
    { freq: 1046.50, t: 0.58, d: 0.85 },
  ];

  sequence.forEach(({ freq, t, d }) => {
    const start = Math.floor(t * SAMPLE_RATE);
    const len = Math.floor(d * SAMPLE_RATE);
    for (let i = 0; i < len && start + i < length; i++) {
      const curT = i / SAMPLE_RATE;
      // Brass rich harmonics
      let brass = Math.sin(2 * Math.PI * freq * curT) * 0.5;
      brass += Math.sin(2 * Math.PI * freq * 2 * curT) * 0.35;
      brass += Math.sin(2 * Math.PI * freq * 3 * curT) * 0.2;
      brass += Math.sin(2 * Math.PI * freq * 4 * curT) * 0.1;

      const env = curT < 0.03 ? curT / 0.03 : Math.exp(-curT * (1.8 / d));
      samples[start + i] += softClip(brass * env * 1.4) * 0.55;
    }
  });

  // Layer energetic crowd applause
  const crowd = generateCrowd(duration, isSteal ? 0.6 : 0.45);
  for (let i = 0; i < length; i++) {
    samples[i] = samples[i] * 0.75 + crowd[i] * 0.45;
  }

  return applyReverb(samples, 0.3, 0.7);
}

// 9. Steal Fail (Sad slide trombone / comic drop)
function generateStealFail() {
  const duration = 1.3;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    // Descending sliding trombone from 240Hz down to 105Hz with vibrato
    const vibrato = Math.sin(2 * Math.PI * 5.5 * t) * 8 * Math.min(1, t / 0.3);
    const f = Math.max(90, 240 - 120 * (t / 1.1) + vibrato);

    let trombone = Math.sin(2 * Math.PI * f * t) * 0.5;
    trombone += Math.sin(2 * Math.PI * f * 2 * t) * 0.35;
    trombone += Math.sin(2 * Math.PI * f * 3 * t) * 0.2;

    const env = t < 0.05 ? t / 0.05 : Math.exp(-t * 2.0);
    samples[i] = softClip(trombone * env * 1.3) * 0.6;
  }

  return applyReverb(samples, 0.28, 0.6);
}

// 10. Fast Money Single Bell & Zero Buzz
function generateFastMoneyBell() {
  const duration = 0.9;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const f = 1760; // A6
    const decay = Math.exp(-t * 4.2);
    let bell = Math.sin(2 * Math.PI * f * t) * 0.6;
    bell += Math.sin(2 * Math.PI * f * 2.4 * t) * 0.25;
    samples[i] = bell * decay * 0.6;
  }
  return applyReverb(samples, 0.3, 0.65);
}

function generateFastMoneyBuzz() {
  const duration = 0.45;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const buzz = Math.sin(2 * Math.PI * 115 * t) + 0.5 * Math.sin(2 * Math.PI * 230 * t);
    const env = t < 0.02 ? t / 0.02 : Math.exp(-t * 5.5);
    samples[i] = softClip(buzz * env * 1.5) * 0.6;
  }
  return applyReverb(samples, 0.2, 0.5);
}

// 11. Exciting TV Intro Theme Fanfare
function generateIntroTheme() {
  const duration = 4.2;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  // Timpani roll start
  for (let i = 0; i < Math.floor(0.8 * SAMPLE_RATE); i++) {
    const t = i / SAMPLE_RATE;
    const rollSpeed = 12 + t * 14;
    const hit = Math.sin(2 * Math.PI * rollSpeed * t);
    const drum = Math.sin(2 * Math.PI * 85 * t) * (hit > 0.6 ? 1 : 0);
    samples[i] += drum * (t / 0.8) * 0.35;
  }

  // Brass Fanfare Motif: G4, C5, E5, G5, F5, G5, high C6 grand hold
  const fanfare = [
    { freq: 392.00, t: 0.6, d: 0.22 },
    { freq: 523.25, t: 0.85, d: 0.22 },
    { freq: 659.25, t: 1.10, d: 0.22 },
    { freq: 783.99, t: 1.35, d: 0.45 },
    { freq: 698.46, t: 1.85, d: 0.22 },
    { freq: 783.99, t: 2.10, d: 0.35 },
    { freq: 1046.50, t: 2.50, d: 1.40 }, // High triumphant hold
  ];

  fanfare.forEach(({ freq, t, d }) => {
    const start = Math.floor(t * SAMPLE_RATE);
    const len = Math.floor(d * SAMPLE_RATE);
    for (let i = 0; i < len && start + i < length; i++) {
      const curT = i / SAMPLE_RATE;
      let brass = Math.sin(2 * Math.PI * freq * curT) * 0.55;
      brass += Math.sin(2 * Math.PI * freq * 2 * curT) * 0.35;
      brass += Math.sin(2 * Math.PI * freq * 3 * curT) * 0.2;
      brass += Math.sin(2 * Math.PI * (freq * 0.5) * curT) * 0.15; // lower octave warmth

      const env = curT < 0.04 ? curT / 0.04 : Math.exp(-curT * (1.5 / d));
      samples[start + i] += softClip(brass * env * 1.35) * 0.6;
    }
  });

  // Layer enthusiastic crowd cheering & applause starting at 1.8s
  const crowd = generateCrowd(duration - 1.2, 0.65);
  const crowdStart = Math.floor(1.2 * SAMPLE_RATE);
  for (let i = 0; i < crowd.length && crowdStart + i < length; i++) {
    samples[crowdStart + i] += crowd[i] * 0.45;
  }

  return applyReverb(samples, 0.35, 0.8);
}

// 12. Victory Celebration (Grand Winning Music)
function generateVictoryCelebration() {
  const duration = 4.5;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  // Grand fanfare melody
  const chords = [
    { freq: 523.25, t: 0.0, d: 0.35 },
    { freq: 659.25, t: 0.35, d: 0.35 },
    { freq: 783.99, t: 0.70, d: 0.35 },
    { freq: 1046.50, t: 1.05, d: 0.90 },
    { freq: 880.00, t: 2.00, d: 0.40 },
    { freq: 1046.50, t: 2.45, d: 1.80 },
  ];

  chords.forEach(({ freq, t, d }) => {
    const start = Math.floor(t * SAMPLE_RATE);
    const len = Math.floor(d * SAMPLE_RATE);
    for (let i = 0; i < len && start + i < length; i++) {
      const curT = i / SAMPLE_RATE;
      let brass = Math.sin(2 * Math.PI * freq * curT) * 0.5;
      brass += Math.sin(2 * Math.PI * freq * 2 * curT) * 0.35;
      brass += Math.sin(2 * Math.PI * freq * 3 * curT) * 0.2;
      const env = curT < 0.04 ? curT / 0.04 : Math.exp(-curT * (1.4 / d));
      samples[start + i] += softClip(brass * env * 1.3) * 0.55;
    }
  });

  // Roaring celebration crowd applause and cheering
  const crowd = generateCrowd(duration, 0.75);
  for (let i = 0; i < length; i++) {
    samples[i] = samples[i] * 0.7 + crowd[i] * 0.55;
  }

  return applyReverb(samples, 0.35, 0.8);
}

// 13. Game Over Dramatic Ending
function generateGameOver() {
  const duration = 2.0;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);

  const notes = [
    { freq: 392.00, t: 0.0, d: 0.3 },
    { freq: 349.23, t: 0.3, d: 0.3 },
    { freq: 329.63, t: 0.6, d: 0.3 },
    { freq: 261.63, t: 0.9, d: 1.0 },
  ];

  notes.forEach(({ freq, t, d }) => {
    const start = Math.floor(t * SAMPLE_RATE);
    const len = Math.floor(d * SAMPLE_RATE);
    for (let i = 0; i < len && start + i < length; i++) {
      const curT = i / SAMPLE_RATE;
      let tone = Math.sin(2 * Math.PI * freq * curT) * 0.5 + 0.3 * Math.sin(2 * Math.PI * freq * 2 * curT);
      const env = curT < 0.03 ? curT / 0.03 : Math.exp(-curT * (1.8 / d));
      samples[start + i] += tone * env * 0.55;
    }
  });

  return applyReverb(samples, 0.35, 0.7);
}

// 14. Subtle, Suspenseful Gameplay Background Music (Loopable)
function generateGameplayBGM() {
  const duration = 8.0; // 8 seconds, 4 bars at 120 BPM
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);
  const bpm = 120;
  const beatSec = 60 / bpm; // 0.5s per beat

  // Pulsing electric bassline (root C2 -> Bb1 -> F1 -> G1)
  const bassNotes = [65.41, 65.41, 58.27, 58.27, 43.65, 43.65, 49.00, 49.00]; // 8 beats
  bassNotes.forEach((f, idx) => {
    const start = Math.floor(idx * beatSec * SAMPLE_RATE);
    const beatLen = Math.floor(beatSec * 0.85 * SAMPLE_RATE);
    for (let i = 0; i < beatLen && start + i < length; i++) {
      const t = i / SAMPLE_RATE;
      const decay = Math.exp(-t * 3.5);
      const bass = Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t);
      samples[start + i] += softClip(bass * decay * 0.38);
    }
  });

  // Soft tension shaker / hi-hat every eighth note
  const eighthSec = beatSec / 2;
  const totalEighths = Math.floor(duration / eighthSec);
  for (let k = 0; k < totalEighths; k++) {
    const pos = Math.floor(k * eighthSec * SAMPLE_RATE);
    for (let j = 0; j < 350 && pos + j < length; j++) {
      const t = j / SAMPLE_RATE;
      const decay = Math.exp(-t * 90);
      samples[pos + j] += (Math.random() * 2 - 1) * decay * 0.08;
    }
  }

  // Warm Rhodes electric piano tension chords (Cmin7, Bbmaj, Fsus2, Gsus4)
  const chords = [
    { notes: [261.63, 311.13, 392.00, 466.16], t: 0.0 }, // Cmin7
    { notes: [233.08, 293.66, 349.23, 440.00], t: 2.0 }, // Bb
    { notes: [174.61, 261.63, 349.23, 392.00], t: 4.0 }, // Fsus2
    { notes: [196.00, 261.63, 293.66, 392.00], t: 6.0 }, // Gsus4
  ];

  chords.forEach(({ notes, t }) => {
    const start = Math.floor(t * SAMPLE_RATE);
    const chordLen = Math.floor(1.9 * SAMPLE_RATE);
    for (let i = 0; i < chordLen && start + i < length; i++) {
      const curT = i / SAMPLE_RATE;
      const decay = Math.exp(-curT * 1.2);
      let chordVal = 0;
      notes.forEach(f => {
        chordVal += Math.sin(2 * Math.PI * f * curT);
      });
      samples[start + i] += (chordVal / notes.length) * decay * 0.16;
    }
  });

  return applyReverb(samples, 0.22, 0.6);
}

// 15. Final Round / Fast Money Tension Music (Loopable)
function generateFinalBGM() {
  const duration = 6.0; // 6 seconds at 130 BPM
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);
  const beatSec = 60 / 130;

  // Driving 16th note clock ticking
  const sixteenthSec = beatSec / 4;
  const totalTicks = Math.floor(duration / sixteenthSec);
  for (let k = 0; k < totalTicks; k++) {
    const pos = Math.floor(k * sixteenthSec * SAMPLE_RATE);
    const isBeat = k % 4 === 0;
    const f = isBeat ? 1600 : 1200;
    const amp = isBeat ? 0.22 : 0.12;
    for (let j = 0; j < 300 && pos + j < length; j++) {
      const t = j / SAMPLE_RATE;
      const decay = Math.exp(-t * 80);
      samples[pos + j] += Math.sin(2 * Math.PI * f * t) * decay * amp;
    }
  }

  // Driving pulsing bass
  const numBeats = Math.floor(duration / beatSec);
  for (let b = 0; b < numBeats; b++) {
    const pos = Math.floor(b * beatSec * SAMPLE_RATE);
    const f = 73.42; // D2
    const len = Math.floor(beatSec * 0.8 * SAMPLE_RATE);
    for (let j = 0; j < len && pos + j < length; j++) {
      const t = j / SAMPLE_RATE;
      const decay = Math.exp(-t * 4);
      samples[pos + j] += softClip(Math.sin(2 * Math.PI * f * t) * 1.5) * decay * 0.35;
    }
  }

  return applyReverb(samples, 0.2, 0.55);
}

// 16. UI Interaction Sounds
function generateUIClick() {
  const length = Math.floor(0.04 * SAMPLE_RATE);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const decay = Math.exp(-t * 120);
    samples[i] = (Math.sin(2 * Math.PI * 1400 * t) + 0.4 * (Math.random() * 2 - 1)) * decay * 0.4;
  }
  return samples;
}

function generateUIHover() {
  const length = Math.floor(0.03 * SAMPLE_RATE);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const decay = Math.exp(-t * 150);
    samples[i] = Math.sin(2 * Math.PI * 880 * t) * decay * 0.15;
  }
  return samples;
}

function generateUISelect() {
  const length = Math.floor(0.18 * SAMPLE_RATE);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const f = 660 + 220 * (t / 0.18);
    const decay = Math.exp(-t * 14);
    samples[i] = Math.sin(2 * Math.PI * f * t) * decay * 0.35;
  }
  return applyReverb(samples, 0.2, 0.4);
}

function generateUIStart() {
  const length = Math.floor(0.45 * SAMPLE_RATE);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const f = 400 + 800 * (t / 0.45);
    const decay = Math.exp(-t * 5.5);
    let stinger = Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 2 * t);
    samples[i] = softClip(stinger * decay * 1.2) * 0.5;
  }
  return applyReverb(samples, 0.3, 0.6);
}

function generateRoundStart() {
  const duration = 1.2;
  const length = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(length);
  const notes = [
    { f: 523.25, t: 0.0, d: 0.18 },
    { f: 659.25, t: 0.18, d: 0.18 },
    { f: 783.99, t: 0.36, d: 0.6 },
  ];
  notes.forEach(({ f, t, d }) => {
    const start = Math.floor(t * SAMPLE_RATE);
    const len = Math.floor(d * SAMPLE_RATE);
    for (let i = 0; i < len && start + i < length; i++) {
      const curT = i / SAMPLE_RATE;
      const brass = Math.sin(2 * Math.PI * f * curT) + 0.4 * Math.sin(2 * Math.PI * f * 2 * curT);
      const env = curT < 0.02 ? curT / 0.02 : Math.exp(-curT * (2.0 / d));
      samples[start + i] += softClip(brass * env * 1.3) * 0.55;
    }
  });
  return applyReverb(samples, 0.3, 0.65);
}

// -------------------------------------------------------------
// MAIN BATCH EXPORT
// -------------------------------------------------------------
function buildAllSounds() {
  console.log('Generating realistic TV Game Show audio assets into public/audio/ ...');

  const soundManifest = [
    { name: 'strike.wav', fn: () => generateStrikeBuzzer(false) },
    { name: 'strike3.wav', fn: () => generateStrikeBuzzer(true) },
    { name: 'correct.wav', fn: generateCorrectChime },
    { name: 'reveal.wav', fn: generateRevealSound },
    { name: 'wrong.wav', fn: generateWrongBuzz },
    { name: 'score_update.wav', fn: generateScoreUpdate },
    { name: 'countdown.wav', fn: generateCountdownTick },
    { name: 'timer_end.wav', fn: generateTimerEnd },
    { name: 'round_win.wav', fn: () => generateRoundWin(false) },
    { name: 'round_start.wav', fn: generateRoundStart },
    { name: 'round_transition.wav', fn: generateRoundStart },
    { name: 'steal_success.wav', fn: () => generateRoundWin(true) },
    { name: 'steal_fail.wav', fn: generateStealFail },
    { name: 'fast_money_bell.wav', fn: generateFastMoneyBell },
    { name: 'fast_money_buzz.wav', fn: generateFastMoneyBuzz },
    { name: 'intro.wav', fn: generateIntroTheme },
    { name: 'game_win.wav', fn: generateVictoryCelebration },
    { name: 'game_over.wav', fn: generateGameOver },
    { name: 'bgm_gameplay.wav', fn: generateGameplayBGM },
    { name: 'bgm_final.wav', fn: generateFinalBGM },
    { name: 'ui_click.wav', fn: generateUIClick },
    { name: 'ui_hover.wav', fn: generateUIHover },
    { name: 'ui_select.wav', fn: generateUISelect },
    { name: 'ui_start.wav', fn: generateUIStart },
  ];

  for (const { name, fn } of soundManifest) {
    const rawMono = fn();
    // Create stereo by duplicating or panning
    const wavBuffer = encodeWav(rawMono, rawMono);
    const destPath = path.join(OUTPUT_DIR, name);
    fs.writeFileSync(destPath, wavBuffer);
    console.log(`✓ Generated ${name} (${(wavBuffer.length / 1024).toFixed(1)} KB)`);
  }

  console.log('All 24 audio assets successfully created in public/audio/');
}

buildAllSounds();
