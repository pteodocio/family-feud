import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export function AudioInitializer() {
  const [needsInit, setNeedsInit] = useState(false);

  useEffect(() => {
    // If user interacts with window, initialize audio
    const handleFirstInteraction = () => {
      soundManager.init();
      setNeedsInit(false);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  if (!needsInit) return null;

  return (
    <button
      onClick={() => {
        soundManager.init();
        setNeedsInit(false);
      }}
      className="fixed bottom-4 right-4 z-50 bg-feud-gold hover:bg-feud-goldLight text-feud-dark px-4 py-2 rounded-full font-bold shadow-gold-glow flex items-center gap-2 text-sm transition-all"
    >
      <Volume2 className="w-4 h-4" />
      Enable Game Sound
    </button>
  );
}
