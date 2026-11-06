/* Slide 18: the award ceremony and printable certificate. The certificate
   is drawn on a canvas, so the preview, download and print are identical. */
(function () {
  const W = 2000, H = 1414; /* A4 landscape ratio */

  const dateText = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  function loadSvg(key) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SM.illusStandalone(key));
    });
  }

  function rounded(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function star(g, cx, cy, R, r, pts) {
    g.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const a = -Math.PI / 2 + i * Math.PI / pts;
      const q = i % 2 ? r : R;
      g[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * q, cy + Math.sin(a) * q);
    }
    g.closePath();
  }

  SM.drawCertificate = async function (canvas, data) {
    canvas.width = W;
    canvas.height = H;
    const g = canvas.getContext('2d');
    try {
      await Promise.all([document.fonts.load('600 80px Fredoka'), document.fonts.load('700 40px Nunito')]);
    } catch (e) { /* the system font fallback is fine */ }
    const [trophy, mascot] = await Promise.all([loadSvg('trophy'), loadSvg('scientist_mascot')]);

    /* Paper */
    g.fillStyle = '#FFFDF6';
    g.fillRect(0, 0, W, H);
    const wash = g.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 1200);
    wash.addColorStop(0, 'rgba(253,230,138,0)');
    wash.addColorStop(1, 'rgba(196,181,253,.28)');
    g.fillStyle = wash;
    g.fillRect(0, 0, W, H);

    /* Border */
    const gold = g.createLinearGradient(0, 0, W, H);
    gold.addColorStop(0, '#F5C542');
    gold.addColorStop(.5, '#B7791F');
    gold.addColorStop(1, '#F5C542');
    g.strokeStyle = '#172554';
    g.lineWidth = 34;
    rounded(g, 34, 34, W - 68, H - 68, 50);
    g.stroke();
    g.strokeStyle = gold;
    g.lineWidth = 12;
    rounded(g, 70, 70, W - 140, H - 140, 34);
    g.stroke();

    /* Corner particles in the three state colours */
    [[150, 150], [W - 150, 150], [150, H - 150], [W - 150, H - 150]].forEach((p, i) => {
      const cols = ['#38BDF8', '#2DD4BF', '#A78BFA', '#FB923C'];
      for (let k = 0; k < 3; k++) {
        g.fillStyle = cols[(i + k) % 4];
        g.beginPath();
        g.arc(p[0] + (k - 1) * 40 * (i % 2 ? -1 : 1), p[1] + (k === 1 ? 0 : 28) * (i < 2 ? 1 : -1), 16, 0, 7);
        g.fill();
      }
    });

    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    if (trophy) g.drawImage(trophy, W / 2 - 75, 112, 150, 177);

    g.fillStyle = '#172554';
    g.font = '600 104px Fredoka, sans-serif';
    g.fillText('Young Scientist Certificate', W / 2, 400);

    g.fillStyle = '#475569';
    g.font = '700 42px Nunito, sans-serif';
    g.fillText('This certificate is proudly awarded to', W / 2, 490);

    /* Name, shrunk to fit long names */
    let size = 132;
    const name = data.name || 'Young Scientist';
    do {
      g.font = `600 ${size}px Fredoka, sans-serif`;
      size -= 4;
    } while (g.measureText(name).width > 1320 && size > 50);
    g.fillStyle = '#7C3AED';
    g.fillText(name, W / 2, 640);
    g.strokeStyle = gold;
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(W / 2 - 560, 680);
    g.lineTo(W / 2 + 560, 680);
    g.stroke();

    g.fillStyle = '#334155';
    g.font = '700 44px Nunito, sans-serif';
    g.fillText('for completing the final science mission in', W / 2, 760);
    g.fillStyle = '#172554';
    g.font = '600 66px Fredoka, sans-serif';
    g.fillText('The Incredible World of Matter', W / 2, 842);
    g.fillStyle = '#475569';
    g.font = '700 36px Nunito, sans-serif';
    g.fillText('Year 4 Science: solids, liquids, gases and changing state', W / 2, 904);

    /* Score, stars and date */
    const boxes = [
      ['Final quiz score', `${data.correct} / ${data.total}  (${data.pct}%)`, '#0EA5E9'],
      ['Stars earned', String(data.stars), '#CA8A04'],
      ['Date', data.date, '#7C3AED']
    ];
    const bw = 480, gap = 40, bx0 = W / 2 - (bw * 3 + gap * 2) / 2;
    boxes.forEach((b, i) => {
      const x = bx0 + i * (bw + gap);
      g.fillStyle = '#FFFFFF';
      rounded(g, x, 960, bw, 140, 24);
      g.fill();
      g.strokeStyle = b[2];
      g.lineWidth = 5;
      g.stroke();
      g.fillStyle = '#475569';
      g.font = '800 30px Nunito, sans-serif';
      g.fillText(b[0], x + bw / 2, 1006);
      g.fillStyle = '#172554';
      g.font = '600 46px Fredoka, sans-serif';
      g.fillText(b[1], x + bw / 2, 1066);
    });

    /* Signature with mascot, and a gold seal */
    if (mascot) g.drawImage(mascot, 300, 1098, 130, 165);
    g.textAlign = 'left';
    g.fillStyle = '#172554';
    g.font = 'italic 600 54px Fredoka, sans-serif';
    g.fillText('Dr Fizz', 450, 1200);
    g.strokeStyle = '#94A3B8';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(450, 1216);
    g.lineTo(830, 1216);
    g.stroke();
    g.fillStyle = '#475569';
    g.font = '700 30px Nunito, sans-serif';
    g.fillText('Head of the Matter Laboratory', 450, 1256);

    const sx = W - 420, sy = 1218;
    g.fillStyle = gold;
    star(g, sx, sy, 96, 80, 22);
    g.fill();
    g.fillStyle = '#172554';
    g.beginPath();
    g.arc(sx, sy, 68, 0, 7);
    g.fill();
    g.fillStyle = '#FDE68A';
    star(g, sx, sy, 46, 20, 5);
    g.fill();
  };

  SM.renderers.certificate = function (root, ctx) {
    const G = SM.game;
    const best = G.state.bestQuiz;

    if (!best) {
      root.innerHTML = `<div class="slide-inner s18-locked">
        <div class="s18-lockart">${SM.art('trophy', { alt: '' })}<span class="s18-lock">${SM.icons.lock}</span></div>
        <h1>Your certificate is waiting!</h1>
        <p>Finish the Young Scientist Quiz to unlock your trophy and certificate.</p>
        <button class="btn btn-huge btn-glow" id="s18-quiz">Go to the quiz</button>
      </div>`;
      ctx.on(root.querySelector('#s18-quiz'), 'click', () => ctx.go(16));
      return;
    }

    const stars = Array.from({ length: 10 }, (_, i) => `<i class="s18-star" style="--x:${(i * 83 + 40) % 100}%;--y:${(i * 47 + 15) % 70}%;--d:${(i * .3).toFixed(1)}s">${SM.starSvg()}</i>`).join('');
    root.innerHTML = `<div class="slide-inner s18-wrap">
      <div class="s18-rays" aria-hidden="true"></div>
      <div class="s18-stars" aria-hidden="true">${stars}</div>
      <div class="s18-left">
        <div class="s18-trophy">${SM.art('trophy', { alt: 'A golden trophy' })}</div>
        <h1>Congratulations!</h1>
        <p class="s18-score">Final quiz score: <b>${best.correct} / ${best.total}</b> (${best.pct}%)</p>
        <label class="s18-name"><span>Type your name for your certificate</span>
          <input type="text" id="s18-input" maxlength="40" autocomplete="off" placeholder="Your name" value="">
        </label>
        <div class="s18-btns">
          <button class="btn btn-glow" id="s18-dl" disabled>${SM.icons.download} DOWNLOAD CERTIFICATE</button>
          <button class="btn btn-mint" id="s18-print" disabled>${SM.icons.print} PRINT CERTIFICATE</button>
        </div>
        <small class="s18-hint" id="s18-hint">Type your name to switch on the buttons.</small>
      </div>
      <div class="s18-right"><canvas id="s18-canvas" role="img" aria-label="Your Young Scientist certificate"></canvas></div>
    </div>`;

    const input = root.querySelector('#s18-input');
    input.value = G.state.name || '';
    const canvas = root.querySelector('#s18-canvas');
    const dl = root.querySelector('#s18-dl');
    const pr = root.querySelector('#s18-print');
    const hint = root.querySelector('#s18-hint');
    const data = () => ({
      name: input.value.trim(), correct: best.correct, total: best.total, pct: best.pct,
      stars: G.state.stars, date: dateText()
    });

    let drawJob = 0;
    const redraw = async () => {
      const job = ++drawJob;
      const off = document.createElement('canvas');
      await SM.drawCertificate(off, data());
      if (job !== drawJob || ctx.dead) return;
      canvas.width = off.width;
      canvas.height = off.height;
      canvas.getContext('2d').drawImage(off, 0, 0);
    };
    const onName = () => {
      G.state.name = input.value.trim();
      G.save();
      const has = !!G.state.name;
      dl.disabled = pr.disabled = !has;
      hint.textContent = has ? 'Your certificate is ready!' : 'Type your name to switch on the buttons.';
      if (has && !G.activityDone(17, 'cert')) {
        G.finishActivity(17, 'cert', 0, input);
      }
      redraw();
    };
    ctx.on(input, 'change', onName);
    let typing;
    ctx.on(input, 'input', () => {
      G.state.name = input.value.trim();
      G.save();
      dl.disabled = pr.disabled = !G.state.name;
      clearTimeout(typing);
      typing = setTimeout(() => { if (!ctx.dead) onName(); }, 500);
    });
    ctx.onLeave(() => clearTimeout(typing));

    const safeName = () => (input.value.trim().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-') || 'Young-Scientist');

    ctx.on(dl, 'click', async () => {
      await redraw();
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Young-Scientist-Certificate-${safeName()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        SM.fx.toast('Certificate saved to your downloads.', 'info');
      }, 'image/png');
    });

    ctx.on(pr, 'click', async () => {
      await redraw();
      const holder = document.getElementById('print-root');
      holder.innerHTML = `<img src="${canvas.toDataURL('image/png')}" alt="Young Scientist Certificate">`;
      const img = holder.querySelector('img');
      const go = () => window.print();
      if (img.complete) go();
      else img.onload = go;
    });

    redraw();
    if (input.value) {
      dl.disabled = pr.disabled = false;
      hint.textContent = 'Your certificate is ready!';
    }
    SM.sound('fanfare');
    ctx.after(350, () => SM.fx.confetti(120, root.querySelector('.s18-trophy')));
    ctx.after(1500, () => SM.fx.confetti(70, root.querySelector('.s18-right')));
  };
})();
