'use strict';

// ===========================================================================
// Prediction Engine — shared contract.
//
// Every module in this subsystem (dasha/*, rules/*, evidence/*) MUST return
// this exact structured shape. Predictions are NEVER free text and NEVER come
// directly from an LLM. This file is the single source of truth for the shape.
//
// Pipeline: Calculation Engine -> Rule Engine -> Prediction Engine -> Evidence Builder -> Report
// ===========================================================================

var rule = require('./rule'); // Rule Engine Core (Phase 30); re-exported below.

// Canonical PredictionResult shape. Documented for every implementer.
var RESULT_SHAPE = {
  triggered_rules: [], // [{ id, module, weight, description, sources: [] }]
  confidence: 0,       // 0..1  (module-local; final blended by evidence/confidence-score)
  evidence: [],        // [{ type, source, value, reference }]
  prediction_tags: []  // ['string']
};

// Enforced shape of a single triggered_rules item (Phase 30 Rule Engine Core).
// rule-engine.coerceResult() guarantees every emitted item matches this.
var TRIGGERED_RULE_SHAPE = {
  id: '',          // rule id, namespaced "<category>:<name>"
  module: '',      // originating category / module
  weight: 0,       // 0..1 contribution
  description: '', // human-readable label (never free-form prediction text)
  sources: []      // evidence source strings cited for this trigger
};

// Factory for a fresh, empty result. Modules return this until logic is added.
function emptyResult() {
  return {
    triggered_rules: [],
    confidence: 0,
    evidence: [],
    prediction_tags: []
  };
}

// Defensive guard so a malformed module cannot poison the pipeline.
function isValidResult(r) {
  return !!r
    && Array.isArray(r.triggered_rules)
    && typeof r.confidence === 'number'
    && Array.isArray(r.evidence)
    && Array.isArray(r.prediction_tags);
}

module.exports = {
  SCHEMA_VERSION: 'prediction-v1',
  RESULT_SHAPE: RESULT_SHAPE,
  TRIGGERED_RULE_SHAPE: TRIGGERED_RULE_SHAPE,
  emptyResult: emptyResult,
  isValidResult: isValidResult,
  // Rule Engine Core (Phase 30) — re-exported here so contract.js stays the
  // single import site for the whole subsystem.
  emptyRuleResult: rule.emptyRuleResult,
  normalizeRule: rule.normalizeRule,
  isValidRuleResult: rule.isValidRuleResult
};
