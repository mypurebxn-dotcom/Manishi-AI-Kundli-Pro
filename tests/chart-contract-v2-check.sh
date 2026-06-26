#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "❌ QA FAIL: $1"
  exit 1
}

pass() {
  echo "✅ $1"
}

echo "===== CHART CONTRACT QA V2 ====="

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

function assert(cond, msg) {
  if (!cond) {
    console.error('❌ QA FAIL:', msg);
    process.exit(1);
  }
}

const sandbox = {
  window: {},
  console,
};

sandbox.window.APP = {
  state: {
    get(key) {
      if (key !== 'lastResult') return null;
      return {
        calculation: {
          lagna: {
            rashi_num: 1,
            rashi_hi: 'मेष',
            d9_rashi_num: 5,
            d9_rashi_hi: 'सिंह'
          },
          planets: [
            {
              name: 'Sun',
              rashi_num: 2,
              rashi_hi: 'वृषभ',
              d9_rashi_num: 6,
              d9_rashi_hi: 'कन्या',
              degree: 10
            },
            {
              name: 'Moon',
              rashi_num: 3,
              rashi_hi: 'मिथुन',
              d9_rashi_num: 7,
              d9_rashi_hi: 'तुला',
              degree: 20
            }
          ],
          houses: [{ house: 1, rashi_num: 1 }],
          meta: { source: 'qa' }
        }
      };
    }
  }
};

sandbox.APP = sandbox.window.APP;

function runFile(file) {
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
}

runFile('frontend/js/charts/chart-data.js');
runFile('frontend/js/charts/chart-engine.js');
runFile('frontend/js/charts/chart-module.js');

const APP = sandbox.window.APP;

assert(APP.chartData, 'APP.chartData missing');
assert(APP.chartEngine, 'APP.chartEngine missing');
assert(APP.chartModule, 'APP.chartModule missing');

const requiredShape = ['type', 'title', 'lagna', 'planets', 'houses', 'meta'];

for (const type of ['D1', 'D9']) {
  const raw = APP.chartData.build(type);
  assert(raw, `${type} chartData.build returned empty`);
  for (const key of requiredShape) {
    assert(Object.prototype.hasOwnProperty.call(raw, key), `${type} missing key: ${key}`);
  }

  const engine = APP.chartEngine.build(type);
  assert(engine, `${type} chartEngine.build returned empty`);
  assert(engine.type === type, `${type} engine type mismatch`);
  assert(engine.signs && Object.keys(engine.signs).length === 12, `${type} signs contract broken`);
}

const registered = APP.chartModule.charts().map(x => x.type);
for (const type of registered) {
  assert(APP.chartData.builders[type], `chart-module registered ${type}, but chartData builder missing`);
}

console.log('✅ chartData/chartEngine/chartModule runtime contracts valid');
NODE

echo "===== QA RESULT ====="
echo "✅ Chart Contract QA V2 passed"
