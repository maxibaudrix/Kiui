// src/hooks/useAudioBeep.ts
'use client';
import { useRef } from 'react';

export function useAudioBeep() {
  const ctxRef = useRef<AudioContext | null>(null);
  const beepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const ensureCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  };
  
  const beep = (freq = 880, ms = 180, vol = 0.2) => {
    // Prevenir múltiples beeps simultáneos
    if (beepTimeoutRef.current) return;
    
    try {
      const ctx = ensureCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = vol;
      
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + ms / 1000);
      
      // Timeout para prevenir overlap
      beepTimeoutRef.current = setTimeout(() => {
        beepTimeoutRef.current = null;
      }, ms + 50);
    } catch (err) {
      console.warn('Audio beep error:', err);
    }
  };
  
  const countdown321 = (vol = 0.25) => {
    // Beeps descendentes: 3, 2, 1
    beep(1000, 120, vol);
    setTimeout(() => beep(900, 120, vol), 320);
    setTimeout(() => beep(800, 150, vol), 640);
  };
  
  const phaseChange = (vol = 0.3) => {
    // Beep más grave para cambio de fase
    beep(600, 220, vol);
  };
  
  return { beep, countdown321, phaseChange };
}