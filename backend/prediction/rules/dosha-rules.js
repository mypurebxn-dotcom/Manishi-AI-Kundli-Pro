'use strict';

// ===========================================================================
// Rule module: Dosha Rules (afflictions).
//
// Detects classical doshas (e.g. Mangal Dosha, Kaal Sarp, Pitra, etc.) and
// flags each as a triggered rule. Doshas are evidence items, never fear
// language — the safety contract forbids fear-based framing downstream.
//
// Architecture stub only — no astrology logic implemented yet.
// ===========================================================================

var contract = require('../contract');
var emptyResult = contract.emptyResult;

function evaluate(context) {
  // context.chart.planets positions drive dosha detection.
  // TODO (later phase): detect named doshas with severity weights.
  return emptyResult();
}

module.exports = {
  id: 'dosha-rules',
  evaluate: evaluate
};
