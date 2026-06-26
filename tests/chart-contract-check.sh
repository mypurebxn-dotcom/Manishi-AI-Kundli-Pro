#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "❌ QA FAIL: $1"
  exit 1
}

pass() {
  echo "✅ $1"
}

echo "===== CHART CONTRACT QA ====="

grep -q "function buildD1" frontend/js/charts/chart-data.js || fail "buildD1 missing"
grep -q "function buildD9" frontend/js/charts/chart-data.js || fail "buildD9 missing"
grep -q "function buildD10" frontend/js/charts/chart-data.js || fail "buildD10 missing"
grep -q "function buildD60" frontend/js/charts/chart-data.js || fail "buildD60 missing"
grep -q "D1: buildD1" frontend/js/charts/chart-data.js || fail "D1 builder not registered"
grep -q "D9: buildD9" frontend/js/charts/chart-data.js || fail "D9 builder not registered"
grep -q "D10: buildD10" frontend/js/charts/chart-data.js || fail "D10 builder not registered"
grep -q "D60: buildD60" frontend/js/charts/chart-data.js || fail "D60 builder not registered"
grep -q "APP.chartData = " frontend/js/charts/chart-data.js || fail "APP.chartData export missing"
pass "chart-data builders/export present"

grep -q "function bySign" frontend/js/charts/chart-engine.js || fail "bySign missing"
grep -q "APP.chartEngine = " frontend/js/charts/chart-engine.js || fail "APP.chartEngine export missing"
grep -q "signs:" frontend/js/charts/chart-engine.js || fail "chartEngine output signs missing"
pass "chart-engine contract present"

grep -q "registerLayout" frontend/js/charts/chart-renderer.js || fail "registerLayout missing"
grep -q "renderNorth" frontend/js/charts/chart-renderer.js || fail "north renderer hook missing"
grep -q "APP.chartRenderer = " frontend/js/charts/chart-renderer.js || fail "APP.chartRenderer export missing"
pass "chart-renderer contract present"

grep -q "registerChart('D1'" frontend/js/charts/chart-module.js || fail "D1 not registered in chart module"
grep -q "registerChart('D9'" frontend/js/charts/chart-module.js || fail "D9 not registered in chart module"
grep -q "APP.chartModule = " frontend/js/charts/chart-module.js || fail "APP.chartModule export missing"
pass "chart-module registry present"

grep -R -F "?." frontend/js/charts >/dev/null && fail "optional chaining found in chart files; avoid for Android/WebView compatibility"
pass "no optional chaining in chart files"

echo "===== QA RESULT ====="
echo "✅ Chart contract QA passed"
