(function (APP, document) {
  'use strict';
  var debugLines = [];
  function el(id){ return APP.utils.qs('#' + id); }
  function mountShell() {
    var root = el('app');
    if (!root) throw new Error('App root missing');
    root.innerHTML = [
      '<div class="app-shell">',
      '<header class="app-header">',
      '<div class="brand"><div class="brand-logo">☀</div><div class="brand-text"><div class="brand-title">Manishi AI Kundli Pro</div><div class="brand-subtitle">No-React Lite Pro Shell</div></div></div>',
      '<div class="header-actions"><span id="versionBadge" class="badge">v' + APP.utils.escapeHTML(APP.config.version) + '</span><span id="healthBadge" class="badge warn">Health: checking</span><button class="btn ghost hide-mobile" data-action="toggle-debug">Debug</button><button class="btn ghost hide-mobile" data-action="toggle-theme">Theme</button><button class="btn ghost mobile-menu-btn" data-action="toggle-mobile-menu" aria-label="All modules">☰</button></div>',
      '</header>',
      '<aside class="sidebar"><input id="moduleSearch" class="search-box" placeholder="Search modules..." autocomplete="off" /><div id="sideNav" class="nav-list" style="margin-top:12px"></div></aside>',
      '<main class="main"><section id="screen" class="screen"></section></main>',
      '<nav id="bottomNav" class="bottom-nav"></nav>',
      '<div id="mobileMenuBackdrop" class="mobile-drawer-backdrop" data-action="close-mobile-menu" aria-hidden="true"><aside id="mobileModuleDrawer" class="mobile-drawer" role="dialog" aria-label="All modules"><div class="drawer-head"><div><b>All Modules</b><br><small>Mobile navigation drawer</small></div><button class="btn ghost" data-action="close-mobile-menu">Close</button></div><input id="mobileModuleSearch" class="search-box" placeholder="Search modules..." autocomplete="off" /><div id="mobileNav" class="nav-list mobile-nav-list"></div></aside></div>',
      '</div>',
      '<div id="toastStack" class="toast-stack"></div>',
      '<div id="loadingOverlay" class="loading-overlay"><div class="boot-card"><div class="spinner" style="margin:0 auto 12px"></div><div id="loadingText">Loading...</div></div></div>',
      '<div id="safeRibbon" class="safe-ribbon hidden">SAFE MODE</div>'
    ].join('');
  }
  function hideBootFallback(){ var b = el('bootFallback'); if (b) b.classList.add('hidden'); }
  function navItems(){ return APP.modules.list().filter(function(m){ return m.showInNav !== false; }); }
  function renderNav(){
    var side = el('sideNav'), bottom = el('bottomNav'), mobile = el('mobileNav');
    var items = navItems();
    var html = items.map(function(m){ return '<button class="nav-item" data-route="' + APP.utils.escapeHTML(m.id) + '"><span class="nav-icon">' + APP.utils.escapeHTML(m.icon || '◼') + '</span><span>' + APP.utils.escapeHTML(m.name) + '</span></button>'; }).join('');
    if (side) side.innerHTML = html;
    if (mobile) mobile.innerHTML = html;
    if (bottom) {
      var preferred = ['home','plugins','profile','results'];
      var bottomItems = preferred.map(function(id){ return items.filter(function(m){ return m.id === id; })[0]; }).filter(Boolean);
      bottom.innerHTML = bottomItems.map(function(m){ return '<button class="nav-item" data-route="' + APP.utils.escapeHTML(m.id) + '"><span class="nav-icon">' + APP.utils.escapeHTML(m.icon || '◼') + '</span><span>' + APP.utils.escapeHTML(m.shortName || m.name) + '</span></button>'; }).join('') + '<button class="nav-item more-nav" data-action="toggle-mobile-menu"><span class="nav-icon">☰</span><span>More</span></button>';
    }
    markActive(APP.state.get('route'));
  }
  function markActive(route){ APP.utils.qsa('[data-route]').forEach(function(btn){ btn.classList.toggle('active', btn.getAttribute('data-route') === route); }); }
  function renderScreen(title, desc, body){
    var screen = el('screen');
    if (!screen) return;
    screen.innerHTML = '<div class="screen-head"><div><h1 class="screen-title">' + APP.utils.escapeHTML(title) + '</h1><p class="screen-desc">' + APP.utils.escapeHTML(desc || '') + '</p></div></div>' + (body || '');
  }
  function renderDashboard(){
    var modules = APP.modules.list().filter(function(m){ return m.enabled !== false; });
    var cards = modules.map(function(m){
      return '<button class="card module-card" data-route="' + APP.utils.escapeHTML(m.id) + '"><span class="icon">' + APP.utils.escapeHTML(m.icon || '◼') + '</span><span><b>' + APP.utils.escapeHTML(m.name) + '</b><br><small class="card-muted">' + APP.utils.escapeHTML(m.description || '') + '</small></span><span class="badge">' + APP.utils.escapeHTML(m.version || '1.0') + '</span></button>';
    }).join('');
    renderScreen('Premium Dashboard', 'Stable No-React shell ready for 100+ future modules.', '<div class="module-grid">' + cards + '</div>');
  }
  function toast(message, type){
    var stack = el('toastStack'); if (!stack) return;
    var item = document.createElement('div'); item.className = 'toast ' + (type || ''); item.textContent = message;
    stack.appendChild(item); setTimeout(function(){ item.remove(); }, 3200);
  }
  function loading(show, text){ var overlay = el('loadingOverlay'); var t = el('loadingText'); if (t) t.textContent = text || 'Loading...'; if (overlay) overlay.classList.toggle('show', !!show); }
  function addDebugLog(level, message){
    var line = new Date().toLocaleTimeString() + ' [' + level + '] ' + message;
    debugLines.push(line); if (debugLines.length > 120) debugLines.shift();
    var box = el('debugLog'); if (box) box.textContent = debugLines.join('\n');
  }
  function setError(item){ var box = el('errorPanel'); if (box && item) box.innerHTML = '<div class="error-box"><b>' + APP.utils.escapeHTML(item.source) + '</b><br>' + APP.utils.escapeHTML(item.message) + '</div>'; }
  function setHealth(status){ var badge = el('healthBadge'); if (!badge) return; badge.textContent = 'Health: ' + status; badge.className = 'badge ' + (status === 'ok' ? 'ok' : status === 'fail' ? 'err' : 'warn'); }
  function setSafeMode(on){ var r=el('safeRibbon'); if(r) r.classList.toggle('hidden', !on); document.body.classList.toggle('safe-mode', !!on); }
  function openMobileMenu(){ var b=el('mobileMenuBackdrop'); if(b){ b.classList.add('show'); b.setAttribute('aria-hidden','false'); } document.body.classList.add('drawer-open'); }
  function closeMobileMenu(){ var b=el('mobileMenuBackdrop'); if(b){ b.classList.remove('show'); b.setAttribute('aria-hidden','true'); } document.body.classList.remove('drawer-open'); }
  function toggleMobileMenu(){ var b=el('mobileMenuBackdrop'); if(b && b.classList.contains('show')) closeMobileMenu(); else openMobileMenu(); }
  APP.ui = { mountShell: mountShell, hideBootFallback: hideBootFallback, renderNav: renderNav, markActive: markActive, renderScreen: renderScreen, renderDashboard: renderDashboard, toast: toast, loading: loading, addDebugLog: addDebugLog, setError: setError, setHealth: setHealth, setSafeMode: setSafeMode, openMobileMenu: openMobileMenu, closeMobileMenu: closeMobileMenu, toggleMobileMenu: toggleMobileMenu };
})(window.APP, document);
