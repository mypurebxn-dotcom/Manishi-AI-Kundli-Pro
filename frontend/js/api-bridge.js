(function (APP) {
  'use strict';

  var endpoints = {
    health: { method: 'GET', path: '/health', title: 'Backend Health' },
    contractHealth: { method: 'GET', path: '/contracts/health', title: 'API Contract Health' },
    profileValidate: { method: 'POST', path: '/profile/validate', title: 'Profile Validate' },
    expertCalculate: { method: 'POST', path: '/expert-calculate', title: 'Expert Calculate' },
    faladesh: { method: 'POST', path: '/faladesh', title: 'Faladesh Safe Draft' },
    reportJson: { method: 'POST', path: '/report/json', title: 'Report JSON' },
    qaAudit: { method: 'POST', path: '/qa/audit', title: 'QA Audit' }
  };

  function safeProfile() {
    try {
      if (APP.profileStore && typeof APP.profileStore.current === 'function') return APP.profileStore.current() || {};
      return APP.storage.get('profile', {}) || {};
    } catch (e) {
      APP.errors.capture(e, 'apiBridge.safeProfile');
      return {};
    }
  }

  function normalizeProfile(profile) {
    var p = profile || {};
    return {
      name: String(p.name || '').trim(),
      date: String(p.date || '').trim(),
      time: String(p.time || '').trim(),
      place: String(p.place || '').trim(),
      lat: String(p.lat || '').trim(),
      lon: String(p.lon || '').trim(),
      tzOffset: String(p.tzOffset || p.timezoneOffset || '5.5').trim(),
      ayanamsha: String(p.ayanamsha || 'Lahiri').trim(),
      node: String(p.node || 'True Node').trim(),
      notes: String(p.notes || '').trim()
    };
  }

  function payload(extra) {
    return Object.assign({
      client: APP.config.name,
      version: APP.config.version,
      phase: APP.config.phase,
      generatedAt: new Date().toISOString(),
      profile: normalizeProfile(safeProfile())
    }, extra || {});
  }

  function call(key, body) {
    var ep = endpoints[key];
    if (!ep) return Promise.reject(new Error('Unknown API contract: ' + key));
    var task = ep.method === 'GET' ? APP.api.get(ep.path) : APP.api.post(ep.path, body || payload());
    return task.then(function (res) {
      var result = { contract: key, endpoint: ep.path, ok: !!(res && res.ok), response: res };
      APP.state.set('lastApiResult', result);
      APP.state.set('lastResult', result);
      if (APP.events && APP.events.addHistory) APP.events.addHistory('api_' + key, result);
      return result;
    }).catch(function (err) {
      APP.errors.capture(err, 'apiBridge.' + key);
      var result = { contract: key, endpoint: ep.path, ok: false, error: err.message || String(err), fallback: true };
      APP.state.set('lastApiResult', result);
      APP.state.set('lastResult', result);
      if (APP.events && APP.events.addHistory) APP.events.addHistory('api_' + key + '_fail', result);
      return result;
    });
  }

  function run(key) {
    APP.ui.loading(true, 'API: ' + (endpoints[key] ? endpoints[key].title : key));
    return call(key).then(function (result) {
      APP.ui.toast(result.ok ? 'API OK: ' + key : 'API fallback: ' + key, result.ok ? 'ok' : 'err');
      APP.router.go('api');
      return result;
    }).finally(function () { APP.ui.loading(false); });
  }

  function health() {
    var keys = Object.keys(endpoints);
    var summary = { ok: true, total: keys.length, contracts: [], phase: APP.config.phase };
    return call('contractHealth').then(function (server) {
      summary.server = server.response || server;
      keys.forEach(function (k) { summary.contracts.push({ id: k, path: endpoints[k].path, method: endpoints[k].method, title: endpoints[k].title }); });
      summary.ok = !!(server && server.ok);
      APP.state.set('lastResult', summary);
      return summary;
    });
  }

  function copyLast() {
    var result = APP.state.get('lastApiResult') || APP.state.get('lastResult') || { empty: true };
    return APP.utils.copyText(APP.utils.safeJSONStringify(result));
  }

  APP.apiBridge = {
    endpoints: endpoints,
    payload: payload,
    call: call,
    run: run,
    health: health,
    copyLast: copyLast,
    normalizeProfile: normalizeProfile
  };
})(window.APP);
