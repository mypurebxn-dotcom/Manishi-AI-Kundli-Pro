'use strict';

// ===========================================================================
// Dasha: Mahadasha (major period).
//
// The Calculation Engine already computes the Vimshottari Mahadasha timeline
// (astrologyEngine.js -> calculateDashaTimeline -> calculation.dasha). This
// module is the prediction-side adapter: it normalizes that data into the
// PredictionResult shape so downstream evidence modules can cite it.
//
// Architecture stub only — no astrology logic implemented yet.
// ===========================================================================

var contract = require('../contract');
var emptyResult = contract.emptyResult;

function evaluate(context) {
  // context.dasha = calculation.dasha
  // TODO (later phase): surface active mahadasha as an evidence source.
  return emptyResult();
}

module.exports = {
  id: 'mahadasha',
  evaluate: evaluate
};
