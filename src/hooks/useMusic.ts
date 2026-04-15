import { useEffect, useRef, useState, useCallback } from 'react';
import { musicEngine } from '../services/musicService';
import type { TrackName } from '../services/musicService';

/**
 * React hook for managing chiptune music playback.
 * Plays the given track on mount, stops on unmount or when track changes.
 */
export function useMusic(track: TrackName | null) {
  const [muted, setMuted] = useState(musicEngine.muted);
  const [volume, setVolume] = useState(musicEngine.volume);
  const prevTrack = useRef<string | null>(null);

  useEffect(() => {
    if (track) {
      musicEngine.play(track);
    } else {
      musicEngine.stop();
    }
    prevTrack.current = track;

    return () => {
      // Only stop if this hook was the one playing
      if (musicEngine.track === track) {
        musicEngine.stop();
      }
    };
  }, [track]);

  const toggleMute = useCallback(() => {
    const newMuted = musicEngine.toggleMute();
    setMuted(newMuted);
  }, []);

  const changeVolume = useCallback((vol: number) => {
    musicEngine.setVolume(vol);
    setVolume(vol);
  }, []);

  return { muted, toggleMute, volume, changeVolume };
}
