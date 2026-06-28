'use strict';

// ===========================================================================
// Rule Engine Core — RuleRegistry (Phase 30).
//
// Holds registered rules and produces a deterministic execution order:
//   1. topological sort by `requires` (dependencies run first)
//   2. stable tie-break by `priority` ascending (lower first)
//   3. stable tie-break by `id` ascending
// Cycles in `requires` are rejected (orderedList() throws) so the engine can
// never deadlock. Duplicate ids are rejected at register time.
//
// Pure plumbing. NO astrology logic.
// ===========================================================================

var normalizeRule = require('./rule').normalizeRule;

function RuleRegistry() {
  this._rules = Object.create(null); // id -> normalized rule
  this._order = [];                  // registration order (for stable listing)
}

// Register (or re-register) a rule. Returns the normalized rule.
// Throws if the id is missing or already registered by a different object.
RuleRegistry.prototype.register = function (def) {
  var rule = normalizeRule(def);
  if (this._rules[rule.id] && this._order.indexOf(rule.id) === -1) {
    throw new Error('duplicate rule id: ' + rule.id);
  }
  var isNew = !this._rules[rule.id];
  this._rules[rule.id] = rule;
  if (isNew) this._order.push(rule.id);
  return rule;
};

RuleRegistry.prototype.has = function (id) {
  return Object.prototype.hasOwnProperty.call(this._rules, id);
};

RuleRegistry.prototype.get = function (id) {
  return this._rules[id] || null;
};

// All rules in registration order (NOT execution order).
RuleRegistry.prototype.list = function () {
  var self = this;
  return this._order.map(function (id) { return self._rules[id]; });
};

RuleRegistry.prototype.byCategory = function (cat) {
  return this.list().filter(function (r) { return r.category === cat; });
};

RuleRegistry.prototype.size = function () {
  return this._order.length;
};

// Deterministic execution order: topo by requires, then priority asc, then id asc.
// Throws on a missing dependency or a dependency cycle.
RuleRegistry.prototype.orderedList = function () {
  var self = this;
  var ids = Object.keys(this._rules);

  // Validate all requires point to known rules.
  ids.forEach(function (id) {
    var rule = self._rules[id];
    rule.requires.forEach(function (dep) {
      if (!self._rules[dep]) {
        throw new Error('rule "' + id + '" requires unknown rule "' + dep + '"');
      }
    });
  });

  // Kahn's algorithm for topological sort.
  var indeg = {};
  ids.forEach(function (id) { indeg[id] = 0; });
  ids.forEach(function (id) {
    self._rules[id].requires.forEach(function (dep) { indeg[id] += 1; });
  });

  // Seed with zero-indegree nodes, sorted by priority then id so ties are
  // resolved deterministically from the very first pick.
  var ready = ids
    .filter(function (id) { return indeg[id] === 0; })
    .sort(cmp);

  var out = [];
  while (ready.length) {
    var id = ready.shift();
    out.push(id);
    // Decrement dependents.
    ids.forEach(function (other) {
      if (self._rules[other].requires.indexOf(id) !== -1) {
        indeg[other] -= 1;
        if (indeg[other] === 0) ready.push(other);
      }
    });
    ready.sort(cmp);
  }

  if (out.length !== ids.length) {
    // Remaining nodes are in a cycle.
    var cyclic = ids.filter(function (id) { return indeg[id] > 0; });
    throw new Error('dependency cycle detected among rules: ' + cyclic.join(', '));
  }

  return out.map(function (id) { return self._rules[id]; });

  // priority asc, then id asc.
  function cmp(a, b) {
    var ra = self._rules[a], rb = self._rules[b];
    if (ra.priority !== rb.priority) return ra.priority - rb.priority;
    return a < b ? -1 : a > b ? 1 : 0;
  }
};

// Factory for callers that prefer a function-style API.
function create() { return new RuleRegistry(); }

module.exports = RuleRegistry;
module.exports.create = create;
