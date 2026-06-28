'use strict';

// ===========================================================================
// Rule Engine Core — Rule entity (Phase 30).
//
// Pure plumbing. NO astrology logic. A "rule" is the unit the engine runs;
// each rule is registered exactly once and is independently identifiable,
// categorised, prioritised, weighted, dependency-ordered, input-validated,
// and conflict-marked. This is what lets the subsystem scale to 500+ rules.
//
// Canonical Rule shape (8 fields):
//   id           string   unique, namespaced "<category>:<name>"
//   category     string   dasha|bhavesh|lordship|yoga|dosha|transit|meta|legacy
//   priority     number   lower runs first (default 100)
//   weight       number   0..1 confidence contribution (default 0)
//   requires     string[] rule ids that must run before this one (deps)
//   conflictsWith string[] rule ids this one may conflict with (markers)
//   validate     (ctx)->{ ok:boolean, errors?:string[] }  input gate
//   evaluate     (ctx)->RuleResult                        execution
// ===========================================================================

var DEFAULT_PRIORITY = 100;
var DEFAULT_WEIGHT = 0;

// Per-rule execution result. Coerced/coerces module output into this shape.
function emptyRuleResult() {
  return {
    rule_id: '',
    triggered: false,
    weight: DEFAULT_WEIGHT,
    description: '',
    evidence: [],        // [{ type, source, value, reference }]
    conflicts: [],       // [ruleId]  (scopes/ids this result conflicts with)
    tags: []             // prediction tags
  };
}

function isFn(v) { return typeof v === 'function'; }

// Normalize an arbitrary rule definition into the canonical 8-field shape,
// filling defaults. Throws on a missing/invalid id (a rule without an id is
// not a rule).
function normalizeRule(def) {
  def = def || {};
  if (!def.id || typeof def.id !== 'string') {
    throw new Error('rule.id is required and must be a non-empty string');
  }
  return {
    id: String(def.id),
    category: typeof def.category === 'string' && def.category ? def.category : 'meta',
    priority: typeof def.priority === 'number' && isFinite(def.priority) ? def.priority : DEFAULT_PRIORITY,
    weight: typeof def.weight === 'number' && isFinite(def.weight) ? def.weight : DEFAULT_WEIGHT,
    requires: Array.isArray(def.requires) ? def.requires.slice() : [],
    conflictsWith: Array.isArray(def.conflictsWith) ? def.conflictsWith.slice() : [],
    validate: isFn(def.validate) ? def.validate : function () { return { ok: true }; },
    evaluate: isFn(def.evaluate) ? def.evaluate : function () { return emptyRuleResult(); }
  };
}

// Defensive shape check for a RuleResult produced by evaluate().
function isValidRuleResult(r) {
  return !!r
    && typeof r.triggered === 'boolean'
    && typeof r.weight === 'number'
    && (r.description == null || typeof r.description === 'string')
    && Array.isArray(r.evidence)
    && Array.isArray(r.conflicts)
    && Array.isArray(r.tags);
}

module.exports = {
  DEFAULT_PRIORITY: DEFAULT_PRIORITY,
  DEFAULT_WEIGHT: DEFAULT_WEIGHT,
  emptyRuleResult: emptyRuleResult,
  normalizeRule: normalizeRule,
  isValidRuleResult: isValidRuleResult
};
