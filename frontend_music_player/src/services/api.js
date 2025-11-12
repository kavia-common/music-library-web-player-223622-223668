const base =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:3001";

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns the resolved API base URL from environment variables or default. */
  return base.replace(/\/+$/, "");
}

// PUBLIC_INTERFACE
export async function fetchTracks(signal) {
  /** Fetch list of tracks from backend. */
  const res = await fetch(`${getApiBase()}/api/tracks`, { signal });
  if (!res.ok) throw new Error(`Failed to load tracks (${res.status})`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function fetchTrackDetail(id, signal) {
  /** Fetch single track details by id. */
  const res = await fetch(`${getApiBase()}/api/tracks/${id}`, { signal });
  if (!res.ok) throw new Error(`Track not found (${res.status})`);
  return res.json();
}

// PUBLIC_INTERFACE
export function getStreamUrl(id) {
  /** Get the URL to stream audio from backend for a given track id. */
  return `${getApiBase()}/api/stream/${id}`;
}
