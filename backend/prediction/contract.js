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

// Canonical PredictionResult shape. Documented for every implementer.
var RESULT_SHAPE = {
  triggered_rules: [], // [{ id, module, weight, description, sources: [] }]
  confidence: 0,       // 0..1  (module-local; final blended by evidence/confidence-score)
  evidence: [],        // [{ type, source, value, reference }]
  prediction_tags: []  // ['string']
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
  emptyResult: emptyResult,
  isValidResult: isValidResult
};
