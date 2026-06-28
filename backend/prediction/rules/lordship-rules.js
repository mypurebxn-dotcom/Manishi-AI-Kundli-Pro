'use strict';

// ===========================================================================
// Rule module: Lordship Rules (sign lordship / planetary rulership).
//
// Evaluates which signs each planet rules, benefic/malefic status relative to
// the ascendant, and the functional nature of each lord.
//
// Architecture stub only — no astrology logic implemented yet.
// ===========================================================================

var contract = require('../contract');
var emptyResult = contract.emptyResult;

function evaluate(context) {
  // context.chart.lagna defines the ascendant for functional lords.
  // TODO (later phase): classify natural vs functional benefics/malefics.
  return emptyResult();
}

module.exports = {
  id: 'lordship-rules',
  evaluate: evaluate
};
