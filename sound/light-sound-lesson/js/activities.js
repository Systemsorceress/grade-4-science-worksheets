/* ==========================================================
   activities.js — reusable interactive components & simulations
   ========================================================== */
window.LS = window.LS || {};

/* ---------- inline icons (24x24 stroke icons) ---------- */
LS.icons = (() => {
  const w = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  return {
    prev: w('<path d="M15 18l-6-6 6-6"/>'),
    next: w('<path d="M9 18l6-6-6-6"/>'),
    home: w('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'),
    soundOn: w('<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/>'),
    soundOff: w('<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/>'),
    teacher: w('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/><path d="M22 9v6"/>'),
    full: w('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    exitFull: w('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'),
    play: w('<path d="M7 4l13 8-13 8z" fill="currentColor"/>'),
    stop: w('<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>'),
    check: w('<path d="M4 12l5 5L20 6"/>'),
    x: w('<path d="M6 6l12 12M18 6L6 18"/>'),
    refresh: w('<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 4v7h-7"/>'),
    star: w('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/>'),
    sun: w('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    eye: w('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    mirror: w('<ellipse cx="12" cy="9" rx="6" ry="7"/><path d="M12 16v6M9 7l3-3M9 11l6-6"/>'),
    wave: w('<path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/>'),
    ear: w('<path d="M6 9a6 6 0 1112 0c0 3-2 4-3 5s-1 2-1 3a3 3 0 01-6 0"/><path d="M9.5 9a2.5 2.5 0 015 0"/>'),
    note: w('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
    ruler: w('<rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M6 8v3M10 8v4M14 8v3M18 8v4"/>'),
    bottle: w('<path d="M10 2h4v4l2 3v12a1 1 0 01-1 1H9a1 1 0 01-1-1V9l2-3z"/><path d="M8 14h8"/>'),
    search: w('<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>'),
    trophy: w('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0z"/><path d="M17 5h3a3 3 0 01-3 4M7 5H4a3 3 0 003 4"/>'),
    phone: w('<path d="M5 6l4 1-1 10-4 1zM19 6l-4 1 1 10 4 1z"/><path d="M9 11h6"/>'),
    alert: w('<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>'),
    print: w('<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'),
    download: w('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>'),
    hand: w('<path d="M8 13V5a1.5 1.5 0 013 0v6M11 11V4a1.5 1.5 0 013 0v7M14 11V5.5a1.5 1.5 0 013 0V14a7 7 0 01-7 7h-1a6 6 0 01-5-3l-2-4a1.5 1.5 0 012.6-1.5L8 15"/>'),
    bolt: w('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
    map: w('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>')
  };
})();

/* ---------- lifecycle: anything started on a slide is stopped when leaving it ---------- */
LS.life = (() => {
  let loops = [], timers = [], cleanups = [];
  return {
    loop(fn) {
      const h = { on: true, id: 0 };
      let last = performance.now();
      const step = (t) => {
        if (!h.on) return;
        const dt = Math.min(.05, (t - last) / 1000); last = t;
        if (fn(t / 1000, dt) === false) { h.on = false; return; }
        h.id = requestAnimationFrame(step);
      };
      h.id = requestAnimationFrame(step);
      loops.push(h);
      return () => { h.on = false; cancelAnimationFrame(h.id); };
    },
    later(fn, ms) { const id = setTimeout(fn, ms); timers.push(id); return id; },
    every(fn, ms) { const id = setInterval(fn, ms); timers.push(id); return id; },
    onCleanup(fn) { cleanups.push(fn); },
    clear() {
      loops.forEach(h => { h.on = false; cancelAnimationFrame(h.id); });
      timers.forEach(id => { clearTimeout(id); clearInterval(id); });
      cleanups.forEach(fn => { try { fn(); } catch (e) { console.warn(e); } });
      loops = []; timers = []; cleanups = [];
    }
  };
})();

/* ---------- small DOM helpers ---------- */
LS.$ = (sel, root = document) => root.querySelector(sel);
LS.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
LS.h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
LS.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
LS.clamp = (v, a, b) => Math.max(a, Math.min(b, v));

LS.act = {};

/* feedback box */
LS.act.feedback = (el, kind, html) => {
  if (!el) return;
  el.classList.remove('good', 'bad', 'info');
  el.classList.add('feedback', 'show', kind);
  el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  el.innerHTML = `<span class="fb-icon">${kind === 'good' ? '✓' : kind === 'bad' ? '!' : 'i'}</span><div>${html}</div>`;
};

/* ---------- multiple choice ----------
   cfg: { options:[{t, img, ok, fb}], key, stars, onCorrect, feedbackEl, cols } */
LS.act.mcq = (root, cfg) => {
  const opts = cfg.options;
  root.innerHTML = `<div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}">${o.img ? `<img src="${o.img}" alt="">` : ''}<span>${o.t}</span></button>`).join('')}</div>${cfg.feedbackEl ? '' : '<div class="feedback"></div>'}`;
  const fb = cfg.feedbackEl || LS.$('.feedback', root);
  let solved = false;
  const done = LS.store && cfg.key && LS.store.isDone(cfg.key);
  LS.$$('.opt', root).forEach(btn => btn.addEventListener('click', () => {
    if (solved) return;
    const o = opts[+btn.dataset.i];
    if (o.ok) {
      solved = true;
      btn.classList.add('correct');
      LS.$$('.opt', root).forEach(b => b.classList.add('locked'));
      LS.act.feedback(fb, 'good', o.fb || 'Correct!');
      LS.audio.ui.correct();
      if (cfg.key) LS.award(cfg.key, cfg.stars ?? 1);
      cfg.onCorrect && cfg.onCorrect(o);
    } else {
      btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
      LS.act.feedback(fb, 'bad', (o.fb || 'Not quite.') + ' <span class="muted">Try again!</span>');
      LS.audio.ui.wrong();
      cfg.onWrong && cfg.onWrong(o);
    }
  }));
  if (done && cfg.showSolvedOnReturn !== false) {
    // returning to a slide: show the solved state again
    const i = opts.findIndex(o => o.ok);
    const btn = LS.$(`.opt[data-i="${i}"]`, root);
    solved = true; btn.classList.add('correct');
    LS.$$('.opt', root).forEach(b => b.classList.add('locked'));
    LS.act.feedback(fb, 'good', opts[i].fb || 'Correct!');
    cfg.onCorrect && cfg.onCorrect(opts[i], true);
  }
  return { get solved() { return solved; } };
};

/* ---------- click-to-reveal cards ---------- */
LS.act.reveals = (root, { key, onAll } = {}) => {
  const cards = LS.$$('.reveal-card', root);
  const check = () => {
    if (cards.every(c => c.classList.contains('open'))) {
      if (key) LS.award(key, 1);
      onAll && onAll();
    }
  };
  cards.forEach(c => c.addEventListener('click', () => {
    if (c.classList.contains('open')) return;
    c.classList.add('open'); LS.audio.ui.click(); check();
  }));
  return { openAll() { cards.forEach(c => c.classList.add('open')); check(); } };
};

/* ---------- one-at-a-time instructions ---------- */
LS.act.instructions = (root, steps, { onStep, onDone } = {}) => {
  let i = 0;
  root.innerHTML = `<div class="instr">
    <div class="instr-step"><div class="instr-num">1</div><div class="instr-text"></div></div>
    <div class="instr-ctrl"><div class="instr-dots">${steps.map(() => '<i></i>').join('')}</div>
      <button class="btn btn-ghost btn-sm" data-a="back">${LS.icons.prev} Back</button>
      <button class="btn btn-sm" data-a="next">Next step ${LS.icons.next}</button></div></div>`;
  const num = LS.$('.instr-num', root), txt = LS.$('.instr-text', root), dots = LS.$$('.instr-dots i', root);
  const back = LS.$('[data-a=back]', root), next = LS.$('[data-a=next]', root);
  const draw = () => {
    num.textContent = i + 1;
    txt.innerHTML = steps[i];
    txt.parentElement.style.animation = 'none'; void txt.offsetWidth; txt.parentElement.style.animation = 'popIn .35s ease';
    dots.forEach((d, k) => d.classList.toggle('on', k <= i));
    back.disabled = i === 0;
    next.innerHTML = i === steps.length - 1 ? `Done ${LS.icons.check}` : `Next step ${LS.icons.next}`;
    onStep && onStep(i);
  };
  back.onclick = () => { if (i > 0) { i--; draw(); LS.audio.ui.click(); } };
  next.onclick = () => {
    LS.audio.ui.click();
    if (i < steps.length - 1) { i++; draw(); } else { onDone && onDone(); next.disabled = true; next.innerHTML = `All done! ${LS.icons.check}`; }
  };
  draw();
};

/* ---------- step list highlighter (diagram steps) ---------- */
LS.act.stepList = (listEl, { onStep, auto = 2600 } = {}) => {
  const items = LS.$$('li', listEl);
  let cur = -1, timer = null;
  const go = (k) => {
    cur = LS.clamp(k, 0, items.length - 1);
    items.forEach((li, j) => { li.classList.toggle('active', j === cur); li.classList.toggle('done', j < cur); });
    onStep && onStep(cur);
  };
  items.forEach((li, j) => { li.style.cursor = 'pointer'; li.addEventListener('click', () => { stop(); go(j); LS.audio.ui.click(); }); });
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const play = () => {
    stop(); go(0);
    timer = setInterval(() => { if (cur >= items.length - 1) { stop(); items[cur].classList.add('done'); onStep && onStep(cur, true); return; } go(cur + 1); }, auto);
    LS.life.onCleanup(stop);
  };
  return { go, play, stop, get current() { return cur; } };
};

/* ---------- drag & drop sorting (pointer events, works with touch) ----------
   Also supports click-to-select then click-a-bin. */
LS.act.dragSort = ({ items, bins, check, onPlaced }) => {
  let selected = null;
  const select = (it) => { items.forEach(i => i.classList.toggle('selected', i === it)); selected = it; };
  const tryDrop = (it, bin) => {
    const res = check(it, bin);
    if (res.ok) {
      it.style.transform = '';
      LS.$('.bin-slot', bin).appendChild(it);
      it.classList.add('placed'); it.classList.remove('selected');
      selected = null;
      LS.audio.ui.correct();
    } else {
      it.style.transition = 'transform .35s'; it.style.transform = '';
      setTimeout(() => { it.style.transition = ''; }, 360);
      it.classList.remove('wrong'); void it.offsetWidth; it.classList.add('wrong');
      select(null);
      LS.audio.ui.wrong();
    }
    onPlaced && onPlaced(it, bin, res);
  };
  items.forEach(it => {
    let sx = 0, sy = 0, dragging = false, moved = false;
    it.addEventListener('pointerdown', (e) => {
      if (it.classList.contains('placed')) return;
      dragging = true; moved = false; sx = e.clientX; sy = e.clientY;
      try { it.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
      it.classList.add('dragging');
    });
    it.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = (e.clientX - sx) / LS.scale, dy = (e.clientY - sy) / LS.scale;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      it.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * .03}deg)`;
      bins.forEach(b => { const r = b.getBoundingClientRect(); b.classList.toggle('over', e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom); });
    });
    const end = (e) => {
      if (!dragging) return;
      dragging = false; it.classList.remove('dragging');
      bins.forEach(b => b.classList.remove('over'));
      if (!moved) { it.style.transform = ''; select(selected === it ? null : it); LS.audio.ui.click(); return; }
      const bin = bins.find(b => { const r = b.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; });
      if (bin) tryDrop(it, bin);
      else { it.style.transition = 'transform .3s'; it.style.transform = ''; setTimeout(() => { it.style.transition = ''; }, 320); }
    };
    it.addEventListener('pointerup', end);
    it.addEventListener('pointercancel', end);
  });
  bins.forEach(b => b.addEventListener('click', (e) => { if (selected && !e.target.closest('.sort-item.placed')) tryDrop(selected, b); }));
};

/* ---------- crisp canvas sized in stage pixels ---------- */
LS.act.canvas = (cv) => {
  const w = cv.clientWidth || +cv.getAttribute('width'), h = cv.clientHeight || +cv.getAttribute('height');
  const dpr = Math.min(3, (window.devicePixelRatio || 1) * Math.max(1, LS.scale || 1));
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { c, w, h };
};

/* ---------- maths: reflect a direction off a mirror at angle (deg) ---------- */
LS.act.reflect = (dx, dy, mirrorDeg) => {
  const a = mirrorDeg * Math.PI / 180;
  // mirror surface direction (cos a, sin a); normal pointing "up" (sin a, -cos a)
  const nx = Math.sin(a), ny = -Math.cos(a);
  const d = dx * nx + dy * ny;
  return { x: dx - 2 * d * nx, y: dy - 2 * d * ny, nx, ny };
};

/* ---------- vibrating ruler simulation (slides 9 & 16) ----------
   host: element to fill. opts: { overhang (cm), onRelease(L,f), onStop(), onMove(state) } */
LS.act.rulerSim = (host, opts = {}) => {
  const PX = 15, DESK_X = 360, Y0 = 186, TH = 14, TOTAL = 30;
  host.innerHTML = `<svg class="sim-svg ruler-svg" viewBox="0 0 760 360" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="deskTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98B4E"/><stop offset="1" stop-color="#8E5A2B"/></linearGradient>
      <linearGradient id="rul" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A6"/><stop offset="1" stop-color="#F2B53A"/></linearGradient>
    </defs>
    <g class="waves"></g>
    <path class="ghost" fill="rgba(255,215,106,.18)"/>
    <rect x="0" y="${Y0 + TH}" width="${DESK_X}" height="26" rx="4" fill="url(#deskTop)"/>
    <rect x="20" y="${Y0 + TH + 26}" width="${DESK_X - 60}" height="140" fill="#5E3A1A" opacity=".55"/>
    <rect x="30" y="${Y0 + TH + 26}" width="22" height="140" fill="#6B4320"/><rect x="${DESK_X - 60}" y="${Y0 + TH + 26}" width="22" height="140" fill="#6B4320"/>
    <path class="ruler" fill="url(#rul)" stroke="#C8891A" stroke-width="2"/>
    <g class="ticks" stroke="#8C5A0A" stroke-width="2"></g>
    <g class="hand" transform="translate(${DESK_X - 110},${Y0 - 50})">
      <path d="M0 50 Q-6 20 18 14 L60 10 Q78 10 78 26 L78 50 Z" fill="#F1B48A" stroke="#C47A4E" stroke-width="3"/>
      <path d="M22 16 L22 40 M40 12 L40 40 M58 12 L58 40" stroke="#C47A4E" stroke-width="3" stroke-linecap="round"/>
    </g>
    <text class="len-label" x="0" y="${Y0 - 26}" fill="#53E6DF" font-size="20" text-anchor="middle"></text>
    <line class="len-line" stroke="#53E6DF" stroke-width="3" stroke-dasharray="6 5"/>
    <circle class="grab" r="20" fill="rgba(83,230,223,.25)" stroke="#53E6DF" stroke-width="3"/>
    <text class="grab-hint" font-size="17" fill="#fff" text-anchor="middle">Pull me down!</text>
  </svg>`;
  const svg = LS.$('svg', host);
  const rulerEl = LS.$('.ruler', svg), ghost = LS.$('.ghost', svg), ticks = LS.$('.ticks', svg), waves = LS.$('.waves', svg);
  const grab = LS.$('.grab', svg), hint = LS.$('.grab-hint', svg), lenLabel = LS.$('.len-label', svg), lenLine = LS.$('.len-line', svg);
  let L = opts.overhang || 15, A = 0, A0 = 0, t0 = 0, vibrating = false, dragging = false, lastWave = 0, stopVib = null;

  const freqFor = (len) => 900 * Math.pow(10 / len, 1.4);
  const visFreq = (len) => 4 + 10 * Math.pow(8 / len, 1.5);
  const shape = (s) => s * s * (3 - s) / 2;
  const yAt = (x, amp) => x <= DESK_X ? Y0 : Y0 + amp * shape((x - DESK_X) / (L * PX));

  function pathFor(amp) {
    const x0 = DESK_X - (TOTAL - L) * PX, x1 = DESK_X + L * PX;
    const top = [], bot = [];
    top.push([x0, Y0]);
    for (let i = 0; i <= 24; i++) { const x = DESK_X + (x1 - DESK_X) * i / 24; top.push([x, yAt(x, amp)]); }
    for (let i = top.length - 1; i >= 0; i--) bot.push([top[i][0], top[i][1] + TH]);
    return 'M' + top.concat(bot).map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + 'Z';
  }
  function draw() {
    rulerEl.setAttribute('d', pathFor(A));
    const x0 = DESK_X - (TOTAL - L) * PX;
    let tk = '';
    for (let cm = 0; cm <= TOTAL; cm++) {
      const x = x0 + cm * PX, y = yAt(x, A);
      tk += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + (cm % 5 === 0 ? 9 : 5)}"/>`;
    }
    ticks.innerHTML = tk;
    const tipX = DESK_X + L * PX, tipY = yAt(tipX, A) + TH / 2;
    grab.setAttribute('cx', tipX); grab.setAttribute('cy', tipY);
    hint.setAttribute('x', Math.min(tipX, 690)); hint.setAttribute('y', tipY + 46);
    hint.style.display = vibrating || dragging ? 'none' : '';
    grab.style.display = vibrating ? 'none' : '';
    lenLine.setAttribute('x1', DESK_X); lenLine.setAttribute('x2', tipX); lenLine.setAttribute('y1', Y0 - 14); lenLine.setAttribute('y2', Y0 - 14);
    lenLabel.setAttribute('x', (DESK_X + tipX) / 2); lenLabel.textContent = `${Math.round(L)} cm overhang`;
    if (vibrating && A0 > 0) {
      const env = Math.abs(A0) * Math.exp(-(performance.now() / 1000 - t0) / 1.1);
      ghost.setAttribute('d', `M${DESK_X} ${Y0} ` + Array.from({ length: 25 }, (_, i) => { const x = DESK_X + L * PX * i / 24; return `L${x} ${yAt(x, -env)}`; }).join(' ') + ' ' + Array.from({ length: 25 }, (_, i) => { const x = DESK_X + L * PX * (24 - i) / 24; return `L${x} ${yAt(x, env) + TH}`; }).join(' ') + 'Z');
    } else ghost.setAttribute('d', '');
  }
  function emitWave(strength) {
    const tipX = DESK_X + L * PX * .8;
    const w = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    w.setAttribute('cx', tipX); w.setAttribute('cy', Y0 + 6); w.setAttribute('r', 30);
    w.setAttribute('fill', 'none'); w.setAttribute('stroke', '#53E6DF'); w.setAttribute('stroke-width', 3);
    w.style.opacity = strength; w.style.transformOrigin = `${tipX}px ${Y0 + 6}px`;
    w.style.animation = 'waveOut 1s ease-out forwards';
    waves.appendChild(w);
    setTimeout(() => w.remove(), 1000);
  }
  function release(amp) {
    A0 = amp; t0 = performance.now() / 1000; vibrating = true;
    const f = freqFor(L);
    LS.audio.twang(f, 2.4, LS.clamp(Math.abs(amp) / 60, .15, .5));
    opts.onRelease && opts.onRelease(L, f);
    const fv = visFreq(L);
    if (stopVib) stopVib();
    stopVib = LS.life.loop((t) => {
      const el = t - t0, env = A0 * Math.exp(-el / 1.1);
      A = env * Math.cos(2 * Math.PI * fv * el);
      if (t - lastWave > .22 && Math.abs(env) > 4) { lastWave = t; emitWave(LS.clamp(Math.abs(env) / 50, .15, 1)); }
      draw();
      opts.onMove && opts.onMove({ vibrating: true, amp: Math.abs(env) });
      if (Math.abs(env) < .6) { A = 0; vibrating = false; draw(); opts.onMove && opts.onMove({ vibrating: false, amp: 0 }); opts.onStop && opts.onStop(); return false; }
    });
  }
  // dragging the tip
  const toSvg = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  const startDrag = (e) => { if (vibrating) return; dragging = true; try { svg.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } e.preventDefault(); };
  grab.addEventListener('pointerdown', startDrag); rulerEl.addEventListener('pointerdown', (e) => { if (toSvg(e).x > DESK_X + 10) startDrag(e); });
  svg.addEventListener('pointermove', (e) => { if (!dragging) return; const p = toSvg(e); A = LS.clamp((p.y - Y0) * 1.1, -55, 60); draw(); });
  const stopDrag = () => { if (!dragging) return; dragging = false; if (Math.abs(A) > 6) release(A); else { A = 0; draw(); } };
  svg.addEventListener('pointerup', stopDrag); svg.addEventListener('pointercancel', stopDrag);
  grab.style.cursor = 'grab'; rulerEl.style.cursor = 'grab';
  draw();

  return {
    setOverhang(cm) { if (vibrating) { stopVib && stopVib(); LS.audio.stopAll(); vibrating = false; A = 0; opts.onMove && opts.onMove({ vibrating: false, amp: 0 }); } L = LS.clamp(cm, 6, 28); draw(); },
    get overhang() { return L; },
    get vibrating() { return vibrating; },
    pluck(amp = 45) { if (!vibrating) release(amp); },
    freqFor, pitchName: (len) => { const f = freqFor(len); return f >= 650 ? 'High' : f >= 330 ? 'Medium' : 'Low'; }
  };
};

/* ---------- particle medium (slides 10 & 11) ----------
   opts: { layout:'grid'|'gas'|'liquid'|'solid'|'none', x0, x1, top, bottom, amp, speed, fv, pulse, highlight, onArrive, dot, color } */
LS.act.particles = (cv, opts) => {
  const { c, w, h } = LS.act.canvas(cv);
  const o = Object.assign({ layout: 'grid', x0: 70, x1: w - 70, top: 20, bottom: h - 20, amp: 7, speed: 160, fv: 2.4, pulse: false, highlight: false, dot: 6, color: '#45B8FF' }, opts);
  const pts = [];
  const rnd = (() => { let s = 7; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })();
  if (o.layout === 'grid') {
    const cols = o.cols || 26, rows = o.rows || 7;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) pts.push({ x: o.x0 + (o.x1 - o.x0) * i / (cols - 1), y: o.top + (o.bottom - o.top) * j / (rows - 1) + (i % 2 ? 6 : -6) * (j % 2) });
  } else if (o.layout !== 'none') {
    const gap = { gas: 30, liquid: 17, solid: 14 }[o.layout];
    for (let x = o.x0; x <= o.x1; x += gap) for (let y = o.top; y <= o.bottom; y += gap) {
      const j = o.layout === 'gas' ? 12 : o.layout === 'liquid' ? 4 : 0;
      pts.push({ x: x + (rnd() - .5) * j * 2, y: y + (rnd() - .5) * j * 2 });
    }
  }
  let hi = null;
  if (o.highlight && pts.length) { const mid = (o.x0 + o.x1) / 2; hi = pts.reduce((b, p) => Math.abs(p.x - mid) + Math.abs(p.y - (o.top + o.bottom) / 2) < Math.abs(b.x - mid) + Math.abs(b.y - (o.top + o.bottom) / 2) ? p : b, pts[0]); }
  let running = false, t0 = 0, arrived = false, stopLoop = null, offAt = Infinity;
  const omega = 2 * Math.PI * o.fv;
  function disp(p, t) {
    const delay = (p.x - o.x0) / o.speed;
    const tl = t - t0 - delay;
    if (tl < 0) return 0;
    if (o.pulse) { const P = o.pulseLen || 1.2; if (tl > P) return 0; return o.amp * Math.sin(Math.PI * tl / P) * Math.sin(omega * tl); }
    const offL = t - offAt - delay; if (offL > 0) return 0;
    return o.amp * Math.sin(omega * tl);
  }
  function frame(t) {
    c.clearRect(0, 0, w, h);
    pts.forEach(p => {
      const dx = running ? disp(p, t) : 0;
      c.beginPath();
      c.arc(p.x + dx, p.y, o.dot, 0, Math.PI * 2);
      const energy = Math.abs(dx) / o.amp;
      c.fillStyle = p === hi ? '#FF8B80' : o.color;
      c.globalAlpha = p === hi ? 1 : .55 + .45 * energy;
      c.fill();
    });
    c.globalAlpha = 1;
    if (hi) {
      c.strokeStyle = '#FF8B80'; c.lineWidth = 2; c.setLineDash([4, 4]);
      c.beginPath(); c.arc(hi.x, hi.y, o.dot + 6, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    }
    if (running && !arrived && t - t0 > (o.x1 - o.x0) / o.speed) { arrived = true; o.onArrive && o.onArrive(); }
    if (running && o.pulse && t - t0 > (o.x1 - o.x0) / o.speed + (o.pulseLen || 1.2) + .1) { running = false; o.onEnd && o.onEnd(); }
  }
  frame(0);
  return {
    start() { running = true; arrived = false; offAt = Infinity; t0 = performance.now() / 1000; if (!stopLoop) stopLoop = LS.life.loop((t) => frame(t)); },
    stop() { offAt = performance.now() / 1000; LS.life.later(() => { running = false; }, ((o.x1 - o.x0) / o.speed + .3) * 1000); },
    halt() { running = false; frame(0); },
    get running() { return running; },
    source(t) { return running ? (o.pulse ? (t - t0 < (o.pulseLen || 1.2) ? Math.sin(omega * (t - t0)) : 0) : (t < offAt ? Math.sin(omega * (t - t0)) : 0)) : 0; }
  };
};
