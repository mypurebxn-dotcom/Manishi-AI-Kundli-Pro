(function (APP) {
  'use strict';
  var dict = {
    hi: { home:'होम', profile:'प्रोफाइल', results:'रिजल्ट', report:'रिपोर्ट', history:'हिस्ट्री', settings:'सेटिंग्स', debug:'डिबग', health:'हेल्थ', ready:'App ready', coming:'यह feature next phase में expand होगा।' },
    en: { home:'Home', profile:'Profile', results:'Results', report:'Report', history:'History', settings:'Settings', debug:'Debug', health:'Health', ready:'App ready', coming:'This feature will expand in the next phase.' }
  };
  function current(){ return APP.state ? APP.state.get('language') : APP.config.defaultLanguage; }
  function t(key){ var lang = current(); return (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || key; }
  function setLanguage(lang){ if (!dict[lang]) lang = 'hi'; APP.state.set('language', lang); APP.storage.set('language', lang); }
  APP.i18n = { t: t, setLanguage: setLanguage, languages: Object.keys(dict) };
})(window.APP);
