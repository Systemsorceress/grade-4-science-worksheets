/* ==========================================================
   audio.js — every sound is generated with the Web Audio API.
   No audio autoplays: the context is only created after a click.
   Volumes are kept gentle (master gain + compressor).
   ========================================================== */
window.LS = window.LS || {};

LS.audio = (() => {
  let ctx = null, master = null, noiseBuf = null;
  let enabled = true, unlocked = false;
  // audio may only start after the user interacts with the page (no autoplay)
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, () => { unlocked = true; }, { capture: true, passive: true }));
  const active = new Set();

  function ensure() {
    if (!enabled || !unlocked) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.ratio.value = 6;
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  const now = () => ctx.currentTime;

  function noise() {
    if (noiseBuf) return noiseBuf;
    const len = ctx.sampleRate * 2;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function track(node, stopAt) {
    active.add(node);
    node.onended = () => active.delete(node);
    if (stopAt) node.stop(stopAt);
  }
  function env(g, t, peak, attack, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  /* simple tone with envelope */
  function tone(freq, dur = .6, { type = 'sine', vol = .5, attack = .01, delay = 0, dest } = {}) {
    if (!ensure()) return;
    const t = now() + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    env(g, t, vol, attack, dur);
    o.connect(g); g.connect(dest || master);
    o.start(t); track(o, t + dur + .05);
  }

  /* Karplus–Strong plucked string */
  function pluck(freq, dur = 1.6, { vol = .7, bright = .5, delay = 0 } = {}) {
    if (!ensure()) return;
    const sr = ctx.sampleRate, len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
    const N = Math.max(2, Math.round(sr / freq));
    const ring = new Float32Array(N);
    for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
    let idx = 0;
    const damp = 0.994 + bright * 0.005;
    for (let i = 0; i < len; i++) {
      const nxt = (idx + 1) % N;
      const v = (ring[idx] + ring[nxt]) * 0.5 * damp;
      d[i] = ring[idx];
      ring[idx] = v; idx = nxt;
    }
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = buf; g.gain.value = vol;
    src.connect(g); g.connect(master);
    const t = now() + delay;
    src.start(t); track(src);
  }

  function drum(base = 90, { vol = .9, dur = .7 } = {}) {
    if (!ensure()) return;
    const t = now();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(base * 2.2, t);
    o.frequency.exponentialRampToValueAtTime(base, t + .12);
    env(g, t, vol, .005, dur);
    o.connect(g); g.connect(master); o.start(t); track(o, t + dur + .05);
    // skin slap
    const n = ctx.createBufferSource(), ng = ctx.createGain(), f = ctx.createBiquadFilter();
    n.buffer = noise(); f.type = 'lowpass'; f.frequency.value = 1400;
    env(ng, t, .25, .002, .12);
    n.connect(f); f.connect(ng); ng.connect(master); n.start(t); track(n, t + .2);
  }

  function chirp() {
    if (!ensure()) return;
    [0, .16, .32].forEach((dt, i) => {
      const t = now() + dt;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(2600 + i * 150, t);
      o.frequency.exponentialRampToValueAtTime(4200, t + .05);
      o.frequency.exponentialRampToValueAtTime(3000, t + .1);
      env(g, t, .28, .005, .11);
      o.connect(g); g.connect(master); o.start(t); track(o, t + .15);
    });
  }

  function whistle() {
    if (!ensure()) return;
    const t = now();
    const o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 2100;
    lfo.frequency.value = 28; lg.gain.value = 70;
    lfo.connect(lg); lg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(.22, t + .05);
    g.gain.setValueAtTime(.22, t + .6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + .8);
    o.connect(g); g.connect(master);
    o.start(t); lfo.start(t); track(o, t + .85); track(lfo, t + .85);
  }

  function bell(f = 1320) {
    if (!ensure()) return;
    [[1, .4, 1.6], [2.0, .18, 1.1], [2.76, .12, .8], [5.4, .06, .5]].forEach(([m, v, d]) => tone(f * m, d, { vol: v, attack: .003 }));
  }

  function squeak() {
    if (!ensure()) return;
    const t = now();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(900, t);
    o.frequency.exponentialRampToValueAtTime(1700, t + .12);
    o.frequency.exponentialRampToValueAtTime(1150, t + .32);
    env(g, t, .3, .02, .36);
    o.connect(g); g.connect(master); o.start(t); track(o, t + .4);
  }

  function thunder() {
    if (!ensure()) return;
    const t = now();
    const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = noise(); n.loop = true;
    f.type = 'lowpass'; f.frequency.value = 140; f.Q.value = .7;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(.9, t + .35);
    g.gain.exponentialRampToValueAtTime(.5, t + 1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    n.connect(f); f.connect(g); g.connect(master); n.start(t); track(n, t + 2.5);
    tone(55, 2, { vol: .25, attack: .3 });
  }

  /* voice-like buzz with formant filters */
  function voice(f0 = 110, dur = 1, { vol = .5, muffled = false, delay = 0, glide = 0 } = {}) {
    if (!ensure()) return;
    const t = now() + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t);
    if (glide) o.frequency.linearRampToValueAtTime(f0 * glide, t + dur);
    const out = ctx.createGain(); out.gain.value = 1;
    [[muffled ? 400 : 700, 6, 1], [muffled ? 700 : 1200, 8, .6], [2500, 10, muffled ? 0 : .3]].forEach(([fr, q, gv]) => {
      if (!gv) return;
      const bp = ctx.createBiquadFilter(), bg = ctx.createGain();
      bp.type = 'bandpass'; bp.frequency.value = fr; bp.Q.value = q; bg.gain.value = gv;
      o.connect(bp); bp.connect(bg); bg.connect(out);
    });
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .06);
    g.gain.setValueAtTime(vol, t + dur - .15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    out.connect(g); g.connect(master);
    o.start(t); track(o, t + dur + .05);
  }

  /* "Hel-lo!" style two-syllable voice */
  function hello({ muffled = false, vol = .55, delay = 0 } = {}) {
    voice(190, .32, { vol, muffled, delay, glide: 1.1 });
    voice(170, .45, { vol, muffled, delay: delay + .36, glide: .8 });
  }

  /* ruler twang: buzzy tone with exponential decay */
  function twang(freq, dur = 1.6, vol = .45) {
    if (!ensure()) return;
    const t = now();
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = freq;
    o2.type = 'square'; o2.frequency.value = freq; const g2 = ctx.createGain(); g2.gain.value = .12;
    f.type = 'lowpass'; f.frequency.setValueAtTime(freq * 8, t); f.frequency.exponentialRampToValueAtTime(freq * 2, t + dur);
    env(g, t, vol, .004, dur);
    o.connect(f); o2.connect(g2); g2.connect(f); f.connect(g); g.connect(master);
    o.start(t); o2.start(t); track(o, t + dur + .05); track(o2, t + dur + .05);
  }

  /* glass bottle tap */
  function tap(freq) {
    if (!ensure()) return;
    [[1, .5, .9], [2.32, .14, .5], [4.1, .06, .25]].forEach(([m, v, d]) => tone(freq * m, d, { vol: v, attack: .002 }));
    const t = now();
    const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = noise(); f.type = 'highpass'; f.frequency.value = 3000;
    env(g, t, .12, .001, .04);
    n.connect(f); f.connect(g); g.connect(master); n.start(t); track(n, t + .06);
  }

  /* sustained tone you can retune (frequency slider) */
  function hold(freq, { type = 'sine', vol = .3 } = {}) {
    if (!ensure()) return { set() {}, stop() {} };
    const t = now();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .08);
    o.connect(g); g.connect(master); o.start(t); track(o);
    let stopped = false;
    return {
      set(f) { if (!stopped) o.frequency.setTargetAtTime(f, now(), .04); },
      stop() { if (stopped) return; stopped = true; const s = now(); g.gain.cancelScheduledValues(s); g.gain.setValueAtTime(g.gain.value, s); g.gain.exponentialRampToValueAtTime(0.0001, s + .15); o.stop(s + .2); }
    };
  }

  /* UI feedback */
  const ui = {
    click() { tone(880, .06, { vol: .12, type: 'triangle' }); },
    correct() { tone(660, .18, { vol: .25, type: 'triangle' }); tone(990, .3, { vol: .25, type: 'triangle', delay: .1 }); },
    wrong() { tone(220, .25, { vol: .22, type: 'triangle' }); tone(185, .3, { vol: .18, type: 'triangle', delay: .12 }); },
    star() { [1046, 1318, 1568, 2093].forEach((f, i) => tone(f, .25, { vol: .14, delay: i * .06 })); },
    badge() { [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone(f, .3, { vol: .16, type: 'triangle', delay: i * .1 })); },
    whoosh() {
      if (!ensure()) return;
      const t = now();
      const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      n.buffer = noise(); f.type = 'bandpass'; f.Q.value = 1.2;
      f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(2400, t + .25);
      env(g, t, .08, .05, .3);
      n.connect(f); f.connect(g); g.connect(master); n.start(t); track(n, t + .32);
    }
  };

  function stopAll() { active.forEach(n => { try { n.stop(); } catch (e) { /* already stopped */ } }); active.clear(); }

  return {
    tone, pluck, drum, chirp, whistle, bell, squeak, thunder, voice, hello, twang, tap, hold, ui, stopAll,
    get enabled() { return enabled; },
    set enabled(v) { enabled = !!v; if (!enabled) stopAll(); }
  };
})();
