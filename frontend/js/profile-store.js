(function (APP) {
  'use strict';

  function now(){ return new Date().toISOString(); }
  function cleanText(value, max){
    value = String(value == null ? '' : value).trim();
    if (max && value.length > max) value = value.slice(0, max);
    return value;
  }
  function list(){
    var rows = APP.storage.get('profiles', []);
    if (!Array.isArray(rows)) rows = [];
    return rows.filter(function(p){ return p && p.id; }).slice(0, APP.config.maxProfiles || 50);
  }
  function saveList(rows){
    if (!Array.isArray(rows)) rows = [];
    rows = rows.filter(function(p){ return p && p.id; }).slice(0, APP.config.maxProfiles || 50);
    APP.storage.set('profiles', rows);
    return rows;
  }
  function normalize(input){
    input = input || {};
    var profile = {
      id: cleanText(input.id, 80) || APP.utils.uid('profile'),
      name: cleanText(input.name, 80),
      date: cleanText(input.date, 20),
      time: cleanText(input.time, 20),
      place: cleanText(input.place, 120),
      lat: cleanText(input.lat, 30),
      lon: cleanText(input.lon, 30),
      tzOffset: cleanText(input.tzOffset || input.timezoneOffset || '5.5', 20),
      ayanamsha: cleanText(input.ayanamsha || 'Lahiri', 40),
      node: cleanText(input.node || 'True Node', 40),
      notes: cleanText(input.notes, 500),
      createdAt: input.createdAt || now(),
      updatedAt: now()
    };
    return profile;
  }
  function validate(profile){
    profile = normalize(profile || {});
    var missing = [];
    if (!profile.name) missing.push('name');
    if (!profile.date) missing.push('date');
    if (!profile.time) missing.push('time');
    if (!profile.place) missing.push('place');
    var missingForExact = missing.slice();
    if (!profile.lat || !profile.lon) missingForExact.push('lat/lon');
    return { ok: missing.length === 0, missing: missing, missingForExact: missingForExact, calculationReady: missingForExact.length === 0, profile: profile };
  }
  function save(profile){
    var p = normalize(profile);
    var rows = list();
    var found = false;
    rows = rows.map(function(row){
      if (row.id === p.id) { found = true; return Object.assign({}, row, p, { updatedAt: now() }); }
      return row;
    });
    if (!found) rows.unshift(p);
    saveList(rows);
    APP.storage.set('profile', p);
    APP.storage.set('currentProfileId', p.id);
    APP.state.set('profile', p);
    return p;
  }
  function load(id){
    var p = list().filter(function(row){ return row.id === id; })[0] || null;
    if (p) {
      APP.storage.set('profile', p);
      APP.storage.set('currentProfileId', p.id);
      APP.state.set('profile', p);
    }
    return p;
  }
  function remove(id){
    var before = list();
    var rows = before.filter(function(row){ return row.id !== id; });
    saveList(rows);
    if (APP.storage.get('currentProfileId', '') === id) APP.storage.remove('currentProfileId');
    return rows.length !== before.length;
  }
  function current(){
    var currentId = APP.storage.get('currentProfileId', '');
    var loaded = currentId ? list().filter(function(row){ return row.id === currentId; })[0] : null;
    return loaded || APP.storage.get('profile', {});
  }
  function backup(){
    return { exportedAt: now(), profiles: list(), currentProfileId: APP.storage.get('currentProfileId', '') };
  }
  function restore(payload){
    payload = typeof payload === 'string' ? APP.utils.safeJSONParse(payload, null) : payload;
    if (!payload) return { ok:false, error:'invalid_json' };
    var rows = Array.isArray(payload.profiles) ? payload.profiles : (payload.data && Array.isArray(payload.data.profiles) ? payload.data.profiles : []);
    if (!rows.length) return { ok:false, error:'profiles_missing' };
    var fixed = rows.map(normalize).slice(0, APP.config.maxProfiles || 50);
    saveList(fixed);
    return { ok:true, restored: fixed.length };
  }
  function repair(){
    var rows = list().map(normalize);
    saveList(rows);
    return { ok:true, profiles: rows.length };
  }

  APP.profileStore = { list:list, save:save, load:load, remove:remove, current:current, validate:validate, backup:backup, restore:restore, repair:repair, normalize:normalize };
})(window.APP);
