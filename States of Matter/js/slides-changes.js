/* Slides 9 to 16: changes of state, equipment, temperature, final mission. */
(function () {
  const R = SM.renderers;
  const art = SM.art;
  const head = SM.head;

  /* ================= 9. MATTER CAN CHANGE STATE ================= */
  R.change = function (root, ctx) {
    const drops = [[250, 112, 7], [292, 110, 10], [334, 112, 6], [376, 110, 9], [420, 112, 7], [272, 124, 5], [352, 124, 6], [398, 126, 4]];
    const bubbles = Array.from({ length: 12 }, (_, i) => `<circle class="s9-bub" cx="${215 + (i * 43) % 210}" cy="350" r="${3 + i % 4}" style="--d:${(i * .19).toFixed(2)}s"/>`).join('');
    const vap = Array.from({ length: 14 }, (_, i) => `<circle class="s9-vap" cx="${210 + (i * 67) % 220}" cy="240" r="6" style="--d:${(i * .27).toFixed(2)}s"/>`).join('');
    const flames = `<path d="M-26 0c-6-22 14-30 12-52 16 10 30 28 24 52zM2 0c-4-14 10-22 8-38 12 8 20 22 16 38z" fill="url(#g-coral)"/><path d="M-12 0c-2-10 6-14 6-24 8 6 12 14 10 24z" fill="#FDE68A"/>`;
    root.innerHTML = `<div class="slide-inner s9-wrap">
      <div class="s9-head">
        ${head('Mission 9 · Change chamber', 'Matter Can Change State')}
        <ol class="s9-journey">
          <li data-p="ice" class="on"><b>ICE</b><small>solid</small></li><li class="s9-arrow" data-a="melt"><span>melting</span></li>
          <li data-p="water"><b>WATER</b><small>liquid</small></li><li class="s9-arrow" data-a="evap"><span>boiling</span></li>
          <li data-p="vapour"><b>WATER VAPOUR</b><small>gas</small></li><li class="s9-arrow" data-a="cond"><span>condensing</span></li>
          <li data-p="drops"><b>DROPLETS</b><small>liquid again</small></li>
        </ol>
      </div>
      <div class="s9-lab">
        <div class="s9-scene-box">
          <svg viewBox="130 80 380 340" class="s9-scene" role="img" aria-label="A beaker of water being heated and cooled">
            <rect x="180" y="97" width="280" height="12" rx="6" fill="#BAE6FD" stroke="#fff" stroke-width="2"/>
            <g id="s9-drops">${drops.map(d => `<g transform="translate(${d[0]} ${d[1]})"><ellipse class="s9-drop" cx="0" cy="0" rx="${d[2] * .8}" ry="${d[2]}" fill="#CFFAFE" stroke="#38BDF8" stroke-width="1.5"/></g>`).join('')}</g>
            <rect x="196" y="110" width="248" height="250" fill="#F8FAFC" fill-opacity=".08"/>
            <g id="s9-vaps" opacity="0">${vap}</g>
            <rect id="s9-water" x="199" y="360" width="242" height="0" fill="url(#g-water)"/>
            <g id="s9-bubs" opacity="0" fill="#fff" fill-opacity=".85">${bubbles}</g>
            <g id="s9-ice" transform="translate(320 360)">
              <g id="s9-ice-in">
                <rect x="-74" y="-66" width="70" height="66" rx="8" fill="url(#g-ice)" stroke="#fff" stroke-width="2"/>
                <rect x="2" y="-66" width="70" height="66" rx="8" fill="url(#g-ice)" stroke="#fff" stroke-width="2"/>
                <rect x="-36" y="-132" width="70" height="66" rx="8" fill="url(#g-ice)" stroke="#fff" stroke-width="2"/>
                <path d="M-60-52l18-8M16-52l18-8M-22-118l18-8" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
              </g>
            </g>
            <path d="M196 110v240a12 12 0 0 0 12 12h224a12 12 0 0 0 12-12V110" fill="none" stroke="#F8FAFC" stroke-width="6"/>
            <rect x="170" y="380" width="300" height="10" rx="5" fill="url(#g-metal)"/>
            <rect x="190" y="390" width="10" height="26" fill="#64748B"/><rect x="440" y="390" width="10" height="26" fill="#64748B"/>
            <g id="s9-flame" transform="translate(320 412)">${flames}</g>
            <g id="s9-frost" opacity="1" fill="none" stroke="#7DD3FC" stroke-width="3" stroke-linecap="round">
              <path d="M150 140v30M137 148l26 14M163 148l-26 14"/><path d="M488 230v26M477 236l22 14M499 236l-22 14"/><path d="M152 310v26M141 316l22 14M163 316l-22 14"/>
            </g>
          </svg>
          <div class="s9-invisible" id="s9-inv" hidden>Water vapour is <b>invisible</b>. The dashed circles only help you imagine it.</div>
        </div>
        <div class="s9-info">
          <div class="s9-readout">
            <div class="s9-thermo" id="s9-thermo">${SM.thermoSvg(-10, { label: 'Temperature of the water' })}</div>
            <div>
              <div class="s9-temp"><b id="s9-temp">-10</b><span>°C</span></div>
              <div class="s9-lens"><canvas id="s9-lens"></canvas><span>Particle view</span></div>
            </div>
          </div>
        </div>
        <div class="s9-text" id="s9-text"></div>
      </div>
      <div class="s9-dial">
        <span class="s9-cool">COOL</span>
        <input type="range" id="s9-heat" min="0" max="100" value="0" step="1" aria-label="Heat dial. Slide right to heat and left to cool.">
        <span class="s9-hot">HEAT</span>
      </div>
    </div>`;

    const $ = id => root.querySelector(id);
    const lens = SM.Tank($('#s9-lens'), { state: 'solid', col: 'water', n: 20, r: 9, cols: 5, center: true });
    ctx.frame(() => lens.tick());

    const TEXT = {
      ice: ['Ice is a solid', 'Water below 0 °C is <b class="v">ice</b>. Its particles are held in tidy rows. <b>Slide the dial to add heat.</b>', 'solid'],
      melt: ['Melting', 'Heat makes the ice <b class="v">melt</b> into water. It stays at 0 °C until all the ice has gone.', 'liquid'],
      water: ['Water is a liquid', 'The particles now slide around each other. Keep heating to reach <b>100 °C</b>.', 'liquid'],
      boil: ['Boiling', 'At 100 °C water <b class="v">boils</b>. It changes into <b class="v">water vapour</b>, a gas that spreads into the air.', 'gas'],
      cond: ['Condensing', 'Now <b>cool it down</b>. Vapour touching the cold lid turns back into liquid <b class="v">droplets</b>.', 'liquid'],
      drops: ['Back to liquid!', 'Water vapour <b class="v">condensed</b> into droplets on the cold lid. Same water, different state!', 'liquid']
    };
    const seen = { ice: true, water: false, vapour: false, drops: false };
    let boiled = false, phase = '', finished = false;
    const textBox = $('#s9-text');

    function setPhase(p) {
      if (p === phase) return;
      phase = p;
      const T = TEXT[p];
      textBox.innerHTML = `<h2>${T[0]}</h2><p>${T[1]}</p>`;
      textBox.classList.remove('note-in');
      void textBox.offsetWidth;
      textBox.classList.add('note-in');
      lens.setState(T[2]);
      lens.col = 'water';
    }
    function mark(p) {
      if (!seen[p]) {
        seen[p] = true;
        SM.sound('good');
      }
      root.querySelector(`.s9-journey [data-p="${p}"]`).classList.add('on');
    }

    function update() {
      const h = +$('#s9-heat').value;
      /* Temperature pauses at 0 °C while melting and at 100 °C while boiling. */
      let temp;
      if (h <= 10) temp = SM.lerp(-10, 0, h / 10);
      else if (h <= 35) temp = 0;
      else if (h <= 75) temp = SM.lerp(0, 100, (h - 35) / 40);
      else temp = 100;
      const ice = h <= 10 ? 1 : h >= 35 ? 0 : 1 - (h - 10) / 25;
      const vapour = h >= 75 ? (h - 75) / 25 : 0;
      if (vapour > .6) boiled = true;
      const drip = boiled ? SM.clamp((75 - h) / 25, 0, 1) : 0;
      const water = ice < 1 ? (1 - ice) * (1 - vapour * .65) : 0;

      $('#s9-temp').textContent = Math.round(temp);
      SM.setThermo($('#s9-thermo'), temp);
      const wh = water * 140;
      const wr = $('#s9-water');
      wr.setAttribute('y', 360 - wh);
      wr.setAttribute('height', wh);
      $('#s9-ice-in').setAttribute('transform', `translate(0 ${-wh * ice * .35}) scale(${Math.max(.0001, Math.pow(ice, .6))})`);
      $('#s9-bubs').setAttribute('opacity', vapour > 0 ? 1 : (temp > 80 ? .4 : 0));
      $('#s9-vaps').setAttribute('opacity', boiled ? Math.max(vapour, 0.15 + (drip < 1 ? (1 - drip) * .5 : 0)) : vapour);
      root.querySelectorAll('.s9-drop').forEach(el => el.setAttribute('transform', `scale(${drip || .0001})`));
      const flame = (h / 100) * 1.5;
      $('#s9-flame').setAttribute('transform', `translate(320 412) scale(${flame})`);
      $('#s9-flame').setAttribute('opacity', h < 4 ? 0 : 1);
      $('#s9-frost').setAttribute('opacity', Math.max(0, 1 - h / 12));
      $('#s9-inv').hidden = !(vapour > 0 || (boiled && drip < 1));

      if (h >= 35) mark('water');
      if (vapour > .6) mark('vapour');
      if (drip > .95) mark('drops');
      root.querySelector('[data-a="melt"]').classList.toggle('active', h > 10 && h < 35);
      root.querySelector('[data-a="evap"]').classList.toggle('active', h >= 75);
      root.querySelector('[data-a="cond"]').classList.toggle('active', boiled && h < 75 && drip < 1);

      if (drip > .95) setPhase('drops');
      else if (boiled && h < 95 && (drip > 0 || vapour < 1)) setPhase('cond');
      else if (h >= 75) setPhase('boil');
      else if (h >= 35) setPhase('water');
      else if (h > 10) setPhase('melt');
      else setPhase('ice');

      if (!finished && seen.water && seen.vapour && seen.drops) {
        finished = true;
        ctx.act('journey').done(textBox);
        ctx.say('Ice, water and water vapour are all the same stuff: water!');
      }
    }
    ctx.on($('#s9-heat'), 'input', update);
    update();
    ctx.after(100, () => SM.setThermo($('#s9-thermo'), -10));
  };

  /* ================= 10. MELTING AND FREEZING ================= */
  R.melt = function (root, ctx) {
    root.innerHTML = `<div class="slide-inner s10-wrap">
      <div class="s10-labelzone">
        <div class="s10-split">
          <section class="s10-exp s10-hot">
            <svg viewBox="0 0 520 190" role="img" aria-label="An ice cube melts into water while it is heated">
              <g class="heat-arrows" fill="none" stroke="#FB923C" stroke-width="6" stroke-linecap="round"><path d="M70 170q10-20 0-40t0-40"/><path d="M450 170q10-20 0-40t0-40"/><path d="M116 170q8-16 0-32t0-32"/><path d="M404 170q8-16 0-32t0-32"/></g>
              <ellipse cx="260" cy="168" rx="170" ry="15" fill="#F8FAFC" opacity=".85"/>
              <ellipse id="m-puddle" cx="260" cy="162" rx="1" ry="1" fill="url(#g-water)"/>
              <g id="m-ice" transform="translate(260 160)"><g id="m-ice-in"><path d="M0-110l58 28v68l-58 28-58-28v-68z" transform="translate(0 -10)" fill="url(#g-ice)" stroke="#fff" stroke-width="3"/><path d="M0-82 58-110M0-82l-58-28M0-82V-4" transform="translate(0 18)" stroke="#fff" stroke-width="3" fill="none"/></g></g>
              <text x="480" y="36" text-anchor="end" class="s10-t" id="m-t">-2 °C</text>
              <text x="30" y="36" class="s10-t2">HEAT GOES IN</text>
            </svg>
            <div class="s10-slot" data-slot="melting" tabindex="0" role="button" aria-label="Name this change"><span class="slot-fill"></span><span class="s10-ph">Which process?</span></div>
          </section>
          <section class="s10-exp s10-cold">
            <svg viewBox="0 0 520 190" role="img" aria-label="Water freezes into ice while it is cooled">
              <g fill="none" stroke="#BAE6FD" stroke-width="3.5" stroke-linecap="round" class="snow">
                <path d="M60 80v30M47 88l26 14M73 88l-26 14"/><path d="M460 70v30M447 78l26 14M473 78l-26 14"/><path d="M120 44v22M110 49l20 12M130 49l-20 12"/><path d="M400 40v22M390 45l20 12M410 45l-20 12"/>
              </g>
              <path d="M110 92h300l-16 76a10 10 0 0 1-10 8H136a10 10 0 0 1-10-8z" fill="#F8FAFC" opacity=".3" stroke="#fff" stroke-width="4"/>
              <path d="M118 112h284l-11 54a9 9 0 0 1-9 7H138a9 9 0 0 1-9-7z" fill="url(#g-water)"/>
              <path id="f-ice" d="M118 112h284l-11 54a9 9 0 0 1-9 7H138a9 9 0 0 1-9-7z" fill="url(#g-ice)" opacity="0"/>
              <g id="f-cracks" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0"><path d="M158 124l26 14 18-10M280 122l18 18 26-12M222 146l26 8"/></g>
              <text x="480" y="36" text-anchor="end" class="s10-t" id="f-t">10 °C</text>
              <text x="30" y="36" class="s10-t2">HEAT COMES OUT</text>
            </svg>
            <div class="s10-slot" data-slot="freezing" tabindex="0" role="button" aria-label="Name this change"><span class="slot-fill"></span><span class="s10-ph">Which process?</span></div>
          </section>
          <div class="s10-mid">
            <h1>Melting &amp; Freezing</h1>
            <div class="s10-chips">
              <button class="tag tag-freeze" data-drag data-k="freezing">FREEZING</button>
              <button class="tag tag-melt" data-drag data-k="melting">MELTING</button>
            </div>
          </div>
        </div>
      </div>
      <div class="s10-words">
        <div class="s10-sent">
          <p>When a solid is <span class="blank" data-slot="heated" tabindex="0" role="button" aria-label="Blank 1"><span class="slot-fill"></span></span>, it melts into a <span class="blank" data-slot="liquid" tabindex="0" role="button" aria-label="Blank 2"><span class="slot-fill"></span></span>.</p>
          <p>When a liquid is <span class="blank" data-slot="cooled" tabindex="0" role="button" aria-label="Blank 3"><span class="slot-fill"></span></span>, it freezes into a <span class="blank" data-slot="solid" tabindex="0" role="button" aria-label="Blank 4"><span class="slot-fill"></span></span>.</p>
          <p>Water freezes and ice melts at <span class="blank" data-slot="zero" tabindex="0" role="button" aria-label="Blank 5"><span class="slot-fill"></span></span>.</p>
        </div>
        <div class="s10-bank">
          ${SM.shuffle([['liquid', 'liquid'], ['solid', 'solid'], ['heated', 'heated'], ['cooled', 'cooled'], ['zero', '0 °C']]).map(w => `<button class="word" data-drag data-k="${w[0]}">${w[1]}</button>`).join('')}
        </div>
        <div class="note note-info" id="s10-note">Drag the process names onto the experiments, then fill the missing words.</div>
      </div>
    </div>`;

    /* Both experiments loop so children can keep watching while they answer. */
    const $ = s => root.querySelector(s);
    ctx.frame(now => {
      const c = (now % 7000) / 7000;
      const p = SM.clamp(c / .72, 0, 1);
      const s = Math.max(.0001, 1 - p);
      $('#m-ice-in').setAttribute('transform', `translate(0 0) scale(${Math.pow(s, .7)})`);
      const pd = $('#m-puddle');
      pd.setAttribute('rx', 30 + 120 * p);
      pd.setAttribute('ry', 2 + 8 * p);
      $('#m-t').textContent = (p < .04 ? '-2' : p < .96 ? '0' : '4') + ' °C';
      const q = p;
      $('#f-ice').setAttribute('opacity', q);
      $('#f-cracks').setAttribute('opacity', q);
      $('#f-t').textContent = (q < .25 ? Math.round(10 - q * 40) : q < .96 ? 0 : -2) + ' °C';
    });

    const note = $('#s10-note');
    SM.sortGame(ctx, {
      root: $('.s10-labelzone'),
      correct: (it, sl) => it.dataset.k === sl.dataset.slot,
      onRight(it) {
        SM.note(note, 'good', it.dataset.k === 'melting' ? '<b class="v">Melting:</b> a solid heats up and turns into a liquid.' : '<b class="v">Freezing:</b> a liquid cools down and turns into a solid.');
      },
      onWrong(it) {
        ctx.act('labels').miss();
        SM.note(note, 'hint', 'Look at the picture. Is the ice appearing or disappearing?');
      },
      onDone() {
        ctx.act('labels').done($('.s10-split'));
        SM.note(note, 'info', 'Great! Now drag the words into the sentences.');
      }
    });
    SM.sortGame(ctx, {
      root: $('.s10-words'),
      correct: (it, sl) => it.dataset.k === sl.dataset.slot,
      onRight(it, sl) { sl.classList.add('filled'); },
      onWrong() {
        ctx.act('words').miss();
        SM.note(note, 'hint', 'Read the whole sentence aloud. Does that word make sense there?');
      },
      onDone() {
        ctx.act('words').done($('.s10-sent'));
        SM.note(note, 'good', '<b>Real life:</b> an ice lolly melts on a hot day. Water in a freezer turns to ice.');
      }
    });
  };

  /* ================= 11. EVAPORATION AND BOILING ================= */
  R.evap = function (root, ctx) {
    const clothesDots = Array.from({ length: 12 }, (_, i) => `<circle class="ev-dot" cx="${95 + (i * 37) % 300}" cy="130" r="5" style="--d:${(i * .38).toFixed(2)}s"/>`).join('');
    const kBubbles = Array.from({ length: 16 }, (_, i) => `<circle class="kt-bub" cx="${136 + (i * 53) % 190}" cy="${238 - (i * 3) % 18}" r="${3 + (i % 4) * 1.6}" style="--d:${(i * .17).toFixed(2)}s"/>`).join('');
    const mini = {
      puddle: '<svg viewBox="0 0 150 100"><circle cx="118" cy="24" r="14" fill="url(#g-yellow)"/><ellipse cx="66" cy="72" rx="56" ry="17" fill="url(#g-water)"/><ellipse cx="50" cy="66" rx="16" ry="4" fill="#fff" opacity=".5"/></svg>',
      pan: '<svg viewBox="0 0 150 100"><path d="M30 40h90v44a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8z" fill="url(#g-metal)"/><rect x="36" y="46" width="78" height="40" fill="url(#g-water)"/><g fill="#fff"><circle cx="54" cy="74" r="5"/><circle cx="74" cy="60" r="6"/><circle cx="94" cy="76" r="4"/><circle cx="66" cy="82" r="3"/><circle cx="102" cy="56" r="5"/></g><rect x="118" y="44" width="30" height="8" rx="4" fill="#475569"/></svg>',
      steps: '<svg viewBox="0 0 150 100"><rect width="150" height="100" rx="10" fill="#BAE6FD" opacity=".35"/><g fill="url(#g-water)"><ellipse cx="42" cy="72" rx="13" ry="20" transform="rotate(-12 42 72)"/><ellipse cx="82" cy="36" rx="13" ry="20" transform="rotate(-12 82 36)"/><circle cx="30" cy="44" r="4"/><circle cx="42" cy="42" r="4"/><circle cx="54" cy="44" r="3.4"/><circle cx="70" cy="8" r="4"/><circle cx="84" cy="7" r="4"/><circle cx="96" cy="9" r="3.4"/></g></svg>',
      kettle: '<svg viewBox="0 0 150 100"><path d="M34 34h76l6 54a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6z" fill="url(#g-coral)"/><path d="M110 50l28-16" stroke="#EA6A12" stroke-width="10" stroke-linecap="round"/><path d="M50 34c0-20 44-20 44 0" fill="none" stroke="#475569" stroke-width="6"/><rect x="42" y="48" width="44" height="38" rx="5" fill="url(#g-water)"/><g fill="#fff"><circle cx="52" cy="76" r="4"/><circle cx="66" cy="62" r="5"/><circle cx="76" cy="78" r="3"/></g></svg>'
    };
    const SC = [
      { s: 'A puddle slowly disappears on a sunny day.', a: 'evap', i: 'puddle', why: 'Water particles escape from the <b>surface</b> of the puddle. No bubbles, and the water is far below 100 °C.' },
      { s: 'A pan of water reaches 100 °C. Big bubbles rise all through it.', a: 'boil', i: 'pan', why: 'Bubbles forming all the way <b>through</b> the water at 100 °C means boiling.' },
      { s: 'Wet footprints by a swimming pool slowly vanish.', a: 'evap', i: 'steps', why: 'The water escapes from the <b>surface</b> into the air, a little at a time.' },
      { s: 'A kettle gets very hot, then starts to bubble and switches itself off.', a: 'boil', i: 'kettle', why: 'A kettle heats water to 100 °C. Bubbles of vapour form <b>throughout</b> the water.' }
    ];
    root.innerHTML = `<div class="slide-inner s11-wrap">
      <div class="s11-split">
        <section class="s11-left">
          <h2><b class="v">Evaporation</b></h2>
          <svg viewBox="0 0 500 250" role="img" aria-label="Wet clothes on a washing line. Water particles escape from their surface.">
            <circle cx="430" cy="52" r="34" fill="url(#g-yellow)" filter="url(#f-glow)"/>
            <g class="sun-rays" stroke="#FDE68A" stroke-width="5" stroke-linecap="round"><path d="M430 4v-2M380 52h-6M400 16l-5-5M400 88l-5 5"/></g>
            <rect x="-120" y="212" width="740" height="38" fill="url(#g-leaf)"/>
            <path d="M16 70q230 44 468-10" fill="none" stroke="#475569" stroke-width="4"/>
            <rect x="16" y="66" width="8" height="150" fill="url(#g-wood-d)"/><rect x="476" y="56" width="8" height="160" fill="url(#g-wood-d)"/>
            <path d="M92 84l34-2 18 10 18-10 34 2 14 34-22 8-6-14v78h-76v-78l-6 14-22-8z" fill="url(#g-coral)"/>
            <path d="M268 90h100l4 110h-40l-12-68-12 68h-44z" fill="#6366F1"/>
            <g class="wet" fill="#7DD3FC"><ellipse cx="124" cy="196" rx="4" ry="6"/><ellipse cx="164" cy="192" rx="3" ry="5"/><ellipse cx="300" cy="204" rx="3" ry="5"/></g>
            <g fill="url(#g-ball-blue)">${clothesDots}</g>
          </svg>
          <ul>
            <li>Happens at the <b class="v">surface</b></li><li>Happens at <b class="v">many temperatures</b>, faster when warm</li><li>No bubbles</li>
          </ul>
        </section>
        <section class="s11-right">
          <h2><b class="v">Boiling</b></h2>
          <svg viewBox="0 0 500 250" role="img" aria-label="A see-through kettle with bubbles forming all through the water at 100 degrees Celsius.">
            <rect x="-120" y="226" width="740" height="24" fill="#475569"/>
            <path d="M112 90h236l18 136H94z" fill="#F8FAFC" fill-opacity=".14" stroke="#F8FAFC" stroke-width="6" stroke-linejoin="round"/>
            <path d="M109 116h242l14 104H95z" fill="url(#g-water)"/>
            <g fill="#fff" fill-opacity=".85">${kBubbles}</g>
            <path d="M348 110l66-40" stroke="#F8FAFC" stroke-width="20" stroke-linecap="round"/>
            <path d="M104 110C40 110 50 200 104 200" fill="none" stroke="#FB923C" stroke-width="13"/>
            <path d="M172 90c0-46 116-46 116 0" fill="none" stroke="#FB923C" stroke-width="10"/>
            <g class="steam-puff" fill="#F8FAFC"><circle cx="466" cy="24" r="17"/><circle cx="484" cy="42" r="13"/><circle cx="450" cy="40" r="11"/></g>
            <path d="M424 60l14-12" stroke="#94A3B8" stroke-width="2" stroke-dasharray="3 5"/>
            <rect x="372" y="150" width="104" height="44" rx="12" fill="#172554"/><text x="424" y="181" text-anchor="middle" fill="#FDE68A" font-size="28" font-weight="800" font-family="Fredoka, sans-serif">100 °C</text>
            <text x="436" y="24" text-anchor="end" fill="#E2E8F0" font-size="14.5" font-weight="800" font-family="Nunito, sans-serif">Visible steam = tiny liquid droplets</text>
          </svg>
          <ul>
            <li>Happens <b class="v">throughout</b> the liquid</li><li>Water boils at <b class="v">100 °C</b></li><li>Bubbles of water vapour form</li>
          </ul>
        </section>
      </div>
      <div class="s11-game">
        <div class="s11-steps" id="s11-steps">${SC.map((_, i) => `<i data-i="${i}">${i + 1}</i>`).join('')}</div>
        <div class="s11-card" id="s11-card"></div>
        <div class="s11-btns">
          <button class="btn btn-evap" data-a="evap">Evaporation</button>
          <button class="btn btn-boil" data-a="boil">Boiling</button>
        </div>
        <div class="note note-info" id="s11-note">Which change is happening? Both turn a liquid into a gas.</div>
      </div>
    </div>`;
    const $ = s => root.querySelector(s);
    const note = $('#s11-note');
    let idx = 0, locked = false;
    const show = () => {
      const s = SC[idx];
      $('#s11-card').innerHTML = `${mini[s.i]}<p>${s.s}</p>`;
      root.querySelectorAll('#s11-steps i').forEach((e, i) => {
        e.classList.toggle('now', i === idx);
        e.classList.toggle('past', i < idx);
      });
      SM.good($('#s11-card'), { quiet: true });
    };
    show();
    root.querySelectorAll('.s11-btns button').forEach(b => ctx.on(b, 'click', () => {
      if (locked) return;
      const s = SC[idx];
      if (b.dataset.a === s.a) {
        locked = true;
        SM.good(b);
        SM.note(note, 'good', s.why);
        ctx.after(2100, () => {
          idx++;
          locked = false;
          if (idx < SC.length) show();
          else {
            root.querySelectorAll('#s11-steps i').forEach(e => { e.classList.add('past'); e.classList.remove('now'); });
            $('#s11-card').innerHTML = '<p class="s11-win">All four solved! Surface = evaporation. All through the liquid at boiling point = boiling.</p>';
            root.querySelector('.s11-btns').hidden = true;
            SM.note(note, 'good', 'You can spot the difference, scientist!');
            ctx.act('scenarios').done($('#s11-card'));
          }
        });
      } else {
        ctx.act('scenarios').miss();
        SM.bad(b);
        SM.note(note, 'hint', s.a === 'boil' ? 'Are bubbles forming all through the water? Is it at 100 °C?' : 'Are there any bubbles? Is the water anywhere near 100 °C?');
      }
    }));
  };

  /* ================= 12. CONDENSATION ================= */
  R.condense = function (root, ctx) {
    const drops = [[300, 180, 8], [336, 240, 11], [292, 280, 9], [344, 320, 7], [306, 356, 12], [340, 396, 8], [374, 200, 7], [380, 280, 10], [378, 360, 7], [410, 228, 9], [418, 318, 11], [412, 384, 6]];
    const vapStart = [[46, 150], [120, 110], [190, 170], [80, 230], [160, 270], [40, 320], [120, 360], [205, 330]];
    root.innerHTML = `<div class="slide-inner s12-grid">
      <div class="s12-scene">
        <svg viewBox="0 0 560 500" role="img" aria-label="A close-up of a cold glass. Invisible water vapour in the air cools on the glass and forms liquid droplets.">
          <circle cx="130" cy="240" r="128" fill="#F8FAFC" fill-opacity=".07" stroke="#94A3B8" stroke-width="3" stroke-dasharray="9 8"/>
          <text x="130" y="82" text-anchor="middle" class="s12-lab">Imagine you could see</text>
          <text x="130" y="102" text-anchor="middle" class="s12-lab">the invisible vapour</text>
          <path d="M262 40h268l-22 420H284z" fill="url(#g-glass)" stroke="#F8FAFC" stroke-width="6" stroke-linejoin="round"/>
          <path d="M278 120h236l-17 330H292z" fill="url(#g-water)" opacity=".75"/>
          <rect x="310" y="88" width="72" height="62" rx="10" fill="url(#g-ice)" stroke="#fff" stroke-width="2" transform="rotate(-8 346 118)"/>
          <rect x="400" y="96" width="72" height="62" rx="10" fill="url(#g-ice)" stroke="#fff" stroke-width="2" transform="rotate(10 436 126)"/>
          <g id="s12-cold" opacity="0" stroke="#BAE6FD" stroke-width="4" stroke-linecap="round" fill="none"><path d="M254 160l-22 0m6-6l-6 6 6 6M254 260l-22 0m6-6l-6 6 6 6M254 360l-22 0m6-6l-6 6 6 6"/></g>
          <g id="s12-vap">${vapStart.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="11" fill="url(#g-ball-lav)"/>`).join('')}</g>
          <g id="s12-drops">${drops.map(d => `<g transform="translate(${d[0]} ${d[1]})"><g class="s12-drop" transform="scale(.001)"><ellipse rx="${d[2]}" ry="${d[2] * 1.3}" fill="#E0F7FF" stroke="#0EA5E9" stroke-width="2"/><circle cx="${-d[2] * .3}" cy="${-d[2] * .45}" r="${d[2] * .28}" fill="#fff"/></g></g>`).join('')}</g>
          <text x="396" y="490" text-anchor="middle" class="s12-lab">Ice-cold glass</text>
        </svg>
        <button class="btn btn-ghost btn-small s12-replay" id="s12-replay" hidden>${SM.icons.reset} Watch again</button>
      </div>
      <div class="s12-side">
        ${head('Mission 12 · Cold glass lab', 'Condensation')}
        <p><b class="v">Condensation</b> is when a <b class="v">gas</b> cools down and turns into a <b class="v">liquid</b>. Put the steps in order to see it happen.</p>
        <div class="s12-slots">
          ${[1, 2, 3].map(n => `<div class="s12-slot" data-slot="${n}" tabindex="0" role="button" aria-label="Step ${n}"><i>${n}</i><span class="slot-fill"></span></div>`).join('')}
        </div>
        <div class="s12-cards">
          <button class="card-step" data-drag data-n="3">Tiny liquid droplets form on the glass.</button>
          <button class="card-step" data-drag data-n="1">Water vapour in the air touches the cold glass.</button>
          <button class="card-step" data-drag data-n="2">The water vapour cools down.</button>
        </div>
        <div class="note note-info" id="s12-note">Water vapour is <b>invisible</b>. The white "steam" you can see from a kettle is really tiny liquid droplets.</div>
      </div>
    </div>`;
    const $ = s => root.querySelector(s);
    const note = $('#s12-note');
    const dots = [...root.querySelectorAll('#s12-vap circle')];
    const dropEls = [...root.querySelectorAll('.s12-drop')];
    let playing = false, floating = true;
    const pos = vapStart.map(p => ({ x: p[0], y: p[1], ph: Math.random() * 6 }));
    ctx.frame(now => {
      if (!floating) return;
      dots.forEach((d, i) => {
        d.setAttribute('cx', pos[i].x + Math.sin(now / 700 + pos[i].ph) * 12);
        d.setAttribute('cy', pos[i].y + Math.cos(now / 900 + pos[i].ph) * 12);
      });
    });
    const play = async () => {
      if (playing) return;
      playing = true;
      floating = false;
      $('#s12-replay').hidden = true;
      dropEls.forEach(d => d.setAttribute('transform', 'scale(.001)'));
      const slotOn = n => root.querySelectorAll('.s12-slot').forEach(s => s.classList.toggle('playing', +s.dataset.slot === n));
      /* Step 1: the vapour drifts to the glass. */
      slotOn(1);
      dots.forEach((d, i) => { d.setAttribute('opacity', 1); d.setAttribute('r', 11); pos[i].tx = 248; pos[i].ty = 130 + i * 40; });
      await SM.animate(ctx, 1500, e => dots.forEach((d, i) => {
        d.setAttribute('cx', SM.lerp(pos[i].x, pos[i].tx, e));
        d.setAttribute('cy', SM.lerp(pos[i].y, pos[i].ty, e));
      }));
      /* Step 2: it cools and slows. */
      slotOn(2);
      $('#s12-cold').setAttribute('opacity', 1);
      await SM.animate(ctx, 1200, e => dots.forEach(d => {
        d.setAttribute('r', SM.lerp(11, 7, e));
        d.setAttribute('fill', e > .5 ? 'url(#g-ball-blue)' : 'url(#g-ball-lav)');
      }));
      /* Step 3: droplets form on the outside of the glass. */
      slotOn(3);
      SM.sound('pop');
      await SM.animate(ctx, 1500, e => {
        dots.forEach((d, i) => {
          d.setAttribute('cx', SM.lerp(pos[i].tx, 300 + i * 12, e));
          d.setAttribute('opacity', 1 - e);
        });
        dropEls.forEach((d, i) => d.setAttribute('transform', `scale(${Math.max(.001, SM.clamp(e * 1.6 - i * .05, 0, 1))})`));
      });
      slotOn(0);
      $('#s12-cold').setAttribute('opacity', 0);
      playing = false;
      $('#s12-replay').hidden = false;
    };
    ctx.on($('#s12-replay'), 'click', play);
    SM.sortGame(ctx, {
      root: $('.s12-side'),
      correct: (it, sl) => it.dataset.n === sl.dataset.slot,
      onWrong() {
        ctx.act('sequence').miss();
        SM.note(note, 'hint', 'What must happen first? The vapour has to reach the glass before it can cool down.');
      },
      onRight() { SM.note(note, 'good', 'Yes, that step goes there!'); },
      onDone() {
        ctx.act('sequence').done($('.s12-slots'));
        SM.note(note, 'good', '<b>Real life:</b> a bathroom mirror mists up after a hot shower. The water comes from the air. It does not leak through the glass!');
        play();
      }
    });
  };

  /* ================= 13. CHANGE-OF-STATE MAP ================= */
  R.map = function (root, ctx) {
    const S = [
      { id: 'melting', acc: ['melting'], route: 'Solid to liquid', cls: 'hot', left: 30.8, top: 15, path: 'M238 150C300 76 440 76 500 150' },
      { id: 'freezing', acc: ['freezing'], route: 'Liquid to solid', cls: 'cold', left: 30.8, top: 75, path: 'M500 280C440 354 300 354 238 280' },
      { id: 'lg1', acc: ['evaporation', 'boiling'], route: 'Liquid to gas', cls: 'hot', left: 69.2, top: 4, path: 'M700 130C770 8 930 8 1000 130' },
      { id: 'lg2', acc: ['evaporation', 'boiling'], route: 'Liquid to gas', cls: 'hot', left: 69.2, top: 31, path: 'M700 190C780 110 920 110 1000 190' },
      { id: 'condensation', acc: ['condensation'], route: 'Gas to liquid', cls: 'cold', left: 69.2, top: 75, path: 'M1000 280C930 354 770 354 700 280' }
    ];
    const INFO = {
      melting: 'Melting: heat turns a solid into a liquid.', freezing: 'Freezing: cooling turns a liquid into a solid.',
      evaporation: 'Evaporation: a liquid turns to gas at its surface.', boiling: 'Boiling: a liquid turns to gas all through, at its boiling point.',
      condensation: 'Condensation: cooling turns a gas into a liquid.'
    };
    const nodes = [
      { k: 'solid', n: 'SOLID', x: 11.7, a: 'ice_cube' }, { k: 'liquid', n: 'LIQUID', x: 50, a: 'water_glass' }, { k: 'gas', n: 'GAS', x: 88.3, a: 'water_vapour' }
    ];
    root.innerHTML = `<div class="slide-inner s13-wrap">
      <div class="s13-head">
        ${head('Mission 13 · Control room', 'The Complete Change-of-State Map')}
        <div class="s13-key"><span class="k-hot">Heating</span><span class="k-cold">Cooling</span></div>
      </div>
      <div class="s13-map">
        <svg viewBox="0 0 1200 430" class="s13-svg" aria-hidden="true">
          <defs>
            <marker id="ah-hot" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto"><path d="M0 0L10 5 0 10z" fill="#FB923C"/></marker>
            <marker id="ah-cold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto"><path d="M0 0L10 5 0 10z" fill="#38BDF8"/></marker>
          </defs>
          ${S.map(s => `<path class="flow flow-${s.cls}" id="flow-${s.id}" d="${s.path}" marker-end="url(#ah-${s.cls})"/>`).join('')}
        </svg>
        ${nodes.map(n => `<div class="s13-node s13-${n.k}" style="left:${n.x}%">${art(n.a, { alt: '', svgOnly: n.k === 'gas' })}<b>${n.n}</b></div>`).join('')}
        ${S.map(s => `<div class="s13-slot s13-slot-${s.cls}" style="left:${s.left}%;top:${s.top}%" data-slot="${s.id}" tabindex="0" role="button" aria-label="${s.route}"><small class="s13-route">${s.route}</small><span class="slot-fill"></span></div>`).join('')}
      </div>
      <div class="s13-bottom">
        <div class="s13-chips">${SM.shuffle(['melting', 'freezing', 'evaporation', 'boiling', 'condensation']).map(k => `<button class="tag tag-proc tag-${k}" data-drag data-k="${k}">${k[0].toUpperCase() + k.slice(1)}</button>`).join('')}</div>
        <div class="note note-info" id="s13-note">Drag each process to the arrow it belongs on. Liquid to gas has two arrows!</div>
      </div>
    </div>`;
    const note = root.querySelector('#s13-note');
    SM.sortGame(ctx, {
      root: root.querySelector('.s13-wrap'),
      correct: (it, sl) => S.find(s => s.id === sl.dataset.slot).acc.includes(it.dataset.k),
      onRight(it, sl) {
        root.querySelector('#flow-' + sl.dataset.slot).classList.add('live');
        SM.note(note, 'good', INFO[it.dataset.k]);
      },
      onWrong(it, sl) {
        ctx.act('connect').miss();
        const route = S.find(s => s.id === sl.dataset.slot).route.toLowerCase();
        SM.note(note, 'hint', `This arrow goes from ${route.replace(' to ', ' to ')}. Does ${it.textContent.toLowerCase()} do that?`);
      },
      onDone() {
        ctx.act('connect').done(root.querySelector('.s13-map'));
        root.querySelector('.s13-map').classList.add('complete');
        SM.note(note, 'good', '<b>Map complete!</b> Heating moves matter towards gas. Cooling moves it back towards solid.');
        ctx.say('This map works for lots of materials, not just water!');
      }
    });
  };

  /* ================= 14. EQUIPMENT ================= */
  R.tools = function (root, ctx) {
    const T = [
      { k: 'thermometer', n: 'Thermometer', u: 'degrees Celsius (°C)', d: 'Measures <b class="v">temperature</b>: how hot or cold something is.', ex: 'Use it to find out how hot a cup of tea is.' },
      { k: 'stopwatch', n: 'Stopwatch', u: 'seconds and minutes', d: 'Measures <b class="v">time</b>: how long something takes.', ex: 'Use it to time how long an ice cube takes to melt.' },
      { k: 'beaker', n: 'Beaker', u: 'millilitres (ml)', d: 'Holds liquids and shows roughly <b class="v">how much</b> there is. A measuring jug can measure volume too.', ex: 'Use it to pour out water for an experiment.' }
    ];
    const J = [
      { t: 'thermometer', q: 'How hot is this soup?' },
      { t: 'stopwatch', q: 'How long does the ice take to melt?' },
      { t: 'beaker', q: 'How much water is in here?' }
    ];
    root.innerHTML = `<div class="slide-inner s14-grid">
      <div class="s14-board">
        ${head('Mission 14 · Equipment station', 'Become a Science Investigator', 'Scientists <b class="v">measure</b> carefully. Tap each tool to switch it on.')}
        <div class="s14-pegs">
          ${T.map(t => `<button class="s14-tool s14-${t.k}" data-k="${t.k}"><span class="s14-hook"></span>${art(t.k, { alt: t.n })}<b>${t.n}</b><i class="s8-tick">${SM.icons.check}</i></button>`).join('')}
        </div>
        <div class="s14-info" id="s14-info"><p>Which tool will you pick up first?</p></div>
      </div>
      <aside class="s14-bench">
        <h2>Which tool for the job?</h2>
        <div class="s14-tray">${SM.shuffle(T).map(t => `<button class="s14-chip" data-drag data-k="${t.k}">${art(t.k, { alt: '' })}<span>${t.n}</span></button>`).join('')}</div>
        <div class="s14-jobs">
          ${J.map((j, i) => `<div class="s14-job" data-slot="${j.t}" tabindex="0" role="button" aria-label="${j.q}"><p>${j.q}</p><span class="slot-fill"></span></div>`).join('')}
        </div>
        <div class="note note-info" id="s14-note">Drag a tool onto each job.</div>
        <div class="s14-jug">${art('measuring_jug', { alt: '' })}<p>A <b class="v">measuring jug</b> also measures volume in ml.</p></div>
      </aside>
    </div>`;
    const info = root.querySelector('#s14-info');
    const seen = new Set();
    root.querySelectorAll('.s14-tool').forEach(b => ctx.on(b, 'click', () => {
      const t = T.find(x => x.k === b.dataset.k);
      root.querySelectorAll('.s14-tool').forEach(o => o.classList.toggle('active', o === b));
      info.innerHTML = `<h3>${t.n}</h3><p>${t.d}</p><p class="s14-unit"><b>Unit:</b> ${t.u}. ${t.ex}</p>`;
      SM.good(info, { quiet: true });
      SM.sound('click');
      b.classList.add('seen');
      seen.add(t.k);
      if (seen.size === 3) ctx.act('explore').done(b);
    }));
    const note = root.querySelector('#s14-note');
    SM.sortGame(ctx, {
      root: root.querySelector('.s14-bench'),
      correct: (it, sl) => it.dataset.k === sl.dataset.slot,
      onRight(it) { SM.note(note, 'good', `Yes! A ${it.textContent.trim().toLowerCase()} is right for that job.`); },
      onWrong(it, sl) {
        ctx.act('match').miss();
        SM.note(note, 'hint', `A ${it.textContent.trim().toLowerCase()} can't answer that. Are you measuring heat, time or amount?`);
      },
      onDone() {
        ctx.act('match').done(root.querySelector('.s14-jobs'));
        SM.note(note, 'good', 'Perfect match! The right tool gives you evidence you can trust.');
      }
    });
  };

  /* ================= 15. TEMPERATURE DETECTIVE ================= */
  R.temps = function (root, ctx) {
    const TH = [
      { k: 'fridge', n: 'Inside a fridge', v: 5 },
      { k: 'class', n: 'A classroom', v: 20 },
      { k: 'tea', n: 'A cup of hot tea', v: 65 }
    ];
    const Q = [
      { q: 'Which of the three is the <b>coldest</b>?', a: ['Classroom', 'Hot tea', 'Fridge'], ok: 2, h: 'The coldest thermometer has the shortest red column.' },
      { q: 'How many degrees warmer is the classroom than the fridge?', a: ['10 °C', '15 °C', '25 °C'], ok: 1, h: 'Count up from 5 °C to 20 °C.' },
      { q: 'Which temperature is colder?', a: ['-5 °C', '5 °C'], ok: 0, h: 'Numbers below zero are colder than zero. Look at the scale.' }
    ];
    root.innerHTML = `<div class="slide-inner s15-grid">
      <div class="s15-lab">
        <div class="s15-title">${head('Mission 15 · Thermometer lab', 'Temperature Detective', 'Read the top of the red column. Each small line is <b class="v">5 °C</b>.')}</div>
        <div class="s15-thermos">
          ${TH.map(t => `<div class="s15-t" data-k="${t.k}">
            ${SM.thermoSvg(t.v, { start: -20, label: 'Thermometer for ' + t.n })}
            <div class="s15-ctl">
              <b>${t.n}</b>
              <label class="s15-input"><input type="text" inputmode="numeric" maxlength="4" aria-label="Temperature of ${t.n} in degrees Celsius" placeholder="?"><span>°C</span></label>
              <button class="btn btn-small btn-check">Check</button>
              <small class="s15-fb"></small>
            </div>
          </div>`).join('')}
        </div>
      </div>
      <aside class="s15-side">
        <h2>Temperature challenge</h2>
        <div id="s15-q"></div>
        <div class="note note-info" id="s15-note">Read all three thermometers, and solve the challenges here.</div>
        <p class="s15-facts"><b>Remember:</b> water freezes at <b class="v">0 °C</b> and boils at <b class="v">100 °C</b>.</p>
      </aside>
    </div>`;
    ctx.after(350, () => root.querySelectorAll('.thermo').forEach((t) => SM.setThermo(t, +t.dataset.value)));

    const solved = new Set();
    root.querySelectorAll('.s15-t').forEach(box => {
      const t = TH.find(x => x.k === box.dataset.k);
      const input = box.querySelector('input');
      const btn = box.querySelector('.btn-check');
      const fb = box.querySelector('.s15-fb');
      const check = () => {
        if (solved.has(t.k)) return;
        const val = parseInt(input.value.replace('−', '-'), 10);
        if (isNaN(val)) {
          fb.textContent = 'Type a number first.';
          SM.bad(input.parentNode);
          return;
        }
        if (val === t.v) {
          solved.add(t.k);
          input.disabled = true;
          btn.hidden = true;
          fb.innerHTML = '<span class="good-text">Correct!</span>';
          box.classList.add('solved');
          SM.good(box);
          if (solved.size === 3) ctx.act('read').done(root.querySelector('.s15-thermos'));
        } else {
          ctx.act('read').miss();
          SM.bad(input.parentNode);
          fb.textContent = val > t.v ? 'A bit lower. Find the numbered line just below the red.' : 'A bit higher. Find the numbered line just below the red.';
        }
      };
      ctx.on(btn, 'click', check);
      ctx.on(input, 'keydown', e => { if (e.key === 'Enter') check(); });
      ctx.on(input, 'input', () => { fb.textContent = ''; });
    });

    let qi = 0;
    const holder = root.querySelector('#s15-q');
    const note = root.querySelector('#s15-note');
    const ask = () => {
      const q = Q[qi];
      holder.innerHTML = `<span class="s5-qn">Question ${qi + 1} of ${Q.length}</span><p class="s15-qtext">${q.q}</p><div class="choice-col">${q.a.map((a, i) => `<button class="btn btn-choice btn-choice-s" data-i="${i}">${a}</button>`).join('')}</div>`;
      holder.querySelectorAll('button').forEach(b => ctx.on(b, 'click', () => {
        if (+b.dataset.i === q.ok) {
          SM.good(b);
          qi++;
          if (qi < Q.length) {
            SM.note(note, 'good', 'Correct!');
            ctx.after(600, ask);
          } else {
            holder.innerHTML = '<p class="s15-qtext good-text">All challenges solved!</p>';
            SM.note(note, 'good', 'You are a real temperature detective.');
            ctx.act('compare').done(holder);
          }
        } else {
          ctx.act('compare').miss();
          SM.bad(b);
          SM.note(note, 'hint', q.h);
        }
      }));
    };
    ask();
  };

  /* ================= 16. FINAL MISSION ================= */
  R.final = function (root, ctx) {
    const G = SM.game;
    const st = G.state;
    const missing = [];
    SM.slides.forEach((s, i) => {
      if (i < 15 && s.activities.length && !G.slideComplete(i)) missing.push(i);
    });
    root.innerHTML = `<div class="slide-inner s16-wrap">
      <div class="s16-rays" aria-hidden="true"></div>
      <div class="s16-left">
        <div class="bubble bubble-bottom">You've reached the <b>final examination</b>, Young Scientist! Show me everything you've discovered.</div>
        ${art('scientist_mascot', { cls: 'mascot-big' })}
      </div>
      <div class="s16-right">
        <span class="kicker">Mission 16</span>
        <h1>Final Science Mission</h1>
        <div class="s16-stats">
          <div class="s16-stat"><b>${G.missionsDone() - (G.slideComplete(16) ? 1 : 0) - (G.slideComplete(17) ? 1 : 0)}<small>/15</small></b><span>Missions complete</span></div>
          <div class="s16-stat s16-stars"><span class="s16-staricon">${SM.starSvg()}</span><b>${st.stars}</b><span>Stars earned</span></div>
          <div class="s16-stat"><b>${G.level().n}</b><span>${G.level().name}</span></div>
        </div>
        <div class="s16-badges">
          ${SM.ZONES.map((z, i) => `<div class="s16-badge ${st.badges.includes(i) ? 'won' : ''}" title="${z.badge}">${SM.badgeArt(z.sym, st.badges.includes(i) ? z.col : '#475569')}<small>${z.badge}</small></div>`).join('')}
        </div>
        ${missing.length ? `<div class="s16-miss"><b>Want more stars first?</b> ${missing.slice(0, 6).map(i => `<button class="linkish" data-go="${i}">${SM.slides[i].short}</button>`).join('')}${missing.length > 6 ? ` <span>+${missing.length - 6} more</span>` : ''}</div>` : '<p class="s16-ready">Every mission complete. You are ready!</p>'}
        <button class="btn btn-huge btn-glow" id="s16-start">START FINAL QUIZ</button>
        <small class="s16-note">15 questions. Take your time, and read each one carefully.</small>
      </div>
    </div>`;
    root.querySelectorAll('[data-go]').forEach(b => ctx.on(b, 'click', () => ctx.go(+b.dataset.go)));
    ctx.on(root.querySelector('#s16-start'), 'click', () => ctx.go(16));
  };
})();
