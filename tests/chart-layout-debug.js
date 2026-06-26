const fs = require('fs');
const vm = require('vm');

function approxWidth(text, fontSize) {
  const chars = String(text || '').length;
  return chars * fontSize * 0.72;
}

function parseTexts(svg) {
  const out = [];
  const re = /<text\b([^>]*)>(.*?)<\/text>/g;
  let m;

  while ((m = re.exec(svg))) {
    const attrs = m[1];
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    const x = Number((attrs.match(/\bx="([^"]+)"/) || [])[1]);
    const y = Number((attrs.match(/\by="([^"]+)"/) || [])[1]);
    const fsMatch = attrs.match(/font-size:([0-9.]+)px/);
    const fontSize = fsMatch ? Number(fsMatch[1]) : (attrs.includes('planet-code') ? 12 : 20);

    out.push({
      text,
      x,
      y,
      fontSize,
      w: approxWidth(text, fontSize),
      h: fontSize,
      isPlanet: attrs.includes('planet-code')
    });
  }

  return out;
}

const sandbox = {
  window: {},
  console,
};

sandbox.window.APP = {
  utils: {
    escapeHTML(v) {
      return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }
};

sandbox.APP = sandbox.window.APP;

vm.runInNewContext(
  fs.readFileSync('frontend/js/charts/chart-svg-north.js', 'utf8'),
  sandbox,
  { filename: 'chart-svg-north.js' }
);

const stressPlanets = {
  1: [{ name: 'Sun' }],
  2: [{ name: 'Moon' }, { name: 'Jupiter' }],
  3: [{ name: 'Mars' }, { name: 'Mercury' }, { name: 'Venus' }],
  4: [{ name: 'Sun' }, { name: 'Moon' }, { name: 'Mars' }, { name: 'Mercury' }],
  5: [{ name: 'Moon' }, { name: 'Jupiter' }, { name: 'Venus' }, { name: 'Mars' }, { name: 'Ketu' }],
  6: [{ name: 'Sun' }, { name: 'Moon' }, { name: 'Mars' }, { name: 'Mercury' }, { name: 'Jupiter' }, { name: 'Venus' }]
};

function buildSignsForHouse(house, planets) {
  const signs = {};
  for (let i = 1; i <= 12; i++) signs[i] = { planets: [] };
  signs[house].planets = planets;
  return signs;
}

let totalIssues = 0;

for (const houseText of Object.keys(stressPlanets)) {
  const house = Number(houseText);
  const svg = sandbox.window.APP.chartSVGNorth.renderNorth({
    lagna: { rashi_num: 1 },
    signs: buildSignsForHouse(house, stressPlanets[house])
  });

  const texts = parseTexts(svg);
  const planets = texts.filter(t => t.isPlanet);

  console.log('===== HOUSE ' + house + ' LAYOUT DEBUG =====');
  console.log('planet_text_count=' + planets.length);
  console.log('svg_length=' + svg.length);

  for (const p of planets) {
    console.log(
      `house=${house} planet="${p.text}" x=${p.x.toFixed(1)} y=${p.y.toFixed(1)} font=${p.fontSize} approxW=${p.w.toFixed(1)}`
    );
  }

  let issues = 0;

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i];
      const b = planets[j];

      const dx = Math.abs(a.x - b.x);
      const dy = Math.abs(a.y - b.y);

      const overlapX = dx < ((a.w + b.w) / 2);
      const overlapY = dy < ((a.h + b.h) / 2);

      if (overlapX && overlapY) {
        issues++;
        console.log(`HOUSE ${house} OVERLAP approx: "${a.text}" with "${b.text}"`);
      }

      if (dy < 2 && dx < 34) {
        issues++;
        console.log(`HOUSE ${house} TOO_CLOSE_HORIZONTAL: "${a.text}" <-> "${b.text}" dx=${dx.toFixed(1)}`);
      }

      if (dx < 2 && dy < 14) {
        issues++;
        console.log(`HOUSE ${house} TOO_CLOSE_VERTICAL: "${a.text}" <-> "${b.text}" dy=${dy.toFixed(1)}`);
      }
    }
  }

  for (const p of planets) {
    if (p.x < 20 || p.x > 380 || p.y < 20 || p.y > 380) {
      issues++;
      console.log(`HOUSE ${house} OUT_OF_RANGE: "${p.text}" x=${p.x} y=${p.y}`);
    }
  }

  totalIssues += issues;
  console.log(issues ? ('HOUSE ' + house + ' FAIL issues=' + issues) : ('HOUSE ' + house + ' PASS'));
}

if (totalIssues) {
  console.log('❌ CHART LAYOUT DEBUG FAIL issues=' + totalIssues);
  process.exit(1);
}

console.log('✅ CHART LAYOUT DEBUG PASS');
