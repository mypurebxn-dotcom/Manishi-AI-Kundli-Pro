(function (APP) {
  'use strict';

  var registry = {};

  function safeModule(mod){
    return Object.assign({
      id:'unknown', name:'Unknown', shortName:'Unknown', version:'1.0.0', enabled:true,
      icon:'◼', description:'', showInNav:true,
      init:function(){},
      render:function(){ return '<div class="empty">No content</div>'; },
      destroy:function(){},
      afterRender:function(){},
      healthCheck:function(){ return { ok:true }; },
      fallback:function(){ return '<div class="error-box">Module fallback mode.</div>'; }
    }, mod || {});
  }

  function register(mod){
    var m = safeModule(mod);
    if (!m.id) throw new Error('Module id required');
    registry[m.id] = m;
    return m;
  }

  function get(id){ return registry[id] || null; }

  function list(){ return Object.keys(registry).map(function(k){ return registry[k]; }); }

  function render(id){
    var mod = get(id);
    if (!mod) {
      APP.ui.renderScreen('Not found', 'Module missing', '<div class="empty">Module not found</div>');
      return;
    }
    try {
      APP.ui.loading(true, 'Opening ' + mod.name + '...');
      APP.utils.raf(function(){
        try {
          var html = mod.render(APP.state.get()) || '';
          APP.ui.renderScreen(mod.name, mod.description || '', html);
          if (typeof mod.afterRender === 'function') mod.afterRender();
          APP.ui.markActive(id);
        } catch (e) {
          APP.errors.capture(e, 'module.render.' + id);
          APP.ui.renderScreen(mod.name, 'Safe fallback loaded', mod.fallback());
        } finally {
          APP.ui.loading(false);
        }
      });
    } catch (e) {
      APP.errors.capture(e, 'module.render.start.' + id);
      APP.ui.loading(false);
    }
  }

  function coming(name){
    return '<div class="card"><p>This section is active. Advanced ' + APP.utils.escapeHTML(name) + ' tools will be added in next phases.</p><button class="btn" data-action="toast-coming">Show status</button></div>';
  }

  function moduleCard(m){
    return '<button class="card module-card" data-route="' + APP.utils.escapeHTML(m.id) + '"><span class="icon">' + APP.utils.escapeHTML(m.icon || '◼') + '</span><span><b>' + APP.utils.escapeHTML(m.name) + '</b><br><small class="card-muted">' + APP.utils.escapeHTML(m.description || '') + '</small></span><span class="badge">' + APP.utils.escapeHTML(m.version || '1.0') + '</span></button>';
  }

  function featureCard(f){
    var status = f.status || 'manifest';
    var badgeClass = status === 'ready' ? 'ok' : status === 'failed' ? 'err' : 'warn';
    return '<div class="card feature-card"><div class="feature-head"><span class="icon">' + APP.utils.escapeHTML(f.icon || '◇') + '</span><div><b>' + APP.utils.escapeHTML(f.name) + '</b><br><small class="card-muted">' + APP.utils.escapeHTML(f.description || '') + '</small></div></div><div class="status-row"><span class="badge ' + badgeClass + '">' + APP.utils.escapeHTML(status) + '</span><span class="badge">' + APP.utils.escapeHTML(f.category || 'general') + '</span></div><button class="btn gold" data-action="render-feature" data-feature="' + APP.utils.escapeHTML(f.id) + '">Open Plugin</button> <button class="btn" data-action="load-feature" data-feature="' + APP.utils.escapeHTML(f.id) + '">Preload</button></div>';
  }

  function pluginHubHtml(){
    var features = APP.features ? APP.features.list() : [];
    var cards = features.map(featureCard).join('') || '<div class="empty">No plugin manifest loaded</div>';
    var h = APP.features ? APP.features.health() : { total:0, ready:0, ok:false };
    return '<div class="panel-grid"><div class="card"><h3>Plugin Runtime</h3><p class="card-muted">Future 100+ features इसी registry से add होंगे। कोई heavy feature startup पर load नहीं होगा।</p><div class="status-row"><span class="badge ok">Registry: ON</span><span class="badge">Total: ' + h.total + '</span><span class="badge warn">Ready: ' + h.ready + '</span></div><p><button class="btn gold" data-action="run-plugin-health">Run Plugin Health</button> <button class="btn" data-action="copy-plugin-status">Copy Status</button></p></div><div class="card"><h3>Feature Host</h3><div id="featureHost" class="feature-host"><div class="empty">Plugin open करने के लिए नीचे Open Plugin दबाएँ।</div></div></div></div><h3 class="section-mini-title">Available Plugins</h3><div class="module-grid">' + cards + '</div>';
  }

  function profileRowsHtml(){
    var rows = APP.profileStore ? APP.profileStore.list() : [];
    if (!rows.length) return '<div class="empty">No saved profile yet.</div>';
    return rows.map(function(p){
      return '<div class="list-row"><div><b>' + APP.utils.escapeHTML(p.name || 'Unnamed') + '</b><br><small>' + APP.utils.escapeHTML([p.date, p.time, p.place].filter(Boolean).join(' • ')) + '</small></div><div class="row-actions"><button class="btn small" data-action="load-profile" data-id="' + APP.utils.escapeHTML(p.id) + '">Load</button><button class="btn small danger" data-action="delete-profile" data-id="' + APP.utils.escapeHTML(p.id) + '">Delete</button></div></div>';
    }).join('');
  }

  function profileHtml(){
    var p = APP.profileStore ? APP.profileStore.current() : APP.storage.get('profile', {});
    return '<div class="panel-grid"><div class="card"><h3>Current Profile</h3><div class="form-grid"><div class="field"><label>Name</label><input class="input" id="profileName" placeholder="Name" value="' + APP.utils.escapeHTML(p.name || '') + '" /></div><div class="field"><label>Date</label><input class="input" id="profileDate" type="date" value="' + APP.utils.escapeHTML(p.date || '') + '" /></div><div class="field"><label>Time</label><input class="input" id="profileTime" type="time" value="' + APP.utils.escapeHTML(p.time || '') + '" /></div><div class="field"><label>Place</label><input class="input" id="profilePlace" placeholder="Bayana, Rajasthan" value="' + APP.utils.escapeHTML(p.place || '') + '" /><div id="placeSuggestions" class="place-suggestions"></div></div><div class="field"><label>Latitude</label><input class="input" id="profileLat" inputmode="decimal" placeholder="26.9124" value="' + APP.utils.escapeHTML(p.lat || '') + '" /></div><div class="field"><label>Longitude</label><input class="input" id="profileLon" inputmode="decimal" placeholder="75.7873" value="' + APP.utils.escapeHTML(p.lon || '') + '" /></div><div class="field"><label>Timezone</label><input class="input" id="profileTzOffset" inputmode="decimal" placeholder="5.5" value="' + APP.utils.escapeHTML(p.tzOffset || '5.5') + '" /></div><div class="field"><label>Ayanamsha</label><select class="select" id="profileAyan"><option' + ((p.ayanamsha||'Lahiri')==='Lahiri'?' selected':'') + '>Lahiri</option><option' + ((p.ayanamsha||'')==='Raman'?' selected':'') + '>Raman</option><option' + ((p.ayanamsha||'')==='KP'?' selected':'') + '>KP</option></select></div><div class="field"><label>Rahu/Ketu</label><select class="select" id="profileNode"><option' + ((p.node||'')==='Mean Node'?' selected':'') + '>Mean Node</option><option' + ((p.node||'True Node')==='True Node'?' selected':'') + '>True Node</option></select></div><div class="field wide"><label>Notes</label><textarea class="textarea" id="profileNotes" placeholder="Optional notes">' + APP.utils.escapeHTML(p.notes || '') + '</textarea></div></div><p><button class="btn gold" data-action="save-profile">Save Profile</button> <button class="btn" data-action="validate-profile">Validate</button> <button class="btn" data-action="reset-profile-form">Reset Form</button> <button class="btn" data-action="copy-current-profile">Copy Current</button></p></div><div class="card"><h3>Saved Profiles</h3><input id="profileSearch" class="search-box" placeholder="Search profiles..." /><div id="profileList" class="profile-list" style="margin-top:12px">' + profileRowsHtml() + '</div><p><button class="btn" data-action="copy-profiles">Copy All Profiles</button></p></div></div>';
  }

  function historyRowsHtml(query){
    var rows = APP.historyStore ? APP.historyStore.search(query || '') : APP.storage.get('history', []);
    if (!Array.isArray(rows) || !rows.length) return '<div class="empty">No history yet.</div>';
    return rows.slice(0, 80).map(function(row){
      return '<details class="history-item"><summary><b>' + APP.utils.escapeHTML(row.type || 'event') + '</b><small>' + APP.utils.escapeHTML(row.time || '') + '</small></summary><pre>' + APP.utils.escapeHTML(APP.utils.safeJSONStringify(row.payload == null ? row : row.payload)) + '</pre></details>';
    }).join('');
  }

  function registerCore(){
    register({ id:'home', name:'Home Dashboard', shortName:'Home', icon:'🏠', description:'Premium overview and module grid.', version:'27.4', render:function(){
      var cards = APP.modules.list().filter(function(m){ return m.id !== 'home' && m.enabled !== false; }).map(moduleCard).join('');
      return '<div class="card hero-card"><h2>No-React Lite Pro Core</h2><p>Phase-27.4 API bridge ready. Freeze-safe shell + plugin loader + storage + backend API contracts.</p><div class="status-row"><span class="badge ok">No React</span><span class="badge ok">Vanilla JS</span><span class="badge ok">Profile Store</span><span class="badge warn">Final prediction locked</span></div></div><div class="module-grid">' + cards + '</div>';
    } });

    register({ id:'api', name:'Backend API Bridge', shortName:'API', icon:'🔌', description:'Safe backend contracts for future expert modules.', version:'27.4', render:function(){
      var last = APP.state.get('lastApiResult') || APP.state.get('lastResult');
      return '<div class="panel-grid"><div class="card"><h3>API Contracts</h3><p class="card-muted">Frontend हल्का रहेगा। Heavy astrology logic backend API contracts से bind होगा। Final prediction अभी locked है।</p><p><button class="btn gold" data-action="api-contract-health">Contract Health</button> <button class="btn" data-action="api-expert-calculate">Expert Calculate</button> <button class="btn" data-action="api-faladesh">Faladesh Draft</button> <button class="btn" data-action="api-report-json">Report JSON</button> <button class="btn" data-action="api-qa-audit">QA Audit</button> <button class="btn" data-action="copy-api-result">Copy API Result</button></p><div class="status-row"><span class="badge ok">No React</span><span class="badge ok">Backend Bridge</span><span class="badge warn">Final prediction locked</span></div></div><div class="card"><h3>Last API Result</h3><pre class="debug-log">' + APP.utils.escapeHTML(last ? APP.utils.safeJSONStringify(last) : 'No API result yet.') + '</pre></div></div>';
    }, healthCheck:function(){ return { ok: !!APP.apiBridge, bridge: !!APP.apiBridge, endpoints: APP.apiBridge ? Object.keys(APP.apiBridge.endpoints).length : 0 }; } });

    register({ id:'plugins', name:'Feature Plugins', shortName:'Plugins', icon:'🧩', description:'Lazy plugin registry for future 100+ features.', version:'27.1', render:pluginHubHtml });

    // ===== KUNDLI CORE MODULE =====
    register({ id:'kundli', name:'Kundli Core', shortName:'Kundli', icon:'☀', description:'Swiss Ephemeris exact calculation + Varga charts + Dasha timeline.', version:'27.10.1', render:function(){
      setTimeout(function(){
        if (APP.features && typeof APP.features.render === 'function') {
          APP.features.render('kundli', '#featureHost');
        }
      }, 0);
      return '<div id="featureHost"><div class="card"><p>Loading Kundli Core...</p></div></div>';
    }, afterRender:function(){
      if (APP.features && typeof APP.features.load === 'function') APP.features.load('kundli');
    } });

    register({ id:'profile', name:'Profile/Input Form', shortName:'Profile', icon:'👤', description:'Saved profiles with validation, copy, load and delete.', version:'27.3', render:profileHtml, afterRender:function(){
      var input = APP.utils.qs('#profileSearch');
      var listBox = APP.utils.qs('#profileList');

      if (APP.autocomplete && APP.autocomplete.bindPlaceAutocomplete) {
        APP.autocomplete.bindPlaceAutocomplete();
      }
      if (input && listBox) input.addEventListener('input', APP.utils.debounce(function(){
        var q = String(input.value || '').toLowerCase();
        var rows = APP.profileStore ? APP.profileStore.list().filter(function(p){ return APP.utils.safeJSONStringify(p).toLowerCase().indexOf(q) >= 0; }) : [];
        listBox.innerHTML = rows.length ? rows.map(function(p){ return '<div class="list-row"><div><b>' + APP.utils.escapeHTML(p.name || 'Unnamed') + '</b><br><small>' + APP.utils.escapeHTML([p.date, p.time, p.place].filter(Boolean).join(' • ')) + '</small></div><div class="row-actions"><button class="btn small" data-action="load-profile" data-id="' + APP.utils.escapeHTML(p.id) + '">Load</button><button class="btn small danger" data-action="delete-profile" data-id="' + APP.utils.escapeHTML(p.id) + '">Delete</button></div></div>'; }).join('') : '<div class="empty">No matching profile</div>';
      }, 180));
    } });

    register({ id:'charts', name:'चार्ट व्यूअर', shortName:'चार्ट', icon:'📊', description:'D1/D9/D10/D60 दृश्य कुण्डली चार्ट।', version:'28.3', render:function(){
      return APP.chartModule && APP.chartModule.render ? APP.chartModule.render() : '<div class="card">चार्ट module loading...</div>';
    } });

    register({ id:'results', name:'Result Viewer', shortName:'Result', icon:'📊', description:'Display calculation/report results safely.', render:function(){ var r=APP.state.get('lastResult'); return APP.resultViewer && APP.resultViewer.render ? APP.resultViewer.render(r) : '<div class="card"><pre>' + APP.utils.escapeHTML(r ? APP.utils.safeJSONStringify(r) : 'No result yet. Use Profile, Health or Plugin QA first.') + '</pre></div>'; } });

    register({ id:'report', name:'Premium Report', shortName:'Report', icon:'📜', description:'Premium report with evidence analysis.', version:'27.2.0', render:function(){
      return APP.features.report_pro.render();
    }, afterRender:function(){
      APP.features.load('report_pro');
    } });

    register({ id:'history', name:'History', icon:'🕘', description:'Saved actions, recent outputs and searchable audit trail.', version:'27.3', render:function(){ return '<div class="card"><h3>History Search</h3><input id="historySearch" class="search-box" placeholder="Search history..." /><p><button class="btn" data-action="copy-history">Copy History</button> <button class="btn danger" data-action="clear-history">Clear History</button></p><div id="historyList">' + historyRowsHtml('') + '</div></div>'; }, afterRender:function(){ var input=APP.utils.qs('#historySearch'); var out=APP.utils.qs('#historyList'); if(input&&out) input.addEventListener('input', APP.utils.debounce(function(){ out.innerHTML = historyRowsHtml(input.value); }, 180)); } });

    register({ id:'search', name:'Search', icon:'🔎', description:'Debounced local module and plugin search.', render:function(){ return '<div class="card"><input class="search-box" id="screenSearch" placeholder="Search modules/plugins..." /><div id="searchResults" class="module-grid" style="margin-top:12px"></div></div>'; }, afterRender:function(){ var input=APP.utils.qs('#screenSearch'); var out=APP.utils.qs('#searchResults'); if(!input||!out)return; var run=APP.utils.debounce(function(){ var q=input.value.toLowerCase(); var modRows=APP.modules.list().filter(function(m){return (m.name+' '+m.description).toLowerCase().indexOf(q)>=0;}).map(moduleCard).join(''); var featRows=(APP.features?APP.features.list():[]).filter(function(f){return (f.name+' '+f.description+' '+f.category).toLowerCase().indexOf(q)>=0;}).map(featureCard).join(''); out.innerHTML=modRows + featRows || '<div class="empty">No result</div>'; },200); input.addEventListener('input',run); run(); } });

    register({ id:'settings', name:'Settings', shortName:'Settings', icon:'⚙️', description:'Theme, language and safe mode settings.', render:function(){ return '<div class="panel-grid"><div class="card"><h3>Theme</h3><button class="btn" data-action="toggle-theme">Toggle Theme</button></div><div class="card"><h3>Language</h3><button class="btn" data-action="set-lang-hi">हिंदी</button> <button class="btn" data-action="set-lang-en">English</button></div><div class="card"><h3>Safe Mode</h3><button class="btn" data-action="enable-safe">Enable Safe Mode</button> <button class="btn" data-action="disable-safe">Disable</button></div></div>'; } });

    register({ id:'export', name:'Export Module', icon:'📤', description:'Backup and export data.', version:'27.3', render:function(){ return '<div class="card"><h3>Export Data</h3><button class="btn gold" data-action="export-backup">Copy Full Backup JSON</button> <button class="btn" data-action="download-backup">Download Backup JSON</button> <button class="btn" data-action="copy-profiles">Copy Profiles</button><p class="card-muted">Backup includes settings, history, current profile and saved profiles.</p></div>'; } });

    register({ id:'print', name:'Print Module', icon:'🖨️', description:'Print current screen.', render:function(){ return '<div class="card"><button class="btn gold" data-action="print-page">Print</button></div>'; } });

    register({ id:'offline', name:'Offline/PWA Module', icon:'📱', description:'PWA and offline readiness.', render:function(){ return '<div class="card"><p>Online: <b>' + (navigator.onLine ? 'YES' : 'NO') + '</b></p><button class="btn" data-action="register-sw">Register Service Worker</button></div>'; } });

    register({ id:'debug', name:'Debug Module', shortName:'Debug', icon:'🧪', description:'Boot logs and captured errors.', render:function(){ return '<div class="panel-grid"><div class="card"><h3>Debug Log</h3><pre id="debugLog" class="debug-log"></pre></div><div class="card"><h3>Errors</h3><div id="errorPanel"></div><button class="btn" data-action="clear-errors">Clear Visual Error</button></div></div>'; }, afterRender:function(){ APP.ui.addDebugLog('INFO','Debug panel opened'); } });

    register({ id:'health', name:'Health Check Module', shortName:'Health', icon:'💚', description:'Frontend/backend/module health.', render:function(){ return '<div class="card"><button class="btn gold" data-action="run-health">Run Health Check</button> <button class="btn" data-action="run-plugin-health">Plugin Health</button><pre id="healthOutput" class="debug-log" style="margin-top:12px"></pre></div>'; } });

    register({ id:'recovery', name:'Error Recovery Module', icon:'🛟', description:'Recover from bad local data.', render:function(){ return '<div class="card"><button class="btn" data-action="repair-storage">Repair Local Data</button> <button class="btn" data-action="panic-clear">Panic Clear Local Data</button> <button class="btn" data-action="enable-safe">Open Safe Mode</button></div>'; } });

    register({ id:'safe', name:'Safe Mode Module', icon:'🛡️', description:'Basic safe rendering mode.', render:function(){ return '<div class="card"><p>Safe mode keeps only core UI active.</p><button class="btn gold" data-action="enable-safe">Enable</button></div>'; } });

    register({ id:'backup', name:'Data Backup Module', icon:'💾', description:'Create backup JSON.', version:'27.3', render:function(){ return '<div class="card"><button class="btn gold" data-action="export-backup">Copy Backup JSON</button> <button class="btn" data-action="download-backup">Download JSON</button></div>'; } });

    register({ id:'restore', name:'Data Restore Module', icon:'📥', description:'Restore backup JSON.', version:'27.3', render:function(){ return '<div class="card"><textarea id="restoreText" class="textarea" placeholder="Paste backup JSON"></textarea><br><button class="btn gold" data-action="restore-backup">Restore Full Backup</button> <button class="btn" data-action="restore-profiles">Restore Profiles Only</button> <button class="btn" data-action="restore-history">Restore History Only</button></div>'; } });

    register({ id:'toast', name:'Notification/Toast Module', icon:'🔔', description:'Toast test and notifications.', render:function(){ return '<div class="card"><button class="btn gold" data-action="toast-test">Show Toast</button></div>'; } });

    register({ id:'about', name:'About App Module', icon:'ℹ️', description:'Version, build and architecture info.', render:function(){ return '<div class="card"><h3>' + APP.utils.escapeHTML(APP.config.name) + '</h3><p>Version: ' + APP.utils.escapeHTML(APP.config.version) + '</p><p>Build: ' + APP.utils.escapeHTML(APP.config.buildLabel) + '</p><p>Framework: No React / Vanilla JS</p><p>Storage: profile-store + history-store active</p><p>Plugin runtime: enabled</p></div>'; } });
  }

  APP.modules = { register: register, get: get, list: list, render: render, registerCore: registerCore };
})(window.APP);
