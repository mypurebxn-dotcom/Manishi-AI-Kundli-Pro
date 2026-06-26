(function(APP){
  'use strict';

  var LAYOUTS = Object.create(null);

  function registerLayout(name, renderer, label){
    if (!name || typeof renderer !== 'function') return false;

    LAYOUTS[String(name).toLowerCase()] = {
      name: String(name).toLowerCase(),
      label: label || String(name),
      renderer: renderer
    };

    return true;
  }

  function ensureDefaults(){
    if (APP.chartSVG && typeof APP.chartSVG.renderNorth === 'function' && !LAYOUTS.north) {
      registerLayout('north', APP.chartSVG.renderNorth, 'उत्तर भारतीय');
    }
  }

  function render(type, layout){
    type = String(type || 'D1').toUpperCase();
    layout = String(layout || 'north').toLowerCase();

    if (!APP.chartEngine || !APP.chartSVG) {
      return '<div class="empty">चार्ट इंजन लोड नहीं हुआ।</div>';
    }

    ensureDefaults();

    var data = APP.chartEngine.build(type);
    if (!data) {
      return '<div class="empty">Calculation के बाद चार्ट दिखेगा।</div>';
    }

    var item = LAYOUTS[layout];
    if (!item) {
      return '<div class="empty">Layout अभी उपलब्ध नहीं है।</div>';
    }

    return '<div class="card"><h3>🧭 ' + type + ' ' + item.label + ' चार्ट</h3>' +
      item.renderer(data) +
    '</div>';
  }

  APP.chartRenderer = {
    render: render,
    registerLayout: registerLayout,
    layouts: LAYOUTS
  };

})(window.APP);
