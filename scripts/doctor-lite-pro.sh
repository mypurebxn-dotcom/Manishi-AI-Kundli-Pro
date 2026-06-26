#!/usr/bin/env bash
set +e
PORT="${1:-5173}"
ROOT="$HOME/manishi-ai-kundli-pro-starter"
echo "===== URL CHECK ====="
echo "Frontend: http://127.0.0.1:${PORT}/index.html"
echo "Backend : http://127.0.0.1:8787/api/health"
echo "===== FRONTEND HEAD ====="
curl -I --max-time 5 "http://127.0.0.1:${PORT}/index.html" || echo "Frontend not responding"
echo "===== BACKEND HEALTH ====="
curl -s --max-time 5 "http://127.0.0.1:8787/api/health" || echo "Backend not responding"
echo ""
echo "===== FILES ====="
ls -lh "$ROOT/frontend/index.html" "$ROOT/backend/server.js" 2>/dev/null || true
echo "===== FRONTEND LOG ====="
tail -80 "$ROOT/logs/frontend.log" 2>/dev/null || echo "No frontend log"
echo "===== BACKEND LOG ====="
tail -80 "$ROOT/logs/backend.log" 2>/dev/null || echo "No backend log"

echo "===== PHASE 27.1 PLUGIN FILES ====="
ls -lh "$ROOT/frontend/js/feature-registry.js" "$ROOT/frontend/js/feature-manifest.js" 2>/dev/null || true
ls -lh "$ROOT/frontend/js/features"/*.feature.js 2>/dev/null || true

echo "===== PROCESSES ====="
ps -ef | grep -E "server.js|http.server|vite" | grep -v grep || true
