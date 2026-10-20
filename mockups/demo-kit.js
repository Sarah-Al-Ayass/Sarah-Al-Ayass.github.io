/* Demo kit — shared helpers that turn the static project screens into
   interactive demos: a guided "Try it" card, toasts, modals and tooltips.
   All data shown in the demos is fictional. */
(function () {
  var params = new URLSearchParams(location.search);
  var LANG = params.get('lang') || ((navigator.language || 'en').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en');
  if (LANG !== 'fr') LANG = 'en';

  // Dashboards are designed for wide screens: on phones, render them zoomed-out
  // instead of squashed.
  if (window.innerWidth < 900) {
    var vp = document.querySelector('meta[name=viewport]');
    if (!vp) { vp = document.createElement('meta'); vp.name = 'viewport'; document.head.appendChild(vp); }
    vp.content = 'width=1360';
  }

  var css = '' +
    '.dk-guide{position:fixed;right:18px;bottom:18px;z-index:9000;width:300px;background:#11151c;color:#e9edf3;border:1px solid rgba(255,255,255,.08);border-radius:16px;box-shadow:0 24px 60px rgba(8,12,20,.38);font:13px/1.45 Inter,system-ui,sans-serif;overflow:hidden;transition:transform .25s,opacity .25s}' +
    '.dk-guide.min{width:auto}' +
    '.dk-guide.left{right:auto;left:12px;width:224px}' +
    '.dk-guide.min .dk-body{display:none}' +
    '.dk-head{display:flex;align-items:center;gap:9px;padding:12px 14px;cursor:pointer;user-select:none}' +
    '.dk-pulse{width:9px;height:9px;border-radius:50%;background:#3ee089;box-shadow:0 0 0 0 rgba(62,224,137,.6);animation:dkp 1.8s infinite;flex:none}' +
    '@keyframes dkp{0%{box-shadow:0 0 0 0 rgba(62,224,137,.55)}70%{box-shadow:0 0 0 9px rgba(62,224,137,0)}100%{box-shadow:0 0 0 0 rgba(62,224,137,0)}}' +
    '.dk-head b{font-size:13px;font-weight:650;letter-spacing:.01em}' +
    '.dk-head .dk-count{margin-left:auto;font-size:11.5px;color:#9aa6b8;font-variant-numeric:tabular-nums}' +
    '.dk-head .dk-x{font-size:16px;color:#9aa6b8;margin-left:6px;line-height:1}' +
    '.dk-body{padding:0 14px 14px}' +
    '.dk-body p{color:#aab4c4;font-size:12px;margin-bottom:10px}' +
    '.dk-steps{list-style:none;display:flex;flex-direction:column;gap:6px;margin:0;padding:0}' +
    '.dk-steps li{display:flex;gap:9px;align-items:flex-start;padding:7px 9px;border-radius:9px;background:rgba(255,255,255,.04);font-size:12.5px;color:#dfe5ee;transition:background .2s}' +
    '.dk-steps li i{flex:none;width:16px;height:16px;border-radius:50%;border:1.5px solid #5d6878;margin-top:1px;display:grid;place-items:center;font-style:normal;font-size:10px;color:transparent;transition:all .2s}' +
    '.dk-steps li.done{background:rgba(62,224,137,.09);color:#9fb0c3}' +
    '.dk-steps li.done span{text-decoration:line-through;text-decoration-color:rgba(159,176,195,.5)}' +
    '.dk-steps li.done i{background:#3ee089;border-color:#3ee089;color:#0b1a12}' +
    '.dk-foot{margin-top:10px;font-size:11px;color:#7d889a}' +
    '.dk-bar{height:3px;background:rgba(255,255,255,.08);border-radius:3px;margin-top:10px;overflow:hidden}' +
    '.dk-bar b{display:block;height:100%;width:0;background:#3ee089;transition:width .35s}' +
    '.dk-toast{position:fixed;left:50%;bottom:26px;transform:translate(-50%,20px);opacity:0;z-index:9500;background:#11151c;color:#fff;padding:11px 16px;border-radius:12px;font:500 13px Inter,system-ui,sans-serif;box-shadow:0 14px 40px rgba(8,12,20,.35);transition:all .25s;display:flex;gap:9px;align-items:center;max-width:92vw}' +
    '.dk-toast.on{opacity:1;transform:translate(-50%,0)}' +
    '.dk-toast i{width:18px;height:18px;border-radius:50%;background:#3ee089;color:#0b1a12;display:grid;place-items:center;font-style:normal;font-size:11px;font-weight:800;flex:none}' +
    '.dk-modal-bg{position:fixed;inset:0;background:rgba(10,14,22,.45);backdrop-filter:blur(3px);z-index:9400;display:grid;place-items:center;opacity:0;transition:opacity .2s}' +
    '.dk-modal-bg.on{opacity:1}' +
    '.dk-modal{background:#fff;color:#1c1f24;border-radius:18px;width:min(520px,92vw);max-height:86vh;overflow:auto;box-shadow:0 30px 80px rgba(8,12,20,.35);font:14px/1.5 Inter,system-ui,sans-serif;transform:translateY(10px);transition:transform .2s}' +
    '.dk-modal-bg.on .dk-modal{transform:none}' +
    '.dk-modal h3{font-size:17px;font-weight:700;letter-spacing:-.01em;padding:20px 22px 4px}' +
    '.dk-modal .dk-sub{font-size:12.5px;color:#7a8597;padding:0 22px 12px}' +
    '.dk-modal .dk-mb{padding:4px 22px 6px}' +
    '.dk-modal .dk-ma{display:flex;justify-content:flex-end;gap:8px;padding:14px 22px 20px}' +
    '.dk-btn{font:600 13px Inter,system-ui,sans-serif;border-radius:10px;padding:10px 16px;border:1px solid #dfe3ea;background:#fff;color:#1c1f24;cursor:pointer}' +
    '.dk-btn.pri{background:#1c1f24;color:#fff;border-color:#1c1f24}' +
    '.dk-btn:disabled{opacity:.45;cursor:default}' +
    '.dk-field{display:block;margin-bottom:12px}' +
    '.dk-field span{display:block;font-size:12px;font-weight:600;color:#4a5568;margin-bottom:5px}' +
    '.dk-field input,.dk-field textarea,.dk-field select{width:100%;font:14px Inter,system-ui,sans-serif;border:1px solid #dfe3ea;border-radius:10px;padding:10px 12px;color:#1c1f24;background:#fff;outline:none}' +
    '.dk-field input:focus,.dk-field textarea:focus,.dk-field select:focus{border-color:#1c1f24}' +
    '.dk-tip{position:fixed;z-index:9600;pointer-events:none;background:#11151c;color:#fff;font:500 12px/1.4 Inter,system-ui,sans-serif;padding:7px 10px;border-radius:8px;box-shadow:0 8px 24px rgba(8,12,20,.3);opacity:0;transition:opacity .12s;white-space:nowrap}' +
    '.dk-tip.on{opacity:1}' +
    '[data-dk-click]{cursor:pointer}' +
    '.dk-hl{animation:dkhl 1.4s ease}' +
    '@keyframes dkhl{0%{box-shadow:0 0 0 0 rgba(255,184,28,.0)}25%{box-shadow:0 0 0 4px rgba(255,184,28,.55)}100%{box-shadow:0 0 0 0 rgba(255,184,28,0)}}' +
    '@media (max-width:600px){.dk-guide{right:10px;left:10px;width:auto;bottom:10px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var Kit = { lang: LANG, t: function (en, fr) { return LANG === 'fr' ? fr : en; } };
  // On phones the dashboard is shown zoomed-out (viewport 1440px): scale the
  // demo's own overlays back up so they stay readable.
  var PHONE = (window.screen && screen.width < 900);
  var Z = PHONE ? Math.max(1, Math.min(2.5, window.innerWidth / screen.width * 0.7)) : 1;
  if (Z > 1) {
    var zs = document.createElement('style');
    zs.textContent = '.dk-guide,.dk-toast,.dk-modal,.dk-tip{zoom:' + Z.toFixed(2) + '}.dk-guide{left:auto!important;right:8px!important;bottom:8px!important;width:300px!important}.dk-guide.min{width:auto!important}';
    document.head.appendChild(zs);
  }

  /* ---------- Guided "Try it" card ---------- */
  var guideEl = null, steps = [], doneSet = {};
  Kit.guide = function (opts) {
    steps = opts.steps; doneSet = {};
    guideEl = document.createElement('div');
    guideEl.className = 'dk-guide' + (opts.pos !== 'right' && !PHONE ? ' left' : '');
    guideEl.innerHTML =
      '<div class="dk-head"><span class="dk-pulse"></span><b>' + Kit.t('Interactive demo', 'Démo interactive') + '</b>' +
      '<span class="dk-count"></span><span class="dk-x" title="">–</span></div>' +
      '<div class="dk-body"><p>' + opts.intro + '</p><ul class="dk-steps">' +
      steps.map(function (s) { return '<li data-step="' + s.id + '"><i>✓</i><span>' + s.text + '</span></li>'; }).join('') +
      '</ul><div class="dk-bar"><b></b></div><div class="dk-foot">' +
      Kit.t('Fictional demo data · built by Sarah Al Ayass', 'Données fictives de démonstration · réalisé par Sarah Al Ayass') + '</div></div>';
    document.body.appendChild(guideEl);
    guideEl.querySelector('.dk-head').onclick = function () {
      guideEl.classList.toggle('min');
      guideEl.querySelector('.dk-x').textContent = guideEl.classList.contains('min') ? '+' : '–';
    };
    if (PHONE) { guideEl.classList.add('min'); guideEl.querySelector('.dk-x').textContent = '+'; }
    refresh();
  };
  function refresh() {
    if (!guideEl) return;
    var n = Object.keys(doneSet).length;
    guideEl.querySelector('.dk-count').textContent = n + ' / ' + steps.length;
    guideEl.querySelector('.dk-bar b').style.width = (100 * n / steps.length) + '%';
  }
  Kit.done = function (id) {
    if (!guideEl || doneSet[id]) return;
    var li = guideEl.querySelector('[data-step="' + id + '"]');
    if (!li) return;
    doneSet[id] = 1; li.classList.add('done'); refresh();
    if (Object.keys(doneSet).length === steps.length) {
      setTimeout(function () { Kit.toast(Kit.t('You explored the whole demo, thanks!', 'Vous avez exploré toute la démo, merci !')); }, 500);
    }
  };

  /* ---------- Toast ---------- */
  var toastEl, toastTimer;
  Kit.toast = function (msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'dk-toast'; document.body.appendChild(toastEl); }
    toastEl.innerHTML = '<i>✓</i><span></span>';
    toastEl.querySelector('span').textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add('on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 2800);
  };

  /* ---------- Modal ---------- */
  Kit.modal = function (o) {
    var bg = document.createElement('div'); bg.className = 'dk-modal-bg';
    bg.innerHTML = '<div class="dk-modal" role="dialog" aria-modal="true"><h3></h3>' + (o.sub ? '<div class="dk-sub"></div>' : '') +
      '<div class="dk-mb"></div><div class="dk-ma"></div></div>';
    bg.querySelector('h3').textContent = o.title;
    if (o.sub) bg.querySelector('.dk-sub').textContent = o.sub;
    var body = bg.querySelector('.dk-mb'); body.innerHTML = o.html || '';
    var acts = bg.querySelector('.dk-ma');
    function close() { bg.classList.remove('on'); setTimeout(function () { bg.remove(); }, 200); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    (o.actions || [{ label: Kit.t('Close', 'Fermer') }]).forEach(function (a) {
      var b = document.createElement('button'); b.className = 'dk-btn' + (a.primary ? ' pri' : ''); b.textContent = a.label;
      b.onclick = function () { if (a.onClick && a.onClick(body) === false) return; close(); };
      acts.appendChild(b);
    });
    bg.addEventListener('click', function (e) { if (e.target === bg) close(); });
    document.addEventListener('keydown', esc);
    document.body.appendChild(bg);
    requestAnimationFrame(function () { bg.classList.add('on'); });
    var f = body.querySelector('input,textarea,select'); if (f) setTimeout(function () { f.focus(); }, 60);
    if (o.onOpen) o.onOpen(body);
    return { close: close, body: body };
  };

  /* ---------- Tooltip ---------- */
  var tipEl;
  Kit.tip = function (el, getHtml) {
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'dk-tip'; document.body.appendChild(tipEl); }
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter', function () { tipEl.innerHTML = typeof getHtml === 'function' ? getHtml() : getHtml; tipEl.classList.add('on'); });
    el.addEventListener('mousemove', function (e) {
      var x = e.clientX + 14, y = e.clientY - 12 - tipEl.offsetHeight;
      if (x + tipEl.offsetWidth > innerWidth - 8) x = e.clientX - tipEl.offsetWidth - 14;
      if (y < 8) y = e.clientY + 18;
      tipEl.style.left = x + 'px'; tipEl.style.top = y + 'px';
    });
    el.addEventListener('mouseleave', function () { tipEl.classList.remove('on'); });
  };

  Kit.flash = function (el) { if (!el) return; el.classList.remove('dk-hl'); void el.offsetWidth; el.classList.add('dk-hl'); };
  Kit.$ = function (s, r) { return (r || document).querySelector(s); };
  Kit.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  Kit.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  window.DemoKit = Kit;
})();
