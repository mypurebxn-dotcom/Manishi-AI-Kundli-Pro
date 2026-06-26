(function (window) {

  'use strict';

  var params = new URLSearchParams(window.location.search || '');

  window.APP = window.APP || {};

  window.APP.config = {

    name: 'Manishi AI Kundli Pro Lite',

    version: '27.6.0',  // Phase-21 patch version

    phase: params.get('v') || 'phase27-6-critical-foundation',  // stable version constant

    buildLabel: 'phase27-6-critical-foundation-patch',

    debug: params.get('debug') === '1' || params.get('debug') === 'true',

    safeMode: params.get('safe') === '1' || params.get('safe') === 'true',

    apiBase: 'http://127.0.0.1:8787/api',

    storagePrefix: 'mkp_lite_',

    defaultLanguage: 'hi',

    defaultTheme: 'dark',

    moduleTimeoutMs: 3000,

    requestTimeoutMs: 6000,

    maxHistory: 100,

    maxProfiles: 50

  };

})(window);
