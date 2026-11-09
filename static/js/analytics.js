/* Cookie consent + Yandex Metrika. Loaded only after explicit consent; no inline scripts (strict CSP).
   Active only when <body data-ym-id="..."> is set (YM_ID env on the server). Webvisor is disabled on purpose. */
(function () {
  'use strict';
  var KEY = 'remever_cookie_consent';
  var ymId = document.body.getAttribute('data-ym-id');
  if (!ymId) return;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ } }

  var banner = document.getElementById('cookie-banner');

  function loadMetrika() {
    if (window.ym) return;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(Number(ymId), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
  }

  function show() { if (banner) banner.hidden = false; }
  function hide() { if (banner) banner.hidden = true; }

  var state = read();
  if (state === 'accepted') loadMetrika();
  else if (state !== 'declined') show();

  var accept = document.getElementById('cookie-accept');
  var decline = document.getElementById('cookie-decline');
  var settings = document.getElementById('cookie-settings');
  if (accept) accept.addEventListener('click', function () { write('accepted'); hide(); loadMetrika(); });
  if (decline) decline.addEventListener('click', function () { write('declined'); hide(); });
  if (settings) settings.addEventListener('click', show);
})();
