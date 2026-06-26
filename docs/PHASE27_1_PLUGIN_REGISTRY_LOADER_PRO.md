# Phase-27.1 — Plugin Registry + Feature Loader Pro

No-React Lite Pro shell now has a lazy plugin runtime.

## Added
- `frontend/js/feature-registry.js`
- `frontend/js/feature-manifest.js`
- `frontend/js/features/*.feature.js`
- Plugin Hub module
- Plugin health check
- Version bump to 27.1.0

## Safety
- No React.
- No Vite bundle dependency.
- Features load on demand only.
- Feature failure falls back inside Feature Host; full app does not crash.
- Final prediction remains locked.
