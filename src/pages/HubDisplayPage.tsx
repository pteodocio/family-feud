import { useState, useEffect } from 'react';
import { Maximize, Minimize, Bell } from 'lucide-react';
import { TriviaTvView } from '../games/trivia/TriviaTvView';
import { CharadesTvView } from '../games/charades/CharadesTvView';
import { PictionaryTvView } from '../games/pictionary/PictionaryTvView';
import { BingoTvView } from '../games/bingo/BingoTvView';
import { GuessWordTvView } from '../games/guessWord/GuessWordTvView';
import { PasswordTvView } from '../games/password/PasswordTvView';
import { CatchphraseTvView } from '../games/catchphrase/CatchphraseTvView';
import { TabooTvView } from '../games/taboo/TabooTvView';
import { JeopardyTvView } from '../games/jeopardy/JeopardyTvView';
import { WheelFortuneTvView } from '../games/wheelFortune/WheelFortuneTvView';
import { BluffTvView } from '../games/bluff/BluffTvView';
import { HeadsUpTvView } from '../games/headsUp/HeadsUpTvView';
import { WordHuntTvView } from '../games/wordHunt/WordHuntTvView';
import { ScattergoriesTvView } from '../games/scattergories/ScattergoriesTvView';
import { EliminationTvView } from '../games/elimination/EliminationTvView';
import { soundManager } from '../audio/soundManager';
import { hubSyncBus } from '../sync/hubSync';
import { loadSettings } from '../db/database';

interface HubDisplayPageProps {
  gameId: string;
}

export function HubDisplayPage({ gameId: initialGameId }: HubDisplayPageProps) {
  const [activeGameId, setActiveGameId] = useState(initialGameId);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    setActiveGameId(initialGameId);
  }, [initialGameId]);

  useEffect(() => {
    // Send immediate TV pulse so host knows TV is connected
    hubSyncBus.broadcastTvPulse(true);
    const pulseInterval = setInterval(() => {
      hubSyncBus.broadcastTvPulse(true);
    }, 4000);

    // Unlock Audio Context on first TV screen interaction
    const unlockAudio = () => {
      soundManager.init();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    loadSettings().then((s) => {
      if (s) {
        soundManager.setMasterVolume(s.masterVolume);
        soundManager.setEffectsVolume(s.effectsVolume);
        soundManager.setBgmVolume(s.bgmVolume);
        soundManager.setMuted(!s.soundEnabled);
      }
    });

    // Listen for party sound triggers from host
    const unsubSound = hubSyncBus.onSoundTrigger((cue) => {
      loadSettings().then((s) => {
        const dest = s?.audioDestination || 'both';
        if (dest !== 'host_only') {
          soundManager.playPartyCue(cue);
        }
      });
    });

    // Listen for dynamic game switching from host
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming?.gameId && incoming.gameId !== activeGameId) {
        setActiveGameId(incoming.gameId);
        window.location.hash = `#/display/hub/${incoming.gameId}`;
      }
    });

    // Listen for live announcements from host
    let announcementTimer: any = null;
    const unsubAnnouncement = hubSyncBus.onAnnouncement((a) => {
      setAnnouncement(a.text);
      soundManager.playPartyCue('whistle');
      if (announcementTimer) clearTimeout(announcementTimer);
      announcementTimer = setTimeout(() => {
        setAnnouncement(null);
      }, (a.durationSeconds || 6) * 1000);
    });

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(pulseInterval);
      if (announcementTimer) clearTimeout(announcementTimer);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      unsubSound();
      unsubState();
      unsubAnnouncement();
    };
  }, [activeGameId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050a16] text-white">
      {/* Floating Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-slate-700/80 text-slate-300 hover:text-white backdrop-blur-md transition-all opacity-40 hover:opacity-100"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </button>

      {/* Host Live Announcement Overlay Banner */}
      {announcement && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4 animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 rounded-3xl bg-amber-500 text-slate-950 border-2 border-amber-300 shadow-2xl shadow-amber-500/40 flex items-center gap-3 font-display">
            <div className="w-10 h-10 rounded-2xl bg-slate-950/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-slate-950 animate-bounce" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 block">
                Host Announcement
              </span>
              <p className="font-black text-base sm:text-lg leading-tight">{announcement}</p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Game TV Board */}
      {activeGameId === 'family-trivia' && <TriviaTvView />}
      {activeGameId === 'charades' && <CharadesTvView />}
      {activeGameId === 'pictionary' && <PictionaryTvView />}
      {activeGameId === 'family-bingo' && <BingoTvView />}
      {activeGameId === 'guess-the-word' && <GuessWordTvView />}
      {activeGameId === 'password' && <PasswordTvView />}
      {activeGameId === 'catchphrase' && <CatchphraseTvView />}
      {activeGameId === 'taboo' && <TabooTvView />}
      {activeGameId === 'jeopardy' && <JeopardyTvView />}
      {activeGameId === 'wheel-of-fortune' && <WheelFortuneTvView />}
      {activeGameId === 'bluff-the-answer' && <BluffTvView />}
      {activeGameId === 'heads-up' && <HeadsUpTvView />}
      {activeGameId === 'word-hunt' && <WordHuntTvView />}
      {activeGameId === 'scattergories' && <ScattergoriesTvView />}
      {activeGameId === 'trivia-elimination' && <EliminationTvView />}
    </div>
  );
}
