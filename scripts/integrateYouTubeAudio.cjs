const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.resolve(__dirname, '../temp_audio');
const OUT_DIR = path.resolve(__dirname, '../public/audio');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function runFfmpeg(cmd) {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

console.log('--- Processing Necessary Family Feud Game Audio ---');

// 1. Intro Theme
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '01_zQ3_TLYedwE.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-50dB,loudnorm=I=-16:TP=-1.5:LRA=11" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'intro.wav')}"`
);

// 2. Strike Buzzer (Wrong Answer)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '02_q5vJCYtu88k.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-14:TP=-1.0:LRA=7" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'strike.wav')}"`
);

// 3. Strike 3 (Double-blast buzzer: BUZZ-BUZZ!)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '02_q5vJCYtu88k.wav')}" ` +
  `-filter_complex "[0:a]silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,atrim=0:0.65[a1];[0:a]silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,atrim=0:1.8,adelay=700|700[a2];[a1][a2]amix=inputs=2:duration=longest,loudnorm=I=-13:TP=-1.0:LRA=7" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'strike3.wav')}"`
);

// 4. Round Win Celebration Fanfare
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '05_T0-7b0XGTSg.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=9" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'round_win.wav')}"`
);

// 5. Family Feud Theme Song (Concise 28s loop for gameplay ambience)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '07_yj5SORZ_Y8g.wav')}" -t 28 ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-50dB,afade=t=out:st=27:d=1,loudnorm=I=-17:TP=-1.5:LRA=11" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'theme.wav')}"`
);

// 6. $20,000 Grand Victory Theme (Game Champion)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '08_c_-mzapzLZY.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-50dB,loudnorm=I=-14:TP=-1.0:LRA=9" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'game_win.wav')}"`
);

// 7. Ding (Board Answer Reveal Chime)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '09_KHmDv9qZFIk.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'correct.wav')}"`
);

// 8. You Said... (Survey Says / Card Flip)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '10_QZ_pp3TMosA.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'reveal.wav')}"`
);

// 9. Wrong Answer / Mistake Buzzer
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '11_aKj7G5tMWIY.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-14:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'wrong.wav')}"`
);

console.log('--- Successfully integrated the 8 necessary game sounds + 1 theme track! ---');
