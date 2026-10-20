/* Transfer Lab — interactive layer: switch between transfers and see the
   team impact recomputed (public season figures, rounded). */
(function () {
  var K = window.DemoKit, $ = K.$, $$ = K.$$, t = K.t;
  var P = {
    alisson: { short: 'Alisson', name: 'ALISSON BECKER', ini: 'GK', pos: 'Gardien', posK: 'gk', season: '2018/19', from: 'AS Roma', to: 'Liverpool FC', move: 'Serie A → Premier League', fee: '62,5 M€', team: 'Liverpool',
      seasons: ['2017/18', '2018/19', '2019/20'], bars: [38, 22, 33], barLbl: 'Buts encaissés', pts: [75, 97, 99], rk: ['4ᵉ', '2ᵉ', '1ᵉʳ'], arrive: 1,
      k: [['Buts encaissés par Liverpool', '38 → 22', '<b style="color:var(--good)">▼ −42 %</b> 2017/18 → 2018/19'], ['Points en championnat', '75 → 97', '<b style="color:var(--good)">▲ +22 pts</b> dès la 1re saison'], ['Classement', '4ᵉ → 1ᵉʳ', 'Champion de Premier League 2019/20'], ['Penaltys arrêtés (Roma, 2017/18)', '3', '213 dégagements longs réussis sur 416']],
      cmp: ['Alisson — buts encaissés en championnat', 'AS Roma · 2017/18', '28', 'Liverpool · 2018/19', '22', true], verdict: ['RÉUSSI', 'good'] },
    kepa: { short: 'Kepa', name: 'KEPA ARRIZABALAGA', ini: 'GK', pos: 'Gardien', posK: 'gk', season: '2018/19', from: 'Athletic Club', to: 'Chelsea FC', move: 'La Liga → Premier League', fee: '80,0 M€', team: 'Chelsea',
      seasons: ['2017/18', '2018/19', '2019/20'], bars: [38, 39, 54], barLbl: 'Buts encaissés', pts: [70, 72, 66], rk: ['5ᵉ', '3ᵉ', '4ᵉ'], arrive: 1,
      k: [['Buts encaissés par Chelsea', '38 → 39', '<b style="color:var(--bad)">▲ +3 %</b> 2017/18 → 2018/19'], ['Points en championnat', '70 → 72', '<b style="color:var(--ink2)">+2 pts</b> la 1re saison'], ['Classement', '5ᵉ → 3ᵉ', 'puis 54 buts encaissés en 2019/20'], ['Record mondial', '80 M€', 'gardien le plus cher de l’histoire']],
      cmp: ['Kepa — buts encaissés en championnat', 'Athletic · 2017/18', '46', 'Chelsea · 2018/19', '39', true], verdict: ['MITIGÉ', 'amb'] },
    ederson: { short: 'Ederson', name: 'EDERSON', ini: 'GK', pos: 'Gardien', posK: 'gk', season: '2017/18', from: 'Benfica', to: 'Manchester City', move: 'Liga Portugal → Premier League', fee: '40,0 M€', team: 'Manchester City',
      seasons: ['2016/17', '2017/18', '2018/19'], bars: [39, 27, 23], barLbl: 'Buts encaissés', pts: [78, 100, 98], rk: ['3ᵉ', '1ᵉʳ', '1ᵉʳ'], arrive: 1,
      k: [['Buts encaissés par City', '39 → 27', '<b style="color:var(--good)">▼ −31 %</b> 2016/17 → 2017/18'], ['Points en championnat', '78 → 100', '<b style="color:var(--good)">▲ +22 pts</b> record historique'], ['Classement', '3ᵉ → 1ᵉʳ', 'deux titres consécutifs'], ['Jeu au pied', 'Atout', 'relance longue : clé du jeu de Guardiola']],
      cmp: ['Ederson — buts encaissés en championnat', 'Benfica · 2016/17', '22', 'Man City · 2017/18', '27', false], verdict: ['RÉUSSI', 'good'] },
    werner: { short: 'Werner', name: 'TIMO WERNER', ini: 'FW', pos: 'Attaquant', posK: 'fw', season: '2020/21', from: 'RB Leipzig', to: 'Chelsea FC', move: 'Bundesliga → Premier League', fee: '53,0 M€', team: 'Chelsea',
      seasons: ['2019/20', '2020/21', '2021/22'], bars: [28, 6, 4], barLbl: 'Buts du joueur', pts: [66, 67, 74], rk: ['4ᵉ', '4ᵉ', '3ᵉ'], arrive: 1, max: 30,
      k: [['Buts en championnat (joueur)', '28 → 6', '<b style="color:var(--bad)">▼ −79 %</b> Leipzig → Chelsea'], ['Points de Chelsea', '66 → 67', '<b style="color:var(--ink2)">+1 pt</b> la 1re saison'], ['Classement', '4ᵉ → 4ᵉ', 'mais Ligue des champions remportée'], ['Occasions manquées', '18', 'grosses occasions non converties en 2020/21']],
      cmp: ['Werner — buts en championnat', 'Leipzig · 2019/20', '28', 'Chelsea · 2020/21', '6', false], verdict: ['DÉCEVANT', 'bad'] }
  };
  var cur = 'alisson';

  var style = document.createElement('style');
  style.textContent = '' +
    '.pg span,.pages span,.sl,.lg{cursor:pointer}.pg span:hover{color:var(--ink)}' +
    'tbody tr{cursor:pointer;transition:background .15s}tbody tr:hover td{background:rgba(255,255,255,.03)}' +
    '.hero,.k,.cmp{transition:opacity .25s}.fade{opacity:.15}' +
    '.sl{position:relative}.tdd{position:absolute;left:0;right:0;top:calc(100% + 4px);background:#16223F;border:1px solid #22304F;border-radius:8px;z-index:50;padding:4px;box-shadow:0 14px 30px rgba(0,0,0,.4)}' +
    '.tdd div{padding:7px 9px;border-radius:6px;font-size:12.5px;color:#EEF2FB}.tdd div:hover{background:#22304F}.tdd div.cur{color:#FFB020}' +
    '.lg.off{opacity:.4}.lg.off .cb{background:#22304F!important;color:transparent}' +
    'tr.hidden{display:none}#team rect.bb,#team circle{cursor:pointer}';
  document.head.appendChild(style);

  /* ---------- chart ---------- */
  function chart(p) {
    var W = 640, H = 300, L = 40, R = 40, T = 22, B = 40, pw = W - L - R, ph = H - T - B, n = 3, bw = pw / n, s = '', mx = p.max || 60;
    for (var i = 0; i <= 4; i++) { var y = T + ph - ph * i / 4; s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" stroke="#1A2644"/><text x="' + (L - 8) + '" y="' + (y + 4) + '" font-size="11" fill="#6E7A96" text-anchor="end" font-family="JetBrains Mono">' + Math.round(mx * i / 4) + '</text><text x="' + (W - R + 8) + '" y="' + (y + 4) + '" font-size="11" fill="#C98A10" font-family="JetBrains Mono">' + (60 + i * 10) + '</text>'; }
    p.bars.forEach(function (v, i2) {
      var h = v / mx * ph, x = L + i2 * bw + bw * .28;
      s += '<rect class="bb" data-i="' + i2 + '" x="' + x + '" y="' + (T + ph) + '" width="' + (bw * .44) + '" height="0" rx="4" fill="' + (i2 < p.arrive ? '#2A3A63' : '#3A4A70') + '" data-h="' + h + '"/><text x="' + (x + bw * .22) + '" y="' + (T + ph - h - 8) + '" font-size="13" font-weight="700" fill="#EEF2FB" text-anchor="middle" font-family="JetBrains Mono">' + v + '</text>';
    });
    var pts = p.pts.map(function (v, i2) { return [L + i2 * bw + bw / 2, T + ph - (v - 60) / 40 * ph]; });
    s += '<polyline points="' + pts.map(function (q) { return q.join(','); }).join(' ') + '" fill="none" stroke="#FFB020" stroke-width="3"/>';
    pts.forEach(function (q, i2) { var lx = q[0] + (i2 == 2 ? -112 : (i2 == 1 ? -49 : 14)), ly = q[1] + (i2 == 0 ? 8 : 12); var bty = T + ph - p.bars[i2] / mx * ph - 8; if (ly + 22 > T + ph - 22 || Math.abs(ly + 11 - bty) < 20) ly = q[1] - 34; if (Math.abs(ly + 11 - bty) < 20) ly = q[1] + 12; s += '<circle data-i="' + i2 + '" cx="' + q[0] + '" cy="' + q[1] + '" r="5" fill="#0A1124" stroke="#FFB020" stroke-width="3"/><rect x="' + lx + '" y="' + ly + '" width="98" height="22" rx="5" fill="#0A1124" stroke="#FFB020" stroke-opacity=".5"/><text x="' + (lx + 49) + '" y="' + (ly + 15) + '" font-size="12" font-weight="700" fill="#FFB020" text-anchor="middle">' + p.pts[i2] + ' pts · ' + p.rk[i2] + '</text>'; });
    p.seasons.forEach(function (tx, i2) { s += '<text x="' + (L + i2 * bw + bw / 2) + '" y="' + (H - 18) + '" font-size="12.5" fill="#A6B2CC" text-anchor="middle">' + tx + '</text>'; });
    var ax = L + bw * p.arrive; s += '<line x1="' + ax + '" x2="' + ax + '" y1="' + (T - 8) + '" y2="' + (T + ph) + '" stroke="#FFB020" stroke-dasharray="4 4" opacity=".6"/><text x="' + (ax - 6) + '" y="' + (T + ph - 8) + '" font-size="11" fill="#FFB020" text-anchor="end">arrivée de ' + p.short + ' ↗</text>';
    var svg = $('#team'); svg.innerHTML = s;
    requestAnimationFrame(function () {
      $$('rect.bb', svg).forEach(function (r) { var h = +r.dataset.h; r.style.transition = 'all .6s cubic-bezier(.2,.8,.2,1)'; r.setAttribute('y', T + ph - h); r.setAttribute('height', h); });
    });
    $$('rect.bb, circle', svg).forEach(function (el) {
      var i2 = +el.dataset.i;
      K.tip(el, '<b>' + p.team + ' · ' + p.seasons[i2] + '</b><br>' + p.barLbl + ' : ' + p.bars[i2] + ' · ' + p.pts[i2] + ' pts (' + p.rk[i2] + ')' + (i2 === p.arrive ? '<br><span style="color:#FFB020">1re saison après le transfert</span>' : ''));
      el.addEventListener('mouseenter', function () { K.done('hover'); });
    });
    $('.c7 .ct').firstChild.textContent = 'Impact sur l’équipe — ' + p.team;
    $$('.c7 .r span')[0].lastChild.textContent = p.barLbl;
  }

  /* ---------- profile ---------- */
  function show(id) {
    var p = P[id]; cur = id;
    var fadeEls = [$('.hero')].concat($$('.card.k'), [$('.cmp')]);
    fadeEls.forEach(function (e) { e.classList.add('fade'); });
    setTimeout(function () {
      $('.hero .ph').textContent = p.ini; $('.hero h1').textContent = p.name;
      $('.hero p').textContent = p.pos + ' · transfert ' + p.season + ' · ' + p.move;
      var cl = $$('.hero .club b'); cl[0].textContent = p.from; cl[1].textContent = p.to;
      $('.hero .fee b').textContent = p.fee;
      $$('.card.k').forEach(function (c, i) { c.querySelector('.l').textContent = p.k[i][0]; c.querySelector('.v').textContent = p.k[i][1]; c.querySelector('.d').innerHTML = p.k[i][2]; });
      var fhs = $$('.c5 .fh'); fhs[0].textContent = p.cmp[0];
      var cm = $$('.cmp div'); cm[0].innerHTML = '<small>' + p.cmp[1] + '</small><b>' + p.cmp[2] + '</b>'; cm[1].innerHTML = '<small>' + p.cmp[3] + '</small><b style="color:' + (p.cmp[5] ? 'var(--good)' : 'var(--bad)') + '">' + p.cmp[4] + '</b>';
      $('.crumb b').textContent = p.posK === 'gk' ? 'Performances des gardiens' : 'Étude de cas · attaquant';
      fadeEls.forEach(function (e) { e.classList.remove('fade'); });
      chart(p);
    }, 220);
    $$('.c5 tbody tr, .c8 tbody tr').forEach(function (tr) { tr.classList.toggle('sel', tr.dataset.p === id); });
    var sl = $$('.side .sl');
    sl[0].innerHTML = '<small>Poste</small>' + p.pos + ' ▾'; sl[1].innerHTML = '<small>Club</small>' + p.team + ' ▾'; sl[2].innerHTML = '<small>Joueur</small>' + p.short + ' ▾';
    $$('.pg span').forEach(function (s) { s.classList.toggle('on', s.textContent === (p.posK === 'gk' ? 'Gardiens' : 'Attaquants')); });
    $$('.pages span').forEach(function (s) { s.classList.toggle('on', s.textContent === (p.posK === 'gk' ? 'Gardiens' : 'Attaquants')); });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // tag table rows
  var ids5 = ['kepa', 'alisson', 'ederson'];
  $$('.c5 tbody tr').forEach(function (tr, i) { tr.dataset.p = ids5[i]; tr.onclick = function () { show(ids5[i]); K.done('gk'); }; });
  var ids8 = ['alisson', 'werner'];
  $$('.c8 tbody tr').forEach(function (tr, i) { tr.dataset.p = ids8[i]; tr.onclick = function () { show(ids8[i]); K.done(ids8[i] === 'werner' ? 'case' : 'gk'); }; });

  // sidebar player filter
  var sls = $$('.side .sl');
  function dd(sl, items, pick) {
    $$('.tdd').forEach(function (d) { d.remove(); });
    var d = document.createElement('div'); d.className = 'tdd';
    d.innerHTML = items.map(function (it) { return '<div data-k="' + it[0] + '"' + (it[0] === cur ? ' class="cur"' : '') + '>' + it[1] + '</div>'; }).join('');
    sl.appendChild(d);
    $$('div', d).forEach(function (x) { x.onclick = function (e) { e.stopPropagation(); d.remove(); pick(x.dataset.k); }; });
  }
  var playerItems = [['alisson', 'Alisson · Liverpool'], ['kepa', 'Kepa · Chelsea'], ['ederson', 'Ederson · Man City'], ['werner', 'Werner · Chelsea (attaquant)']];
  sls[2].onclick = function () { dd(sls[2], playerItems, function (k) { show(k); K.done(k === 'werner' ? 'case' : 'gk'); }); };
  sls[1].onclick = function () { dd(sls[1], [['alisson', 'Liverpool'], ['kepa', 'Chelsea'], ['ederson', 'Manchester City']], function (k) { show(k); K.done('gk'); }); };
  sls[0].onclick = function () { dd(sls[0], [['alisson', 'Gardien'], ['werner', 'Attaquant']], function (k) { show(k); K.done(k === 'werner' ? 'case' : 'gk'); }); };
  document.addEventListener('click', function (e) { if (!e.target.closest('.sl')) $$('.tdd').forEach(function (d) { d.remove(); }); });

  // leagues toggle (by league of origin)
  var leagueOf = { kepa: 'La Liga', alisson: 'Serie A', ederson: 'Autre', werner: 'Bundesliga' };
  var offL = {};
  $$('.lg').forEach(function (lg) {
    lg.onclick = function () {
      var name = lg.textContent.replace('✓', '').trim();
      offL[name] = !offL[name]; lg.classList.toggle('off', !!offL[name]);
      $$('.c5 tbody tr, .c8 tbody tr').forEach(function (tr) { tr.classList.toggle('hidden', !!offL[leagueOf[tr.dataset.p]]); });
      K.toast((offL[name] ? 'Ligue masquée : ' : 'Ligue affichée : ') + name); K.done('league');
    };
  });

  // report pages
  function page(name) {
    if (name === 'Gardiens') { show(cur === 'werner' ? 'alisson' : cur); return; }
    if (name === 'Attaquants') { show('werner'); K.done('case'); return; }
    if (name === 'Études de cas') { var c = $('.c8'); c.scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(c); return; }
    if (name === 'Statistiques équipe') { var c2 = $('.c7'); c2.scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(c2); return; }
    if (name === 'Transferts joueurs') { var c3 = $('.c5'); c3.scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(c3); return; }
    K.toast('Page « ' + name + ' » réalisée par un·e coéquipier·ère · ma partie : les gardiens');
  }
  $$('.pg span, .pages span').forEach(function (s) { s.onclick = function () { page(s.textContent.trim()); }; });

  chart(P.alisson);
  $$('.c5 tbody tr')[1].classList.add('sel');

  K.guide({
    intro: t('Pick a transfer and the whole dashboard recalculates its impact on the team.', 'Choisissez un transfert : tout le tableau de bord recalcule son impact sur l’équipe.'),
    steps: [
      { id: 'gk', text: t('Click another goalkeeper: Kepa or Ederson', 'Cliquez un autre gardien : Kepa ou Ederson') },
      { id: 'case', text: t('Open the Timo Werner case study', 'Ouvrez l’étude de cas Timo Werner') },
      { id: 'hover', text: t('Hover a season on the team-impact chart', 'Survolez une saison sur le graphique d’impact') },
      { id: 'league', text: t('Hide a league in the sidebar filters', 'Masquez une ligue dans les filtres') }
    ]
  });
})();
