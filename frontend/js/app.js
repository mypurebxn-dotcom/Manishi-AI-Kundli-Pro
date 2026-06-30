(function (APP, document) {
  'use strict';
  function step(name, fn) {
    APP.ui && APP.ui.addDebugLog && APP.ui.addDebugLog('BOOT', name);
    try { return Promise.resolve(fn()); } catch (e) { APP.errors.capture(e, 'boot.' + name); return Promise.resolve(false); }
  }
  function boot() {
    return step('error handler', function(){ APP.errors.init(); })
      .then(function(){ return step('state restore', function(){
        APP.state.set('language', APP.storage.get('language', APP.config.defaultLanguage));
        APP.state.set('theme', APP.storage.get('theme', APP.config.defaultTheme));
        APP.state.set('safeMode', APP.config.safeMode || APP.storage.get('safeMode', false));
        APP.state.set('profile', APP.storage.get('profile', {}));
        APP.state.set('lastResult', APP.storage.get('lastResult', null));
      }); })
      .then(function(){ return step('mount shell', function(){ APP.ui.mountShell(); APP.ui.setSafeMode(APP.state.get('safeMode')); }); })
      .then(function(){ return step('theme', function(){ APP.theme.apply(APP.state.get('theme')); }); })
      .then(function(){ return step('register modules', function(){ APP.modules.registerCore(); }); })
      .then(function(){ return step('render nav', function(){ APP.ui.renderNav(); }); })
      .then(function(){ return step('events', function(){ APP.events.bind(); }); })
      .then(function(){ return step('router', function(){ APP.router.init(); }); })
      .then(function(){ return step('health', function(){ APP.health.run(false); }); })
      .then(function(){ return step('pwa optional', function(){ if (!APP.config.debug) APP.pwa.register(false); }); })
      .then(function(){ return step('ready', function(){ APP.ui.hideBootFallback(); APP.ui.toast(APP.i18n.t('ready'), 'ok'); }); })
      .catch(function(e){
        APP.errors.capture(e, 'boot.fatal');
        var root = document.getElementById('app');
        if (root) root.innerHTML = '<section class="boot-fallback"><div class="boot-card"><h1>Safe fallback mode</h1><p>App boot में error आया, लेकिन blank screen रोकी गई है।</p><a class="btn" href="./index.html?safe=1&debug=1">Open Safe Mode</a></div></section>';
      });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true }); else boot();
})(window.APP, document);

window.addEventListener("error", function(e){
  if (document.getElementById("mkp-js-error-box")) return;
  document.body.insertAdjacentHTML("beforeend",
    '<pre id="mkp-js-error-box" style="white-space:pre-wrap;background:#300;color:#fff;padding:12px;margin:12px;border-radius:8px;z-index:99999;position:relative">JS ERROR: '
    + String(e.message) + "\n" + String(e.filename) + ":" + String(e.lineno) + ":" + String(e.colno)
    + '</pre>'
  );
});

window.addEventListener("unhandledrejection", function(e){
  if (document.getElementById("mkp-promise-error-box")) return;
  document.body.insertAdjacentHTML("beforeend",
    '<pre id="mkp-promise-error-box" style="white-space:pre-wrap;background:#330;color:#fff;padding:12px;margin:12px;border-radius:8px;z-index:99999;position:relative">PROMISE ERROR: '
    + String(e.reason && (e.reason.stack || e.reason.message || e.reason))
    + '</pre>'
  );
});
