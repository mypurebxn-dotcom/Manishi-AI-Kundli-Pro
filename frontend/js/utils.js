(function (APP, window, document) {
  'use strict';
  function qs(selector, root){ try { return (root || document).querySelector(selector); } catch (e) { return null; } }
  function qsa(selector, root){ try { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); } catch (e) { return []; } }
  function on(el, event, handler, options) {
    if (!el || !event || typeof handler !== 'function') return function(){};
    el.addEventListener(event, handler, options || false);
    return function(){ el.removeEventListener(event, handler, options || false); };
  }
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function(ch){ return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[ch]; });
  }
  function debounce(fn, wait) {
    var t = 0;
    return function(){
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function(){ fn.apply(ctx, args); }, wait || 250);
    };
  }
  function safeJSONParse(text, fallback) { try { return JSON.parse(text); } catch (_) { return fallback; } }
  function safeJSONStringify(value, fallback) { try { return JSON.stringify(value, null, 2); } catch (_) { return fallback || '{}'; } }
  function uid(prefix){ return (prefix || 'id') + '_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now().toString(36); }
  function raf(fn){ window.requestAnimationFrame ? window.requestAnimationFrame(fn) : setTimeout(fn, 16); }
  function timeoutPromise(promise, ms, label) {
    var timer;
    var timeout = new Promise(function(_, reject){ timer = setTimeout(function(){ reject(new Error((label || 'Task') + ' timeout')); }, ms || 5000); });
    return Promise.race([promise, timeout]).finally(function(){ clearTimeout(timer); });
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(String(text || ''));
    var ta = document.createElement('textarea');
    ta.value = String(text || ''); document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    return Promise.resolve();
  }
  APP.utils = { qs: qs, qsa: qsa, on: on, escapeHTML: escapeHTML, debounce: debounce, safeJSONParse: safeJSONParse, safeJSONStringify: safeJSONStringify, uid: uid, raf: raf, timeoutPromise: timeoutPromise, copyText: copyText };
})(window.APP, window, document);
