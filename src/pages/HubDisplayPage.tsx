import { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { TriviaTvView } from '../games/trivia/TriviaTvView';
import { CharadesTvView } from '../games/charades/CharadesTvView';
import { PictionaryTvView } from '../games/pictionary/PictionaryTvView';
import { BingoTvView } from '../games/bingo/BingoTvView';
import { GuessWordTvView } from '../games/guessWord/GuessWordTvView';
import { soundManager } from '../audio/soundManager';
import { loadSettings } from '../db/database';

interface HubDisplayPageProps {
  gameId: string;
}

export function HubDisplayPage({ gameId }: HubDisplayPageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
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

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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

      {/* Dynamic Game TV Board */}
      {gameId === 'family-trivia' && <TriviaTvView />}
      {gameId === 'charades' && <CharadesTvView />}
      {gameId === 'pictionary' && <PictionaryTvView />}
      {gameId === 'family-bingo' && <BingoTvView />}
      {gameId === 'guess-the-word' && <GuessWordTvView />}
    </div>
  );
}
