(function (APP) {
  'use strict';

  function esc(value) { return APP.utils.escapeHTML(value == null ? '' : String(value)); }

  APP.features.register({
    id: 'dasha',
    name: 'Dasha Engine',
    icon: '⏳',
    version: '27.6.0',
    loaded: true,

    render: function () {
      var lastResult = APP.state.get('lastResult');
      if (!lastResult || !lastResult.calculation || !lastResult.calculation.dasha) {
        return '<div class="card"><h3>⏳ विंशोत्तरी दशा</h3><p class="card-muted">पहले Kundli Core में exact calculation चलाएं।</p></div>';
      }

      var dasha = lastResult.calculation.dasha;
      var currentDasha = dasha.current_mahadasha || {};
      var janma = dasha.janma_nakshatra || {};

      var html = '<div class="card hero-card"><h3>⏳ सक्रिय विंशोत्तरी महादशा</h3>' +
        '<p class="card-muted">यह गणना जन्म चन्द्रमा के नक्षत्र-पाद से बनी है। यह अभी फलादेश नहीं, timing audit है।</p>' +
        '<div class="status-row"><span class="badge ok">अभी: ' + esc(currentDasha.planet) + ' (' + esc(currentDasha.start_date) + ' से ' + esc(currentDasha.end_date) + ')</span>' +
        '<span class="badge warn">Final prediction locked</span></div>' +
        '<p><b>जन्म नक्षत्र:</b> ' + esc(janma.nakshatra) + ' पाद ' + esc(janma.pada) + ' | <b>जन्म दशा:</b> ' + esc(dasha.birth_dasha_lord) + ' | <b>Balance:</b> ' + esc(dasha.birth_dasha_balance_years) + ' वर्ष</p>' +
        '</div>';

      html += '<div class="card"><h4>पूर्ण महादशा क्रम</h4><div class="dasha-list">';
      (dasha.full_timeline || []).forEach(function (t) {
        var isCurrent = t.planet === currentDasha.planet && t.start_date === currentDasha.start_date;
        html += '<div class="mini-row ' + (isCurrent ? 'active' : '') + '"><b>' + esc(t.planet) + ' महादशा</b><span>' + esc(t.start_date) + ' → ' + esc(t.end_date) + ' (' + esc(t.years) + ' वर्ष)</span>' + (isCurrent ? '<em>सक्रिय</em>' : '') + '</div>';
      });
      html += '</div></div>';
      return html;
    },

    healthCheck: function () {
      return { ok: true, detail: 'dasha-timeline-27-6-ready' };
    }
  });

})(window.APP);
