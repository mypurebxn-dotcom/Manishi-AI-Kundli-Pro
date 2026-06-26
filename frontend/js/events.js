(function (APP, document, window) {
  'use strict';
  var bound = false;

  function action(name, target) {
    switch (name) {
      case 'toggle-theme': APP.theme.toggle(); break;
      case 'toggle-mobile-menu': APP.ui.toggleMobileMenu(); break;
      case 'close-mobile-menu': APP.ui.closeMobileMenu(); break;
      case 'toggle-debug': APP.router.go('debug'); break;
      case 'toast-coming': APP.ui.toast(APP.i18n.t('coming'), 'ok'); break;
      case 'toast-test': APP.ui.toast('Toast system OK', 'ok'); break;
      case 'set-lang-hi': APP.i18n.setLanguage('hi'); APP.ui.toast('भाषा हिंदी सेट हो गई', 'ok'); break;
      case 'set-lang-en': APP.i18n.setLanguage('en'); APP.ui.toast('Language set to English', 'ok'); break;
      case 'enable-safe': APP.state.set('safeMode', true); APP.storage.set('safeMode', true); APP.ui.setSafeMode(true); APP.ui.toast('Safe mode enabled', 'ok'); break;
      case 'disable-safe': APP.state.set('safeMode', false); APP.storage.set('safeMode', false); APP.ui.setSafeMode(false); APP.ui.toast('Safe mode disabled', 'ok'); break;
      case 'save-profile': saveProfile(); break;
      case 'validate-profile': validateProfile(); break;
      case 'api-contract-health': apiContractHealth(); break;
      case 'api-expert-calculate': apiRun('expertCalculate'); break;
      case 'api-faladesh': apiRun('faladesh'); break;
      case 'api-report-json': apiRun('reportJson'); break;
      case 'api-qa-audit': apiRun('qaAudit'); break;
      case 'copy-api-result': copyApiResult(); break;
      case 'reset-profile-form': resetProfileForm(); break;
      case 'load-profile': loadProfile(target); break;
      case 'delete-profile': deleteProfile(target); break;
      case 'copy-current-profile': copyCurrentProfile(); break;
      case 'copy-profiles': copyProfiles(); break;
      case 'export-backup': exportBackup(false); break;
      case 'download-backup': exportBackup(true); break;
      case 'restore-backup': restoreBackup('full'); break;
      case 'restore-profiles': restoreBackup('profiles'); break;
      case 'restore-history': restoreBackup('history'); break;
      case 'clear-history': clearHistory(); break;
      case 'copy-history': copyHistory(); break;
      case 'repair-storage': repairStorage(); break;
      case 'print-page': window.print(); break;
      case 'register-sw': APP.pwa.register(true); break;
      case 'run-health': APP.health.run(true); break;
      case 'run-plugin-health': runPluginHealth(); break;
      case 'copy-plugin-status': copyPluginStatus(); break;
      case 'load-feature': loadFeature(target); break;
      case 'render-feature': renderFeature(target); break;
      case 'route-profile': APP.router.go('profile'); break;
      case 'panic-clear': if (confirm('Clear app local data?')) { APP.storage.clear(); APP.ui.toast('Local data cleared', 'ok'); APP.router.go('home'); } break;
      case 'clear-errors': clearVisualErrors(); break;
      default: APP.ui.toast('Action ready: ' + name, 'ok');
    }
  }

  function readProfileForm(){
    return {
      id: APP.storage.get('currentProfileId', '') || '',
      name: value('#profileName'),
      date: value('#profileDate'),
      time: value('#profileTime'),
      place: value('#profilePlace'),
      lat: value('#profileLat'),
      lon: value('#profileLon'),
      tzOffset: value('#profileTzOffset') || '5.5',
      ayanamsha: value('#profileAyan') || 'Lahiri',
      node: value('#profileNode') || 'True Node',
      notes: value('#profileNotes')
    };
  }

  function saveProfile(){
    var raw = readProfileForm();

    var prev = APP.profileStore ? APP.profileStore.current() : APP.storage.get('profile', {});
    var oldPlace = String((prev && prev.place) || '').trim().toLowerCase();
    var newPlace = String(raw.place || '').trim().toLowerCase();
    var placeChanged = oldPlace && newPlace && oldPlace !== newPlace;

    if (APP.geocoder && APP.geocoder.resolve) {
      var g = APP.geocoder.resolve(raw.place);
      if (g) {
        raw.lat = g.lat;
        raw.lon = g.lon;
      } else if (placeChanged && prev && raw.lat === prev.lat && raw.lon === prev.lon) {
        raw.lat = '';
        raw.lon = '';
      }
    }



    var check = APP.profileStore ? APP.profileStore.validate(raw) : { ok:true, missing:[], profile: raw };
    var profile = APP.profileStore ? APP.profileStore.save(check.profile) : raw;
    APP.storage.set('profile', profile);
    APP.state.set('profile', profile);
    addHistory('profile_saved', profile);
    APP.ui.toast(check.ok ? 'Profile saved' : 'Profile saved with missing: ' + check.missing.join(', '), check.ok ? 'ok' : 'err');
    APP.router.go('profile');
  }


  function bindPlaceAutocomplete(){
    var input = APP.utils.qs("#profilePlace");
    var box = APP.utils.qs("#placeSuggestions");

    if(!input || !box || !APP.geocoder || !APP.geocoder.search) return;

    input.addEventListener("input", function(){

      var rows = APP.geocoder.search(input.value);

      box.innerHTML = "";

      rows.forEach(function(r){

        var d = document.createElement("div");
        d.className = "place-item";
        d.textContent = r.place;

        d.onclick = function(){

          input.value = r.place;

          var lat = APP.utils.qs("#profileLat");
          var lon = APP.utils.qs("#profileLon");
          var tz  = APP.utils.qs("#profileTzOffset");

          if(lat) lat.value = r.lat;
          if(lon) lon.value = r.lon;
          if(tz && !tz.value) tz.value = "5.5";

          box.innerHTML = "";

        };

        box.appendChild(d);

      });

    });

  }



  function validateProfile(){
    var p = APP.profileStore ? APP.profileStore.normalize(readProfileForm()) : APP.storage.get('profile', APP.state.get('profile') || {});
    var local = APP.profileStore ? APP.profileStore.validate(p) : { ok:true, missing:[] };
    APP.ui.loading(true, 'Validating profile...');
    APP.api.post('/profile/validate', p).then(function(res){
      var merged = { local: local, backend: res };
      APP.state.set('lastResult', merged);
      addHistory('profile_validate', merged);
      APP.ui.toast((local.ok && res && res.ok) ? 'Profile validation OK' : 'Profile needs correction', (local.ok && res && res.ok) ? 'ok' : 'err');
      APP.router.go('results');
    }).catch(function(e){
      APP.errors.capture(e, 'validateProfile');
      APP.state.set('lastResult', { local: local, backend: 'offline' });
      APP.ui.toast('Backend validation failed, local validation shown', 'err');
      APP.router.go('results');
    }).finally(function(){ APP.ui.loading(false); });
  }

  function resetProfileForm(){
    APP.storage.remove('profile');
    APP.storage.remove('currentProfileId');
    APP.state.set('profile', {});
    addHistory('profile_reset', {});
    APP.ui.toast('Profile form reset', 'ok');
    APP.router.go('profile');
  }

  function loadProfile(target){
    var id = data(target, 'id');
    var profile = APP.profileStore && id ? APP.profileStore.load(id) : null;
    if (!profile) return APP.ui.toast('Profile not found', 'err');
    addHistory('profile_loaded', profile);
    APP.ui.toast('Profile loaded', 'ok');
    APP.router.go('profile');
  }

  function deleteProfile(target){
    var id = data(target, 'id');
    if (!id) return APP.ui.toast('Profile id missing', 'err');
    if (!confirm('Delete this profile?')) return;
    var ok = APP.profileStore && APP.profileStore.remove(id);
    addHistory('profile_deleted', { id: id, ok: ok });
    APP.ui.toast(ok ? 'Profile deleted' : 'Delete failed', ok ? 'ok' : 'err');
    APP.router.go('profile');
  }

  function copyCurrentProfile(){
    var p = APP.profileStore ? APP.profileStore.current() : APP.storage.get('profile', {});
    APP.utils.copyText(APP.utils.safeJSONStringify(p)).then(function(){ APP.ui.toast('Current profile copied', 'ok'); }).catch(function(e){ APP.errors.capture(e, 'copyCurrentProfile'); });
  }

  function copyProfiles(){
    var rows = APP.profileStore ? APP.profileStore.backup() : { profiles: [] };
    APP.utils.copyText(APP.utils.safeJSONStringify(rows)).then(function(){ APP.ui.toast('Profiles copied', 'ok'); }).catch(function(e){ APP.errors.capture(e, 'copyProfiles'); });
  }


  function apiRun(key){
    if (!APP.apiBridge) return APP.ui.toast('API bridge missing', 'err');
    APP.apiBridge.run(key).catch(function(e){ APP.errors.capture(e, 'apiRun.' + key); APP.ui.toast('API bridge failed', 'err'); });
  }

  function apiContractHealth(){
    if (!APP.apiBridge) return APP.ui.toast('API bridge missing', 'err');
    APP.ui.loading(true, 'Checking API contracts...');
    APP.apiBridge.health().then(function(result){
      APP.state.set('lastResult', result);
      APP.ui.toast(result.ok ? 'API contracts OK' : 'API contracts warning', result.ok ? 'ok' : 'err');
      APP.router.go('api');
    }).catch(function(e){
      APP.errors.capture(e, 'apiContractHealth');
      APP.ui.toast('API contract health failed', 'err');
    }).finally(function(){ APP.ui.loading(false); });
  }

  function copyApiResult(){
    if (!APP.apiBridge) return APP.ui.toast('API bridge missing', 'err');
    APP.apiBridge.copyLast().then(function(){ APP.ui.toast('API result copied', 'ok'); }).catch(function(e){ APP.errors.capture(e, 'copyApiResult'); APP.ui.toast('Copy failed', 'err'); });
  }

  function value(sel){ var el = APP.utils.qs(sel); return el && typeof el.value === 'string' ? el.value.trim() : ''; }
  function data(target, name){ return target && target.getAttribute ? target.getAttribute('data-' + name) : ''; }

  function fullBackup(){
    return {
      app: APP.config.name,
      version: APP.config.version,
      phase: APP.config.phase,
      exportedAt: new Date().toISOString(),
      data: APP.storage.backup().data,
      profiles: APP.profileStore ? APP.profileStore.list() : [],
      history: APP.historyStore ? APP.historyStore.list() : APP.storage.get('history', [])
    };
  }

  function exportBackup(download){
    var backup = fullBackup();
    var text = APP.utils.safeJSONStringify(backup);
    if (download) {
      try {
        var blob = new Blob([text], { type:'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'manishi-lite-backup-' + Date.now() + '.json';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
        APP.ui.toast('Backup download started', 'ok');
      } catch (e) { APP.errors.capture(e, 'downloadBackup'); APP.ui.toast('Download failed', 'err'); }
      return;
    }
    APP.utils.copyText(text).then(function(){ APP.ui.toast('Backup copied', 'ok'); }).catch(function(e){ APP.errors.capture(e, 'exportBackup'); });
  }

  function restoreBackup(mode){
    var text = value('#restoreText');
    if (!text) return APP.ui.toast('Paste backup JSON first', 'err');
    var ok = false, result = null;
    try {
      if (mode === 'profiles') result = APP.profileStore && APP.profileStore.restore(text);
      else if (mode === 'history') result = APP.historyStore && APP.historyStore.restore(text);
      else { ok = APP.storage.restore(text); result = { ok: ok }; if (APP.profileStore) APP.profileStore.restore(text); if (APP.historyStore) APP.historyStore.restore(text); }
      ok = !!(result && result.ok);
    } catch (e) { APP.errors.capture(e, 'restoreBackup.' + mode); ok = false; }
    APP.ui.toast(ok ? 'Restore complete' : 'Invalid backup', ok ? 'ok' : 'err');
    if (ok) APP.router.go('home');
  }

  function addHistory(type, payload){
    if (APP.historyStore) return APP.historyStore.add(type, payload);
    var h = APP.storage.get('history', []);
    if (!Array.isArray(h)) h = [];
    h.unshift({ type:type, time:new Date().toISOString(), payload: payload });
    if (h.length > APP.config.maxHistory) h.length = APP.config.maxHistory;
    APP.storage.set('history', h);
  }

  function clearHistory(){
    if (!confirm('Clear history?')) return;
    if (APP.historyStore) APP.historyStore.clear(); else APP.storage.set('history', []);
    APP.ui.toast('History cleared', 'ok');
    APP.router.go('history');
  }

  function copyHistory(){
    var rows = APP.historyStore ? APP.historyStore.backup() : { history: APP.storage.get('history', []) };
    APP.utils.copyText(APP.utils.safeJSONStringify(rows)).then(function(){ APP.ui.toast('History copied', 'ok'); }).catch(function(e){ APP.errors.capture(e, 'copyHistory'); });
  }

  function repairStorage(){
    var out = { storage: 'ok' };
    if (APP.profileStore) out.profiles = APP.profileStore.repair();
    if (APP.historyStore) APP.historyStore.saveList(APP.historyStore.list());
    APP.state.set('lastResult', out);
    addHistory('storage_repair', out);
    APP.ui.toast('Local data repaired', 'ok');
    APP.router.go('results');
  }

  function clearVisualErrors(){
    var panel = APP.utils.qs('#errorPanel');
    if (panel) panel.innerHTML = '<div class="empty">No visual error</div>';
    APP.ui.toast('Visual error panel cleared', 'ok');
  }

  function featureId(target){ return target && target.getAttribute ? target.getAttribute('data-feature') : ''; }

  function loadFeature(target){
    var id = featureId(target);
    if (!id || !APP.features) return APP.ui.toast('Feature id missing', 'err');
    APP.ui.loading(true, 'Preloading ' + id + '...');
    APP.features.load(id).then(function(item){
      APP.ui.toast((item && item.status === 'failed') ? 'Feature fallback ready' : 'Feature preloaded', item && item.status === 'failed' ? 'err' : 'ok');
      APP.router.go('plugins');
    }).finally(function(){ APP.ui.loading(false); });
  }

  function renderFeature(target){
    var id = featureId(target);
    if (!id || !APP.features) return APP.ui.toast('Feature id missing', 'err');
    APP.features.render(id, '#featureHost');
  }

  function runPluginHealth(){
    var result = APP.features ? APP.features.health() : { ok:false, error:'Feature registry missing' };
    var out = APP.utils.qs('#healthOutput') || APP.utils.qs('#featureHost');
    if (out) out.innerHTML = '<pre class="debug-log">' + APP.utils.escapeHTML(APP.utils.safeJSONStringify(result)) + '</pre>';
    APP.state.set('lastResult', result);
    addHistory('plugin_health', result);
    APP.ui.toast(result.ok ? 'Plugin health OK' : 'Plugin health has warnings', result.ok ? 'ok' : 'err');
  }

  function copyPluginStatus(){
    var result = APP.features ? APP.features.health() : { ok:false, error:'Feature registry missing' };
    APP.utils.copyText(APP.utils.safeJSONStringify(result)).then(function(){ APP.ui.toast('Plugin status copied', 'ok'); }).catch(function(e){ APP.errors.capture(e, 'copyPluginStatus'); });
  }

  function bind() {
    if (bound) return; bound = true;
    document.addEventListener('input', function(ev){
      var input = ev.target && ev.target.id === 'profilePlace' ? ev.target : null;
      if (!input || !APP.geocoder || !APP.geocoder.search) return;

      var box = APP.utils.qs('#placeSuggestions');
      if (!box) return;

      var rows = APP.geocoder.search(input.value);
      box.innerHTML = '';

      rows.forEach(function(r){
        var d = document.createElement('div');
        d.className = 'place-item';
        d.textContent = r.place;
        d.setAttribute('data-place-autocomplete', '1');

        d.addEventListener('click', function(){
          input.value = r.place;

          var lat = APP.utils.qs('#profileLat');
          var lon = APP.utils.qs('#profileLon');
          var tz  = APP.utils.qs('#profileTzOffset');

          if (lat) lat.value = r.lat;
          if (lon) lon.value = r.lon;
          if (tz) tz.value = '5.5';

          box.innerHTML = '';
        });

        box.appendChild(d);
      });
    }, false); // profilePlaceGlobalAutocomplete

    document.addEventListener('click', function(ev){
      var actionBtn = ev.target.closest('[data-action]');
      if (actionBtn) {
        ev.preventDefault();
        try { action(actionBtn.getAttribute('data-action'), actionBtn); }
        catch (e) { APP.errors.capture(e, 'action.' + actionBtn.getAttribute('data-action')); }
        return;
      }
      var routeBtn = ev.target.closest('[data-route]');
      if (routeBtn) { ev.preventDefault(); APP.router.go(routeBtn.getAttribute('data-route')); if (APP.ui && APP.ui.closeMobileMenu) APP.ui.closeMobileMenu(); }
    }, false);
    window.addEventListener('online', function(){ APP.state.set('online', true); APP.ui.toast('Online', 'ok'); });
    window.addEventListener('offline', function(){ APP.state.set('online', false); APP.ui.toast('Offline mode', 'err'); });
    var search = APP.utils.qs('#moduleSearch');
    if (search) search.addEventListener('input', APP.utils.debounce(function(){ filterNav(search.value, '#sideNav .nav-item'); }, 180));
    var mobileSearch = APP.utils.qs('#mobileModuleSearch');
    if (mobileSearch) mobileSearch.addEventListener('input', APP.utils.debounce(function(){ filterNav(mobileSearch.value, '#mobileNav .nav-item'); }, 180));
  }

  function filterNav(q, selector){
    q = String(q || '').toLowerCase();
    APP.utils.qsa(selector || '#sideNav .nav-item').forEach(function(btn){ btn.classList.toggle('hidden', btn.textContent.toLowerCase().indexOf(q) < 0); });
  }

  APP.events = {
  bind: bind,
  addHistory: addHistory,
  bindPlaceAutocomplete: bindPlaceAutocomplete
};
})(window.APP, document, window);
