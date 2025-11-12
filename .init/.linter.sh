#!/bin/bash
cd /home/kavia/workspace/code-generation/music-library-web-player-223622-223668/frontend_music_player
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

