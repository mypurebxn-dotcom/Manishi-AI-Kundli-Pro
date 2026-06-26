(function (APP, navigator) {
  'use strict';
  function register(manual) {
    if (!('serviceWorker' in navigator)) { if (manual) APP.ui.toast('Service worker not supported', 'err'); return Promise.resolve(false); }
    return navigator.serviceWorker.register('./service-worker.js').then(function(){ if (manual) APP.ui.toast('PWA registered', 'ok'); return true; }).catch(function(e){ APP.errors.capture(e, 'pwa.register'); if (manual) APP.ui.toast('PWA register failed', 'err'); return false; });
  }
  APP.pwa = { register: register };
})(window.APP, navigator);
