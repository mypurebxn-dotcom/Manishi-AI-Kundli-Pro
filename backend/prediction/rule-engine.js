'use strict';

// ===========================================================================
// Rule Engine.
//
// Runs every registered rule module against the shared context and merges
// their PredictionResults into one aggregate. Merging is additive:
//   - triggered_rules concatenated
//   - evidence concatenated
//   - prediction_tags concatenated (de-duped)
//   - local confidence is NOT blended here; the final score is computed by
//     evidence/confidence-score.js from the triggered rules' weights.
//
// A failing module degrades to an empty result so the pipeline never throws.
// ===========================================================================

var contract = require('./contract');
var emptyResult = contract.emptyResult;

// Registered lazily (require at module load) to keep a single source of truth.
// Dasha sub-period modules + classical rule modules.
var MODULES = [
  require('./dasha/mahadasha'),
  require('./dasha/antardasha'),
  require('./dasha/pratyantar'),
  require('./rules/bhavesh-rules'),
  require('./rules/lordship-rules'),
  require('./rules/yoga-rules'),
  require('./rules/dosha-rules'),
  require('./rules/transit-rules')
];

function run(context) {
  var aggregate = emptyResult();
  var seenTags = Object.create(null);

  for (var i = 0; i < MODULES.length; i++) {
    var mod = MODULES[i];
    var r;
    try {
      r = (typeof mod.evaluate === 'function') ? mod.evaluate(context) : emptyResult();
      if (!contract.isValidResult(r)) r = emptyResult();
    } catch (e) {
      r = emptyResult(); // architecture-only: never let one module abort the run
    }

    var k;
    for (k = 0; k < r.triggered_rules.length; k++) aggregate.triggered_rules.push(r.triggered_rules[k]);
    for (k = 0; k < r.evidence.length; k++) aggregate.evidence.push(r.evidence[k]);
    for (k = 0; k < r.prediction_tags.length; k++) {
      var t = r.prediction_tags[k];
      if (!seenTags[t]) { seenTags[t] = true; aggregate.prediction_tags.push(t); }
    }
  }

  return aggregate;
}

module.exports = {
  run: run,
  modules: MODULES
};
