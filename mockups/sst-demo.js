/* SST — interactive layer for the school-transport dashboard (fictional data) */
(function () {
  var K = window.DemoKit, $ = K.$, $$ = K.$$, t = K.t;

  var style = document.createElement('style');
  style.textContent = '' +
    '.nav a{cursor:pointer;transition:background .15s,color .15s}.nav a:hover{background:#2c3038;color:#fff}' +
    '.fl{cursor:pointer;border-radius:10px;transition:background .15s;margin:0 -8px;padding-left:8px;padding-right:8px}.fl:hover{background:#F6F7FA}.fl.sel{background:#FFF7E0}' +
    '.seg span{cursor:pointer}.seg span:not(.on):hover{color:var(--ink)}' +
    '.mapwrap svg{transition:transform .35s ease;transform-origin:54% 45%}' +
    '.mapctl b{cursor:pointer}.mapctl b:hover{background:#F6F7FA}' +
    '.busmk{cursor:pointer}.busmk:hover circle:last-of-type{stroke-width:4}' +
    '.popup{transition:left .9s linear, top .9s linear, opacity .2s;pointer-events:none}.popup.noarrow:after{display:none}' +
    '.btn,.iconbtn{cursor:pointer}.btn:hover{background:#000}' +
    '.al{position:relative;transition:opacity .3s, transform .3s}.al .res{position:absolute;right:0;bottom:9px;font:600 11.5px Inter;color:var(--green);background:var(--green-soft);border-radius:7px;padding:3px 8px;opacity:0;transition:opacity .15s;cursor:pointer;border:0}' +
    '.al:hover .res{opacity:1}.al.gone{opacity:0;transform:translateX(16px)}' +
    '.search{position:relative;padding:0 13px}.search input{border:0;outline:0;font:13px Inter,system-ui;color:var(--ink);flex:1;padding:9px 0;background:transparent;min-width:0}' +
    '.sres{position:absolute;left:0;right:0;top:44px;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 18px 40px rgba(28,31,36,.14);z-index:50;padding:6px;display:none}' +
    '.sres.on{display:block}.sres div{display:flex;gap:10px;align-items:center;padding:8px 9px;border-radius:8px;cursor:pointer;font-size:13px;color:var(--ink)}.sres div:hover,.sres div.act{background:#F6F7FA}' +
    '.sres small{color:var(--ink-3);font-size:11.5px;margin-left:auto}.sres em{font-style:normal;font-size:10.5px;font-weight:700;color:var(--ink-3);text-transform:uppercase;letter-spacing:.06em;padding:6px 9px 2px;display:block}' +
    '.sres .ic{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;font-size:11px;font-weight:700;flex:none}' +
    '.stu{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #EEF1F6;font-size:13px}.stu:last-child{border:0}' +
    '.stu .av{width:30px;height:30px;border-radius:50%;background:#EEF1F6;display:grid;place-items:center;font-weight:700;font-size:11px;color:#4A5A72;flex:none}' +
    '.stu small{display:block;color:#8593A8;font-size:11.5px}.stu .tg{margin-left:auto;font:600 11.5px Inter;border-radius:20px;padding:4px 10px;border:0;cursor:pointer}' +
    '.tg.in{background:#E3F6EE;color:#18A06B}.tg.out{background:#FDECEC;color:#E5484D}' +
    '.prog i{transition:width .9s linear}.bar-h{cursor:pointer}.bar-h:hover{opacity:.85}';
  document.head.appendChild(style);

  /* ---------- data ---------- */
  var routes = $$('.mapwrap svg > path[stroke-width="5"]'); // A, B, C, D
  var buses = [
    { id: '03', route: 'Route C · Hillside', driver: 'Tala Rizk', on: 31, cap: 32, eta: '07:46', st: 'ok', path: 2, p: .80, color: '#3B6FD8', speed: 28 },
    { id: '07', route: 'Route A · North Loop', driver: 'Khalil Mansour', on: 38, cap: 40, eta: '07:52', st: 'ok', path: 0, p: .62, color: '#1C1F24', speed: 32 },
    { id: '12', route: 'Route B · Riverside', driver: 'Adam Farah', on: 44, cap: 45, eta: '07:55', st: 'early', path: 1, p: .50, color: '#FFB81C', speed: 36 },
    { id: '21', route: 'Route E · Old Town', driver: 'Nour Haidar', on: 29, cap: 30, eta: '07:57', st: 'ok', path: null, p: .51, speed: 24 },
    { id: '15', route: 'Route D · Lakeview', driver: 'Georges Saab', on: 36, cap: 41, eta: '08:06', st: 'late', path: 3, p: .30, color: '#E5484D', speed: 14 },
    { id: '09', route: 'Route F · East Gate', driver: 'Maya Khoury', on: 22, cap: 24, eta: '08:01', st: 'traffic', path: 0, p: .14, color: '#1C1F24', speed: 11 }
  ];
  var students = [
    ['Lara Saleh', 'Grade 3', '07', 'B4', false], ['Omar Haddad', 'Grade 5', '12', 'R2', true], ['Yara Khalil', 'Grade 1', '03', 'H1', true],
    ['Karim Nassar', 'Grade 7', '15', 'L3', true], ['Maya Aoun', 'Grade 4', '21', 'O2', true], ['Elie Frem', 'Grade 2', '09', 'E1', true],
    ['Sara Mouawad', 'Grade 6', '07', 'N3', true], ['Jad Karam', 'Grade 8', '12', 'R5', true], ['Lea Rahme', 'Grade 3', '15', 'L1', false],
    ['Rami Tannous', 'Grade 9', '03', 'H4', true], ['Nour Daher', 'Grade 2', '21', 'O1', true], ['Tia Abboud', 'Grade 5', '09', 'E2', true]
  ];
  var fleetRows = $$('.fl');
  buses.forEach(function (b, i) { b.row = fleetRows[i]; b.row.dataset.bus = b.id; });

  // Map markers: tag each bus group
  var mk = {};
  $$('.mapwrap svg g[font-family] > g').forEach(function (g) {
    var id = g.querySelector('text').textContent.trim(); mk[id] = g; g.classList.add('busmk');
  });

  var popup = $('.popup'); popup.classList.add('noarrow');
  var mapwrap = $('.mapwrap'), svg = $('.mapwrap svg');
  var selected = '07';

  function pathPoint(b) {
    var path = routes[b.path]; if (!path) return null;
    var L = path.getTotalLength(); return path.getPointAtLength(Math.min(b.p, 1) * L);
  }
  function pillFor(b) {
    if (b.p >= 1) return '<span class="pill p-g">' + t('Arrived', 'Arrivé') + '</span>';
    return { ok: '<span class="pill p-g">On time</span>', early: '<span class="pill p-b">Early 2m</span>', late: '<span class="pill p-r">+9 min</span>', traffic: '<span class="pill p-a">Traffic</span>' }[b.st];
  }
  function tagFor(b) {
    if (b.p >= 1) return ['Arrived', 'var(--green-soft)', 'var(--green)'];
    return { ok: ['On time', 'var(--green-soft)', 'var(--green)'], early: ['Early 2m', 'var(--blue-soft)', 'var(--blue)'], late: ['+9 min', 'var(--red-soft)', 'var(--red)'], traffic: ['Traffic', 'var(--amber-soft)', 'var(--amber)'] }[b.st];
  }
  function byId(id) { return buses.filter(function (b) { return b.id === id; })[0]; }

  function renderPopup() {
    var b = byId(selected); if (!b || b.path === null) { popup.style.opacity = 0; return; }
    var tag = tagFor(b);
    popup.innerHTML = '<div class="t"><span class="bus" style="flex:none;width:26px;height:26px;border-radius:8px;background:' + b.color + ';color:' + (b.id === '12' ? '#1C1F24' : '#fff') + ';font-size:11px">' + b.id + '</span>' + b.route +
      '<span class="tag" style="background:' + tag[1] + ';color:' + tag[2] + '">' + tag[0] + '</span></div>' +
      '<div class="g"><div>Driver<b>' + b.driver + '</b></div><div>Speed<b>' + (b.p >= 1 ? 0 : b.speed) + ' km/h</b></div><div>On board<b>' + b.on + ' / ' + b.cap + '</b></div><div>ETA school<b>' + b.eta + '</b></div></div>';
    var g = mk[b.id]; if (!g) return;
    var r = g.getBoundingClientRect(), w = mapwrap.getBoundingClientRect();
    var cx = r.left + r.width / 2 - w.left, cy = r.top + r.height / 2 - w.top;
    var x = cx - 244 - 24; if (x < 8) x = cx + 24;
    var y = Math.max(8, Math.min(cy - 60, w.height - 140));
    popup.style.left = x + 'px'; popup.style.top = y + 'px'; popup.style.opacity = 1;
  }
  function renderBus(b) {
    var pt = pathPoint(b);
    if (pt && mk[b.id]) mk[b.id].setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
    var bar = b.row.querySelector('.prog i'); bar.style.width = Math.round(Math.min(b.p, 1) * 100) + '%';
    b.row.querySelector('.r').innerHTML = '<div class="eta">' + b.eta + '</div>' + pillFor(b);
  }
  function select(id, scroll) {
    selected = id;
    buses.forEach(function (b) { b.row.classList.toggle('sel', b.id === id); });
    renderPopup();
    if (scroll) K.flash(mapwrap);
    K.done('bus');
  }

  /* ---------- animation loop ---------- */
  buses.forEach(renderBus); select('07');
  var syncEl = $('.top p'), sync = 4;
  setInterval(function () {
    buses.forEach(function (b) {
      if (b.p >= 1) return;
      b.p = Math.min(1, b.p + b.speed / 9000);
      if (b.p >= 1) { K.toast(t('Bus ', 'Bus ') + b.id + t(' arrived at school, all students checked in', ' arrivé à l’école, tous les élèves pointés')); }
      renderBus(b);
    });
    sync = (sync + 1) % 6;
    syncEl.textContent = syncEl.textContent.replace(/last sync \d+ s ago/, 'last sync ' + sync + ' s ago');
    renderPopup();
  }, 1000);

  /* ---------- interactions ---------- */
  buses.forEach(function (b) {
    b.row.addEventListener('click', function () { select(b.id, true); });
    if (mk[b.id]) mk[b.id].addEventListener('click', function () { select(b.id); });
  });

  // zoom
  var zoom = 1, ctl = $$('.mapctl b');
  ctl[0].onclick = function () { zoom = Math.min(1.8, zoom + .2); svg.style.transform = 'scale(' + zoom + ')'; setTimeout(renderPopup, 380); K.done('map'); };
  ctl[1].onclick = function () { zoom = Math.max(1, zoom - .2); svg.style.transform = 'scale(' + zoom + ')'; setTimeout(renderPopup, 380); K.done('map'); };

  // segmented controls
  function seg(container, fn) {
    if (!container) return;
    var opts = $$('span', container);
    opts.forEach(function (s, i) { s.onclick = function () { opts.forEach(function (o) { o.classList.remove('on'); }); s.classList.add('on'); fn(i, s.textContent); }; });
  }
  var segs = $$('.seg');
  var runLabel = $('.live');
  seg(segs[0], function (i) {
    var vis = [[0, 1, 2, 3], [0, 1, 2, 3], [2, 3]][i];
    routes.forEach(function (r, k) { r.style.opacity = vis.indexOf(k) >= 0 ? 1 : .12; });
    runLabel.lastChild.textContent = ['Morning run live', 'Afternoon run · 15:10', 'Activities · 2 buses'][i];
    K.done('map');
  });
  seg(segs[1], function (i) {
    buses.forEach(function (b) { b.row.style.display = (i === 1 && ['late', 'traffic'].indexOf(b.st) < 0) ? 'none' : ''; });
    K.done('delayed');
  });
  seg(segs[2], function (i) {
    var pb = $('.paybig'), rows = $$('.prow b');
    if (i === 0) { pb.innerHTML = '<b>$48,250</b><span>of $58,900 billed</span>'; rows[0].textContent = '$48,250'; rows[1].textContent = '$6,480'; rows[2].textContent = '$4,170'; }
    else { pb.innerHTML = '<b>$142,600</b><span>of $176,700 billed</span>'; rows[0].textContent = '$142,600'; rows[1].textContent = '$21,200'; rows[2].textContent = '$12,900'; }
    K.flash(pb);
  });

  // punctuality tooltips
  var days = [['Mon', 38, 2], ['Tue', 37, 3], ['Wed', 39, 1], ['Thu', 39, 1], ['Today', 17, 1]];
  var bars = $$('.chart svg > g:nth-of-type(2) rect');
  bars.forEach(function (r, i) {
    var d = days[Math.min(4, Math.floor(i / 2))]; if (!d) return;
    r.classList.add('bar-h');
    K.tip(r, '<b>' + d[0] + '</b> · ' + d[1] + ' on time · ' + d[2] + ' late');
  });

  // alerts
  var openAlerts = 3, kpiAlert = $$('.kpi')[4].querySelector('.v'), subAlert = $('.card .ch .sub', $$('.card')[3]);
  $$('.al').forEach(function (al, i) {
    if (i === 0) { al.style.cursor = 'pointer'; al.addEventListener('click', function (e) { if (!e.target.classList.contains('res')) select('15', true); }); }
    if (i > 2) return;
    var b = document.createElement('button'); b.className = 'res'; b.textContent = t('Resolve', 'Résoudre');
    al.appendChild(b);
    b.onclick = function (e) {
      e.stopPropagation(); al.classList.add('gone'); setTimeout(function () { al.remove(); }, 300);
      openAlerts--; kpiAlert.textContent = openAlerts; subAlert.textContent = '· ' + openAlerts + ' open';
      K.toast(t('Alert resolved', 'Alerte résolue')); K.done('alert');
    };
  });
  function addAlert(title, text) {
    var box = $('.alerts'), now = new Date();
    var d = document.createElement('div'); d.className = 'al';
    d.innerHTML = '<div class="ai" style="background:var(--green-soft)"><svg viewBox="0 0 24 24" stroke="#18A06B"><path d="m5 12 4 4 10-10"/></svg></div><div><b></b><p></p></div><time>' +
      String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + '</time>';
    d.querySelector('b').textContent = title; d.querySelector('p').textContent = text;
    box.insertBefore(d, box.firstChild); K.flash(d);
  }

  // broadcast
  function broadcast(pre) {
    K.modal({
      title: t('Broadcast a message', 'Envoyer un message groupé'),
      sub: t('Sent instantly by push notification and SMS.', 'Envoyé instantanément par notification et SMS.'),
      html: '<label class="dk-field"><span>' + t('Audience', 'Destinataires') + '</span><select id="aud">' +
        '<option value="642">' + t('All parents · 642', 'Tous les parents · 642') + '</option>' +
        '<option value="41"' + (pre ? ' selected' : '') + '>' + t('Route D · Lakeview parents · 41', 'Parents ligne D · Lakeview · 41') + '</option>' +
        '<option value="20">' + t('All drivers · 20', 'Tous les chauffeurs · 20') + '</option></select></label>' +
        '<label class="dk-field"><span>Message</span><textarea id="msg" rows="4">' + t('Bus 15 (Route D) is running about 9 minutes late due to roadworks on Lake Rd. Students are safe on board.', 'Le bus 15 (ligne D) a environ 9 minutes de retard à cause de travaux sur Lake Rd. Les élèves sont en sécurité à bord.') + '</textarea></label>',
      actions: [{ label: t('Cancel', 'Annuler') }, {
        label: t('Send now', 'Envoyer'), primary: true, onClick: function (body) {
          var n = body.querySelector('#aud').value, m = body.querySelector('#msg').value.trim();
          if (!m) return false;
          K.toast(t('Message sent to ', 'Message envoyé à ') + n + t(' recipients', ' destinataires'));
          addAlert(t('Broadcast sent to ', 'Message envoyé à ') + n + t(' recipients', ' destinataires'), m.slice(0, 80) + (m.length > 80 ? '…' : ''));
          K.done('broadcast');
        }
      }]
    });
  }
  $('.btn').onclick = function () { broadcast(false); };

  // bell
  $('.iconbtn').onclick = function () { $('.alerts').scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash($$('.card')[3]); };

  // students / attendance modal
  function studentsModal(filter) {
    var html = '<div id="stl">' + students.filter(function (s) { return !filter || s[0].toLowerCase().indexOf(filter) >= 0; }).map(function (s) {
      var i = students.indexOf(s);
      return '<div class="stu"><div class="av">' + s[0].split(' ').map(function (x) { return x[0]; }).join('') + '</div><div>' + s[0] + '<small>' + s[1] + ' · Bus ' + s[2] + ' · Stop ' + s[3] + '</small></div>' +
        '<button class="tg ' + (s[4] ? 'in' : 'out') + '" data-i="' + i + '">' + (s[4] ? t('On board', 'À bord') : t('Absent', 'Absent')) + '</button></div>';
    }).join('') + '</div>';
    K.modal({
      title: filter ? students.filter(function (s) { return s[0].toLowerCase().indexOf(filter) >= 0; })[0][0] : t('Attendance · morning run', 'Présences · tournée du matin'),
      sub: t('Tap a status to mark a student on board or absent. Parents are notified automatically.', 'Touchez un statut pour marquer un élève à bord ou absent. Les parents sont prévenus automatiquement.'),
      html: html,
      onOpen: function (body) {
        $$('.tg', body).forEach(function (b) {
          b.onclick = function () {
            var s = students[+b.dataset.i]; s[4] = !s[4];
            b.className = 'tg ' + (s[4] ? 'in' : 'out'); b.textContent = s[4] ? t('On board', 'À bord') : t('Absent', 'Absent');
            var v = $('.kpi.hero .v'), n = parseInt(v.textContent, 10) + (s[4] ? 1 : -1);
            v.innerHTML = n + ' <span>/ 668</span>';
            K.toast(s[0] + (s[4] ? t(' marked on board, parent notified', ' marqué(e) à bord, parent prévenu') : t(' marked absent, parent notified', ' marqué(e) absent(e), parent prévenu')));
            K.done('attend');
          };
        });
      }
    });
  }

  // search
  var search = $('.search');
  search.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8593A8" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
    '<input placeholder="' + t('Search student, bus or route… try “Lara”', 'Chercher élève, bus ou ligne… essayez « Lara »') + '"><kbd>⌘K</kbd><div class="sres"></div>';
  var inp = $('input', search), res = $('.sres', search);
  inp.addEventListener('input', function () {
    var q = inp.value.trim().toLowerCase(); if (!q) { res.classList.remove('on'); return; }
    var st = students.filter(function (s) { return s[0].toLowerCase().indexOf(q) >= 0; }).slice(0, 4);
    var bs = buses.filter(function (b) { return (b.id + ' ' + b.route + ' ' + b.driver).toLowerCase().indexOf(q) >= 0; }).slice(0, 3);
    var h = '';
    if (st.length) h += '<em>' + t('Students', 'Élèves') + '</em>' + st.map(function (s) { return '<div data-s="' + s[0] + '"><span class="ic" style="background:#EEF1F6;color:#4A5A72">' + s[0].split(' ').map(function (x) { return x[0]; }).join('') + '</span>' + s[0] + '<small>' + s[1] + ' · Bus ' + s[2] + '</small></div>'; }).join('');
    if (bs.length) h += '<em>' + t('Buses', 'Bus') + '</em>' + bs.map(function (b) { return '<div data-b="' + b.id + '"><span class="ic" style="background:#FFF1CC;color:#9A7300">' + b.id + '</span>' + b.route + '<small>' + b.driver + '</small></div>'; }).join('');
    if (!h) h = '<div style="color:#8593A8;cursor:default">' + t('No result', 'Aucun résultat') + '</div>';
    res.innerHTML = h; res.classList.add('on');
    $$('[data-s]', res).forEach(function (d) { d.onclick = function () { res.classList.remove('on'); studentsModal(d.dataset.s.toLowerCase()); K.done('search'); }; });
    $$('[data-b]', res).forEach(function (d) { d.onclick = function () { res.classList.remove('on'); select(d.dataset.b, true); K.done('search'); }; });
  });
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var f = $('[data-s],[data-b]', res); if (f) f.click(); } });
  document.addEventListener('click', function (e) { if (!search.contains(e.target)) res.classList.remove('on'); });
  document.addEventListener('keydown', function (e) { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); inp.focus(); } });

  // sidebar
  var cards = $$('.card');
  var navMap = {
    'Overview': function () { window.scrollTo({ top: 0, behavior: 'smooth' }); },
    'Live Tracking': function () { cards[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(cards[0]); },
    'Routes & Stops': function () { cards[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(cards[0]); },
    'Fleet': function () { cards[1].scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(cards[1]); },
    'Students': function () { studentsModal(); },
    'Attendance': function () { studentsModal(); },
    'Drivers & Aides': function () {
      K.modal({ title: t('Drivers on duty', 'Chauffeurs en service'), html: buses.map(function (b) { return '<div class="stu"><div class="av">' + b.driver.split(' ').map(function (x) { return x[0]; }).join('') + '</div><div>' + b.driver + '<small>Bus ' + b.id + ' · ' + b.route + '</small></div><button class="tg in" onclick="DemoKit.toast(\'' + t('Calling ', 'Appel de ') + b.driver + '…\')">' + t('Call', 'Appeler') + '</button></div>'; }).join('') });
    },
    'Parents': function () { broadcast(false); },
    'Messages': function () { cards[3].scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(cards[3]); },
    'Payments': function () { cards[4].scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(cards[4]); },
    'Reports': function () { cards[2].scrollIntoView({ behavior: 'smooth', block: 'center' }); K.flash(cards[2]); }
  };
  $$('.nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      $$('.nav a').forEach(function (x) { x.classList.remove('on'); }); a.classList.add('on');
      var key = a.textContent.replace(/\d+$/, '').trim();
      (navMap[key] || function () { })(); K.done('nav');
    });
  });

  K.guide({
    pos: 'left',
    intro: t('This dashboard is live: buses move, and everything below is clickable.', 'Ce tableau de bord est vivant : les bus roulent, et tout est cliquable.'),
    steps: [
      { id: 'bus', text: t('Click a bus on the map or in “Active buses”', 'Cliquez un bus sur la carte ou dans « Active buses »') },
      { id: 'delayed', text: t('Filter the delayed buses', 'Filtrez les bus en retard (« Delayed »)') },
      { id: 'search', text: t('Search a student, e.g. “Lara”', 'Cherchez un élève, ex. « Lara »') },
      { id: 'broadcast', text: t('Send a Broadcast to parents', 'Envoyez un message aux parents (« Broadcast »)') },
      { id: 'alert', text: t('Resolve a live alert', 'Résolvez une alerte') }
    ]
  });
})();
