'use strict';

// ===========================================================================
// Dasha: Antardasha (sub-period / bhukti).
//
// Sits inside a Mahadasha. Derived from the Vimshottari sequence and the
// balance of years at birth. Feeds timing context to the rule modules.
//
// Architecture stub only — no astrology logic implemented yet.
// ===========================================================================

var contract = require('../contract');
var emptyResult = contract.emptyResult;

function evaluate(context) {
  // context.dasha.full_timeline is available; sub-periods are TBD.
  // TODO (later phase): compute antardasha spans from mahadasha lord.
  return emptyResult();
}

module.exports = {
  id: 'antardasha',
  evaluate: evaluate
};
