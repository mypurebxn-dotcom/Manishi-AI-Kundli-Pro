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
// Rule Engine Core (Phase 30):
//   8.  rule.js exports normalizeRule / emptyRuleResult / isValidRuleResult
//   8b. emptyRuleResult() exact output shape (7 fields, strict types)
//   9.  registry.js exports RuleRegistry (register/get/list/byCategory)
//   10. normalizeRule yields canonical 8-field rule shape
//   11. priority ordering (lower priority runs first)
//   12. dependency resolution (requires[] honored; cycle detection)
//   13. input validation gate (rule skipped when validate() not ok)
//   14. conflict markers carried (conflictsWith -> output conflicts)
//   15. deterministic merge (ordered triggered_rules, deduped tags)
//
// Mirrors the output style of chart-architecture-guard.sh (✅/❌, QA RESULT).
// Node-based because these require runtime module + behavior checks.
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

// ===========================================================================
// Rule Engine Core (Phase 30): rule.js + registry.js + behavior checks.
// These use synthetic plumbing-only rules (NO astrology logic) to prove the
// framework scales to many fine-grained registered rules.
// ===========================================================================

// (8) rule.js exists and exports normalizeRule / emptyRuleResult / isValidRuleResult
let ruleMod = null;
try { ruleMod = require('../backend/prediction/rule'); }
catch (e) { fail('cannot load backend/prediction/rule.js: ' + e.message); }
if (ruleMod) {
  const need = ['normalizeRule', 'emptyRuleResult', 'isValidRuleResult'];
  const missing = need.filter(k => typeof ruleMod[k] !== 'function');
  if (missing.length) fail('rule.js missing exports: ' + missing.join(', '));
  else pass('rule.js exports normalizeRule/emptyRuleResult/isValidRuleResult');
}

// (8b) emptyRuleResult() exact output shape: 7 fields, strict types.
if (ruleMod && typeof ruleMod.emptyRuleResult === 'function') {
  let er = null;
  try { er = ruleMod.emptyRuleResult(); }
  catch (e) { fail('emptyRuleResult() threw: ' + e.message); }
  if (er) {
    const checks = [
      [typeof er.rule_id === 'string', 'emptyRuleResult.rule_id is string'],
      [typeof er.triggered === 'boolean', 'emptyRuleResult.triggered is boolean'],
      [typeof er.weight === 'number', 'emptyRuleResult.weight is number'],
      [typeof er.description === 'string', 'emptyRuleResult.description is string'],
      [Array.isArray(er.evidence), 'emptyRuleResult.evidence is array'],
      [Array.isArray(er.conflicts), 'emptyRuleResult.conflicts is array'],
      [Array.isArray(er.tags), 'emptyRuleResult.tags is array']
    ];
    let shapeOk = true;
    for (const [ok, label] of checks) {
      if (!ok) { shapeOk = false; fail('emptyRuleResult shape invalid: ' + label); }
    }
    if (shapeOk) pass('emptyRuleResult() exact output shape (7 fields, strict types)');
  }
}

// (9) registry.js exports RuleRegistry (register/get/list/byCategory/has)
let Registry = null;
try { Registry = require('../backend/prediction/registry'); }
catch (e) { fail('cannot load backend/prediction/registry.js: ' + e.message); }
let regOk = false;
if (Registry) {
  try {
    const r = (typeof Registry === 'function') ? new Registry() : Registry.create();
    const need = ['register', 'get', 'list', 'byCategory', 'has'];
    const missing = need.filter(k => typeof r[k] !== 'function');
    if (missing.length) fail('RuleRegistry missing methods: ' + missing.join(', '));
    else { regOk = true; pass('registry.js exports RuleRegistry (register/get/list/byCategory/has)'); }
  } catch (e) { fail('RuleRegistry not usable: ' + e.message); }
}

// Helpers to build synthetic plumbing rules (no astrology).
function mkRule(id, opts) {
  opts = opts || {};
  return {
    id: id,
    category: opts.category || 'meta',
    priority: opts.priority != null ? opts.priority : 100,
    weight: opts.weight != null ? opts.weight : 0,
    requires: opts.requires || [],
    conflictsWith: opts.conflictsWith || [],
    validate: opts.validate || function () { return { ok: true }; },
    evaluate: opts.evaluate || function () { return ruleMod.emptyRuleResult(); }
  };
}

// (10) normalizeRule yields canonical 8-field rule shape with defaults
if (ruleMod) {
  try {
    const n = ruleMod.normalizeRule(mkRule('meta:test'));
    const fields = ['id', 'category', 'priority', 'weight', 'requires', 'conflictsWith', 'validate', 'evaluate'];
    const missing = fields.filter(f => !(f in n));
    const types =
      typeof n.id === 'string' &&
      typeof n.category === 'string' &&
      typeof n.priority === 'number' &&
      typeof n.weight === 'number' &&
      Array.isArray(n.requires) &&
      Array.isArray(n.conflictsWith) &&
      typeof n.validate === 'function' &&
      typeof n.evaluate === 'function';
    if (missing.length || !types) fail('normalizeRule did not produce canonical 8-field rule shape');
    else pass('normalizeRule yields canonical 8-field rule shape');
  } catch (e) { fail('normalizeRule threw: ' + e.message); }
}

// (11)-(15) behavior checks: build a registry, run the engine, inspect output.
if (ruleMod && regOk) {
  try {
    const r = (typeof Registry === 'function') ? new Registry() : Registry.create();

    // Register a dependency graph: low runs first, high depends on low, skip
    // has a failing validate(), conflict carries a conflict marker.
    r.register(mkRule('meta:low', { priority: 10, weight: 0.2, evaluate: function () {
      var x = ruleMod.emptyRuleResult(); x.triggered = true; x.weight = 0.2;
      x.description = 'low'; x.tags = ['dup', 'low']; return x;
    } }));
    r.register(mkRule('meta:high', { priority: 50, weight: 0.3, requires: ['meta:low'], evaluate: function () {
      var x = ruleMod.emptyRuleResult(); x.triggered = true; x.weight = 0.3;
      x.description = 'high'; x.tags = ['dup', 'high']; return x;
    } }));
    r.register(mkRule('meta:skip', { priority: 20, validate: function () { return { ok: false, errors: ['no-input'] }; } }));
    r.register(mkRule('meta:conflict', { priority: 30, conflictsWith: ['meta:high'], evaluate: function () {
      var x = ruleMod.emptyRuleResult(); x.triggered = true; x.weight = 0.1;
      x.description = 'conflict'; x.tags = ['cf']; return x;
    } }));

    const ordered = r.orderedList ? r.orderedList() : r.list();

    // (11) priority ordering: low (10) before high (50)
    const lowIdx = ordered.findIndex(function (x) { return x.id === 'meta:low'; });
    const highIdx = ordered.findIndex(function (x) { return x.id === 'meta:high'; });
    if (lowIdx >= 0 && highIdx >= 0 && lowIdx < highIdx) pass('priority ordering (lower priority runs first)');
    else fail('priority ordering not honored (low=' + lowIdx + ', high=' + highIdx + ')');

    // (12) dependency resolution: high requires low -> low before high
    if (lowIdx >= 0 && highIdx >= 0 && lowIdx < highIdx) pass('dependency resolution (requires[] honored)');
    else fail('dependency resolution failed');

    // (12b) cycle detection: registering a cycle must throw/reject.
    // Uses a SEPARATE registry so it cannot pollute the run below.
    let cycleCaught = false;
    try {
      var cReg = (typeof Registry === 'function') ? new Registry() : Registry.create();
      cReg.register(mkRule('meta:cycA', { priority: 1, requires: ['meta:cycB'] }));
      cReg.register(mkRule('meta:cycB', { priority: 1, requires: ['meta:cycA'] }));
      if (cReg.orderedList) cReg.orderedList(); else cReg.list();
    } catch (e) { cycleCaught = true; }
    if (cycleCaught) pass('cycle detection (cyclic requires rejected)');
    else fail('cyclic dependency was not detected');

    // (13)-(15) run the engine on this registry and inspect the merged output.
    var engine = require('../backend/prediction/rule-engine');
    var out = engine.runWithRegistry ? engine.runWithRegistry(r, {}) : engine.runRegistry(r, {});
    if (!out || !Array.isArray(out.triggered_rules)) {
      fail('rule-engine cannot run a custom registry');
    } else {
      // (13) input validation gate: meta:skip must NOT appear in triggered_rules
      const skipTriggered = out.triggered_rules.some(function (t) { return t.id === 'meta:skip'; });
      if (!skipTriggered) pass('input validation gate (invalid-input rule skipped)');
      else fail('invalid-input rule was not skipped');

      // (14) conflict markers carried into output conflicts[]
      if (Array.isArray(out.conflicts) && out.conflicts.length > 0) pass('conflict markers carried (conflictsWith -> conflicts)');
      else fail('conflict markers not carried into output conflicts[]');

      // (15) deterministic merge: tags deduped ('dup' appears once)
      if (Array.isArray(out.prediction_tags)) {
        const dupCount = out.prediction_tags.filter(function (t) { return t === 'dup'; }).length;
        if (dupCount === 1) pass('deterministic merge (tags deduped)');
        else fail('prediction tags not deduped (dup count=' + dupCount + ')');
      } else {
        fail('prediction_tags missing on registry run output');
      }
    }
  } catch (e) {
    fail('Rule Engine Core behavior checks threw: ' + e.message);
  }
}

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
