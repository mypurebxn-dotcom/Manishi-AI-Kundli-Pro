(function (APP, window) {
  'use strict';
  function go(route) {
    route = route || 'home';
    APP.state.set('route', route);
    APP.modules.render(route);
    try { history.replaceState(null, '', '#' + encodeURIComponent(route)); } catch (_) {}
  }
  function init() {
    var initial = (window.location.hash || '').replace('#','') || 'home';
    go(decodeURIComponent(initial));
    window.addEventListener('hashchange', function(){ go(decodeURIComponent((window.location.hash || '').replace('#','') || 'home')); });
  }
  APP.router = { init: init, go: go };
})(window.APP, window);
