(function(APP){
  'use strict';

  function esc(v){
    return APP.utils.escapeHTML(v == null ? '' : String(v));
  }

  function deg(v){
    return v == null ? '' : esc(v) + '°';
  }

  function getPayload(r){
    if (!r) return null;
    if (r.calculation) return r;
    if (r.backend && r.backend.calculation) return r.backend;
    return r;
  }

  function profileOf(r){
    r = getPayload(r);
    return (r && r.validation && r.validation.profile) ||
      (r && r.profile) ||
      (r && r.local && r.local.profile) ||
      {};
  }

  function calcOf(r){
    r = getPayload(r);
    return r && r.calculation ? r.calculation : null;
  }

  function planetTable(planets){
    if (!Array.isArray(planets) || !planets.length) return '<div class="empty">ग्रह data उपलब्ध नहीं है।</div>';

    var rows = planets.map(function(p){
      return '<tr>' +
        '<td><b>' + esc(p.name) + '</b></td>' +
        '<td>' + esc(p.rashi_hi || p.rashi) + '</td>' +
        '<td>' + deg(p.degree) + '</td>' +
        '<td>' + esc(p.nakshatra) + '</td>' +
        '<td>' + esc(p.pada) + '</td>' +
        '<td>' + esc(p.d9_rashi_hi || p.d9_rashi) + '</td>' +
      '</tr>';
    }).join('');

    return '<div class="chart-table-wrapper"><table><thead><tr>' +
      '<th>ग्रह</th><th>राशि</th><th>अंश</th><th>नक्षत्र</th><th>पाद</th><th>D9</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  function houseTable(houses){
    if (!Array.isArray(houses) || !houses.length) return '<div class="empty">भाव data उपलब्ध नहीं है।</div>';

    var rows = houses.map(function(h){
      return '<tr>' +
        '<td>' + esc(h.house_number) + '</td>' +
        '<td>' + esc(h.rashi_hi || h.rashi) + '</td>' +
        '<td>' + esc(h.house_type) + '</td>' +
      '</tr>';
    }).join('');

    return '<div class="chart-table-wrapper"><table><thead><tr>' +
      '<th>भाव</th><th>राशि</th><th>Type</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  function dashaSummary(calc){
    var d = calc && calc.dasha;
    if (!d) return '';

    var md = d.current_mahadasha || {};
    var janma = d.janma_nakshatra || {};

    return '<div class="card">' +
      '<h3>⏳ दशा सारांश</h3>' +
      '<p><b>जन्म नक्षत्र:</b> ' + esc(janma.nakshatra) + ' • पाद ' + esc(janma.pada) + ' • स्वामी ' + esc(janma.lord) + '</p>' +
      '<p><b>जन्म दशा:</b> ' + esc(d.birth_dasha_lord) + ' • Balance ' + esc(d.birth_dasha_balance_years) + ' years</p>' +
      '<p><b>वर्तमान महादशा:</b> ' + esc(md.planet) + ' (' + esc(md.start_date) + ' → ' + esc(md.end_date) + ')</p>' +
    '</div>';
  }

  function render(r){
    if (!r) {
      return '<div class="card"><p>No result yet. Use Profile, Health or Kundli calculation first.</p></div>';
    }

    var payload = getPayload(r);
    var p = profileOf(payload);
    var calc = calcOf(payload);

    if (!calc) {
      return '<div class="card"><h3>📊 Validation Result</h3>' +
        '<p><b>Status:</b> ' + esc(payload && payload.ok ? 'OK' : 'Needs attention') + '</p>' +
        '<p><b>Calculation Ready:</b> ' + esc(payload && payload.calculationReady) + '</p>' +
        '<details><summary>Debug JSON</summary><pre class="debug-log">' + esc(APP.utils.safeJSONStringify(r)) + '</pre></details>' +
      '</div>';
    }

    var lagna = calc.lagna || {};

    return '<div class="result-pro">' +
      '<div class="card hero-card">' +
        '<h2>☀ कुण्डली परिणाम</h2>' +
        '<p class="card-muted">Exact Swiss Ephemeris calculation से प्राप्त जन्म कुण्डली सारांश।</p>' +
        '<div class="status-row">' +
          '<span class="badge ok">Ready</span>' +
          '<span class="badge warn">Final prediction locked</span>' +
          '<span class="badge ok">' + esc(payload.phase || 'phase27') + '</span>' +
        '</div>' +
      '</div>' +

      '<div class="panel-grid">' +
        '<div class="card"><h3>👤 जन्म विवरण</h3>' +
          '<p><b>नाम:</b> ' + esc(p.name) + '</p>' +
          '<p><b>तिथि:</b> ' + esc(p.date) + ' • <b>समय:</b> ' + esc(p.time) + '</p>' +
          '<p><b>स्थान:</b> ' + esc(p.place) + '</p>' +
          '<p><b>Coordinates:</b> ' + esc(p.lat) + ', ' + esc(p.lon) + ' • TZ ' + esc(p.tzOffset) + '</p>' +
        '</div>' +

        '<div class="card"><h3>♍ लग्न</h3>' +
          '<p><b>' + esc(lagna.rashi_hi || lagna.rashi) + '</b> ' + deg(lagna.degree) + '</p>' +
          '<p><b>D9:</b> ' + esc(lagna.d9_rashi_hi || lagna.d9_rashi) + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="panel-grid">' + (APP.chartRenderer ? APP.chartRenderer.render('D1','north') : '') + (APP.chartRenderer ? APP.chartRenderer.render('D9','north') : '') + '</div>' + '<div class="card"><h3>🪐 ग्रह स्थिति</h3>' + planetTable(calc.planets) + '</div>' +
      '<div class="card"><h3>🏠 12 भाव</h3>' + houseTable(calc.houses) + '</div>' +
      dashaSummary(calc) +
      '<details class="card"><summary>🧪 Debug JSON</summary><pre class="debug-log">' + esc(APP.utils.safeJSONStringify(r)) + '</pre></details>' +
    '</div>';
  }

  APP.resultViewer = { render: render };

})(window.APP);
