(function (APP) {
  'use strict';
  APP.features.register({ id:'qa_console', name:'QA Console', icon:'🧪', version:'27.1.0', loaded:true,
    render:function(){ var h = APP.features.health(); return '<div class="card"><h3>Feature QA Console</h3><p class="card-muted">Registered features: ' + h.total + ', Ready now: ' + h.ready + '</p><pre class="debug-log">' + APP.utils.escapeHTML(APP.utils.safeJSONStringify(h)) + '</pre><button class="btn" data-action="run-plugin-health">Run Plugin Health</button></div>'; },
    healthCheck:function(){ return { ok:true, detail:'qa-console-ready' }; }
  });
})(window.APP);
