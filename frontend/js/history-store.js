(function (APP) {
  'use strict';

  function now(){ return new Date().toISOString(); }
  function list(){
    var rows = APP.storage.get('history', []);
    return Array.isArray(rows) ? rows : [];
  }
  function saveList(rows){
    if (!Array.isArray(rows)) rows = [];
    rows = rows.slice(0, APP.config.maxHistory || 100);
    APP.storage.set('history', rows);
    return rows;
  }
  function add(type, payload){
    var rows = list();
    var item = {
      id: APP.utils.uid('history'),
      type: String(type || 'event'),
      time: now(),
      payload: payload == null ? null : payload
    };
    rows.unshift(item);
    saveList(rows);
    return item;
  }
  function search(query){
    query = String(query || '').toLowerCase().trim();
    var rows = list();
    if (!query) return rows;
    return rows.filter(function(row){
      return APP.utils.safeJSONStringify(row).toLowerCase().indexOf(query) >= 0;
    });
  }
  function clear(){ APP.storage.set('history', []); return true; }
  function backup(){ return { exportedAt: now(), history: list() }; }
  function restore(payload){
    payload = typeof payload === 'string' ? APP.utils.safeJSONParse(payload, null) : payload;
    var rows = payload && (payload.history || (payload.data && payload.data.history));
    if (!Array.isArray(rows)) return { ok:false, error:'history_missing' };
    saveList(rows);
    return { ok:true, restored: rows.length };
  }

  APP.historyStore = { list:list, saveList:saveList, add:add, search:search, clear:clear, backup:backup, restore:restore };
})(window.APP);
