(function (APP) {
  'use strict';
  function run(verbose) {
    var result = {
      time: new Date().toISOString(),
      frontend: 'ok',
      modules: [],
      features: APP.features ? APP.features.health() : { ok:false, error:'feature registry missing' },
      apiBridge: APP.apiBridge ? { ok:true, endpoints:Object.keys(APP.apiBridge.endpoints || {}).length } : { ok:false, error:'api bridge missing' },
      backend: 'checking',
      errors: APP.errors.list().length,
      phase: APP.config.phase,
      version: APP.config.version
    };
    APP.modules.list().forEach(function(m){
      try {
        var h = m.healthCheck ? m.healthCheck() : { ok:true };
        result.modules.push({ id:m.id, ok: h.ok !== false });
      } catch (e) {
        result.modules.push({ id:m.id, ok:false, error:e.message });
        APP.errors.capture(e, 'health.' + m.id);
      }
    });
    return APP.api.get('/health').then(function(res){
      result.backend = res && res.ok ? 'ok' : 'fail';
      return result;
    }).catch(function(e){
      result.backend = 'offline';
      APP.errors.capture(e, 'health.backend');
      return result;
    }).then(function(out){
      var ok = out.backend === 'ok' && (!out.features || out.features.ok !== false);
      APP.state.set('health', ok ? 'ok' : 'warn');
      APP.ui.setHealth(ok ? 'ok' : 'warn');
      if (verbose) {
        var box = APP.utils.qs('#healthOutput');
        if (box) box.textContent = APP.utils.safeJSONStringify(out);
        APP.ui.toast('Health check complete', ok ? 'ok' : 'err');
      }
      return out;
    });
  }
  APP.health = { run: run };
})(window.APP);
