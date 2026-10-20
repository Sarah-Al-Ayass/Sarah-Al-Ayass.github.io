/* Pangea Comply — interactive layer: a simulated RAG compliance check
   (rule matching runs in the browser; texts and results are illustrative). */
(function () {
  var K = window.DemoKit, $ = K.$, $$ = K.$$, t = K.t, esc = K.esc;

  var style = document.createElement('style');
  style.textContent = '' +
    '.side a{cursor:pointer;transition:background .15s}.side a:hover{background:#12373A}' +
    '.side a.off{opacity:.55}.tabs span,.modes span{cursor:pointer}' +
    '.text p{outline:none;border-radius:6px;transition:box-shadow .15s;min-height:80px}.text p:focus{box-shadow:0 0 0 2px #CFE7E2}' +
    '.text.plain mark{background:none!important;box-shadow:none!important;outline:none!important}.text.plain mark sup{display:none}' +
    'mark{cursor:pointer}.inf{cursor:pointer;transition:border-color .15s, box-shadow .15s}.inf:hover{border-color:#D9D5CA}' +
    '.inf:not(.open) .plain,.inf:not(.open) .src,.inf:not(.open) .fix,.inf:not(.open) .apply{display:none}' +
    '.inf.open.m{border-color:#EED29A;box-shadow:0 6px 20px rgba(201,130,14,.08)}' +
    '.apply{margin-top:10px;font:600 12px Inter,system-ui;background:#1F9466;color:#fff;border:0;border-radius:8px;padding:7px 12px;cursor:pointer}.apply:hover{background:#187a54}' +
    '.runbtn{font:600 12.5px Inter,system-ui;background:#0F2E30;color:#fff;border:0;border-radius:9px;padding:7px 13px;cursor:pointer;display:inline-flex;gap:7px;align-items:center}.runbtn:hover{background:#174245}.runbtn:disabled{opacity:.6;cursor:default}' +
    '.samples{display:flex;gap:6px;padding:10px 24px 0;flex-wrap:wrap}.samples button{font:500 11.5px Inter,system-ui;border:1px solid #E4E1D8;background:#fff;border-radius:20px;padding:4px 10px;color:#4B4A63;cursor:pointer}.samples button:hover{border-color:#0F2E30;color:#0F2E30}' +
    '.st .c{transition:background .2s}.st.wait .c{background:#F0EEE8}.st.wait .c svg{opacity:0}.st.run .c{background:#E6F0FB}.st.run .c svg{opacity:0}' +
    '.st.run .c:after{content:"";width:12px;height:12px;border:2px solid #2F7DD1;border-right-color:transparent;border-radius:50%;animation:spin .7s linear infinite;position:absolute}' +
    '.st .c{position:relative}@keyframes spin{to{transform:rotate(360deg)}}' +
    '.gauge circle:nth-of-type(2){transition:stroke-dasharray .8s ease}' +
    '.rres div{padding:10px 12px;border:1px solid #ECE9E1;border-radius:10px;margin-bottom:8px;font-size:13px}.rres b{font-size:12px;color:#7a8597;font-weight:600;display:block}.rres em{font-style:normal;float:right;font:600 11px "IBM Plex Mono",monospace;color:#1F9466}';
  document.head.appendChild(style);

  /* ---------- rule base (excerpt) ---------- */
  var RULES = [
    { id: 'r26', reg: 'RGPD', ref: 'Considérant 26', topic: 'Anonymisation et données identifiables', sev: 'h',
      re: /sans anonymisation|non anonymis[ée]+s?|données (?:personnelles )?(?:identifiables|nominatives)/i,
      why: 'utilisation de données identifiables sans anonymisation, alors que leur croisement massif augmente les risques de ré-identification.',
      quote: '« Il y a lieu d’appliquer les principes relatifs à la protection des données à toute information concernant une personne physique identifiée ou identifiable. »',
      fix: 'pseudonymiser ou anonymiser avant le croisement des sources.', rw: [/(conservées )?sans anonymisation/i, 'pseudonymisées avant tout croisement'] },
    { id: 'r6', reg: 'RGPD', ref: 'Art. 6(1)', topic: 'Licéité du traitement, consentement', sev: 'h',
      re: /(?:ni|sans) (?:recueil )?(?:systématique )?(?:du |de )?consentement[^,.;]*|à leur insu/i,
      why: 'aucune base légale n’est indiquée : le traitement se fait sans consentement des personnes concernées.',
      quote: '« Le traitement n’est licite que si […] la personne concernée a consenti au traitement de ses données à caractère personnel pour une ou plusieurs finalités spécifiques. »',
      fix: 'recueillir un consentement explicite ou documenter une autre base légale (intérêt légitime + mise en balance).', rw: [/(?:ni|sans) (?:recueil )?(?:systématique )?(?:du |de )?consentement[^,.;]*/i, 'avec le consentement explicite des personnes concernées'] },
    { id: 'r71', reg: 'RGPD', ref: 'Considérant 71', topic: 'Profilage et décision automatisée', sev: 'h',
      re: /(?:de manière autonome[^,.;]*?)?sans (?:mécanisme d.explicabilité|intervention humaine)[^,.;]*|entièrement automatisée?s?/i,
      why: 'profilage et décisions automatisées sans explication ni intervention humaine possible.',
      quote: '« La personne concernée devrait avoir le droit de ne pas faire l’objet d’une décision […] fondée exclusivement sur un traitement automatisé. »',
      fix: 'faire valider chaque décision par un commercial et expliquer les critères de priorisation.', rw: [/sans mécanisme d.explicabilité ou d.intervention humaine/i, 'avec une explication des critères et une validation par un commercial'] },
    { id: 'r35', reg: 'RGPD', ref: 'Art. 35', topic: 'Analyse d’impact (AIPD / DPIA)', sev: 'm',
      re: /(?:afin d.alimenter[^.]*?)?(?:scoring|profilage) prédictifs?[^.,;]*|modèles? de scoring[^.,;]*/i,
      why: 'le scoring prédictif à grande échelle exige une analyse d’impact avant sa mise en œuvre.',
      quote: '« Lorsqu’un type de traitement […] est susceptible d’engendrer un risque élevé, le responsable du traitement effectue […] une analyse de l’impact. »',
      fix: 'réaliser et documenter une AIPD avant la mise en production du modèle.', rw: [/(propriétaires)\./i, '$1, après une analyse d’impact (AIPD) documentée.'] },
    { id: 'ccpa', reg: 'CCPA', ref: '§1798.100', topic: 'Information au moment de la collecte', sev: 'm',
      re: /incluant des informations personnelles[^,.;]*|historiques? d.interaction|signaux comportementaux/i,
      why: 'les catégories de données collectées doivent être annoncées aux personnes au moment de la collecte.',
      quote: '« A business that controls the collection of a consumer’s personal information shall, at or before the point of collection, inform consumers […] »',
      fix: 'informer les prospects des catégories de données collectées et de leur finalité.', rw: [/incluant des informations personnelles identifiables telles que/i, 'dont les catégories sont annoncées aux personnes lors de la collecte, comme'] },
    { id: 'ai50', reg: 'AI Act', ref: 'Art. 50', topic: 'Transparence des contenus générés par IA', sev: 'h',
      re: /sans (?:indiquer|mentionner|préciser)[^.]*?(?:IA|intelligence artificielle)|se faire passer pour (?:un|une) (?:humain|commercial)/i,
      why: 'les personnes doivent savoir qu’elles interagissent avec une IA ou lisent un contenu généré par IA.',
      quote: '« Les fournisseurs veillent à ce que les systèmes d’IA destinés à interagir directement avec des personnes physiques soient conçus de manière que celles-ci soient informées […] »',
      fix: 'signaler clairement que le message a été généré par IA.', rw: [/sans (?:indiquer|mentionner|préciser)[^.]*?(?:IA|intelligence artificielle)/i, 'en indiquant clairement qu’ils sont générés par IA'] },
    { id: 'ai5', reg: 'AI Act', ref: 'Art. 5', topic: 'Pratiques interdites (manipulation)', sev: 'h',
      re: /exploit(?:er|ant) (?:les |leurs )?vulnérabilités[^.,;]*|techniques? subliminales?|manipul\w+/i,
      why: 'exploiter les vulnérabilités des personnes pour influencer leur décision est une pratique interdite.',
      quote: '« Sont interdites […] la mise sur le marché […] d’un système d’IA qui exploite les éventuelles vulnérabilités d’une personne […] »',
      fix: 'supprimer tout ciblage fondé sur la vulnérabilité émotionnelle.', rw: [/(?:et )?(?:peut )?exploit(?:er|ant) (?:les |leurs )?vulnérabilités[^.,;]*/i, 'et adapte le ton du message au secteur du prospect'] },
    { id: 'r5', reg: 'RGPD', ref: 'Art. 5(1)(e)', topic: 'Limitation de la conservation', sev: 'm',
      re: /conserv[a-zéèê]* (?:indéfiniment|sans (?:limite|durée)[^.,;]*)/i,
      why: 'les données ne peuvent pas être conservées sans durée limitée.',
      quote: '« […] conservées sous une forme permettant l’identification des personnes concernées pendant une durée n’excédant pas celle nécessaire […] »',
      fix: 'définir une durée de conservation (ex. 3 ans après le dernier contact).', rw: [/conserv[a-zéèê]* (?:indéfiniment|sans (?:limite|durée)[^.,;]*)/i, 'conservées 3 ans au maximum'] },
    { id: 'r9', reg: 'RGPD', ref: 'Art. 9', topic: 'Données sensibles', sev: 'h',
      re: /(?:données de )?santé|opinions? politiques?|convictions? religieuses?|orientation sexuelle|origine ethnique/i,
      why: 'le traitement de données sensibles est interdit sauf exceptions strictes.',
      quote: '« Le traitement des données à caractère personnel qui révèle […] les opinions politiques, les convictions religieuses […] est interdit. »',
      fix: 'retirer les données sensibles du ciblage.', rw: [/,? ?(?:y compris |dont )?(?:des )?(?:données de santé|opinions? politiques?)/i, ''] }
  ];
  var ALL_RULES_FOR_SEARCH = RULES.concat([
    { reg: 'RGPD', ref: 'Art. 13', topic: 'Information des personnes lors de la collecte' },
    { reg: 'RGPD', ref: 'Art. 17', topic: 'Droit à l’effacement (« droit à l’oubli »)' },
    { reg: 'RGPD', ref: 'Art. 22', topic: 'Décision individuelle automatisée, y compris le profilage' },
    { reg: 'AI Act', ref: 'Art. 3', topic: 'Définitions — « système d’IA »' },
    { reg: 'AI Act', ref: 'Art. 14', topic: 'Contrôle humain des systèmes d’IA à haut risque' },
    { reg: 'CCPA', ref: '§1798.120', topic: 'Droit de refuser la vente des données (opt-out)' }
  ]);

  var SAMPLES = {
    bad: (function () { var c = $('.text p').cloneNode(true); $$('sup', c).forEach(function (x) { x.remove(); }); return c.textContent.replace(/\s+/g, ' ').trim(); })(),
    ai: 'Notre assistant rédige automatiquement les messages de prospection sans indiquer aux destinataires qu’ils sont produits par une IA, et peut exploiter les vulnérabilités émotionnelles des prospects pour accélérer la signature. Les échanges sont conservés indéfiniment pour entraîner le modèle.',
    ok: 'La solution agrège des données issues du CRM, pseudonymisées avant tout croisement, avec le consentement explicite des personnes concernées. Chaque priorisation proposée par l’algorithme est expliquée et validée par un commercial, et les messages indiquent clairement qu’ils sont générés par IA.'
  };

  var active = { 'RGPD': true, 'AI Act': true, 'CCPA': false };
  var findings = [];

  /* ---------- analysis ---------- */
  function analyse(text) {
    var out = [];
    RULES.forEach(function (r) {
      var m = r.re.exec(text);
      if (m && m[0].trim().length > 3) out.push({ r: r, start: m.index, end: m.index + m[0].length });
    });
    out.sort(function (a, b) { return a.start - b.start; });
    var keep = [], last = -1;
    out.forEach(function (f) { if (f.start >= last) { keep.push(f); last = f.end; } });
    var order = keep.slice().sort(function (a, b) { return (a.r.sev === b.r.sev ? a.start - b.start : (a.r.sev === 'h' ? -1 : 1)); });
    order.forEach(function (f, i) { f.n = ('0' + (i + 1)).slice(-2); });
    return keep;
  }
  function score(fs) {
    var h = fs.filter(function (f) { return f.r.sev === 'h'; }).length, m = fs.length - h;
    return Math.max(3, Math.floor(100 - 17.5 * h - 8 * m));
  }
  function sim(rule, text) {
    var hit = findings.some(function (f) { return f.r === rule; });
    var hsh = 0; (rule.ref + text.length).split('').forEach(function (c) { hsh = (hsh * 31 + c.charCodeAt(0)) % 997; });
    return hit ? 0.78 + (hsh % 12) / 100 : 0.52 + (hsh % 18) / 100;
  }

  /* ---------- rendering ---------- */
  var textBox = $('.text'), para = $('.text p');
  para.contentEditable = 'true'; para.spellcheck = false;
  function renderText(text) {
    var h = '', pos = 0;
    findings.forEach(function (f) {
      h += esc(text.slice(pos, f.start));
      h += '<mark class="' + f.r.sev + '" data-n="' + f.n + '">' + esc(text.slice(f.start, f.end)) + '<sup contenteditable="false">' + f.n + '</sup></mark>';
      pos = f.end;
    });
    h += esc(text.slice(pos));
    para.innerHTML = h;
    $$('mark', para).forEach(function (m) { m.addEventListener('click', function () { openInf(m.dataset.n, true); }); });
  }
  function renderReport(text) {
    var sc = score(findings);
    $('.gauge .v b').textContent = sc;
    $('.gauge circle:nth-of-type(2)').setAttribute('stroke-dasharray', (314.2 * sc / 100).toFixed(1) + ' 314.2');
    var st = sc >= 80 ? ['Score de conformité élevé', 'Aucune infraction critique : le texte peut être diffusé.', 'Conforme', 'var(--ok-soft)', 'var(--ok)']
      : sc >= 50 ? ['Score de conformité moyen', 'Quelques points à corriger avant diffusion.', 'À vérifier', 'var(--md-soft)', 'var(--md)']
        : ['Score de conformité faible', 'Le texte présente des <b>infractions critiques</b>. À corriger avant diffusion.', 'Non conforme', 'var(--hi-soft)', 'var(--hi)'];
    $('.sc h2').textContent = st[0]; $('.sc p').innerHTML = st[1];
    var pill = $('.top .pill'); pill.textContent = '● ' + st[2]; pill.style.background = st[3]; pill.style.color = st[4];
    // regulation boxes
    var regs = ['RGPD', 'AI Act', 'CCPA'];
    $$('.rg').forEach(function (box, i) {
      var reg = regs[i], n = findings.filter(function (f) { return f.r.reg === reg; }).length;
      box.querySelector('.t').textContent = reg + (active[reg] ? '' : ' · exclue');
      box.querySelector('.x b').textContent = n;
      box.querySelector('.x span').textContent = active[reg] ? (n > 1 ? 'infractions' : 'infraction') : (n > 1 ? 'signalées' : 'signalée');
      var bar = box.querySelector('.bar i'); bar.style.width = Math.max(4, Math.min(100, n * 24)) + '%';
      bar.style.background = n === 0 ? 'var(--ok)' : (active[reg] ? 'var(--hi)' : 'var(--md)');
    });
    // comments
    var list = $('.list');
    var sorted = findings.slice().sort(function (a, b) { return a.n < b.n ? -1 : 1; });
    list.innerHTML = '<div class="lh"><b>Commentaires</b>' + (sorted.length ? 'triés par gravité · cliquez pour ouvrir' : '') + '</div>' + (sorted.length ? sorted.map(function (f, i) {
      var c = f.r.sev === 'h' ? ['var(--hi)', 'var(--hi-soft)', 'Élevé'] : ['var(--md)', 'var(--md-soft)', 'Moyen'];
      return '<div class="inf ' + f.r.sev + (i === 0 ? ' open' : '') + '" data-n="' + f.n + '"><div class="it"><span class="num" style="background:' + c[0] + '">' + f.n + '</span><b>' + f.r.reg + ' — ' + f.r.ref + '</b>' +
        (active[f.r.reg] ? '' : '<span class="excl">exclue · signalée</span>') + '<span class="sev" style="background:' + c[1] + ';color:' + c[0] + '">' + c[2] + '</span></div>' +
        '<div class="plain"><b>Pourquoi :</b> ' + f.r.why + '</div>' +
        '<div class="src"><div class="m"><span>' + f.r.reg.toLowerCase() + ' / ' + f.r.ref.toLowerCase() + '</span><em>similarité ' + sim(f.r, text).toFixed(2) + '</em></div>' + f.r.quote + '</div>' +
        '<div class="fix"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1F9466" stroke-width="2.2" stroke-linecap="round" style="flex:none;margin-top:1px"><path d="m5 12 4 4 10-10"/></svg><span><b>Piste :</b> ' + f.r.fix + '</span></div>' +
        '<button class="apply">Appliquer la correction</button></div>';
    }).join('') : '<div class="inf open" style="border-color:#BFE6D3"><div class="it"><span class="num" style="background:var(--ok)">✓</span><b>Aucune infraction détectée</b></div><div class="plain">Le texte respecte les règles actives. Il peut être diffusé.</div></div>');
    $$('.inf[data-n]', list).forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target.classList.contains('apply')) return;
        openInf(el.dataset.n); K.done('open');
      });
      var ap = el.querySelector('.apply');
      if (ap) ap.onclick = function () { applyFix(el.dataset.n); };
    });
    // retrieved rules table
    var rows = RULES.map(function (r) { return { r: r, s: sim(r, text) }; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 6);
    $('.trace tbody').innerHTML = rows.map(function (x) {
      return '<tr><td>' + x.r.reg + (active[x.r.reg] ? '' : ' <span class="excl">exclue</span>') + '</td><td class="ref">' + x.r.ref + '</td><td class="q">' + x.r.topic + '</td><td><div class="sim"><i><b style="width:' + Math.round(x.s * 100) + '%"></b></i>' + x.s.toFixed(2) + '</div></td></tr>';
    }).join('');
    $('.dh p').textContent = 'Texte · ' + text.split(/\s+/).length + ' mots · FR · appel au LLM via le routeur Hugging Face · 6 règles récupérées';
    $$('.pipe .st small')[3].textContent = findings.length + (findings.length > 1 ? ' infractions' : ' infraction');
    $('.foot').innerHTML = '<span><i style="background:var(--hi)"></i>Élevé · ' + findings.filter(function (f) { return f.r.sev === 'h'; }).length + '</span><span><i style="background:var(--md)"></i>Moyen · ' + findings.filter(function (f) { return f.r.sev === 'm'; }).length + '</span><span style="margin-left:auto" class="mono">Appel fait à DeepSeek-R1 · réponse structurée par parse_blocks()</span>';
  }
  function openInf(n, fromText) {
    $$('.inf').forEach(function (el) { el.classList.toggle('open', el.dataset.n === n && !(el.classList.contains('open') && !fromText)); });
    $$('mark', para).forEach(function (m) { m.classList.toggle('sel', m.dataset.n === n); });
    var el = $('.inf[data-n="' + n + '"]'); if (el && fromText) { el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); K.flash(el); K.done('open'); }
  }
  function currentText() { var c = para.cloneNode(true); $$('sup', c).forEach(function (x) { x.remove(); }); return c.textContent.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim(); }

  var running = false;
  function run(text, quick) {
    if (running) return; running = true;
    text = text || currentText();
    var sts = $$('.pipe .st'); var btn = $('.runbtn'); if (btn) btn.disabled = true;
    sts.forEach(function (s) { s.classList.remove('run'); s.classList.add('wait'); });
    var i = 0, d = quick ? 0 : 520;
    (function step() {
      if (i > 0) { sts[i - 1].classList.remove('run'); }
      if (i === sts.length) {
        findings = analyse(text); renderText(text); renderReport(text);
        running = false; if (btn) btn.disabled = false; return;
      }
      sts[i].classList.remove('wait'); sts[i].classList.add('run'); i++;
      setTimeout(step, d);
    })();
  }
  function applyFix(n) {
    var f = findings.filter(function (x) { return x.n === n; })[0]; if (!f) return;
    var text = currentText(), before = score(findings);
    var nt = f.r.rw ? text.replace(f.r.rw[0], f.r.rw[1]) : text;
    if (nt === text) nt = text.slice(0, f.start) + text.slice(f.end);
    findings = analyse(nt); renderText(nt); renderReport(nt);
    K.toast('Correction appliquée · score ' + before + ' → ' + score(findings));
    K.done('fix');
  }

  /* ---------- controls ---------- */
  var ph = $('.paper .ph');
  var rb = document.createElement('button'); rb.className = 'runbtn';
  rb.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="#5EEAD4"><path d="M7 4v16l13-8z"/></svg>Analyser';
  ph.insertBefore(rb, $('.tabs', ph));
  rb.onclick = function () { run(); K.done('run'); };
  $('.small', ph).textContent = '· zone éditable';

  var samples = document.createElement('div'); samples.className = 'samples';
  samples.innerHTML = '<button data-s="bad">Exemple 1 · prospection B2B</button><button data-s="ai">Exemple 2 · assistant IA</button><button data-s="ok">Exemple 3 · version corrigée</button><button data-s="clear">Effacer</button>';
  textBox.parentNode.insertBefore(samples, textBox);
  $$('button', samples).forEach(function (b) {
    b.onclick = function () {
      if (b.dataset.s === 'clear') { findings = []; para.innerHTML = ''; para.focus(); return; }
      para.textContent = SAMPLES[b.dataset.s]; run(SAMPLES[b.dataset.s]); K.done('run');
    };
  });

  var tabs = $$('.tabs span');
  tabs.forEach(function (s, i) { s.onclick = function () { tabs.forEach(function (x) { x.classList.remove('on'); }); s.classList.add('on'); textBox.classList.toggle('plain', i === 1); }; });

  // regulation toggles in the sidebar
  var sideLinks = $$('.side a');
  [['RGPD', 3], ['AI Act', 4], ['CCPA', 5]].forEach(function (p) {
    var a = sideLinks[p[1]];
    a.removeAttribute('style');
    function paint() {
      a.classList.toggle('off', !active[p[0]]);
      a.innerHTML = active[p[0]] ? '<svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10"/></svg>' + p[0]
        : '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>' + p[0] + ' <span class="n">exclue</span>';
    }
    paint();
    a.onclick = function () {
      active[p[0]] = !active[p[0]]; paint();
      K.toast(p[0] + (active[p[0]] ? ' activé' : ' exclu · les infractions critiques restent signalées'));
      run(currentText(), true); K.done('rules');
    };
  });

  // rule search
  function ruleSearch() {
    K.modal({
      title: 'Recherche de règles', sub: 'Recherche sémantique dans la base vectorielle (RGPD, AI Act, CCPA), pour cadrer la génération.',
      html: '<label class="dk-field"><input id="rq" placeholder="ex. consentement, profilage, transparence…" value="consentement"></label><div class="rres"></div>',
      onOpen: function (body) {
        var q = body.querySelector('#rq'), out = body.querySelector('.rres');
        function go() {
          var words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
          var res = ALL_RULES_FOR_SEARCH.map(function (r) {
            var hay = (r.topic + ' ' + (r.why || '') + ' ' + r.ref + ' ' + r.reg).toLowerCase();
            var hit = words.filter(function (w) { return hay.indexOf(w.slice(0, Math.max(4, w.length - 2))) >= 0; }).length;
            return { r: r, s: words.length ? Math.min(.95, .45 + .25 * hit + (hay.length % 7) / 100) : .5 };
          }).sort(function (a, b) { return b.s - a.s; }).slice(0, 4);
          out.innerHTML = res.map(function (x) { return '<div><em>' + x.s.toFixed(2) + '</em><b>' + x.r.reg + ' · ' + x.r.ref + '</b>' + x.r.topic + '</div>'; }).join('');
        }
        q.addEventListener('input', go); go();
      }
    });
    K.done('search');
  }
  sideLinks[0].onclick = ruleSearch;
  sideLinks[1].onclick = function () { para.focus(); K.flash($('.paper')); };
  sideLinks[2].onclick = function () {
    K.modal({ title: 'Historique des analyses', html: [['Livre blanc B2B', 31, 'aujourd’hui'], ['Séquence e-mail · fintech', 74, 'hier'], ['Post LinkedIn · lancement', 92, '2 oct.'], ['Script d’appel · assurance', 46, '30 sept.']].map(function (h) {
      var c = h[1] >= 80 ? '#1F9466' : h[1] >= 50 ? '#C9820E' : '#D6453D';
      return '<div class="stu" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EEF1F6;font-size:13px"><span>' + h[0] + '<br><small style="color:#8593A8">' + h[2] + '</small></span><b style="color:' + c + '">' + h[1] + ' / 100</b></div>';
    }).join('') });
  };
  var modes = $$('.modes span');
  modes[0].onclick = ruleSearch;
  modes[1].onclick = function () { para.focus(); };

  // initial state = original screen, now generated by the engine
  findings = analyse(SAMPLES.bad); renderText(SAMPLES.bad); renderReport(SAMPLES.bad);

  K.guide({
    intro: t('A working version of the compliance checker: edit the text and analyse it.', 'Une version fonctionnelle du contrôle de conformité : modifiez le texte et analysez-le.'),
    steps: [
      { id: 'run', text: t('Click “Analyser” or pick an example text', 'Cliquez « Analyser » ou choisissez un exemple') },
      { id: 'open', text: t('Click a highlight to see the legal reason', 'Cliquez un surlignage pour voir la règle') },
      { id: 'fix', text: t('Apply a correction and watch the score rise', 'Appliquez une correction : le score remonte') },
      { id: 'rules', text: t('Exclude or include a regulation (sidebar)', 'Excluez ou activez une réglementation (menu)') },
      { id: 'search', text: t('Search the rule base', 'Faites une « Recherche de règles »') }
    ]
  });
})();
