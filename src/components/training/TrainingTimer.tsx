import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play, Pause, RotateCcw, SkipForward, Zap, Timer as TimerIcon,
  Maximize, Minimize, Volume2, VolumeX, Vibrate, Contrast, Trophy, History
} from 'lucide-react';

// ========== TYPES ==========
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

// ========== HOOKS ==========
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  
  return [value, setValue] as const;
}

function useWakeLock() {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);
  const lockRef = useRef<any>(null);

  useEffect(() => {
    setSupported('wakeLock' in navigator);
  }, []);

  const request = async () => {
    if (!supported || active) return;
    try {
      lockRef.current = await (navigator as any).wakeLock.request('screen');
      setActive(true);
      lockRef.current.addEventListener('release', () => setActive(false));
    } catch (err) {
      console.warn('Wake Lock error:', err);
    }
  };

  const release = async () => {
    if (lockRef.current) {
      await lockRef.current.release();
      lockRef.current = null;
      setActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (lockRef.current) lockRef.current.release();
    };
  }, []);

  return { supported, active, request, release };
}

function useAudioBeep() {
  const ctxRef = useRef<AudioContext | null>(null);
  const beepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const ensureCtx = () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current!;
  };
  
  const beep = (freq = 880, ms = 180, vol = 0.2) => {
    if (beepTimeoutRef.current) return;
    
    const ctx = ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + ms / 1000);
    
    beepTimeoutRef.current = setTimeout(() => {
      beepTimeoutRef.current = null;
    }, ms + 50);
  };
  
  const countdown321 = (vol = 0.25) => {
    beep(1000, 120, vol);
    setTimeout(() => beep(900, 120, vol), 320);
    setTimeout(() => beep(800, 150, vol), 640);
  };
  
  const phaseChange = (vol = 0.3) => beep(600, 220, vol);
  
  return { beep, countdown321, phaseChange };
}

// ========== COMPONENTE PRINCIPAL ==========
export default function TrainingTimer() {
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

  // Loop principal con RAF
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
          
          // Cambio de fase al llegar a 0
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

  // Beeps countdown 3-2-1
  useEffect(() => {
    if (!running || mode === 'STOPWATCH' || !settings.countdownEnabled || !settings.soundEnabled) return;
    const s = Math.ceil(remainingMs / 1000);
    if (s === 3 && Math.abs(remainingMs - 3000) < 100) {
      countdown321(settings.volume);
    }
  }, [remainingMs, running, mode, settings, countdown321]);

  // Fullscreen
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const reset = () => {
    // Guardar en historial
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

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-slate-950 text-white p-4 md:p-8 ${settings.highContrast ? 'contrast-125 saturate-150' : ''}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TimerIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Cronómetro de Entrenamiento</h1>
              <p className="text-sm text-slate-400">
                {mode === 'STOPWATCH' ? 'Modo libre' : `${mode} · Ronda ${round}/${config.rounds}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Historial
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center gap-2"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              {isFullscreen ? 'Salir' : 'Pantalla completa'}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Display Principal */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-3xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
            <div className={`relative rounded-3xl p-8 border ${settings.highContrast ? 'bg-slate-900 border-white/30' : 'bg-slate-900/50 border-slate-700/50'} backdrop-blur-sm`}>
              
              {/* Anillo de progreso SVG */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <svg className="w-full h-full -rotate-90">
                  {/* Background ring */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-slate-800"
                  />
                  {/* Progress ring */}
                  {mode !== 'STOPWATCH' && (
                    <circle
                      cx="50%"
                      cy="50%"
                      r="110"
                      fill="none"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className={`transition-all duration-300 ${
                        isLastFive ? 'stroke-red-500 animate-pulse' :
                        isLastTen ? 'stroke-amber-500' :
                        phase === 'work' ? 'stroke-emerald-500' : 'stroke-cyan-500'
                      }`}
                      style={{
                        filter: isLastFive ? 'drop-shadow(0 0 8px rgb(239 68 68))' : 'none'
                      }}
                    />
                  )}
                </svg>

                {/* Display de tiempo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-6xl md:text-7xl font-bold tracking-tight mb-2 ${isLastFive ? 'text-red-400 animate-pulse' : ''}`}>
                    {mode === 'STOPWATCH' ? mmss(elapsedMs) : mmss(remainingMs)}
                  </div>
                  <div className={`text-lg font-medium ${phase === 'work' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {mode === 'STOPWATCH' ? 'Tiempo transcurrido' : (phase === 'work' ? '💪 Trabajo' : '😮‍💨 Descanso')}
                  </div>
                  {mode !== 'STOPWATCH' && (
                    <div className="mt-4 text-sm text-slate-400">
                      Transcurrido: {mmss(elapsedMs)}
                    </div>
                  )}
                </div>
              </div>

              {/* Mensaje motivacional */}
              {running && round > 0 && round % 3 === 0 && phase === 'rest' && (
                <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-4">
                  <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <span className="text-emerald-400 font-semibold">¡Vas genial! 💪 Sigue así</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel de Controles */}
          <div className="space-y-6">
            {/* Selector de Modo */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-3 block">Modo de Entrenamiento</label>
              <div className="grid grid-cols-3 gap-2">
                {(['STOPWATCH', 'TABATA', 'HIIT', 'EMOM', 'AMRAP'] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); reset(); }}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                      mode === m
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Config rápida */}
            {(mode === 'TABATA' || mode === 'HIIT') && (
              <div className={`rounded-2xl p-5 border ${settings.highContrast ? 'bg-slate-900 border-white/30' : 'bg-slate-800/40 border-slate-700'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold">Configuración</span>
                  <button
                    onClick={savePreset}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  >
                    Guardar preset
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Trabajo</div>
                    <div className="text-xl font-bold">{config.workSec}s</div>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Descanso</div>
                    <div className="text-xl font-bold">{config.restSec}s</div>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">Rondas</div>
                    <div className="text-xl font-bold">{config.rounds}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Próxima fase */}
            {mode !== 'STOPWATCH' && (
              <div className={`rounded-2xl p-5 border ${settings.highContrast ? 'bg-slate-900 border-white/30' : 'bg-slate-800/40 border-slate-700'}`}>
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold">Siguiente fase</span>
                </div>
                <p className="text-sm text-slate-400">
                  {phase === 'work'
                    ? (config.restSec > 0 ? `Descanso de ${mmss(config.restSec * 1000)}` : 'Trabajo')
                    : `Trabajo de ${mmss(config.workSec * 1000)}`}
                </p>
              </div>
            )}

            {/* Controles principales */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRunning(r => !r)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 text-lg"
              >
                {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                {running ? 'Pausar' : 'Iniciar'}
              </button>
              <button
                onClick={skip}
                disabled={mode === 'STOPWATCH'}
                className="px-5 py-4 rounded-2xl font-semibold bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={reset}
                className="px-5 py-4 rounded-2xl font-semibold bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Ajustes */}
            <div className={`rounded-2xl p-5 border space-y-4 ${settings.highContrast ? 'bg-slate-900 border-white/30' : 'bg-slate-800/40 border-slate-700'}`}>
              <div className="text-sm font-semibold mb-3">Ajustes</div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Sonidos
                </label>
                <Switch
                  checked={settings.soundEnabled}
                  onChange={v => setSettings(s => ({ ...s, soundEnabled: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <Vibrate className="w-4 h-4" />
                  Vibración
                </label>
                <Switch
                  checked={settings.vibrationEnabled}
                  onChange={v => setSettings(s => ({ ...s, vibrationEnabled: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  Beeps 3-2-1
                </label>
                <Switch
                  checked={settings.countdownEnabled}
                  onChange={v => setSettings(s => ({ ...s, countdownEnabled: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <Contrast className="w-4 h-4" />
                  Alto contraste
                </label>
                <Switch
                  checked={settings.highContrast}
                  onChange={v => setSettings(s => ({ ...s, highContrast: v }))}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2 block">Volumen</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.volume}
                  onChange={e => setSettings(s => ({ ...s, volume: Number(e.target.value) }))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className={`w-2 h-2 rounded-full ${wakeActive ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                  {wakeSupported
                    ? (wakeActive ? 'Pantalla activa' : 'Wake Lock disponible')
                    : 'Wake Lock no soportado'}
                </div>
              </div>
            </div>

            {/* Presets guardados */}
            {presets.length > 0 && (
              <div className={`rounded-2xl p-5 border ${settings.highContrast ? 'bg-slate-900 border-white/30' : 'bg-slate-800/40 border-slate-700'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Tus Presets</span>
                  <Trophy className="w-4 h-4 text-emerald-400" />
                </div>
                <ul className="space-y-2 max-h-40 overflow-auto">
                  {presets.slice(0, 5).map(p => (
                    <li key={p.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-900/50">
                      <span className="text-slate-300 truncate">{p.name}</span>
                      <button
                        onClick={() => {
                          setMode(p.mode);
                          reset();
                        }}
                        className="ml-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20"
                      >
                        Cargar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal Historial */}
        {showHistory && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <History className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-bold">Historial de Entrenamientos</h2>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold"
                >
                  Cerrar
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aún no has completado ningún entrenamiento</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {history.map(session => (
                      <li key={session.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-white">{session.mode}</div>
                            <div className="text-xs text-slate-400">
                              {new Date(session.date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-400">{mmss(session.totalTimeMs)}</div>
                            <div className="text-xs text-slate-400">{session.roundsCompleted} rondas</div>
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs text-slate-400">
                          <span>Trabajo: {session.config.workSec}s</span>
                          <span>•</span>
                          <span>Descanso: {session.config.restSec}s</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== SUB-COMPONENTES ==========
const Switch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full p-0.5 transition-all ${
      checked ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-slate-700'
    }`}
  >
    <span
      className={`block w-5 h-5 rounded-full bg-white transition-all ${
        checked ? 'translate-x-6' : 'translate-x-0'
      }`}
    />
  </button>
);