import React, { useEffect } from "react";
import "./App.css";
import "./theme.css";
import Header from "./components/Header";
import TrackList from "./components/TrackList";
import PlayerControls from "./components/PlayerControls";
import { PlayerProvider } from "./context/PlayerContext";

// PUBLIC_INTERFACE
export default function App() {
  /** Root application rendering the music player with global state provider. */
  useEffect(() => {
    document.title = "Ocean Music Player";
  }, []);

  return (
    <PlayerProvider>
      <div className="app-shell">
        <Header />
        <main className="main">
          <TrackList />
        </main>
        <PlayerControls />
      </div>
    </PlayerProvider>
  );
}
