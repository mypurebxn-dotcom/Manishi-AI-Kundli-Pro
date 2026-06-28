'use strict';

// ===========================================================================
// Evidence Builder: Contradiction Detector.
//
// Scans the triggered rules for conflicting pairs (e.g. a strong benefic
// yoga and a strong dosha affecting the same house) and returns a list of
// contradictions. Contradictions force a lower confidence downstream and
// require explicit resolution before any "final" prediction is unlocked.
//
// Architecture stub only — no detection logic implemented yet.
// ===========================================================================

// rulesResult = output of rule-engine.run(context)
function detect(rulesResult /*, context */) {
  // TODO (later phase): compare rule pairs by house/sign/scope tags.
  return []; // [{ ruleA, ruleB, scope, reason }]
}

module.exports = {
  id: 'contradiction-detector',
  detect: detect
};
