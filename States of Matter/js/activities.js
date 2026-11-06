/* ------------------------------------------------------------------
   Shared activity tools: drag and drop (mouse, touch, keyboard), right and
   wrong feedback, animation timing, particle tanks and thermometers.
------------------------------------------------------------------- */
(function () {

  SM.stageScale = () => (SM.ui && SM.ui.scale) || 1;

  /* ---------- Right / wrong feedback ---------- */
  SM.good = function (el, opts) {
    if (el) {
      el.classList.remove('fx-good');
      void el.offsetWidth;
      el.classList.add('fx-good');
    }
    if (!opts || !opts.quiet) SM.sound('good');
  };
  SM.bad = function (el) {
    if (el) {
      el.classList.remove('fx-shake');
      void el.offsetWidth;
      el.classList.add('fx-shake');
      setTimeout(() => el.classList.remove('fx-shake'), 650);
    }
    SM.sound('bad');
  };
  /* A message line under an activity. kind is good, hint or info. */
  SM.note = function (el, kind, html) {
    if (!el) return;
    el.className = el.className.replace(/\bnote-\w+/g, '').trim() + ' note-' + kind;
    el.innerHTML = html;
    el.classList.remove('note-in');
    void el.offsetWidth;
    el.classList.add('note-in');
  };

  /* ---------- Time-based animation that stops when the slide is left ---------- */
  SM.animate = function (ctx, ms, fn) {
    return new Promise(resolve => {
      const start = performance.now();
      const step = now => {
        if (ctx.dead) return;
        const t = Math.min(1, (now - start) / ms);
        fn(t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, t);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  };
  SM.wait = (ctx, ms) => new Promise(res => ctx.after(ms, res));
  SM.lerp = (a, b, t) => a + (b - a) * t;
  SM.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  SM.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /* ---------- Drag kit ----------
     Items carry [data-drag]; targets carry [data-slot]. There are three ways
     to play:
       1. Press and drag with a mouse or finger.
       2. Tap an item, then tap a target.
       3. Tab to an item, press Enter, then tab to a target and press Enter.
     Items with the class .locked cannot move. */
  SM.dragKit = function (ctx, opts) {
    const root = opts.root;
    const host = root.closest('.slide') || root;
    let drag = null;
    let selected = null;
    let swallowClick = false;

    const slotAt = (x, y) => {
      const el = document.elementFromPoint(x, y);
      const s = el && el.closest('[data-slot]');
      return s && root.contains(s) && !s.classList.contains('slot-off') ? s : null;
    };
    const select = el => {
      if (selected) selected.classList.remove('is-selected');
      selected = el;
      if (el) el.classList.add('is-selected');
      root.classList.toggle('has-selection', !!el);
    };
    const drop = (item, slot) => {
      select(null);
      opts.onDrop(item, slot);
    };

    ctx.on(root, 'pointerdown', e => {
      if (e.button !== undefined && e.button > 0) return;
      const item = e.target.closest('[data-drag]');
      if (!item || item.classList.contains('locked') || !root.contains(item)) return;
      if (opts.only && !opts.only(item)) return;
      drag = { item, id: e.pointerId, sx: e.clientX, sy: e.clientY, active: false };
      try { item.setPointerCapture(e.pointerId); } catch (err) { /* no capture available */ }
    });

    ctx.on(window, 'pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.active) {
        if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
        drag.active = true;
        select(null);
        const r = drag.item.getBoundingClientRect();
        const scale = SM.stageScale();
        const ghost = drag.item.cloneNode(true);
        ghost.classList.add('drag-ghost');
        ghost.removeAttribute('data-drag');
        ghost.removeAttribute('id');
        ghost.style.width = drag.item.offsetWidth + 'px';
        ghost.style.height = drag.item.offsetHeight + 'px';
        host.appendChild(ghost);
        drag.ghost = ghost;
        drag.dx = (e.clientX - r.left) / scale;
        drag.dy = (e.clientY - r.top) / scale;
        drag.item.classList.add('drag-source');
        root.classList.add('is-dragging');
        SM.sound('click');
      }
      const hr = host.getBoundingClientRect();
      const scale = SM.stageScale();
      drag.ghost.style.left = (e.clientX - hr.left) / scale - drag.dx + 'px';
      drag.ghost.style.top = (e.clientY - hr.top) / scale - drag.dy + 'px';
      const over = slotAt(e.clientX, e.clientY);
      if (drag.over !== over) {
        if (drag.over) drag.over.classList.remove('slot-over');
        if (over) over.classList.add('slot-over');
        drag.over = over;
      }
      /* On phones the page can scroll, so dragging near an edge scrolls it. */
      const scroller = host.querySelector('.slide-inner');
      if (scroller && scroller.scrollHeight > scroller.clientHeight) {
        const sr = scroller.getBoundingClientRect();
        if (e.clientY < sr.top + 50) scroller.scrollTop -= 10;
        else if (e.clientY > sr.bottom - 50) scroller.scrollTop += 10;
      }
      e.preventDefault();
    }, { passive: false });

    const finish = (e, cancelled) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      if (!d.active) return;
      swallowClick = true;
      setTimeout(() => { swallowClick = false; }, 60);
      if (d.over) d.over.classList.remove('slot-over');
      root.classList.remove('is-dragging');
      const slot = cancelled ? null : slotAt(e.clientX, e.clientY);
      d.ghost.remove();
      d.item.classList.remove('drag-source');
      if (slot) drop(d.item, slot);
    };
    ctx.on(window, 'pointerup', e => finish(e, false));
    ctx.on(window, 'pointercancel', e => finish(e, true));

    ctx.on(root, 'click', e => {
      if (swallowClick || opts.noTap) return;
      const item = e.target.closest('[data-drag]');
      if (item && opts.only && !opts.only(item)) return;
      if (item && !item.classList.contains('locked') && !(selected && item.closest('[data-slot]') && selected !== item)) {
        select(selected === item ? null : item);
        SM.sound('click');
        return;
      }
      const slot = e.target.closest('[data-slot]');
      if (slot && selected) drop(selected, slot);
    });
    ctx.on(root, 'keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const slot = e.target.closest('[data-slot]');
      if (slot && slot === e.target && selected) {
        e.preventDefault();
        drop(selected, slot);
      }
    });
    return { select };
  };

  /* ---------- Sorting game built on the drag kit ----------
     Wrong drops bounce back and show a hint; right drops lock into place.
     Reports the mistake count so first-try bonuses are fair. */
  SM.sortGame = function (ctx, o) {
    let misses = 0;
    const total = o.root.querySelectorAll('[data-drag]').length;
    let placed = 0;
    SM.dragKit(ctx, {
      root: o.root,
      only: o.only,
      onDrop(item, slot) {
        const cap = slot.dataset.cap ? +slot.dataset.cap : 1;
        const full = slot.querySelectorAll('.locked').length >= cap;
        if (!full && o.correct(item, slot)) {
          item.classList.add('locked');
          item.removeAttribute('tabindex');
          item.setAttribute('aria-disabled', 'true');
          (slot.querySelector('.slot-fill') || slot).appendChild(item);
          slot.classList.add('slot-has');
          placed++;
          SM.good(item);
          if (o.onRight) o.onRight(item, slot);
          if (placed === total && o.onDone) ctx.after(350, () => o.onDone(misses));
        } else if (full) {
          SM.bad(slot);
        } else {
          misses++;
          SM.bad(item);
          SM.bad(slot);
          if (o.onWrong) o.onWrong(item, slot);
        }
      }
    });
    return { misses: () => misses };
  };

  /* ---------- Particle tank ----------
     A small simulation that shows how particles behave in each state:
       solid   vibrate on the spot in tidy rows
       liquid  stay close but slide around each other
       gas     fly freely and fill the whole space */
  const spriteCache = {};
  function sprite(col, r) {
    const key = col + r;
    if (spriteCache[key]) return spriteCache[key];
    const d = Math.ceil(r * 2 * 2);
    const c = document.createElement('canvas');
    c.width = c.height = d + 4;
    const g = c.getContext('2d');
    const m = d / 2 + 2;
    const grad = g.createRadialGradient(m - d * .15, m - d * .18, d * .05, m, m, d / 2);
    const cols = { blue: ['#E0F7FF', '#38BDF8', '#0369A1'], teal: ['#D5FFF8', '#2DD4BF', '#0F766E'], lav: ['#F3EDFF', '#A78BFA', '#5B34C4'], water: ['#F0FBFF', '#7DD3FC', '#0284C7'] }[col];
    grad.addColorStop(0, cols[0]);
    grad.addColorStop(.5, cols[1]);
    grad.addColorStop(1, cols[2]);
    g.fillStyle = grad;
    g.beginPath();
    g.arc(m, m, d / 2, 0, Math.PI * 2);
    g.fill();
    return (spriteCache[key] = c);
  }

  SM.Tank = function (canvas, cfg) {
    const g = canvas.getContext('2d');
    const self = { state: cfg.state, col: cfg.col || 'blue', r: cfg.r || 10, n: cfg.n || 16, p: [], speed: cfg.speed || 1, on: true, cols: cfg.cols || 0, center: !!cfg.center };
    let W = 0, H = 0, tt = 0;

    function lattice() {
      const gap = self.r * 2.08;
      const cols = self.cols || Math.max(1, Math.floor((W - 12) / gap));
      const rows = Math.ceil(self.n / cols);
      const ox = (W - (cols - 1) * gap) / 2;
      const base = self.center ? (H + (rows - 1) * gap) / 2 : H - self.r - 5;
      return i => ({ x: ox + (i % cols) * gap, y: base - Math.floor(i / cols) * gap });
    }
    function seed() {
      self.p = [];
      const at = lattice();
      for (let i = 0; i < self.n; i++) {
        const home = at(i);
        const a = Math.random() * 6.28;
        const v = self.state === 'gas' ? 1.6 * self.speed : 0;
        self.p.push({
          x: self.state === 'solid' ? home.x : self.r + Math.random() * (W - 2 * self.r),
          y: self.state === 'solid' ? home.y : (self.state === 'liquid' ? H * .5 + Math.random() * H * .45 : self.r + Math.random() * (H - 2 * self.r)),
          vx: Math.cos(a) * v, vy: Math.sin(a) * v, ph: Math.random() * 6.28, home
        });
      }
    }
    function size() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return false;
      if (w !== W || h !== H) {
        W = w; H = h;
        const d = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = W * d;
        canvas.height = H * d;
        g.setTransform(d, 0, 0, d, 0, 0);
        seed();
      }
      return true;
    }
    self.setState = function (s) {
      self.state = s;
      const at = lattice();
      self.p.forEach((q, i) => {
        q.home = at(i);
        if (s === 'gas') {
          const a = Math.random() * 6.28;
          q.vx = Math.cos(a) * 1.8 * self.speed;
          q.vy = Math.sin(a) * 1.8 * self.speed;
        }
      });
    };
    self.step = function () {
      if (!self.on || !size()) return;
      if (self.p.length !== self.n) seed();
      tt += .1;
      const r = self.r, P = self.p;
      if (self.state === 'solid') {
        P.forEach(q => {
          q.x += (q.home.x + Math.sin(tt * 1.7 + q.ph) * 1.5 - q.x) * .25;
          q.y += (q.home.y + Math.cos(tt * 1.3 + q.ph) * 1.5 - q.y) * .25;
        });
      } else if (self.state === 'liquid') {
        P.forEach(q => {
          q.vy += .16;
          q.vx += (Math.random() - .5) * .34;
          q.vy += (Math.random() - .5) * .1;
        });
        for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
          const a = P[i], b = P[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || .01;
          const min = r * 2.02;
          if (d < min) {
            const push = (min - d) / 2;
            const nx = dx / d, ny = dy / d;
            a.x -= nx * push; a.y -= ny * push;
            b.x += nx * push; b.y += ny * push;
            a.vx -= nx * .05; a.vy -= ny * .05;
            b.vx += nx * .05; b.vy += ny * .05;
          }
        }
        P.forEach(q => {
          q.vx *= .95;
          q.vy *= .95;
          q.x += q.vx;
          q.y += q.vy;
          if (q.x < r) { q.x = r; q.vx *= -.5; }
          if (q.x > W - r) { q.x = W - r; q.vx *= -.5; }
          if (q.y > H - r - 2) { q.y = H - r - 2; q.vy *= -.2; }
          if (q.y < r) { q.y = r; q.vy = 0; }
        });
      } else {
        P.forEach(q => {
          const sp = Math.hypot(q.vx, q.vy) || 1;
          const want = 1.9 * self.speed;
          q.vx += (q.vx / sp) * (want - sp) * .1;
          q.vy += (q.vy / sp) * (want - sp) * .1;
          q.x += q.vx;
          q.y += q.vy;
          if (q.x < r) { q.x = r; q.vx = Math.abs(q.vx); }
          if (q.x > W - r) { q.x = W - r; q.vx = -Math.abs(q.vx); }
          if (q.y < r) { q.y = r; q.vy = Math.abs(q.vy); }
          if (q.y > H - r) { q.y = H - r; q.vy = -Math.abs(q.vy); }
        });
      }
    };
    self.draw = function () {
      if (!W) return;
      g.clearRect(0, 0, W, H);
      const sp = sprite(self.col, self.r);
      const size2 = self.r * 2;
      self.p.forEach(q => g.drawImage(sp, q.x - self.r, q.y - self.r, size2, size2));
    };
    self.tick = function () {
      self.step();
      self.draw();
    };
    return self;
  };

  /* ---------- Thermometer ---------- */
  let thermoId = 0;
  const TH = { min: -20, max: 110, top: 34, bottom: 400, x: 44, w: 18 };
  const thY = v => TH.bottom - (v - TH.min) / (TH.max - TH.min) * (TH.bottom - TH.top);
  SM.thermoY = thY;

  SM.thermoSvg = function (value, opts) {
    opts = opts || {};
    const id = 'thc' + (++thermoId);
    let ticks = '';
    for (let v = TH.min; v <= TH.max; v += 5) {
      const y = thY(v);
      const major = v % 10 === 0;
      ticks += `<path d="M66 ${y}h${major ? 18 : 9}" stroke="#172554" stroke-width="${major ? 2.6 : 1.6}"/>`;
      if (major) ticks += `<text x="88" y="${y + 5.5}" font-size="15.5" font-weight="800" fill="#172554" font-family="Nunito, sans-serif">${v}</text>`;
    }
    const start = opts.start !== undefined ? opts.start : value;
    return `<svg viewBox="0 0 132 462" class="thermo" role="img" aria-label="${opts.label || 'Thermometer'}" data-value="${value}">
      <defs><clipPath id="${id}"><rect x="${TH.x}" y="14" width="${TH.w}" height="420" rx="9"/></clipPath></defs>
      <rect x="24" y="4" width="104" height="454" rx="26" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="3"/>
      <text x="92" y="24" font-size="15" font-weight="800" fill="#475569" font-family="Nunito, sans-serif">°C</text>
      <rect x="${TH.x}" y="14" width="${TH.w}" height="420" rx="9" fill="#E2E8F0"/>
      ${ticks}
      <g clip-path="url(#${id})"><rect class="th-col" x="${TH.x}" y="0" width="${TH.w}" height="470" fill="#E11D48" style="transform:translateY(${thY(start)}px)"/></g>
      <circle cx="${TH.x + TH.w / 2}" cy="425" r="22" fill="url(#g-red)" stroke="#CBD5E1" stroke-width="3"/>
      <circle cx="${TH.x + TH.w / 2 - 7}" cy="418" r="5" fill="#fff" opacity=".6"/>
    </svg>`;
  };
  SM.setThermo = function (svgRoot, value) {
    const col = svgRoot.querySelector('.th-col');
    if (col) col.style.transform = `translateY(${thY(value)}px)`;
  };
})();
