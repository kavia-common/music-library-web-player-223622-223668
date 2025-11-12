import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchTracks, getStreamUrl } from "../services/api";

const PlayerCtx = createContext(null);

// PUBLIC_INTERFACE
export function usePlayer() {
  /** Access the global player context. */
  return useContext(PlayerCtx);
}

// PUBLIC_INTERFACE
export function PlayerProvider({ children }) {
  /**
   * Provides global state for music player:
   * - tracks: array of track metadata
   * - currentIndex: index of now-playing track
   * - isPlaying: boolean
   * - controls: play/pause/next/prev/seek
   */
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(0); // seconds

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    fetchTracks(ctrl.signal)
      .then((data) => {
        setTracks(data || []);
        setCurrentIndex(0);
        setError("");
      })
      .catch((e) => setError(e.message || "Failed to load tracks"))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  // Load source on track change
  useEffect(() => {
    const audio = audioRef.current;
    if (!tracks.length) return;
    const current = tracks[currentIndex];
    const src = current?.url || getStreamUrl(current?.id);
    if (!src) return;
    const wasPlaying = isPlaying;

    audio.src = src;
    audio.load();

    if (wasPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, tracks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Attach audio events
  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setProgress(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnd = () => next();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []); // mount only

  const play = () => {
    const audio = audioRef.current;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const pause = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
  };

  const toggle = () => (isPlaying ? pause() : play());

  const next = () => {
    if (!tracks.length) return;
    setCurrentIndex((i) => (i + 1) % tracks.length);
  };

  const prev = () => {
    if (!tracks.length) return;
    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
  };

  const seek = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime = Math.max(0, Math.min(seconds, duration || seconds));
    setProgress(audio.currentTime);
  };

  // Allow external index set via custom event (used by TrackList)
  useEffect(() => {
    const handler = (e) => {
      const idx = typeof e.detail === "number" ? e.detail : 0;
      if (!Number.isFinite(idx)) return;
      if (!tracks.length) return;
      const clamped = Math.max(0, Math.min(idx, tracks.length - 1));
      setCurrentIndex(clamped);
      // auto play on change
      setTimeout(() => {
        try { audioRef.current.play(); setIsPlaying(true); } catch (_) {}
      }, 0);
    };
    window.addEventListener("player:providerSetIndex", handler);
    return () => window.removeEventListener("player:providerSetIndex", handler);
  }, [tracks]);

  const current = tracks[currentIndex] || null;

  const value = useMemo(
    () => ({
      tracks,
      loading,
      error,
      currentIndex,
      current,
      isPlaying,
      progress,
      duration,
      controls: { play, pause, toggle, next, prev, seek },
    }),
    [tracks, loading, error, currentIndex, current, isPlaying, progress, duration]
  );

  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}
