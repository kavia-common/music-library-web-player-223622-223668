import React from "react";
import { usePlayer } from "../context/PlayerContext";

function formatTime(totalSec) {
  if (!totalSec && totalSec !== 0) return "0:00";
  const s = Math.floor(totalSec % 60).toString().padStart(2, "0");
  const m = Math.floor(totalSec / 60).toString();
  return `${m}:${s}`;
}

// PUBLIC_INTERFACE
export default function PlayerControls() {
  /** Bottom sticky controls with now playing, play/pause, next/prev, and seek bar. */
  const { current, isPlaying, progress, duration, controls } = usePlayer();

  const pct = duration ? Math.min(100, (progress / duration) * 100) : 0;
  const sliderBg = `linear-gradient(90deg, #3B82F6 0%, #93C5FD ${pct}%, #E5E7EB ${pct}%)`;

  return (
    <div className="player">
      <div className="player-inner">
        <div className="now-playing">
          <div className="title">{current?.title || "Nothing playing"}</div>
          <div className="artist">{current?.artist || "Select a track to start"}</div>
        </div>
        <div className="controls">
          <button className="btn" aria-label="Previous" onClick={controls.prev}>
            ⏮
          </button>
          <button
            className="btn primary"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={controls.toggle}
          >
            {isPlaying ? "⏸ Pause" : "▶️ Play"}
          </button>
          <button className="btn" aria-label="Next" onClick={controls.next}>
            ⏭
          </button>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress || 0}
            onChange={(e) => controls.seek(parseFloat(e.target.value))}
            className="slider"
            aria-label="Seek"
            style={{ background: sliderBg }}
          />
          <div className="time">
            {formatTime(progress)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
}
