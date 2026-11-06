/* Slide 17: the 15-question Young Scientist Quiz. */
(function () {
  const art = SM.art;

  const particleDiagram = kind => {
    const pts = {
      solid: [0, 1, 2, 3].flatMap(r => [0, 1, 2, 3].map(c => [22 + c * 19, 22 + r * 19])),
      liquid: [[20, 80], [39, 82], [58, 80], [78, 82], [28, 62], [48, 63], [68, 62], [38, 44], [60, 44]],
      gas: [[22, 24], [74, 18], [48, 50], [18, 78], [80, 72]]
    }[kind];
    const col = { solid: 'blue', liquid: 'teal', gas: 'lav' }[kind];
    return `<svg viewBox="0 0 100 100" class="q-part"><rect x="4" y="4" width="92" height="92" rx="10" fill="#F8FAFC" fill-opacity=".14" stroke="#F8FAFC" stroke-width="3"/>${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="url(#g-ball-${col})"/>`).join('')}</svg>`;
  };

  /* Exactly 15 questions: 6 multiple choice, 3 picture identification,
     3 true/false and 3 drag and drop. */
  const Q = [
    { type: 'mcq', text: 'Which one of these is <b>not</b> matter?', opts: ['Air', 'Water', 'Light', 'Sand'], ok: 2,
      why: 'Light is a kind of energy. It takes up no space and has no mass. Air, water and sand are all matter.' },
    { type: 'mcq', tag: 'Picture question', art: 'ice_cube', text: 'What state of matter is this ice cube?', opts: ['Solid', 'Liquid', 'Gas'], ok: 0,
      why: 'Ice is a solid because it keeps its own shape.' },
    { type: 'tf', text: 'A gas spreads out to fill all the space it can reach.', ok: true,
      why: 'True. Gas particles fly about freely and spread out to fill the whole space.' },
    { type: 'mcq', art: 'water_pouring', text: 'Water is poured from a tall bottle into a wide bowl. What happens?', opts: ['Its shape and volume both change', 'Its shape changes but its volume stays the same', 'Its volume changes but its shape stays the same', 'Nothing changes'], ok: 1,
      why: 'A liquid takes the shape of its container, but the amount of liquid (its volume) stays the same.' },
    { type: 'dnd', text: 'Drag each name onto the matching particle picture.',
      targets: [{ id: 'liquid', html: particleDiagram('liquid') }, { id: 'gas', html: particleDiagram('gas') }, { id: 'solid', html: particleDiagram('solid') }],
      chips: [{ id: 'solid', t: 'Solid' }, { id: 'liquid', t: 'Liquid' }, { id: 'gas', t: 'Gas' }],
      why: 'Solid: tidy rows that only jiggle. Liquid: close together and sliding around. Gas: far apart and moving freely.' },
    { type: 'mcq', art: 'sand', text: 'Sand can be poured. Why is it still a solid?', opts: ['Because it is yellow', 'Because each grain keeps its own shape', 'Because it is heavy', 'Because it comes from the beach'], ok: 1,
      why: 'Each grain is hard and keeps its shape. Sand pours because lots of tiny grains slide past each other.' },
    { type: 'tf', text: 'We can see water vapour as a white cloud above a kettle.', ok: false,
      why: 'False. Water vapour is invisible. The white cloud is steam, which is made of tiny liquid water droplets.' },
    { type: 'mcq', tag: 'Picture question', art: 'honey', text: 'Honey is very thick. What state of matter is it?', opts: ['Gas', 'Solid', 'Liquid'], ok: 2,
      why: 'Honey is a thick liquid. It flows slowly and takes the shape of its container.' },
    { type: 'tf', art: 'condensation', text: 'The droplets on a cold glass have leaked through the glass.', ok: false,
      why: 'False. They come from water vapour in the air, which cools on the cold glass and condenses into droplets.' },
    { type: 'dnd', text: 'Drag each process onto the change it describes.',
      targets: [{ id: 'cond', html: '<span class="q-change">Water vapour <em>to</em> water</span>' }, { id: 'melt', html: '<span class="q-change">Ice <em>to</em> water</span>' }, { id: 'freeze', html: '<span class="q-change">Water <em>to</em> ice</span>' }],
      chips: [{ id: 'freeze', t: 'Freezing' }, { id: 'melt', t: 'Melting' }, { id: 'cond', t: 'Condensation' }],
      why: 'Melting: solid to liquid. Freezing: liquid to solid. Condensation: gas to liquid.' },
    { type: 'mcq', text: 'Which change happens only at the <b>surface</b> of a liquid?', opts: ['Evaporation', 'Boiling', 'Freezing', 'Melting'], ok: 0,
      why: 'Evaporation happens at the surface. Boiling happens all through the liquid.' },
    { type: 'mcq', text: 'At what temperature does water freeze?', opts: ['100 °C', '50 °C', '10 °C', '0 °C'], ok: 3,
      why: 'Water freezes at 0 °C and boils at 100 °C.' },
    { type: 'mcq', tag: 'Picture question', thermo: 25, text: 'What temperature does this thermometer show?', opts: ['15 °C', '25 °C', '30 °C', '52 °C'], ok: 1,
      why: 'The red column stops halfway between 20 and 30. Each small line is 5 °C, so it shows 25 °C.' },
    { type: 'mcq', art: 'stopwatch', text: 'Which tool would you use to find out how long ice takes to melt?', opts: ['Thermometer', 'Beaker', 'Stopwatch', 'Measuring jug'], ok: 2,
      why: 'A stopwatch measures time.' },
    { type: 'dnd', text: 'Drag each state of matter onto its example.',
      targets: [{ id: 'gas', html: () => art('air_balloon', { alt: 'Air in a balloon' }) + '<small>Air in a balloon</small>' }, { id: 'solid', html: () => art('wooden_blocks', { alt: 'Wooden blocks' }) + '<small>Wooden blocks</small>' }, { id: 'liquid', html: () => art('juice', { alt: 'Orange juice' }) + '<small>Orange juice</small>' }],
      chips: [{ id: 'liquid', t: 'Liquid' }, { id: 'gas', t: 'Gas' }, { id: 'solid', t: 'Solid' }],
      why: 'Blocks are solid, juice is liquid and the air in a balloon is a gas.' }
  ];
  SM.QUIZ_LENGTH = Q.length;

  const fresh = () => ({ i: 0, answers: [], finished: false });

  function isRight(q, ans) {
    if (q.type === 'dnd') return ans && q.targets.every(t => ans[t.id] === t.id);
    return ans === q.ok;
  }

  SM.quizScore = function () {
    const st = SM.game.state.quiz;
    if (!st) return null;
    const correct = Q.reduce((n, q, i) => n + (st.answers[i] !== undefined && isRight(q, st.answers[i]) ? 1 : 0), 0);
    return { correct, wrong: Q.length - correct, pct: Math.round(correct / Q.length * 100), total: Q.length };
  };
  SM.quizIsRight = isRight;

  function answerText(q, ans) {
    if (q.type === 'tf') return ans ? 'True' : 'False';
    if (q.type === 'mcq') return q.opts[ans];
    return '';
  }

  SM.renderers.quiz = function (root, ctx) {
    const G = SM.game;
    if (!G.state.quiz) {
      G.state.quiz = fresh();
      G.save();
    }
    const st = G.state.quiz;
    root.innerHTML = '<div class="slide-inner q-wrap"><div class="q-paper" id="q-paper"></div></div>';
    const paper = root.querySelector('#q-paper');

    function progressBar(i, answered) {
      return `<div class="q-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${Q.length}" aria-valuenow="${i + (answered ? 1 : 0)}">
        ${Q.map((_, n) => {
          let c = '';
          if (n < i || (n === i && answered)) c = st.answers[n] !== undefined && isRight(Q[n], st.answers[n]) ? 'ok' : 'no';
          else if (n === i) c = 'now';
          return `<i class="${c}"></i>`;
        }).join('')}
      </div>`;
    }

    function renderBody(q, i, locked) {
      const ans = st.answers[i];
      let media = '';
      if (q.art) media = `<div class="q-media">${art(q.art)}</div>`;
      if (q.thermo !== undefined) media = `<div class="q-media q-media-th">${SM.thermoSvg(q.thermo, { label: 'A thermometer' })}</div>`;
      let body = '';
      if (q.type === 'mcq') {
        body = `<div class="q-opts q-opts-${q.opts.length}">${q.opts.map((o, n) => `<button class="q-opt" data-v="${n}"><i>${'ABCD'[n]}</i><span>${o}</span></button>`).join('')}</div>`;
      } else if (q.type === 'tf') {
        body = `<div class="q-opts q-tf"><button class="q-opt" data-v="true"><i>T</i><span>True</span></button><button class="q-opt" data-v="false"><i>F</i><span>False</span></button></div>`;
      } else {
        body = `<div class="q-dnd"><div class="q-targets">${q.targets.map(t => `<div class="q-target"><div class="q-tvis">${typeof t.html === 'function' ? t.html() : t.html}</div><div class="q-drop" data-slot="${t.id}" tabindex="0" role="button" aria-label="Answer box"><span class="slot-fill"></span></div></div>`).join('')}</div>
          <div class="q-chips" data-slot="tray" tabindex="0" role="button" aria-label="Unused answers"><span class="slot-fill">${q.chips.map(c => `<button class="tag tag-proc" data-drag data-id="${c.id}">${c.t}</button>`).join('')}</span></div></div>`;
      }
      return `<div class="q-body ${media ? 'has-media' : ''}">${media}<div class="q-main">${body}</div></div>`;
    }

    function showQuestion() {
      const i = st.i;
      const q = Q[i];
      const answered = st.answers[i] !== undefined;
      const kindLabel = q.tag || { mcq: 'Multiple choice', tf: 'True or false', dnd: 'Drag and drop' }[q.type];
      paper.innerHTML = `
        <div class="q-top"><span class="q-num">Question <b>${i + 1}</b> of ${Q.length}</span><span class="q-kind">${kindLabel}</span></div>
        ${progressBar(i, answered)}
        <h2 class="q-text">${q.text}</h2>
        ${renderBody(q, i)}
        <div class="q-foot">
          <div class="q-feedback" id="q-fb" aria-live="polite"></div>
          <button class="btn btn-glow q-submit" id="q-submit" disabled>Submit answer</button>
        </div>`;
      const submit = paper.querySelector('#q-submit');
      let choice;

      if (q.type === 'dnd') {
        const mapping = {};
        const main = paper.querySelector('.q-main');
        SM.dragKit(ctx, {
          root: main,
          onDrop(chip, slot) {
            if (paper.dataset.locked === '1') return;
            const id = slot.dataset.slot;
            const fill = slot.querySelector('.slot-fill');
            Object.keys(mapping).forEach(k => { if (mapping[k] === chip) delete mapping[k]; });
            if (id !== 'tray') {
              const existing = fill.querySelector('[data-drag]');
              if (existing && existing !== chip) {
                main.querySelector('.q-chips .slot-fill').appendChild(existing);
                delete mapping[id];
              }
              mapping[id] = chip;
            }
            fill.appendChild(chip);
            SM.sound('pop');
            /* Compare by chip id once a chip is placed. */
            const out = {};
            Object.keys(mapping).forEach(k => { out[k] = mapping[k].dataset.id; });
            submit.disabled = !q.targets.every(t => out[t.id] !== undefined);
            choice = out;
          }
        });
      } else {
        paper.querySelectorAll('.q-opt').forEach(b => ctx.on(b, 'click', () => {
          if (paper.dataset.locked === '1') return;
          paper.querySelectorAll('.q-opt').forEach(o => o.classList.toggle('picked', o === b));
          SM.sound('click');
          choice = q.type === 'tf' ? b.dataset.v === 'true' : +b.dataset.v;
          submit.disabled = false;
        }));
      }

      paper.dataset.locked = '0';
      ctx.on(submit, 'click', () => {
        if (paper.dataset.locked === '1') {
          next();
          return;
        }
        if (choice === undefined) return;
        st.answers[i] = choice;
        G.save();
        reveal(q, i, choice, true);
      });

      if (answered) {
        /* Returning to a question already answered: show the saved result. */
        if (q.type === 'dnd') restoreDnd(q, i);
        reveal(q, i, st.answers[i], false);
      }
    }

    function restoreDnd(q, i) {
      const ans = st.answers[i];
      Object.keys(ans).forEach(slotId => {
        const chip = paper.querySelector(`.q-chips [data-id="${ans[slotId]}"]`);
        const slot = paper.querySelector(`.q-drop[data-slot="${slotId}"] .slot-fill`);
        if (chip && slot) slot.appendChild(chip);
      });
    }

    function reveal(q, i, ans, first) {
      paper.dataset.locked = '1';
      const right = isRight(q, ans);
      const fb = paper.querySelector('#q-fb');
      const submit = paper.querySelector('#q-submit');
      if (q.type === 'dnd') {
        paper.querySelectorAll('[data-drag]').forEach(c => c.classList.add('locked'));
        paper.querySelectorAll('.q-drop').forEach(d => {
          const c = d.querySelector('[data-drag]');
          const ok = c && c.dataset.id === d.dataset.slot;
          d.classList.add(ok ? 'mark-ok' : 'mark-no');
          if (!ok) {
            const correct = q.chips.find(x => x.id === d.dataset.slot).t;
            d.insertAdjacentHTML('beforeend', `<small class="q-fix">Answer: ${correct}</small>`);
          }
        });
      } else {
        paper.querySelectorAll('.q-opt').forEach(o => {
          const v = q.type === 'tf' ? o.dataset.v === 'true' : +o.dataset.v;
          o.disabled = true;
          if (v === q.ok) o.classList.add('mark-ok');
          else if (v === ans) o.classList.add('mark-no');
        });
      }
      fb.className = 'q-feedback ' + (right ? 'fb-ok' : 'fb-no') + ' note-in';
      fb.innerHTML = `<b>${right ? 'Correct!' : 'Not quite.'}</b> ${q.why}`;
      submit.disabled = false;
      submit.textContent = i === Q.length - 1 ? 'See my results' : 'Next question';
      if (first) {
        if (right) {
          SM.good(fb);
          const key = 'quizq' + i;
          G.state.quizStarPaid = G.state.quizStarPaid || {};
          if (!G.state.quizStarPaid[key]) {
            G.state.quizStarPaid[key] = true;
            G.addStars(1, fb, 'First-try bonus star!');
          }
        } else {
          SM.bad(fb);
        }
      }
      paper.querySelector('.q-progress').outerHTML = progressBar(i, true);
    }

    function next() {
      if (st.i < Q.length - 1) {
        st.i++;
        G.save();
        showQuestion();
      } else {
        st.finished = true;
        const s = SM.quizScore();
        const best = G.state.bestQuiz;
        if (!best || s.correct >= best.correct) G.state.bestQuiz = { correct: s.correct, total: s.total, pct: s.pct, date: new Date().toISOString() };
        G.save();
        G.finishActivity(16, 'quiz', 0, paper);
        SM.sound('fanfare');
        results();
      }
    }

    function results() {
      const s = SM.quizScore();
      const fb = s.pct >= 90 ? ['Outstanding!', 'You are a true Master of Matter. Dr Fizz is amazed!']
        : s.pct >= 70 ? ['Great work!', 'You really understand how matter behaves. Check the answers you missed.']
        : s.pct >= 50 ? ['Good effort!', 'You know lots already. Review your answers, then try again.']
        : ['Keep exploring!', 'Every scientist learns by trying. Revisit the missions, then have another go.'];
      paper.innerHTML = `<div class="q-results">
        <div class="q-res-art">${art('trophy', { alt: '' })}</div>
        <div class="q-res-main">
          <span class="kicker">Your results</span>
          <h2>${fb[0]}</h2><p>${fb[1]}</p>
          <div class="q-res-nums">
            <div class="ok"><b>${s.correct}</b><span>Correct</span></div>
            <div class="no"><b>${s.wrong}</b><span>Incorrect</span></div>
            <div class="pc"><b>${s.pct}%</b><span>Score</span></div>
          </div>
          <div class="q-res-btns">
            <button class="btn btn-glow" id="q-cert">Get my certificate</button>
            <button class="btn btn-ghost" id="q-review">Review answers</button>
            <button class="btn btn-ghost" id="q-again">${SM.icons.reset} Try again</button>
          </div>
        </div>
      </div>`;
      SM.fx.confetti(s.pct >= 70 ? 90 : 30, paper.querySelector('.q-res-art'));
      ctx.on(paper.querySelector('#q-cert'), 'click', () => ctx.go(17));
      ctx.on(paper.querySelector('#q-review'), 'click', review);
      ctx.on(paper.querySelector('#q-again'), 'click', () => {
        G.state.quiz = fresh();
        G.save();
        SM.ui.show(16, true);
      });
    }

    function review() {
      paper.innerHTML = `<div class="q-review">
        <div class="q-rev-head"><h2>Review your answers</h2><button class="btn btn-small btn-ghost" id="q-back">Back to results</button></div>
        <ol class="q-rev-list">${Q.map((q, i) => {
          const a = st.answers[i];
          const ok = isRight(q, a);
          let yours = '';
          if (q.type !== 'dnd') {
            yours = `<small>Your answer: ${answerText(q, a)}${ok ? '' : ` · Correct answer: ${answerText(q, q.ok)}`}</small>`;
          }
          return `<li class="${ok ? 'ok' : 'no'}"><i>${ok ? SM.icons.check : '×'}</i><div><p>${q.text}</p>${yours}<small class="q-rev-why">${q.why}</small></div></li>`;
        }).join('')}</ol>
      </div>`;
      ctx.on(paper.querySelector('#q-back'), 'click', results);
    }

    if (st.finished) results();
    else showQuestion();
  };
})();
