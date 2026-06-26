#!/usr/bin/env bash
set -euo pipefail

echo "===== CHART ARCHITECTURE GUARD QA ====="

fail(){
  echo "❌ $1"
  exit 1
}

pass(){
  echo "✅ $1"
}

# Renderer/SVG files must not fetch API or build chart data directly.
DRAW_ONLY_FILES=(
  "frontend/js/charts/chart-svg-north.js"
  "frontend/js/charts/chart-svg-south.js"
  "frontend/js/charts/chart-svg-east.js"
  "frontend/js/charts/chart-svg.js"
)

for f in "${DRAW_ONLY_FILES[@]}"; do
  [ -f "$f" ] || fail "missing draw-only file: $f"

  if grep -nE "chartData\.build|chartEngine\.build|getCalculation|fetch[[:space:]]*\(|XMLHttpRequest|/api/|localStorage|sessionStorage" "$f"; then
    fail "$f must remain draw-only and must not access API/storage/chart builders"
  fi

  pass "$f draw-only contract"
done

# chart-renderer may call chartEngine.build exactly as the boundary.
grep -q "APP.chartEngine.build(type)" frontend/js/charts/chart-renderer.js \
  || fail "chart-renderer must use APP.chartEngine.build(type) as the single data boundary"
pass "chart-renderer uses chartEngine boundary"

# chart-renderer must expose layout registry.
grep -q "registerLayout: registerLayout" frontend/js/charts/chart-renderer.js \
  || fail "chart-renderer must expose registerLayout"
grep -q "layouts: LAYOUTS" frontend/js/charts/chart-renderer.js \
  || fail "chart-renderer must expose layouts registry"
pass "layout registry exposed"

# North layout must be registered through adapter, not by chart-module.
grep -q "registerLayout('north', APP.chartSVG.renderNorth" frontend/js/charts/chart-renderer.js \
  || fail "north layout must be registered via APP.chartSVG.renderNorth"
pass "north layout registration contract"

grep -q "registerLayout('south', APP.chartSVG.renderSouth" frontend/js/charts/chart-renderer.js \
  || fail "south layout must be registered via APP.chartSVG.renderSouth"
pass "south layout registration contract"

grep -q "registerLayout('east', APP.chartSVG.renderEast" frontend/js/charts/chart-renderer.js \
  || fail "east layout must be registered via APP.chartSVG.renderEast"
pass "east layout registration contract"

# chart-module must not call SVG renderers directly.
if grep -nE "chartSVG|chartSVGNorth|renderNorth" frontend/js/charts/chart-module.js; then
  fail "chart-module must not call SVG renderers directly"
fi
pass "chart-module does not call SVG renderers directly"

# chart-module must render through chartRenderer only.
grep -q "APP.chartRenderer.render(item.type, item.layout || 'north')" frontend/js/charts/chart-module.js \
  || fail "chart-module must render through APP.chartRenderer.render"
pass "chart-module renderer boundary"

echo "===== QA RESULT ====="
echo "✅ Chart architecture guard QA passed"
