'use strict';

const { spawn } = require('child_process');
const path = require('path');
const timeConverter = require('./utils/timeConverter');
const geoCalculator = require('./utils/geoCalculator');

const RASHIS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

const RASHIS_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const DASHA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const DASHA_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

function normalizeLongitude(value) {
  return ((Number(value) % 360) + 360) % 360;
}

function round(value, places = 2) {
  const factor = Math.pow(10, places);
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function getD1Rashi(totalLongitude) {
  const norm = normalizeLongitude(totalLongitude);
  const idx = Math.floor(norm / 30) % 12;
  return {
    rashi: RASHIS[idx],
    rashi_hi: RASHIS_HI[idx],
    rashi_num: idx + 1,
    degree: round(norm % 30, 2),
    absolute_degree: round(norm, 6)
  };
}

function getNakshatra(totalLongitude) {
  const norm = normalizeLongitude(totalLongitude);
  const span = 360 / 27;
  const padaSpan = span / 4;
  const nakIndex = Math.floor(norm / span) % 27;
  const inNak = norm - nakIndex * span;
  return {
    nakshatra: NAKSHATRAS[nakIndex],
    nakshatra_num: nakIndex + 1,
    pada: Math.floor(inNak / padaSpan) + 1,
    lord: DASHA_LORDS[nakIndex % 9],
    progress: inNak / span
  };
}

function getD9Rashi(totalLongitude) {
  const norm = normalizeLongitude(totalLongitude);
  const rashiIdx = Math.floor(norm / 30) % 12;
  const relDegree = norm % 30;
  const navamshaIdx = Math.floor(relDegree / (30 / 9)) % 9;

  // Movable: same sign; Fixed: 9th from sign; Dual: 5th from sign.
  const modality = rashiIdx % 3;
  let startIdx = rashiIdx;
  if (modality === 1) startIdx = (rashiIdx + 8) % 12;
  if (modality === 2) startIdx = (rashiIdx + 4) % 12;

  const finalIdx = (startIdx + navamshaIdx) % 12;
  return {
    rashi: RASHIS[finalIdx],
    rashi_hi: RASHIS_HI[finalIdx],
    rashi_num: finalIdx + 1
  };
}

function addYearsApprox(date, years) {
  const days = years * 365.2425;
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function calculateDashaTimeline(moonLong, birthDateStr) {
  const nak = getNakshatra(moonLong);
  const startLord = nak.lord;
  const totalYears = DASHA_YEARS[startLord];
  const elapsedYears = totalYears * nak.progress;
  const remainingYears = totalYears - elapsedYears;

  const birthDate = new Date(String(birthDateStr || '2000-01-01') + 'T00:00:00Z');
  let dashaStart = addYearsApprox(birthDate, -elapsedYears);
  let currentLordIndex = DASHA_LORDS.indexOf(startLord);
  const timeline = [];

  for (let i = 0; i < 9; i += 1) {
    const lord = DASHA_LORDS[currentLordIndex];
    const years = DASHA_YEARS[lord];
    const startDate = dashaStart;
    const endDate = addYearsApprox(startDate, years);
    timeline.push({
      planet: lord,
      years,
      start_date: isoDate(startDate),
      end_date: isoDate(endDate),
      start_year: startDate.getUTCFullYear(),
      end_year: endDate.getUTCFullYear()
    });
    dashaStart = endDate;
    currentLordIndex = (currentLordIndex + 1) % 9;
  }

  const now = new Date();
  const activeDasha = timeline.find(d => now >= new Date(d.start_date + 'T00:00:00Z') && now < new Date(d.end_date + 'T00:00:00Z')) || timeline[0];

  return {
    janma_nakshatra: nak,
    birth_dasha_lord: startLord,
    birth_dasha_balance_years: round(remainingYears, 3),
    current_mahadasha: activeDasha,
    full_timeline: timeline
  };
}

function wholeSignHousesFromAscendant(ascendantLongitude) {
  const asc = getD1Rashi(ascendantLongitude);
  const rows = [];
  for (let i = 0; i < 12; i += 1) {
    const rashiNum = ((asc.rashi_num - 1 + i) % 12) + 1;
    rows.push({
      house_number: i + 1,
      rashi: RASHIS[rashiNum - 1],
      rashi_hi: RASHIS_HI[rashiNum - 1],
      rashi_num: rashiNum,
      house_type: 'whole_sign'
    });
  }
  return rows;
}

function runSwissBridge(args, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const proc = spawn('python3', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdoutBuffer = '';
    let stderrBuffer = '';
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new Error('Swiss bridge timeout after ' + timeoutMs + 'ms'));
    }, timeoutMs);

    proc.stdout.on('data', chunk => { stdoutBuffer += chunk.toString(); });
    proc.stderr.on('data', chunk => { stderrBuffer += chunk.toString(); });
    proc.on('error', err => {
      clearTimeout(timer);
      reject(err);
    });
    proc.on('close', code => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error('Python Error: ' + stderrBuffer));
      try {
        const rawJson = JSON.parse(stdoutBuffer.trim());
        if (rawJson.error) return reject(new Error(rawJson.error));
        resolve(rawJson);
      } catch (e) {
        reject(new Error('Parsing Failure: ' + e.message + ' | raw=' + stdoutBuffer.slice(0, 300)));
      }
    });
  });
}

async function executeCalculation(inputData) {
  const tzOffset = Number(inputData.tzOffset || inputData.timezoneOffset || 5.5);
  const utcTime = timeConverter.localToUTC(inputData.date, inputData.time, tzOffset);
  const coords = geoCalculator.parseCoordinates(inputData.lat, inputData.lon);
  const scriptPath = path.join(__dirname, 'swe_bridge.py');

  const args = [
    scriptPath,
    '--year', String(utcTime.year),
    '--month', String(utcTime.month),
    '--day', String(utcTime.day),
    '--hour', String(utcTime.hour),
    '--lat', String(coords.lat),
    '--lon', String(coords.lon),
    '--ayanamsha', String(inputData.ayanamsha || 'Lahiri'),
    '--node', String(inputData.node || 'True Node')
  ];

  const rawJson = await runSwissBridge(args);
  const d1Lagna = getD1Rashi(rawJson.ascendant);
  const d9Lagna = getD9Rashi(rawJson.ascendant);
  const dashaData = calculateDashaTimeline(rawJson.planets.Moon || 0, inputData.date);

  const planets = Object.keys(rawJson.planets).map(name => {
    const lon = rawJson.planets[name];
    const d1 = getD1Rashi(lon);
    const d9 = getD9Rashi(lon);
    const nak = getNakshatra(lon);
    return {
      name,
      longitude: round(lon, 6),
      rashi: d1.rashi,
      rashi_hi: d1.rashi_hi,
      rashi_num: d1.rashi_num,
      degree: d1.degree,
      nakshatra: nak.nakshatra,
      nakshatra_num: nak.nakshatra_num,
      pada: nak.pada,
      nakshatra_lord: nak.lord,
      d9_rashi: d9.rashi,
      d9_rashi_hi: d9.rashi_hi,
      d9_rashi_num: d9.rashi_num
    };
  });

  return {
    meta: Object.assign({}, rawJson.meta || {}, {
      input_timezone_offset: tzOffset,
      utc_used: utcTime,
      calculation_engine_version: '27.6-critical-foundation'
    }),
    lagna: {
      rashi: d1Lagna.rashi,
      rashi_hi: d1Lagna.rashi_hi,
      rashi_num: d1Lagna.rashi_num,
      degree: d1Lagna.degree,
      longitude: d1Lagna.absolute_degree,
      d9_rashi: d9Lagna.rashi,
      d9_rashi_hi: d9Lagna.rashi_hi,
      d9_rashi_num: d9Lagna.rashi_num
    },
    planets,
    houses: wholeSignHousesFromAscendant(rawJson.ascendant),
    cusps_placidus: (rawJson.cusps_placidus || []).map((h, index) => {
      const d1 = getD1Rashi(h);
      return {
        house_number: index + 1,
        longitude: round(h, 6),
        rashi: d1.rashi,
        rashi_hi: d1.rashi_hi,
        rashi_num: d1.rashi_num,
        degree: d1.degree,
        house_type: 'placidus_cusp_audit'
      };
    }),
    dasha: dashaData
  };
}

module.exports = { executeCalculation, getD1Rashi, getD9Rashi, getNakshatra, calculateDashaTimeline };
