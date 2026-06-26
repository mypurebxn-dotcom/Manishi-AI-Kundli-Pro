#!/usr/bin/env bash
set -euo pipefail

FRONTEND_PORT="${1:-5173}"
FRONTEND_URL="http://127.0.0.1:${FRONTEND_PORT}"
BACKEND_URL="http://127.0.0.1:8787"

fail() {
  echo "❌ QA FAIL: $1"
  exit 1
}

pass() {
  echo "✅ $1"
}

check_url_200() {
  local url="$1"
  local code
  code="$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)"
  [ "$code" = "200" ] || fail "$url returned HTTP $code"
  pass "$url -> 200"
}

echo "===== REGRESSION SMOKE QA ====="

check_url_200 "$FRONTEND_URL/index.html"
check_url_200 "$FRONTEND_URL/service-worker.js"
check_url_200 "$FRONTEND_URL/favicon.ico"
check_url_200 "$FRONTEND_URL/manifest.json"
check_url_200 "$BACKEND_URL/api/health"

grep -q 'rel="icon"' frontend/index.html || fail "favicon link missing in index.html"
grep -q 'rel="manifest"' frontend/index.html || fail "manifest link missing in index.html"

[ -f frontend/service-worker.js ] || fail "frontend/service-worker.js missing"
[ -f frontend/favicon.ico ] || fail "frontend/favicon.ico missing"

echo "===== QA RESULT ====="
echo "✅ Regression smoke QA passed"
