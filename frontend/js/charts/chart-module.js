(function(APP){
  'use strict';

  var CHART_REGISTRY = Object.create(null);

  function registerChart(type, layout){
    CHART_REGISTRY[String(type).toUpperCase()] = {
      type: String(type).toUpperCase(),
      layout: layout || 'north'
    };
  }

  function syncFromBuilders(){
    if (!APP.chartData || !APP.chartData.builders) return;
    Object.keys(APP.chartData.builders).forEach(function(type){
      if (!CHART_REGISTRY[type]) registerChart(type, 'north');
    });
  }

  registerChart('D1','north');
  registerChart('D9','north');

  function listCharts(){
    syncFromBuilders();
    return Object.keys(CHART_REGISTRY)
      .sort()
      .map(function(k){ return CHART_REGISTRY[k]; });
  }

  function getLastResult(){
    var r = APP.state ? APP.state.get('lastResult') : null;

    if (!r && APP.storage) {
      r = APP.storage.get('lastResult', null);

      if (r && APP.state) {
        APP.state.set('lastResult', r);
      }
    }

    return r;
  }

  function renderChartItem(item){
    if (!item || !item.type || !APP.chartRenderer) {
      return '';
    }

    return APP.chartRenderer.render(item.type, item.layout || 'north');
  }

  function chartTypesLabel(){
    return listCharts().map(function(item){ return item.type; }).join(', ');
  }

  function renderCharts(){
    return listCharts().map(renderChartItem).join('');
  }

  function render(){
    var r = getLastResult();

    if (!r || !APP.chartRenderer) {
      return '<div class="card"><h3>📊 चार्ट व्यूअर</h3><p>पहले कुण्डली कोर से गणना चलाएं।</p></div>';
    }

    return '<div class="result-pro">' +
      '<div class="card hero-card">' +
        '<h2>📊 कुण्डली चार्ट</h2>' +
        '<p class="card-muted">' + chartTypesLabel() + ' चार्ट गणना डेटा से बन रहे हैं।</p>' +
      '</div>' +
      '<div class="panel-grid">' +
        renderCharts() +
      '</div>' +
      (APP.chartQA ? APP.chartQA.render() : '') +
    '</div>';
  }

  APP.chartModule = {
    render: render,
    charts: listCharts,
    registerChart: registerChart,
    syncFromBuilders: syncFromBuilders
  };

})(window.APP);
