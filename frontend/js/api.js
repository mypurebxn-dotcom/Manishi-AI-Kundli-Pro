(function (APP) {
  'use strict';
  function request(path, options) {
    var url = APP.config.apiBase + path;
    var opts = options || {};
    opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    var task = fetch(url, opts).then(function(res){ return res.text().then(function(text){ var data = APP.utils.safeJSONParse(text, { raw: text }); if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status)); return data; }); });
    return APP.utils.timeoutPromise(task, APP.config.requestTimeoutMs, 'API ' + path);
  }
  function get(path){ return request(path, { method:'GET' }); }
  function post(path, payload){ return request(path, { method:'POST', body: JSON.stringify(payload || {}) }); }
  APP.api = { get: get, post: post };
})(window.APP);
