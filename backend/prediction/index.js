'use strict';

// ===========================================================================
// Prediction Engine — pipeline orchestrator (entry point).
//
// Deterministic, server-side, NEVER LLM.
//
//   Birth Data
//       |
//   Calculation Engine   ->  astrologyEngine.executeCalculation()  (existing, untouched)
//       |
//   Rule Engine          ->  rule-engine.js  (runs dasha/* + rules/*)
//       |
//   Prediction Engine    ->  THIS FILE (index.js) orchestrates the pipeline
//       |
//   Evidence Builder     ->  evidence/*  (confidence, contradiction, collector)
//       |
//   Premium Report       ->  structured JSON (future wiring to /api/faladesh + report)
//
// Input  : the JSON returned by astrologyEngine.executeCalculation()
// Output : a single PredictionResult with confidence + contradictions.
//
// NOTE: This file is architecture-only. No astrology logic. It wires the
// pipeline and returns the canonical empty shape until logic is implemented.
// ===========================================================================

var contract = require('./contract');
var ruleEngine = require('./rule-engine');
var confidenceScore = require('./evidence/confidence-score');
var contradictionDetector = require('./evidence/contradiction-detector');
var evidenceCollector = require('./evidence/evidence-collector');

// Build the shared context handed to every module.
function buildContext(calculation) {
  calculation = calculation || null;
  return {
    calculation: calculation,
    dasha: (calculation && calculation.dasha) || null,
    chart: calculation, // planets + lagna + houses live on the calc object
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'prediction-engine-v1',
      schema: contract.SCHEMA_VERSION
    }
  };
}

// Main pipeline. run(calculation) -> PredictionResult
function run(calculation) {
  var context = buildContext(calculation);

  // 1. Rule Engine: run all dasha + rule modules, merge results.
  var rules = ruleEngine.run(context);

  // 2. Evidence Builder: confidence, contradictions, collected evidence.
  var confidence = confidenceScore.score(rules, context);
  var contradictions = contradictionDetector.detect(rules, context);
  var collected = evidenceCollector.collect(rules, context);

  return {
    ok: true,
    schema: contract.SCHEMA_VERSION,
    confidence: confidence,
    contradictions: contradictions,
    triggered_rules: rules.triggered_rules,
    evidence: collected.evidence,
    prediction_tags: rules.prediction_tags,
    meta: context.meta
  };
}

module.exports = {
  run: run,
  buildContext: buildContext,
  contract: contract,
  ruleEngine: ruleEngine
};
