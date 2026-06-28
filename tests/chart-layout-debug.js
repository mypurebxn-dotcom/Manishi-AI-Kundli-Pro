const fs = require('fs');
const vm = require('vm');

// ===========================================================================
// Glyph-width model, tuned for the Devanagari labels the North renderer uses.
// Walks Unicode code points; virama (U+094D) contributes ~0 width because it
// joins two consonants into one cluster. Returns pixels (+1px conservative pad).
// Replaces the old `chars * fontSize * 0.72` estimate that counted every
// combining mark as a full-width cell.
// ===========================================================================
function charWidthEm(cp) {
  if (cp === 0x094D) return 0;                                      // virama
  if (cp >= 0x093E && cp <= 0x094C) return 0.32;                    // matras
  if (cp === 0x0902 || cp === 0x0903 || cp === 0x0901) return 0.30; // anusvara/visarga/candrabindu
  if (cp >= 0x0900 && cp <= 0x097F) return 0.60;                    // Devanagari base
  if (cp >= 0x30 && cp <= 0x39) return 0.60;                        // ASCII digits
  return 0.60;
}

function approxWidth(text, fontSize) {
  const s = String(text || '');
  let em = 0;
  for (const ch of s) em += charWidthEm(ch.codePointAt(0));
  if (em === 0) em = 0.60;
  return em * fontSize + 1;
}

// ===========================================================================
// Parse every <text>, tag its role, and compute a centered bounding box.
// Planet text uses dominant-baseline="middle" (centered on y); sign and lagna
// use the default alphabetic baseline (glyphs sit ABOVE y), so their modeled
// center is shifted up by 0.35*fontSize to match what is actually drawn.
// ===========================================================================
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
    let fontSize;
    if (fsMatch) fontSize = Number(fsMatch[1]);
    else if (attrs.includes('sign-num')) fontSize = 20;   // .sign-num CSS rule
    else if (attrs.includes('lagna-mark')) fontSize = 10; // .lagna-mark CSS rule
    else fontSize = 12;

    let role;
    if (attrs.includes('planet-code')) role = 'planet';
    else if (attrs.includes('sign-num')) role = 'sign';
    else if (attrs.includes('lagna-mark')) role = 'lagna';
    else role = 'other';

    const isMiddle = attrs.includes('dominant-baseline');
    const cy = isMiddle ? y : (y - fontSize * 0.35);
    const w = approxWidth(text, fontSize);
    const h = fontSize;

    out.push({
      text, role, x, y, fontSize, w, h,
      cx: x, cy,
      left: x - w / 2, right: x + w / 2,
      top: cy - h / 2, bottom: cy + h / 2
    });
  }

  return out;
}

// Axis-aligned bounding-box overlap.
function aabbHit(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

// Liang-Barsky: does segment (x1,y1)-(x2,y2) cross the AABB `box`?
function segHitsBox(x1, y1, x2, y2, box) {
  let t0 = 0, t1 = 1;
  const dx = x2 - x1, dy = y2 - y1;
  const p = [-dx, dx, -dy, dy];
  const q = [x1 - box.left, box.right - x1, y1 - box.top, box.bottom - y1];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return false;
    } else {
      const r = q[i] / p[i];
      if (p[i] < 0) { if (r > t1) return false; if (r > t0) t0 = r; }
      else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
  }
  return true;
}

// ===========================================================================
// Chart structure. MUST mirror frontend/js/charts/chart-svg-north.js:
//   - viewBox "0 0 400 400"
//   - HOUSE_LAYOUT[h].box  (per-house placement cells)
//   - the outer <rect> + 6 <line> strokes
// If the renderer changes these, update the mirrors here too.
// ===========================================================================
const VIEWBOX = { min: 0, max: 400 };

const HOUSE_BOXES = {
  1:  { left: 158, top: 81,  right: 242, bottom: 135 },
  2:  { left: 64,  top: 48,  right: 144, bottom: 88 },
  3:  { left: 60,  top: 142, right: 136, bottom: 200 },
  4:  { left: 76,  top: 198, right: 160, bottom: 256 },
  5:  { left: 55,  top: 212, right: 135, bottom: 252 },
  6:  { left: 64,  top: 330, right: 160, bottom: 378 },
  7:  { left: 152, top: 312, right: 248, bottom: 364 },
  8:  { left: 232, top: 318, right: 328, bottom: 366 },
  9:  { left: 236, top: 262, right: 328, bottom: 320 },
  10: { left: 238, top: 206, right: 330, bottom: 264 },
  11: { left: 244, top: 142, right: 328, bottom: 200 },
  12: { left: 240, top: 86,  right: 324, bottom: 148 }
};

const STRUCT_LINES = [
  [8,   8,   392, 8],    // rect top
  [8,   392, 392, 392],  // rect bottom
  [8,   8,   8,   392],  // rect left
  [392, 8,   392, 392],  // rect right
  [8,   8,   392, 392],  // diagonal TL -> BR
  [392, 8,   8,   392],  // diagonal TR -> BL
  [200, 8,   392, 200],  // top-mid -> right-mid
  [392, 200, 200, 392],  // right-mid -> bottom-mid
  [200, 392, 8,   200],  // bottom-mid -> left-mid
  [8,   200, 200, 8]     // left-mid -> top-mid
];

// Map a planet to the house whose placement cell contains its centre.
// When several cells overlap, prefer the one that actually contains the
// planet's full text box (tightest fit), instead of the lowest house number.
function houseOf(p) {
  // 1. All boxes whose cell contains the planet's centre point.
  const centerHits = [];
  for (const h of Object.keys(HOUSE_BOXES)) {
    const b = HOUSE_BOXES[h];
    if (p.cx >= b.left && p.cx <= b.right && p.cy >= b.top && p.cy <= b.bottom) {
      centerHits.push({ h: Number(h), b });
    }
  }
  if (centerHits.length === 0) return 0; // 5. no center-containing box

  const tol = 0.5;
  const area = (b) => (b.right - b.left) * (b.bottom - b.top);

  // 2 & 3. Among center hits, prefer boxes that fully contain the text box;
  //        if several do, choose the smallest area.
  let best = null;
  for (const cand of centerHits) {
    const b = cand.b;
    const fullyContains =
      p.left >= b.left - tol && p.right <= b.right + tol &&
      p.top >= b.top - tol && p.bottom <= b.bottom + tol;
    if (fullyContains) {
      if (best === null || area(b) < area(best.b)) {
        best = cand;
      }
    }
  }
  if (best) return best.h;

  // 4. None fully contain it -> return the first center-containing box.
  return centerHits[0].h;
}

// ===========================================================================
// Load the real renderer (unchanged).
// ===========================================================================
const sandbox = { window: {}, console };

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

// ===========================================================================
// Fixtures. lagna rashi_num is always 1, so house number == sign number.
// `buildSignsForHouse` keeps the legacy single-house stress set; the extra
// case fills house 1 with six planets so the lagna mark can actually collide.
// ===========================================================================
const P = {
  Su: { name: 'Sun' }, Mo: { name: 'Moon' }, Me: { name: 'Mercury' },
  Ve: { name: 'Venus' }, Ma: { name: 'Mars' }, Ju: { name: 'Jupiter' },
  Sa: { name: 'Saturn' }, Ra: { name: 'Rahu' }, Ke: { name: 'Ketu' }
};

const stressPlanets = {
  1: [P.Su],
  2: [P.Mo, P.Ju],
  3: [P.Ma, P.Me, P.Ve],
  4: [P.Su, P.Mo, P.Ma, P.Me],
  5: [P.Mo, P.Ju, P.Ve, P.Ma, P.Ke],
  6: [P.Su, P.Mo, P.Ma, P.Me, P.Ju, P.Ve]
};

function buildSignsForHouse(house, planets) {
  const signs = {};
  for (let i = 1; i <= 12; i++) signs[i] = { planets: [] };
  signs[house].planets = planets;
  return signs;
}

const CASES = [];
for (const h of Object.keys(stressPlanets)) {
  CASES.push({ label: 'HOUSE ' + h, signs: buildSignsForHouse(Number(h), stressPlanets[h]) });
}
CASES.push({
  label: 'HOUSE1_LAGNA_STRESS',
  signs: buildSignsForHouse(1, [P.Su, P.Mo, P.Ma, P.Me, P.Ju, P.Ve])
});

// ===========================================================================
// Run.
// ===========================================================================
let totalIssues = 0;

for (const c of CASES) {
  const svg = sandbox.window.APP.chartSVGNorth.renderNorth({
    lagna: { rashi_num: 1 },
    signs: c.signs
  });

  const texts = parseTexts(svg);
  const planets = texts.filter(t => t.role === 'planet');
  const signs = texts.filter(t => t.role === 'sign');
  const lagnas = texts.filter(t => t.role === 'lagna');

  console.log('===== ' + c.label + ' LAYOUT DEBUG =====');
  console.log('planet_text_count=' + planets.length);
  console.log('sign_text_count=' + signs.length);
  console.log('lagna_text_count=' + lagnas.length);
  console.log('svg_length=' + svg.length);

  for (const p of planets) {
    console.log(
      c.label + ' planet="' + p.text + '" x=' + p.x.toFixed(1) + ' y=' + p.y.toFixed(1) +
      ' box=[L' + p.left.toFixed(1) + ',R' + p.right.toFixed(1) +
      ',T' + p.top.toFixed(1) + ',B' + p.bottom.toFixed(1) + '] font=' + p.fontSize
    );
  }

  let issues = 0;

  // (1) planet <-> planet (overlap + legacy too-close heuristics)
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i];
      const b = planets[j];
      if (aabbHit(a, b)) {
        issues++;
        console.log(c.label + ' PLANET_OVERLAP: "' + a.text + '" <-> "' + b.text + '"');
      }
      const dx = Math.abs(a.cx - b.cx);
      const dy = Math.abs(a.cy - b.cy);
      if (dy < 2 && dx < 34) {
        issues++;
        console.log(c.label + ' TOO_CLOSE_HORIZONTAL: "' + a.text + '" <-> "' + b.text + '" dx=' + dx.toFixed(1));
      }
      if (dx < 2 && dy < 14) {
        issues++;
        console.log(c.label + ' TOO_CLOSE_VERTICAL: "' + a.text + '" <-> "' + b.text + '" dy=' + dy.toFixed(1));
      }
    }
  }

  for (const p of planets) {
    // (2) global viewBox escape using the FULL text box (not just the anchor)
    if (p.left < VIEWBOX.min || p.right > VIEWBOX.max || p.top < VIEWBOX.min || p.bottom > VIEWBOX.max) {
      issues++;
      console.log(c.label + ' VIEWBOX_ESCAPE: "' + p.text + '" box L' + p.left.toFixed(1) + ' R' + p.right.toFixed(1) + ' T' + p.top.toFixed(1) + ' B' + p.bottom.toFixed(1));
    }

    // (3) planet escapes its own house placement cell
    const h = houseOf(p);
    if (h === 0) {
      issues++;
      console.log(c.label + ' OUTSIDE_ANY_BOX: "' + p.text + '" centre=(' + p.cx.toFixed(1) + ',' + p.cy.toFixed(1) + ')');
    } else {
      const b = HOUSE_BOXES[h];
      const tol = 0.5;
      if (p.left < b.left - tol || p.right > b.right + tol || p.top < b.top - tol || p.bottom > b.bottom + tol) {
        issues++;
        console.log(
          c.label + ' HOUSE_BOX_ESCAPE: "' + p.text + '" house=' + h +
          ' text=[' + p.left.toFixed(0) + ',' + p.top.toFixed(0) + '-' + p.right.toFixed(0) + ',' + p.bottom.toFixed(0) + ']' +
          ' cell=[' + b.left + ',' + b.top + '-' + b.right + ',' + b.bottom + ']'
        );
      }
    }

    // (4) planet <-> sign number
    for (const s of signs) {
      if (aabbHit(p, s)) {
        issues++;
        console.log(c.label + ' SIGN_COLLISION: planet "' + p.text + '" <-> sign "' + s.text + '"');
      }
    }

    // (5) planet <-> lagna mark
    for (const lg of lagnas) {
      if (aabbHit(p, lg)) {
        issues++;
        console.log(c.label + ' LAGNA_COLLISION: planet "' + p.text + '" <-> lagna');
      }
    }

    // (6) planet <-> structural line / diagonal / border
    for (const seg of STRUCT_LINES) {
      if (segHitsBox(seg[0], seg[1], seg[2], seg[3], p)) {
        issues++;
        console.log(c.label + ' LINE_COLLISION: planet "' + p.text + '" crosses segment (' + seg[0] + ',' + seg[1] + ')->(' + seg[2] + ',' + seg[3] + ')');
      }
    }
  }

  totalIssues += issues;
  console.log(issues ? (c.label + ' FAIL issues=' + issues) : (c.label + ' PASS'));
}

if (totalIssues) {
  console.log('❌ CHART LAYOUT DEBUG FAIL issues=' + totalIssues);
  process.exit(1);
}

console.log('✅ CHART LAYOUT DEBUG PASS');
