import React from "react";
import { usePlayer } from "../context/PlayerContext";

function formatTime(totalSec) {
  if (!totalSec && totalSec !== 0) return "--:--";
  const s = Math.floor(totalSec % 60).toString().padStart(2, "0");
  const m = Math.floor(totalSec / 60).toString();
  return `${m}:${s}`;
}

// PUBLIC_INTERFACE
export default function TrackList() {
  /** Displays track list; clicking sets current track and starts playback. */
  const { tracks, loading, error, currentIndex, controls } = usePlayer();

  if (loading) {
    return (
      <div className="card" style={{ padding: 16 }}>
        Loading tracks…
      </div>
    );
  }
  if (error) {
    return (
      <div className="card" style={{ padding: 16, color: "#EF4444" }}>
        {error}
      </div>
    );
  }
  if (!tracks.length) {
    return (
      <div className="card" style={{ padding: 16 }}>
        No tracks available.
      </div>
    );
  }

  return (
    <div className="card">
      <div className="list" role="list">
        {tracks.map((t, idx) => (
          <button
            key={t.id}
            className={`list-item ${idx === currentIndex ? "active" : ""}`}
            onClick={() => {
              const event = new CustomEvent("player:providerSetIndex", { detail: idx });
              window.dispatchEvent(event);
              setTimeout(() => controls.play(), 0);
            }}
            role="listitem"
          >
            <div className="track-index">{idx + 1}</div>
            <div className="track-meta">
              <div className="track-title">{t.title}</div>
              <div className="track-artist">{t.artist}</div>
            </div>
            <div className="track-duration">
              {t.duration ? formatTime(t.duration) : "—"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
