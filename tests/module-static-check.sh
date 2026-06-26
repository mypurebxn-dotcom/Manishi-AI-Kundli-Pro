#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "❌ QA FAIL: $1"
  exit 1
}

pass() {
  echo "✅ $1"
}

echo "===== MODULE STATIC QA ====="

required_files=(
  "frontend/js/feature-manifest.js"
  "frontend/js/feature-registry.js"
  "frontend/js/features/kundli.feature.js"
  "frontend/js/features/panchang.feature.js"
  "frontend/js/features/dasha.feature.js"
  "frontend/js/features/dosha-remedy.feature.js"
  "frontend/js/features/report.feature.js"
  "frontend/js/features/qa-console.feature.js"
  "frontend/js/charts/chart-data.js"
  "frontend/js/charts/chart-engine.js"
  "frontend/js/charts/chart-renderer.js"
  "frontend/js/charts/chart-module.js"
  "frontend/js/charts/chart-qa.js"
  "frontend/js/charts/chart-svg.js"
  "frontend/js/charts/chart-svg-north.js"
)

for f in "${required_files[@]}"; do
  [ -s "$f" ] || fail "missing or empty file: $f"
done
pass "required module files exist"

for id in kundli panchang dasha dosha_remedy report_pro qa_console; do
  grep -q "id:'$id'" frontend/js/feature-manifest.js || fail "manifest missing feature id: $id"
done
pass "manifest feature ids present"

grep -q "APP.features = " frontend/js/feature-registry.js || fail "APP.features export missing"
grep -q "installManifest" frontend/js/feature-registry.js || fail "installManifest missing"
grep -q "loadScript" frontend/js/feature-registry.js || fail "loadScript missing"
pass "feature registry core API present"

grep -q "chart-engine" frontend/index.html || fail "chart-engine not loaded in index.html"
grep -q "chart-renderer" frontend/index.html || fail "chart-renderer not loaded in index.html"
grep -q "chart-module" frontend/index.html || fail "chart-module not loaded in index.html"
pass "chart scripts referenced in index.html"

echo "===== QA RESULT ====="
echo "✅ Module static QA passed"
