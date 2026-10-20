/* Marchands d'Art — interactive layer: live attention chart per entity, a real
   fuzzy artist search, a price simulator and a replay of the hyper-parameter
   search (illustrative data). */
(function () {
  var K = window.DemoKit, $ = K.$, $$ = K.$$, t = K.t, esc = K.esc;
  var style = document.createElement('style');
  style.textContent = '' +
    '.side a{cursor:pointer;transition:background .15s}.side a:hover{background:#33212499}' +
    '.ent span{cursor:pointer;transition:all .15s}.ent span:not(.on):hover{border-color:var(--ink);color:var(--ink)}' +
    'tbody tr{cursor:pointer;transition:background .15s}tbody tr:hover{background:#FBF5EA}tbody tr.sel td{background:var(--gold-soft)}' +
    '.search input{border:0;outline:0;background:transparent;font:14px "DM Sans",system-ui;color:var(--ink);flex:1;min-width:0}' +
    '.res div{cursor:pointer;transition:border-color .15s}.res div:hover{border-color:var(--ink3)}' +
    '#att circle.pt{cursor:pointer}#att circle.pt:hover{r:7}' +
    '.am-btn{margin-top:12px;font:600 12.5px "DM Sans",system-ui;border:1px solid var(--ink);background:var(--ink);color:#F4EFE6;border-radius:9px;padding:8px 12px;cursor:pointer;display:inline-flex;gap:7px;align-items:center}.am-btn.ghost{background:transparent;color:var(--ink)}.am-btn:hover{opacity:.88}.am-btn:disabled{opacity:.5;cursor:default}' +
    '.sim-row{display:grid;grid-template-columns:1fr 64px;gap:4px 12px;align-items:center;margin-bottom:12px;font:13px "DM Sans",system-ui}.sim-row label{font-weight:600;color:#3d3530;font-size:12.5px}.sim-row output{text-align:right;font:12px "DM Mono",monospace;color:#6E1F2B}.sim-row input{grid-column:1/3;accent-color:#6E1F2B;width:100%}.sim-row small{grid-column:1/3;color:#958A7E;font-size:11.5px;margin-top:-4px}' +
    '.sim-out{background:#6E1F2B;color:#fff;border-radius:14px;padding:14px 16px;margin:6px 0 4px;display:flex;align-items:baseline;gap:10px}.sim-out b{font:600 34px "Cormorant Garamond",serif}.sim-out span{font-size:12px;color:#F0DCD8}' +
    '.sim-fi{display:flex;flex-direction:column;gap:5px;margin-top:12px}.sim-fi div{display:grid;grid-template-columns:150px 1fr 44px;gap:8px;align-items:center;font-size:12px;color:#5C534B}.sim-fi i{height:6px;border-radius:4px;background:#B08A3E;display:block;transition:width .3s}.sim-fi em{font-style:normal;text-align:right;font-family:"DM Mono";font-size:11px}' +
    '.mrow.best{transition:background .3s}.mrow.live{background:#FBF1DE}' +
    '.hp span.flash{background:#F4D58D;transition:background .2s}' +
    '.seglist div{display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid #EFE9DE;font-size:13px}.seglist i{width:12px;height:12px;border-radius:4px;flex:none}.seglist small{margin-left:auto;color:#958A7E;font-family:"DM Mono";font-size:11.5px}';
  document.head.appendChild(style);

  /* ---------- attention chart per entity ---------- */
  var SERIES = {
    'Art Basel': { d: [52, 54, 51, 55, 57, 56, 58, 61, 60, 59, 63, 66, 64, 62, 61, 63, 88, 97, 79, 70, 66, 65, 68, 71, 93, 84, 74, 72, 76, 78], ev: [[17, 'Ouverture de la foire'], [24, 'Annonce d’un record']] },
    'Frieze': { d: [40, 41, 43, 42, 44, 47, 45, 46, 48, 47, 49, 51, 50, 49, 52, 55, 54, 53, 56, 58, 57, 75, 81, 66, 61, 60, 62, 63, 64, 66], ev: [[22, 'Frieze Masters annoncé']] },
    'Christie’s': { d: [58, 57, 59, 60, 58, 56, 57, 59, 61, 60, 58, 57, 59, 60, 62, 61, 59, 60, 61, 63, 62, 60, 59, 61, 62, 64, 63, 62, 61, 60], ev: [] },
    'Sotheby’s': { d: [49, 50, 52, 51, 50, 49, 51, 53, 52, 51, 50, 72, 64, 56, 53, 52, 51, 52, 54, 53, 52, 51, 53, 54, 53, 52, 54, 55, 54, 53], ev: [[11, 'Vente du soir à New York']] }
  };
  var current = 'Art Basel';
  function drawChart(name) {
    current = name;
    var base = SERIES[name].d, n = 30, W = 760, H = 270, L = 36, R = 12, T = 16, B = 28, pw = W - L - R, ph = H - T - B, mx = 125;
    var x = function (i) { return L + i * pw / (n - 1); }, y = function (v) { return T + ph - v / mx * ph; };
    var s = '';
    for (var i = 0; i <= 4; i++) { var yy = T + ph - ph * i / 4; s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '" stroke="#EFE9DE"/><text x="' + (L - 8) + '" y="' + (yy + 4) + '" font-size="10.5" fill="#958A7E" text-anchor="end" font-family="DM Mono">' + (i * 30) + '</text>'; }
    var rm = base.map(function (v, i) { var a = base.slice(Math.max(0, i - 6), i + 1); return a.reduce(function (p, c) { return p + c; }, 0) / a.length; });
    var thr = rm.map(function (v) { return v * 1.25; });
    s += '<path d="M' + thr.map(function (v, i) { return x(i) + ',' + y(v); }).join(' L') + '" fill="none" stroke="#B08A3E" stroke-width="1.5" stroke-dasharray="4 4"/>';
    s += '<path d="M' + base.map(function (v, i) { return x(i) + ',' + y(v); }).join(' L') + ' L' + x(n - 1) + ',' + (T + ph) + ' L' + x(0) + ',' + (T + ph) + 'Z" fill="#6E1F2B" opacity=".07"/>';
    s += '<polyline class="ln" points="' + base.map(function (v, i) { return x(i) + ',' + y(v); }).join(' ') + '" fill="none" stroke="#6E1F2B" stroke-width="2.4" stroke-linejoin="round"/>';
    base.forEach(function (v, i) {
      var pk = v > thr[i];
      s += '<circle class="pt" data-i="' + i + '" cx="' + x(i) + '" cy="' + y(v) + '" r="' + (pk ? 6 : 3.2) + '" fill="' + (pk ? '#6E1F2B' : '#FFFDF9') + '" stroke="' + (pk ? '#FFFDF9' : '#6E1F2B') + '" stroke-width="' + (pk ? 2.5 : 1.6) + '"/>';
    });
    SERIES[name].ev.forEach(function (e) { var xx = x(e[0]), yy = y(base[e[0]]); s += '<g><rect x="' + (xx - 75) + '" y="' + (yy - 36) + '" width="150" height="22" rx="11" fill="#1E1A17"/><text x="' + xx + '" y="' + (yy - 21) + '" font-size="11" fill="#F4EFE6" text-anchor="middle">' + e[1] + '</text></g>'; });
    ['1 juin', '8 juin', '15 juin', '22 juin', '29 juin'].forEach(function (tx, k) { var i2 = Math.round(k * (n - 1) / 4); s += '<text x="' + x(i2) + '" y="' + (H - 8) + '" font-size="10.5" fill="#958A7E" text-anchor="middle">' + tx + '</text>'; });
    s += '<g font-size="11" fill="#5C534B" transform="translate(' + (L + 260 - W) + ' 0)"><rect x="' + (W - 250) + '" y="' + T + '" width="10" height="3" fill="#6E1F2B"/><text x="' + (W - 236) + '" y="' + (T + 5) + '">attention</text><rect x="' + (W - 170) + '" y="' + T + '" width="10" height="2" fill="#B08A3E"/><text x="' + (W - 156) + '" y="' + (T + 5) + '">seuil de pic (+25 %)</text></g>';
    var svg = $('#att'); svg.innerHTML = s;
    var line = svg.querySelector('.ln'), len = 2000;
    line.style.strokeDasharray = len; line.style.strokeDashoffset = len; line.getBoundingClientRect();
    line.style.transition = 'stroke-dashoffset .9s ease'; line.style.strokeDashoffset = 0;
    $$('circle.pt', svg).forEach(function (c) {
      var i3 = +c.dataset.i;
      K.tip(c, function () { var pk = base[i3] > thr[i3]; return '<b>' + (i3 + 1) + ' juin</b> · score ' + base[i3] + (pk ? ' · <span style="color:#F4D58D">pic d’attention</span>' : ''); });
      c.addEventListener('mouseenter', function () { K.done('peak'); });
    });
    var peaks = base.filter(function (v, i) { return v > thr[i]; }).length;
    $$('.kpi')[4].querySelector('.v').textContent = peaks;
    $$('.kpi')[4].querySelector('.d').textContent = 'hype signals sur 30 jours · ' + name;
  }
  var ents = $$('.ent span');
  function setEnt(name) {
    ents.forEach(function (e) { e.classList.toggle('on', e.textContent === name); });
    $$('tbody tr').forEach(function (tr) { tr.classList.toggle('sel', tr.cells[0].textContent.indexOf(name.split(' ')[0].replace('’s', '')) === 0); });
    drawChart(name); K.done('ent');
  }
  ents.forEach(function (e) { e.onclick = function () { setEnt(e.textContent); }; });
  $$('tbody tr').forEach(function (tr) {
    tr.onclick = function () {
      var nm = tr.cells[0].textContent.trim();
      var key = Object.keys(SERIES).filter(function (k) { return nm.indexOf(k.replace('’s', '').split(' ')[0]) === 0; })[0];
      if (key) { setEnt(key); $('#att').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      else K.toast(nm + ' · pas encore de série journalière');
    };
  });
  drawChart('Art Basel');

  /* ---------- SmartSearch ---------- */
  var ARTISTS = [
    ['Jean-Michel Basquiat', ['baskiat', 'basquiat', 'jmb', 'samo']], ['Jean-Michel Othoniel', []], ['Barkley L. Hendricks', []],
    ['Yayoi Kusama', ['kusama']], ['David Hockney', []], ['Gerhard Richter', []], ['Jeff Koons', []], ['Banksy', []],
    ['Pierre Soulages', ['soulage']], ['Anish Kapoor', []], ['Takashi Murakami', []], ['Marlene Dumas', []],
    ['Etel Adnan', []], ['Huguette Caland', []], ['Saloua Raouda Choucair', ['choucair']], ['Ayman Baalbaki', []],
    ['Zao Wou-Ki', ['zao wouki']], ['Julie Mehretu', []], ['Kehinde Wiley', []], ['Cecily Brown', []]
  ];
  function norm(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function lev(a, b) {
    var m = a.length, n = b.length, d = []; for (var i = 0; i <= m; i++) { d[i] = [i]; }
    for (var j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function grams(s) { var g = {}; s = '  ' + s + ' '; for (var i = 0; i < s.length - 2; i++) g[s.substr(i, 3)] = 1; return g; }
  function jacc(a, b) { var A = grams(a), B = grams(b), inter = 0, uni = 0, k; for (k in A) { uni++; if (B[k]) inter++; } for (k in B) if (!A[k]) uni++; return uni ? inter / uni : 0; }
  function match(q) {
    q = norm(q); if (!q) return [];
    return ARTISTS.map(function (a) {
      var name = norm(a[0]), parts = name.split(' '), best = 0, how = 'n-grammes';
      if (a[1].some(function (al) { return lev(q, al) <= 1; })) { best = .96; how = 'alias'; }
      parts.concat([name]).forEach(function (p) {
        var l = 1 - lev(q, p) / Math.max(q.length, p.length); if (l > best) { best = l; how = 'levenshtein'; }
        var j = jacc(q, p); if (j > best) { best = j; how = 'n-grammes'; }
        if (p.indexOf(q) === 0 && q.length >= 3) { var pr = .7 + .3 * q.length / p.length; if (pr > best) { best = pr; how = 'préfixe'; } }
      });
      return { name: a[0], s: Math.min(.99, best), how: how };
    }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);
  }
  var sb = $('.search');
  sb.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1E1A17" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input value="Baskiat" placeholder="Tapez un nom, même mal orthographié…">';
  var sin = $('input', sb), res = $('.res');
  function renderRes() {
    var r = match(sin.value);
    res.innerHTML = r.length ? r.map(function (x, i) { return '<div class="' + (i === 0 && x.s > .6 ? 'top' : '') + '" data-n="' + esc(x.name) + '">' + esc(x.name) + '<small>' + x.how + '</small><b>' + x.s.toFixed(2).replace('.', ',') + '</b></div>'; }).join('')
      : '<div style="color:#958A7E">Tapez un nom d’artiste</div>';
    $$('[data-n]', res).forEach(function (d) { d.onclick = function () { simulator(d.dataset.n); }; });
  }
  sin.addEventListener('input', function () { renderRes(); if (sin.value.length > 3) K.done('search'); });
  renderRes();

  /* ---------- price simulator ---------- */
  function fmt(v) { return Math.round(v).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' $'; }
  function simulator(artist) {
    K.modal({
      title: 'Simulateur de prix · XGBoost', sub: (artist ? artist + ' · ' : '') + 'Les signaux sociaux pèsent bien plus que l’œuvre elle-même (Lee et al., 2024).',
      html: [
        ['rep', 'Réputation de l’artiste', 'expositions muséales cumulées', 0, 60, artist ? 38 : 12, ''],
        ['hist', 'Historique de ventes', 'ventes aux enchères passées', 0, 200, artist ? 120 : 18, ''],
        ['inst', 'Prestige institutionnel', 'galeries et musées partenaires', 1, 10, artist ? 8 : 4, '/10'],
        ['media', 'Attention médiatique', 'score de veille sur 30 jours', 0, 100, 64, ''],
        ['size', 'Taille de l’œuvre', 'surface en cm²', 400, 40000, 9000, ' cm²']
      ].map(function (f) { return '<div class="sim-row"><label for="' + f[0] + '">' + f[1] + '</label><output id="o-' + f[0] + '"></output><input type="range" id="' + f[0] + '" min="' + f[3] + '" max="' + f[4] + '" value="' + f[5] + '" data-u="' + f[6] + '"><small>' + f[2] + '</small></div>'; }).join('') +
        '<div class="sim-out"><b id="price">—</b><span id="range"></span></div><div class="sim-fi" id="fi"></div>',
      onOpen: function (body) {
        function calc() {
          var v = {}; $$('input', body).forEach(function (i) { v[i.id] = +i.value; body.querySelector('#o-' + i.id).textContent = i.value + i.dataset.u; });
          var social = Math.log1p(v.rep) * 0.9 + Math.log1p(v.hist) * 0.55 + v.inst * 0.22 + v.media * 0.008;
          var visual = Math.log(v.size) * 0.12;
          var p = Math.exp(5.4 + social + visual);
          body.querySelector('#price').textContent = fmt(p);
          body.querySelector('#range').textContent = 'intervalle ± ' + fmt(p * 0.18) + ' · R² 0,89';
          var parts = [['Réputation', Math.log1p(v.rep) * 0.9], ['Historique de ventes', Math.log1p(v.hist) * 0.55], ['Prestige', v.inst * 0.22], ['Attention médiatique', v.media * 0.008], ['Taille (visuel)', visual]];
          var tot = parts.reduce(function (a, b) { return a + b[1]; }, 0);
          body.querySelector('#fi').innerHTML = '<div style="font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#958A7E;font-weight:600;display:block">Contribution au prix</div>' +
            parts.map(function (x) { return '<div><span>' + x[0] + '</span><i style="width:' + (100 * x[1] / tot).toFixed(0) + '%"></i><em>' + (100 * x[1] / tot).toFixed(0) + ' %</em></div>'; }).join('');
        }
        $$('input', body).forEach(function (i) { i.addEventListener('input', function () { calc(); K.done('sim'); }); });
        calc();
      }
    });
  }
  var priceCard = $$('.r3 .card')[2];
  var simBtn = document.createElement('button'); simBtn.className = 'am-btn'; simBtn.innerHTML = '◆ Essayer le simulateur de prix';
  simBtn.onclick = function () { simulator(); };
  priceCard.appendChild(simBtn);

  /* ---------- replay the hyper-parameter search ---------- */
  var modelCard = $$('.r2 .card')[1];
  var hpBtn = document.createElement('button'); hpBtn.className = 'am-btn ghost'; hpBtn.innerHTML = '↻ Relancer RandomizedSearchCV';
  modelCard.appendChild(hpBtn);
  var best = $('.mrow.best'), bestCells = $$('.mono', best);
  hpBtn.onclick = function () {
    hpBtn.disabled = true; best.classList.add('live');
    var it = 0, total = 55, r2 = 0.8837, rmse = 399.19, chips = $$('.hp span');
    var tm = setInterval(function () {
      it++;
      if (Math.random() < .35 || it === total) { r2 = Math.min(0.8885, r2 + Math.random() * 0.0012); rmse = Math.max(380.21, rmse - Math.random() * 4.2); }
      if (it === total) { r2 = 0.8885; rmse = 380.21; }
      bestCells[0].innerHTML = '<b>' + r2.toFixed(4).replace('.', ',') + '</b>'; bestCells[1].innerHTML = '<b>' + rmse.toFixed(2).replace('.', ',') + ' $</b>';
      var c = chips[it % chips.length]; c.classList.add('flash'); setTimeout(function () { c.classList.remove('flash'); }, 180);
      hpBtn.innerHTML = (it <= 30 ? 'Phase 1 · cv=3 · ' + it + '/30' : 'Phase 2 · cv=5 · ' + (it - 30) + '/25');
      if (it >= total) {
        clearInterval(tm); best.classList.remove('live'); hpBtn.disabled = false; hpBtn.innerHTML = '↻ Relancer RandomizedSearchCV';
        K.toast('Meilleur modèle retrouvé · R² 0,8885 · RMSE 380 $'); K.done('hp');
      }
    }, 70);
  };

  /* ---------- sidebar ---------- */
  var cards = $$('.card');
  var go = function (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(el); };
  var sideActions = {
    'Vue du marché': function () { window.scrollTo({ top: 0, behavior: 'smooth' }); },
    'Prédiction de prix': function () { simulator(); },
    'Veille médiatique': function () { go($$('.r2 .card')[0]); },
    'Recherche artiste': function () { go($$('.r3 .card')[1]); sin.focus(); sin.select(); },
    'Signaux faibles': function () { K.modal({ title: 'Signaux faibles · autoencoder', sub: 'Les ventes que l’autoencoder reconstruit mal sont des anomalies : souvent des artistes qui décollent.', html: '<div class="seglist">' + [['Ayman Baalbaki', 'erreur 3,4σ', '#6E1F2B'], ['Julie Mehretu', 'erreur 2,9σ', '#8E2A39'], ['Huguette Caland', 'erreur 2,6σ', '#B08A3E']].map(function (r) { return '<div><i style="background:' + r[2] + '"></i>' + r[0] + '<small>' + r[1] + '</small></div>'; }).join('') + '</div>' }); },
    'Tendances': function () { K.modal({ title: 'Tendances à 3 mois · LSTM', html: '<div class="seglist">' + [['Art moyen-oriental contemporain', '▲ +14 %', '#5E7A5B'], ['Abstraction lyrique', '▲ +6 %', '#5E7A5B'], ['Street art', '▼ −4 %', '#8E2A39']].map(function (r) { return '<div><i style="background:' + r[2] + '"></i>' + r[0] + '<small>' + r[1] + '</small></div>'; }).join('') + '</div>' }); },
    'Segments': function () { K.modal({ title: 'Segments de marché · k-means', html: '<div class="seglist">' + [['Blue chips établis', '29 %', '#1E1A17'], ['Mid-career en hausse', '24 %', '#6E1F2B'], ['Émergents spéculatifs', '13 %', '#B08A3E'], ['Marché régional stable', '21 %', '#5E7A5B'], ['Estampes & multiples', '13 %', '#958A7E']].map(function (r) { return '<div><i style="background:' + r[2] + '"></i>' + r[0] + '<small>' + r[1] + '</small></div>'; }).join('') + '</div>' }); },
    'Variables pour le ML': function () {
      var rows = [['date', 'entite', 'articles', 'score_attention', 'pic']].concat(SERIES[current].d.map(function (v, i) { return ['2026-06-' + ('0' + (i + 1)).slice(-2), current, Math.round(v / 3), (v / 100).toFixed(2), v > 80 ? 1 : 0]; }));
      var blob = new Blob([rows.map(function (r) { return r.join(','); }).join('\n')], { type: 'text/csv' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'variables_attention.csv'; document.body.appendChild(a); a.click(); a.remove();
      K.toast('Export CSV · ' + (rows.length - 1) + ' lignes (' + current + ')');
    }
  };
  $$('.side a').forEach(function (a) {
    a.addEventListener('click', function () {
      $$('.side a').forEach(function (x) { x.classList.remove('on'); }); a.classList.add('on');
      var key = a.childNodes[1] ? a.childNodes[1].textContent.trim() : a.textContent.trim();
      (sideActions[key] || function () { })();
    });
  });

  K.guide({
    intro: t('The art-market signal system, now interactive.', 'Le système de signalisation du marché de l’art, en version interactive.'),
    steps: [
      { id: 'ent', text: t('Switch entity: Frieze, Christie’s, Sotheby’s…', 'Changez d’entité : Frieze, Christie’s, Sotheby’s…') },
      { id: 'peak', text: t('Hover a peak on the attention curve', 'Survolez un pic sur la courbe d’attention') },
      { id: 'search', text: t('Type an artist with a typo in SmartSearch', 'Tapez un artiste avec une faute dans SmartSearch') },
      { id: 'sim', text: t('Move a slider in the price simulator', 'Bougez un curseur du simulateur de prix') },
      { id: 'hp', text: t('Replay the hyper-parameter search', 'Relancez la recherche d’hyperparamètres') }
    ]
  });
})();
