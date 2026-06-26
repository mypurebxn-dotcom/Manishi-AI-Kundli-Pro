(function (APP, document) {
  'use strict';
  function apply(theme) {
    theme = theme || APP.config.defaultTheme;
    document.body.classList.toggle('theme-light', theme === 'light');
    document.body.classList.toggle('safe-mode', !!APP.state.get('safeMode'));
    APP.state.set('theme', theme);
    APP.storage.set('theme', theme);
  }
  function toggle(){ apply(APP.state.get('theme') === 'light' ? 'dark' : 'light'); APP.ui.toast('Theme updated', 'ok'); }
  APP.theme = { apply: apply, toggle: toggle };
})(window.APP, document);
