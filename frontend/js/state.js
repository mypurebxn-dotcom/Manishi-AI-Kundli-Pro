(function (APP) {
  'use strict';
  var data = { route: 'home', language: 'hi', theme: 'dark', online: navigator.onLine, health: 'unknown', safeMode: APP.config.safeMode, profile: {}, lastResult: null };
  var listeners = {};
  function get(key){ return key ? data[key] : Object.assign({}, data); }
  function set(key, value){
    data[key] = value;
    if (key === 'lastResult' && APP.storage) APP.storage.set('lastResult', value);
    emit(key, value);
    emit('*', get());
  }
  function on(key, handler){ if (!listeners[key]) listeners[key] = []; listeners[key].push(handler); return function(){ listeners[key] = (listeners[key] || []).filter(function(h){ return h !== handler; }); }; }
  function emit(key, value){ (listeners[key] || []).slice().forEach(function(h){ try { h(value); } catch (e) { APP.errors.capture(e, 'state.listener'); } }); }
  APP.state = { get: get, set: set, on: on, emit: emit };
})(window.APP);
