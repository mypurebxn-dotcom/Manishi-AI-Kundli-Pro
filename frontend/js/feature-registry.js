(function (APP, window, document) {
  'use strict';
  var registry = {};
  var scriptCache = {};
  var bootLog = [];

  function log(level, message) {
    var line = new Date().toISOString() + ' [' + level + '] ' + message;
    bootLog.push(line);
    if (bootLog.length > 150) bootLog.shift();
    if (APP.ui && APP.ui.addDebugLog) APP.ui.addDebugLog(level, message);
    try { console.log('[MKP Feature]', level, message); } catch (_) {}
  }

  function normalize(def) {
    def = def || {};
    return {
      id: String(def.id || '').trim(),
      name: def.name || def.title || 'Unnamed Feature',
      title: def.title || def.name || 'Unnamed Feature',
      version: def.version || '1.0.0',
      icon: def.icon || '◇',
      category: def.category || 'general',
      description: def.description || '',
      source: def.source || '',
      enabled: def.enabled !== false,
      loaded: !!def.loaded,
      initialized: !!def.initialized,
      status: def.status || 'registered',
      error: def.error || '',
      init: typeof def.init === 'function' ? def.init : function(){ return true; },
      render: typeof def.render === 'function' ? def.render : function(){ return '<div class="empty">Feature registered. UI will be added in next phase.</div>'; },
      destroy: typeof def.destroy === 'function' ? def.destroy : function(){},
      healthCheck: typeof def.healthCheck === 'function' ? def.healthCheck : function(){ return { ok:true, status:'ok' }; },
      fallback: typeof def.fallback === 'function' ? def.fallback : function(){ return '<div class="error-box">Feature fallback mode: ' + APP.utils.escapeHTML(def.name || def.id || 'unknown') + '</div>'; }
    };
  }

  function register(def) {
    var oldItem, item;
    def = def || {};
    if (!def.id) throw new Error('Feature id required');
    oldItem = registry[def.id] || {};
    item = normalize(Object.assign({}, oldItem, def));
    registry[item.id] = item;
    log('FEATURE', 'registered: ' + item.id);
    return item;
  }

  function installManifest(list) {
    (list || []).forEach(function(def){
      try { register(Object.assign({ status:'manifest' }, def)); }
      catch (e) { APP.errors.capture(e, 'features.installManifest'); }
    });
  }

  function get(id) { return registry[id] || null; }
  function list() { return Object.keys(registry).map(function(id){ return registry[id]; }); }
  function countByStatus(status) { return list().filter(function(item){ return item.status === status; }).length; }

  function loadScript(src) {
    if (!src) return Promise.reject(new Error('Feature source missing'));
    if (scriptCache[src]) return scriptCache[src];
    scriptCache[src] = new Promise(function(resolve, reject){
      var script = document.createElement('script');
      var done = false;
      var sep = src.indexOf('?') >= 0 ? '&' : '?';
      var url = src + sep + 'v=' + encodeURIComponent(APP.config.version) + '&fresh=' + Date.now();
      var timer = setTimeout(function(){
        if (done) return;
        done = true;
        script.onerror = script.onload = null;
        reject(new Error('Feature load timeout: ' + src));
      }, APP.config.moduleTimeoutMs || 3000);
      script.src = url;
      script.async = true;
      script.onload = function(){
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve(true);
      };
      script.onerror = function(){
        if (done) return;
        done = true;
        clearTimeout(timer);
        reject(new Error('Feature script failed: ' + src));
      };
      document.head.appendChild(script);
    });
    return scriptCache[src];
  }

  function load(id) {
    var item = get(id);
    if (!item) return Promise.reject(new Error('Feature not found: ' + id));
    if (item.enabled === false) return Promise.reject(new Error('Feature disabled: ' + id));
    return Promise.resolve()
      .then(function(){
        if (!item.loaded && item.source) {
          item.status = 'loading';
          log('FEATURE', 'loading: ' + id);
          return loadScript(item.source).then(function(){
            var updated = get(id) || item;
            updated.loaded = true;
            updated.status = 'loaded';
            registry[id] = updated;
            item = updated;
          });
        }
      })
      .then(function(){
        item = get(id) || item;
        if (!item.initialized) {
          return APP.utils.timeoutPromise(Promise.resolve(item.init(APP)), APP.config.moduleTimeoutMs || 3000, 'Feature init ' + id).then(function(){
            item.initialized = true;
            item.status = 'ready';
            item.loaded = true;
            registry[id] = item;
            log('FEATURE', 'ready: ' + id);
          });
        }
      })
      .then(function(){ return get(id) || item; })
      .catch(function(error){
        item = get(id) || item;
        item.status = 'failed';
        item.error = error.message || String(error);
        registry[id] = item;
        APP.errors.capture(error, 'features.load.' + id);
        return item;
      });
  }

  function render(id, hostSelector) {
    var host = APP.utils.qs(hostSelector || '#featureHost');
    if (!host) return APP.ui.toast('Feature host missing', 'err');
    host.innerHTML = '<div class="card"><div class="spinner" aria-hidden="true"></div><p>Loading feature...</p></div>';
    return load(id).then(function(item){
      APP.utils.raf(function(){
        try {
          if (!item || item.status === 'failed') throw new Error(item && item.error ? item.error : 'Feature failed');
          host.innerHTML = item.render({}, APP) || '<div class="empty">Empty feature output</div>';
          APP.ui.toast(item.name + ' loaded', 'ok');
        } catch (error) {
          APP.errors.capture(error, 'features.render.' + id);
          host.innerHTML = '<div class="error-box"><b>Feature render error:</b><pre>' + APP.utils.escapeHTML(error && (error.stack || error.message || String(error))) + '</pre></div>';
        }
      });
      return item;
    });
  }

  function destroy(id) {
    var item = get(id);
    if (!item) return false;
    try { item.destroy(APP); item.initialized = false; item.status = item.loaded ? 'loaded' : 'registered'; return true; }
    catch (e) { APP.errors.capture(e, 'features.destroy.' + id); return false; }
  }

  function health() {
    var rows = list().map(function(item){
      try {
        var h = item.healthCheck(APP) || { ok:true };
        return { id:item.id, name:item.name, status:item.status, ok:h.ok !== false, detail:h.detail || h.status || 'ok' };
      } catch (e) {
        APP.errors.capture(e, 'features.health.' + item.id);
        return { id:item.id, name:item.name, status:'failed', ok:false, detail:e.message || String(e) };
      }
    });
    return { ok: rows.every(function(r){ return r.ok; }), total: rows.length, ready: rows.filter(function(r){ return r.status === 'ready'; }).length, rows: rows };
  }

  APP.features = { register: register, installManifest: installManifest, get: get, list: list, load: load, render: render, destroy: destroy, health: health, countByStatus: countByStatus, log: log, bootLog: function(){ return bootLog.slice(); } };
})(window.APP, window, document);
