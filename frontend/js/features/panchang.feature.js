(function (APP) {
  'use strict';
  APP.features.register({ id:'panchang', name:'Panchang', icon:'📅', version:'27.1.0', loaded:true,
    render:function(){ return '<div class="card"><h3>Panchang Plugin</h3><p class="card-muted">Tithi, nakshatra, yoga, karana के लिए future API contract reserved है। अभी UI freeze-free skeleton mode में है।</p><ul class="clean-list"><li>Offline shell ready</li><li>Backend bridge pending</li><li>No heavy calculation on UI thread</li></ul></div>'; },
    healthCheck:function(){ return { ok:true, detail:'panchang-plugin-ready' }; }
  });
})(window.APP);
