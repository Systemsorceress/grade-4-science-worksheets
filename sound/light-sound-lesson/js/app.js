/* ==========================================================
   app.js — state (localStorage), navigation, HUD, scaling,
   badges, stars, overlays, keyboard & fullscreen.
   ========================================================== */
window.LS = window.LS || {};

(() => {
const KEY = 'lightSoundMission.v1';
const ic = LS.icons;

/* ---------------- badges ---------------- */
LS.BADGES = [
  { id: 'explorer', name: 'Lab Explorer', desc: 'Started the mission', icon: 'search' },
  { id: 'light-spotter', name: 'Light Spotter', desc: 'Found all four light sources', icon: 'sun' },
  { id: 'mirror-master', name: 'Mirror Master', desc: 'Hit all three mirror targets', icon: 'mirror' },
  { id: 'sorter', name: 'Super Sorter', desc: 'Sorted reflect vs absorb', icon: 'check' },
  { id: 'light-detective', name: 'Light Detective', desc: 'Completed Mirror Detective', icon: 'eye' },
  { id: 'vibe-hunter', name: 'Vibration Hunter', desc: 'Made all four objects vibrate', icon: 'wave' },
  { id: 'ruler-twanger', name: 'Ruler Twanger', desc: 'Saw the sound stop with the vibrations', icon: 'ruler' },
  { id: 'wave-watcher', name: 'Wave Watcher', desc: 'Sent sound waves to the ear', icon: 'ear' },
  { id: 'sound-traveller', name: 'Sound Traveller', desc: 'Tested every medium', icon: 'bolt' },
  { id: 'telephone', name: 'Phone Engineer', desc: 'Tested tight and loose strings', icon: 'phone' },
  { id: 'pitch-pro', name: 'Pitch Pro', desc: 'Heard all eight pitch sounds', icon: 'note' },
  { id: 'investigator', name: 'Chief Investigator', desc: 'Finished the ruler, band and bottle investigations', icon: 'bottle' },
  { id: 'detective', name: 'Science Detective', desc: 'Solved the final challenge', icon: 'star' },
  { id: 'quiz-champ', name: 'Quiz Champion', desc: 'Scored 10 or more in the quiz', icon: 'trophy' },
  { id: 'graduate', name: 'Mission Complete', desc: 'Reached the certificate', icon: 'star' }
];

/* ---------------- store ---------------- */
const fresh = () => ({ slide: 0, stars: 0, awarded: {}, badges: [], done: {}, visited: [0], name: '', quizBest: null, quizLast: null, sound: true });
LS.store = (() => {
  let d = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) d = Object.assign(fresh(), JSON.parse(raw)); } catch (e) { /* storage unavailable */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* ignore */ } };
  return {
    get: (k, def) => (d[k] === undefined || d[k] === null ? def : d[k]),
    set: (k, v) => { d[k] = v; save(); },
    get stars() { return d.stars; },
    addStars(n) { d.stars += n; save(); },
    isAwarded: (k) => !!d.awarded[k],
    markAwarded(k, n) { d.awarded[k] = n; save(); },
    isDone: (k) => !!(d.awarded[k] || d.done[k]),
    done(k) { d.done[k] = true; save(); },
    hasBadge: (id) => d.badges.includes(id),
    addBadge(id) { d.badges.push(id); save(); },
    get badges() { return d.badges.slice(); },
    visit(i) { if (!d.visited.includes(i)) d.visited.push(i); d.slide = i; save(); },
    get visited() { return d.visited; },
    reset() { const sound = d.sound; d = fresh(); d.sound = sound; save(); }
  };
})();

/* ---------------- stars & badges ---------------- */
let lastPointer = { x: innerWidth / 2, y: innerHeight / 2 };
addEventListener('pointerdown', (e) => { lastPointer = { x: e.clientX, y: e.clientY }; }, true);

LS.award = (key, n = 1) => {
  if (LS.store.isAwarded(key)) return false;
  LS.store.markAwarded(key, n); LS.store.addStars(n);
  flyStar(n); setTimeout(() => LS.audio.ui.star(), 160);
  return true;
};
function flyStar(n) {
  const target = LS.$('#hud-star-target').getBoundingClientRect();
  for (let k = 0; k < Math.min(n, 3); k++) {
    const s = document.createElement('img'); s.src = 'assets/icons/star.svg'; s.className = 'fly-star'; s.alt = '';
    s.style.left = (lastPointer.x - 20 + k * 14) + 'px'; s.style.top = (lastPointer.y - 20) + 'px';
    document.body.appendChild(s);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      s.style.transform = `translate(${target.left - lastPointer.x + 4 - k * 14}px, ${target.top - lastPointer.y + 4}px) scale(.6) rotate(200deg)`;
      s.style.opacity = '.4';
    }));
    setTimeout(() => { s.remove(); hud(); bump(); }, 950 + k * 60);
  }
}
const bump = () => { const el = LS.$('.hud-stars'); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };

LS.badge = (id) => {
  if (LS.store.hasBadge(id)) return;
  const b = LS.BADGES.find(x => x.id === id); if (!b) return;
  LS.store.addBadge(id);
  LS.audio.ui.badge();
  const t = LS.h(`<div class="toast"><span class="medal"><span>${ic[b.icon]}</span></span><div><b>Badge unlocked: ${b.name}!</b><span>${b.desc}</span></div></div>`);
  LS.$('#toast-zone').appendChild(t); setTimeout(() => t.remove(), 4200);
  hud();
};
LS.checkInvestigator = () => { if (['ruler-exp', 'bands', 'bottles'].every(k => LS.store.isDone(k))) LS.badge('investigator'); };

/* ---------------- HUD ---------------- */
const SECTION_LAB = { intro: 'Mission HQ', light: 'Light Lab', vibe: 'Sound Lab', travel: 'Sound Lab', pitch: 'Sound Lab', mission: 'Final Mission', quiz: 'Final Mission' };
function hud() {
  const s = LS.slides[LS.current];
  LS.$('#hud-slide').textContent = LS.current + 1;
  LS.$('#hud-total').textContent = LS.slides.length;
  LS.$('#hud-progress').style.width = `${(LS.current + 1) / LS.slides.length * 100}%`;
  LS.$('#hud-lab-name').textContent = s.lab || SECTION_LAB[s.section];
  LS.$('#hud-stars').textContent = LS.store.stars;
  LS.$('#hud-badges').textContent = LS.store.badges.length;
  LS.$('#btn-prev').disabled = LS.current === 0;
  LS.$('#btn-next').disabled = LS.current === LS.slides.length - 1;
  LS.$('#btn-sound').innerHTML = LS.audio.enabled ? ic.soundOn : ic.soundOff;
  LS.$('#btn-sound').classList.toggle('on', LS.audio.enabled);
  LS.$('#btn-fullscreen').innerHTML = document.fullscreenElement ? ic.exitFull : ic.full;
}

/* ---------------- navigation ---------------- */
LS.current = 0;
LS.go = (i, dir) => {
  i = LS.clamp(i, 0, LS.slides.length - 1);
  dir = dir || (i >= LS.current ? 'r' : 'l');
  LS.life.clear();
  LS.audio.stopAll();
  closeOverlay();
  LS.current = i;
  const s = LS.slides[i];
  document.body.dataset.section = s.section;
  const host = LS.$('#slide-host');
  host.innerHTML = s.render();
  const el = host.firstElementChild;
  el.classList.add(dir === 'r' ? 'enter-r' : 'enter-l');
  try { s.init && s.init(el); } catch (e) { console.error('Slide init failed:', s.id, e); }
  LS.store.visit(i);
  hud();
  LS.teacher.render();
  if (history.replaceState) history.replaceState(null, '', `#${i + 1}`);
};
LS.next = () => LS.go(LS.current + 1, 'r');
LS.prev = () => LS.go(LS.current - 1, 'l');

/* ---------------- scaling ---------------- */
LS.scale = 1;
LS.layout = () => {
  const vp = LS.$('#viewport'), stage = LS.$('#stage'), wrap = LS.$('#stage-wrap');
  const teacherW = LS.teacher.open && innerWidth > 1100 ? 420 : 0;
  const W = vp.clientWidth - teacherW, H = vp.clientHeight;
  const side = W > 900 ? 76 : 62;
  let s = Math.min((W - side * 2) / 1280, (H - 20) / 720);
  const flow = s < 0.45;
  document.body.classList.toggle('flow', flow);
  if (flow) { LS.scale = 1; stage.style.transform = ''; stage.style.left = ''; stage.style.top = ''; wrap.style.right = ''; return; }
  s = Math.min(s, 1.6);
  LS.scale = s;
  wrap.style.right = teacherW + 'px';
  stage.style.transform = `scale(${s})`;
  stage.style.left = `${(W - 1280 * s) / 2}px`;
  stage.style.top = `${(H - 720 * s) / 2}px`;
  LS.$('#btn-next').style.right = (teacherW + 10) + 'px';
};

/* ---------------- overlays ---------------- */
function openOverlay(html) {
  const ov = LS.$('#overlay');
  ov.innerHTML = html; ov.hidden = false;
  ov.onclick = (e) => { if (e.target === ov || e.target.closest('[data-close]')) closeOverlay(); };
}
function closeOverlay() { const ov = LS.$('#overlay'); ov.hidden = true; ov.innerHTML = ''; }
function openMap() {
  const secs = [['intro', 'Introduction'], ['light', 'Light Lab'], ['vibe', 'Sound Lab — vibrations'], ['travel', 'Sound Lab — how sound travels'], ['pitch', 'Sound Lab — pitch'], ['mission', 'Final mission'], ['quiz', 'Assessment']];
  const vis = LS.store.visited;
  openOverlay(`<div class="panel"><div class="panel-head"><h2>${ic.map.replace('<svg', '<svg width="28" height="28"')} Mission map</h2><button class="btn btn-sm btn-ghost" data-close>${ic.x} Close</button></div>
    <div class="map-grid">${secs.map(([k, name]) => `<div class="map-sec">${name}</div>` + LS.slides.map((s, i) => s.section !== k ? '' : `<button class="map-item ${i === LS.current ? 'current' : ''} ${vis.includes(i) ? 'visited' : ''}" data-go="${i}"><span class="n">${i + 1}</span><span>${s.title}<small>${s.time}</small></span></button>`).join('')).join('')}</div></div>`);
  LS.$$('[data-go]', LS.$('#overlay')).forEach(b => b.onclick = () => LS.go(+b.dataset.go));
}
function openBadges() {
  openOverlay(`<div class="panel"><div class="panel-head"><h2><img src="assets/icons/star.svg" alt="" style="width:34px;display:inline;vertical-align:middle"> ${LS.store.stars} stars · ${LS.store.badges.length}/${LS.BADGES.length} badges</h2><button class="btn btn-sm btn-ghost" data-close>${ic.x} Close</button></div>
    <div class="badge-grid">${LS.BADGES.map(b => `<div class="badge-item"><span class="medal ${LS.store.hasBadge(b.id) ? '' : 'locked'}"><span>${ic[b.icon]}</span></span><div><b>${b.name}</b><small>${b.desc}</small></div></div>`).join('')}</div></div>`);
}

/* ---------------- fullscreen & sound ---------------- */
function toggleFull() {
  try {
    const p = !document.fullscreenElement
      ? (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen || (() => {})).call(document.documentElement)
      : (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    if (p && p.catch) p.catch(() => { /* fullscreen not allowed here */ });
  } catch (e) { /* fullscreen unsupported */ }
}
function toggleSound() { LS.audio.enabled = !LS.audio.enabled; LS.store.set('sound', LS.audio.enabled); hud(); if (LS.audio.enabled) LS.audio.ui.click(); }

/* ---------------- background particles ---------------- */
function bgFx() {
  const fx = LS.$('#bg-fx');
  for (let k = 0; k < 16; k++) {
    const s = document.createElement('span'), size = 4 + Math.random() * 10;
    Object.assign(s.style, { width: size + 'px', height: size + 'px', left: Math.random() * 100 + '%', bottom: '-20px', animationDuration: 14 + Math.random() * 16 + 's', animationDelay: -Math.random() * 20 + 's' });
    fx.appendChild(s);
  }
}

/* ---------------- boot ---------------- */
function boot() {
  LS.audio.enabled = LS.store.get('sound', true);
  LS.$('#btn-prev').innerHTML = ic.prev;
  LS.$('#btn-next').innerHTML = ic.next;
  LS.$('#btn-teacher').innerHTML = ic.teacher;
  LS.$('#btn-prev').onclick = LS.prev;
  LS.$('#btn-next').onclick = LS.next;
  LS.$('#btn-home').onclick = () => LS.go(0, 'l');
  LS.$('#btn-map').onclick = openMap;
  LS.$('#btn-badges').onclick = openBadges;
  LS.$('#btn-sound').onclick = toggleSound;
  LS.$('#btn-teacher').onclick = () => LS.teacher.toggle();
  LS.$('#btn-fullscreen').onclick = toggleFull;
  document.addEventListener('fullscreenchange', () => { hud(); setTimeout(LS.layout, 60); });
  addEventListener('resize', LS.layout);
  addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (e.key === 'Escape') { closeOverlay(); if (LS.teacher.open) LS.teacher.toggle(false); return; }
    if (tag === 'input' || tag === 'textarea' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (tag === 'button' && (e.key === ' ' || e.key === 'Enter')) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': e.preventDefault(); LS.next(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); LS.prev(); break;
      case 'Home': LS.go(0, 'l'); break;
      case 'End': LS.go(LS.slides.length - 1); break;
      case 't': case 'T': LS.teacher.toggle(); break;
      case 'f': case 'F': toggleFull(); break;
      case 'm': case 'M': toggleSound(); break;
    }
  });
  LS.teacher.init();
  bgFx();
  LS.layout();
  const fromHash = parseInt((location.hash || '').slice(1), 10);
  LS.go(Number.isFinite(fromHash) ? fromHash - 1 : LS.store.get('slide', 0), 'r');
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
