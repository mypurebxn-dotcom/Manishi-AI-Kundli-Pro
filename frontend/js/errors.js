(function (APP, window) {
  'use strict';
  var errors = [];
  function now(){ return new Date().toISOString(); }
  function normalize(error, source) {
    var message = 'Unknown error';
    var stack = '';
    if (error) {
      message = error.message || String(error);
      stack = error.stack || '';
    }
    return { time: now(), source: source || 'app', message: message, stack: stack };
  }
  function capture(error, source) {
    var item = normalize(error, source);
    errors.push(item);
    if (errors.length > 100) errors.shift();
    try { console.error('[MKP]', item.source + ':', item.message, item.stack || ''); } catch (_) {}
    if (APP.ui && APP.ui.addDebugLog) APP.ui.addDebugLog('ERROR', item.source + ' — ' + item.message);
    if (APP.ui && APP.ui.setError) APP.ui.setError(item);
    return item;
  }
  function init() {
    window.onerror = function (message, file, line, col, error) {
      capture(error || new Error(message + ' at ' + file + ':' + line + ':' + col), 'window.onerror');
      return false;
    };
    window.onunhandledrejection = function (event) {
      capture(event && event.reason ? event.reason : new Error('Unhandled promise rejection'), 'unhandledrejection');
    };
  }
  APP.errors = { init: init, capture: capture, list: function(){ return errors.slice(); } };
})(window.APP, window);
