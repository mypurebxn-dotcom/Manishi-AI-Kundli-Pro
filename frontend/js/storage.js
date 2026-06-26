(function (APP, window) {
  'use strict';
  var prefix = APP.config.storagePrefix || 'mkp_';
  function key(k){ return prefix + k; }
  function set(k, value) { try { localStorage.setItem(key(k), JSON.stringify(value)); return true; } catch (e) { APP.errors.capture(e, 'storage.set'); return false; } }
  function get(k, fallback) { try { var raw = localStorage.getItem(key(k)); return raw == null ? fallback : APP.utils.safeJSONParse(raw, fallback); } catch (e) { APP.errors.capture(e, 'storage.get'); return fallback; } }
  function remove(k) { try { localStorage.removeItem(key(k)); return true; } catch (e) { APP.errors.capture(e, 'storage.remove'); return false; } }
  function clear() { try { Object.keys(localStorage).forEach(function(k){ if (k.indexOf(prefix) === 0) localStorage.removeItem(k); }); return true; } catch (e) { APP.errors.capture(e, 'storage.clear'); return false; } }
  function backup() { var data = {}; try { Object.keys(localStorage).forEach(function(k){ if (k.indexOf(prefix) === 0) data[k.slice(prefix.length)] = APP.utils.safeJSONParse(localStorage.getItem(k), null); }); } catch (e) { APP.errors.capture(e, 'storage.backup'); } return { app: APP.config.name, version: APP.config.version, exportedAt: new Date().toISOString(), data: data }; }
  function restore(json) { var payload = typeof json === 'string' ? APP.utils.safeJSONParse(json, null) : json; if (!payload || !payload.data) return false; Object.keys(payload.data).forEach(function(k){ set(k, payload.data[k]); }); return true; }
  APP.storage = { set: set, get: get, remove: remove, clear: clear, backup: backup, restore: restore };
})(window.APP, window);
