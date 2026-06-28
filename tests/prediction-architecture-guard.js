'use strict';

// ===========================================================================
// Prediction Architecture Guard QA
//
// Verifies the backend/prediction/ subsystem exists with the correct shape:
//   1. backend/prediction/ directory exists
//   2. index.js exists and exports run()
//   3. contract.js exists and exports emptyResult()
//   4. the 11 required dasha/rules/evidence modules exist
//   5. pipeline run() output is structured JSON (arrays + number confidence)
//   6. no frontend/js/prediction folder exists (backend-only)
//   7. no LLM / OpenAI / fetch / http call is used inside backend/prediction
//
// Mirrors the output style of chart-architecture-guard.sh (✅/❌, QA RESULT).
// Node-based because requirements 2,3,5 require runtime module checks.
// ===========================================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRED_DIR = path.join(ROOT, 'backend', 'prediction');

let issues = 0;
function fail(msg) { issues++; console.log('❌ ' + msg); }
function pass(msg) { console.log('✅ ' + msg); }

console.log('===== PREDICTION ARCHITECTURE GUARD QA =====');

// (1) backend/prediction/ exists
if (fs.existsSync(PRED_DIR) && fs.statSync(PRED_DIR).isDirectory()) {
  pass('backend/prediction/ directory exists');
} else {
  fail('backend/prediction/ directory missing');
}

// (2) index.js exists and exports run()
let indexMod = null;
try {
  indexMod = require('../backend/prediction');
} catch (e) {
  fail('cannot load backend/prediction/index.js: ' + e.message);
}
if (indexMod && typeof indexMod.run === 'function') {
  pass('index.js exports run()');
} else if (indexMod) {
  fail('index.js does not export a run() function');
}

// (3) contract.js exists and exports emptyResult()
let contractMod = null;
try {
  contractMod = require('../backend/prediction/contract');
} catch (e) {
  fail('cannot load backend/prediction/contract.js: ' + e.message);
}
if (contractMod && typeof contractMod.emptyResult === 'function') {
  pass('contract.js exports emptyResult()');
} else if (contractMod) {
  fail('contract.js does not export an emptyResult() function');
}

// (4) required modules exist
const REQUIRED_MODULES = [
  'dasha/mahadasha',
  'dasha/antardasha',
  'dasha/pratyantar',
  'rules/bhavesh-rules',
  'rules/lordship-rules',
  'rules/yoga-rules',
  'rules/dosha-rules',
  'rules/transit-rules',
  'evidence/confidence-score',
  'evidence/contradiction-detector',
  'evidence/evidence-collector'
];
let modulesOk = true;
for (const rel of REQUIRED_MODULES) {
  const file = path.join(PRED_DIR, rel + '.js');
  if (!fs.existsSync(file)) {
    modulesOk = false;
    fail('missing required module: backend/prediction/' + rel + '.js');
  }
}
if (modulesOk) pass('all 11 required modules exist');

// (5) pipeline output is structured JSON
if (indexMod && typeof indexMod.run === 'function') {
  let result = null;
  try {
    // Minimal calculation object (output shape of astrologyEngine.executeCalculation)
    result = indexMod.run({
      lagna: { rashi_num: 1 },
      planets: [{ name: 'Sun', rashi_num: 1 }],
      houses: [],
      dasha: { current_mahadasha: { planet: 'Venus' }, full_timeline: [] }
    });
  } catch (e) {
    fail('pipeline run() threw: ' + e.message);
  }
  if (result) {
    const checks = [
      [Array.isArray(result.triggered_rules), 'triggered_rules is array'],
      [Array.isArray(result.evidence), 'evidence is array'],
      [Array.isArray(result.prediction_tags), 'prediction_tags is array'],
      [typeof result.confidence === 'number', 'confidence is number']
    ];
    let shapeOk = true;
    for (const [ok, label] of checks) {
      if (!ok) { shapeOk = false; fail('pipeline output field invalid: ' + label); }
    }
    if (shapeOk) pass('pipeline output is structured JSON (arrays + number confidence)');
  }
}

// (6) no frontend/js/prediction folder exists (backend-only subsystem)
const frontendPredDir = path.join(ROOT, 'frontend', 'js', 'prediction');
if (!fs.existsSync(frontendPredDir)) {
  pass('no frontend/js/prediction folder (backend-only)');
} else {
  fail('frontend/js/prediction folder must not exist (backend-only subsystem)');
}

// (7) no LLM / OpenAI / fetch / http call inside backend/prediction
// Scan ACTUAL CODE only: comments are stripped first so documentation that
// asserts "never LLM" does not false-positive. Real usage (require/import of
// an LLM or network module, fetch(), XMLHttpRequest, new OpenAI()) trips it.
const FORBIDDEN = /(require\s*\(\s*['"](openai|anthropic|http|https|node-fetch|axios|got|request)['"]|import\s+[^;]*\bfrom\s*['"](openai|anthropic|http|https|node-fetch|axios|got|request)['"]|fetch\s*\(|XMLHttpRequest|new\s+OpenAI\b|new\s+Anthropic\b|new\s+ChatGPT\b)/i;

// Strip JS comments (// line and /* block */) from source before scanning,
// and skip string contents, so documentation does not false-positive.
function stripComments(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const two = src.slice(i, i + 2);
    if (two === '//') {
      while (i < n && src[i] !== '\n') i++;
    } else if (two === '/*') {
      i += 2;
      while (i < n && src.slice(i, i + 2) !== '*/') i++;
      i += 2;
    } else if (src[i] === '"' || src[i] === "'" || src[i] === '`') {
      const q = src[i];
      out += src[i++];
      while (i < n && src[i] !== q) {
        if (src[i] === '\\') { out += src[i++]; if (i < n) out += src[i++]; }
        else out += src[i++];
      }
      if (i < n) out += src[i++];
    } else {
      out += src[i++];
    }
  }
  return out;
}

let scanOk = true;
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(full);
    } else if (entry.isFile() && full.endsWith('.js')) {
      const code = stripComments(fs.readFileSync(full, 'utf8'));
      const m = code.match(FORBIDDEN);
      if (m) {
        scanOk = false;
        fail('forbidden network/LLM usage "' + m[0].trim() + '" in ' + path.relative(ROOT, full));
      }
    }
  }
}
if (fs.existsSync(PRED_DIR)) scan(PRED_DIR);
if (scanOk) pass('no LLM/fetch/http call inside backend/prediction (code-only scan)');

// Result
console.log('===== QA RESULT =====');
if (issues) {
  console.log('❌ Prediction architecture guard QA failed issues=' + issues);
  process.exit(1);
}
console.log('✅ Prediction architecture guard QA passed');
