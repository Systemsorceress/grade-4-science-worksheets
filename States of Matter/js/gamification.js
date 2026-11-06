/* ------------------------------------------------------------------
   Game state, stars, levels, badges, sound and reward effects.
   Progress is saved in localStorage and survives closing the browser.
------------------------------------------------------------------- */
(function () {
  const KEY = 'incredible-world-of-matter-v1';

  /* ---------- Saving ---------- */
  const blank = () => ({
    current: 0, furthest: 0, visited: [], activities: {}, stars: 0,
    badges: [], quiz: null, bestQuiz: null, name: '', muted: true, zonesSeen: [0]
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign(blank(), JSON.parse(raw)) : blank();
    } catch (e) { return blank(); }
  }

  const state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private window: play on unsaved */ }
  }

  /* ---------- Sound. Made in code, off until the player turns it on. ---------- */
  let audio = null;
  function tone(freq, start, dur, type, vol) {
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, audio.currentTime + start);
    g.gain.linearRampToValueAtTime(vol || .12, audio.currentTime + start + .01);
    g.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + start + dur);
    o.connect(g).connect(audio.destination);
    o.start(audio.currentTime + start);
    o.stop(audio.currentTime + start + dur + .02);
  }
  const SOUNDS = {
    click: () => tone(520, 0, .07, 'triangle', .06),
    good: () => { tone(660, 0, .12); tone(880, .1, .2); },
    bad: () => { tone(220, 0, .16, 'triangle', .1); tone(190, .1, .18, 'triangle', .08); },
    star: () => { tone(988, 0, .1); tone(1319, .08, .22); },
    badge: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .1, .28)); },
    fanfare: () => { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * .13, .32, 'triangle', .14)); },
    pop: () => tone(300, 0, .09, 'square', .05)
  };
  SM.sound = function (name) {
    if (state.muted || !SOUNDS[name]) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      SOUNDS[name]();
    } catch (e) { /* sound is a bonus, never a blocker */ }
  };

  /* ---------- Lesson structure helpers ---------- */
  SM.ZONES = [
    { name: 'Lab Entrance', badge: 'Matter Explorer', sym: 'flask', col: '#38BDF8', slides: [0, 1, 2] },
    { name: 'Investigation Wing', badge: 'Property Investigator', sym: 'lens', col: '#14B8A6', slides: [3, 4, 5] },
    { name: 'Particle Vault', badge: 'Particle Detective', sym: 'atoms', col: '#8B5CF6', slides: [6, 7] },
    { name: 'Change Chamber', badge: 'State Changer', sym: 'drop', col: '#F97316', slides: [8, 9, 10, 11, 12] },
    { name: 'Equipment Bay', badge: 'Science Investigator', sym: 'thermo', col: '#E11D48', slides: [13, 14] },
    { name: 'Final Exam Hall', badge: 'Young Scientist', sym: 'cap', col: '#CA8A04', slides: [15, 16, 17] }
  ];
  const LEVELS = [
    [0, 'Lab Rookie'], [5, 'Curious Explorer'], [12, 'Lab Assistant'],
    [22, 'Junior Researcher'], [34, 'Matter Expert'], [45, 'Master Scientist']
  ];

  const aKey = (i, id) => SM.slides[i].id + ':' + id;
  const isDone = (i, id) => !!(state.activities[aKey(i, id)] && state.activities[aKey(i, id)].done);

  const Game = {
    state, save,

    slideComplete(i) {
      const s = SM.slides[i];
      if (!s.activities.length) return state.visited.includes(i);
      return s.activities.every(a => isDone(i, a.id));
    },
    activityDone: isDone,
    allActivities() {
      const out = [];
      SM.slides.forEach((s, i) => s.activities.forEach(a => out.push([i, a.id])));
      return out;
    },
    progress() {
      const all = this.allActivities();
      return Math.round(100 * all.filter(p => isDone(p[0], p[1])).length / all.length);
    },
    missionsDone() {
      return SM.slides.filter((s, i) => s.activities.length && this.slideComplete(i)).length;
    },
    missionsTotal() { return SM.slides.filter(s => s.activities.length).length; },
    maxStars() {
      return SM.slides.reduce((n, s) => n + s.activities.reduce((m, a) => m + (a.reward === undefined ? 1 + (a.bonus ? 1 : 0) : a.reward), 0), 0);
    },
    level() {
      let n = 0;
      LEVELS.forEach((l, i) => { if (state.stars >= l[0]) n = i; });
      return { n: n + 1, name: LEVELS[n][1] };
    },

    /* Adds stars and flies them from sourceEl to the counter. */
    addStars(n, sourceEl, label) {
      if (n <= 0) return;
      state.stars += n;
      const before = this._lastLevel || this.level().n;
      save();
      SM.fx.flyStars(n, sourceEl, () => { SM.ui.refreshHud(); SM.ui.bumpStars(); });
      if (label) SM.fx.toast(`<span class="toast-icon">${SM.starSvg()}</span><b>+${n}</b> ${label}`, 'star');
      SM.sound('star');
      const now = this.level();
      if (now.n > before) SM.fx.toast(`<b>Level ${now.n}!</b> You are now a ${now.name}.`, 'level');
      this._lastLevel = now.n;
    },

    /* Called by an activity when the player finishes it. Replays earn nothing
       extra because each activity pays out once. */
    finishActivity(i, id, misses, sourceEl) {
      const key = aKey(i, id);
      if (state.activities[key] && state.activities[key].done) {
        SM.fx.toast('Finished again. Great practice!', 'info');
        return false;
      }
      const a = SM.slides[i].activities.find(x => x.id === id);
      const bonus = !!(a && a.bonus && misses === 0);
      state.activities[key] = { done: true, bonus };
      save();
      this.addStars(bonus ? 2 : 1, sourceEl, bonus ? 'First-try bonus star!' : 'Activity complete!');
      this.checkBadges();
      SM.ui.refreshHud();
      SM.ui.refreshNav();
      return true;
    },

    checkBadges() {
      SM.ZONES.forEach((z, zi) => {
        if (state.badges.includes(zi)) return;
        const done = z.slides.every(i => SM.slides[i].activities.filter(a => !a.optionalForBadge).every(a => isDone(i, a.id)));
        if (done) {
          state.badges.push(zi);
          save();
          SM.fx.badge(zi);
        }
      });
    },

    visit(i) {
      if (!state.visited.includes(i)) state.visited.push(i);
      state.current = i;
      state.furthest = Math.max(state.furthest, i);
      const zone = SM.ZONES.findIndex(z => z.slides.includes(i));
      if (zone >= 0 && !state.zonesSeen.includes(zone)) {
        state.zonesSeen.push(zone);
        SM.fx.toast(`<b>New area unlocked:</b> ${SM.ZONES[zone].name}`, 'level');
        SM.sound('badge');
      }
      save();
    },

    toggleMute() {
      state.muted = !state.muted;
      save();
      if (!state.muted) SM.sound('good');
      return state.muted;
    },

    reset() {
      const muted = state.muted;
      Object.keys(state).forEach(k => delete state[k]);
      Object.assign(state, blank(), { muted });
      save();
      this._lastLevel = 1;
    }
  };
  Game._lastLevel = 1;
  SM.game = Game;

  /* ---------- Reward effects ---------- */
  const calm = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  SM.calm = calm;

  SM.fx = {
    flyStars(n, sourceEl, done) {
      const target = document.getElementById('hud-star-icon');
      if (!target || calm()) { done(); return; }
      const t = target.getBoundingClientRect();
      const src = sourceEl && sourceEl.getBoundingClientRect ? sourceEl.getBoundingClientRect() : null;
      const sx = src && src.width ? src.left + src.width / 2 : innerWidth / 2;
      const sy = src && src.width ? src.top + src.height / 2 : innerHeight / 2;
      let landed = 0;
      for (let k = 0; k < n; k++) {
        const el = document.createElement('div');
        el.className = 'fly-star';
        el.innerHTML = SM.starSvg();
        el.style.left = sx - 22 + 'px';
        el.style.top = sy - 22 + 'px';
        document.body.appendChild(el);
        const midX = (sx + t.left) / 2 + (k ? -60 : 60);
        const midY = Math.min(sy, t.top) + 70;
        const anim = el.animate([
          { transform: 'translate(0,0) scale(.3) rotate(0)', opacity: .2 },
          { transform: `translate(${midX - sx}px,${midY - sy}px) scale(1.5) rotate(180deg)`, opacity: 1, offset: .45 },
          { transform: `translate(${t.left - sx}px,${t.top - sy}px) scale(.5) rotate(360deg)`, opacity: 1 }
        ], { duration: 950, delay: k * 170, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'both' });
        anim.onfinish = () => {
          el.remove();
          if (++landed === n) done();
        };
      }
    },

    toast(html, kind) {
      const layer = document.getElementById('toast-layer');
      if (!layer) return;
      while (layer.children.length >= 2) layer.firstChild.remove();
      const el = document.createElement('div');
      el.className = 'toast toast-' + (kind || 'info');
      el.innerHTML = html;
      layer.appendChild(el);
      setTimeout(() => {
        el.classList.add('toast-out');
        setTimeout(() => el.remove(), 350);
      }, kind === 'level' ? 3600 : 2600);
    },

    badge(zi) {
      const z = SM.ZONES[zi];
      const layer = document.getElementById('toast-layer');
      if (!layer) return;
      const el = document.createElement('div');
      el.className = 'badge-pop';
      el.innerHTML = `<div class="badge-pop-medal">${SM.badgeArt(z.sym, z.col)}</div>
        <div><small>Badge unlocked</small><b>${z.badge}</b></div>`;
      layer.appendChild(el);
      SM.sound('badge');
      SM.fx.confetti(45, el);
      SM.ui.refreshHud();
      const medal = document.querySelector(`.hud-badge[data-zone="${zi}"]`);
      if (medal) medal.classList.add('just-won');
      setTimeout(() => {
        el.classList.add('toast-out');
        setTimeout(() => el.remove(), 350);
      }, 4200);
    },

    /* Lightweight confetti on a temporary full-window canvas. */
    confetti(count, originEl) {
      if (calm()) return;
      const c = document.createElement('canvas');
      c.className = 'confetti-canvas';
      c.width = innerWidth;
      c.height = innerHeight;
      document.body.appendChild(c);
      const g = c.getContext('2d');
      const r = originEl && originEl.getBoundingClientRect ? originEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 3, width: 0, height: 0 };
      const ox = r.left + r.width / 2;
      const oy = r.top + r.height / 2;
      const cols = ['#38BDF8', '#A78BFA', '#6EE7B7', '#FDE68A', '#FB923C', '#F8FAFC'];
      const bits = Array.from({ length: count }, () => {
        const a = Math.random() * Math.PI * 2;
        const v = 3 + Math.random() * 9;
        return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, s: 5 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[count % 6 === 0 ? Math.floor(Math.random() * 6) : Math.floor(Math.random() * 6)] };
      });
      const start = performance.now();
      (function tick(now) {
        const t = now - start;
        g.clearRect(0, 0, c.width, c.height);
        bits.forEach(b => {
          b.vy += .22;
          b.vx *= .99;
          b.x += b.vx;
          b.y += b.vy;
          b.r += b.vr;
          g.save();
          g.translate(b.x, b.y);
          g.rotate(b.r);
          g.globalAlpha = Math.max(0, 1 - t / 2200);
          g.fillStyle = b.c;
          g.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
          g.restore();
        });
        if (t < 2200) requestAnimationFrame(tick);
        else c.remove();
      })(start);
    }
  };
})();
