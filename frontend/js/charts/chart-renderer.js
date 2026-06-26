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
    if (!APP.chartSVG) return;

    if (typeof APP.chartSVG.renderNorth === 'function' && !LAYOUTS.north) {
      registerLayout('north', APP.chartSVG.renderNorth, 'उत्तर भारतीय');
    }

    if (typeof APP.chartSVG.renderSouth === 'function' && !LAYOUTS.south) {
      registerLayout('south', APP.chartSVG.renderSouth, 'दक्षिण भारतीय');
    }

    if (typeof APP.chartSVG.renderEast === 'function' && !LAYOUTS.east) {
      registerLayout('east', APP.chartSVG.renderEast, 'पूर्व भारतीय');
    }
  }

  function listLayouts(){
    ensureDefaults();

    return Object.keys(LAYOUTS).sort().map(function(key){
      return {
        name: LAYOUTS[key].name,
        label: LAYOUTS[key].label
      };
    });
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
    listLayouts: listLayouts,
    layouts: LAYOUTS
  };

})(window.APP);
