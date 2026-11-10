import { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { hubSyncBus } from '../../sync/hubSync';

export interface SharedTimerProps {
  initialSeconds: number;
  isRunning?: boolean;
  onTick?: (remaining: number) => void;
  onExpire?: () => void;
  onToggle?: () => void;
  onReset?: () => void;
  showControls?: boolean;
  autoStart?: boolean;
  enableAudioTicks?: boolean;
  broadcastOnHub?: boolean;
  resetKey?: any;
  className?: string;
  size?: 'normal' | 'large';
}

export function SharedTimer({
  initialSeconds,
  isRunning: externalIsRunning,
  onTick,
  onExpire,
  onToggle,
  onReset,
  showControls = true,
  autoStart = false,
  enableAudioTicks = true,
  broadcastOnHub = true,
  resetKey,
  className = '',
  size = 'normal',
}: SharedTimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [internalRunning, setInternalRunning] = useState(autoStart);
  const [audioEnabled, setAudioEnabled] = useState(enableAudioTicks);

  const running = externalIsRunning !== undefined ? externalIsRunning : internalRunning;

  // Refs for drift-free timestamp calculation and avoiding duplicate calls
  const remainingRef = useRef(initialSeconds);
  const targetEndTimeRef = useRef<number>(0);
  const intervalRef = useRef<any>(null);
  const hasExpiredRef = useRef(false);
  const lastEmittedSecRef = useRef<number>(initialSeconds);
  const prevRunningRef = useRef(running);
  const prevResetKeyRef = useRef(resetKey);
  const prevInitialSecondsRef = useRef(initialSeconds);

  // Sync remaining state to ref
  remainingRef.current = remaining;

  const broadcastTimerState = useCallback(
    (sec: number, isRun: boolean) => {
      if (broadcastOnHub) {
        hubSyncBus.broadcastTimer(sec, isRun);
      }
    },
    [broadcastOnHub]
  );

  // Handle resetKey or initialSeconds change
  useEffect(() => {
    const isResetKeyChanged = prevResetKeyRef.current !== resetKey;
    const isInitialSecChanged = prevInitialSecondsRef.current !== initialSeconds;

    if (isResetKeyChanged || isInitialSecChanged) {
      prevResetKeyRef.current = resetKey;
      prevInitialSecondsRef.current = initialSeconds;

      hasExpiredRef.current = false;
      lastEmittedSecRef.current = initialSeconds;
      remainingRef.current = initialSeconds;
      setRemaining(initialSeconds);

      if (running) {
        targetEndTimeRef.current = Date.now() + initialSeconds * 1000;
        broadcastTimerState(initialSeconds, true);
      } else {
        broadcastTimerState(initialSeconds, false);
      }
    }
  }, [resetKey, initialSeconds, running, broadcastTimerState]);

  // Handle Timer Engine Interval with Date.now() drift compensation
  useEffect(() => {
    // If transitioning from stopped to running
    if (running) {
      // Calculate or re-anchor target end time based on current remaining
      const currentRemaining = remainingRef.current > 0 ? remainingRef.current : initialSeconds;
      targetEndTimeRef.current = Date.now() + currentRemaining * 1000;
      hasExpiredRef.current = false;

      // Broadcast running start if state changed
      if (!prevRunningRef.current) {
        broadcastTimerState(currentRemaining, true);
      }

      // High-frequency polling (100ms) for drift-free second updates
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const diffMs = targetEndTimeRef.current - now;
        const secondsLeft = Math.max(0, Math.ceil(diffMs / 1000));

        if (secondsLeft !== lastEmittedSecRef.current) {
          lastEmittedSecRef.current = secondsLeft;
          remainingRef.current = secondsLeft;
          setRemaining(secondsLeft);
          onTick?.(secondsLeft);
          broadcastTimerState(secondsLeft, true);

          if (audioEnabled && secondsLeft <= 5 && secondsLeft > 0) {
            soundManager.playPartyCue('tick');
          }

          if (secondsLeft <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (!hasExpiredRef.current) {
              hasExpiredRef.current = true;
              if (audioEnabled) {
                soundManager.playPartyCue('whistle');
              }
              broadcastTimerState(0, false);
              onExpire?.();
            }
          }
        }
      }, 100);
    } else {
      // If transitioning from running to paused/stopped
      if (prevRunningRef.current && remainingRef.current > 0) {
        broadcastTimerState(remainingRef.current, false);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    prevRunningRef.current = running;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, initialSeconds, audioEnabled, onExpire, onTick, broadcastTimerState]);

  const toggleRun = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    hasExpiredRef.current = false;
    lastEmittedSecRef.current = initialSeconds;
    remainingRef.current = initialSeconds;
    setRemaining(initialSeconds);

    if (externalIsRunning === undefined) {
      setInternalRunning(false);
    }

    broadcastTimerState(initialSeconds, false);
    onTick?.(initialSeconds);
    onReset?.();
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

      {/* Interactive Controls */}
      {showControls && (
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
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
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus-visible:outline-2"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
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
