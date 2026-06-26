(function (APP) {
  'use strict';

  function profile() {
    try {
      var p = (APP.profileStore && APP.profileStore.current && APP.profileStore.current()) || APP.storage.get('profile', {}) || {};
      p = p || {};
      p.lat = p.lat || p.latitude || p.profileLat || '';
      p.lon = p.lon || p.longitude || p.profileLon || '';

      if ((!p.lat || !p.lon) && APP.profileStore && APP.profileStore.list) {
        var rows = APP.profileStore.list() || [];
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i] || {};
          var lat = r.lat || r.latitude || r.profileLat;
          var lon = r.lon || r.longitude || r.profileLon;
          if (lat && lon) {
            p = r;
            p.lat = lat;
            p.lon = lon;
            if (APP.profileStore.save) APP.profileStore.save(p);
            break;
          }
        }
      }

      return p;
    } catch (e) {
      APP.errors.capture(e, 'kundli.profile');
      return {};
    }
  }

  function safeCell(value) {
    return APP.utils.escapeHTML(value == null ? '' : String(value));
  }

  function renderMissingProfileCard(p) {
    var missing = [];
    if (!p.lat) {
      var latEl = document.querySelector('#profileLat');
      if (latEl && latEl.value) p.lat = latEl.value;
    }
    if (!p.lon) {
      var lonEl = document.querySelector('#profileLon');
      if (lonEl && lonEl.value) p.lon = lonEl.value;
    }
    if (!p.name) missing.push('नाम');
    if (!p.date) missing.push('जन्म तारीख');
    if (!p.time) missing.push('जन्म समय');
    if (!p.place) missing.push('जन्म स्थान');
    if (!p.lat || !p.lon) missing.push('Latitude/Longitude');
    return '<div class="card">' +
      '<h3>☀ कुण्डली गणना</h3>' +
      '<p class="card-muted">सटीक गणना के लिए Profile में जन्म तारीख, समय, स्थान और latitude/longitude भरना जरूरी है।</p>' +
      '<p><b>अभी missing:</b> ' + safeCell(missing.join(', ') || 'कुछ नहीं') + '</p>' +
      '<button class="btn gold" data-action="route-profile">Profile खोलें</button>' +
      '</div>';
  }

  function renderCalculation(calc) {
    var planets = Array.isArray(calc.planets) ? calc.planets : [];
    var houses = Array.isArray(calc.houses) ? calc.houses : [];
    var html = '<div class="kundli-result">' +
      '<div class="card hero-card">' +
      '<h3>☀ सटीक कुण्डली गणना</h3>' +
      '<p class="card-muted">Swiss Ephemeris bridge से निकला calculation JSON। फलादेश अभी safety/evidence gate के बाद खुलेगा।</p>' +
      '<div class="status-row"><span class="badge ok">लग्न: ' + safeCell(calc.lagna && (calc.lagna.rashi_hi || calc.lagna.rashi)) + ' ' + safeCell(calc.lagna && calc.lagna.degree) + '°</span>' +
      '<span class="badge warn">Final prediction locked</span></div>' +
      '</div>';

    html += '<div class="card"><h4>ग्रह डिग्री तालिका</h4>' +
      '<div class="chart-table-wrapper"><table><thead><tr><th>ग्रह</th><th>राशि</th><th>अंश</th><th>नक्षत्र</th><th>पाद</th><th>D9</th></tr></thead><tbody>';
    planets.forEach(function (p) {
      html += '<tr><td><b>' + safeCell(p.name) + '</b></td><td>' + safeCell(p.rashi_hi || p.rashi) + '</td><td>' + safeCell(p.degree) + '°</td><td>' + safeCell(p.nakshatra) + '</td><td>' + safeCell(p.pada) + '</td><td>' + safeCell(p.d9_rashi_hi || p.d9_rashi) + '</td></tr>';
    });
    html += '</tbody></table></div><div class="chart-card-mode">';
    planets.forEach(function (p) {
      html += '<div class="mini-row"><b>' + safeCell(p.name) + '</b><span>' + safeCell(p.rashi_hi || p.rashi) + ' ' + safeCell(p.degree) + '° • ' + safeCell(p.nakshatra) + '-' + safeCell(p.pada) + ' • D9 ' + safeCell(p.d9_rashi_hi || p.d9_rashi) + '</span></div>';
    });
    html += '</div></div>';

    html += '<div class="card"><h4>12 भाव — Whole Sign Audit</h4><div class="chart-table-wrapper"><table><thead><tr><th>भाव</th><th>राशि</th><th>Type</th></tr></thead><tbody>';
    houses.forEach(function (h) {
      html += '<tr><td>' + safeCell(h.house_number) + '</td><td>' + safeCell(h.rashi_hi || h.rashi) + '</td><td>' + safeCell(h.house_type) + '</td></tr>';
    });
    html += '</tbody></table></div></div>';

    if (calc.meta) {
      html += '<div class="card"><h4>Calculation Audit</h4><pre class="debug-log">' + safeCell(JSON.stringify(calc.meta, null, 2)) + '</pre></div>';
    }

    html += '</div>';
    return html;
  }

  APP.features.register({
    id: 'kundli',
    name: 'Kundli Core',
    icon: '☀',
    version: '27.6.0',
    loaded: true,

    init: function () {
      document.addEventListener('click', function (e) {
        if (!e.target || e.target.id !== 'btnCalculateReal') return;
        e.preventDefault();
        var btn = e.target;
        var p = profile();
        if (!p.date || !p.time || !p.place || !p.lat || !p.lon) {
          APP.ui.toast('Profile में date/time/place/lat/lon पूरा करें', 'err');
          APP.router.go('profile');
          return;
        }
        btn.textContent = 'गणना जारी है...';
        btn.disabled = true;
        APP.ui.loading(true, 'Exact Kundli calculation...');
        APP.api.post('/expert-calculate', { profile: p })
          .then(function (data) {
            APP.state.set('lastResult', data);
            if (APP.events && APP.events.addHistory) APP.events.addHistory('kundli_exact_calculated', data);
            APP.ui.toast(data && data.ok ? 'Exact calculation complete' : 'Calculation warning', data && data.ok ? 'ok' : 'err');
            APP.features.render('kundli', '#featureHost');
          })
          .catch(function (err) {
            APP.errors.capture(err, 'kundli.calculate');
            APP.state.set('lastResult', { ok: false, error: err.message || String(err) });
            APP.ui.toast('Backend calculation failed', 'err');
          })
          .finally(function () {
            btn.textContent = 'Calculate Exact Kundli';
            btn.disabled = false;
            APP.ui.loading(false);
          });
      }, true);
      return true;
    },

    render: function () {
      var p = profile();
      var lastResult = APP.state.get('lastResult');
      if (!lastResult || !lastResult.calculation || lastResult.calculation.status !== 'exact_calculation_complete') {
        if (!p.date || !p.time || !p.place || !p.lat || !p.lon) return renderMissingProfileCard(p);
        return '<div class="card"><h3>☀ Kundli Core</h3><p class="card-muted">Profile ready है। अब exact calculation चलाएं।</p><button class="btn gold" id="btnCalculateReal">Calculate Exact Kundli</button></div>';
      }
      return renderCalculation(lastResult.calculation);
    },

    healthCheck: function () {
      return { ok: true, detail: 'kundli-core-27-6-ready' };
    }
  });

})(window.APP);
