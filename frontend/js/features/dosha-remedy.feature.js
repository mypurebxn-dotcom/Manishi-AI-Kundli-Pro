(function (APP) {
  'use strict';
  APP.features.register({ id:'dosha_remedy', name:'Dosha + Remedy', icon:'🛡️', version:'27.1.0', loaded:true,
    render:function(){ return '<div class="card"><h3>Dosha + Remedy Plugin</h3><p class="card-muted">Remedy recommendation future phase में evidence/safety gate के बाद खुलेगी। कोई expensive ritual force/guarantee claim नहीं होगा।</p><button class="btn" data-action="toast-coming">Show policy</button></div>'; },
    healthCheck:function(){ return { ok:true, detail:'remedy-safety-locked' }; }
  });
})(window.APP);
