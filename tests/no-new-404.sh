#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="${1:-frontend.log}"

if [ ! -f "$LOG_FILE" ]; then
  echo "⚠️ Log file not found: $LOG_FILE"
  echo "Skipping no-new-404 check"
  exit 0
fi

echo "===== NO NEW 404 QA ====="

tail -120 "$LOG_FILE" | grep 'code 404\| HTTP/1.1" 404 ' && {
  echo "❌ QA FAIL: 404 found in latest frontend log window"
  exit 1
}

echo "✅ No 404 found in latest frontend log window"
