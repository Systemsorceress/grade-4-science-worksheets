/* ==========================================================
   slides.js — the 21 slides of the lesson, in teaching order.
   Each slide: { id, section, lab, title, time, render(), init(root) }
   Teacher notes live in teacher-mode.js (keyed by id).
   ========================================================== */
window.LS = window.LS || {};

(() => {
const I = (n) => `assets/images/${n}.svg`;
const ic = LS.icons;
const head = (kicker, title, sub = '', right = '') => `
  <div class="slide-head pop"><div><div class="kicker">${kicker}</div><h2 class="slide-title">${title}</h2>${sub ? `<p class="slide-sub">${sub}</p>` : ''}</div>${right}</div>`;
const reveal = (q, a) => `<div class="card tight reveal-card"><div class="q">${q}</div><div class="reveal-hint">Think first — then click to reveal</div><div class="a">${a}</div></div>`;
const award = (k, n) => LS.award(k, n);

const slides = [];

/* ============ SLIDE 1 — WELCOME ============ */
slides.push({
  id: 'welcome', section: 'intro', lab: 'Mission HQ', title: 'Welcome to the Science Laboratory', time: '0–2 min',
  render: () => `
  <div class="slide s-welcome">
    <div class="welcome-top">
      <div class="welcome-text pop">
        <div class="kicker">Year 4 Science · Light &amp; Sound</div>
        <h1 class="hero-title">Today, you are a <span>Science Detective!</span></h1>
        <p class="hero-sub">Step inside two secret laboratories, run real experiments and crack the mysteries of <b class="hl-y">light</b> and <b class="hl-c">sound</b>.</p>
        <div class="row" style="margin-top:22px;align-items:center"><button class="btn btn-big btn-yellow" id="start-mission">Start Mission ${ic.play}</button>
        <span class="small muted" style="font-weight:800">Use the arrows or ← → keys</span></div>
      </div>
      <div class="mascot pop" style="--d:2">
        <div class="speech">Hi! I'm <b>Professor Pip</b>. Pick a lab door — or press <b>Start Mission!</b></div>
        <img class="bob" src="${I('scientist')}" alt="Professor Pip, a friendly cartoon scientist">
      </div>
      <div class="doors pop" style="--d:3">
        <button class="door door-light" data-go="2" aria-label="Enter the Light Lab">
          <div class="door-frame"><div class="door-inside"><img src="${I('sun')}" alt=""></div>
            <div class="door-panel"><span class="door-sign">LIGHT<br>LAB</span><span class="door-icon">${ic.sun}</span><span class="door-knob"></span></div></div>
          <span class="door-cap">See, reflect &amp; absorb</span>
        </button>
        <button class="door door-sound" data-go="7" aria-label="Enter the Sound Lab">
          <div class="door-frame"><div class="door-inside"><img src="${I('speaker')}" alt=""></div>
            <div class="door-panel"><span class="door-sign">SOUND<br>LAB</span><span class="door-icon">${ic.wave}</span><span class="door-knob"></span></div></div>
          <span class="door-cap">Vibrations &amp; pitch</span>
        </button>
      </div>
    </div>
    <div class="missions">
      ${[
        ['sun', 'Mission 1', 'Find out how <b>light and sound</b> help us see and hear — and how they are <b>reflected</b> and <b>absorbed</b>.'],
        ['wave', 'Mission 2', 'Discover how sounds are made by things that <b>vibrate</b>.'],
        ['ear', 'Mission 3', 'Track how vibrations <b>travel through a medium</b> to our ears.'],
        ['note', 'Mission 4', 'Find <b>patterns</b> between <b>pitch</b> and the object that made the sound.']
      ].map((m, i) => `<div class="mission-card pop" style="--d:${4 + i}"><span class="mission-ic">${ic[m[0]]}</span><div><b>${m[1]}</b><p>${m[2]}</p></div></div>`).join('')}
    </div>
  </div>`,
  init(root) {
    LS.$('#start-mission', root).onclick = () => { LS.audio.ui.whoosh(); LS.badge('explorer'); LS.go(1); };
    LS.$$('.door', root).forEach(d => d.onclick = () => { LS.audio.ui.whoosh(); LS.badge('explorer'); LS.go(+d.dataset.go); });
  }
});

/* ============ SLIDE 2 — MYSTERY CHALLENGE ============ */
slides.push({
  id: 'mystery', section: 'intro', lab: 'Mission HQ', title: 'Mystery Challenge', time: '2–5 min',
  render: () => `
  <div class="slide s-mystery">
    ${head('Mystery challenge', 'How do we <em>see</em> and <em>hear</em>?', 'Make a prediction for each mystery. Click an answer!')}
    <div class="mystery-grid">
      <div class="card tight mystery pop" style="--d:1">
        <div class="scene scene-dark"><img src="${I('teddy')}" class="ghost-teddy" alt="A toy hidden in the dark"><span class="qmark">?</span><span class="scene-cap">A toy in a totally dark room</span></div>
        <p class="mq">1. Can you see objects in <b>complete darkness</b>?</p>
        <div class="mcq" data-q="0"></div>
      </div>
      <div class="card tight mystery pop" style="--d:2">
        <div class="scene scene-torch" id="torch-scene"><img src="${I('torch')}" class="m-torch" alt="Torch"><div class="m-beam"></div><img src="${I('teddy')}" class="m-teddy" alt="Toy"><button class="btn btn-sm btn-yellow torch-switch" id="torch-switch">Switch on</button></div>
        <p class="mq">2. What happens when we <b>switch on a torch</b>?</p>
        <div class="mcq" data-q="1"></div>
      </div>
      <div class="card tight mystery pop" style="--d:3">
        <div class="scene scene-wall"><img src="${I('singer')}" class="m-singer" alt="Someone speaking"><div class="m-wall"></div><div class="m-arcs"><i></i><i></i><i></i></div><img src="${I('ear')}" class="m-ear" alt="Ear listening"><span class="scene-cap">Someone talking behind a wall</span></div>
        <p class="mq">3. Can you <b>hear</b> someone without <b>seeing</b> them?</p>
        <div class="mcq" data-q="2"></div>
      </div>
      <div class="card tight mystery pop" style="--d:4">
        <div class="scene scene-speaker"><img src="${I('speaker')}" class="m-speaker" alt="Speaker"><div class="m-waves"><i></i><i></i><i></i></div><img src="${I('ear')}" class="m-ear2" alt="Ear"></div>
        <p class="mq">4. What travels from a <b>speaker</b> to our ears?</p>
        <div class="mcq" data-q="3"></div>
      </div>
    </div>
    <div class="big-ideas pop" style="--d:5">
      <div class="locked-msg" id="ideas-lock">${ic.search}<span>Solve all four mysteries to unlock the <b>two big ideas</b>! <b id="ideas-count">0/4</b></span></div>
      <div class="idea idea-light" hidden><img src="${I('eye')}" alt=""><div><b>LIGHT</b> helps us <b>SEE</b></div></div>
      <div class="idea idea-sound" hidden><img src="${I('ear')}" alt=""><div><b>SOUND</b> helps us <b>HEAR</b></div></div>
    </div>
  </div>`,
  init(root) {
    const qs = [
      [{ t: 'Yes', fb: 'Hmm — in <b>complete</b> darkness there is no light at all. Without light, nothing can reach our eyes.' }, { t: 'No', ok: true, fb: '<b>Right!</b> We need light to see. In complete darkness, no light can bounce off the toy into our eyes.' }],
      [{ t: 'Light bounces off the toy into our eyes', ok: true, fb: '<b>Yes!</b> The torch gives out light. Light bounces off the toy and travels into our eyes.' }, { t: 'The toy starts to glow by itself', fb: 'The toy doesn\'t make its own light. Where does the light come from?' }, { t: 'Our eyes send out light', fb: 'Our eyes don\'t send out light — they receive it.' }],
      [{ t: 'Yes', ok: true, fb: '<b>Yes!</b> Sound can travel around and even through things like walls and doors, so we hear without seeing.' }, { t: 'No', fb: 'Think about hearing a friend calling from another room...' }],
      [{ t: 'Vibrations (sound waves) in the air', ok: true, fb: '<b>Brilliant!</b> The speaker vibrates and passes vibrations through the air to our ears.' }, { t: 'Light', fb: 'Light helps us see. What helps us hear?' }, { t: 'Tiny pieces of the speaker', fb: 'Nothing flies off the speaker! Something is passed along through the air...' }]
    ];
    let solved = 0;
    const upd = () => {
      LS.$('#ideas-count', root).textContent = `${solved}/4`;
      if (solved >= 4) { LS.$('#ideas-lock', root).hidden = true; LS.$$('.idea', root).forEach(e => e.hidden = false); }
    };
    LS.$$('.mcq', root).forEach(el => {
      const i = +el.dataset.q;
      LS.act.mcq(el, { options: qs[i], key: `mystery-${i}`, onCorrect: () => { solved++; upd(); if (i === 1) lightOn(true); } });
    });
    const scene = LS.$('#torch-scene', root), sw = LS.$('#torch-switch', root);
    const lightOn = (on) => { scene.classList.toggle('on', on); sw.textContent = on ? 'Switch off' : 'Switch on'; };
    sw.onclick = () => { LS.audio.ui.click(); lightOn(!scene.classList.contains('on')); };
  }
});

/* ============ SLIDE 3 — HOW DO WE SEE? ============ */
slides.push({
  id: 'see', section: 'light', lab: 'Light Lab', title: 'How Do We See Objects?', time: '5–8 min',
  render: () => `
  <div class="slide s-see">
    ${head('Light Lab · Lesson 1', 'How do we <em>see</em> objects?')}
    <div class="see-top">
      <div class="card see-diagram pop" style="--d:1">
        <svg class="sim-svg" viewBox="0 0 760 290" id="see-svg">
          <defs><marker id="arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#FFD76A"/></marker></defs>
          <g class="g-src"><circle cx="78" cy="88" r="70" fill="#FFD76A" opacity=".0" class="src-glow"/><image href="${I('sun')}" x="8" y="18" width="140" height="140"/><text x="78" y="182" fill="#FFD76A" font-size="19" text-anchor="middle">Light source</text></g>
          <g class="g-in step-g"><path class="ray ray-flow" d="M140 96 L322 196" marker-end="url(#arr)"/><path class="ray ray-flow" d="M132 122 L318 232" marker-end="url(#arr)"/><path class="ray ray-flow" d="M146 70 L330 160" marker-end="url(#arr)"/></g>
          <g class="g-scatter step-g"><path class="ray ray-flow" d="M392 160 L452 92" marker-end="url(#arr)" opacity=".55"/><path class="ray ray-flow" d="M420 230 L500 268" marker-end="url(#arr)" opacity=".55"/><path class="ray ray-flow" d="M330 150 L280 96" marker-end="url(#arr)" opacity=".55"/></g>
          <g class="g-obj"><image href="${I('teddy')}" x="300" y="128" width="128" height="141"/><text x="364" y="286" fill="#fff" font-size="19" text-anchor="middle">Object</text></g>
          <g class="g-eye-ray step-g"><path class="ray ray-flow" d="M420 180 L566 112" marker-end="url(#arr)" style="stroke-width:8"/><text x="466" y="128" fill="#FFD76A" font-size="16" transform="rotate(-24 466 128)">reflected light</text></g>
          <g class="g-eye"><image href="${I('eye')}" x="560" y="60" width="110" height="77"/><text x="615" y="160" fill="#fff" font-size="19" text-anchor="middle">Eye</text></g>
          <g class="g-brain step-g"><path d="M664 108 Q712 120 700 176" stroke="#FF8BC6" stroke-width="5" fill="none" stroke-dasharray="7 6" class="ray-flow"/><image href="${I('brain')}" x="646" y="170" width="104" height="88"/><g class="bubble"><rect x="560" y="2" width="190" height="44" rx="22" fill="#fff"/><text x="655" y="31" fill="#101A35" font-size="19" text-anchor="middle">"It's a teddy!"</text></g></g>
        </svg>
        <div class="key-point"><b>Remember:</b> we don't see things just because they are there. <span class="hl-y">Light from the object must reach our eyes.</span></div>
      </div>
      <div class="card see-steps pop" style="--d:2">
        <ol class="steps dim compact" id="see-steps">
          <li>A <b>light source</b> gives out light.</li>
          <li>Light travels and reaches an <b>object</b>.</li>
          <li>The object <b>reflects</b> some of the light.</li>
          <li>Reflected light enters our <b>eyes</b>.</li>
          <li>Our <b>brain</b> helps us understand what we see.</li>
        </ol>
        <button class="btn btn-sm btn-yellow" id="see-play">${ic.play} Play the light journey</button>
      </div>
    </div>
    <div class="card finder pop" style="--d:3">
      <div class="finder-head"><h3>Light source hunt: click <span class="hl-y">only</span> the things that <u>make their own light</u></h3><span class="chip" id="src-count">Found 0 / 4</span></div>
      <div class="finder-row" id="finder"></div>
      <div class="feedback" id="finder-fb"></div>
    </div>
  </div>`,
  init(root) {
    const svg = LS.$('#see-svg', root);
    const groups = ['.g-src', '.g-in', '.g-scatter', '.g-eye-ray', '.g-brain'];
    const show = (k) => {
      LS.$$('.step-g', svg).forEach(g => g.classList.remove('show'));
      groups.slice(1, k + 1).forEach(s => LS.$(s, svg).classList.add('show'));
      LS.$('.src-glow', svg).style.opacity = k >= 0 ? .35 : 0;
      LS.$('.g-eye', svg).classList.toggle('glow', k >= 3);
    };
    const st = LS.act.stepList(LS.$('#see-steps', root), { onStep: (k, end) => { show(k); if (end) award('see-journey'); } });
    LS.$('#see-play', root).onclick = () => { st.play(); LS.audio.ui.click(); };
    show(-1);
    // light source hunt
    const items = [
      ['sun', 'Sun', true, 'The <b>Sun</b> makes its own light — it is our biggest light source.'],
      ['mirror', 'Mirror', false, 'A <b>mirror</b> does not make light. It only <b>reflects</b> light that hits it.'],
      ['candle', 'Candle flame', true, 'A burning <b>candle flame</b> gives out its own light.'],
      ['moon', 'Moon', false, 'Tricky! The <b>Moon</b> is not a light source. It <b>reflects light from the Sun</b>.'],
      ['torch', 'Torch (switched on)', true, 'A switched-on <b>torch</b> makes light.'],
      ['book', 'Book', false, 'A <b>book</b> does not make light. We see it when light reflects off it.'],
      ['lamp', 'Lamp (switched on)', true, 'A switched-on <b>lamp</b> is a light source.'],
      ['spoon', 'Shiny spoon', false, 'Shiny things are <b>not</b> light sources — a spoon only reflects light.']
    ];
    const finder = LS.$('#finder', root), fb = LS.$('#finder-fb', root);
    let found = 0;
    finder.innerHTML = items.map((it, i) => `<button class="tile" data-i="${i}"><img src="${I(it[0])}" alt=""><span>${it[1]}</span></button>`).join('');
    LS.$$('.tile', finder).forEach(t => t.onclick = () => {
      const it = items[+t.dataset.i];
      if (t.classList.contains('yes') || t.classList.contains('no')) { LS.act.feedback(fb, it[2] ? 'good' : 'info', it[3]); return; }
      if (it[2]) {
        t.classList.add('yes'); t.insertAdjacentHTML('beforeend', '<span class="tag">LIGHT SOURCE</span>');
        found++; LS.audio.ui.correct(); award(`src-${it[0]}`);
        LS.act.feedback(fb, 'good', it[3]);
      } else {
        t.classList.add('no'); t.insertAdjacentHTML('beforeend', '<span class="tag">NOT A SOURCE</span>');
        LS.audio.ui.wrong(); LS.act.feedback(fb, 'bad', it[3]);
      }
      LS.$('#src-count', root).textContent = `Found ${found} / 4`;
      if (found === 4) { LS.badge('light-spotter'); LS.act.feedback(fb, 'good', 'You found all <b>four light sources</b>: Sun, candle flame, torch and lamp. Mirrors, spoons, books and the Moon only <b>reflect</b> light.'); }
    });
  }
});

/* ============ SLIDE 4 — REFLECTION ============ */
slides.push({
  id: 'reflection', section: 'light', lab: 'Light Lab', title: 'What Is Reflection?', time: '8–11 min',
  render: () => `
  <div class="slide s-reflect">
    ${head('Light Lab · Lesson 2', 'What is <em>reflection</em>?')}
    <div class="slide-body">
      <div class="col" style="width:540px">
        <div class="card card-light def pop" style="--d:1"><span class="def-word">Reflection</span><span class="def-text">means light <span class="hl-y">bounces off</span> a surface.</span></div>
        <div class="card tight analogy pop" style="--d:2">
          <div><svg viewBox="0 0 260 130"><rect x="0" y="112" width="260" height="10" rx="4" fill="#FF8B80"/><g class="analogy-ball"><circle cx="12" cy="40" r="11" fill="#FF8B80" stroke="#fff" stroke-width="3"/></g></svg><span>A ball bounces off the floor…</span></div>
          <div><svg viewBox="0 0 260 130"><rect x="0" y="112" width="260" height="10" rx="3" fill="#BFE6FF"/><rect x="0" y="122" width="260" height="6" fill="#6A4BE0"/><path class="ray anim-ray-in" d="M12 30 L130 109"/><path class="ray anim-ray-out" d="M130 109 L248 30"/></svg><span>…light bounces off a mirror!</span></div>
        </div>
        <div class="card tight pop" style="--d:3"><b class="small muted">Surfaces that reflect light well:</b>
          <div class="examples">${[['mirror', 'Mirror'], ['water', 'Calm water'], ['spoon', 'Shiny spoon'], ['metal', 'Polished metal']].map(e => `<div class="ex"><img src="${I(e[0])}" alt=""><span>${e[1]}</span></div>`).join('')}</div></div>
        <div class="card tight pop" style="--d:4"><b>Does light disappear when it hits a mirror?</b><div id="refl-q" style="margin-top:8px"></div></div>
      </div>
      <div class="card col grow mirror-card pop" style="--d:2">
        <div class="row" style="justify-content:space-between;align-items:center"><h3>Mirror challenge: tilt the mirror to hit the star!</h3><span class="chip" id="tgt-count">Target 1 of 3</span></div>
        <div class="grow mirror-stage"><svg class="sim-svg" viewBox="0 0 640 420" id="mirror-svg"></svg></div>
        <div class="slider-row"><button class="btn btn-sm btn-ghost" id="m-left">${ic.prev}</button><label for="m-angle">Mirror angle</label><input type="range" id="m-angle" min="-35" max="35" value="0" step="1"><button class="btn btn-sm btn-ghost" id="m-right">${ic.next}</button></div>
        <p class="small muted" id="m-tip">The light ray changes direction when you tilt the mirror. The light doesn't disappear — it is reflected!</p>
      </div>
    </div>
  </div>`,
  init(root) {
    LS.act.mcq(LS.$('#refl-q', root), { key: 'refl-q', options: [
      { t: 'Yes, it vanishes', fb: 'Look at the mirror challenge — where does the light go?' },
      { t: 'No, it is reflected in another direction', ok: true, fb: '<b>Correct!</b> The light bounces off the mirror and travels in a new direction.' }] });
    const svg = LS.$('#mirror-svg', root);
    const S = { x: 70, y: 100 }, M = { x: 320, y: 368 };
    const tAng = [-30, -90, -112], tR = [290, 300, 280];
    const targets = tAng.map((a, i) => ({ x: M.x + tR[i] * Math.cos(a * Math.PI / 180), y: M.y + tR[i] * Math.sin(a * Math.PI / 180), a }));
    const inA = Math.atan2(M.y - S.y, M.x - S.x) * 180 / Math.PI;
    svg.innerHTML = `
      <defs><radialGradient id="tglow"><stop offset="0" stop-color="#FFD76A" stop-opacity=".9"/><stop offset="1" stop-color="#FFD76A" stop-opacity="0"/></radialGradient>
      <linearGradient id="mglass" x1="0" x2="1"><stop offset="0" stop-color="#E9F7FF"/><stop offset=".5" stop-color="#9FDBFF"/><stop offset="1" stop-color="#E9F7FF"/></linearGradient></defs>
      <rect x="0" y="380" width="640" height="40" fill="#22306A"/>
      ${targets.map((t, i) => `<g class="tgt" data-i="${i}" transform="translate(${t.x},${t.y})"><circle r="40" fill="url(#tglow)" class="tg-glow" opacity="0"/><image href="assets/icons/star.svg" x="-24" y="-24" width="48" height="48"/><text y="44" text-anchor="middle" fill="#fff" font-size="16">${i + 1}</text></g>`).join('')}
      <line class="in-ray ray" x1="${S.x}" y1="${S.y}" x2="${M.x}" y2="${M.y}"/>
      <line class="out-ray ray ray-flow" x1="${M.x}" y1="${M.y}"/>
      <line class="normal" stroke="#fff" stroke-dasharray="5 6" stroke-width="2" opacity=".55"/>
      <g transform="translate(${S.x},${S.y}) rotate(${inA})"><image href="${I('torch')}" x="-105" y="-42" width="140" height="84"/></g>
      <path d="M${M.x - 26} 404 L${M.x} ${M.y + 8} L${M.x + 26} 404Z" fill="#6A4BE0"/>
      <g class="mirror-g" style="cursor:grab"><rect x="-95" y="-7" width="190" height="10" rx="3" fill="url(#mglass)"/><rect x="-95" y="3" width="190" height="7" rx="3" fill="#6A4BE0"/></g>
      <text x="16" y="30" fill="#AEB9DA" font-size="17">Torch</text>`;
    const out = LS.$('.out-ray', svg), nrm = LS.$('.normal', svg), mg = LS.$('.mirror-g', svg);
    const slider = LS.$('#m-angle', root);
    let cur = LS.store.get('mirrorTarget', 0), hitLock = false;
    const din = { x: (M.x - S.x), y: (M.y - S.y) }; const dl = Math.hypot(din.x, din.y); din.x /= dl; din.y /= dl;
    const markTargets = () => LS.$$('.tgt', svg).forEach((g, i) => { g.classList.toggle('done', i < cur); g.classList.toggle('current', i === cur); });
    const upd = () => {
      const a = +slider.value;
      mg.setAttribute('transform', `translate(${M.x},${M.y}) rotate(${a})`);
      const r = LS.act.reflect(din.x, din.y, a);
      out.setAttribute('x2', M.x + r.x * 900); out.setAttribute('y2', M.y + r.y * 900);
      nrm.setAttribute('x1', M.x); nrm.setAttribute('y1', M.y); nrm.setAttribute('x2', M.x + r.nx * 120); nrm.setAttribute('y2', M.y + r.ny * 120);
      const outA = Math.atan2(r.y, r.x) * 180 / Math.PI;
      if (cur < 3 && !hitLock && Math.abs(outA - targets[cur].a) < 3.5) {
        hitLock = true;
        const g = LS.$(`.tgt[data-i="${cur}"]`, svg); LS.$('.tg-glow', g).setAttribute('opacity', 1);
        LS.audio.ui.star(); award(`mirror-t${cur}`);
        LS.life.later(() => {
          cur++; LS.store.set('mirrorTarget', cur); hitLock = false; markTargets();
          LS.$('#tgt-count', root).textContent = cur < 3 ? `Target ${cur + 1} of 3` : 'All targets hit!';
          if (cur >= 3) { LS.badge('mirror-master'); LS.$('#m-tip', root).innerHTML = '<b class="hl-y">Mirror Master!</b> Changing the angle of the mirror changed the direction of the reflected light.'; }
        }, 700);
      }
    };
    slider.oninput = upd;
    LS.$('#m-left', root).onclick = () => { slider.value = +slider.value - 2; upd(); };
    LS.$('#m-right', root).onclick = () => { slider.value = +slider.value + 2; upd(); };
    // drag the mirror to tilt it
    let drag = null;
    mg.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, v: +slider.value }; try { mg.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } });
    mg.addEventListener('pointermove', (e) => { if (!drag) return; slider.value = drag.v + (e.clientX - drag.x) / LS.scale / 4; upd(); });
    mg.addEventListener('pointerup', () => { drag = null; });
    if (cur >= 3) LS.$('#tgt-count', root).textContent = 'All targets hit!';
    else LS.$('#tgt-count', root).textContent = `Target ${cur + 1} of 3`;
    markTargets(); upd();
  }
});

/* ============ SLIDE 5 — ABSORPTION ============ */
slides.push({
  id: 'absorption', section: 'light', lab: 'Light Lab', title: 'What Is Absorption?', time: '11–13 min',
  render: () => {
    const panel = (kind, title, txt) => `
      <div class="card tight abs-panel abs-${kind} pop" style="--d:${{ black: 1, white: 2, mirror: 3 }[kind]}">
        <svg class="sim-svg" viewBox="0 0 360 230">
          <defs><radialGradient id="heat-${kind}"><stop offset="0" stop-color="#FF8B80" stop-opacity=".8"/><stop offset="1" stop-color="#FF8B80" stop-opacity="0"/></radialGradient></defs>
          <rect x="20" y="196" width="320" height="28" rx="6" class="surf"/>
          <g class="beam">${[-14, 0, 14].map(o => `<path class="ray ray-flow" d="M${30 + o} ${24 - o * .3} L${180 + o * .4} 194"/>`).join('')}</g>
          <g class="out">${kind === 'mirror' ? [-14, 0, 14].map(o => `<path class="ray ray-flow" d="M${180 + o * .4} 194 L${330 - o} ${24 - o * .3}"/>`).join('')
            : kind === 'white' ? [-150, -128, -104, -80, -58, -36, -18].map(a => { const r = a * Math.PI / 180; return `<path class="ray ray-flow" style="opacity:.55;stroke-width:4" d="M180 194 L${180 + 120 * Math.cos(r)} ${194 + 120 * Math.sin(r)}"/>`; }).join('')
            : [-60, -110].map(a => { const r = a * Math.PI / 180; return `<path class="ray ray-flow" style="opacity:.16;stroke-width:3" d="M180 194 L${180 + 70 * Math.cos(r)} ${194 + 70 * Math.sin(r)}"/>`; }).join('') + `<ellipse class="heat" cx="180" cy="200" rx="90" ry="26" fill="url(#heat-${kind})"/>`}</g>
          ${kind === 'black' ? `<g class="thermo" transform="translate(318,60)"><rect x="-8" y="0" width="16" height="110" rx="8" fill="#fff" opacity=".9"/><rect class="merc" x="-4" y="70" width="8" height="40" rx="4" fill="#FF6F63"/><circle cy="118" r="13" fill="#FF6F63"/></g>` : ''}
        </svg>
        <h3>${title}</h3><p class="small">${txt}</p>
      </div>`;
    return `
  <div class="slide s-absorb">
    ${head('Light Lab · Lesson 3', 'What is <em>absorption</em>?', '', `<button class="btn btn-yellow pop" id="abs-shine">${ic.sun} Shine the torch!</button>`)}
    <div class="card card-light def pop" style="--d:0"><span class="def-word">Absorption</span><span class="def-text">means a material <span class="hl-y">takes in</span> light energy.</span></div>
    <div class="abs-row">
      ${panel('black', 'Black surface', 'Absorbs <b>most</b> of the light. The light energy warms it a little.')}
      ${panel('white', 'White surface', 'Reflects <b>lots</b> of light, scattered in all directions.')}
      ${panel('mirror', 'Mirror', 'Reflects light <b>very well</b> — a clear, bright reflection.')}
    </div>
    <div class="abs-bottom">
      <div class="card tight compare pop" style="--d:4"><div class="cmp"><b class="hl-y">REFLECTION</b><span>Light <b>bounces off</b> the surface.</span></div><div class="cmp"><b class="hl-r">ABSORPTION</b><span>Light is <b>taken in</b> by the material.</span></div></div>
      <div class="card tight both pop" style="--d:5"><b>Most real materials do a bit of BOTH!</b>
        <div class="bars">${[['Mirror', 92], ['White paper', 78], ['Black paper', 6]].map(b => `<div class="bar-row"><span>${b[0]}</span><div class="bar"><i style="width:${b[1]}%"></i><em style="width:${100 - b[1]}%"></em></div></div>`).join('')}
        <div class="bar-key"><span><i class="k-ref"></i>reflected</span><span><i class="k-abs"></i>absorbed</span></div></div></div>
    </div>
  </div>`;
  },
  init(root) {
    const btn = LS.$('#abs-shine', root);
    btn.onclick = () => {
      const on = !root.classList.contains('on');
      root.classList.toggle('on', on);
      btn.innerHTML = on ? `${ic.stop} Switch off` : `${ic.sun} Shine the torch!`;
      LS.audio.ui.click();
      if (on) award('abs-shine');
    };
  }
});

/* ============ SLIDE 6 — REFLECT OR ABSORB SORT ============ */
slides.push({
  id: 'sort', section: 'light', lab: 'Light Lab', title: 'Reflect or Absorb?', time: '13–15 min',
  render: () => `
  <div class="slide s-sort">
    ${head('Light Lab · Challenge', 'Reflect or absorb?', 'Drag each object into the right box (or click an object, then click a box).', `<span class="chip pop" id="sort-count">Sorted 0 / 5</span>`)}
    <div class="sort-items pop" style="--d:1" id="sort-items">
      ${[['mirror', 'Mirror', 'r'], ['black_paper', 'Black paper', 'a'], ['white_paper', 'White paper', 'r'], ['spoon', 'Shiny spoon', 'r'], ['dark_cloth', 'Dark cloth', 'a']].map(i => `<div class="sort-item" data-id="${i[0]}" data-ans="${i[2]}" tabindex="0"><img src="${I(i[0])}" alt=""><span>${i[1]}</span></div>`).join('')}
    </div>
    <div class="bins">
      <div class="bin bin-r pop" style="--d:2" data-bin="r"><div class="bin-head">${ic.sun}<b>REFLECTS MORE LIGHT</b></div><div class="bin-slot"></div></div>
      <div class="bin bin-a pop" style="--d:3" data-bin="a"><div class="bin-head">${ic.eye}<b>ABSORBS MORE LIGHT</b></div><div class="bin-slot"></div></div>
    </div>
    <div class="feedback info show" id="sort-fb"><span class="fb-icon">i</span><div>Remember: no ordinary object reflects or absorbs <b>all</b> of the light — we are sorting by which it does <b>more</b> of.</div></div>
  </div>`,
  init(root) {
    const why = {
      mirror: ['A <b>mirror</b> is smooth and shiny, so it reflects most of the light — but even a mirror absorbs a tiny bit.', 'Is a mirror dark or shiny? Smooth, shiny surfaces reflect more light.'],
      white_paper: ['<b>White paper</b> reflects lots of light (scattered in all directions) and absorbs a little.', 'White things look bright because lots of light bounces off them…'],
      spoon: ['Shiny metal like a <b>spoon</b> reflects lots of light — that\'s why you can see yourself in it!', 'Can you see your reflection in a spoon? Shiny things reflect more light.'],
      black_paper: ['<b>Black paper</b> absorbs most of the light that hits it and reflects only a little.', 'Black paper looks dark because only a little light bounces off it…'],
      dark_cloth: ['<b>Dark cloth</b> absorbs most of the light. That\'s why dark clothes warm up in sunshine.', 'Dark materials take in more light energy…']
    };
    const items = LS.$$('.sort-item', root), bins = LS.$$('.bin', root), fb = LS.$('#sort-fb', root);
    let done = 0;
    LS.act.dragSort({
      items, bins,
      check: (it, bin) => ({ ok: it.dataset.ans === bin.dataset.bin }),
      onPlaced: (it, bin, res) => {
        const w = why[it.dataset.id];
        if (res.ok) {
          done++; award(`sort-${it.dataset.id}`);
          LS.act.feedback(fb, 'good', w[0]);
          LS.$('#sort-count', root).textContent = `Sorted ${done} / 5`;
          if (done === 5) { LS.badge('sorter'); LS.act.feedback(fb, 'good', '<b>All sorted!</b> Shiny, smooth and light-coloured surfaces reflect more light. Dark surfaces absorb more. Most materials do a bit of both.'); }
        } else LS.act.feedback(fb, 'bad', w[1]);
      }
    });
  }
});

/* ============ SLIDE 7 — MIRROR DETECTIVE PRACTICAL ============ */
slides.push({
  id: 'detective', section: 'light', lab: 'Light Lab', title: 'Practical: Mirror Detective', time: '15–22 min',
  render: () => `
  <div class="slide s-detect">
    ${head('Light Lab · Practical investigation', 'Mirror <em>Detective</em>')}
    <div class="slide-body">
      <div class="col" style="width:440px">
        <div class="card tight pop" style="--d:1"><b class="small muted">You will need:</b><div class="row" style="flex-wrap:wrap;gap:8px;margin-top:6px">${[['torch', 'Torch'], ['mirror', 'Mirror'], ['white_paper', 'White paper'], ['black_paper', 'Black paper']].map(e => `<span class="chip"><img src="${I(e[0])}" alt="">${e[1]}</span>`).join('')}</div></div>
        <div class="safety pop" style="--d:2">${ic.alert}<span><b>Safety:</b> never shine a torch into anyone's eyes — including your own!</span></div>
        <div class="card pop" style="--d:3" id="det-instr"></div>
        <div class="card tight conclusion grow pop" style="--d:5" id="det-concl"><b class="hl-y">Conclusion:</b> <span class="concl-text">Reveal all four answers to unlock the conclusion.</span></div>
      </div>
      <div class="col grow">
        <div class="card tight det-sim pop" style="--d:2">
          <div class="row" style="justify-content:space-between;align-items:center"><b>Virtual lab (backup)</b>
            <div class="seg" id="det-surf"><button data-s="mirror" class="on">Mirror</button><button data-s="white">White paper</button><button data-s="black">Black paper</button></div></div>
          <svg class="sim-svg" viewBox="0 0 680 270" id="det-svg"></svg>
          <div class="slider-row"><label for="det-tilt">Tilt the mirror</label><input type="range" id="det-tilt" min="-8" max="8" value="0"><span class="chip" id="det-bright">Brightness on wall: ●●●●●</span></div>
        </div>
        <div class="det-qs">
          ${reveal('Which object reflected light most clearly?', 'The <b>mirror</b> — it made a bright, clear spot of light on the wall.')}
          ${reveal('What happened when the mirror was tilted?', 'The reflected light <b>moved</b> — it changed direction.')}
          ${reveal('Did black paper reflect as much visible light as white paper?', '<b>No.</b> Black paper absorbed most of the light, so much less light was reflected.')}
          ${reveal('What is the difference between reflection and absorption?', '<b>Reflection:</b> light bounces off. <b>Absorption:</b> the material takes in the light energy.')}
        </div>
      </div>
    </div>
  </div>`,
  init(root) {
    LS.act.instructions(LS.$('#det-instr', root), [
      'Shine a torch towards a <b class="hl-y">mirror</b>.',
      'Observe the <b>reflected light</b>. Where does it land?',
      '<b>Tilt</b> the mirror a little.',
      'Observe the <b>change in direction</b> of the light.',
      'Shine the light on <b>white</b> paper, then <b>black</b> paper.',
      '<b>Compare</b> the results. Which reflects more light?'
    ], { onDone: () => award('det-instr') });
    const svg = LS.$('#det-svg', root), tilt = LS.$('#det-tilt', root), bright = LS.$('#det-bright', root);
    const T = { x: 90, y: 150 }, P = { x: 340, y: 236 };
    let surf = 'mirror'; const tried = new Set(['mirror']);
    const ang = Math.atan2(P.y - T.y, P.x - T.x) * 180 / Math.PI;
    svg.innerHTML = `<defs><radialGradient id="spot"><stop offset="0" stop-color="#FFFBE6"/><stop offset=".4" stop-color="#FFD76A" stop-opacity=".9"/><stop offset="1" stop-color="#FFD76A" stop-opacity="0"/></radialGradient>
      <radialGradient id="wash"><stop offset="0" stop-color="#FFD76A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD76A" stop-opacity="0"/></radialGradient></defs>
      <rect x="640" y="-200" width="300" height="700" fill="#2B3C7E"/><text x="662" y="200" fill="#AEB9DA" font-size="16" transform="rotate(-90 662 200)">WALL</text>
      <ellipse class="wash" cx="646" cy="120" rx="34" ry="170" fill="url(#wash)"/>
      <circle class="spot" r="30" cx="646" fill="url(#spot)"/>
      <rect x="-300" y="246" width="1300" height="60" fill="#22306A"/>
      <line class="ray" x1="${T.x}" y1="${T.y}" x2="${P.x}" y2="${P.y}"/>
      <g class="scat"></g>
      <line class="out ray ray-flow" x1="${P.x}" y1="${P.y}"/>
      <g class="surf-g"></g>
      <g transform="translate(${T.x},${T.y}) rotate(${ang})"><image href="${I('torch')}" x="-100" y="-36" width="120" height="72"/></g>`;
    const out = LS.$('.out', svg), spot = LS.$('.spot', svg), wash = LS.$('.wash', svg), scat = LS.$('.scat', svg), sg = LS.$('.surf-g', svg);
    const d = { x: P.x - T.x, y: P.y - T.y }; const L = Math.hypot(d.x, d.y); d.x /= L; d.y /= L;
    const draw = () => {
      const a = surf === 'mirror' ? +tilt.value : 0;
      tilt.disabled = surf !== 'mirror';
      const fill = { mirror: '#BFE6FF', white: '#FFFFFF', black: '#16181F' }[surf];
      sg.innerHTML = `<g transform="translate(${P.x},${P.y + 4}) rotate(${a})"><rect x="-80" y="-5" width="160" height="10" rx="3" fill="${fill}" stroke="${surf === 'black' ? '#444' : '#8FD3FF'}"/></g>`;
      const r = LS.act.reflect(d.x, d.y, a);
      const k = (640 - P.x) / r.x; const sy = LS.clamp(P.y + r.y * k, 4, 236);
      if (surf === 'mirror') {
        out.style.display = ''; out.setAttribute('x2', 640); out.setAttribute('y2', sy);
        spot.style.display = ''; spot.setAttribute('cy', sy); wash.style.opacity = 0; scat.innerHTML = '';
        bright.textContent = 'Reflection: bright & clear ●●●●●';
      } else {
        out.style.display = 'none'; spot.style.display = 'none';
        const op = surf === 'white' ? .5 : .07;
        wash.style.opacity = surf === 'white' ? 1 : .12;
        scat.innerHTML = [-160, -135, -110, -85, -60, -35, -15].map(g => { const rr = g * Math.PI / 180; return `<line class="ray" style="opacity:${op};stroke-width:4" x1="${P.x}" y1="${P.y}" x2="${P.x + 150 * Math.cos(rr)}" y2="${P.y + 150 * Math.sin(rr)}"/>`; }).join('');
        bright.textContent = surf === 'white' ? 'Reflection: dimmer, spread out ●●●○○' : 'Reflection: very little ●○○○○';
      }
    };
    LS.$$('#det-surf button', root).forEach(b => b.onclick = () => {
      surf = b.dataset.s; tried.add(surf);
      LS.$$('#det-surf button', root).forEach(x => x.classList.toggle('on', x === b));
      LS.audio.ui.click(); draw();
      if (tried.size === 3) award('det-tried-all');
    });
    tilt.oninput = draw;
    draw();
    LS.act.reveals(root, { key: 'det-qs', onAll: () => {
      LS.$('#det-concl .concl-text', root).innerHTML = 'Smooth, shiny surfaces like mirrors reflect light clearly. Tilting the mirror changes the <b>direction</b> of the reflected light. White surfaces reflect more light than black surfaces, which <b>absorb</b> more.';
      LS.$('#det-concl', root).classList.add('glow');
      LS.badge('light-detective');
    } });
  }
});

/* ============ SLIDE 8 — HOW ARE SOUNDS MADE? ============ */
slides.push({
  id: 'vibrations', section: 'vibe', lab: 'Sound Lab', title: 'How Are Sounds Made?', time: '22–26 min',
  render: () => `
  <div class="slide s-vibe">
    ${head('Sound Lab · Lesson 1', 'How are <em>sounds</em> made?')}
    <div class="slide-body">
      <div class="col" style="width:560px">
        <div class="card card-sound pop" style="--d:1">
          <div class="def"><span class="def-word">Sounds</span><span class="def-text">are made by <span class="hl-c">vibrations</span>.</span></div>
          <div class="vib-explain"><div class="vib-demo"><i></i></div><span>A <b>vibration</b> is a quick <b>back-and-forth</b> movement.</span></div>
        </div>
        <div class="card tight grow pop" style="--d:2">
          <div class="row" style="justify-content:space-between;align-items:center"><b>Pluck the guitar string!</b><span class="small muted" id="str-state">Click or drag the string</span></div>
          <svg class="sim-svg" viewBox="0 0 540 170" id="str-svg" style="height:160px">
            <rect x="10" y="40" width="40" height="90" rx="10" fill="#6B3A1E"/><rect x="490" y="40" width="40" height="90" rx="10" fill="#6B3A1E"/>
            <path class="ghost" fill="rgba(83,230,223,.18)"/>
            <path class="str" stroke="#F4F1E8" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path class="hit" stroke="transparent" stroke-width="60" fill="none" d="M40 85 L500 85" style="cursor:pointer"/>
          </svg>
        </div>
        <div class="card tight pop" style="--d:3"><b>Can you make a sound without something vibrating?</b><div id="vib-q" style="margin-top:8px"></div></div>
      </div>
      <div class="col grow">
        <div class="vib-grid">
          ${[['guitar', 'Guitar string', 'The string moves back and forth very quickly.', 'gtr'],
             ['drum', 'Drum skin', 'The drum skin moves up and down. Rice grains on top jump!', 'drm'],
             ['tuning_fork', 'Tuning fork', 'The prongs vibrate so fast they look blurry. Dip them in water to see splashes!', 'tf'],
             ['singer', 'Vocal cords', 'Your vocal cords vibrate when you speak or hum. Gently touch your throat and hum!', 'vc']].map((v, i) => `
            <button class="card tight vib-card pop" style="--d:${2 + i}" data-k="${v[3]}">
              <div class="vib-img">${v[3] === 'drm' ? '<div class="rice"><i></i><i></i><i></i><i></i><i></i></div>' : ''}${v[3] === 'vc' ? '<svg class="cords" viewBox="0 0 60 40"><path d="M8 20 Q30 8 52 20" /><path d="M8 20 Q30 32 52 20"/></svg>' : ''}<img src="${I(v[0])}" alt="${v[1]}"><div class="vib-waves"><i></i><i></i></div></div>
              <b>${v[1]}</b><span class="vib-cap">${ic.play} Click to make it vibrate</span><span class="vib-fact">${v[2]}</span>
            </button>`).join('')}
        </div>
      </div>
    </div>
  </div>`,
  init(root) {
    LS.act.mcq(LS.$('#vib-q', root), { key: 'vib-q', options: [
      { t: 'Yes', fb: 'Think about every sound you know — a drum, your voice, a bell…' },
      { t: 'No', ok: true, fb: '<b>Correct!</b> Every sound is made by something vibrating — even when the vibrations are too small or too fast to see.' }] });
    // guitar string
    const svg = LS.$('#str-svg', root), str = LS.$('.str', svg), ghost = LS.$('.ghost', svg), state = LS.$('#str-state', root);
    let A = 0, A0 = 0, t0 = 0, vib = false;
    const drawStr = () => { str.setAttribute('d', `M40 85 Q270 ${85 + A * 2} 500 85`); };
    const pluck = (amp) => {
      A0 = amp; t0 = performance.now() / 1000; vib = true; LS.audio.pluck(196, 2.2, { vol: .7 }); state.textContent = 'Vibrating!'; award('pluck');
      LS.life.loop((t) => {
        const el = t - t0, env = A0 * Math.exp(-el / .9);
        A = env * Math.cos(2 * Math.PI * 9 * el); drawStr();
        ghost.setAttribute('d', `M40 85 Q270 ${85 - Math.abs(env) * 2} 500 85 Q270 ${85 + Math.abs(env) * 2} 40 85Z`);
        if (Math.abs(env) < .4) { vib = false; A = 0; drawStr(); ghost.setAttribute('d', ''); state.textContent = 'Still — and silent. Pluck again!'; return false; }
      });
    };
    const hit = LS.$('.hit', svg);
    let dragY = null;
    const toSvgY = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()).y; };
    hit.addEventListener('pointerdown', (e) => { if (vib) return; dragY = toSvgY(e); try { hit.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } });
    hit.addEventListener('pointermove', (e) => { if (dragY === null) return; A = LS.clamp((toSvgY(e) - 85) / 2, -30, 30); drawStr(); });
    hit.addEventListener('pointerup', () => { if (dragY === null) return; dragY = null; pluck(Math.abs(A) > 4 ? A : 24); });
    drawStr();
    // object cards
    const seen = new Set();
    const sounds = { gtr: () => LS.audio.pluck(165, 2, { vol: .7 }), drm: () => LS.audio.drum(80), tf: () => LS.audio.tone(440, 2.2, { vol: .35, attack: .005 }), vc: () => LS.audio.voice(200, 1.4, { vol: .45 }) };
    LS.$$('.vib-card', root).forEach(c => c.onclick = () => {
      const k = c.dataset.k;
      c.classList.add('vibrating', 'revealed'); sounds[k]();
      clearTimeout(c._t); c._t = setTimeout(() => c.classList.remove('vibrating'), k === 'tf' ? 2000 : 1300);
      seen.add(k); award(`vib-${k}`);
      if (seen.size === 4) LS.badge('vibe-hunter');
    });
  }
});

/* ============ SLIDE 9 — VIBRATING RULER PRACTICAL ============ */
slides.push({
  id: 'ruler-practical', section: 'vibe', lab: 'Sound Lab', title: 'Practical: Vibrating Ruler', time: '26–30 min',
  render: () => `
  <div class="slide s-rulerp">
    ${head('Sound Lab · Practical investigation', 'The <em>vibrating ruler</em>')}
    <div class="slide-body">
      <div class="card col pop" style="width:400px;--d:1">
        <h3>Instructions</h3>
        <ol class="steps compact dim" id="rp-steps">
          <li>Place one end of the ruler on the desk.</li>
          <li>Let the other end hang over the edge.</li>
          <li>Hold the ruler <b>firmly</b> on the desk.</li>
          <li>Pull the hanging end down <b>gently</b>.</li>
          <li><b>Release</b> it!</li>
          <li><b>Observe</b> the vibrations and <b>listen</b>.</li>
        </ol>
        <p class="small muted">In the virtual lab: drag the end of the ruler down and let go — or press <b>Twang!</b></p>
      </div>
      <div class="col grow">
        <div class="card tight rp-sim pop" style="--d:2">
          <div class="grow" id="rp-host"></div>
          <div class="rp-status">
            <span class="chip" id="rp-ruler">Ruler: still</span>
            <span class="chip" id="rp-sound">Sound: silent <span class="meter" id="rp-meter"><i></i><i></i><i></i><i></i><i></i></span></span>
            <button class="btn btn-sm btn-cyan" id="rp-twang">${ic.hand} Twang!</button>
          </div>
        </div>
        <div class="rp-qs">
          ${reveal('What is moving?', 'The end of the ruler that hangs over the desk. It moves up and down quickly — it <b>vibrates</b>.')}
          ${reveal('What can you hear?', 'A buzzing, twangy <b>sound</b> made by the vibrating ruler.')}
          ${reveal('What happens when the ruler stops moving?', 'The <b>sound stops</b> too!')}
        </div>
        <div class="card tight conclusion pop" style="--d:4" id="rp-concl"><b class="hl-c">Conclusion:</b> <span>Twang the ruler and watch until it stops…</span></div>
      </div>
    </div>
  </div>`,
  init(root) {
    const steps = LS.act.stepList(LS.$('#rp-steps', root));
    steps.go(3);
    const meter = LS.$$('#rp-meter i', root);
    const sim = LS.act.rulerSim(LS.$('#rp-host', root), {
      overhang: 15,
      onRelease: () => { steps.go(5); award('rp-twang'); },
      onMove: ({ vibrating, amp }) => {
        LS.$('#rp-ruler', root).textContent = vibrating ? 'Ruler: vibrating!' : 'Ruler: still';
        LS.$('#rp-sound', root).firstChild.textContent = vibrating ? 'Sound: playing ' : 'Sound: silent ';
        const lv = Math.ceil(LS.clamp(amp / 10, 0, 5)); meter.forEach((m, i) => m.classList.toggle('on', i < lv));
      },
      onStop: () => {
        const c = LS.$('#rp-concl', root);
        c.innerHTML = '<b class="hl-c">Conclusion:</b> The ruler <b>vibrates</b> and produces sound. When its vibrations stop, <b>the sound stops</b>.';
        c.classList.add('glow'); LS.badge('ruler-twanger');
      }
    });
    LS.$('#rp-twang', root).onclick = () => sim.pluck(45);
    LS.act.reveals(root, { key: 'rp-qs' });
  }
});

/* ============ SLIDE 10 — HOW SOUND REACHES OUR EARS ============ */
slides.push({
  id: 'travel', section: 'travel', lab: 'Sound Lab', title: 'How Does Sound Reach Our Ears?', time: '30–34 min',
  render: () => `
  <div class="slide s-travel">
    ${head('Sound Lab · Lesson 2', 'How does sound reach our <em>ears</em>?')}
    <div class="chain pop" style="--d:1" id="chain">
      ${['Vibrating object', 'Air particles', 'Sound waves', 'Ear', 'Brain'].map((c, i) => `${i ? `<span class="chain-arrow">${ic.next}</span>` : ''}<span class="chain-chip" data-i="${i}">${c}</span>`).join('')}
    </div>
    <div class="slide-body" style="flex:none;height:318px">
      <div class="card tight grow travel-card pop" style="--d:2">
        <img src="${I('speaker')}" class="tr-speaker" id="tr-speaker" alt="Speaker">
        <canvas id="tr-canvas"></canvas>
        <img src="${I('ear')}" class="tr-ear" id="tr-ear" alt="Ear">
        <div class="tr-heard" id="tr-heard">Sound heard!</div>
        <div class="tr-note"><i></i>Watch the <b class="hl-r">red particle</b>: it only wiggles back and forth around its place — it does <b>not</b> travel to the ear!</div>
        <button class="btn btn-sm btn-cyan tr-btn" id="tr-go">${ic.play} Make it vibrate</button>
      </div>
      <div class="card tight col pop" style="width:390px;--d:3">
        <ol class="steps compact dim" id="tr-steps">
          <li>An object <b>vibrates</b>.</li>
          <li>It makes nearby <b>air particles</b> vibrate.</li>
          <li>The vibrations pass from particle to particle as <b>sound waves</b>.</li>
          <li>The sound reaches our <b>ears</b>.</li>
          <li>Our ears detect the vibrations and our <b>brain</b> recognises the sound.</li>
        </ol>
      </div>
    </div>
    <div class="tr-bottom">
      <div class="card tight card-sound pop" style="--d:4"><div class="def"><span class="def-word" style="font-size:26px">MEDIUM</span><span class="def-text" style="font-size:20px">a material that sound travels through.</span></div>
        <div class="row" style="margin-top:8px;flex-wrap:wrap;gap:8px"><span class="chip">Air (gas)</span><span class="chip">Water (liquid)</span><span class="chip">Solids — wood, metal</span></div></div>
      <div class="card tight vacuum pop" style="--d:5"><div class="vac-jar"><img src="${I('bell')}" alt=""></div><div><b>No particles, no sound!</b><p class="small">A <b>vacuum</b> is completely empty space. Sound <b>cannot</b> travel through a vacuum because there are no particles to pass the vibrations along.</p></div></div>
    </div>
  </div>`,
  init(root) {
    const cv = LS.$('#tr-canvas', root), sp = LS.$('#tr-speaker', root), ear = LS.$('#tr-ear', root), heard = LS.$('#tr-heard', root);
    const chips = LS.$$('.chain-chip', root);
    const lightChain = (k) => chips.forEach((c, i) => c.classList.toggle('on', i <= k));
    const st = LS.act.stepList(LS.$('#tr-steps', root), { onStep: (k) => lightChain(k) });
    const field = LS.act.particles(cv, { layout: 'grid', cols: 24, rows: 7, x0: 30, top: 24, amp: 8, speed: 150, fv: 2.2, highlight: true, dot: 6,
      onArrive: () => { ear.classList.add('hear'); heard.classList.add('show'); st.go(4); award('travel-heard'); LS.badge('wave-watcher'); } });
    let on = false;
    const btn = LS.$('#tr-go', root);
    btn.onclick = () => {
      on = !on; LS.audio.ui.click();
      if (on) { field.start(); st.go(0); LS.life.later(() => on && st.go(1), 700); LS.life.later(() => on && st.go(2), 1600); LS.life.later(() => on && st.go(3), 2700); btn.innerHTML = `${ic.stop} Stop vibrating`; LS.audio.tone(330, 1.2, { vol: .2 }); }
      else { field.stop(); ear.classList.remove('hear'); heard.classList.remove('show'); btn.innerHTML = `${ic.play} Make it vibrate`; }
    };
    LS.life.loop((t) => { sp.style.transform = `translateX(${field.source(t) * 4}px)`; });
  }
});

/* ============ SLIDE 11 — SOUND TRAVEL CHALLENGE ============ */
slides.push({
  id: 'media', section: 'travel', lab: 'Sound Lab', title: 'Sound Travel Challenge', time: '34–37 min',
  render: () => `
  <div class="slide s-media">
    ${head('Sound Lab · Challenge', 'Can sound <em>travel</em> through it?', 'Answer, then press <b>Test it</b> to watch the particle model.')}
    <div class="media-grid">
      ${[['air', 'Air', 'a gas', 'Can sound travel through <b>air</b>?'], ['water', 'Water', 'a liquid', 'Can sound travel through <b>water</b>?'], ['solid', 'Wood / metal', 'a solid', 'Can sound travel through a <b>solid</b>?'], ['vac', 'Vacuum', 'empty space — bonus!', 'Can sound travel through a <b>vacuum</b>?']].map((m, i) => `
        <div class="card tight media-card media-${m[0]} pop" style="--d:${i + 1}" data-m="${m[0]}">
          <div class="media-top"><h3>${m[1]}</h3><span class="small muted">${m[2]}</span></div>
          <div class="media-sim"><img class="m-src" src="${I('bell')}" alt=""><canvas></canvas><img class="m-ear" src="${I('ear')}" alt=""><span class="m-res"></span></div>
          <p class="mq">${m[3]}</p>
          <div class="mcq"></div>
          <button class="btn btn-sm btn-ghost m-test">${ic.play} Test it</button>
        </div>`).join('')}
    </div>
    <div class="card media-summary pop" style="--d:5" id="media-sum"><span class="muted">Answer all four to reveal the big rule…</span></div>
  </div>`,
  init(root) {
    const cfg = {
      air: { layout: 'gas', speed: 110, color: '#9BE7FF', yes: true, res: 'Heard it! Air particles passed the vibrations along.' },
      water: { layout: 'liquid', speed: 220, color: '#45B8FF', yes: true, res: 'Heard it! Sound travels faster in water than in air.' },
      solid: { layout: 'solid', speed: 380, color: '#E8B87A', yes: true, res: 'Heard it! Solids pass vibrations on fastest of all.' },
      vac: { layout: 'none', speed: 200, color: '#fff', yes: false, res: 'Silence… no particles to pass the vibrations on.' }
    };
    const fb = {
      air: ['<b>Yes!</b> Most sounds we hear travel through air.', 'Air is a gas made of particles. Can they pass on vibrations?'],
      water: ['<b>Yes!</b> Whales and dolphins hear each other underwater.', 'Have you heard sounds while swimming underwater?'],
      solid: ['<b>Yes!</b> Put your ear on a desk and tap it — you\'ll hear it clearly.', 'Try putting your ear on a table while someone taps it…'],
      vac: ['<b>Correct!</b> Sound cannot travel through a vacuum — there are no particles. Space is silent!', 'A vacuum has no particles at all. Can vibrations be passed on with nothing there?']
    };
    let answered = 0;
    LS.$$('.media-card', root).forEach(card => {
      const m = card.dataset.m, c = cfg[m];
      const field = LS.act.particles(LS.$('canvas', card), { layout: c.layout, x0: 48, x1: 216, top: 14, bottom: 106, amp: 5, speed: c.speed, fv: 3, pulse: true, pulseLen: 1.3, dot: c.layout === 'gas' ? 4.5 : 4, color: c.color,
        onArrive: () => { if (c.yes) { card.classList.add('heard'); } },
        onEnd: () => { card.classList.remove('testing'); } });
      LS.act.mcq(LS.$('.mcq', card), { key: `media-${m}`, options: [{ t: 'Yes', ok: c.yes, fb: c.yes ? fb[m][0] : fb[m][1] }, { t: 'No', ok: !c.yes, fb: c.yes ? fb[m][1] : fb[m][0] }],
        onCorrect: () => { answered++; if (answered === 4) showSum(); } });
      LS.$('.m-test', card).onclick = () => {
        card.classList.remove('heard'); card.classList.add('testing');
        LS.$('.m-res', card).textContent = c.res;
        LS.audio.bell(1046);
        if (!c.yes) LS.life.later(() => card.classList.remove('testing'), 1500);
        field.start(); award(`media-test-${m}`);
      };
    });
    const showSum = () => {
      const s = LS.$('#media-sum', root);
      s.innerHTML = `<b>The big rule:</b> Sound can travel through <span class="hl-c">gases</span>, <span class="hl-c">liquids</span> and <span class="hl-c">solids</span>. Sound <span class="hl-r">cannot</span> travel through a <b>vacuum</b>.`;
      s.classList.add('glow'); LS.badge('sound-traveller');
    };
  }
});

/* ============ SLIDE 12 — STRING TELEPHONE ============ */
slides.push({
  id: 'telephone', section: 'travel', lab: 'Sound Lab', title: 'Practical: String Telephone', time: '37–40 min',
  render: () => `
  <div class="slide s-phone">
    ${head('Sound Lab · Practical investigation', 'The <em>string telephone</em>')}
    <div class="slide-body">
      <div class="card col pop" style="width:400px;--d:1">
        <div class="row" style="gap:8px;flex-wrap:wrap"><span class="chip"><img src="${I('cup')}" alt="">2 paper cups</span><span class="chip">${ic.wave} Long string</span></div>
        <ol class="steps compact" style="gap:5px">
          <li>Make a small hole in the bottom of each cup.</li>
          <li>Thread the string through and knot it inside.</li>
          <li>Two students stand far apart.</li>
          <li>One speaks into one cup.</li>
          <li>The other listens through the second cup.</li>
          <li>Keep the string <b>tight</b>.</li>
          <li>Repeat with the string <b>loose</b>.</li>
        </ol>
      </div>
      <div class="col grow">
        <div class="card tight phone-sim pop" style="--d:2">
          <div class="row" style="justify-content:space-between;align-items:center">
            <div class="seg" id="ph-mode"><button data-m="tight" class="on">Tight string</button><button data-m="loose">Loose string</button></div>
            <span class="chip" id="ph-res">Press speak!</span>
            <button class="btn btn-sm btn-cyan" id="ph-speak">${ic.play} Speak: "Hello!"</button>
          </div>
          <svg class="sim-svg" viewBox="0 0 760 250" id="ph-svg"></svg>
        </div>
        <div class="card tight card-sound pop small" style="--d:3"><b>How it works:</b> Your voice makes the first cup <b>vibrate</b>. The vibrations travel along the <b>tight string</b> to the second cup. The second cup vibrates and makes sound your friend can hear. A loose, floppy string doesn't pass the vibrations on well.</div>
        <div class="phone-qs">
          ${reveal('What happens when the string is tight?', 'You hear the voice <b>clearly</b> — the vibrations travel along the string.')}
          ${reveal('What happens when the string is loose?', 'The sound is <b>very quiet</b> or can\'t be heard — the floppy string doesn\'t pass the vibrations on well.')}
          ${reveal('How does the sound reach the other cup?', 'As <b>vibrations</b> passed along the string. The string is a solid medium.')}
        </div>
      </div>
    </div>
  </div>`,
  init(root) {
    const svg = LS.$('#ph-svg', root);
    const kid = (x, flip, col) => `<g transform="translate(${x},0)${flip ? ' scale(-1,1)' : ''}">
        <path d="M-50 250 Q-50 170 0 166 Q50 170 50 250Z" fill="${col}"/>
        <circle cx="0" cy="118" r="46" fill="#F1B48A"/><path d="M-46 112 Q-42 66 0 66 Q44 66 46 112 Q30 88 0 90 Q-26 88 -46 112Z" fill="#2A1C73"/>
        <circle cx="16" cy="114" r="5" fill="#1C1640"/><ellipse cx="30" cy="136" rx="7" ry="5" fill="#8A3A2E"/></g>`;
    svg.innerHTML = `${kid(80, false, '#FF8B80')}${kid(680, true, '#9274FF')}
      <path class="string" id="ph-string" stroke="#F4F1E8" stroke-width="3" fill="none"/>
      <g class="cupA" transform="translate(150,124) rotate(-90)"><image href="${I('cup')}" x="-34" y="-20" width="68" height="80"/></g>
      <g class="cupB" transform="translate(610,124) rotate(90)"><image href="${I('cup')}" x="-34" y="-20" width="68" height="80"/></g>
      <g id="ph-pulses"></g>
      <g class="bubble-a" opacity="0"><rect x="10" y="4" width="140" height="40" rx="20" fill="#fff"/><text x="80" y="31" text-anchor="middle" fill="#101A35" font-size="19">"Hello!"</text></g>
      <g class="bubble-b" opacity="0"><rect x="560" y="4" width="190" height="40" rx="20" fill="#fff"/><text x="655" y="31" text-anchor="middle" fill="#101A35" font-size="18" class="bubble-b-t"></text></g>`;
    const string = LS.$('#ph-string', svg), pulses = LS.$('#ph-pulses', svg);
    let mode = 'tight'; const tested = new Set();
    const setPath = () => string.setAttribute('d', mode === 'tight' ? 'M200 124 L560 124' : 'M200 124 Q380 250 560 124');
    setPath();
    LS.$$('#ph-mode button', root).forEach(b => b.onclick = () => { mode = b.dataset.m; LS.$$('#ph-mode button', root).forEach(x => x.classList.toggle('on', x === b)); setPath(); LS.audio.ui.click(); });
    let busy = false;
    LS.$('#ph-speak', root).onclick = () => {
      if (busy) return; busy = true;
      const len = string.getTotalLength();
      const cupA = LS.$('.cupA image', svg), cupB = LS.$('.cupB image', svg);
      LS.$('.bubble-a', svg).setAttribute('opacity', 1);
      cupA.classList.add('vib-x');
      LS.audio.hello({ vol: .5 });
      const reach = mode === 'tight' ? 1 : .42;
      pulses.innerHTML = [0, 1, 2, 3].map(() => '<circle r="7" fill="#53E6DF"/>').join('');
      const dots = LS.$$('circle', pulses);
      const t0 = performance.now();
      LS.life.loop(() => {
        const el = (performance.now() - t0) / 1000;
        dots.forEach((d, i) => {
          const p = LS.clamp((el - i * .12) / 1.0, 0, 1);
          const along = p * len;
          const pt = string.getPointAtLength(Math.min(along, len));
          d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y);
          const fade = mode === 'tight' ? 1 : LS.clamp(1 - p / reach, 0, 1);
          d.setAttribute('opacity', p <= 0 || p >= 1 ? 0 : fade);
        });
        if (el > 1.5) {
          cupA.classList.remove('vib-x');
          if (!busy) return false;
          busy = false;
          tested.add(mode);
          const bb = LS.$('.bubble-b', svg); bb.setAttribute('opacity', 1);
          LS.$('.bubble-b-t', svg).textContent = mode === 'tight' ? 'I can hear you!' : 'Huh? Very quiet…';
          LS.$('#ph-res', root).textContent = mode === 'tight' ? 'Clear sound!' : 'Very quiet / nothing';
          if (mode === 'tight') { cupB.classList.add('vib-x'); LS.audio.hello({ vol: .4 }); LS.life.later(() => cupB.classList.remove('vib-x'), 900); }
          else LS.audio.hello({ vol: .05, muffled: true });
          LS.life.later(() => { LS.$('.bubble-a', svg).setAttribute('opacity', 0); bb.setAttribute('opacity', 0); }, 2200);
          award(`phone-${mode}`);
          if (tested.size === 2) LS.badge('telephone');
          return false;
        }
      });
    };
    LS.act.reveals(root, { key: 'phone-qs' });
  }
});

/* ============ SLIDE 13 — WHAT IS PITCH? ============ */
slides.push({
  id: 'pitch', section: 'pitch', lab: 'Sound Lab', title: 'What Is Pitch?', time: '40–42 min',
  render: () => {
    const tile = (k, img, name) => `<button class="tile pitch-tile" data-k="${k}"><img src="${I(img)}" alt=""><span>${name}</span><span class="play-ic">${ic.play}</span></button>`;
    return `
  <div class="slide s-pitch">
    ${head('Sound Lab · Lesson 3', 'What is <em>pitch</em>?')}
    <div class="card card-sound def pop" style="--d:1"><span class="def-word">Pitch</span><span class="def-text">tells us how <span class="hl-c">high</span> or <span class="hl-p">low</span> a sound is.</span><span class="small muted" style="margin-left:auto">Click each one to listen!</span></div>
    <div class="pitch-body">
      <div class="card pitch-col high pop" style="--d:2"><h3>${ic.note} HIGH-pitched</h3><div class="pitch-tiles">${tile('bird', 'bird', 'Bird chirping')}${tile('whistle', 'whistle', 'Whistle')}${tile('bell', 'bell', 'Small bell')}${tile('squeak', 'duck', 'Squeaky toy')}</div></div>
      <div class="card pitch-meter-card pop" style="--d:3">
        <div class="pm-label top">HIGH</div>
        <div class="pm-track"><div class="pm-marker" id="pm-marker"><span id="pm-name">?</span></div></div>
        <div class="pm-label bot">LOW</div>
        <button class="btn btn-sm" id="pm-compare">${ic.play} High vs low</button>
      </div>
      <div class="card pitch-col low pop" style="--d:4"><h3>${ic.note} LOW-pitched</h3><div class="pitch-tiles">${tile('thunder', 'thunder', 'Thunder')}${tile('drum', 'drum', 'Large drum')}${tile('bass', 'bass_guitar', 'Bass guitar')}${tile('deep', 'deep_voice', 'Deep voice')}</div></div>
    </div>
  </div>`;
  },
  init(root) {
    const A = LS.audio;
    const map = { bird: [.95, () => A.chirp(), 'Bird'], whistle: [.9, () => A.whistle(), 'Whistle'], bell: [.84, () => A.bell(1760), 'Small bell'], squeak: [.76, () => A.squeak(), 'Squeaky toy'],
      thunder: [.04, () => A.thunder(), 'Thunder'], drum: [.13, () => A.drum(55, { dur: 1.1 }), 'Large drum'], bass: [.2, () => A.pluck(82, 2.2, { vol: .9, bright: .2 }), 'Bass guitar'], deep: [.26, () => A.voice(95, 1.3, { vol: .5 }), 'Deep voice'] };
    const marker = LS.$('#pm-marker', root), name = LS.$('#pm-name', root);
    const setM = (v, n) => { marker.style.bottom = `calc(${v * 100}% - 22px)`; name.textContent = n; marker.classList.add('show'); };
    const played = new Set();
    LS.$$('.pitch-tile', root).forEach(t => t.onclick = () => {
      const m = map[t.dataset.k]; m[1](); setM(m[0], m[2]);
      t.classList.add('wobble'); setTimeout(() => t.classList.remove('wobble'), 600);
      played.add(t.dataset.k); award(`pitch-${t.dataset.k}`);
      if (played.size === 8) LS.badge('pitch-pro');
    });
    LS.$('#pm-compare', root).onclick = () => {
      A.tone(880, .7, { vol: .35 }); setM(.85, 'High note');
      LS.life.later(() => { A.tone(220, .8, { vol: .45 }); setM(.2, 'Low note'); }, 900);
      award('pitch-compare');
    };
  }
});

/* ============ SLIDE 14 — FREQUENCY ============ */
slides.push({
  id: 'frequency', section: 'pitch', lab: 'Sound Lab', title: 'Frequency — Fast and Slow Vibrations', time: '42–43 min',
  render: () => `
  <div class="slide s-freq">
    ${head('Sound Lab · Lesson 4', '<em>Frequency</em>: fast and slow vibrations')}
    <div class="card card-sound def pop" style="--d:1"><span class="def-word">Frequency</span><span class="def-text">means the <span class="hl-c">number of vibrations</span> in one second.</span></div>
    <div class="freq-row">
      ${[['hi', 'HIGH PITCH', 'Fast vibrations', 'More vibrations per second', 'Higher frequency', 'hl-c'], ['lo', 'LOW PITCH', 'Slow vibrations', 'Fewer vibrations per second', 'Lower frequency', 'hl-p']].map((f, i) => `
      <div class="card tight freq-card freq-${f[0]} pop" style="--d:${2 + i}">
        <div class="row" style="justify-content:space-between;align-items:center"><h3 class="${f[5]}">${f[1]}</h3><button class="btn btn-sm ${f[0] === 'hi' ? 'btn-cyan' : ''}" data-play="${f[0]}">${ic.play} Listen</button></div>
        <canvas data-w="${f[0]}"></canvas>
        <div class="row small" style="justify-content:space-between;font-weight:800"><span>• ${f[2]}</span><span>• ${f[3]}</span><span>• ${f[4]}</span></div>
        <span class="chip tiny vcount" data-c="${f[0]}">Vibrations: 0</span>
      </div>`).join('')}
    </div>
    <div class="rule pop" style="--d:4"><div class="rule-pill hi"><b>FASTER</b> vibrations <span>=</span> <b>HIGHER</b> pitch</div><div class="rule-pill lo"><b>SLOWER</b> vibrations <span>=</span> <b>LOWER</b> pitch</div></div>
    <div class="card tight freq-try pop" style="--d:5">
      <button class="btn btn-sm btn-cyan" id="fq-toggle">${ic.play} Play tone</button>
      <div class="slider-row grow"><label for="fq-speed">Slower</label><input type="range" id="fq-speed" min="1" max="10" value="4"><label>Faster</label></div>
      <canvas id="fq-canvas"></canvas>
      <span class="chip" id="fq-label">Medium pitch</span>
    </div>
    <p class="tiny muted pop" style="--d:6;text-align:center;margin-top:-6px">The animations are slowed down — real sounds vibrate hundreds of times every second!</p>
  </div>`,
  init(root) {
    const waves = {};
    LS.$$('canvas[data-w]', root).forEach(cv => { waves[cv.dataset.w] = { ...LS.act.canvas(cv), phase: 0, fv: cv.dataset.w === 'hi' ? 3 : 1, cyc: cv.dataset.w === 'hi' ? 8 : 2.6, col: cv.dataset.w === 'hi' ? '#53E6DF' : '#B7A4FF' }; });
    const tryC = { ...LS.act.canvas(LS.$('#fq-canvas', root)), phase: 0, col: '#FFD76A' };
    const speed = LS.$('#fq-speed', root), label = LS.$('#fq-label', root);
    const drawWave = (W, cyc, fv, dt, dotX = 26) => {
      const { c, w, h } = W; W.phase += 2 * Math.PI * fv * dt;
      const mid = h / 2, amp = h * .34, k = cyc * 2 * Math.PI / (w - dotX);
      c.clearRect(0, 0, w, h);
      c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, mid); c.lineTo(w, mid); c.stroke();
      c.strokeStyle = W.col; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath();
      for (let x = dotX; x <= w; x += 2) { const y = mid - amp * Math.sin(W.phase - k * (x - dotX)); x === dotX ? c.moveTo(x, y) : c.lineTo(x, y); }
      c.shadowColor = W.col; c.shadowBlur = 10; c.stroke(); c.shadowBlur = 0;
      c.fillStyle = '#FF8B80'; c.beginPath(); c.arc(dotX, mid - amp * Math.sin(W.phase), 10, 0, Math.PI * 2); c.fill();
    };
    const freqOf = (v) => Math.round(130 * Math.pow(1.28, v));
    let holdTone = null;
    LS.life.loop((t, dt) => {
      ['hi', 'lo'].forEach(k => { const W = waves[k]; drawWave(W, W.cyc, W.fv, dt); LS.$(`.vcount[data-c="${k}"]`, root).textContent = `Vibrations: ${Math.floor(W.phase / (2 * Math.PI))}`; });
      const v = +speed.value; drawWave(tryC, v * .9, v * .35, dt, 14);
    });
    const updLabel = () => { const v = +speed.value; label.textContent = v >= 7 ? 'High pitch' : v <= 3 ? 'Low pitch' : 'Medium pitch'; if (holdTone) holdTone.set(freqOf(v)); };
    speed.oninput = () => { updLabel(); award('freq-slider'); };
    updLabel();
    const tg = LS.$('#fq-toggle', root);
    tg.onclick = () => {
      if (holdTone) { holdTone.stop(); holdTone = null; tg.innerHTML = `${ic.play} Play tone`; return; }
      holdTone = LS.audio.hold(freqOf(+speed.value), { vol: .25, type: 'triangle' }); tg.innerHTML = `${ic.stop} Stop tone`;
    };
    LS.life.onCleanup(() => { if (holdTone) holdTone.stop(); });
    LS.$$('[data-play]', root).forEach(b => b.onclick = () => { const hi = b.dataset.play === 'hi'; LS.audio.tone(hi ? 880 : 196, 1, { vol: hi ? .3 : .45, type: 'triangle' }); award(`freq-${b.dataset.play}`); });
  }
});

/* ============ SLIDE 15 — FEATURES THAT AFFECT PITCH ============ */
slides.push({
  id: 'features', section: 'pitch', lab: 'Sound Lab', title: 'What Features Affect Pitch?', time: '43–45 min',
  render: () => {
    const rulerMini = (len, k) => `<svg viewBox="0 0 200 90" class="mini"><rect x="0" y="52" width="110" height="16" rx="3" fill="#A86B34"/><rect x="${110 - (30 - len) * 3}" y="38" width="${(30 - len) * 3}" height="12" rx="2" fill="#FFD76A"/><g class="mini-vib" data-k="${k}"><rect x="110" y="38" width="${len * 3}" height="12" rx="2" fill="#FFD76A"/></g><rect x="70" y="24" width="30" height="16" rx="6" fill="#F1B48A"/></svg>`;
    const band = (sag, w, k, col) => `<svg viewBox="0 0 200 90" class="mini"><circle cx="18" cy="45" r="9" fill="#5E6A86"/><circle cx="182" cy="45" r="9" fill="#5E6A86"/><g class="mini-vib" data-k="${k}"><path d="M18 45 Q100 ${45 + sag} 182 45" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/></g></svg>`;
    const pair = (a, b) => `<div class="feat-pair">${a}${b}</div>`;
    const opt = (svg, label, k, cls) => `<button class="feat-opt ${cls}" data-k="${k}">${svg}<span>${label}</span><span class="play-ic">${ic.play}</span></button>`;
    return `
  <div class="slide s-feat">
    ${head('Sound Lab · Lesson 5', 'What <em>features</em> affect pitch?', 'Change the object → change how fast it vibrates → change the pitch. Click to listen!')}
    <div class="feat-grid">
      <div class="card feat-card pop" style="--d:1"><div class="feat-num">1</div><h3>Length</h3><p class="small muted">of the vibrating part</p>
        ${pair(opt(rulerMini(8, 'rs'), '<b>Shorter</b> ruler → usually <b class="hl-c">higher</b>', 'rs', 'hi'), opt(rulerMini(22, 'rl'), '<b>Longer</b> ruler → usually <b class="hl-p">lower</b>', 'rl', 'lo'))}</div>
      <div class="card feat-card pop" style="--d:2"><div class="feat-num">2</div><h3>Tightness</h3><p class="small muted">of the same rubber band</p>
        ${pair(opt(band(0, 6, 'bt', '#FF8B80'), '<b>Tighter</b> band → usually <b class="hl-c">higher</b>', 'bt', 'hi'), opt(band(26, 6, 'bl', '#FF8B80'), '<b>Looser</b> band → usually <b class="hl-p">lower</b>', 'bl', 'lo'))}</div>
      <div class="card feat-card pop" style="--d:3"><div class="feat-num">3</div><h3>Thickness</h3><p class="small muted">of a vibrating string</p>
        ${pair(opt(band(0, 3, 'sn', '#E7ECF7'), '<b>Thinner</b> string → often <b class="hl-c">higher</b>', 'sn', 'hi'), opt(band(0, 11, 'sk', '#E7ECF7'), '<b>Thicker</b> string → often <b class="hl-p">lower</b>', 'sk', 'lo'))}
        <div class="careful">${ic.alert}<span><b>Careful!</b> This is true when strings are the <b>same material</b> and <b>equally tight</b>. Thickness alone doesn't decide the pitch.</span></div></div>
    </div>
    <div class="card tight feat-pattern pop" style="--d:4"><b class="hl-y">Pattern spotted:</b> Short, tight or thin → <b>faster</b> vibrations → <b class="hl-c">higher pitch</b>. Long, loose or thick → <b>slower</b> vibrations → <b class="hl-p">lower pitch</b>.</div>
  </div>`;
  },
  init(root) {
    const A = LS.audio;
    const s = { rs: () => A.twang(1230, 1.2), rl: () => A.twang(270, 1.6), bt: () => A.pluck(330, 1.4, { vol: .6 }), bl: () => A.pluck(165, 1.6, { vol: .6, bright: .2 }), sn: () => A.pluck(392, 1.6, { vol: .6 }), sk: () => A.pluck(147, 1.8, { vol: .7, bright: .3 }) };
    const heard = new Set();
    LS.$$('.feat-opt', root).forEach(b => b.onclick = () => {
      const k = b.dataset.k; s[k]();
      const g = LS.$('.mini-vib', b); g.classList.remove('vib-y'); void g.getBoundingClientRect(); g.classList.add(b.classList.contains('hi') ? 'vib-y' : 'vib-y-slow');
      clearTimeout(b._t); b._t = setTimeout(() => g.classList.remove('vib-y', 'vib-y-slow'), 1200);
      heard.add(k); award(`feat-${k}`);
    });
  }
});

/* ============ SLIDE 16 — RULER EXPERIMENT ============ */
slides.push({
  id: 'ruler-exp', section: 'pitch', lab: 'Sound Lab', title: 'Investigation: Ruler Pitch', time: '45–47 min',
  render: () => `
  <div class="slide s-rulex">
    ${head('Sound Lab · Investigation 1', 'Ruler <em>pitch</em> experiment')}
    <div class="slide-body">
      <div class="col" style="width:330px">
        <div class="card tight pop" style="--d:1"><b>1. Predict!</b><p class="small">Which will make the <b>higher</b> pitch?</p>
          <div class="opts" id="rx-pred" style="margin-top:6px"><button class="opt" data-p="short">Short overhang</button><button class="opt" data-p="long">Long overhang</button></div>
          <p class="small hl-c" id="rx-pred-msg" style="margin-top:6px"></p></div>
        <div class="card tight col pop" style="--d:2;gap:10px"><b>2. Set the overhang</b>
          <div class="seg" id="rx-set"><button data-l="8">Short (8 cm)</button><button data-l="24">Long (24 cm)</button></div>
          <div class="slider-row"><input type="range" id="rx-len" min="6" max="28" value="15"><span class="chip" id="rx-len-l">15 cm</span></div>
          <button class="btn btn-yellow" id="rx-test">${ic.play} TEST SOUND</button></div>
      </div>
      <div class="card tight col grow pop" style="--d:3">
        <div class="grow" id="rx-host"></div>
        <div class="row" style="align-items:center;justify-content:center;gap:16px"><span class="big-text">Pitch:</span><span class="meter big" id="rx-meter"><i></i><i></i><i></i><i></i><i></i></span><span class="big-text hl-c" id="rx-pitch">—</span></div>
      </div>
      <div class="col" style="width:290px">
        <div class="card tight col grow pop" style="--d:4"><b>3. Results</b>
          <table class="results"><thead><tr><th>Overhang</th><th>Pitch</th></tr></thead><tbody id="rx-rows"><tr class="empty"><td colspan="2">Test the ruler to record results</td></tr></tbody></table></div>
        <div class="card tight conclusion pop" style="--d:5" id="rx-concl"><b class="hl-y">4. Conclusion:</b> <span>Test a short <b>and</b> a long overhang…</span></div>
      </div>
    </div>
  </div>`,
  init(root) {
    let pred = LS.store.get('rulerPred', null);
    const tested = { short: false, long: false };
    const predMsg = LS.$('#rx-pred-msg', root);
    const setPred = (p) => { pred = p; LS.store.set('rulerPred', p); LS.$$('#rx-pred .opt', root).forEach(o => o.classList.toggle('correct', o.dataset.p === p)); predMsg.textContent = 'Prediction saved! Now test it.'; };
    LS.$$('#rx-pred .opt', root).forEach(o => o.onclick = () => { setPred(o.dataset.p); LS.audio.ui.click(); });
    if (pred) setPred(pred);
    const lenIn = LS.$('#rx-len', root), lenL = LS.$('#rx-len-l', root), meter = LS.$$('#rx-meter i', root), rows = LS.$('#rx-rows', root);
    const sim = LS.act.rulerSim(LS.$('#rx-host', root), {
      overhang: 15,
      onRelease: (L, f) => {
        const name = sim.pitchName(L);
        const lv = Math.round(LS.clamp((Math.log(f) - Math.log(180)) / (Math.log(1400) - Math.log(180)), 0, 1) * 4) + 1;
        meter.forEach((m, i) => m.classList.toggle('on', i < lv));
        LS.$('#rx-pitch', root).textContent = name;
        LS.$('.empty', rows)?.remove();
        rows.insertAdjacentHTML('afterbegin', `<tr class="new"><td>${Math.round(L)} cm</td><td><b>${name}</b></td></tr>`);
        while (rows.children.length > 6) rows.lastElementChild.remove();
        if (L <= 12) tested.short = true;
        if (L >= 20) tested.long = true;
        award(`rx-${L <= 12 ? 'short' : L >= 20 ? 'long' : 'mid'}`);
        if (tested.short && tested.long) {
          const c = LS.$('#rx-concl', root);
          c.innerHTML = `<b class="hl-y">4. Conclusion:</b> A <b>shorter</b> vibrating part vibrates <b>faster</b> and makes a <b class="hl-c">higher</b> pitch. A <b>longer</b> part makes a <b class="hl-p">lower</b> pitch.${pred ? (pred === 'short' ? ' <b class="hl-c">Your prediction was right!</b>' : ' Your prediction was different — that\'s how scientists learn!') : ''}`;
          c.classList.add('glow'); LS.store.done('ruler-exp'); LS.checkInvestigator();
        }
      }
    });
    const setLen = (v) => { lenIn.value = v; lenL.textContent = `${v} cm`; sim.setOverhang(+v); LS.$$('#rx-set button', root).forEach(b => b.classList.toggle('on', b.dataset.l == v)); };
    lenIn.oninput = () => setLen(+lenIn.value);
    LS.$$('#rx-set button', root).forEach(b => b.onclick = () => { setLen(+b.dataset.l); LS.audio.ui.click(); });
    LS.$('#rx-test', root).onclick = () => sim.pluck(45);
  }
});

/* ============ SLIDE 17 — RUBBER BAND GUITAR ============ */
slides.push({
  id: 'bands', section: 'pitch', lab: 'Sound Lab', title: 'Investigation: Rubber Band Guitar', time: '47–48.5 min',
  render: () => `
  <div class="slide s-bands">
    ${head('Sound Lab · Investigation 2', 'Rubber band <em>guitar</em>', 'Click (pluck) the bands. Then change the tightness and the bridge, and pluck again!')}
    <div class="slide-body">
      <div class="card tight grow pop" style="--d:1"><svg class="sim-svg" viewBox="0 0 760 400" id="rb-svg"></svg></div>
      <div class="col" style="width:380px">
        <div class="card tight col pop" style="--d:2;gap:10px">
          <div class="slider-row"><label for="rb-tight">Loose</label><input type="range" id="rb-tight" min="1" max="5" value="2" step="1"><label>Tight</label></div>
          <div class="slider-row"><label for="rb-bridge">Long</label><input type="range" id="rb-bridge" min="0" max="100" value="0"><label>Short</label></div>
          <p class="tiny muted">Top: tightness of all the bands. Bottom: move the bridge to change the <b>length</b> of the vibrating part.</p>
        </div>
        <div class="card tight pop" style="--d:3"><div class="row" style="align-items:center;justify-content:space-between"><b id="rb-last">Pluck a band!</b><span class="meter" id="rb-meter"><i></i><i></i><i></i><i></i><i></i></span></div></div>
        <div class="card tight pop" style="--d:4"><b>Mini missions</b>
          <ul class="checks" id="rb-checks"><li data-c="thick">Pluck a thin band and a thick band</li><li data-c="tight">Tighten the bands, then pluck</li><li data-c="bridge">Move the bridge, then pluck</li></ul></div>
        <div class="card tight card-sound small pop" style="--d:5">
          <b>What we found:</b> Tighter bands generally make a <b>higher</b> pitch than the same band when loose. A <b>shorter</b> vibrating part makes a higher pitch. Thinner and thicker bands can make different pitches — here they are the same material and equally tight, so the <b>thinner</b> ones sound higher.
        </div>
      </div>
    </div>
  </div>`,
  init(root) {
    const svg = LS.$('#rb-svg', root);
    const thick = [3, 5.5, 8.5, 12], tf = [1.6, 1.3, 1.05, .85], cols = ['#FF8B80', '#FFD76A', '#53E6DF', '#9274FF'];
    const X0 = 70, X1 = 690, Y = [130, 190, 250, 310];
    svg.innerHTML = `<defs><linearGradient id="bxg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8B87A"/><stop offset="1" stop-color="#A86F36"/></linearGradient></defs>
      <rect x="30" y="70" width="700" height="300" rx="26" fill="url(#bxg)" stroke="#7A4A1E" stroke-width="5"/>
      <ellipse cx="470" cy="220" rx="110" ry="96" fill="#3B220C"/>
      <rect class="bridge" y="100" width="22" height="240" rx="8" fill="#FFD76A" stroke="#C47E0A" stroke-width="3"/>
      ${Y.map((y, i) => `<g class="band" data-i="${i}"><path class="b-dead" stroke="${cols[i]}" stroke-width="${thick[i]}" opacity=".5" fill="none" stroke-linecap="round"/><path class="b-live" stroke="${cols[i]}" stroke-width="${thick[i]}" fill="none" stroke-linecap="round"/><path class="b-hit" stroke="transparent" stroke-width="44" fill="none" d="M${X0} ${y} L${X1} ${y}" style="cursor:pointer"/><text x="${X1 + 18}" y="${y + 6}" fill="#fff" font-size="15">${['thin', '', '', 'thick'][i]}</text></g>`).join('')}
      <g class="pegs">${Y.map(y => `<circle cx="${X0 - 14}" cy="${y}" r="9" fill="#5E6A86"/><circle cx="${X1 + 2}" cy="${y}" r="9" fill="#5E6A86"/>`).join('')}</g>
      <text x="380" y="50" text-anchor="middle" fill="#AEB9DA" font-size="18" id="rb-tlabel"></text>`;
    const tight = LS.$('#rb-tight', root), bridge = LS.$('#rb-bridge', root), meter = LS.$$('#rb-meter i', root);
    const amps = [0, 0, 0, 0], t0s = [0, 0, 0, 0];
    const flags = { thin: false, thickB: false, tight: false, bridge: false };
    let tightChanged = false, bridgeChanged = false;
    const bx = () => X0 + (+bridge.value / 100) * (X1 - X0) / 2;
    const draw = (t = performance.now() / 1000) => {
      const b = bx();
      LS.$('.bridge', svg).setAttribute('x', b - 11);
      LS.$('.bridge', svg).style.display = +bridge.value > 0 ? '' : 'none';
      const T = +tight.value;
      LS.$('#rb-tlabel', svg).textContent = `Tightness: ${['very loose', 'loose', 'medium', 'tight', 'very tight'][T - 1]}`;
      LS.$$('.band', svg).forEach((g, i) => {
        const y = Y[i], start = +bridge.value > 0 ? b : X0;
        const el = t - t0s[i], env = amps[i] * Math.exp(-el / .8);
        const sag = (5 - T) * 2;
        const disp = env * Math.cos(2 * Math.PI * (6 + i * -0.8 + T) * el);
        LS.$('.b-dead', g).setAttribute('d', +bridge.value > 0 ? `M${X0} ${y} L${b} ${y}` : '');
        LS.$('.b-live', g).setAttribute('d', `M${start} ${y} Q${(start + X1) / 2} ${y + sag + disp * 2} ${X1} ${y}`);
      });
    };
    const freqOf = (i) => { const T = +tight.value; const lf = (X1 - X0) / (X1 - (+bridge.value > 0 ? bx() : X0)); return 180 * tf[i] * Math.sqrt(.6 + .35 * T) * lf; };
    const check = (k) => { const li = LS.$(`[data-c="${k}"]`, root); if (!li.classList.contains('done')) { li.classList.add('done'); award(`rb-${k}`); } if (LS.$$('#rb-checks li.done', root).length === 3) { LS.store.done('bands'); LS.checkInvestigator(); } };
    LS.$$('.band', svg).forEach(g => LS.$('.b-hit', g).addEventListener('pointerdown', () => {
      const i = +g.dataset.i, f = freqOf(i);
      amps[i] = 14; t0s[i] = performance.now() / 1000;
      LS.audio.pluck(f, 1.6, { vol: .65, bright: .35 });
      const lv = Math.round(LS.clamp((Math.log(f) - Math.log(140)) / (Math.log(700) - Math.log(140)), 0, 1) * 4) + 1;
      meter.forEach((m, j) => m.classList.toggle('on', j < lv));
      LS.$('#rb-last', root).innerHTML = `${['Thinnest', 'Thin', 'Thick', 'Thickest'][i]} band: <span class="hl-c">${['very low', 'low', 'medium', 'high', 'very high'][lv - 1]}</span>`;
      if (i === 0) flags.thin = true; if (i === 3) flags.thickB = true;
      if (flags.thin && flags.thickB) check('thick');
      if (tightChanged) check('tight');
      if (bridgeChanged) check('bridge');
    }));
    tight.oninput = () => { tightChanged = +tight.value > 2; draw(); };
    bridge.oninput = () => { bridgeChanged = +bridge.value > 15; draw(); };
    LS.life.loop((t) => draw(t));
  }
});

/* ============ SLIDE 18 — WATER BOTTLES ============ */
slides.push({
  id: 'bottles', section: 'pitch', lab: 'Sound Lab', title: 'Investigation: Water Bottles', time: '48.5–50 min',
  render: () => `
  <div class="slide s-bottles">
    ${head('Sound Lab · Investigation 3', 'Tapping <em>water bottles</em>', 'Five identical glass bottles. We <b>tap the sides</b> gently with a pencil.')}
    <div class="slide-body">
      <div class="col" style="width:360px">
        <div class="card tight pop" style="--d:1"><b>Predict:</b> which bottle will make the <b>lowest</b> pitch when tapped?<div id="bt-q" style="margin-top:8px"></div></div>
        <div class="card tight card-sound small pop" style="--d:3"><b>Why?</b> When you tap a bottle, the <b>glass and the water vibrate together</b>. More water means more to move, so the bottle vibrates <b>more slowly</b> → <b class="hl-p">lower pitch</b>. Less water → faster vibrations → <b class="hl-c">higher pitch</b>.</div>
        <div class="teacher-callout teacher-only pop" style="--d:4"><b>Teacher note:</b> blowing across the tops is a <u>different</u> experiment with the <u>opposite</u> pattern — the air vibrates, and more water leaves a shorter air column, giving a higher pitch. Keep the two experiments separate.</div>
      </div>
      <div class="card col grow pop" style="--d:2">
        <div class="row" style="justify-content:space-between;align-items:center"><b>Tap each bottle (click it)!</b><span class="chip" id="bt-scale">Challenge: tap from lowest to highest pitch</span></div>
        <div class="bottle-row" id="bt-row"></div>
        <div class="feedback" id="bt-fb"></div>
      </div>
    </div>
  </div>`,
  init(root) {
    const levels = [.85, .68, .5, .33, .16];
    const row = LS.$('#bt-row', root), fb = LS.$('#bt-fb', root);
    row.innerHTML = levels.map((lv, i) => {
      const top = 70, bot = 296, wy = bot - (bot - 110) * lv;
      return `<button class="bottle" data-i="${i}" aria-label="Bottle ${i + 1}">
        <svg viewBox="0 0 120 320"><defs><clipPath id="bc${i}"><path d="M44 10 L76 10 L76 64 Q108 86 108 128 L108 290 Q108 306 92 306 L28 306 Q12 306 12 290 L12 128 Q12 86 44 64Z"/></clipPath></defs>
        <g clip-path="url(#bc${i})"><rect x="0" y="0" width="120" height="320" fill="rgba(233,247,255,.16)"/><rect class="water" x="0" y="${wy}" width="120" height="${320 - wy}" fill="#45B8FF" opacity=".85"/><path d="M0 ${wy} Q30 ${wy - 4} 60 ${wy} T120 ${wy}" stroke="#BFE9FF" stroke-width="4" fill="none"/></g>
        <path d="M44 10 L76 10 L76 64 Q108 86 108 128 L108 290 Q108 306 92 306 L28 306 Q12 306 12 290 L12 128 Q12 86 44 64Z" fill="none" stroke="#9FDBFF" stroke-width="5"/>
        <path d="M26 130 Q26 100 44 86" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/></svg>
        <span class="bt-label">?</span><span class="ripple"></span></button>`;
    }).join('');
    const freq = (lv) => 1400 - 800 * lv;
    const names = ['lowest', 'low', 'medium', 'high', 'highest'];
    let seq = [];
    LS.$$('.bottle', row).forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      LS.audio.tap(freq(levels[i]));
      b.classList.remove('tapped'); void b.offsetWidth; b.classList.add('tapped');
      LS.$('.bt-label', b).textContent = `♪ ${names[i]}`;
      award(`bt-${i}`);
      seq.push(i); seq = seq.slice(-5);
      if (seq.length === 5 && seq.every((v, k) => v === k)) {
        award('bt-scale', 2); LS.store.done('bottles'); LS.checkInvestigator();
        LS.$('#bt-scale', root).textContent = 'You played a scale!';
        LS.act.feedback(fb, 'good', '<b>Amazing — you played a scale!</b> From most water (lowest pitch) to least water (highest pitch).');
      } else if (seq.length >= 2) {
        LS.act.feedback(fb, 'info', `Bottle ${i + 1} has ${['the most', 'lots of', 'some', 'a little', 'the least'][i]} water → <b>${names[i]}</b> pitch. Tap them in order from left to right to play a scale!`);
      }
    });
    LS.act.mcq(LS.$('#bt-q', root), { key: 'bt-pred', options: [
      { t: 'The bottle with the MOST water', ok: true, fb: '<b>Yes!</b> When tapping, more water makes the bottle vibrate more slowly → <b>lower</b> pitch. Test it!' },
      { t: 'The bottle with the LEAST water', fb: 'Tap the bottles and listen carefully — which sounds deepest?' },
      { t: 'They all sound the same', fb: 'Tap a few bottles — do they really sound the same?' }] });
  }
});

/* ============ SLIDE 19 — SCIENCE DETECTIVES CHALLENGE ============ */
slides.push({
  id: 'challenge', section: 'mission', lab: 'Final Mission', title: 'Science Detectives Challenge', time: '50–56 min',
  render: () => `
  <div class="slide s-chal">
    ${head('Final mission', 'Science Detectives <em>Challenge</em>', 'Make a prediction for each case. Each correct answer earns <b class="hl-y">2 stars</b>!')}
    <div class="chal-grid">
      ${[['ruler', 'Case 1 · Ruler', 'Which produces a <b>higher</b> pitch?'], ['rubber_band_guitar', 'Case 2 · Rubber band', 'What usually happens when the <b>same</b> rubber band is <b>tightened</b>?'], ['bottle', 'Case 3 · Water bottles', 'When <b>tapping</b> identical bottles, which generally makes a <b>lower</b> pitch?']].map((c, i) => `
        <div class="card tight chal-card pop" style="--d:${i + 1}"><div class="chal-img"><img src="${I(c[0])}" alt=""></div><span class="kicker" style="margin:0">${c[1]}</span><p class="mq">${c[2]}</p><div class="mcq" data-c="${i}"></div></div>`).join('')}
    </div>
    <div class="card tight sentence pop" style="--d:4">
      <div class="row" style="align-items:center;gap:12px;flex-wrap:wrap"><b class="big-text" style="font-size:22px">Complete the sentence:</b>
        <span class="sent">"The pitch changes because the <input id="ch-word" placeholder="type or pick a word" autocomplete="off" maxlength="30"> of the vibrating object changes."</span>
        </div>
      <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap;align-items:center" id="ch-chips"><button class="btn btn-sm btn-yellow" id="ch-check">${ic.check} Check</button><span class="small muted" style="font-weight:800">Word ideas:</span>${['length', 'colour', 'tightness', 'name', 'thickness', 'amount of water'].map(w => `<button class="chip word-chip">${w}</button>`).join('')}</div>
      <div class="feedback" id="ch-fb"></div>
    </div>
  </div>`,
  init(root) {
    const sets = [
      [{ t: 'Short vibrating ruler', ok: true, fb: '<b>Correct!</b> A short vibrating part vibrates <b>faster</b>, so the pitch is <b>higher</b>.' }, { t: 'Long vibrating ruler', fb: 'A long ruler vibrates slowly — slower vibrations make a lower pitch.' }],
      [{ t: 'It makes a higher pitch', ok: true, fb: '<b>Correct!</b> A tighter band vibrates <b>faster</b> → <b>higher</b> pitch.' }, { t: 'It makes a lower pitch', fb: 'Think: does a tighter band vibrate faster or slower?' }, { t: 'The pitch stays the same', fb: 'Try it on the rubber band guitar — the pitch does change!' }],
      [{ t: 'More water', ok: true, fb: '<b>Correct!</b> When tapping, more water means more to vibrate → <b>slower</b> vibrations → <b>lower</b> pitch.' }, { t: 'Less water', fb: 'Less water lets the bottle vibrate faster — that makes a higher pitch.' }]
    ];
    let solved = 0;
    const checkAll = () => { if (solved >= 3 && LS.store.isDone('ch-sentence')) LS.badge('detective'); };
    LS.$$('.mcq', root).forEach(el => LS.act.mcq(el, { key: `chal-${el.dataset.c}`, stars: 2, options: sets[+el.dataset.c], onCorrect: () => { solved++; checkAll(); } }));
    const input = LS.$('#ch-word', root), fb = LS.$('#ch-fb', root);
    LS.$$('.word-chip', root).forEach(c => c.onclick = () => { input.value = c.textContent; LS.audio.ui.click(); });
    const good = ['length', 'long', 'short', 'tight', 'tension', 'loose', 'thick', 'thin', 'size', 'water', 'amount', 'mass', 'weight', 'material', 'shape', 'stretch'];
    const bad = ['colour', 'color', 'name', 'loud', 'volume'];
    const run = () => {
      const v = input.value.trim().toLowerCase();
      if (!v) { LS.act.feedback(fb, 'info', 'Type a word or click one of the word buttons.'); return; }
      if (bad.some(b => v.includes(b))) { LS.act.feedback(fb, 'bad', `Changing the <b>${v}</b> doesn't change how fast the object vibrates. Try another feature!`); LS.audio.ui.wrong(); return; }
      if (good.some(g => v.includes(g))) {
        LS.act.feedback(fb, 'good', `<b>Brilliant!</b> Changing the <b>${v}</b> changes how fast the object vibrates, which changes the pitch. (Length, tightness, thickness and the amount of water all work!)`);
        LS.audio.ui.correct(); LS.award('ch-sentence', 2); LS.store.done('ch-sentence'); checkAll(); return;
      }
      LS.act.feedback(fb, 'info', 'Hmm, think about our investigations: the ruler, the rubber bands and the bottles. What did we change?');
    };
    LS.$('#ch-check', root).onclick = run;
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); e.stopPropagation(); });
  }
});

/* ============ SLIDE 20 — QUIZ ============ */
slides.push({
  id: 'quiz', section: 'quiz', lab: 'Final Mission', title: 'Science Detective Quiz', time: '56–59 min',
  render: () => `<div class="slide s-quiz">${head('Final assessment', 'Science Detective <em>Quiz</em>', '', '<span class="chip pop" id="qz-score">Score: 0</span>')}<div class="quiz-host grow" id="quiz-host"></div></div>`,
  init(root) { LS.quiz.mount(LS.$('#quiz-host', root), LS.$('#qz-score', root)); }
});

/* ============ SLIDE 21 — CERTIFICATE ============ */
slides.push({
  id: 'certificate', section: 'quiz', lab: 'Mission Complete', title: 'Certificate & Mission Complete', time: '59–60 min',
  render: () => `<div class="slide s-cert"><div class="cert-host" id="cert-host"></div></div>`,
  init(root) { LS.cert.mount(LS.$('#cert-host', root)); }
});

LS.slides = slides;
})();
