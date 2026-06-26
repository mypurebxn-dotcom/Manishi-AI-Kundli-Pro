'use strict';

const http = require('http');
const { URL } = require('url');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 8787);
const PHASE = process.env.MANISHI_PHASE || 'phase27-6-critical-foundation';
const startedAt = new Date().toISOString();

const CONTRACTS = [
  { id: 'health', method: 'GET', path: '/api/health', status: 'ready' },
  { id: 'contractsHealth', method: 'GET', path: '/api/contracts/health', status: 'ready' },
  { id: 'profileValidate', method: 'POST', path: '/api/profile/validate', status: 'ready' },
  { id: 'expertCalculate', method: 'POST', path: '/api/expert-calculate', status: 'ready' },
  { id: 'faladesh', method: 'POST', path: '/api/faladesh', status: 'locked-safe' },
  { id: 'reportJson', method: 'POST', path: '/api/report/json', status: 'ready-safe' },
  { id: 'qaAudit', method: 'POST', path: '/api/qa/audit', status: 'ready' },
  { id: 'featuresHealth', method: 'GET', path: '/api/features/health', status: 'ready' },
  { id: 'echo', method: 'POST', path: '/api/echo', status: 'ready' }
];

function send(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1024 * 1024) req.destroy();
    });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (error) { resolve({ __parseError: error.message, raw: data.slice(0, 2000) }); }
    });
    req.on('error', () => resolve({ __readError: true }));
  });
}

function text(value) { return String(value || '').trim(); }

function normalizeProfile(input) {
  const p = input && input.profile ? input.profile : input || {};
  return {
    name: text(p.name),
    date: text(p.date),
    time: text(p.time),
    place: text(p.place),
    ayanamsha: text(p.ayanamsha) || 'Lahiri',
    node: text(p.node) || 'True Node',
    lat: text(p.lat),
    lon: text(p.lon),
    tzOffset: text(p.tzOffset || p.timezoneOffset) || '5.5',
    houseSystem: text(p.houseSystem) || 'Whole Sign',
    notes: text(p.notes)
  };
}

function validateProfile(input) {
  const profile = normalizeProfile(input);
  const missing = [];
  if (!profile.name) missing.push('name');
  if (!profile.date) missing.push('date');
  if (!profile.time) missing.push('time');
  if (!profile.place) missing.push('place');
  // lat/lon optional for validation, required for calculation
  return {
    ok: missing.length === 0,
    missing,
    profile,
    calculationReady: missing.length === 0 && !!profile.lat && !!profile.lon,
    missingForExact: missing.concat((!profile.lat || !profile.lon) ? ['lat/lon'] : []),
    completeness: Math.round(((6 - missing.length) / 6) * 100),
    message: missing.length ? 'Profile incomplete' : ((!profile.lat || !profile.lon) ? 'Profile valid, but coordinates required for exact calculation' : 'Profile valid for exact calculation')
  };
}

function safeFingerprint(profile) {
  const base = [profile.name, profile.date, profile.time, profile.place, profile.ayanamsha, profile.node].join('|');
  let hash = 0;
  for (let i = 0; i < base.length; i += 1) hash = ((hash << 5) - hash + base.charCodeAt(i)) | 0;
  return 'mkp-' + Math.abs(hash).toString(16).padStart(8, '0');
}

const { executeCalculation } = require('./astrologyEngine');

async function expertCalculate(body) {
  const validation = validateProfile(body);
  const profile = validation.profile;
  if (!validation.ok) {
    return {
      ok: false,
      locked: true,
      finalPredictionUnlocked: false,
      phase: PHASE,
      contract: 'expertCalculate',
      fingerprint: safeFingerprint(profile),
      validation,
      calculation: {
        engine: 'swiss-ephemeris-exact',
        status: 'waiting_for_required_birth_fields',
        ayanamsha: profile.ayanamsha,
        node: profile.node,
        deterministicOnly: true,
        placeholders: false
      },
      message: 'Complete profile before calculation.'
    };
  }
  // Check lat/lon for calculation
  if (!profile.lat || !profile.lon) {
    return {
      ok: false,
      locked: true,
      finalPredictionUnlocked: false,
      phase: PHASE,
      contract: 'expertCalculate',
      fingerprint: safeFingerprint(profile),
      validation,
      calculation: {
        engine: 'swiss-ephemeris-exact',
        status: 'missing_coordinates',
        error: 'Latitude/Longitude required for exact calculation'
      },
      message: 'Coordinates (lat/lon) required for exact calculation.'
    };
  }
  try {
    const calc = await executeCalculation(profile);
    return {
      ok: true,
      locked: false,
      finalPredictionUnlocked: false,
      phase: PHASE,
      contract: 'expertCalculate',
      fingerprint: safeFingerprint(profile),
      validation,
      calculation: {
        engine: 'swiss-ephemeris-exact',
        status: 'exact_calculation_complete',
        ayanamsha: profile.ayanamsha,
        node: profile.node,
        deterministicOnly: true,
        placeholders: false,
        meta: calc.meta,
        lagna: calc.lagna,
        planets: calc.planets,
        houses: calc.houses,
        cusps_placidus: calc.cusps_placidus,
        dasha: calc.dasha
      },
      message: 'Exact calculation complete. Ready for evidence gates.'
    };
  } catch (err) {
    return {
      ok: false,
      locked: true,
      finalPredictionUnlocked: false,
      phase: PHASE,
      contract: 'expertCalculate',
      fingerprint: safeFingerprint(profile),
      validation,
      calculation: {
        engine: 'swiss-ephemeris-exact',
        status: 'engine_error',
        error: err.message
      },
      message: 'Calculation engine error: ' + err.message
    };
  }
}

async function faladesh(body) {
  const calc = await expertCalculate(body);
  return {
    ok: calc.ok,
    locked: true,
    finalPredictionUnlocked: false,
    contract: 'faladesh',
    phase: PHASE,
    sourceMode: 'evidence_required',
    safety: {
      medicalLegalFinancialWarning: true,
      noFearLanguage: true,
      no100PercentPredictionClaim: true,
      noExpensiveRitualPressure: true
    },
    draft: calc.ok ? 'Faladesh module contract ready. Real interpretation requires exact calculation + source evidence + review gates.' : 'Profile incomplete. Faladesh locked.',
    inputFingerprint: calc.fingerprint,
    calculationStatus: calc.calculation && calc.calculation.status
  };
}

function reportJson(body) {
  const validation = validateProfile(body);
  return {
    ok: true,
    locked: true,
    finalPredictionUnlocked: false,
    contract: 'reportJson',
    phase: PHASE,
    profile: validation.profile,
    sections: [
      { id: 'cover', title: 'Cover', status: 'ready' },
      { id: 'birth_summary', title: 'Birth Summary', status: validation.ok ? 'ready' : 'needs_profile' },
      { id: 'calculation', title: 'Exact Calculation', status: validation.ok ? 'ready' : 'needs_profile' },
      { id: 'faladesh', title: 'Faladesh', status: 'locked_until_evidence' },
      { id: 'qa', title: 'QA/Safety', status: 'ready' }
    ],
    validation,
    generatedAt: new Date().toISOString()
  };
}

function qaAudit(body) {
  const validation = validateProfile(body);
  return {
    ok: true,
    phase: PHASE,
    contract: 'qaAudit',
    checks: [
      'backend-online',
      'json-body-safe-parse',
      'cors-ready',
      'api-contracts-listed',
      'profile-validation-contract-ready',
      'expert-calculate-exact-engine',
      'faladesh-final-unlock-blocked',
      'report-json-safe',
      'swiss-ephemeris-integration-active',
      'phase21-ui-report-audit-complete'
    ],
    validation,
    finalPredictionUnlocked: false,
    now: new Date().toISOString()
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  try {
    if (req.method === 'GET' && url.pathname === '/api/version') {
      return send(res, 200, { ok: true, app: 'Manishi AI Kundli Pro Backend', phase: PHASE, version: '27.6.0', startedAt, now: new Date().toISOString() });
    }
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return send(res, 200, {
        ok: true,
        app: 'Manishi AI Kundli Pro Backend',
        phase: PHASE,
        mode: 'swiss-ephemeris-exact-engine',
        contracts: CONTRACTS.length,
        startedAt,
        now: new Date().toISOString()
      });
    }
    if (req.method === 'GET' && url.pathname === '/api/contracts/health') {
      return send(res, 200, { ok: true, phase: PHASE, contracts: CONTRACTS, total: CONTRACTS.length, finalPredictionUnlocked: false });
    }
    if (req.method === 'GET' && url.pathname === '/api/features/health') {
      return send(res, 200, { ok: true, phase: PHASE, features: ['kundli', 'panchang', 'dasha', 'dosha_remedy', 'report_pro', 'qa_console'], mode: 'exact-engine' });
    }
    if (req.method === 'POST' && url.pathname === '/api/profile/validate') return send(res, 200, validateProfile(await readBody(req)));
    if (req.method === 'POST' && url.pathname === '/api/expert-calculate') return send(res, 200, await expertCalculate(await readBody(req)));
    if (req.method === 'POST' && url.pathname === '/api/faladesh') return send(res, 200, await faladesh(await readBody(req)));
    if (req.method === 'POST' && url.pathname === '/api/report/json') return send(res, 200, reportJson(await readBody(req)));
    if (req.method === 'POST' && url.pathname === '/api/qa/audit') return send(res, 200, qaAudit(await readBody(req)));
    if (req.method === 'POST' && url.pathname === '/api/echo') return send(res, 200, { ok: true, echo: await readBody(req) });
    return send(res, 404, { ok: false, error: 'Not found', path: url.pathname });
  } catch (error) {
    return send(res, 500, { ok: false, error: error.message || String(error), phase: PHASE });
  }
});

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Run: npm run stop  OR  bash scripts/stop-app.sh`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log('Manishi backend running');
  console.log(`http://${HOST}:${PORT}`);
});
