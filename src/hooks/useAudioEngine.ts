import { useEffect, useRef } from 'react';
import { useLofiStore } from '../store/lofiStore';

export const useAudioEngine = () => {
  const audioStems = useLofiStore((state) => state.audioStems);
  const isPlaying = useLofiStore((state) => state.isPlaying);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Memoize stem IDs to trigger initialization only when composition changes
  const stemIds = audioStems.map(s => s.id).join(',');
  
  // 1. Initialization Effect: Only runs when the composition of stems changes (IDs)
  useEffect(() => {
    const currentIds = new Set(audioStems.map(s => s.id));

    // Cleanup removed stems
    Object.keys(audioRefs.current).forEach(id => {
      if (!currentIds.has(id)) {
        const audio = audioRefs.current[id];
        audio.pause();
        audio.src = ''; // Release memory
        delete audioRefs.current[id];
      }
    });

    // Initialize new stems
    audioStems.forEach((stem) => {
      if (!audioRefs.current[stem.id] && stem.src) {
        const audio = new Audio(stem.src);
        audio.loop = true;
        audioRefs.current[stem.id] = audio;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stemIds]); 
  
  // 2. Volume & Playback Sync Effect: Runs on volume/playback changes
  useEffect(() => {
    audioStems.forEach((stem) => {
      const audio = audioRefs.current[stem.id];
      if (audio) {
        // Update volume
        const targetVolume = stem.muted ? 0 : stem.volume / 100;
        if (Math.abs(audio.volume - targetVolume) > 0.001) {
            audio.volume = targetVolume;
        }

        // Sync playback state
        if (isPlaying) {
          if (audio.paused) {
             const playPromise = audio.play();
             if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Auto-play was prevented or src is invalid
                });
             }
          }
        } else {
          if (!audio.paused) {
            audio.pause();
          }
        }
      }
    });
  }, [audioStems, isPlaying]);

  // Global Cleanup
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = {};
    };
  }, []);
};
