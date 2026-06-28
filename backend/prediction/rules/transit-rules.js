'use strict';

// ===========================================================================
// Rule module: Transit Rules (gochar).
//
// Evaluates current planetary transits over the natal chart to modulate the
// strength/timing of standing predictions. Requires transit ephemeris input
// (a context.transit field), which is not yet wired.
//
// Architecture stub only — no astrology logic implemented yet.
// ===========================================================================

var contract = require('../contract');
var emptyResult = contract.emptyResult;

function evaluate(context) {
  // context.transit (TBD) would hold current transit longitudes.
  // TODO (later phase): compare transits to natal houses/lords.
  return emptyResult();
}

module.exports = {
  id: 'transit-rules',
  evaluate: evaluate
};
