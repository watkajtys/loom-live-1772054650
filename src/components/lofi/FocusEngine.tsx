import React, { useEffect, useRef } from 'react';
import { useLofiStore } from '../../store/lofiStore';

const FocusEngine: React.FC = () => {
  const timer = useLofiStore((state) => state.timer);
  const activeSession = useLofiStore((state) => state.activeSession);
  const isPlaying = useLofiStore((state) => state.isPlaying);
  const initialTimer = useLofiStore((state) => state.initialTimer);
  const togglePlay = useLofiStore((state) => state.togglePlay);
  const setSession = useLofiStore((state) => state.setSession);
  const resetTimer = useLofiStore((state) => state.resetTimer);
  const tickTimer = useLofiStore((state) => state.tickTimer);

  // Use requestAnimationFrame for the timer loop
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  const animate = (time: number) => {
    if (startTimeRef.current === undefined) {
      startTimeRef.current = time;
    }
    const progress = time - startTimeRef.current;

    if (progress >= 1000) {
      tickTimer();
      startTimeRef.current = time;
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying && timer > 0) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      startTimeRef.current = undefined;
    };
  }, [isPlaying, timer, tickTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const dashArray = 728;
  // Progress = 0 (full time) -> offset = 0
  // Progress = 1 (empty) -> offset = 728
  const progress = 1 - (timer / initialTimer);
  const circleDashOffset = progress * dashArray;

  return (
    <div className="flex-1 flex w-full relative z-20">
      <div className="hidden lg:block lg:w-2/3"></div>
      <div className="w-full lg:w-1/3 flex flex-col items-center justify-center lg:items-end lg:justify-start lg:pt-12">
        <div className="glass-panel rounded-2xl p-8 w-full max-w-md flex flex-col items-center relative overflow-hidden transition-all hover:border-amber-400/30">
          <div className="relative size-64 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border border-amber-500/10"></div>
            <svg className="absolute inset-0 size-full -rotate-90 transform glow-ring rounded-full" viewBox="0 0 256 256">
              <circle cx="128" cy="128" fill="none" r="116" stroke="#422006" strokeWidth="2"></circle>
              <circle 
                className="drop-shadow-[0_0_12px_rgba(255,160,0,0.6)] transition-all duration-1000 ease-linear" 
                cx="128" cy="128" 
                fill="none" 
                r="116" 
                stroke="#FFB74D" 
                strokeDasharray={dashArray} 
                strokeDashoffset={circleDashOffset} 
                strokeLinecap="round" 
                strokeWidth="3"
              ></circle>
            </svg>
            <div className="flex flex-col items-center z-10">
              <span className="text-7xl font-light text-amber-50 tracking-tighter tabular-nums text-glow font-numeric" style={{ fontFeatureSettings: "'tnum' on, 'lnum' on" }}>
                {formatTime(timer)}
              </span>
              <span className="text-primary text-xs uppercase tracking-[0.2em] mt-2 font-bold text-amber-200/80 font-display">
                {activeSession} Mode
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 w-full justify-center">
            <button 
              onClick={resetTimer}
              className="text-amber-200/60 hover:text-amber-50 transition-colors p-2 rounded-full hover:bg-amber-500/10"
            >
              <span className="material-symbols-outlined text-2xl">replay</span>
            </button>
            <button 
              onClick={togglePlay}
              className="h-14 w-14 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shadow-[0_0_25px_rgba(255,183,77,0.4)] hover:scale-105 active:scale-95 transition-transform hover:bg-white"
            >
              <span className="material-symbols-outlined text-3xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button 
              onClick={() => { if(isPlaying) togglePlay(); resetTimer(); }} 
              className="text-amber-200/60 hover:text-amber-50 transition-colors p-2 rounded-full hover:bg-amber-500/10"
            >
              <span className="material-symbols-outlined text-2xl">stop</span>
            </button>
          </div>
          <div className="flex bg-black/20 rounded-lg p-1 mt-8 w-full">
            {(['focus', 'short', 'long'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSession(mode)}
                className={`flex-1 py-2 text-xs font-bold rounded shadow-sm transition-all capitalize
                  ${activeSession === mode 
                    ? 'text-amber-950 bg-amber-100/90' 
                    : 'text-amber-200/60 hover:text-amber-100'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusEngine;
