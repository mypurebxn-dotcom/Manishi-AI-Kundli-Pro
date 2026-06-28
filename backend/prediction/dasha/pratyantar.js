'use strict';

// ===========================================================================
// Dasha: Pratyantar (sub-sub-period).
//
// Sits inside an Antardasha. Finest timing granularity used by the engine.
//
// Architecture stub only — no astrology logic implemented yet.
// ===========================================================================

var contract = require('../contract');
var emptyResult = contract.emptyResult;

function evaluate(context) {
  // TODO (later phase): compute pratyantar spans from antardasha lord.
  return emptyResult();
}

module.exports = {
  id: 'pratyantar',
  evaluate: evaluate
};
