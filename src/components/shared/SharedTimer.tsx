import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface SharedTimerProps {
  initialSeconds: number;
  isRunning?: boolean;
  onTick?: (remaining: number) => void;
  onExpire?: () => void;
  showControls?: boolean;
  autoStart?: boolean;
  enableAudioTicks?: boolean;
  className?: string;
  size?: 'normal' | 'large';
}

export function SharedTimer({
  initialSeconds,
  isRunning: externalIsRunning,
  onTick,
  onExpire,
  showControls = true,
  autoStart = false,
  enableAudioTicks = true,
  className = '',
  size = 'normal',
}: SharedTimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [internalRunning, setInternalRunning] = useState(autoStart);
  const [audioEnabled, setAudioEnabled] = useState(enableAudioTicks);
  const hasExpiredRef = useRef(false);

  const running = externalIsRunning !== undefined ? externalIsRunning : internalRunning;

  useEffect(() => {
    setRemaining(initialSeconds);
    hasExpiredRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true;
            if (audioEnabled) {
              soundManager.playPartyCue('whistle');
            }
            onExpire?.();
          }
          return 0;
        }

        const next = prev - 1;
        if (audioEnabled && next <= 5) {
          soundManager.playPartyCue('tick');
        }
        onTick?.(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, audioEnabled, onExpire, onTick]);

  const toggleRun = () => {
    setInternalRunning((prev) => !prev);
  };

  const handleReset = () => {
    setInternalRunning(false);
    setRemaining(initialSeconds);
    hasExpiredRef.current = false;
    onTick?.(initialSeconds);
  };

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isUrgent = remaining <= 10 && remaining > 0;
  const isZero = remaining === 0;

  return (
    <div
      className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl border bg-slate-900/90 ${
        isUrgent
          ? 'border-red-500/80 shadow-lg shadow-red-950/40 text-red-400'
          : isZero
          ? 'border-amber-500/80 text-amber-400'
          : 'border-slate-800 text-slate-100'
      } ${className}`}
    >
      {/* Time Display */}
      <div
        className={`font-mono font-black tracking-tight select-none ${
          size === 'large' ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-3xl'
        }`}
      >
        {formattedTime}
      </div>

      {/* Optional Interactive Controls */}
      {showControls && (
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={toggleRun}
            className={`p-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-2 ${
              running
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
            }`}
            title={running ? 'Pause Timer' : 'Start Timer'}
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus-visible:outline-2"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setAudioEnabled((prev) => !prev)}
            className={`p-2 rounded-xl text-xs font-bold border transition-colors focus-visible:outline-2 ${
              audioEnabled
                ? 'bg-blue-900/40 border-blue-700/60 text-blue-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
            }`}
            title={audioEnabled ? 'Mute Timer Sound' : 'Enable Timer Sound'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
