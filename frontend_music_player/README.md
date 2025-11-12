# Ocean Music Player (Frontend)

Minimalist React UI for a web-based music player following the Ocean Professional style.

## Quick Start

1. Install dependencies
   npm install

2. Configure environment
   Create a `.env` file (see `.env.example`) and set one of:
   - REACT_APP_API_BASE
   - REACT_APP_BACKEND_URL
   If none are set, the app defaults to http://localhost:3001

3. Run
   npm start

App runs at http://localhost:3000

## Environment Variables

- REACT_APP_API_BASE: Preferred base URL of backend (e.g., http://localhost:3001)
- REACT_APP_BACKEND_URL: Fallback base URL of backend

## Features

- Track list with now-playing highlight
- Play/Pause, Next/Previous
- Seek with time display
- Env-driven backend connectivity
- Minimal Ocean theme

## Notes

- Backend must enable CORS for http://localhost:3000
- Track streaming uses /api/stream/:id endpoint
