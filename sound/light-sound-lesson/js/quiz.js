/* ==========================================================
   quiz.js — final assessment (slide 20) and certificate (slide 21)
   ========================================================== */
window.LS = window.LS || {};

(() => {
const I = (n) => `assets/images/${n}.svg`;
const ic = LS.icons;

/* type: mc | tf | pic | match | predict */
const QUESTIONS = [
  { type: 'mc', obj: 'Seeing', q: 'How do we see a book on a table?', opts: ['Light reflects off the book into our eyes', 'Our eyes send out rays that touch the book', 'We see it just because it is there'], a: 0,
    why: 'We see objects when light from them enters our eyes. Light reflects off the book and travels into our eyes.' },
  { type: 'pic', obj: 'Light sources', q: 'Which of these is a light source?', opts: [['moon', 'Moon'], ['torch', 'Torch (on)'], ['mirror', 'Mirror'], ['spoon', 'Spoon']], a: 1,
    why: 'A switched-on torch makes its own light. The Moon, mirrors and spoons only reflect light.' },
  { type: 'tf', obj: 'Reflection', q: 'True or false: a mirror makes light disappear.', a: 1,
    why: 'False! A mirror reflects light — the light bounces off in a new direction.' },
  { type: 'mc', obj: 'Absorption', q: 'Which surface absorbs the most light?', opts: ['A mirror', 'White paper', 'Black cloth'], a: 2,
    why: 'Dark surfaces like black cloth absorb most of the light. Mirrors and white paper reflect much more.' },
  { type: 'match', obj: 'Key words', q: 'Match each word to its meaning.', pairs: [['Reflection', 'Light bounces off a surface'], ['Absorption', 'A material takes in light energy'], ['Vibration', 'A quick back-and-forth movement'], ['Medium', 'A material that sound travels through']],
    why: 'Reflection = bounces off. Absorption = taken in. Vibration = back-and-forth movement. Medium = material sound travels through.' },
  { type: 'mc', obj: 'Vibrations', q: 'How are all sounds made?', opts: ['By light shining on objects', 'By something vibrating', 'By air standing still'], a: 1,
    why: 'Every sound is made by something vibrating.' },
  { type: 'pic', obj: 'Vibrations', q: 'Which of these makes a sound by vibrating when you pluck it?', opts: [['guitar', 'Guitar'], ['torch', 'Torch'], ['sun', 'Sun'], ['book', 'Book']], a: 0,
    why: 'When you pluck a guitar string, it vibrates — and that makes the sound.' },
  { type: 'mc', obj: 'Sound travel', q: 'How does sound travel from a drum to your ear?', opts: ['Air particles fly all the way from the drum to your ear', 'Vibrations are passed from particle to particle through the air', 'The sound travels as light'], a: 1,
    why: 'The particles only vibrate around their places, passing the vibration along to the next particle until it reaches your ear.' },
  { type: 'tf', obj: 'Sound travel', q: 'True or false: sound can travel through solids like wood and metal.', a: 0,
    why: 'True! Sound travels through solids, liquids and gases.' },
  { type: 'tf', obj: 'Vacuum', q: 'True or false: sound can travel through a vacuum (completely empty space).', a: 1,
    why: 'False! A vacuum has no particles to pass the vibrations along, so sound cannot travel through it.' },
  { type: 'mc', obj: 'Pitch', q: 'What does "pitch" mean?', opts: ['How loud a sound is', 'How high or low a sound is', 'How far a sound travels'], a: 1,
    why: 'Pitch tells us how high or low a sound is.' },
  { type: 'mc', obj: 'Frequency', q: 'Faster vibrations make a…', opts: ['higher pitch', 'lower pitch', 'quieter sound'], a: 0,
    why: 'Faster vibrations = higher frequency = higher pitch.' },
  { type: 'predict', obj: 'Length', q: 'Predict: a ruler has a SHORT part and then a LONG part hanging over the desk. Which makes the higher pitch?', opts: [['ruler', 'Short overhang'], ['ruler', 'Long overhang']], a: 0,
    why: 'A shorter vibrating part vibrates faster, so it makes a higher pitch.' },
  { type: 'predict', obj: 'Tightness', q: 'Predict: you tighten the SAME rubber band. What happens to the pitch?', opts: [['rubber_band_guitar', 'It gets higher'], ['rubber_band_guitar', 'It gets lower']], a: 0,
    why: 'A tighter band vibrates faster, so the pitch is usually higher.' },
  { type: 'predict', obj: 'Water bottles', q: 'Predict: you TAP the sides of identical bottles. Which gives the lowest pitch?', opts: [['bottle', 'The bottle with the most water'], ['bottle', 'The bottle with the least water']], a: 0,
    why: 'When tapping, more water makes the bottle vibrate more slowly, giving a lower pitch.' }
];
const TYPE_NAMES = { mc: 'Multiple choice', tf: 'True or false', pic: 'Identify the picture', match: 'Match the terms', predict: 'Prediction' };

LS.quiz = {
  questions: QUESTIONS,
  mount(host, scoreEl) {
    let i = 0, score = 0, answered = false;
    const total = QUESTIONS.length;
    const setScore = () => { scoreEl.textContent = `Score: ${score} / ${total}`; };
    const last = LS.store.get('quizLast', null);

    function shell() {
      host.innerHTML = `<div class="quiz-card card">
        <div class="qz-top"><span class="chip qz-type"></span><div class="qz-dots">${QUESTIONS.map(() => '<i></i>').join('')}</div><b class="qz-n"></b></div>
        <h3 class="qz-q"></h3><div class="qz-body"></div><div class="feedback qz-fb"></div>
        <div class="qz-foot"><span class="small muted qz-obj"></span><button class="btn qz-next" disabled>Next question ${ic.next}</button></div></div>`;
      LS.$('.qz-next', host).onclick = () => { LS.audio.ui.click(); if (i < total - 1) { i++; draw(); } else finish(); };
    }
    function result(ok, why) {
      answered = true;
      if (ok) { score++; LS.award(`quiz-q${i}`); LS.audio.ui.correct(); } else LS.audio.ui.wrong();
      setScore();
      const dot = LS.$$('.qz-dots i', host)[i]; dot.classList.add(ok ? 'ok' : 'no');
      LS.act.feedback(LS.$('.qz-fb', host), ok ? 'good' : 'bad', `<b>${ok ? 'Correct!' : 'Not quite.'}</b> ${why}`);
      const nx = LS.$('.qz-next', host); nx.disabled = false; nx.innerHTML = i < total - 1 ? `Next question ${ic.next}` : `See my score ${ic.trophy}`;
      nx.focus({ preventScroll: true });
    }
    function draw() {
      answered = false;
      const q = QUESTIONS[i];
      LS.$('.qz-type', host).textContent = TYPE_NAMES[q.type];
      LS.$('.qz-n', host).textContent = `Question ${i + 1} of ${total}`;
      LS.$('.qz-obj', host).textContent = `Testing: ${q.obj}`;
      LS.$$('.qz-dots i', host).forEach((d, k) => d.classList.toggle('cur', k === i));
      LS.$('.qz-q', host).textContent = q.q;
      const fb = LS.$('.qz-fb', host); fb.className = 'feedback qz-fb';
      const nx = LS.$('.qz-next', host); nx.disabled = true; nx.innerHTML = `Next question ${ic.next}`;
      const body = LS.$('.qz-body', host);
      body.className = `qz-body qz-${q.type}`;
      body.style.animation = 'none'; void body.offsetWidth; body.style.animation = 'popIn .35s ease';
      if (q.type === 'match') return drawMatch(body, q);
      let opts;
      if (q.type === 'tf') opts = ['True', 'False'].map(t => `<span>${t}</span>`);
      else if (q.type === 'pic' || q.type === 'predict') opts = q.opts.map(o => `<img src="${I(o[0])}" alt=""><span>${o[1]}</span>`);
      else opts = q.opts.map((o, k) => `<span class="key">${'ABC'[k]}</span><span>${o}</span>`);
      body.innerHTML = `<div class="opts">${opts.map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`).join('')}</div>`;
      LS.$$('.opt', body).forEach(b => b.onclick = () => {
        if (answered) return;
        const k = +b.dataset.k, ok = k === q.a;
        LS.$$('.opt', body).forEach(x => x.classList.add('locked'));
        b.classList.add(ok ? 'correct' : 'wrong');
        if (!ok) LS.$(`.opt[data-k="${q.a}"]`, body).classList.add('correct');
        result(ok, q.why);
      });
    }
    function drawMatch(body, q) {
      const defs = LS.shuffle(q.pairs.map((p, k) => ({ t: p[1], k })));
      body.innerHTML = `<div class="match"><div class="m-col">${q.pairs.map((p, k) => `<button class="opt m-term" data-k="${k}">${p[0]}</button>`).join('')}</div>
        <div class="m-col">${defs.map(d => `<button class="opt m-def" data-k="${d.k}">${d.t}</button>`).join('')}</div></div><p class="small muted">Click a word, then click its meaning.</p>`;
      let sel = null, mistakes = 0, matched = 0;
      const colours = ['#FFD76A', '#53E6DF', '#FF8B80', '#B7A4FF'];
      LS.$$('.m-term', body).forEach(t => t.onclick = () => { if (t.classList.contains('locked')) return; sel = t; LS.$$('.m-term', body).forEach(x => x.classList.toggle('sel', x === t)); LS.audio.ui.click(); });
      LS.$$('.m-def', body).forEach(d => d.onclick = () => {
        if (!sel || d.classList.contains('locked')) return;
        if (sel.dataset.k === d.dataset.k) {
          const c = colours[matched];
          [sel, d].forEach(x => { x.classList.add('locked', 'paired'); x.classList.remove('sel'); x.style.borderColor = c; x.style.boxShadow = `inset 6px 0 0 ${c}`; });
          matched++; sel = null; LS.audio.ui.click();
          if (matched === q.pairs.length) result(mistakes <= 1, (mistakes <= 1 ? '' : `You made ${mistakes} mistakes along the way. `) + q.why);
        } else { mistakes++; d.classList.remove('wrong'); void d.offsetWidth; d.classList.add('wrong'); LS.audio.ui.wrong(); }
      });
    }
    function finish() {
      LS.store.set('quizLast', score);
      const best = Math.max(score, LS.store.get('quizBest', 0)); LS.store.set('quizBest', best);
      if (score >= 10) LS.badge('quiz-champ');
      showResults(score, best);
    }
    function showResults(sc, best) {
      const stars = sc >= 13 ? 3 : sc >= 9 ? 2 : 1;
      const msg = sc >= 13 ? 'Outstanding! You are a true Science Detective!' : sc >= 9 ? 'Great work, detective! You cracked most of the cases.' : 'Good effort! Look back at the labs and try again.';
      setScore();
      scoreEl.textContent = `Score: ${sc} / ${total}`;
      host.innerHTML = `<div class="quiz-card card qz-final">
        <img src="${I('trophy')}" class="qz-trophy bob" alt="Trophy">
        <div class="qz-stars">${[0, 1, 2].map(k => `<img src="assets/icons/star.svg" class="${k < stars ? 'on' : ''}" style="--d:${k}" alt="">`).join('')}</div>
        <h2>${sc} / ${total}</h2><p class="big-text">${msg}</p><p class="muted small">Best score: ${best} / ${total}</p>
        <div class="row" style="justify-content:center;margin-top:14px"><button class="btn btn-ghost" id="qz-retry">${ic.refresh} Retry quiz</button><button class="btn btn-yellow" id="qz-cert">Get my certificate ${ic.trophy}</button></div></div>`;
      LS.$('#qz-retry', host).onclick = () => { i = 0; score = 0; setScore(); shell(); draw(); };
      LS.$('#qz-cert', host).onclick = () => LS.go(LS.slides.length - 1);
      LS.audio.ui.badge();
    }
    if (last !== null) { showResults(last, LS.store.get('quizBest', last)); return; }
    setScore(); shell(); draw();
  }
};

/* ---------------- certificate ---------------- */
LS.cert = {
  mount(host) {
    const st = LS.store;
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const badges = LS.BADGES.filter(b => st.hasBadge(b.id));
    const quiz = st.get('quizBest', null);
    host.innerHTML = `<div class="cert-wrap">
      <div class="cert-controls no-print">
        <h2 class="cert-congrats">Congratulations, Science Detective! <span>You have completed the Light and Sound Mission!</span></h2>
        <div class="row" style="align-items:center;gap:10px">
          <input id="cert-name" placeholder="Type your name" maxlength="32" value="${(st.get('name', '') || '').replace(/"/g, '&quot;')}" aria-label="Your name">
          <button class="btn btn-sm" id="cert-print">${ic.print} Print</button>
          <button class="btn btn-sm btn-yellow" id="cert-dl">${ic.download} Download</button>
          <button class="btn btn-sm btn-ghost" id="cert-reset" title="Clear all progress for the next student">${ic.refresh} New student</button>
        </div>
      </div>
      <div class="certificate" id="certificate">
        <div class="cert-inner">
          <img src="${I('trophy')}" class="cert-trophy" alt="">
          <img src="${I('scientist')}" class="cert-pip" alt="">
          <p class="cert-kicker">Certificate of Achievement</p>
          <h1 class="cert-title">Science Detective</h1>
          <p class="cert-line">This certifies that</p>
          <div class="cert-name" id="cert-name-out">Your name here</div>
          <p class="cert-line">has successfully completed the <b>Light &amp; Sound Mission</b> — Year 4 Science</p>
          <div class="cert-stats">
            <div><img src="assets/icons/star.svg" alt=""><b>${st.stars}</b><span>stars earned</span></div>
            <div><span class="cert-medal">${ic.trophy}</span><b>${badges.length} / ${LS.BADGES.length}</b><span>badges</span></div>
            <div><span class="cert-medal">${ic.check}</span><b>${quiz === null ? '—' : quiz + ' / ' + LS.quiz.questions.length}</b><span>quiz score</span></div>
          </div>
          <div class="cert-badges">${badges.map(b => `<span class="medal" title="${b.name}"><span>${ic[b.icon]}</span></span>`).join('')}</div>
          <div class="cert-foot"><div><b>${date}</b><span>Date</span></div><div><b class="sig">Professor Pip</b><span>Head Scientist, Light &amp; Sound Labs</span></div></div>
        </div>
      </div>
    </div>`;
    const nameIn = LS.$('#cert-name', host), out = LS.$('#cert-name-out', host);
    const upd = () => { out.textContent = nameIn.value.trim() || 'Your name here'; out.classList.toggle('empty', !nameIn.value.trim()); st.set('name', nameIn.value.trim()); };
    nameIn.addEventListener('input', upd); nameIn.addEventListener('keydown', e => e.stopPropagation());
    upd();
    LS.badge('graduate');
    LS.$('#cert-print', host).onclick = () => window.print();
    LS.$('#cert-dl', host).onclick = () => LS.cert.download(nameIn.value.trim(), date, badges.length, quiz);
    const rs = LS.$('#cert-reset', host); let armed = false;
    rs.onclick = () => {
      if (!armed) { armed = true; rs.innerHTML = `${ic.alert} Click again to clear`; rs.classList.add('btn-coral'); LS.life.later(() => { armed = false; rs.innerHTML = `${ic.refresh} New student`; rs.classList.remove('btn-coral'); }, 3500); return; }
      st.reset(); LS.go(0);
    };
    // confetti
    const cols = ['#FFD76A', '#53E6DF', '#FF8B80', '#9274FF', '#45B8FF'];
    const conf = document.createElement('div'); conf.className = 'confetti no-print';
    for (let k = 0; k < 70; k++) { const s = document.createElement('i'); s.style.left = Math.random() * 100 + '%'; s.style.background = cols[k % 5]; s.style.animationDelay = Math.random() * 1.5 + 's'; s.style.animationDuration = 2.5 + Math.random() * 2 + 's'; conf.appendChild(s); }
    host.appendChild(conf);
    LS.life.later(() => conf.remove(), 5000);
    LS.audio.ui.badge();
  },

  /* draws the certificate on a canvas (shapes only, so it works offline from file://) */
  async download(name, date, nBadges, quiz) {
    try { await document.fonts.ready; } catch (e) { /* fonts optional */ }
    const W = 1600, H = 1100, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d');
    const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#FFF9E8'); g.addColorStop(1, '#EEF4FF');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const bg = c.createLinearGradient(0, 0, W, 0); ['#45B8FF', '#9274FF', '#FF8B80', '#FFD76A', '#53E6DF'].forEach((col, k) => bg.addColorStop(k / 4, col));
    c.strokeStyle = bg; c.lineWidth = 34; c.strokeRect(30, 30, W - 60, H - 60);
    c.strokeStyle = '#101A35'; c.lineWidth = 3; c.strokeRect(70, 70, W - 140, H - 140);
    const star = (x, y, r, fill) => { c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * .45 : r; c.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = '#E08A00'; c.lineWidth = 3; c.stroke(); };
    star(W / 2 - 110, 175, 40, '#FFD76A'); star(W / 2, 150, 58, '#FFD76A'); star(W / 2 + 110, 175, 40, '#FFD76A');
    c.textAlign = 'center'; c.fillStyle = '#5A3CD6';
    c.font = '600 34px Fredoka, sans-serif'; c.fillText('CERTIFICATE OF ACHIEVEMENT', W / 2, 290);
    c.fillStyle = '#101A35'; c.font = '700 96px Fredoka, sans-serif'; c.fillText('Science Detective', W / 2, 400);
    c.font = '700 34px Nunito, sans-serif'; c.fillStyle = '#3D4A6B'; c.fillText('This certifies that', W / 2, 480);
    c.font = '700 84px Fredoka, sans-serif'; c.fillStyle = '#2E8FE0'; c.fillText(name || '________________', W / 2, 590);
    c.strokeStyle = '#9274FF'; c.lineWidth = 4; c.beginPath(); c.moveTo(W / 2 - 400, 615); c.lineTo(W / 2 + 400, 615); c.stroke();
    c.font = '700 34px Nunito, sans-serif'; c.fillStyle = '#3D4A6B';
    c.fillText('has successfully completed the Light & Sound Mission — Year 4 Science', W / 2, 680);
    c.font = '800 36px Nunito, sans-serif'; c.fillStyle = '#101A35';
    c.fillText(`${LS.store.stars} stars   ·   ${nBadges} badges   ·   Quiz: ${quiz === null ? '—' : quiz + '/' + LS.quiz.questions.length}`, W / 2, 770);
    c.textAlign = 'left'; c.font = '700 36px Fredoka, sans-serif'; c.fillText(date, 180, 940);
    c.font = '700 24px Nunito, sans-serif'; c.fillStyle = '#6E7A96'; c.fillText('Date', 180, 980);
    c.textAlign = 'right'; c.font = 'italic 600 44px Fredoka, sans-serif'; c.fillStyle = '#5A3CD6'; c.fillText('Professor Pip', W - 180, 940);
    c.font = '700 24px Nunito, sans-serif'; c.fillStyle = '#6E7A96'; c.fillText('Head Scientist, Light & Sound Labs', W - 180, 980);
    cv.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `science-detective-certificate${name ? '-' + name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() : ''}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, 'image/png');
  }
};
})();
