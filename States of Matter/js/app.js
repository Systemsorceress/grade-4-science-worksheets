/* ------------------------------------------------------------------
   The app shell: stage scaling, HUD, navigation, slide lifecycle.
------------------------------------------------------------------- */
(function () {
  const G = SM.game;
  const hud = document.getElementById('hud');
  const nav = document.getElementById('nav');
  const host = document.getElementById('slide-host');
  const stage = document.getElementById('stage');
  const sayLayer = document.getElementById('say-layer');
  let currentCtx = null;
  let currentEl = null;
  let cur = 0;

  /* ---------- Stage: 16:9 on big screens, reflowing on small ones ---------- */
  function layout() {
    const w = document.documentElement.clientWidth;
    const h = window.innerHeight;
    const compact = w < 820 || w / h < 1.15;
    document.body.classList.toggle('compact', compact);
    if (compact) {
      stage.style.transform = '';
      stage.style.left = stage.style.top = '';
      SM.ui.scale = 1;
      return;
    }
    const s = Math.min(w / 1280, h / 720);
    SM.ui.scale = s;
    stage.style.transform = `scale(${s})`;
    stage.style.left = (w - 1280 * s) / 2 + 'px';
    stage.style.top = (h - 720 * s) / 2 + 'px';
  }

  /* ---------- HUD ---------- */
  function buildHud() {
    hud.innerHTML = `
      <button class="hud-mascot" id="hud-mascot" aria-label="Ask Dr Fizz for a tip">${SM.art('scientist_mascot', { alt: '' })}</button>
      <div class="hud-level"><small>Level <b id="hud-lvl">1</b></small><span id="hud-lvlname"></span></div>
      <div class="hud-mid">
        <div class="hud-mission"><span id="hud-mission"></span><span class="hud-acts" id="hud-acts"></span></div>
        <div class="hud-bar" role="progressbar" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="100" id="hud-barwrap"><i id="hud-bar"></i><b id="hud-pct">0%</b></div>
      </div>
      <div class="hud-stars" id="hud-stars" aria-label="Stars earned"><span id="hud-star-icon">${SM.starSvg()}</span><b id="hud-star-n">0</b></div>
      <div class="hud-badges" id="hud-badges"></div>`;
    document.getElementById('hud-mascot').addEventListener('click', () => {
      const s = SM.slides[cur];
      say(TIPS[s.id] || 'You are doing brilliantly!');
    });
  }

  const TIPS = {
    welcome: 'Tap all three mystery boxes, then press the big START button.',
    matter: 'Ask yourself: does it take up space? Does it have mass?',
    states: 'S stays in shape. L likes the container. G goes everywhere!',
    solids: 'Think about what happens to a block when you move it.',
    liquids: 'Watch the 200 ml sign while you pour.',
    gases: 'Sweep across every part of the room to help the gas spread.',
    particles: 'Tidy rows mean solid. Close and sliding means liquid. Far apart means gas.',
    tricky: 'Look at the tiny pieces, not just how the material pours.',
    change: 'Slide the dial slowly all the way to HEAT, then all the way back to COOL.',
    melt: 'Melting needs heat going in. Freezing needs heat coming out.',
    evap: 'Bubbles all through the liquid mean boiling.',
    condense: 'The vapour must reach the glass first, then cool, then form droplets.',
    map: 'Orange arrows heat things up. Blue arrows cool things down.',
    tools: 'Are you measuring heat, time or an amount?',
    temps: 'Find the nearest number below the red line, then count the small lines in 5s.',
    final: 'Press the big button when you are ready.',
    quiz: 'Read each question carefully. You can look at the pictures for clues.',
    certificate: 'Type your name, then save or print your certificate.'
  };

  function refreshHud() {
    const st = G.state;
    const s = SM.slides[cur];
    const lv = G.level();
    const pct = G.progress();
    document.getElementById('hud-lvl').textContent = lv.n;
    document.getElementById('hud-lvlname').textContent = lv.name;
    document.getElementById('hud-mission').innerHTML = `<small>Mission ${cur + 1}</small> ${s.short}`;
    document.getElementById('hud-acts').innerHTML = s.activities.map(a => {
      const done = G.activityDone(cur, a.id);
      return `<i class="hud-act ${done ? 'done' : ''}" title="${a.label}">${done ? SM.icons.check : ''}<span>${a.label}</span></i>`;
    }).join('');
    document.getElementById('hud-bar').style.width = pct + '%';
    document.getElementById('hud-pct').textContent = pct + '%';
    document.getElementById('hud-barwrap').setAttribute('aria-valuenow', pct);
    document.getElementById('hud-star-n').textContent = st.stars;
    document.getElementById('hud-badges').innerHTML = SM.ZONES.map((z, i) => {
      const won = st.badges.includes(i);
      return `<i class="hud-badge ${won ? 'won' : ''}" data-zone="${i}" title="${won ? z.badge : 'Locked: finish the ' + z.name}">${SM.badgeArt(z.sym, won ? z.col : '#3B4A7A')}</i>`;
    }).join('');
  }

  function bumpStars() {
    const el = document.getElementById('hud-stars');
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }

  /* ---------- Bottom bar ---------- */
  function buildNav() {
    nav.innerHTML = `
      <button class="nav-btn" id="nav-home" aria-label="Home" title="Home">${SM.icons.home}</button>
      <button class="nav-btn nav-prev" id="nav-prev" aria-label="Previous slide" title="Previous (left arrow)">${SM.icons.prev}</button>
      <div class="nav-map" id="nav-map" role="list"></div>
      <span class="nav-num" id="nav-num"></span>
      <button class="nav-btn nav-next" id="nav-next" aria-label="Next slide" title="Next (right arrow)">NEXT ${SM.icons.next}</button>
      <button class="nav-btn" id="nav-sound" aria-label="Turn sound on" title="Sound (M)"></button>
      <button class="nav-btn" id="nav-full" aria-label="Full screen" title="Full screen (F)">${SM.icons.full}</button>`;
    document.getElementById('nav-home').addEventListener('click', () => show(0));
    document.getElementById('nav-prev').addEventListener('click', () => step(-1));
    document.getElementById('nav-next').addEventListener('click', () => step(1));
    document.getElementById('nav-sound').addEventListener('click', toggleSound);
    document.getElementById('nav-full').addEventListener('click', toggleFull);
    document.getElementById('nav-map').addEventListener('click', e => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      const i = +b.dataset.i;
      if (i <= G.state.furthest + 1) show(i);
      else {
        SM.bad(b);
        SM.fx.toast('Keep exploring to unlock this lab area!', 'info');
      }
    });
    paintSound();
  }

  function refreshNav() {
    const map = document.getElementById('nav-map');
    let html = '';
    SM.ZONES.forEach((z, zi) => {
      html += `<span class="nav-zone" role="listitem" title="${z.name}" style="--zc:${z.col}">`;
      z.slides.forEach(i => {
        const cls = [i === cur ? 'now' : '', G.slideComplete(i) ? 'done' : '', i > G.state.furthest + 1 ? 'locked' : ''].join(' ');
        html += `<button class="nav-dot ${cls}" data-i="${i}" aria-label="Slide ${i + 1}: ${SM.slides[i].short}${i > G.state.furthest + 1 ? ' (locked)' : ''}" ${i === cur ? 'aria-current="step"' : ''} title="${i + 1}. ${SM.slides[i].short}"><span>${i + 1}</span></button>`;
      });
      html += '</span>';
    });
    map.innerHTML = html;
    document.getElementById('nav-num').textContent = `${cur + 1} / ${SM.slides.length}`;
    document.getElementById('nav-prev').disabled = cur === 0;
    const nx = document.getElementById('nav-next');
    nx.disabled = cur === SM.slides.length - 1;
    nx.classList.toggle('ready', G.slideComplete(cur) && cur < SM.slides.length - 1);
    const active = map.querySelector('.now');
    if (active && map.scrollWidth > map.clientWidth) {
      const mr = map.getBoundingClientRect(), ar = active.getBoundingClientRect();
      map.scrollLeft += ar.left - mr.left - mr.width / 2 + ar.width / 2;
    }
  }

  function paintSound() {
    const b = document.getElementById('nav-sound');
    b.innerHTML = G.state.muted ? SM.icons.soundOff : SM.icons.soundOn;
    b.setAttribute('aria-label', G.state.muted ? 'Turn sound on' : 'Turn sound off');
    b.classList.toggle('on', !G.state.muted);
  }
  function toggleSound() {
    G.toggleMute();
    paintSound();
  }

  function toggleFull() {
    const d = document;
    const el = d.documentElement;
    const on = d.fullscreenElement || d.webkitFullscreenElement;
    try {
      if (on) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else {
        const req = el.requestFullscreen || el.webkitRequestFullscreen;
        if (req) {
          const p = req.call(el);
          if (p && p.catch) p.catch(() => SM.fx.toast('This browser could not go full screen.', 'info'));
        } else SM.fx.toast('This browser does not offer full screen.', 'info');
      }
    } catch (e) { /* ignored */ }
  }
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, () => {
    const on = document.fullscreenElement || document.webkitFullscreenElement;
    const b = document.getElementById('nav-full');
    if (b) b.innerHTML = on ? SM.icons.exitFull : SM.icons.full;
    setTimeout(layout, 60);
  }));

  /* ---------- Speech bubble from Dr Fizz ---------- */
  let sayTimer;
  function say(text) {
    clearTimeout(sayTimer);
    sayLayer.innerHTML = `<div class="say">${text}</div>`;
    sayTimer = setTimeout(() => {
      const el = sayLayer.firstChild;
      if (el) {
        el.classList.add('toast-out');
        setTimeout(() => { if (sayLayer.firstChild === el) el.remove(); }, 300);
      }
    }, 5500);
  }

  /* ---------- Per-slide lifetime ---------- */
  function makeCtx(index) {
    const ctl = new AbortController();
    const timers = new Set();
    const frames = [];
    const leavers = [];
    const acts = {};
    let raf = 0;
    const ctx = {
      index, dead: false,
      on(el, ev, fn, opts) { el.addEventListener(ev, fn, Object.assign({ signal: ctl.signal }, opts || {})); },
      after(ms, fn) {
        const t = setTimeout(() => {
          timers.delete(t);
          if (!ctx.dead) fn();
        }, ms);
        timers.add(t);
        return t;
      },
      every(ms, fn) {
        const t = setInterval(() => { if (!ctx.dead) fn(); }, ms);
        timers.add(t);
        return t;
      },
      frame(fn) {
        frames.push(fn);
        if (!raf) {
          const loop = now => {
            if (ctx.dead) return;
            frames.forEach(f => f(now));
            raf = requestAnimationFrame(loop);
          };
          raf = requestAnimationFrame(loop);
        }
      },
      onLeave(fn) { leavers.push(fn); },
      act(id) {
        if (!acts[id]) {
          let misses = 0;
          acts[id] = {
            miss() { misses++; },
            isDone: () => G.activityDone(index, id),
            done(srcEl) { return G.finishActivity(index, id, misses, srcEl); }
          };
        }
        return acts[id];
      },
      say,
      go: i => show(i),
      destroy() {
        ctx.dead = true;
        ctl.abort();
        timers.forEach(t => { clearTimeout(t); clearInterval(t); });
        cancelAnimationFrame(raf);
        leavers.forEach(f => f());
      }
    };
    return ctx;
  }

  /* ---------- Showing a slide ---------- */
  function show(i, instant) {
    i = SM.clamp(i, 0, SM.slides.length - 1);
    const dir = i >= cur ? 1 : -1;
    if (currentCtx) currentCtx.destroy();
    const old = currentEl;
    cur = i;
    const meta = SM.slides[i];
    G.visit(i);
    SM.ui.currentIndex = i;
    sayLayer.innerHTML = '';

    const el = document.createElement('section');
    el.className = `slide s${i + 1} slide-${meta.id}`;
    el.setAttribute('aria-label', `Slide ${i + 1} of ${SM.slides.length}: ${meta.title}`);
    el.style.setProperty('--dir', dir);
    const ctx = makeCtx(i);
    currentCtx = ctx;
    currentEl = el;
    host.appendChild(el);
    SM.renderers[meta.id](el, ctx);
    SM.applySlideBackground(el, meta.id);

    if (old) {
      if (instant) old.remove();
      else {
        old.classList.add('leaving');
        old.style.setProperty('--dir', dir);
        setTimeout(() => old.remove(), 320);
      }
    }
    if (!instant) el.classList.add('entering');
    host.scrollTop = 0;
    try { host.focus({ preventScroll: true }); } catch (e) { /* older browsers */ }

    refreshHud();
    refreshNav();
    G.checkBadges();
    if (G.slideComplete(i) && !meta.activities.length) refreshNav();
    try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) { /* file:// in some browsers */ }
  }

  function step(d) {
    const n = cur + d;
    if (n >= 0 && n < SM.slides.length) show(n);
  }

  /* ---------- Keyboard ---------- */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': step(1); e.preventDefault(); break;
      case 'ArrowLeft': case 'PageUp': step(-1); e.preventDefault(); break;
      case 'Home': show(0); e.preventDefault(); break;
      case 'End': show(G.state.furthest); e.preventDefault(); break;
      case 'f': case 'F': toggleFull(); break;
      case 'm': case 'M': toggleSound(); break;
      default:
    }
  });

  /* ---------- Floating background particles ---------- */
  function bg() {
    if (SM.calm()) return;
    const c = document.getElementById('bg-canvas');
    const g = c.getContext('2d');
    const dots = Array.from({ length: 34 }, () => ({
      x: Math.random(), y: Math.random(), r: 1 + Math.random() * 3, v: .0002 + Math.random() * .0005, ph: Math.random() * 6,
      c: ['#38BDF8', '#A78BFA', '#6EE7B7', '#FDE68A'][Math.floor(Math.random() * 4)]
    }));
    (function loop(now) {
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== w) { c.width = w; c.height = h; }
      g.clearRect(0, 0, w, h);
      dots.forEach(d => {
        d.y -= d.v;
        if (d.y < -.02) d.y = 1.02;
        g.globalAlpha = .28 + Math.sin(now / 900 + d.ph) * .2;
        g.fillStyle = d.c;
        g.beginPath();
        g.arc((d.x + Math.sin(now / 3000 + d.ph) * .01) * w, d.y * h, d.r, 0, 6.3);
        g.fill();
      });
      requestAnimationFrame(loop);
    })(0);
  }

  /* ---------- Start up ---------- */
  SM.ui = Object.assign(SM.ui || {}, { scale: 1, refreshHud, refreshNav, bumpStars, show, say });
  SM.installDefs();
  buildHud();
  buildNav();
  layout();
  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => setTimeout(layout, 200));
  SM.probeAssets();
  bg();
  G._lastLevel = G.level().n;

  const fromHash = parseInt(location.hash.slice(1), 10);
  const start = fromHash >= 1 && fromHash <= SM.slides.length ? fromHash - 1 : G.state.current;
  show(start, true);
})();
