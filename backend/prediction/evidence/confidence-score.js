'use strict';

// ===========================================================================
// Evidence Builder: Confidence Score.
//
// Blends the per-rule weights produced by the rule modules into a single
// 0..1 confidence value for the whole prediction. Higher when rules are
// mutually reinforcing and well-sourced; lower when thin or contradictory.
//
// Architecture stub only — no scoring logic implemented yet.
// ===========================================================================

var contract = require('../contract');

// rulesResult = output of rule-engine.run(context)
function score(rulesResult /*, context */) {
  // TODO (later phase): weight-blend rulesResult.triggered_rules[].
  // For now return the canonical neutral confidence.
  return 0;
}

module.exports = {
  id: 'confidence-score',
  score: score
};
