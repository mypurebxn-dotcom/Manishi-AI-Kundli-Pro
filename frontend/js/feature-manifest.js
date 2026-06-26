(function (APP) {
  'use strict';
  APP.features.installManifest([
    { id:'kundli', name:'Kundli Core', icon:'☀', category:'astrology', version:'27.1.0', description:'Future exact kundli form and calculation bridge.', source:'./js/features/kundli.feature.js?v=phase27-6-fix16' },
    { id:'panchang', name:'Panchang', icon:'📅', category:'astrology', version:'27.1.0', description:'Future tithi, nakshatra, yoga, karana module.', source:'./js/features/panchang.feature.js?v=phase27-6-fix16' },
    { id:'dasha', name:'Dasha Engine', icon:'⏳', category:'prediction', version:'27.1.0', description:'Future Vimshottari dasha and evidence-gated predictions.', source:'./js/features/dasha.feature.js?v=phase27-6-fix16' },
    { id:'dosha_remedy', name:'Dosha + Remedy', icon:'🛡️', category:'remedy', version:'27.1.0', description:'Future dosha analysis, remedy, ratna and anushthan controls.', source:'./js/features/dosha-remedy.feature.js?v=phase27-6-fix16' },
    { id:'report_pro', name:'Premium Report', icon:'📜', category:'report', version:'27.1.0', description:'Future premium HTML/print/PDF report renderer.', source:'./js/features/report.feature.js?v=phase27-6-fix16' },
    { id:'qa_console', name:'QA Console', icon:'🧪', category:'qa', version:'27.1.0', description:'Feature health, performance and safety audit dashboard.', source:'./js/features/qa-console.feature.js?v=phase27-6-fix16' }
  ]);
})(window.APP);
