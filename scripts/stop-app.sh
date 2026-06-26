#!/usr/bin/env bash
set +e
pkill -f "manishi-ai-kundli-pro-starter/backend/server.js" 2>/dev/null || true
pkill -f "python3 -m http.server 5173" 2>/dev/null || true
pkill -f "python -m http.server 5173" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
if command -v fuser >/dev/null 2>&1; then
  fuser -k 8787/tcp 2>/dev/null || true
  fuser -k 5173/tcp 2>/dev/null || true
fi
echo "Manishi Lite Pro servers stopped."
