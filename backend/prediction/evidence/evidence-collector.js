'use strict';

// ===========================================================================
// Evidence Builder: Evidence Collector.
//
// Consolidates the raw evidence items produced by the rule modules into a
// clean, source-cited list. Every triggered prediction MUST carry at least
// one evidence item (source + reference) before it can reach a report.
// This is the gate that enforces "no prediction without evidence".
//
// Architecture stub only — no consolidation logic implemented yet.
// ===========================================================================

// rulesResult = output of rule-engine.run(context)
function collect(rulesResult /*, context */) {
  // TODO (later phase): attach sources/refs and drop unsupported items.
  return { evidence: [] };
}

module.exports = {
  id: 'evidence-collector',
  collect: collect
};
