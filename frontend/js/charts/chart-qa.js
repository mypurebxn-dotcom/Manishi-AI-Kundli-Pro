(function(APP){
  'use strict';

  function getChartList(){
    if (APP.chartModule && typeof APP.chartModule.charts === 'function') {
      return APP.chartModule.charts();
    }
    return [
      { type:'D1', layout:'north' },
      { type:'D9', layout:'north' }
    ];
  }

  function getLayoutList(){
    if (APP.chartRenderer && typeof APP.chartRenderer.listLayouts === 'function') {
      return APP.chartRenderer.listLayouts();
    }
    return [];
  }

  function check(type){
    var data = APP.chartEngine && APP.chartEngine.build ? APP.chartEngine.build(type || 'D1') : null;
    var issues = [];

    if (!data) issues.push('chart_data_missing');
    if (data && !data.lagna) issues.push('lagna_missing');
    if (data && !data.signs) issues.push('signs_missing');

    var planetCount = 0;
    if (data && data.signs) {
      Object.keys(data.signs).forEach(function(k){
        planetCount += (data.signs[k].planets || []).length;
      });
    }

    if (planetCount < 9) issues.push('planet_count_low_' + planetCount);

    return {
      type: type || 'D1',
      ok: issues.length === 0,
      planetCount: planetCount,
      issues: issues
    };
  }

  function render(){
    var checks = getChartList().map(function(item){
      return check(item.type);
    });
    var layouts = getLayoutList();

    var rows = checks.map(function(row){
      return '<p><b>' + APP.utils.escapeHTML(row.type) + ':</b> ' +
        (row.ok ? 'OK' : 'WARN') +
        ' • planets: ' + row.planetCount +
      '</p>';
    }).join('');

    return '<div class="card"><h3>🧪 चार्ट QA</h3>' +
      rows +
      '<p><b>Layouts:</b> ' + APP.utils.escapeHTML(layouts.map(function(item){ return item.name; }).join(', ')) + '</p>' +
      '<details><summary>QA JSON</summary><pre class="debug-log">' +
        APP.utils.escapeHTML(APP.utils.safeJSONStringify({ charts: checks, layouts: layouts })) +
      '</pre></details></div>';
  }

  APP.chartQA = {
    check: check,
    render: render
  };

})(window.APP);
