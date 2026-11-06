/* ------------------------------------------------------------------
   The list of all 18 slides, followed by slides 1 to 8.
   Slides 9-16 are in slides-changes.js, 17 in quiz.js, 18 in certificate.js.

   Each slide's render(root, ctx) builds the slide. ctx gives it:
     ctx.on(el, event, fn)    event listeners removed on leaving the slide
     ctx.after / ctx.every    timers cleared on leaving the slide
     ctx.frame(fn)            per-frame animation stopped on leaving the slide
     ctx.act(id)              activity tracker: .miss() and .done(sourceEl)
     ctx.say(text)            a speech bubble from Dr Fizz
------------------------------------------------------------------- */
(function () {
  /* reward = how many stars this activity can pay out in total. */
  SM.slides = [
    { id: 'welcome', title: 'Welcome to the World of Matter', short: 'Welcome', activities: [{ id: 'boxes', label: 'Open 3 boxes' }] },
    { id: 'matter', title: 'What Is Matter?', short: 'Matter', activities: [{ id: 'sort', label: 'Scan objects', bonus: true }] },
    { id: 'states', title: 'Meet the Three States', short: 'Three states', activities: [{ id: 'explore', label: 'Visit 3 zones' }] },
    { id: 'solids', title: 'Investigating Solids', short: 'Solids', activities: [{ id: 'predict', label: 'Block test', bonus: true }, { id: 'forces', label: 'Test forces' }] },
    { id: 'liquids', title: 'Investigating Liquids', short: 'Liquids', activities: [{ id: 'predict', label: 'Predict', bonus: true }, { id: 'pour', label: 'Pour water' }] },
    { id: 'gases', title: 'Investigating Gases', short: 'Gases', activities: [{ id: 'predict', label: 'Predict', bonus: true }, { id: 'spread', label: 'Fill the room' }] },
    { id: 'particles', title: 'The Particle Detective', short: 'Particles', activities: [{ id: 'identify', label: 'Name tanks', bonus: true }, { id: 'build', label: 'Build models' }] },
    { id: 'tricky', title: 'Tricky Materials', short: 'Tricky', activities: [{ id: 'inspect', label: 'Inspect 6' }, { id: 'sort', label: 'Sort them', bonus: true }] },
    { id: 'change', title: 'Matter Can Change State', short: 'Changes', activities: [{ id: 'journey', label: 'Water journey' }] },
    { id: 'melt', title: 'Melting and Freezing', short: 'Melt & freeze', activities: [{ id: 'labels', label: 'Label tests', bonus: true }, { id: 'words', label: 'Missing words', bonus: true }] },
    { id: 'evap', title: 'Evaporation and Boiling', short: 'Evaporate & boil', activities: [{ id: 'scenarios', label: '4 scenarios', bonus: true }] },
    { id: 'condense', title: 'Condensation', short: 'Condensation', activities: [{ id: 'sequence', label: 'Order steps', bonus: true }] },
    { id: 'map', title: 'The Complete Change-of-State Map', short: 'State map', activities: [{ id: 'connect', label: 'Label arrows', bonus: true }] },
    { id: 'tools', title: 'Become a Science Investigator', short: 'Equipment', activities: [{ id: 'explore', label: 'Check tools' }, { id: 'match', label: 'Match jobs', bonus: true }] },
    { id: 'temps', title: 'Temperature Detective', short: 'Temperature', activities: [{ id: 'read', label: 'Read 3', bonus: true }, { id: 'compare', label: 'Compare', bonus: true }] },
    { id: 'final', title: 'Final Science Mission', short: 'Final mission', activities: [] },
    { id: 'quiz', title: 'Young Scientist Quiz', short: 'Quiz', activities: [{ id: 'quiz', label: 'Finish quiz', reward: 16 }] },
    { id: 'certificate', title: 'Your Young Scientist Certificate', short: 'Certificate', activities: [{ id: 'cert', label: 'Make certificate', optionalForBadge: true }] }
  ];

  const R = {};
  SM.renderers = R;

  const art = SM.art;
  const head = (k, t, sub, cls) => `<header class="s-head ${cls || ''}"><span class="kicker">${k}</span><h1>${t}</h1>${sub ? `<p>${sub}</p>` : ''}</header>`;
  SM.head = head;

  /* ================= 1. WELCOME ================= */
  R.welcome = function (root, ctx) {
    const G = SM.game;
    const title = 'The Incredible World of Matter'.split(' ').map((w, wi) =>
      `<span class="w">${w.split('').map((c, i) => `<span class="l" style="animation-delay:${(wi * 5 + i) * 45}ms">${c}</span>`).join('')}</span>`).join(' ');
    const boxes = [
      { k: 'solid', a: 'ice_cube', name: 'SOLID', ex: 'An ice cube keeps its own shape.' },
      { k: 'liquid', a: 'water_glass', name: 'LIQUID', ex: 'Water flows and fills its glass.' },
      { k: 'gas', a: 'air_balloon', name: 'GAS', ex: 'Air spreads out to fill a balloon.' }
    ];
    const resume = G.state.furthest > 0;
    root.innerHTML = `<div class="slide-inner">
      <div class="s1-lab" aria-hidden="true">${SM.illus('science_lab_bg').replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ')}</div>
      <div class="s1-beams" aria-hidden="true"><i></i><i></i><i></i></div>
      <h1 class="s1-title" aria-label="The Incredible World of Matter">${title}</h1>
      <div class="s1-main">
        <div class="s1-mascot">
          <div class="bubble bubble-right">Hello, Young Scientist! I'm <b>Dr Fizz</b>. Tap each mystery box to see what's inside!</div>
          ${art('scientist_mascot', { cls: 'mascot-big' })}
        </div>
        <div class="s1-boxes">
          ${boxes.map((b, i) => `<button class="mbox mbox-${b.k}" data-k="${b.k}" style="--d:${i * .5}s" aria-label="Open mystery box ${i + 1}">
            <span class="mbox-reveal">${art(b.a, { alt: '' })}</span>
            <span class="mbox-body"><span class="mbox-q">?</span><span class="mbox-lid"></span></span>
            <span class="mbox-label"><b>${b.name}</b><small>${b.ex}</small></span>
          </button>`).join('')}
        </div>
      </div>
      <div class="s1-actions">
        <button class="btn btn-huge btn-glow" id="s1-start">${resume ? 'PLAY FROM THE START' : 'START YOUR MISSION'}</button>
        ${resume ? `<button class="btn btn-ghost" id="s1-cont">Continue: ${SM.slides[G.state.furthest].short}</button>
        <button class="btn btn-ghost btn-small" id="s1-reset">${SM.icons.reset} New player</button>` : ''}
      </div>
    </div>`;

    const opened = new Set();
    root.querySelectorAll('.mbox').forEach(b => ctx.on(b, 'click', () => {
      if (!b.classList.contains('open')) SM.sound('pop');
      b.classList.add('open');
      opened.add(b.dataset.k);
      SM.fx.confetti(14, b);
      if (opened.size === 3) {
        ctx.act('boxes').done(b);
        ctx.say('Solid, liquid and gas: the three states of matter. Press START!');
      }
    }));
    ctx.on(root.querySelector('#s1-start'), 'click', () => ctx.go(1));
    const cont = root.querySelector('#s1-cont');
    if (cont) ctx.on(cont, 'click', () => ctx.go(G.state.furthest));
    const rs = root.querySelector('#s1-reset');
    if (rs) {
      let armed = false;
      ctx.on(rs, 'click', () => {
        if (!armed) {
          armed = true;
          rs.textContent = 'Press again to erase all progress';
          rs.classList.add('btn-warn');
          ctx.after(4000, () => {
            armed = false;
            rs.innerHTML = SM.icons.reset + ' New player';
            rs.classList.remove('btn-warn');
          });
          return;
        }
        G.reset();
        SM.ui.show(0, true);
      });
    }
  };

  /* ================= 2. WHAT IS MATTER? ================= */
  R.matter = function (root, ctx) {
    const objs = [
      { k: 'apple', n: 'Apple', m: 1, ok: 'An apple takes up space and has mass.' },
      { k: 'chair', n: 'Chair', m: 1, ok: 'A chair is solid matter you can sit on.' },
      { k: 'water_glass', n: 'Water', m: 1, ok: 'Water is matter. It fills up the glass.' },
      { k: 'air_balloon', n: 'Air balloon', m: 1, ok: 'Air is matter! It takes up the space inside the balloon.' },
      { k: 'pencil', n: 'Pencil', m: 1, ok: 'A pencil is made of wood and graphite, so it is matter.' },
      { k: 'light', n: 'Light', m: 0, ok: 'Correct! Light is a kind of energy. It takes up no space and has no mass.' }
    ];
    root.innerHTML = `<div class="slide-inner s2-grid">
      <div class="s2-left">
        ${head('Mission 2', 'What Is Matter?')}
        <p class="s2-def"><b class="v">Matter</b> is anything that <b class="v">takes up space</b> and has <b class="v">mass</b>. Everything you can touch is matter. So is the air around you!</p>
        <div class="s2-room" id="s2-tray">
          ${SM.shuffle(objs).map((o, i) => `<button class="s2-obj" data-drag data-k="${o.k}" data-m="${o.m}" style="--d:${i * .35}s">
            ${art(o.k, { alt: '' })}<span>${o.n}</span></button>`).join('')}
        </div>
      </div>
      <div class="s2-right">
        <div class="s2-scanner" data-slot="yes" data-cap="5" tabindex="0" role="button" aria-label="Matter scanner">
          <div class="s2-scan-head"><i></i>MATTER SCANNER</div>
          <div class="s2-beam" aria-hidden="true"></div>
          <div class="slot-fill s2-fill"></div>
          <small class="s2-sub">Takes up space. Has mass.</small>
        </div>
        <div class="s2-void" data-slot="no" data-cap="1" tabindex="0" role="button" aria-label="Not matter box">
          <div class="s2-void-head">NOT MATTER</div>
          <div class="slot-fill s2-fill"></div>
        </div>
        <div class="note note-info" id="s2-note">Drag each object into the right place, or tap an object and then tap a place.</div>
      </div>
    </div>`;
    const note = root.querySelector('#s2-note');
    SM.sortGame(ctx, {
      root,
      correct: (it, sl) => (it.dataset.m === '1') === (sl.dataset.slot === 'yes'),
      onRight(it) {
        const o = objs.find(x => x.k === it.dataset.k);
        SM.note(note, 'good', o.ok);
      },
      onWrong(it) {
        ctx.act('sort').miss();
        const hint = it.dataset.m === '1'
          ? `Think again. Does the ${it.textContent.trim().toLowerCase()} take up space? Then it is matter.`
          : 'Hmm. Can you put light in a jar and weigh it? Light takes up no space.';
        SM.note(note, 'hint', hint);
      },
      onDone() {
        ctx.act('sort').done(root.querySelector('.s2-scanner'));
        SM.note(note, 'good', '<b>Brilliant!</b> Apple, chair, water, air and pencil are all matter. Light is not.');
        ctx.say('Even invisible air is matter. A balloon gets bigger because air takes up space!');
      }
    });
  };

  /* ================= 3. THE THREE STATES ================= */
  R.states = function (root, ctx) {
    const P = [
      { k: 'solid', big: 'S', trick: 'Stays in shape', title: 'SOLID', a: 'ice_cube', ex: 'Ice, wood, rock', facts: ['Keeps its own shape', 'Keeps the same volume', 'Cannot flow or be poured'], ex2: ['ice_cube', 'wooden_blocks', 'rock'] },
      { k: 'liquid', big: 'L', trick: "Likes the container's shape", title: 'LIQUID', a: 'water_glass', ex: 'Water, juice, honey', facts: ['Flows and can be poured', "Takes the container's shape", 'Keeps the same volume'], ex2: ['water_glass', 'juice', 'honey'] },
      { k: 'gas', big: 'G', trick: 'Goes everywhere!', title: 'GAS', a: 'air_balloon', ex: 'Air, oxygen, water vapour', facts: ['Spreads out to fill any space', 'No shape of its own', 'Can be squashed. Most are invisible'], ex2: ['air_balloon', 'water_vapour'] }
    ];
    const deco = {
      solid: '<div class="s3-cubes" aria-hidden="true">' + Array.from({ length: 12 }, (_, i) => `<i style="--i:${i}"></i>`).join('') + '</div>',
      liquid: '<div class="s3-waves" aria-hidden="true"><svg viewBox="0 0 800 200" preserveAspectRatio="none"><path class="wv1" d="M0 60q100-40 200 0t200 0 200 0 200 0v140H0z"/><path class="wv2" d="M0 90q100 40 200 0t200 0 200 0 200 0v110H0z"/></svg></div>',
      gas: '<div class="s3-gas" aria-hidden="true">' + Array.from({ length: 16 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--y:${(i * 59) % 100}%;--d:${i * .4}s"></i>`).join('') + '</div>'
    };
    root.innerHTML = `<div class="s3-panels">
      ${P.map(p => `<button class="s3-panel s3-${p.k}" data-k="${p.k}" aria-expanded="false">
        ${deco[p.k]}
        <span class="s3-top"><span class="s3-letter">${p.big}</span><span class="s3-name">${p.title}</span></span>
        <span class="s3-trick"><b>${p.big}</b>${p.trick.slice(1)}</span>
        <span class="s3-closed">${art(p.a, { alt: '' })}<span class="s3-tap">Tap to explore</span></span>
        <span class="s3-open">
          <span class="s3-facts">${p.facts.map((f, i) => `<span class="s3-fact" style="--i:${i}">${f}</span>`).join('')}</span>
          <span class="s3-examples">${p.ex2.map(e => art(e, { alt: '' })).join('')}</span>
          <span class="s3-excap"><b>Examples:</b> ${p.ex}</span>
        </span>
      </button>`).join('')}
      <div class="s3-title">Mission 3: <b>Meet the Three States</b> of matter</div>
    </div>`;
    const seen = new Set();
    const panels = root.querySelectorAll('.s3-panel');
    panels.forEach(p => ctx.on(p, 'click', () => {
      panels.forEach(q => {
        q.classList.toggle('open', q === p);
        q.setAttribute('aria-expanded', q === p);
      });
      SM.sound('click');
      seen.add(p.dataset.k);
      p.classList.add('seen');
      if (seen.size === 3) {
        ctx.act('explore').done(p);
        ctx.say('Remember the trick: S stays, L likes the container, G goes everywhere!');
      }
    }));
  };

  /* ================= 4. INVESTIGATING SOLIDS ================= */
  R.solids = function (root, ctx) {
    root.innerHTML = `<div class="slide-inner s4-grid">
      <div class="s4-exp">
        ${head('Mission 4 · Experiment table', 'Investigating Solids')}
        <div class="s4-table">
          <svg viewBox="0 0 720 300" class="s4-scene" role="img" aria-label="A wooden block moves from the table into a bowl and then into a box. It keeps the same shape.">
            <rect y="238" width="720" height="62" fill="url(#g-wood)"/><rect y="238" width="720" height="8" fill="#FFE3B3"/>
            <path d="M0 266q180 10 360 0t360 0M0 284q200 8 400 0t320 0" stroke="#A9682B" stroke-width="2" fill="none" opacity=".5"/>
            <ellipse cx="330" cy="150" rx="94" ry="16" fill="#7C3AED" opacity=".55"/>
            <g id="s4-box-back"><rect x="510" y="128" width="170" height="110" rx="6" fill="#0EA5A4" opacity=".45"/></g>
            <g id="s4-block">
                            <rect x="-40" y="-74" width="80" height="74" rx="6" fill="url(#g-wood)" stroke="#8E5522" stroke-width="3"/>
              <path d="M-30-56q30 8 60 0M-30-34q30 8 60 0M-30-14q30 6 60 0" stroke="#A9682B" stroke-width="2.5" fill="none" opacity=".7"/>
            </g>
            <path d="M236 150h188c0 56-38 88-70 88h-48c-32 0-70-32-70-88z" fill="url(#g-purple)" opacity=".5"/>
            <path d="M510 160h170v78H510z" fill="#14B8A6" opacity=".45"/><path d="M510 160h170" stroke="#0F766E" stroke-width="4"/>
            <g id="s4-ghost-g" opacity="0"><path d="M-44-78h88v82h-88z" fill="none" stroke="#172554" stroke-width="4" stroke-dasharray="9 7"/></g>
            <text x="330" y="282" text-anchor="middle" class="s4-lab">bowl</text>
            <text x="595" y="282" text-anchor="middle" class="s4-lab">box</text>
            <text x="100" y="282" text-anchor="middle" class="s4-lab">table</text>
          </svg>
        </div>
        <div class="s4-q" id="s4-q">
          <b>Predict:</b> We will move the block into a bowl and then a box. What happens to its shape?
          <div class="choice-row" id="s4-choices">
            <button class="btn btn-choice" data-a="change">It changes shape</button>
            <button class="btn btn-choice" data-a="same">It stays the same</button>
          </div>
        </div>
      </div>
      <aside class="s4-forces">
        <h2>Can a <span>force</span> change a solid?</h2>
        <p class="s4-fsub">Tap each one to test it.</p>
        <div class="s4-cards">
          <button class="fcard" data-f="bend"><svg viewBox="0 0 160 90"><path id="f-bend" fill="none" stroke="#FBBF24" stroke-width="20" stroke-linecap="round" d="M16 50 Q80 50 144 50"/></svg><b>Bend</b><small>a ruler</small></button>
          <button class="fcard" data-f="stretch"><svg viewBox="0 0 160 90"><ellipse id="f-stretch" cx="80" cy="45" rx="30" ry="24" fill="none" stroke="#FB7185" stroke-width="10"/></svg><b>Stretch</b><small>an elastic band</small></button>
          <button class="fcard" data-f="squash"><svg viewBox="0 0 160 90"><g id="f-squash"><rect x="38" y="16" width="84" height="62" rx="12" fill="url(#g-yellow)"/><g fill="#CA8A04" opacity=".6"><circle cx="58" cy="34" r="5"/><circle cx="84" cy="50" r="6"/><circle cx="106" cy="30" r="4"/><circle cx="62" cy="62" r="4"/><circle cx="106" cy="62" r="5"/></g></g></svg><b>Squash</b><small>a sponge</small></button>
          <button class="fcard" data-f="twist"><svg viewBox="0 0 160 90"><path id="f-twist" fill="none" stroke="#34D399" stroke-width="12" stroke-linecap="round" d=""/></svg><b>Twist</b><small>a pipe cleaner</small></button>
        </div>
        <div class="note note-info" id="s4-fnote">A <b class="v">force</b> is a push or a pull.</div>
      </aside>
    </div>`;

    /* ----- Block experiment ----- */
    const block = root.querySelector('#s4-block');
    const ghost = root.querySelector('#s4-ghost-g');
    const q = root.querySelector('#s4-q');
    const setBlock = (x, y) => {
      block.setAttribute('transform', `translate(${x} ${y})`);
      ghost.setAttribute('transform', `translate(${x} ${y})`);
    };
    setBlock(100, 238);
    const hop = (x0, y0, x1, y1) => SM.animate(ctx, 900, (e) => {
      const arc = Math.sin(e * Math.PI) * 130;
      setBlock(SM.lerp(x0, x1, e), SM.lerp(y0, y1, e) - arc);
    });
    root.querySelectorAll('#s4-choices button').forEach(b => ctx.on(b, 'click', async () => {
      if (b.dataset.a !== 'same') {
        ctx.act('predict').miss();
        SM.bad(b);
        b.disabled = true;
        q.querySelector('.s4-hint') || q.insertAdjacentHTML('beforeend', '<p class="s4-hint">Good guess! Is wood runny like water? Try the other answer.</p>');
        return;
      }
      SM.good(b);
      q.innerHTML = '<b>Watch closely.</b> The dashed line shows the block\'s shape.';
      ghost.setAttribute('opacity', '1');
      await hop(100, 238, 330, 222);
      await SM.wait(ctx, 500);
      await hop(330, 222, 595, 232);
      await SM.wait(ctx, 300);
      q.innerHTML = '<b class="good-text">Same shape every time!</b> A <b class="v">solid</b> keeps its own shape wherever you put it. A wooden block is the same in a bowl or in a box.';
      ctx.act('predict').done(block);
    }));

    /* ----- Force tests ----- */
    const twistPath = amp => {
      let d = 'M16 45';
      for (let x = 16; x <= 144; x += 4) d += ` L${x} ${45 + Math.sin((x - 16) / 128 * Math.PI * 8) * amp}`;
      return d;
    };
    const fB = root.querySelector('#f-bend'), fS = root.querySelector('#f-stretch'),
      fQ = root.querySelector('#f-squash'), fT = root.querySelector('#f-twist');
    fT.setAttribute('d', twistPath(0));
    const apply = {
      bend: t => fB.setAttribute('d', `M${16 + t * 10} ${50 + t * 12} Q80 ${50 - t * 70} ${144 - t * 10} ${50 + t * 12}`),
      stretch: t => { fS.setAttribute('rx', 30 + t * 40); fS.setAttribute('ry', 24 - t * 13); },
      squash: t => fQ.setAttribute('transform', `translate(${80 - 80 * (1 + t * .18)} ${78 - 78 * (1 - t * .5)}) scale(${1 + t * .18} ${1 - t * .5})`),
      twist: t => fT.setAttribute('d', twistPath(t * 20))
    };
    const say = {
      bend: '<b class="v">Bend:</b> pushing the ends makes the ruler curve.',
      stretch: '<b class="v">Stretch:</b> pulling makes the band longer.',
      squash: '<b class="v">Squash:</b> pressing makes the sponge flatter.',
      twist: '<b class="v">Twist:</b> turning makes the pipe cleaner spiral.'
    };
    const tested = new Set();
    const fnote = root.querySelector('#s4-fnote');
    root.querySelectorAll('.fcard').forEach(c => ctx.on(c, 'click', async () => {
      if (c.dataset.busy) return;
      c.dataset.busy = '1';
      const f = c.dataset.f;
      SM.sound('click');
      c.classList.add('tested');
      SM.note(fnote, 'info', say[f]);
      await SM.animate(ctx, 600, e => apply[f](e));
      await SM.wait(ctx, 500);
      await SM.animate(ctx, 500, e => apply[f](1 - e));
      delete c.dataset.busy;
      tested.add(f);
      if (tested.size === 4 && !ctx.act('forces').isDone()) {
        SM.note(fnote, 'good', '<b>Still solids!</b> A force changed their shape, but they did not flow on their own.');
        ctx.act('forces').done(c);
      }
    }));
  };

  /* ================= 5. INVESTIGATING LIQUIDS ================= */
  R.liquids = function (root, ctx) {
    const FLOOR = 372;
    const C = {
      bottle: { name: 'Tall bottle', x: 120, h: 260, lip: 15, level: 150, tilt: 102, span: 66,
        path: 'M-40 0Q-44 0-44-8V-160Q-44-190-15-210V-260H15V-210Q44-190 44-160V-8Q44 0 40 0Z' },
      bowl: { name: 'Wide bowl', x: 385, h: 96, lip: 120, level: 64, tilt: 62, span: 52,
        path: 'M-120-96H120C120-40 70 0 30 0H-30C-70 0-120-40-120-96Z' },
      glass: { name: 'Narrow glass', x: 650, h: 240, lip: 28, level: 193, tilt: 102, span: 46,
        path: 'M-28-240H28L24-6Q24 0 18 0H-18Q-24 0-24-6Z' }
    };
    const part = k => `
      <g class="pour-c" id="c-${k}" data-k="${k}" tabindex="0" role="button" aria-label="Pour into the ${C[k].name.toLowerCase()}">
        <clipPath id="clip-${k}"><path d="${C[k].path}"/></clipPath>
        <path d="${C[k].path}" fill="#F8FAFC" fill-opacity=".14"/>
        <g clip-path="url(#clip-${k})"><rect id="w-${k}" x="-500" y="0" width="1000" height="1000" fill="url(#g-water)"/>
          <rect id="ws-${k}" x="-500" y="0" width="1000" height="5" fill="#CFFAFE"/></g>
        <path d="${C[k].path}" fill="none" stroke="#F8FAFC" stroke-width="5" stroke-linejoin="round"/>
        <rect class="pour-hit" x="-125" y="${-C[k].h - 10}" width="250" height="${C[k].h + 20}" fill="transparent"/>
      </g>`;
    root.innerHTML = `<div class="slide-inner s5-grid">
      <div class="s5-stage">
        ${head('Mission 5 · Water lab', 'Investigating Liquids')}
        <svg viewBox="0 0 770 440" class="s5-scene" role="img" aria-label="The same amount of water is poured between a tall bottle, a wide bowl and a narrow glass.">
          <rect y="${FLOOR}" width="770" height="14" rx="7" fill="#99F6E4" opacity=".55"/>
          <path id="s5-stream" fill="none" stroke="url(#g-water)" stroke-width="13" stroke-linecap="round" opacity="0"/>
          ${['bottle', 'bowl', 'glass'].map(part).join('')}
          ${['bottle', 'bowl', 'glass'].map(k => `<text x="${C[k].x}" y="${FLOOR + 40}" text-anchor="middle" class="s5-lab">${C[k].name}</text>`).join('')}
        </svg>
        <div class="s5-volume"><span>Water in the lab</span><b>200 ml</b><small>never changes</small></div>
      </div>
      <aside class="s5-side">
        <div id="s5-panel"></div>
        <div class="note note-info" id="s5-note"></div>
        <div class="s5-eg">${art('water_pouring', { alt: '' })}<p><b>Real life:</b> pour juice from a carton into a cup. It changes shape, but you still have the same amount of juice!</p></div>
      </aside>
    </div>`;

    /* The water surface stays level as a container tips: the water rectangle
       counter-rotates inside the rotating, clip-pathed container. */
    const st = {};
    Object.keys(C).forEach(k => {
      st[k] = { x: C[k].x, y: FLOOR, a: 0, plane: 0, el: root.querySelector('#c-' + k), w: root.querySelector('#w-' + k), ws: root.querySelector('#ws-' + k) };
    });
    const paint = k => {
      const s = st[k];
      s.el.setAttribute('transform', `translate(${s.x} ${s.y}) rotate(${s.a})`);
      const t = `rotate(${-s.a}) translate(0 ${-s.plane})`;
      s.w.setAttribute('transform', t);
      s.ws.setAttribute('transform', t);
      s.ws.style.display = s.plane > -600 ? '' : 'none';
    };
    let holder = 'bottle';
    Object.keys(C).forEach(k => {
      st[k].plane = k === holder ? C[k].level : -900;
      paint(k);
    });

    const stream = root.querySelector('#s5-stream');
    const panel = root.querySelector('#s5-panel');
    const note = root.querySelector('#s5-note');
    const visited = new Set(['bottle']);
    let busy = false;
    let canPour = false;

    async function pour(to) {
      if (busy || !canPour || to === holder) return;
      busy = true;
      root.querySelector('.s5-stage').classList.remove('s5-prompt');
      const from = holder;
      const f = C[from], t = C[to], s = st[from];
      const dir = t.x > f.x ? 1 : -1;
      const ang = f.tilt * dir;
      const rad = ang * Math.PI / 180;
      const lx = f.lip * dir, ly = -f.h;
      const rx = lx * Math.cos(rad) - ly * Math.sin(rad);
      const ry = lx * Math.sin(rad) + ly * Math.cos(rad);
      const rimY = FLOOR - t.h;
      const lipX = t.x, lipY = Math.max(40, rimY - 34);
      const px = lipX - rx, py = lipY - ry;
      const startPlane = s.plane;
      const fullPlane = -ry + f.span;

      /* Keep the moving container in front of the other two. */
      s.el.parentNode.appendChild(s.el);
      SM.sound('click');
      await SM.animate(ctx, 850, e => {
        s.x = SM.lerp(f.x, px, e);
        s.y = SM.lerp(FLOOR, py, e);
        s.a = SM.lerp(0, ang, e);
        s.plane = SM.lerp(startPlane, fullPlane, e);
        paint(from);
      });
      stream.setAttribute('opacity', '1');
      const endPlane = -ry - 3;
      const tgt = st[to];
      await SM.animate(ctx, 1500, (e, raw) => {
        s.plane = SM.lerp(fullPlane, endPlane, raw);
        paint(from);
        tgt.plane = SM.lerp(0, t.level, raw);
        paint(to);
        const sy = FLOOR - tgt.plane;
        const wob = Math.sin(raw * 40) * 2;
        stream.setAttribute('d', `M${lipX} ${lipY} C${lipX + wob} ${lipY + 30} ${lipX - wob} ${sy - 30} ${lipX} ${sy}`);
        stream.setAttribute('stroke-width', raw > .9 ? 13 * (1 - (raw - .9) * 10) + .5 : 13);
      });
      stream.setAttribute('opacity', '0');
      s.plane = -900;
      await SM.animate(ctx, 700, e => {
        s.x = SM.lerp(px, f.x, e);
        s.y = SM.lerp(py, FLOOR, e);
        s.a = SM.lerp(ang, 0, e);
        paint(from);
      });
      holder = to;
      visited.add(to);
      busy = false;
      SM.note(note, 'good', `The water now looks ${to === 'bowl' ? 'wide and low' : to === 'glass' ? 'tall and thin' : 'tall'} in the ${t.name.toLowerCase()}, but there is still <b>200 ml</b>.`);
      SM.sound('good');
      if (visited.size === 3) finish(st[to].el);
      else promptNext();
    }

    function finish(src) {
      ctx.act('pour').done(src);
      panel.innerHTML = `<h2>What we found</h2>
        <p>A <b class="v">liquid</b> flows and takes the <b class="v">shape of its container</b>.</p>
        <p>Its <b class="v">volume</b> (how much space it takes up) stays the same.</p>`;
      SM.note(note, 'good', 'Tap any container to pour again.');
      canPour = true;
    }

    function promptNext() {
      root.querySelector('.s5-stage').classList.add('s5-prompt');
      if (!note.textContent) SM.note(note, 'info', 'Tap a glowing empty container to pour the water into it.');
    }

    Object.keys(C).forEach(k => {
      ctx.on(st[k].el, 'click', () => pour(k));
      ctx.on(st[k].el, 'keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pour(k);
        }
      });
    });

    /* Predictions come first, with one question at a time. */
    const Qs = [
      { q: 'We pour the water into a different container. Will its <b>shape</b> change?', a: ['Yes, it changes', 'No, it stays the same'], ok: 0, hint: 'Think of a puddle and a full glass. Is water the same shape in both?' },
      { q: 'Will the <b>amount</b> of water (its volume) change?', a: ['Yes, it changes', 'No, it stays the same'], ok: 1, hint: 'We are not adding or spilling any water. Is there more or less?' }
    ];
    let qi = 0;
    function askQ() {
      const Q = Qs[qi];
      panel.innerHTML = `<span class="s5-qn">Prediction ${qi + 1} of 2</span><h2>${Q.q}</h2>
        <div class="choice-col">${Q.a.map((t, i) => `<button class="btn btn-choice" data-i="${i}">${t}</button>`).join('')}</div>`;
      panel.querySelectorAll('button').forEach(b => ctx.on(b, 'click', () => {
        if (+b.dataset.i === Q.ok) {
          SM.good(b);
          qi++;
          if (qi < Qs.length) ctx.after(450, askQ);
          else {
            ctx.act('predict').done(b);
            ctx.after(450, startPour);
          }
        } else {
          ctx.act('predict').miss();
          SM.bad(b);
          SM.note(note, 'hint', Q.hint);
        }
      }));
    }
    function startPour() {
      canPour = true;
      panel.innerHTML = `<span class="s5-qn">Now test it!</span><h2>Pour the water into both empty containers.</h2>
        <p>Watch the water change shape. Keep an eye on the <b class="v">200 ml</b> sign too.</p>`;
      SM.note(note, 'info', 'Tap a glowing container to pour the water into it.');
      promptNext();
    }
    SM.note(note, 'info', 'A <b class="v">liquid</b> can flow. Make your predictions, then test them.');
    askQ();
  };

  /* ================= 6. INVESTIGATING GASES ================= */
  R.gases = function (root, ctx) {
    root.innerHTML = `<div class="slide-inner s6-grid">
      <div class="s6-room" id="s6-room">
        <div class="s6-wall" aria-hidden="true">
          <div class="s6-window"></div><div class="s6-door"></div><div class="s6-rug"></div>
        </div>
        <canvas id="s6-canvas" aria-label="A room where gas particles spread out"></canvas>
        <div class="s6-zones" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<i data-z="${i}"></i>`).join('')}</div>
        <button class="s6-balloon" id="s6-balloon" disabled aria-label="Let the air out of the balloon">${art('air_balloon', { alt: '' })}<span class="s6-tag">Tap me!</span></button>
        <div class="s6-meter" id="s6-meter" hidden><span>Room filled</span><div class="meter"><i id="s6-bar"></i></div><b id="s6-pct">0%</b></div>
      </div>
      <aside class="s6-side">
        ${head('Mission 6 · Gas room', 'Investigating Gases')}
        <p>A <b class="v">gas</b> has no shape of its own. Its particles fly about and <b class="v">spread out to fill all the space</b> they can reach.</p>
        <div id="s6-panel"></div>
        <div class="note note-info" id="s6-note"></div>
        <p class="s6-eg"><b>Real life:</b> you can smell toast from another room because gas particles from the toast spread through the air.</p>
      </aside>
    </div>`;

    const panel = root.querySelector('#s6-panel');
    const note = root.querySelector('#s6-note');
    const balloon = root.querySelector('#s6-balloon');
    const canvas = root.querySelector('#s6-canvas');
    const room = root.querySelector('#s6-room');
    const g = canvas.getContext('2d');
    const zones = [...root.querySelectorAll('.s6-zones i')];
    const COLS = 4, ROWS = 3;
    const lit = new Set();
    let released = false, W = 0, H = 0, done = false, ptr = null;
    const P = [];

    const Q = { q: 'If we let the air out of this balloon, where will the gas go?', a: ['It stays in one corner', 'It spreads through the whole room', 'It sinks to the floor and stays there'], ok: 1, hint: 'Remember the trick: G for gas, "Goes everywhere!"' };
    panel.innerHTML = `<h2 class="s6-q">${Q.q}</h2><div class="choice-col">${Q.a.map((t, i) => `<button class="btn btn-choice btn-choice-s" data-i="${i}">${t}</button>`).join('')}</div>`;
    SM.note(note, 'info', '<b>Predict:</b> choose an answer.');
    panel.querySelectorAll('button').forEach(b => ctx.on(b, 'click', () => {
      if (+b.dataset.i === Q.ok) {
        SM.good(b);
        ctx.act('predict').done(b);
        panel.innerHTML = '';
        balloon.disabled = false;
        balloon.classList.add('s6-ready');
        SM.note(note, 'good', 'Yes! Now <b>tap the balloon</b> to let the air out and test it.');
      } else {
        ctx.act('predict').miss();
        SM.bad(b);
        SM.note(note, 'hint', Q.hint);
      }
    }));

    function size() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (w && h && (w !== W || h !== H)) {
        W = w; H = h;
        const d = Math.min(2, devicePixelRatio || 1);
        canvas.width = W * d;
        canvas.height = H * d;
        g.setTransform(d, 0, 0, d, 0, 0);
      }
    }
    ctx.on(balloon, 'click', () => {
      if (released) return;
      released = true;
      balloon.classList.remove('s6-ready');
      balloon.classList.add('s6-gone');
      SM.sound('pop');
      size();
      for (let i = 0; i < 54; i++) {
        const a = Math.random() * 6.28;
        P.push({ x: W / 2 + Math.cos(a) * 16, y: H * .5 + Math.sin(a) * 16, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2 });
      }
      root.querySelector('#s6-meter').hidden = false;
      SM.note(note, 'info', '<b>Help the gas spread!</b> Sweep your finger or mouse across the room to fill every section.');
    });

    const toLocal = e => {
      const r = canvas.getBoundingClientRect();
      const s = r.width / canvas.clientWidth;
      return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
    };
    ctx.on(room, 'pointerdown', e => { ptr = toLocal(e); });
    ctx.on(room, 'pointermove', e => { ptr = toLocal(e); });
    ctx.on(room, 'pointerleave', () => { ptr = null; });
    ctx.on(room, 'pointerup', e => { if (e.pointerType === 'touch') ptr = null; });

    const dot = document.createElement('canvas');
    dot.width = dot.height = 32;
    (() => {
      const d = dot.getContext('2d');
      const grad = d.createRadialGradient(13, 12, 2, 16, 16, 15);
      grad.addColorStop(0, '#F3EDFF');
      grad.addColorStop(.5, '#A78BFA');
      grad.addColorStop(1, '#5B34C4');
      d.fillStyle = grad;
      d.beginPath();
      d.arc(16, 16, 15, 0, 6.3);
      d.fill();
    })();

    ctx.frame(() => {
      size();
      if (!W) return;
      g.clearRect(0, 0, W, H);
      P.forEach(p => {
        p.vx += (Math.random() - .5) * .3;
        p.vy += (Math.random() - .5) * .3;
        if (ptr) {
          const dx = p.x - ptr.x, dy = p.y - ptr.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 130) {
            const f = (130 - d) / 130 * 1.3;
            p.vx += dx / d * f;
            p.vy += dy / d * f;
          }
        }
        p.vx *= .985;
        p.vy *= .985;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 7) { p.vx *= 7 / sp; p.vy *= 7 / sp; }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 9) { p.x = 9; p.vx = Math.abs(p.vx); }
        if (p.x > W - 9) { p.x = W - 9; p.vx = -Math.abs(p.vx); }
        if (p.y < 9) { p.y = 9; p.vy = Math.abs(p.vy); }
        if (p.y > H - 9) { p.y = H - 9; p.vy = -Math.abs(p.vy); }
        g.drawImage(dot, p.x - 9, p.y - 9, 18, 18);
        if (released) {
          const z = Math.min(ROWS - 1, Math.floor(p.y / H * ROWS)) * COLS + Math.min(COLS - 1, Math.floor(p.x / W * COLS));
          if (!lit.has(z)) {
            lit.add(z);
            zones[z].classList.add('lit');
            const pct = Math.round(lit.size / (COLS * ROWS) * 100);
            root.querySelector('#s6-bar').style.width = pct + '%';
            root.querySelector('#s6-pct').textContent = pct + '%';
            SM.sound('click');
          }
        }
      });
      if (released && !done && lit.size === COLS * ROWS) {
        done = true;
        ctx.act('spread').done(root.querySelector('#s6-meter'));
        SM.note(note, 'good', '<b>The gas has filled the room!</b> Real air is invisible. We drew dots so you can imagine its particles.');
        ctx.say('Gas particles keep moving, even after the room is full.');
      }
    });
  };

  /* ================= 7. THE PARTICLE DETECTIVE ================= */
  R.particles = function (root, ctx) {
    const T = [
      { k: 'solid', col: 'blue', n: 48, r: 14, clue: 'Packed in tidy rows. They only jiggle on the spot.', name: 'Solid' },
      { k: 'liquid', col: 'teal', n: 34, r: 14, clue: 'Close together, but sliding around each other.', name: 'Liquid' },
      { k: 'gas', col: 'lav', n: 12, r: 14, clue: 'Far apart and zooming freely in all directions.', name: 'Gas' }
    ];
    const order = ['liquid', 'gas', 'solid'];
    root.innerHTML = `<div class="slide-inner s7-wrap">
      <div class="s7-top">
        ${head('Mission 7 · Particle vault', 'The Particle Detective', 'All matter is made of tiny <b class="v">particles</b>, far too small to see. How they move tells us the state.')}
        <div class="s7-mascot">${art('scientist_mascot', { alt: '' })}</div>
      </div>
      <div class="s7-tanks">
        ${T.map((t, i) => `<div class="s7-tank-col" data-k="${t.k}">
          <div class="s7-dropname" data-slot="${t.k}" data-cap="1" tabindex="0" role="button" aria-label="Name for tank ${i + 1}"><span class="slot-fill"></span><span class="s7-q">Which state?</span></div>
          <div class="s7-tank" id="tank-${t.k}">
            <canvas></canvas>
            <div class="s7-slots"></div>
            <div class="s7-glass" aria-hidden="true"></div>
          </div>
          <div class="s7-clue">${t.clue}</div>
          <div class="s7-tray" data-tray="${t.k}"></div>
        </div>`).join('')}
      </div>
      <div class="s7-bottom">
        <div class="s7-tags" id="s7-tags">${order.map(k => `<button class="tag tag-${k}" data-drag data-k="${k}">${T.find(t => t.k === k).name}</button>`).join('')}</div>
        <div class="note note-info" id="s7-note"><b>Case 1:</b> watch the particles, then drag each name onto its tank.</div>
        <button class="btn btn-glow" id="s7-build" hidden>Build the models</button>
      </div>
    </div>`;

    const note = root.querySelector('#s7-note');
    const tanks = {};
    T.forEach(t => {
      tanks[t.k] = SM.Tank(root.querySelector(`#tank-${t.k} canvas`), { state: t.k, col: t.col, n: t.n, r: t.r });
    });
    ctx.frame(() => Object.values(tanks).forEach(x => x.tick()));

    /* ----- Case 1: name the tanks ----- */
    SM.sortGame(ctx, {
      root: root.querySelector('.s7-wrap'),
      only: it => it.classList.contains('tag'),
      correct: (it, sl) => it.dataset.k === sl.dataset.slot,
      onRight(it, sl) {
        sl.classList.add('named');
        sl.parentNode.classList.add('solved');
        SM.note(note, 'good', `Yes, that is a <b>${it.textContent}</b>! ${T.find(t => t.k === it.dataset.k).clue}`);
      },
      onWrong(it) {
        ctx.act('identify').miss();
        const h = { solid: 'A solid has particles in neat rows that only jiggle.', liquid: 'A liquid has close particles that slide past each other.', gas: 'A gas has far-apart particles flying everywhere.' };
        SM.note(note, 'hint', 'Look again. ' + h[it.dataset.k]);
      },
      onDone() {
        ctx.act('identify').done(root.querySelector('.s7-tanks'));
        SM.note(note, 'good', '<b>Case 1 solved!</b> Now build your own particle models.');
        const b = root.querySelector('#s7-build');
        b.hidden = false;
        root.querySelector('#s7-tags').hidden = true;
      }
    });

    /* ----- Case 2: arrange particles into each pattern ----- */
    const LAYOUT = {
      solid: { pts: [] },
      liquid: { pts: [[-70, 24], [-34, 26], [2, 24], [38, 26], [-50, 56], [-14, 58], [22, 56]] },
      gas: { pct: true, pts: [[20, 20], [76, 30], [44, 56], [16, 80], [78, 78]] }
    };
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) LAYOUT.solid.pts.push([(c - 1) * 36, 26 + r * 36]);
    const slotStyle = (kind, p) => LAYOUT[kind].pct ? `left:${p[0]}%;top:${p[1]}%` : `left:calc(50% + ${p[0]}px);top:calc(100% - ${p[1]}px)`;

    ctx.on(root.querySelector('#s7-build'), 'click', () => {
      root.querySelector('#s7-build').hidden = true;
      root.classList.add('s7-building');
      SM.note(note, 'info', '<b>Case 2:</b> drag each particle into its tank, or just tap it. Watch the pattern each one makes!');
      const built = new Set();
      T.forEach(t => {
        const tank = tanks[t.k];
        tank.on = false;
        tank.n = 0;
        tank.p = [];
        tank.draw();
        const holder = root.querySelector(`#tank-${t.k}`);
        const slots = holder.querySelector('.s7-slots');
        slots.dataset.slot = 'p-' + t.k;
        slots.innerHTML = LAYOUT[t.k].pts.map(p => `<i class="ghost-p" style="${slotStyle(t.k, p)}"></i>`).join('');
        const tray = root.querySelector(`[data-tray="${t.k}"]`);
        tray.innerHTML = LAYOUT[t.k].pts.map(() => `<button class="ball ball-${t.col}" data-drag="p" data-t="${t.k}" aria-label="${t.name} particle"></button>`).join('');
      });
      const place = (ball, kind) => {
        const holder = root.querySelector(`#tank-${kind} .s7-slots`);
        const free = holder.querySelector('.ghost-p:not(.filled)');
        if (!free) return;
        free.classList.add('filled', 'ball-' + T.find(t => t.k === kind).col);
        ball.remove();
        SM.sound('pop');
        if (!holder.querySelector('.ghost-p:not(.filled)')) {
          built.add(kind);
          const t = T.find(x => x.k === kind);
          holder.innerHTML = '';
          delete holder.dataset.slot;
          const tank = tanks[kind];
          tank.n = LAYOUT[kind].pts.length;
          tank.r = 17;
          if (kind === 'solid') tank.cols = 3;
          tank.on = true;
          SM.good(holder.parentNode, { quiet: false });
          const lines = { solid: 'Tidy rows, jiggling on the spot.', liquid: 'Close together and sliding around.', gas: 'Spread far apart and zooming.' };
          SM.note(note, 'good', `<b>${t.name} built!</b> ${lines[kind]}`);
          if (built.size === 3) {
            ctx.act('build').done(root.querySelector('.s7-tanks'));
            SM.note(note, 'good', '<b>Case closed, Detective!</b> Same particles, different patterns. That is what makes solids, liquids and gases different.');
          }
        }
      };
      const wrap = root.querySelector('.s7-tanks');
      SM.dragKit(ctx, {
        root: wrap,
        noTap: true,
        only: it => it.classList.contains('ball'),
        onDrop(it, sl) {
          if (it.dataset.drag !== 'p') return;
          if (sl.dataset.slot === 'p-' + it.dataset.t) place(it, it.dataset.t);
          else SM.bad(it);
        }
      });
      /* A simple tap also places a particle. */
      ctx.on(wrap, 'click', e => {
        const b = e.target.closest('.ball');
        if (b) place(b, b.dataset.t);
      });
    });
  };

  /* ================= 8. TRICKY MATERIALS ================= */
  R.tricky = function (root, ctx) {
    const M = [
      { k: 'sand', n: 'Sand', bin: 'solid', look: 'It pours like a liquid. But look closely at one grain.', why: 'Sand is a <b class="v">solid</b>. Each tiny grain is hard and keeps its own shape. Sand only pours because millions of grains slide past each other.', a: 'sand' },
      { k: 'rice', n: 'Rice', bin: 'solid', look: 'You can pour rice from a packet.', why: 'Rice is a <b class="v">solid</b>. Every grain keeps its shape. A heap of rice does not flow flat like water.', a: 'rice' },
      { k: 'salt', n: 'Salt', bin: 'solid', look: 'Salt pours out of a shaker.', why: 'Salt is a <b class="v">solid</b>. Under a magnifying glass, each grain is a tiny hard crystal.', a: 'salt' },
      { k: 'honey', n: 'Honey', bin: 'liquid', look: 'Honey is thick and slow, not runny.', why: 'Honey is a <b class="v">liquid</b>. It flows slowly, but it still takes the shape of its jar in the end.', a: 'honey' },
      { k: 'toothpaste', n: 'Toothpaste', bin: 'both', look: 'It sits on the brush, then flows when you squeeze the tube.', why: 'Toothpaste <b class="v">acts like both</b>. It holds its shape when left alone, but flows when you push it.', a: 'toothpaste' },
      { k: 'oobleck', n: 'Oobleck', bin: 'both', look: 'Oobleck is cornflour mixed with water.', why: 'Oobleck <b class="v">acts like both</b>. Press it fast and it feels hard. Let it rest and it drips like a liquid.', a: 'oobleck' }
    ];
    const grains = Array.from({ length: 34 }, (_, i) => `<i style="--x:${(i * 41) % 100};--d:${(i * .13) % 1.4}s"></i>`).join('');
    root.innerHTML = `<div class="slide-inner s8-grid">
      <div class="s8-shelfwrap">
        ${head('Mission 8 · Mystery room', 'Tricky Materials', 'Some materials try to fool us! Inspect each clue.')}
        <div class="s8-shelf" id="s8-shelf">
          ${M.map(m => `<button class="s8-jar" data-k="${m.k}">${art(m.a, { alt: '' })}<span>${m.n}</span><i class="s8-tick">${SM.icons.check}</i></button>`).join('')}
        </div>
        <div class="note note-info" id="s8-note">Tap all six materials to inspect them.</div>
      </div>
      <div class="s8-right">
        <div class="s8-lens" id="s8-lens">
          <div class="s8-lens-empty"><span class="art"><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="90" cy="90" r="68" fill="#F8FAFC" fill-opacity=".12" stroke="#94A3B8" stroke-width="10"/><rect x="138" y="136" width="62" height="20" rx="10" transform="rotate(45 142 142)" fill="url(#g-coral)"/><text x="90" y="118" text-anchor="middle" font-size="84" font-weight="700" fill="#FDE68A" font-family="Fredoka, sans-serif">?</text></svg></span><p>Choose a material to look at it close up.</p></div>
        </div>
        <div class="s8-bins" id="s8-bins" hidden>
          <div class="s8-bin bin-solid" data-slot="solid" data-cap="3" tabindex="0" role="button" aria-label="Solid"><b>SOLID</b><small>Grains or pieces keep their shape</small><div class="slot-fill"></div></div>
          <div class="s8-bin bin-liquid" data-slot="liquid" data-cap="1" tabindex="0" role="button" aria-label="Liquid"><b>LIQUID</b><small>Flows and fills its container</small><div class="slot-fill"></div></div>
          <div class="s8-bin bin-both" data-slot="both" data-cap="2" tabindex="0" role="button" aria-label="Acts like both"><b>ACTS LIKE BOTH</b><small>Sometimes holds, sometimes flows</small><div class="slot-fill"></div></div>
        </div>
      </div>
    </div>`;
    const lens = root.querySelector('#s8-lens');
    const note = root.querySelector('#s8-note');
    const jars = [...root.querySelectorAll('.s8-jar')];
    const seen = new Set();
    let sorting = false;

    function inspect(m, jar) {
      jars.forEach(j => j.classList.toggle('active', j === jar));
      lens.innerHTML = `<div class="s8-view s8-view-${m.k}">
        <div class="s8-big">${art(m.a, { alt: m.n })}<span class="s8-ring" aria-hidden="true"></span></div>
        ${m.k === 'sand' ? `<div class="s8-pour" aria-hidden="true">${grains}</div>` : ''}
        <h2>${m.n}</h2><p class="s8-look">${m.look}</p><p class="s8-why">${m.why}</p>
      </div>`;
      jar.classList.add('seen');
      seen.add(m.k);
      SM.sound('click');
      if (seen.size === 6 && !sorting) {
        ctx.act('inspect').done(jar);
        const btn = document.createElement('button');
        btn.className = 'btn btn-glow s8-go';
        btn.textContent = 'Start the sorting challenge';
        note.replaceWith(btn);
        ctx.on(btn, 'click', () => {
          btn.replaceWith(note);
          startSort();
        });
      }
    }
    jars.forEach((j, i) => ctx.on(j, 'click', () => {
      if (!sorting) inspect(M[i], j);
    }));

    function startSort() {
      sorting = true;
      lens.hidden = true;
      root.querySelector('#s8-bins').hidden = false;
      root.querySelector('.s8-grid').classList.add('sorting');
      jars.forEach(j => {
        j.classList.remove('active');
        j.setAttribute('data-drag', '');
      });
      SM.note(note, 'info', 'Drag each material into the right group, or tap it and then tap a group.');
      SM.sortGame(ctx, {
        root: root.querySelector('.s8-grid'),
        correct: (it, sl) => M.find(m => m.k === it.dataset.k).bin === sl.dataset.slot,
        onRight(it) {
          SM.note(note, 'good', M.find(m => m.k === it.dataset.k).why);
        },
        onWrong(it) {
          ctx.act('sort').miss();
          const m = M.find(x => x.k === it.dataset.k);
          const hints = {
            sand: 'Sand pours, but look at one grain. Does the grain change shape?',
            rice: 'Does a single grain of rice change shape in a bowl?',
            salt: 'A salt grain is a tiny hard crystal. What does that make it?',
            honey: 'Honey is slow, but does it flow and fill its jar?',
            toothpaste: 'It stays on the brush but flows when squeezed. Is it just one thing?',
            oobleck: 'Hard when pressed, but drippy when resting. Is it just one thing?'
          };
          SM.note(note, 'hint', hints[m.k]);
        },
        onDone() {
          ctx.act('sort').done(root.querySelector('#s8-bins'));
          SM.note(note, 'good', '<b>Mystery solved!</b> Pouring does not always mean liquid. Look closely at the pieces.');
          note.insertAdjacentHTML('afterend', `<div class="s8-recap">${art('scientist_mascot', { alt: '' })}<div><h2>Detective's notebook</h2><p>Sand, rice and salt are <b class="v">solids</b> made of tiny pieces. Honey is a thick <b class="v">liquid</b>. Toothpaste and oobleck <b class="v">act like both</b>.</p></div></div>`);
          ctx.say('Top detective work! Sand is the sneakiest one of all.');
        }
      });
    }
  };
})();
