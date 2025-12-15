// src/components/training/TrainingTimer.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play, Pause, RotateCcw, SkipForward, Zap, Timer as TimerIcon,
  Maximize, Minimize, Volume2, VolumeX, Vibrate, Contrast, Trophy, History
} from 'lucide-react';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAudioBeep } from '@/hooks/useAudioBeep';

type Mode = 'STOPWATCH' | 'HIIT' | 'TABATA' | 'EMOM' | 'AMRAP';

interface IntervalConfig {
  workSec: number;
  restSec: number;
  rounds: number;
}

interface Preset {
  id: string;
  name: string;
  mode: Mode;
  config: IntervalConfig;
  createdAt: number;
}

interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  highContrast: boolean;
  volume: number;
  countdownEnabled: boolean;
}

interface SessionHistory {
  id: string;
  date: number;
  mode: Mode;
  totalTimeMs: number;
  roundsCompleted: number;
  config: IntervalConfig;
}

interface Props {
  embedded?: boolean; // Para versión compacta en calendario
  onClose?: () => void;
}

export default function TrainingTimer({ embedded = false, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const tickRef = useRef<number | null>(null);

  const [mode, setMode] = useState<Mode>('STOPWATCH');
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [round, setRound] = useState(1);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { supported: wakeSupported, active: wakeActive, request, release } = useWakeLock();
  const { countdown321, phaseChange } = useAudioBeep();

  const [settings, setSettings] = useLocalStorage<Settings>('kiui.timer.settings', {
    soundEnabled: true,
    vibrationEnabled: true,
    highContrast: false,
    volume: 0.25,
    countdownEnabled: true,
  });

  const [presets, setPresets] = useLocalStorage<Preset[]>('kiui.timer.presets', []);
  const [history, setHistory] = useLocalStorage<SessionHistory[]>('kiui.timer.history', []);

  const config = useMemo<IntervalConfig>(() => {
    switch (mode) {
      case 'TABATA': return { workSec: 20, restSec: 10, rounds: 8 };
      case 'HIIT': return { workSec: 30, restSec: 15, rounds: 10 };
      case 'EMOM': return { workSec: 60, restSec: 0, rounds: 10 };
      case 'AMRAP': return { workSec: 12 * 60, restSec: 0, rounds: 1 };
      default: return { workSec: 0, restSec: 0, rounds: 0 };
    }
  }, [mode]);

  // Inicializar remaining según fase
  useEffect(() => {
    if (mode === 'STOPWATCH') return setRemainingMs(0);
    const secs = phase === 'work' ? config.workSec : config.restSec;
    setRemainingMs(secs * 1000);
  }, [phase, mode, config]);

  // Loop principal
  useEffect(() => {
    if (!running) return;
    request();

    lastTimestampRef.current = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTimestampRef.current;
      lastTimestampRef.current = now;

      if (mode === 'STOPWATCH') {
        setElapsedMs(prev => prev + delta);
      } else {
        setElapsedMs(prev => prev + delta);
        setRemainingMs(prev => {
          const newRemaining = Math.max(prev - delta, 0);
          
          if (newRemaining <= 0 && prev > 0) {
            if (settings.soundEnabled) phaseChange(settings.volume);
            if (settings.vibrationEnabled && 'vibrate' in navigator) {
              navigator.vibrate([140]);
            }

            if (phase === 'work' && config.restSec > 0) {
              setPhase('rest');
              return config.restSec * 1000;
            } else {
              setPhase('work');
              setRound(r => r + 1);
              return config.workSec * 1000;
            }
          }
          
          return newRemaining;
        });
      }

      tickRef.current = requestAnimationFrame(loop);
    };

    tickRef.current = requestAnimationFrame(loop);

    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      if (wakeActive) release();
    };
  }, [running, mode, phase, config, settings, wakeActive, request, release, phaseChange]);

  // Countdown 3-2-1
  useEffect(() => {
    if (!running || mode === 'STOPWATCH' || !settings.countdownEnabled || !settings.soundEnabled) return;
    const s = Math.ceil(remainingMs / 1000);
    if (s === 3 && Math.abs(remainingMs - 3000) < 100) {
      countdown321(settings.volume);
    }
  }, [remainingMs, running, mode, settings, countdown321]);

  // Fullscreen
    useEffect(() => {
    const onFullscreenChange = () => {
        setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
        document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
    }, []);


  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
        if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        } else {
        await document.exitFullscreen();
        }
    } catch (error) {
        console.error('Fullscreen error:', error);
    }
    };


  const reset = () => {
    if (elapsedMs > 0) {
      setHistory(prev => [
        {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          date: Date.now(),
          mode,
          totalTimeMs: elapsedMs,
          roundsCompleted: round,
          config,
        },
        ...prev
      ].slice(0, 50));
    }

    setRunning(false);
    setElapsedMs(0);
    setRound(1);
    setPhase('work');
    setRemainingMs(mode === 'STOPWATCH' ? 0 : config.workSec * 1000);
    release();
  };

  const skip = () => {
    if (mode === 'STOPWATCH') return;
    if (settings.soundEnabled) phaseChange(settings.volume);
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([120]);
    }

    if (phase === 'work' && config.restSec > 0) {
      setPhase('rest');
      setRemainingMs(config.restSec * 1000);
    } else {
      setPhase('work');
      setRound(r => r + 1);
      setRemainingMs(config.workSec * 1000);
    }
  };

  const savePreset = () => {
    const id = crypto.randomUUID?.() ?? String(Date.now());
    const name = `${mode} ${config.workSec}s/${config.restSec}s × ${config.rounds}`;
    setPresets(prev => [
      { id, name, mode, config, createdAt: Date.now() },
      ...prev
    ].slice(0, 25));
  };

  const mmss = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const isLastTen = remainingMs / 1000 <= 10 && mode !== 'STOPWATCH';
  const isLastFive = remainingMs / 1000 <= 5 && mode !== 'STOPWATCH';

  const progress = mode === 'STOPWATCH'
    ? 0
    : ((phase === 'work' ? config.workSec * 1000 : config.restSec * 1000) - remainingMs) /
      (phase === 'work' ? config.workSec * 1000 : config.restSec * 1000);

  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference * (1 - progress);

  // Versión embebida (compacta para calendario)
  if (embedded) {
    return (
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TimerIcon className="w-5 h-5 text-emerald-400" />
            <span className="font-bold">Timer</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              ✕
            </button>
          )}
        </div>
        
        <div className="text-center mb-4">
          <div className="text-4xl font-bold mb-2">
            {mode === 'STOPWATCH' ? mmss(elapsedMs) : mmss(remainingMs)}
          </div>
          <div className="text-sm text-slate-400">
            {mode} · {phase === 'work' ? 'Trabajo' : 'Descanso'}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setRunning(r => !r)}
            className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold"
          >
            {running ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  // Versión completa
return (
  <div
    ref={containerRef}
    className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8
      transition-colors
      ${isFullscreen ? 'bg-slate-950 text-white' : 'bg-transparent'}
      ${settings.highContrast ? 'contrast-125 saturate-150' : ''}`}
  >
    {/* Display del tiempo */}
    <div className="text-6xl font-bold mb-4">
      {mode === 'STOPWATCH' ? mmss(elapsedMs) : mmss(remainingMs)}
    </div>

    {/* Info de fase y round */}
    {mode !== 'STOPWATCH' && (
      <div className="text-center text-slate-400 mb-6">
        {phase === 'work' ? 'Trabajo' : 'Descanso'} · Ronda {round}/{config.rounds}
      </div>
    )}

    {/* Controles */}
    <div className="flex gap-4">
      <button
        onClick={() => setRunning(r => !r)}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold"
      >
        {running ? <Pause className="inline w-5 h-5 mr-2" /> : <Play className="inline w-5 h-5 mr-2" />}
        {running ? 'Pausar' : 'Iniciar'}
      </button>

      <button
        onClick={reset}
        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold"
      >
        Reset
      </button>

      <button
        onClick={toggleFullscreen}
        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center gap-2"
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        Fullscreen
      </button>
    </div>
  </div>
);
}