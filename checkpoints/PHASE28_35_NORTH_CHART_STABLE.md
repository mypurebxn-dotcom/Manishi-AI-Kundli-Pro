# Phase 28.35 — North Chart Renderer Stable

Status: FROZEN_STABLE_V1

Evidence:
- npm run qa passed
- qa:charts:layout passed
- D1/D9 North Indian chart renders with Devanagari planet labels
- chart-svg-north.js loaded with cache version phase28-35
- Layout stress test covers 1–6 planets per house

Frozen files:
- frontend/js/charts/chart-svg-north.js
- frontend/js/charts/chart-renderer.js
- frontend/js/charts/chart-data.js
- frontend/js/charts/chart-engine.js
- frontend/js/charts/chart-module.js
- tests/chart-layout-debug.js

Rule:
Do not modify North renderer geometry without first updating/running qa:charts:layout.
