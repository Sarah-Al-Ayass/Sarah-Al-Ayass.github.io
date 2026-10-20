/* Égérine — interactive layer: working slicers, cross-filtering, tooltips and a
   live budget optimiser (diminishing-returns model). Illustrative data. */
(function () {
  var DK = window.DemoKit, $ = DK.$, $$ = DK.$$, t = DK.t, esc = DK.esc;
  /* page globals from the report script: CH, C, WS, WR, weeks, fmt, spark */
  var NAMES = { search: 'Google Search', meta: 'Meta Ads', email: 'E-mail / CRM', tiktok: 'TikTok Ads', display: 'Google Display' };
  var CAMPS = [
    ['Soldes d’hiver — Search', 'search', 21400, 109100, [0, 1, 2, 3]],
    ['Saint-Valentin — Reels', 'meta', 18900, 79400, [4, 5, 6]],
    ['Soldes d’hiver — Carrousel', 'meta', 16300, 52200, [0, 1, 2, 3]],
    ['Printemps — UGC créateurs', 'tiktok', 14800, 50300, [8, 9, 10, 11, 12]],
    ['Newsletter Saint-Valentin', 'email', 6200, 39700, [5, 6]],
    ['Retargeting — Bannières', 'display', 11700, 18700, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]
  ];
  var PERIODS = [['01/01 – 31/03/2025', 'T1 2025', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]], ['01/01 – 31/01/2025', 'Janvier', [0, 1, 2, 3]], ['01/02 – 28/02/2025', 'Février', [4, 5, 6, 7]], ['01/03 – 31/03/2025', 'Mars', [8, 9, 10, 11, 12]]];
  var state = { period: 0, ch: null, camp: null };

  var style = document.createElement('style');
  style.textContent = '' +
    '.sl{cursor:pointer;position:relative;transition:border-color .15s}.sl:hover{border-color:#8A8886}' +
    '.dd{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid #E1DFDD;border-radius:6px;box-shadow:0 10px 30px rgba(0,0,0,.14);z-index:60;padding:4px;display:none;min-width:190px}.dd.on{display:block}' +
    '.dd div{font-size:12.5px;padding:7px 9px;border-radius:4px;display:flex;gap:8px;align-items:center}.dd div:hover{background:#F3F2F1}.dd div.cur{font-weight:600;color:#1F6F5C}.dd i{width:9px;height:9px;border-radius:2px;display:inline-block}' +
    '.sl.act{border-color:#1F6F5C;box-shadow:0 0 0 1px #1F6F5C}' +
    '.tool span,.pages span,.filters,.ic{cursor:pointer}.tool span:hover{color:#252423}' +
    '#camp tbody tr{cursor:pointer;transition:opacity .2s, background .15s}#camp tbody tr:not(.tot):hover{background:#FAF9F8}#camp tr.dim{opacity:.32}#camp tr.pick td{background:#E3F3EE}' +
    '#roasbar g.rb,#donut path,#combo rect.wb,#combo circle{cursor:pointer;transition:opacity .2s}.dimmed{opacity:.25}' +
    '.optim{margin:8px 0 6px}.optim .row{display:flex;gap:8px;align-items:center;font-size:11.5px;color:#605E5C;margin-bottom:6px}.optim select{font:600 12px Inter,system-ui;border:1px solid #E1DFDD;border-radius:5px;padding:4px 6px;background:#fff;color:#252423}' +
    '.optim input[type=range]{width:100%;accent-color:#1F6F5C}.optim .amt{font:700 13px Inter;color:#1F6F5C;margin-left:auto}' +
    '.ai .apply{font:600 12px Inter,system-ui;border:0;background:#1F6F5C;color:#fff;border-radius:6px;padding:7px 11px;cursor:pointer;margin-top:8px}' +
    '.app{height:auto!important;min-height:1000px}.r3{flex:none!important;min-height:330px}.ai .note{display:none}' +
    '.filterchip{display:inline-flex;gap:6px;align-items:center;font-size:11.5px;background:#E3F3EE;color:#1F6F5C;border-radius:20px;padding:3px 9px;margin-left:8px;font-weight:600;cursor:pointer}' +
    '.fc-tbl div{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F3F2F1;font-size:13px}.fc-tbl b{font-weight:700}';
  document.head.appendChild(style);

  /* ---------- data helpers ---------- */
  function idx() { return PERIODS[state.period][2]; }
  function chans() { return state.ch ? CH.filter(function (c) { return c.k === state.ch; }) : CH; }
  function totals(list) {
    var S0 = CH.reduce(function (a, c) { return a + c.s; }, 0), R0 = CH.reduce(function (a, c) { return a + c.r; }, 0);
    var ws = idx().reduce(function (a, i) { return a + WS[i]; }, 0) / WS.reduce(function (a, b) { return a + b; }, 0);
    var wr = idx().reduce(function (a, i) { return a + WR[i]; }, 0) / WR.reduce(function (a, b) { return a + b; }, 0);
    var s = list.reduce(function (a, c) { return a + c.s; }, 0) * ws, r = list.reduce(function (a, c) { return a + c.r; }, 0) * wr, cv = list.reduce(function (a, c) { return a + c.c; }, 0) * wr;
    return { s: s, r: r, cv: cv, shareS: list.reduce(function (a, c) { return a + c.s; }, 0) / S0, shareR: list.reduce(function (a, c) { return a + c.r; }, 0) / R0 };
  }

  /* ---------- renderers ---------- */
  function renderKpis() {
    var tt = totals(chans()), full = state.period === 0 && !state.ch;
    var ii = idx(), shS = tt.shareS, shR = tt.shareR;
    var ws = ii.map(function (i) { return WS[i] * shS; }), wr = ii.map(function (i) { return WR[i] * shR; });
    var scope = (state.ch ? NAMES[state.ch] : 'tous canaux') + ' · ' + PERIODS[state.period][1];
    var KP = [
      { l: 'Dépenses publicitaires', v: fmt(tt.s / 1000, 1) + ' k€', d: full ? '<b style="color:var(--ink2)">+6,2 %</b> vs T4' : scope, sp: ws, c: '#7FB8A8' },
      { l: 'Chiffre d’affaires attribué', v: fmt(tt.r / 1000, 1) + ' k€', d: full ? '<b>▲ +11,4 %</b> vs T4' : scope, sp: wr, c: '#9EF0A0', hero: 1 },
      { l: 'ROAS', v: fmt(tt.r / tt.s, 2) + '×', d: full ? '<b style="color:var(--pos)">▲ +0,18</b> vs T4 (3,62×)' : (tt.r / tt.s >= 3 ? '<b style="color:var(--pos)">au-dessus</b> de l’objectif 3,0×' : '<b style="color:var(--neg)">sous</b> l’objectif 3,0×'), sp: wr.map(function (r, k) { return r / ws[k]; }), c: '#1F6F5C' },
      { l: 'Conversions', v: fmt(Math.round(tt.cv)), d: full ? '<b style="color:var(--pos)">▲ +9,1 %</b> vs T4' : scope, sp: wr, c: '#1F6F5C' },
      { l: 'Coût par acquisition', v: fmt(tt.s / tt.cv, 2) + ' €', d: full ? '<b style="color:var(--pos)">▼ −2,7 %</b> vs T4 (19,23 €)' : scope, sp: ws.map(function (s, k) { return s / wr[k]; }), c: '#1F6F5C' }
    ];
    $('#kpis').innerHTML = KP.map(function (k) { return '<div class="card kpi' + (k.hero ? ' hero' : '') + '"><div class="l">' + k.l + '</div><div class="v">' + k.v + '</div><div class="d">' + k.d + '</div>' + (k.sp.length > 1 ? spark(k.sp, k.c) : '') + '</div>'; }).join('');
  }
  function renderCombo() {
    var tt = totals(chans()), shS = tt.shareS, shR = tt.shareR;
    var W = 780, H = 310, L = 50, Rr = 40, T = 30, B = 26, pw = W - L - Rr, ph = H - T - B, n = 13, bw = pw / n;
    var ymax = state.ch ? Math.max.apply(null, WR.map(function (v) { return v * shR; })) * 1.25 : 100000;
    var s = '';
    for (var i = 0; i <= 4; i++) { var y = T + ph - ph * i / 4; s += '<line x1="' + L + '" x2="' + (W - Rr) + '" y1="' + y + '" y2="' + y + '" stroke="#F0EEEC"/><text x="' + (L - 8) + '" y="' + (y + 4) + '" font-size="10.5" fill="#8A8886" text-anchor="end">' + fmt(ymax * i / 4 / 1000, 0) + ' k€</text>'; }
    for (i = 0; i <= 3; i++) { var y2 = T + ph - ph * i / 3; s += '<text x="' + (W - Rr + 8) + '" y="' + (y2 + 4) + '" font-size="10.5" fill="#C9603F">' + (2 + i) + '×</text>'; }
    var inP = idx();
    WS.forEach(function (v, k) { var h = v * shS / ymax * ph; s += '<rect class="wb" data-w="' + k + '" x="' + (L + k * bw + bw * .2) + '" y="' + (T + ph - h) + '" width="' + (bw * .6) + '" height="' + h + '" fill="#A9D5C8" rx="2"' + (inP.indexOf(k) < 0 ? ' opacity=".25"' : '') + '/>'; });
    var pr = WR.map(function (v, k) { return [L + k * bw + bw / 2, T + ph - v * shR / ymax * ph]; });
    s += '<path d="M' + pr.map(function (p) { return p.join(','); }).join(' L') + ' L' + pr[12][0] + ',' + (T + ph) + ' L' + pr[0][0] + ',' + (T + ph) + 'Z" fill="#1F6F5C" opacity=".07"/>';
    s += '<polyline points="' + pr.map(function (p) { return p.join(','); }).join(' ') + '" fill="none" stroke="#1F6F5C" stroke-width="2.6" stroke-linejoin="round"/>';
    pr.forEach(function (p, k) { s += '<circle data-w="' + k + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (inP.indexOf(k) < 0 ? 2.5 : 4) + '" fill="#fff" stroke="#1F6F5C" stroke-width="2"' + (inP.indexOf(k) < 0 ? ' opacity=".35"' : '') + '/>'; });
    var ro = WR.map(function (v, k) { var r = (v * shR) / (WS[k] * shS); return [L + k * bw + bw / 2, T + ph - Math.max(0, Math.min(3, r - 2)) / 3 * ph]; });
    s += '<polyline points="' + ro.map(function (p) { return p.join(','); }).join(' ') + '" fill="none" stroke="#E07A5F" stroke-width="2" stroke-dasharray="5 3"/>';
    weeks.forEach(function (w, k) { s += '<text x="' + (L + k * bw + bw / 2) + '" y="' + (H - 8) + '" font-size="10.5" fill="' + (inP.indexOf(k) < 0 ? '#C8C6C4' : '#605E5C') + '" text-anchor="middle">' + w + '</text>'; });
    if (!state.ch) [[2, 'Soldes d’hiver', 92], [5, 'Saint-Valentin', 88]].forEach(function (a) { var p = pr[a[0]]; s += '<g pointer-events="none"><line x1="' + p[0] + '" x2="' + p[0] + '" y1="' + (p[1] - 6) + '" y2="' + (p[1] - 22) + '" stroke="#605E5C"/><rect x="' + (p[0] - a[2] / 2) + '" y="' + (p[1] - 40) + '" width="' + a[2] + '" height="18" rx="3" fill="#252423"/><text x="' + p[0] + '" y="' + (p[1] - 27) + '" font-size="10.5" fill="#fff" text-anchor="middle">' + a[1] + '</text></g>'; });
    $('#combo').innerHTML = s;
    $$('#combo [data-w]').forEach(function (el) {
      var k = +el.dataset.w;
      DK.tip(el, function () { var sp = WS[k] * shS, rv = WR[k] * shR; return '<b>Semaine du ' + weeks[k] + '</b><br>Dépenses ' + fmt(sp / 1000, 1) + ' k€ · CA ' + fmt(rv / 1000, 1) + ' k€<br>ROAS ' + fmt(rv / sp, 2) + '×'; });
      el.addEventListener('mouseenter', function () { DK.done('hover'); });
    });
  }
  function renderRoas() {
    var W = 480, L = 118, Rr = 58, T = 14, rowH = 54, max = 6, s = '';
    var rows = CH.slice().sort(function (a, b) { return b.r / b.s - a.r / a.s; });
    var x = function (v) { return L + (W - L - Rr) * v / max; };
    rows.forEach(function (c, i) {
      var y = T + i * rowH, v = c.r / c.s, dim = state.ch && state.ch !== c.k;
      s += '<g class="rb' + (dim ? ' dimmed' : '') + '" data-k="' + c.k + '"><rect x="0" y="' + y + '" width="' + W + '" height="' + (rowH - 4) + '" fill="transparent"/>' +
        '<text x="' + (L - 10) + '" y="' + (y + 16) + '" font-size="12" fill="#252423" text-anchor="end">' + c.n + '</text><text x="' + (L - 10) + '" y="' + (y + 30) + '" font-size="10.5" fill="#8A8886" text-anchor="end">' + fmt(c.s / 1000, 1) + ' k€ dépensés</text>' +
        '<rect x="' + L + '" y="' + (y + 5) + '" width="' + (x(v) - L) + '" height="24" rx="3" fill="' + C[c.k] + '"/><text x="' + (x(v) + 7) + '" y="' + (y + 22) + '" font-size="12.5" font-weight="700" fill="' + (v < 3 ? '#C50F1F' : '#252423') + '">' + fmt(v, 2) + '×</text></g>';
    });
    var tx = x(3); s += '<line x1="' + tx + '" x2="' + tx + '" y1="2" y2="' + (T + rows.length * rowH) + '" stroke="#252423" stroke-dasharray="4 3"/><text x="' + (tx + 4) + '" y="' + (T + rows.length * rowH + 12) + '" font-size="10.5" fill="#605E5C">objectif 3,0×</text>';
    $('#roasbar').innerHTML = s;
    $$('#roasbar g.rb').forEach(function (g) {
      var c = CH.filter(function (x2) { return x2.k === g.dataset.k; })[0];
      DK.tip(g, '<b>' + c.n + '</b> · ROAS ' + fmt(c.r / c.s, 2) + '×<br>CA ' + fmt(c.r / 1000, 1) + ' k€ · cliquez pour filtrer');
      g.onclick = function () { setChannel(state.ch === c.k ? null : c.k); };
    });
  }
  function renderCamps() {
    var mx = Math.max.apply(null, CAMPS.map(function (r) { return r[3]; }));
    var rc = function (v) { return v >= 4.5 ? 'background:#DFF6DD;color:#107C10' : v >= 3 ? 'background:#F3F2F1;color:#252423' : 'background:#FDE7E9;color:#C50F1F'; };
    var inP = idx();
    var vis = CAMPS.filter(function (r) { return (!state.ch || r[1] === state.ch) && r[4].some(function (w) { return inP.indexOf(w) >= 0; }); });
    var h = '<thead><tr><th>Campagne</th><th>Canal</th><th class="n">Dépenses</th><th class="n" style="width:150px">Chiffre d’affaires</th><th class="n">ROAS</th></tr></thead><tbody>';
    CAMPS.forEach(function (r, i) {
      var v = r[3] / r[2], on = vis.indexOf(r) >= 0;
      h += '<tr data-i="' + i + '" class="' + (on ? '' : 'dim') + (state.camp === i ? ' pick' : '') + '"><td>' + r[0] + '</td><td><span class="ch"><i style="background:' + C[r[1]] + '"></i>' + NAMES[r[1]] + '</span></td><td class="n">' + fmt(r[2]) + ' €</td><td class="n db"><span style="width:' + (r[3] / mx * 100) + '%"></span><em>' + fmt(r[3]) + ' €</em></td><td class="n"><span class="roas" style="' + rc(v) + '">' + fmt(v, 2) + '×</span></td></tr>';
    });
    var ts = vis.reduce(function (a, r) { return a + r[2]; }, 0), tr = vis.reduce(function (a, r) { return a + r[3]; }, 0);
    h += '<tr class="tot"><td>Total (' + vis.length + ' campagne' + (vis.length > 1 ? 's' : '') + ')</td><td></td><td class="n">' + fmt(ts) + ' €</td><td class="n">' + fmt(tr) + ' €</td><td class="n">' + (ts ? fmt(tr / ts, 2) + '×' : '—') + '</td></tr></tbody>';
    $('#camp').innerHTML = h;
    $$('#camp tbody tr[data-i]').forEach(function (tr2) {
      tr2.onclick = function () { var i2 = +tr2.dataset.i; setCamp(state.camp === i2 ? null : i2); };
    });
  }
  function renderDonut() {
    var cx = 80, cy = 112, r = 64, sw = 24, a = -Math.PI / 2, s = '';
    var S0 = CH.reduce(function (x, c) { return x + c.s; }, 0);
    var rows = CH.slice().sort(function (x, y) { return y.s - x.s; });
    rows.forEach(function (c) {
      var f = c.s / S0, a2 = a + f * 2 * Math.PI, large = f > .5 ? 1 : 0;
      var p = function (tt, rr) { return [cx + rr * Math.cos(tt), cy + rr * Math.sin(tt)]; };
      var p1 = p(a + .012, r), p2 = p(a2 - .012, r);
      s += '<path data-k="' + c.k + '" class="' + (state.ch && state.ch !== c.k ? 'dimmed' : '') + '" d="M' + p1[0] + ',' + p1[1] + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + p2[0] + ',' + p2[1] + '" fill="none" stroke="' + C[c.k] + '" stroke-width="' + (state.ch === c.k ? sw + 6 : sw) + '"/>'; a = a2;
    });
    var sel = state.ch ? CH.filter(function (c) { return c.k === state.ch; })[0] : null;
    s += '<text x="' + cx + '" y="' + (cy - 2) + '" font-size="17" font-weight="700" text-anchor="middle" fill="#252423">' + fmt((sel ? sel.s : S0) / 1000, 1) + ' k€</text><text x="' + cx + '" y="' + (cy + 14) + '" font-size="10.5" text-anchor="middle" fill="#8A8886">' + (sel ? fmt(sel.s / S0 * 100, 1) + ' % du budget' : 'budget T1') + '</text>';
    rows.forEach(function (c, i) { var y = 50 + i * 32; s += '<g data-k="' + c.k + '" class="' + (state.ch && state.ch !== c.k ? 'dimmed' : '') + '" style="cursor:pointer"><rect x="162" y="' + (y - 12) + '" width="96" height="28" fill="transparent"/><rect x="162" y="' + (y - 9) + '" width="9" height="9" rx="2" fill="' + C[c.k] + '"/><text x="177" y="' + y + '" font-size="11.5" fill="#252423">' + c.n.replace('Google ', '') + '</text><text x="177" y="' + (y + 13) + '" font-size="10.5" fill="#8A8886">' + fmt(c.s / S0 * 100, 1) + ' %</text></g>'; });
    $('#donut').innerHTML = s;
    $$('#donut [data-k]').forEach(function (el) {
      var c = CH.filter(function (x) { return x.k === el.dataset.k; })[0];
      DK.tip(el, '<b>' + c.n + '</b> · ' + fmt(c.s / 1000, 1) + ' k€ (' + fmt(c.s / S0 * 100, 1) + ' %)');
      el.onclick = function () { setChannel(state.ch === c.k ? null : c.k); };
    });
  }
  function renderAll() { renderKpis(); renderCombo(); renderRoas(); renderCamps(); renderDonut(); paintSlicers(); }

  /* ---------- slicers ---------- */
  var sls = $$('.sl');
  function paintSlicers() {
    sls[0].querySelector('b').innerHTML = PERIODS[state.period][0] + ' <span>▾</span>';
    sls[1].querySelector('b').innerHTML = (state.ch ? NAMES[state.ch] : 'Tous') + ' <span>▾</span>';
    sls[2].querySelector('b').innerHTML = (state.camp !== null ? CAMPS[state.camp][0].slice(0, 20) + '…' : 'Toutes') + ' <span>▾</span>';
    sls[0].classList.toggle('act', state.period !== 0); sls[1].classList.toggle('act', !!state.ch); sls[2].classList.toggle('act', state.camp !== null);
  }
  function setChannel(k) { state.ch = k; if (state.camp !== null && CAMPS[state.camp][1] !== k) state.camp = null; renderAll(); DK.done('filter'); if (k) DK.toast('Filtre appliqué à toute la page · ' + NAMES[k]); }
  function setCamp(i) { state.camp = i; if (i !== null) { state.ch = CAMPS[i][1]; } renderAll(); DK.done('filter'); }
  function dropdown(sl, items, cur, pick) {
    $$('.dd').forEach(function (d) { d.remove(); });
    var dd = document.createElement('div'); dd.className = 'dd on';
    dd.innerHTML = items.map(function (it, i) { return '<div data-i="' + i + '" class="' + (i === cur ? 'cur' : '') + '">' + it + '</div>'; }).join('');
    sl.appendChild(dd);
    $$('div', dd).forEach(function (d) { d.onclick = function (e) { e.stopPropagation(); dd.remove(); pick(+d.dataset.i); }; });
  }
  sls[0].onclick = function () { dropdown(sls[0], PERIODS.map(function (p) { return p[1] + ' <span style="color:#8A8886;margin-left:auto;font-size:11px">' + p[0] + '</span>'; }), state.period, function (i) { state.period = i; renderAll(); DK.done('filter'); }); };
  var CK = ['search', 'meta', 'email', 'tiktok', 'display'];
  sls[1].onclick = function () { dropdown(sls[1], ['Tous'].concat(CK.map(function (k) { return '<i style="background:' + C[k] + '"></i>' + NAMES[k]; })), state.ch ? CK.indexOf(state.ch) + 1 : 0, function (i) { setChannel(i ? CK[i - 1] : null); }); };
  sls[2].onclick = function () { dropdown(sls[2], ['Toutes'].concat(CAMPS.map(function (c) { return '<i style="background:' + C[c[1]] + '"></i>' + c[0]; })), state.camp === null ? 0 : state.camp + 1, function (i) { if (i) setCamp(i - 1); else { state.camp = null; renderAll(); } }); };
  document.addEventListener('click', function (e) { if (!e.target.closest('.sl')) $$('.dd').forEach(function (d) { d.remove(); }); });

  /* ---------- live budget optimiser ---------- */
  var ai = $('.ai'), mv = $('.mv', ai), proj = $('.proj', ai);
  var opt = document.createElement('div'); opt.className = 'optim';
  opt.innerHTML = '<div class="row">De <select id="from"></select> vers <select id="to"></select></div>' +
    '<div class="row">Montant réalloué<span class="amt" id="amt">6 000 €</span></div><input type="range" id="move" min="0" max="15000" step="500" value="6000">';
  mv.parentNode.insertBefore(opt, mv.nextSibling);
  var fromS = $('#from', opt), toS = $('#to', opt);
  CK.forEach(function (k) { fromS.innerHTML += '<option value="' + k + '"' + (k === 'display' ? ' selected' : '') + '>' + NAMES[k].replace('Google ', '') + '</option>'; toS.innerHTML += '<option value="' + k + '"' + (k === 'search' ? ' selected' : '') + '>' + NAMES[k].replace('Google ', '') + '</option>'; });
  var ap = document.createElement('button'); ap.className = 'apply'; ap.textContent = 'Appliquer au scénario T2';
  proj.parentNode.insertBefore(ap, proj.nextSibling);
  // diminishing returns: revenue = a * spend^b, calibrated on Q1 actuals
  var B = { search: .82, meta: .55, email: .7, tiktok: .78, display: .38 };
  function rev(k, s) { var c = CH.filter(function (x) { return x.k === k; })[0]; return c.r * Math.pow(s / c.s, B[k]); }
  function optimise() {
    var f = fromS.value, to = toS.value, m = +$('#move', opt).value;
    $('#amt', opt).textContent = fmt(m) + ' €';
    var bxs = $$('.bx b', mv);
    bxs[0].textContent = NAMES[f].replace('Google ', '') + ' −' + fmt(m) + ' €'; bxs[0].style.color = C[f];
    bxs[1].textContent = NAMES[to].replace('Google ', '') + ' +' + fmt(m) + ' €'; bxs[1].style.color = C[to];
    var cf = CH.filter(function (x) { return x.k === f; })[0], ct = CH.filter(function (x) { return x.k === to; })[0];
    var S0 = CH.reduce(function (a, c) { return a + c.s; }, 0), R0 = CH.reduce(function (a, c) { return a + c.r; }, 0);
    var delta = f === to ? 0 : (rev(f, Math.max(500, cf.s - m)) - cf.r) + (rev(to, ct.s + m) - ct.r);
    var pb = $$('div b', proj);
    pb[0].textContent = (delta >= 0 ? '+' : '−') + fmt(Math.abs(delta) / 1000, 1) + ' k€'; pb[0].style.color = delta >= 0 ? 'var(--pos)' : 'var(--neg)';
    pb[1].textContent = fmt(R0 / S0, 2) + '× → ' + fmt((R0 + delta) / S0, 2) + '×';
    return delta;
  }
  [fromS, toS, $('#move', opt)].forEach(function (el) { el.addEventListener('input', function () { optimise(); DK.done('optim'); }); });
  ap.onclick = function () { var d = optimise(); DK.toast('Scénario T2 enregistré · CA projeté ' + (d >= 0 ? '+' : '−') + fmt(Math.abs(d) / 1000, 1) + ' k€'); DK.done('optim'); };
  optimise();

  /* ---------- toolbar, pages, filters pane ---------- */
  var tools = $$('.tool span');
  tools.forEach(function (sp) {
    var n = sp.textContent.trim();
    sp.onclick = {
      'Exporter': function () {
        var rows = [['campagne', 'canal', 'depenses_eur', 'ca_eur', 'roas']].concat(CAMPS.map(function (c) { return ['"' + c[0] + '"', NAMES[c[1]], c[2], c[3], (c[3] / c[2]).toFixed(2)]; }));
        var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([rows.map(function (r) { return r.join(','); }).join('\n')], { type: 'text/csv' })); a.download = 'egerine_campagnes_T1_2025.csv'; document.body.appendChild(a); a.click(); a.remove();
        DK.toast('Export CSV des campagnes');
      },
      'Partager': function () { try { navigator.clipboard.writeText(location.href); } catch (e) { } DK.toast('Lien du rapport copié'); },
      'Commentaires': function () { DK.toast('2 commentaires · équipe marketing Égérine'); },
      'Signets': function () { state = { period: 2, ch: 'meta', camp: 1 }; renderAll(); DK.toast('Signet « Saint-Valentin » appliqué'); DK.done('filter'); },
      'Affichage': function () { document.body.style.zoom = document.body.style.zoom === '0.9' ? '1' : '0.9'; }
    }[n] || function () { DK.toast('Mode édition réservé aux auteurs du rapport'); };
  });
  var pages = $$('.pages span');
  var cards = $$('.card');
  pages.forEach(function (p, i) {
    p.onclick = function () {
      if (i === 5) { DK.toast('Nouvelle page de rapport'); return; }
      pages.forEach(function (x) { x.classList.remove('on'); }); p.classList.add('on'); DK.done('pages');
      if (i === 0) { state = { period: 0, ch: null, camp: null }; renderAll(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      if (i === 1) { var c1 = $('#roasbar').closest('.card'); c1.scrollIntoView({ behavior: 'smooth', block: 'center' }); DK.flash(c1); }
      if (i === 2) { var c2 = $('#camp').closest('.card'); c2.scrollIntoView({ behavior: 'smooth', block: 'center' }); DK.flash(c2); }
      if (i === 3) DK.modal({ title: 'Créations · top 4 par CTR', html: '<div class="fc-tbl">' + [['Reels Saint-Valentin · 15 s', 'Meta', '2,9 %'], ['UGC « routine du matin »', 'TikTok', '2,6 %'], ['Carrousel soldes · 5 visuels', 'Meta', '1,4 %'], ['Bannière retargeting 300×250', 'Display', '0,3 %']].map(function (r) { return '<div><span>' + r[0] + ' <small style="color:#8A8886">· ' + r[1] + '</small></span><b>CTR ' + r[2] + '</b></div>'; }).join('') + '</div>' });
      if (i === 4) DK.modal({ title: 'Prévisions T2 2025', sub: 'Projection à budget constant, avec la réallocation du scénario en cours.', html: '<div class="fc-tbl">' + [['Avril', '238 k€', '3,84×'], ['Mai', '251 k€', '3,90×'], ['Juin', '246 k€', '3,87×']].map(function (r) { return '<div><span>' + r[0] + '</span><span>CA ' + r[1] + ' · <b>ROAS ' + r[2] + '</b></span></div>'; }).join('') + '</div>' });
    };
  });
  $('.filters').onclick = function () { state = { period: 0, ch: null, camp: null }; renderAll(); DK.toast('Tous les filtres ont été réinitialisés'); };

  renderAll();

  DK.guide({
    intro: t('A Power BI–style report that really filters. Everything reacts together.', 'Un rapport façon Power BI qui filtre vraiment. Tout réagit ensemble.'),
    steps: [
      { id: 'filter', text: t('Click a channel bar or pick a Period / Channel filter', 'Cliquez une barre de canal ou un filtre Période / Canal') },
      { id: 'hover', text: t('Hover a week on the main chart', 'Survolez une semaine du graphique principal') },
      { id: 'optim', text: t('Move the AI budget optimiser slider', 'Bougez le curseur de l’optimiseur de budget IA') },
      { id: 'pages', text: t('Open a report page at the bottom (e.g. Prévisions)', 'Ouvrez une page du rapport en bas (ex. Prévisions)') }
    ]
  });
})();
