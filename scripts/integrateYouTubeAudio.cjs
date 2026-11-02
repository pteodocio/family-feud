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

console.log('--- Processing Family Feud YouTube Playlist Audio ---');

// 1. Intro Theme
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '01_zQ3_TLYedwE.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-50dB,loudnorm=I=-16:TP=-1.5:LRA=11" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'intro.wav')}"`
);

// 2. Strike Buzzer
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

// 4. Round Start (Face Off Rounds 1+3+4)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '03_l7p1kZMlvek.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=9" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'round_start.wav')}"`
);

// 5. Round Transition (Face Off Round 2)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '04_Xkp51dSOSaE.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=9" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'round_transition.wav')}"`
);

// 6. Round Win Celebration
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '05_T0-7b0XGTSg.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=9" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'round_win.wav')}"`
);

// 7. Steal Success (Uses Round Win Stinger)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '05_T0-7b0XGTSg.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=9" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'steal_success.wav')}"`
);

// 8. Sudden Death / Final Round Music (Fast Money loop)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '06_4un8zHyexGQ.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-16:TP=-1.5:LRA=10" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'bgm_final.wav')}"`
);

// 9. Full Family Feud Theme Song (Gameplay BGM)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '07_yj5SORZ_Y8g.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-50dB,loudnorm=I=-17:TP=-1.5:LRA=11" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'bgm_gameplay.wav')}"`
);

// 10. $20,000 Grand Victory Theme (Game Win)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '08_c_-mzapzLZY.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-50dB,loudnorm=I=-14:TP=-1.0:LRA=9" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'game_win.wav')}"`
);

// 11. Ding (Correct answer confirmation)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '09_KHmDv9qZFIk.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'correct.wav')}"`
);

// 12. Fast Money Bell (Uses Board Ding)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '09_KHmDv9qZFIk.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'fast_money_bell.wav')}"`
);

// 13. You Said... (Answer Reveal)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '10_QZ_pp3TMosA.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'reveal.wav')}"`
);

// 14. Wrong Answer Buzzer
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '11_aKj7G5tMWIY.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-14:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'wrong.wav')}"`
);

// 15. Timer End Klaxon (Long buzzer)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '11_aKj7G5tMWIY.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-14:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'timer_end.wav')}"`
);

// 16. Fast Money Clock Appear (Countdown / Clock Tick)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '12_KPl8eDBNbeg.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-16:TP=-1.5:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'countdown.wav')}"`
);

// 17. Try Again Buzzer (Failed steal / invalid answer / zero points)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '13_V8yN6XJ40IY.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-14:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'steal_fail.wav')}"`
);

// 18. Fast Money Buzz (Zero points answer)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '13_V8yN6XJ40IY.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-14:TP=-1.0:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'fast_money_buzz.wav')}"`
);

// 19. Next Player / Game Over Stinger
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '14_3_CDXZIrqC8.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,loudnorm=I=-15:TP=-1.0:LRA=9" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'game_over.wav')}"`
);

// 20. Score Update Ratchet / Tick (Punchy ding transient)
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '09_KHmDv9qZFIk.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,atrim=0:0.18,afade=t=out:st=0.12:d=0.06,loudnorm=I=-16:TP=-1.5:LRA=4" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'score_update.wav')}"`
);

// 21. UI Click
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '10_QZ_pp3TMosA.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,atrim=0:0.06,afade=t=out:st=0.04:d=0.02,volume=0.6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'ui_click.wav')}"`
);

// 22. UI Hover
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '10_QZ_pp3TMosA.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,atrim=0:0.04,afade=t=out:st=0.02:d=0.02,volume=0.3" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'ui_hover.wav')}"`
);

// 23. UI Select
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '09_KHmDv9qZFIk.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,atrim=0:0.35,afade=t=out:st=0.25:d=0.1,volume=0.7" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'ui_select.wav')}"`
);

// 24. UI Game Start
runFfmpeg(
  `ffmpeg -y -i "${path.join(TEMP_DIR, '03_l7p1kZMlvek.wav')}" ` +
  `-af "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB,atrim=0:2.0,afade=t=out:st=1.6:d=0.4,loudnorm=I=-16:TP=-1.5:LRA=6" ` +
  `-ar 44100 -ac 2 -c:a pcm_s16le "${path.join(OUT_DIR, 'ui_start.wav')}"`
);

console.log('--- Successfully integrated all 24 TV Game Show audio files! ---');
