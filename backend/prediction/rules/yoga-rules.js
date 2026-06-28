'use strict';

// ===========================================================================
// Rule module: Yoga Rules (planetary combinations).
//
// Detects classical yogas (e.g. Raj Yoga, Dhana Yoga, Gajakesari, etc.) from
// planet/lord positions and emits each detected yoga as a triggered rule.
//
// Architecture stub only — no astrology logic implemented yet.
// ===========================================================================

var contract = require('../contract');
var emptyResult = contract.emptyResult;

function evaluate(context) {
  // context.chart.planets + context.chart.houses are available.
  // TODO (later phase): detect named yogas from lord relationships.
  return emptyResult();
}

module.exports = {
  id: 'yoga-rules',
  evaluate: evaluate
};
