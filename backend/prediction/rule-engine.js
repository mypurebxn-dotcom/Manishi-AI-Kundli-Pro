'use strict';

// ===========================================================================
// Rule Engine Core (Phase 30).
//
// Runs registered rules in a deterministic order and merges their results
// into the shared PredictionResult contract:
//   1. order: topological by `requires` -> priority asc -> id asc (registry)
//   2. gate: skip any rule whose validate(ctx) is not ok
//   3. run:  call evaluate(ctx); a thrown error degrades to "not triggered"
//   4. merge (in execution order):
//        - triggered_rules: only triggered rules, in order
//        - evidence:        concatenated, in order
//        - prediction_tags: concatenated, de-duped (first wins)
//        - conflicts:       from conflictsWith markers + result conflicts
//
// Backward compatible: run(context) auto-wraps the existing dasha/rules
// modules as legacy rules, so index.js and the 8 stubs keep working unchanged.
// Pure plumbing. NO astrology logic.
// ===========================================================================

var contract = require('./contract');
var rule = require('./rule');
var RuleRegistry = require('./registry');

var emptyResult = contract.emptyResult;
var isValidRuleResult = rule.isValidRuleResult;

// Existing modules auto-registered as legacy rules (one rule each).
// Their evaluate() returns the legacy PredictionResult shape; coerceResult
// adapts it into a rule contribution.
var MODULES = [
  require('./dasha/mahadasha'),
  require('./dasha/antardasha'),
  require('./dasha/pratyantar'),
  require('./rules/bhavesh-rules'),
  require('./rules/lordship-rules'),
  require('./rules/yoga-rules'),
  require('./rules/dosha-rules'),
  require('./rules/transit-rules')
];

function buildDefaultRegistry() {
  var reg = new RuleRegistry();
  MODULES.forEach(function (mod) {
    reg.register({
      id: mod.id || ('legacy:' + Math.random().toString(36).slice(2)),
      category: 'legacy',
      evaluate: mod.evaluate
    });
  });
  return reg;
}

// Coerce whatever evaluate() returns into a normalized contribution.
// Handles both the new RuleResult shape and the legacy PredictionResult shape.
function coerceResult(ruleDef, raw) {
  if (raw && isValidRuleResult(raw)) {
    return {
      triggered: !!raw.triggered,
      weight: typeof raw.weight === 'number' ? raw.weight : ruleDef.weight,
      description: typeof raw.description === 'string' ? raw.description : '',
      evidence: Array.isArray(raw.evidence) ? raw.evidence : [],
      conflicts: Array.isArray(raw.conflicts) ? raw.conflicts : [],
      tags: Array.isArray(raw.tags) ? raw.tags : []
    };
  }
  // Legacy PredictionResult: { triggered_rules:[], evidence:[], prediction_tags:[] }
  if (raw && Array.isArray(raw.triggered_rules)) {
    return {
      triggered: raw.triggered_rules.length > 0,
      weight: ruleDef.weight,
      description: '',
      evidence: Array.isArray(raw.evidence) ? raw.evidence : [],
      conflicts: [],
      tags: Array.isArray(raw.prediction_tags) ? raw.prediction_tags : []
    };
  }
  return { triggered: false, weight: ruleDef.weight, description: '', evidence: [], conflicts: [], tags: [] };
}

// Core: run a registry against a context, return the merged PredictionResult.
function runWithRegistry(registry, context) {
  context = context || {};
  var ordered = registry.orderedList(); // throws on cycle/missing dep (loud)

  var aggregate = emptyResult();
  aggregate.conflicts = [];
  var seenTags = Object.create(null);

  for (var i = 0; i < ordered.length; i++) {
    var rdef = ordered[i];

    // (2) input validation gate
    var validation;
    try { validation = rdef.validate(context); }
    catch (e) { validation = { ok: false, errors: ['validate-threw: ' + e.message] }; }
    if (!validation || validation.ok === false) continue; // skip, do not throw

    // (3) run evaluate (degrade on error)
    var raw;
    try { raw = rdef.evaluate(context); }
    catch (e) { raw = { triggered: false }; }
    var c = coerceResult(rdef, raw);

    // (4) merge
    if (c.triggered) {
      var sources = [];
      for (var s = 0; s < c.evidence.length; s++) {
        if (c.evidence[s] && c.evidence[s].source) sources.push(c.evidence[s].source);
      }
      aggregate.triggered_rules.push({
        id: rdef.id,
        module: rdef.category,
        weight: c.weight,
        description: c.description,
        sources: sources
      });
    }

    for (var e = 0; e < c.evidence.length; e++) aggregate.evidence.push(c.evidence[e]);

    for (var t = 0; t < c.tags.length; t++) {
      var tag = c.tags[t];
      if (!seenTags[tag]) { seenTags[tag] = true; aggregate.prediction_tags.push(tag); }
    }

    // conflict markers: declared conflictsWith + result-level conflicts
    var markers = (rdef.conflictsWith || []).slice();
    for (var m = 0; m < c.conflicts.length; m++) {
      if (markers.indexOf(c.conflicts[m]) === -1) markers.push(c.conflicts[m]);
    }
    for (var k = 0; k < markers.length; k++) {
      aggregate.conflicts.push({ ruleA: rdef.id, ruleB: markers[k] });
    }
  }

  return aggregate;
}

// Backward-compatible entry: run the default (legacy) registry.
function run(context) {
  return runWithRegistry(buildDefaultRegistry(), context);
}

module.exports = {
  run: run,
  runWithRegistry: runWithRegistry,
  runRegistry: runWithRegistry, // alias
  buildDefaultRegistry: buildDefaultRegistry,
  modules: MODULES,
  RuleRegistry: RuleRegistry,
  coerceResult: coerceResult
};
