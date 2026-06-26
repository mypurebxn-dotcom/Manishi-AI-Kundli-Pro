#!/usr/bin/env bash
set -u
ROOT="$HOME/manishi-ai-kundli-pro-starter"
PHASE="${1:-phase27-1}"
PORT="${2:-5173}"
URL="http://127.0.0.1:${PORT}/index.html?v=${PHASE}&fresh=$(date +%s)"
cd "$ROOT" || { echo "Project folder missing: $ROOT"; exit 1; }
mkdir -p logs
bash "$ROOT/scripts/stop-app.sh" 2>/dev/null || true

echo "===== START BACKEND ====="
cd "$ROOT/backend" || exit 1
nohup node server.js > "$ROOT/logs/backend.log" 2>&1 &
echo $! > "$ROOT/logs/backend.pid"
BACKEND_OK=0
for i in $(seq 1 15); do
  if curl -fsS "http://127.0.0.1:8787/api/health" >/dev/null 2>&1; then BACKEND_OK=1; break; fi
  sleep 1
done
if [ "$BACKEND_OK" != "1" ]; then
  echo "Backend failed"; tail -80 "$ROOT/logs/backend.log"; exit 1
fi
echo "Backend OK: http://127.0.0.1:8787"

echo "===== START FRONTEND STATIC ====="
cd "$ROOT/frontend" || exit 1
nohup python3 -m http.server "$PORT" --bind 127.0.0.1 > "$ROOT/logs/frontend.log" 2>&1 &
echo $! > "$ROOT/logs/frontend.pid"
FRONTEND_OK=0
for i in $(seq 1 10); do
  if curl -fsSI "http://127.0.0.1:${PORT}/index.html" >/dev/null 2>&1; then FRONTEND_OK=1; break; fi
  sleep 1
done
if [ "$FRONTEND_OK" != "1" ]; then
  echo "Frontend failed"; tail -80 "$ROOT/logs/frontend.log"; exit 1
fi
echo "===== APP READY ====="
echo "$URL"
if command -v termux-open-url >/dev/null 2>&1; then termux-open-url "$URL" >/dev/null 2>&1 || true; fi
