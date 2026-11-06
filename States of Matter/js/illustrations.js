/* ------------------------------------------------------------------
   Built-in SVG illustrations. Every picture in the lesson exists here, so
   the app is complete with no image files at all. All of them share the
   gradients in DEFS, which is added once to the page (and to any picture
   drawn onto the certificate).
------------------------------------------------------------------- */
(function () {
  const stop = (o, c, a) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`;
  const lin = (id, stops, dir) => {
    const d = dir || 'x1="0" y1="0" x2="0" y2="1"';
    return `<linearGradient id="${id}" ${d}>${stops}</linearGradient>`;
  };
  const rad = (id, stops) => `<radialGradient id="${id}" cx=".35" cy=".3" r=".85">${stops}</radialGradient>`;

  const DEFS = `<defs>
    ${lin('g-ice', stop(0, '#F0FBFF') + stop(.5, '#A5E8FF') + stop(1, '#4CB8E8'))}
    ${lin('g-ice-side', stop(0, '#7CD3F5') + stop(1, '#2F93CF'))}
    ${lin('g-water', stop(0, '#67E8F9') + stop(1, '#0E8FD6'))}
    ${lin('g-wood', stop(0, '#F6C680') + stop(1, '#C77F36'))}
    ${lin('g-wood-d', stop(0, '#C98A45') + stop(1, '#8E5522'))}
    ${lin('g-gold', stop(0, '#FFF3B0') + stop(.45, '#FBBF24') + stop(1, '#C27803'))}
    ${lin('g-gold-d', stop(0, '#E9A516') + stop(1, '#92570A'))}
    ${lin('g-glass', stop(0, '#FFFFFF', .55) + stop(1, '#BAE6FD', .18))}
    ${lin('g-coat', stop(0, '#FFFFFF') + stop(1, '#D6E0F5'))}
    ${lin('g-hair', stop(0, '#C4B5FD') + stop(1, '#7C5CF0'))}
    ${lin('g-red', stop(0, '#FF8A7A') + stop(1, '#D92D3A'))}
    ${lin('g-coral', stop(0, '#FDBA74') + stop(1, '#EA6A12'))}
    ${lin('g-purple', stop(0, '#C4B5FD') + stop(1, '#7C3AED'))}
    ${lin('g-metal', stop(0, '#F1F5F9') + stop(.5, '#94A3B8') + stop(1, '#64748B'))}
    ${lin('g-honey', stop(0, '#FDD76E') + stop(1, '#D98206'))}
    ${lin('g-sand', stop(0, '#FBE3A6') + stop(1, '#D9A654'))}
    ${lin('g-mint', stop(0, '#A7F3D0') + stop(1, '#10B981'))}
    ${lin('g-yellow', stop(0, '#FEF3A1') + stop(1, '#F5B70A'))}
    ${lin('g-oobleck', stop(0, '#F5F7FF') + stop(1, '#AEB9E8'))}
    ${lin('g-leaf', stop(0, '#86EFAC') + stop(1, '#16A34A'))}
    ${lin('g-lab', stop(0, '#0B1540') + stop(.65, '#1E2F7A') + stop(1, '#2C2570'))}
    ${lin('g-floor', stop(0, '#2A2F7D') + stop(1, '#14194D'))}
    ${rad('g-skin', stop(0, '#FFE1C2') + stop(1, '#F2B488'))}
    ${rad('g-ball-blue', stop(0, '#E0F7FF') + stop(.5, '#38BDF8') + stop(1, '#0369A1'))}
    ${rad('g-ball-teal', stop(0, '#D5FFF8') + stop(.5, '#2DD4BF') + stop(1, '#0F766E'))}
    ${rad('g-ball-lav', stop(0, '#F3EDFF') + stop(.5, '#A78BFA') + stop(1, '#5B34C4'))}
    ${rad('g-balloon', stop(0, '#FFC7D5') + stop(.45, '#F4597E') + stop(1, '#B3134A'))}
    ${rad('g-apple', stop(0, '#FFB3A0') + stop(.45, '#E8363D') + stop(1, '#9F1020'))}
    <filter id="f-soft" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0B1540" flood-opacity=".35"/></filter>
    <filter id="f-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;

  const sv = (vb, inner, extra) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${extra || ''}>${inner}</svg>`;
  const shine = (x, y, w, h, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r || w / 2}" fill="#fff" opacity=".55"/>`;

  const A = {};

  /* ---------- Mascot ---------- */
  A.scientist_mascot = () => sv('0 0 220 280', `
    <ellipse cx="110" cy="270" rx="66" ry="8" fill="#0B1540" opacity=".25"/>
    <g class="m-arm-r"><path d="M160 158c22-6 34-22 40-44" fill="none" stroke="url(#g-coat)" stroke-width="22" stroke-linecap="round"/><circle cx="201" cy="108" r="13" fill="url(#g-skin)"/></g>
    <path d="M60 158c-14 16-22 34-20 56" fill="none" stroke="#DCE5F7" stroke-width="22" stroke-linecap="round"/>
    <path d="M56 150q54-22 108 0l14 104q-68 22-136 0z" fill="url(#g-coat)"/>
    <path d="M110 138v122" stroke="#B8C6E3" stroke-width="3"/>
    <path d="M86 138l24 34 24-34-24 8z" fill="#38BDF8"/>
    <path d="M110 150l-16-9v18zM110 150l16-9v18z" fill="#FB923C"/>
    <circle cx="110" cy="150" r="4" fill="#C2410C"/>
    <rect x="124" y="192" width="30" height="26" rx="5" fill="#EAF0FB" stroke="#B8C6E3" stroke-width="2"/>
    <rect x="130" y="184" width="4" height="16" rx="2" fill="#FB923C"/><rect x="138" y="184" width="4" height="16" rx="2" fill="#38BDF8"/>
    <g transform="translate(36 200)">
      <path d="M-9-14h18v12l12 26a6 6 0 0 1-6 9h-30a6 6 0 0 1-6-9l12-26z" fill="url(#g-glass)" stroke="#fff" stroke-width="2"/>
      <path d="M-14 6h28l7 15a4 4 0 0 1-4 6h-34a4 4 0 0 1-4-6z" fill="url(#g-mint)"/>
      <circle class="m-bub" cx="-3" cy="-20" r="4" fill="#A7F3D0"/><circle class="m-bub m-bub2" cx="6" cy="-28" r="3" fill="#A7F3D0"/>
    </g>
    <circle cx="44" cy="214" r="12" fill="url(#g-skin)"/>
    <g class="m-head">
      <path d="M50 76c-16-8-16-30 2-34-2-20 22-30 34-16 8-18 38-16 44 2 16-8 34 8 26 24 16 6 14 28-2 32z" fill="url(#g-hair)"/>
      <circle cx="110" cy="90" r="56" fill="url(#g-skin)"/>
      <path d="M58 68c10-20 30-30 52-30s42 10 52 30c-18-10-34-12-52-12s-34 2-52 12z" fill="url(#g-hair)"/>
      <rect x="54" y="53" width="112" height="9" rx="4.5" fill="#334155"/>
      <circle cx="86" cy="58" r="17" fill="url(#g-glass)" stroke="#334155" stroke-width="5"/>
      <circle cx="134" cy="58" r="17" fill="url(#g-glass)" stroke="#334155" stroke-width="5"/>
      <g class="m-eyes">
        <ellipse cx="90" cy="96" rx="9" ry="12" fill="#1E293B"/><circle cx="93" cy="91" r="3.6" fill="#fff"/>
        <ellipse cx="130" cy="96" rx="9" ry="12" fill="#1E293B"/><circle cx="133" cy="91" r="3.6" fill="#fff"/>
      </g>
      <ellipse cx="72" cy="112" rx="10" ry="6.5" fill="#FB7185" opacity=".5"/><ellipse cx="148" cy="112" rx="10" ry="6.5" fill="#FB7185" opacity=".5"/>
      <path d="M94 115q16 19 32 0-16 5-32 0z" fill="#9F1239"/>
    </g>`);

  /* ---------- Main teaching art ---------- */
  A.ice_cube = () => sv('0 0 200 200', `
    <ellipse cx="100" cy="182" rx="66" ry="10" fill="#0B1540" opacity=".22"/>
    <path d="M100 18l72 36v84l-72 36-72-36V54z" fill="url(#g-ice)" filter="url(#f-soft)"/>
    <path d="M100 90l72-36v84l-72 36z" fill="url(#g-ice-side)" opacity=".85"/>
    <path d="M100 90L28 54v84l72 36z" fill="#BDEBFF" opacity=".7"/>
    <path d="M100 18l72 36-72 36-72-36z" fill="#F3FCFF"/>
    <path d="M100 90v84M28 54l72 36 72-36" stroke="#fff" stroke-width="3" fill="none" opacity=".85"/>
    <path d="M50 76l22 11v28" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".9"/>
    <path d="M122 118l28-14M132 134l14-7" stroke="#E0F7FF" stroke-width="4" stroke-linecap="round"/>`);

  A.water_glass = () => sv('0 0 160 220', `
    <ellipse cx="80" cy="206" rx="46" ry="8" fill="#0B1540" opacity=".2"/>
    <path d="M36 70h88l-8 124a10 10 0 0 1-10 9H54a10 10 0 0 1-10-9z" fill="url(#g-water)"/>
    <ellipse cx="80" cy="70" rx="44" ry="9" fill="#BDF4FF"/>
    <path d="M26 18h108l-11 178a12 12 0 0 1-12 11H49a12 12 0 0 1-12-11z" fill="url(#g-glass)" stroke="#fff" stroke-width="4"/>
    ${shine(44, 34, 9, 140)}
    <circle cx="96" cy="120" r="4" fill="#fff" opacity=".6"/><circle cx="84" cy="150" r="3" fill="#fff" opacity=".6"/>`);

  /* Water vapour is invisible, so the art is a "pretend" magnifier view of
     spaced-out particles and never a white cloud. */
  A.water_vapour = () => sv('0 0 200 200', `
    <circle cx="96" cy="94" r="76" fill="#EEF7FF" opacity=".16" stroke="url(#g-metal)" stroke-width="9"/>
    <rect x="146" y="146" width="56" height="17" rx="8.5" transform="rotate(45 150 150)" fill="url(#g-coral)"/>
    <g fill="url(#g-ball-blue)">
      <circle cx="58" cy="60" r="10"/><circle cx="126" cy="46" r="10"/><circle cx="92" cy="100" r="10"/>
      <circle cx="50" cy="126" r="10"/><circle cx="138" cy="116" r="10"/><circle cx="100" cy="146" r="10"/>
    </g>
    <path d="M70 44l-6 8M112 56l8-5M104 90l8-7M60 118l-8 6M126 106l9 2M90 136l6 7" stroke="#BAE6FD" stroke-width="3" stroke-linecap="round"/>`);

  A.wooden_blocks = () => sv('0 0 220 180', `
    <ellipse cx="110" cy="166" rx="92" ry="9" fill="#0B1540" opacity=".2"/>
    <g filter="url(#f-soft)">
      <path d="M20 90l44-20 44 20v62l-44 18-44-18z" fill="url(#g-wood)"/>
      <path d="M64 110l44-20v62l-44 18z" fill="url(#g-wood-d)"/><path d="M20 90l44-20 44 20-44 20z" fill="#FBD9A0"/>
      <path d="M112 90l44-20 44 20v62l-44 18-44-18z" fill="url(#g-wood)"/>
      <path d="M156 110l44-20v62l-44 18z" fill="url(#g-wood-d)"/><path d="M112 90l44-20 44 20-44 20z" fill="#FBD9A0"/>
      <path d="M66 42l44-20 44 20v50l-44 18-44-18z" fill="#F0B56B"/>
      <path d="M110 60l44-18v50l-44 18z" fill="url(#g-wood-d)"/><path d="M66 42l44-20 44 20-44 18z" fill="#FFE3B3"/>
    </g>
    <path d="M30 112q18 10 30 8M30 128q16 10 28 8M122 112q18 10 28 8M78 66q14 8 26 8" stroke="#A9682B" stroke-width="2" fill="none" opacity=".6"/>`);

  A.water_pouring = () => sv('0 0 240 220', `
    <path d="M78 60C110 62 128 86 130 150" fill="none" stroke="url(#g-water)" stroke-width="16" stroke-linecap="round"/>
    <g transform="rotate(-30 60 60)"><path d="M26 20h70l-6 96a8 8 0 0 1-8 7H40a8 8 0 0 1-8-7z" fill="url(#g-glass)" stroke="#fff" stroke-width="3"/><path d="M96 34c20 0 22 44-3 46" fill="none" stroke="#E2F2FF" stroke-width="7"/></g>
    <path d="M92 140h76l-7 66a8 8 0 0 1-8 6h-46a8 8 0 0 1-8-6z" fill="url(#g-glass)" stroke="#fff" stroke-width="3"/>
    <path d="M96 166h68l-5 40a6 6 0 0 1-6 5h-46a6 6 0 0 1-6-5z" fill="url(#g-water)"/>`);

  A.air_balloon = () => sv('0 0 170 240', `
    <path d="M85 168c4 26-12 34-4 66" fill="none" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
    <path d="M85 160l-10 14h20z" fill="#B3134A"/>
    <ellipse cx="85" cy="86" rx="66" ry="78" fill="url(#g-balloon)"/>
    <ellipse cx="60" cy="52" rx="13" ry="22" transform="rotate(24 60 52)" fill="#fff" opacity=".6"/>
    <g fill="#FFE4EC" opacity=".85"><circle cx="72" cy="96" r="6"/><circle cx="108" cy="72" r="6"/><circle cx="100" cy="122" r="6"/><circle cx="56" cy="124" r="6"/><circle cx="118" cy="104" r="6"/></g>`);

  A.particle_model = () => {
    let s = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s += `<circle cx="${28 + c * 19}" cy="${54 + r * 19}" r="9" fill="url(#g-ball-blue)"/>`;
    const liq = [[142, 108], [161, 110], [180, 108], [199, 110], [150, 92], [170, 92], [190, 90], [160, 75]];
    liq.forEach(p => s += `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="url(#g-ball-teal)"/>`);
    const gas = [[258, 56], [302, 48], [280, 88], [320, 96], [248, 108]];
    gas.forEach(p => s += `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="url(#g-ball-lav)"/>`);
    return sv('0 0 344 134', `<g fill="#F8FAFC" fill-opacity=".12" stroke="#F8FAFC" stroke-width="3"><rect x="14" y="36" width="90" height="90" rx="8"/><rect x="128" y="36" width="90" height="90" rx="8"/><rect x="238" y="36" width="90" height="90" rx="8"/></g>${s}`);
  };

  A.sand = () => {
    let g = '';
    const pts = [[52, 112], [76, 124], [106, 96], [128, 118], [150, 130], [92, 138], [64, 142], [118, 146], [142, 148], [100, 72], [84, 96], [40, 138], [162, 148]];
    pts.forEach(p => g += `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="#B07F2F"/>`);
    return sv('0 0 200 170', `<ellipse cx="100" cy="158" rx="88" ry="9" fill="#0B1540" opacity=".2"/>
      <path d="M12 156c26-8 42-40 62-72 12-20 30-32 44-12 18 26 36 72 70 84z" fill="url(#g-sand)"/>
      <path d="M74 84c12-20 30-32 44-12-18-4-30 8-44 12z" fill="#FFF0C7"/>${g}`);
  };

  A.honey = () => sv('0 0 190 230', `
    <path d="M104 62c16 2 18 22 16 44-2 18 10 22 8 42-2 16-14 18-18 0-4-20-10-28-12-48-2-22-8-36 6-38z" fill="url(#g-honey)"/>
    <ellipse cx="113" cy="176" rx="11" ry="15" fill="url(#g-honey)"/>
    <rect x="-8" y="30" width="118" height="13" rx="6.5" transform="rotate(-12 50 40)" fill="url(#g-wood)"/>
    <ellipse cx="124" cy="46" rx="36" ry="24" transform="rotate(-12 124 46)" fill="url(#g-wood)"/>
    <ellipse cx="124" cy="48" rx="28" ry="17" transform="rotate(-12 124 48)" fill="url(#g-honey)"/>
    <path d="M58 196q55-16 110 0l-10 22a10 10 0 0 1-9 6H77a10 10 0 0 1-9-6z" fill="url(#g-glass)" stroke="#fff" stroke-width="3"/>
    <path d="M66 204q47-11 94 0l-7 15a6 6 0 0 1-5 3H78a6 6 0 0 1-5-3z" fill="url(#g-honey)"/>
    ${shine(112, 96, 4, 26)}`);

  A.toothpaste = () => sv('0 0 240 170', `
    <rect x="16" y="88" width="210" height="18" rx="9" transform="rotate(-6 120 97)" fill="url(#g-red)"/>
    <g fill="#F8FAFC"><rect x="120" y="60" width="9" height="32" rx="4" transform="rotate(-6 124 76)"/><rect x="134" y="58" width="9" height="32" rx="4" transform="rotate(-6 138 74)"/><rect x="148" y="56" width="9" height="32" rx="4" transform="rotate(-6 152 72)"/><rect x="162" y="55" width="9" height="32" rx="4" transform="rotate(-6 166 71)"/><rect x="176" y="53" width="9" height="32" rx="4" transform="rotate(-6 180 69)"/><rect x="190" y="52" width="9" height="32" rx="4" transform="rotate(-6 194 68)"/></g>
    <path d="M116 54c-4-14 14-14 20-12s18-6 24-2 18-6 24-1 18-2 20 8-10 9-20 8l-24 3-22 2c-10 1-20 3-22-6z" fill="#F8FAFC" filter="url(#f-soft)"/>
    <path d="M124 48c10-6 22-2 30-5s20-5 30-2 14 1 20 6" fill="none" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
    <path d="M124 56c12-3 24-3 34-5s24-3 36-3" fill="none" stroke="#FB7185" stroke-width="4" stroke-linecap="round"/>`);

  A.oobleck = () => sv('0 0 220 180', `
    <ellipse cx="110" cy="164" rx="86" ry="9" fill="#0B1540" opacity=".2"/>
    <path d="M18 76h184c0 44-30 82-70 86H88c-40-4-70-42-70-86z" fill="url(#g-purple)"/>
    <ellipse cx="110" cy="76" rx="92" ry="22" fill="#6D28D9"/>
    <ellipse cx="110" cy="78" rx="82" ry="17" fill="url(#g-oobleck)"/>
    <path d="M86 80c-4-22 4-44 18-44s10 14 22 16 14 18 8 28z" fill="url(#g-oobleck)" stroke="#8D9AD8" stroke-width="2"/>
    <path d="M102 42c0 10 2 22 10 30" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".8"/>
    <ellipse cx="44" cy="80" rx="12" ry="4" fill="#fff" opacity=".6"/>`);

  A.condensation = () => {
    let d = '';
    [[58, 70, 5], [76, 98, 7], [62, 126, 6], [90, 138, 4], [106, 84, 6], [118, 118, 8], [84, 170, 7], [110, 158, 5], [130, 76, 4], [54, 164, 4], [132, 150, 6], [102, 190, 5]].forEach(p => {
      d += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${p[2]}" ry="${p[2] * 1.3}" fill="#E0F7FF" stroke="#7DD3FC" stroke-width="1.5"/><circle cx="${p[0] - p[2] * .3}" cy="${p[1] - p[2] * .4}" r="${p[2] * .25}" fill="#fff"/>`;
    });
    return sv('0 0 190 240', `
      <ellipse cx="95" cy="226" rx="52" ry="8" fill="#0B1540" opacity=".2"/>
      <path d="M46 62h98l-8 148a10 10 0 0 1-10 9H64a10 10 0 0 1-10-9z" fill="url(#g-water)" opacity=".8"/>
      <path d="M36 22h118l-12 192a12 12 0 0 1-12 11H60a12 12 0 0 1-12-11z" fill="url(#g-glass)" stroke="#fff" stroke-width="4"/>
      <rect x="62" y="50" width="30" height="26" rx="5" fill="#E9FBFF" transform="rotate(-10 77 63)"/>
      <rect x="100" y="48" width="30" height="26" rx="5" fill="#DBF6FF" transform="rotate(12 115 61)"/>${d}`);
  };

  /* ---------- Equipment ---------- */
  A.thermometer = () => sv('0 0 90 260', `
    <rect x="24" y="8" width="42" height="204" rx="21" fill="#F8FAFC" stroke="#94A3B8" stroke-width="3" filter="url(#f-soft)"/>
    <circle cx="45" cy="222" r="30" fill="url(#g-red)" stroke="#94A3B8" stroke-width="3"/>
    <rect x="38" y="20" width="14" height="190" rx="7" fill="#E2E8F0"/>
    <rect class="th-demo" x="38" y="90" width="14" height="124" fill="url(#g-red)"/>
    <g stroke="#475569" stroke-width="2.5">${[32, 58, 84, 110, 136, 162, 188].map(y => `<path d="M56 ${y}h8"/>`).join('')}</g>
    <circle cx="36" cy="214" r="7" fill="#fff" opacity=".55"/>`);

  A.stopwatch = () => sv('0 0 200 240', `
    <rect x="82" y="8" width="36" height="26" rx="7" fill="url(#g-metal)"/>
    <rect x="92" y="28" width="16" height="18" fill="#94A3B8"/>
    <rect x="30" y="40" width="30" height="16" rx="6" transform="rotate(-38 45 48)" fill="url(#g-coral)"/>
    <circle cx="100" cy="138" r="90" fill="url(#g-metal)" filter="url(#f-soft)"/>
    <circle cx="100" cy="138" r="74" fill="#F8FAFC"/>
    <g stroke="#172554" stroke-width="4" stroke-linecap="round">
      ${Array.from({ length: 12 }, (_, i) => `<path d="M100 70v${i % 3 ? 7 : 13}" transform="rotate(${i * 30} 100 138)"/>`).join('')}
    </g>
    <g class="sw-hand"><path d="M100 150V82" stroke="#EA580C" stroke-width="5" stroke-linecap="round"/></g>
    <circle cx="100" cy="138" r="8" fill="#172554"/>
    <path d="M42 110a64 64 0 0 1 26-30" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>`);

  A.beaker = () => sv('0 0 190 220', `
    <ellipse cx="95" cy="206" rx="62" ry="8" fill="#0B1540" opacity=".2"/>
    <path d="M42 96h106v94a12 12 0 0 1-12 12H54a12 12 0 0 1-12-12z" fill="url(#g-mint)" opacity=".85"/>
    <ellipse cx="95" cy="96" rx="53" ry="8" fill="#BBF7D0"/>
    <path d="M26 16h138l-16 8v166a14 14 0 0 1-14 14H56a14 14 0 0 1-14-14V24z" fill="url(#g-glass)" stroke="#fff" stroke-width="4"/>
    <g stroke="#F8FAFC" stroke-width="3">${[50, 80, 110, 140, 170].map((y, i) => `<path d="M${i % 2 ? 122 : 110} ${y}h26"/>`).join('')}</g>
    ${shine(54, 36, 8, 136)}
    <circle class="bk-b" cx="82" cy="170" r="5" fill="#ECFDF5"/><circle class="bk-b bk-b2" cx="106" cy="182" r="4" fill="#ECFDF5"/><circle class="bk-b bk-b3" cx="96" cy="140" r="4" fill="#ECFDF5"/>`);

  A.measuring_jug = () => sv('0 0 220 220', `
    <ellipse cx="95" cy="206" rx="66" ry="8" fill="#0B1540" opacity=".2"/>
    <path d="M38 98h116l-5 96a10 10 0 0 1-10 9H52a10 10 0 0 1-10-9z" fill="url(#g-water)" opacity=".85"/>
    <path d="M18 16h150l-8 178a12 12 0 0 1-12 11H44a12 12 0 0 1-12-11L28 40z" fill="url(#g-glass)" stroke="#fff" stroke-width="4"/>
    <path d="M166 44c44-4 44 88-2 88" fill="none" stroke="#E2F2FF" stroke-width="12" stroke-linecap="round"/>
    <g stroke="#F8FAFC" stroke-width="3">${[60, 90, 120, 150, 180].map((y, i) => `<path d="M${i % 2 ? 122 : 104} ${y}h34"/>`).join('')}</g>`);

  /* ---------- Interface ---------- */
  A.star = () => sv('0 0 100 100', `<path d="M50 5l13 29 32 4-24 21 7 32-28-17-28 17 7-32L5 38l32-4z" fill="url(#g-gold)" stroke="#B7791F" stroke-width="3" stroke-linejoin="round"/><path d="M50 16l5 13" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`);
  A.stars = () => sv('0 0 240 130', [[60, 62, 1, '#FBBF24'], [130, 40, 1.25, '#38BDF8'], [192, 82, .85, '#A78BFA']].map(p => `<path transform="translate(${p[0] - 40 * p[2]} ${p[1] - 40 * p[2]}) scale(${p[2] * .8})" d="M50 5l13 29 32 4-24 21 7 32-28-17-28 17 7-32L5 38l32-4z" fill="${p[3]}" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>`).join(''));

  A.trophy = () => sv('0 0 220 260', `
    <path d="M48 42C8 40 12 112 66 112M172 42c40-2 36 70-18 70" fill="none" stroke="url(#g-gold-d)" stroke-width="14" stroke-linecap="round"/>
    <path d="M48 22h124v62c0 44-26 70-62 70S48 128 48 84z" fill="url(#g-gold)" filter="url(#f-soft)"/>
    <path d="M70 34v56c0 20 8 36 22 46" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none" opacity=".6"/>
    <rect x="96" y="150" width="28" height="42" fill="url(#g-gold-d)"/>
    <path d="M64 192h92l10 24H54z" fill="url(#g-gold)"/>
    <rect x="44" y="214" width="132" height="32" rx="6" fill="#3B2A8C"/>
    <rect x="72" y="222" width="76" height="16" rx="3" fill="url(#g-gold)"/>
    <path transform="translate(82 42) scale(.56)" d="M50 5l13 29 32 4-24 21 7 32-28-17-28 17 7-32L5 38l32-4z" fill="#FFF8D6"/>`);

  /* ---------- Objects without a supplied asset ---------- */
  A.apple = () => sv('0 0 160 170', `
    <ellipse cx="80" cy="160" rx="50" ry="7" fill="#0B1540" opacity=".2"/>
    <path d="M80 48c-14-12-58-12-62 34-4 40 26 76 46 74 8-1 12-5 16-5s8 4 16 5c20 2 50-34 46-74-4-46-48-46-62-34z" fill="url(#g-apple)"/>
    <path d="M80 48c-2-14 0-26 8-36" stroke="#7A4A1F" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M86 34c10-22 34-24 46-18-6 18-28 28-46 18z" fill="url(#g-leaf)"/>
    <ellipse cx="46" cy="80" rx="10" ry="18" transform="rotate(16 46 80)" fill="#fff" opacity=".5"/>`);

  A.chair = () => sv('0 0 160 190', `
    <ellipse cx="80" cy="180" rx="56" ry="7" fill="#0B1540" opacity=".2"/>
    <rect x="42" y="10" width="76" height="82" rx="14" fill="url(#g-coral)"/>
    <rect x="52" y="20" width="56" height="10" rx="5" fill="#fff" opacity=".4"/>
    <path d="M46 90h10v22H46zM104 90h10v22h-10z" fill="url(#g-wood-d)"/>
    <rect x="28" y="106" width="104" height="20" rx="9" fill="url(#g-wood)"/>
    <path d="M40 126l-8 52M120 126l8 52M58 126l-3 44M102 126l3 44" stroke="url(#g-wood-d)" stroke-width="10" stroke-linecap="round"/>`);

  A.pencil = () => sv('0 0 180 180', `
    <g transform="rotate(-40 90 90)" filter="url(#f-soft)">
      <rect x="0" y="74" width="26" height="32" rx="6" fill="#F9A8D4"/>
      <rect x="24" y="74" width="16" height="32" fill="url(#g-metal)"/>
      <rect x="40" y="74" width="94" height="32" fill="url(#g-yellow)"/>
      <rect x="40" y="82" width="94" height="6" fill="#fff" opacity=".45"/>
      <path d="M134 74l38 16-38 16z" fill="#FCE4BF"/><path d="M158 84l14 6-14 6z" fill="#334155"/>
    </g>`);

  /* A torch beam stands for light, which is the one non-matter object. */
  A.light = () => sv('0 0 210 170', `
    <path class="light-beam" d="M92 62L206 8v142L92 106z" fill="#FEF3A1" opacity=".9"/>
    <g filter="url(#f-soft)">
      <rect x="8" y="66" width="68" height="36" rx="8" fill="url(#g-purple)"/>
      <path d="M76 58l22-8v68l-22-8z" fill="url(#g-metal)"/>
      <rect x="28" y="60" width="20" height="10" rx="3" fill="#FDE68A"/>
    </g>
    <path d="M18 76h44" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4"/>`);

  A.rice = () => {
    const pts = [[64, 104, 20], [86, 92, -30], [108, 106, 45], [132, 96, -15], [76, 124, -40], [102, 128, 15], [126, 122, 70], [150, 118, -35], [52, 126, 60], [92, 72, 80], [118, 76, 10], [66, 84, 30], [142, 138, 25], [116, 144, -60], [86, 146, 40], [60, 146, -20]];
    return sv('0 0 200 180', `<ellipse cx="100" cy="166" rx="84" ry="8" fill="#0B1540" opacity=".2"/>
      <path d="M22 118h156c0 30-24 46-46 46H68c-22 0-46-16-46-46z" fill="url(#g-coral)"/>
      <ellipse cx="100" cy="118" rx="78" ry="16" fill="#C2410C"/>
      <path d="M36 116c14-50 112-62 128 0-30 16-98 16-128 0z" fill="#F4F1E6"/>
      ${pts.map(p => `<ellipse cx="${p[0]}" cy="${p[1] - 12}" rx="10" ry="4" transform="rotate(${p[2]} ${p[0]} ${p[1] - 12})" fill="#fff" stroke="#D8D2BE" stroke-width="1.5"/>`).join('')}`);
  };

  A.salt = () => sv('0 0 160 190', `
    <ellipse cx="80" cy="180" rx="50" ry="7" fill="#0B1540" opacity=".2"/>
    <path d="M40 76h80l8 96a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8z" fill="url(#g-glass)" stroke="#fff" stroke-width="3"/>
    <path d="M36 118h88l4 54a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8z" fill="#F4F7FB"/>
    <path d="M42 76c0-40 20-58 38-58s38 18 38 58z" fill="url(#g-metal)"/>
    <g fill="#172554"><circle cx="66" cy="44" r="3.6"/><circle cx="80" cy="36" r="3.6"/><circle cx="94" cy="44" r="3.6"/><circle cx="80" cy="54" r="3.6"/></g>
    <g fill="#CBD5E1"><rect x="50" y="130" width="7" height="7" transform="rotate(20 53 133)"/><rect x="82" y="146" width="7" height="7" transform="rotate(45 85 149)"/><rect x="104" y="128" width="6" height="6" transform="rotate(30 107 131)"/><rect x="64" y="160" width="6" height="6" transform="rotate(10 67 163)"/></g>`);

  A.rock = () => sv('0 0 200 150', `<ellipse cx="100" cy="138" rx="80" ry="8" fill="#0B1540" opacity=".2"/><path d="M22 126c-8-32 10-72 44-84 36-14 70-8 92 18 20 24 24 48 14 66-40 12-112 12-150 0z" fill="url(#g-metal)"/><path d="M60 62l34 26 46-30M94 88l-12 34" stroke="#64748B" stroke-width="3" fill="none"/>`);

  A.juice = () => sv('0 0 160 220', `
    <ellipse cx="80" cy="206" rx="46" ry="8" fill="#0B1540" opacity=".2"/>
    <path d="M36 62h88l-8 132a10 10 0 0 1-10 9H54a10 10 0 0 1-10-9z" fill="url(#g-coral)"/>
    <ellipse cx="80" cy="62" rx="44" ry="9" fill="#FDBA74"/>
    <path d="M26 18h108l-11 178a12 12 0 0 1-12 11H49a12 12 0 0 1-12-11z" fill="url(#g-glass)" stroke="#fff" stroke-width="4"/>
    <path d="M100 8l-10 74" stroke="#FB7185" stroke-width="8" stroke-linecap="round"/>`);

  /* A science lab scene with shelves, glowing flasks and a night window. */
  A.science_lab_bg = () => sv('0 0 1280 720', `
    <rect width="1280" height="720" fill="url(#g-lab)"/>
    <g opacity=".95">
      <circle cx="1040" cy="170" r="128" fill="#0B1540" stroke="#4C5BC7" stroke-width="12"/>
      <circle cx="1078" cy="140" r="34" fill="#FDE68A" opacity=".95"/><circle cx="1092" cy="130" r="30" fill="#0B1540"/>
      <g fill="#F8FAFC"><circle cx="980" cy="120" r="3"/><circle cx="1010" cy="220" r="2.5"/><circle cx="1096" cy="226" r="3"/><circle cx="960" cy="186" r="2"/><circle cx="1036" cy="90" r="2"/></g>
      <path d="M912 170h256M1040 42v256" stroke="#4C5BC7" stroke-width="6"/>
    </g>
    <g fill="#3545A6"><rect x="40" y="190" width="350" height="12" rx="4"/><rect x="40" y="370" width="290" height="12" rx="4"/><rect x="600" y="118" width="210" height="10" rx="4"/></g>
    <g>
      <path d="M72 112h24v28l26 50H46l26-50z" fill="#38BDF8" opacity=".55"/><path d="M60 170h48l10 20H50z" fill="#38BDF8"/>
      <rect x="150" y="100" width="48" height="90" rx="10" fill="#6EE7B7" opacity=".45"/><rect x="150" y="140" width="48" height="50" rx="8" fill="#6EE7B7"/>
      <circle cx="268" cy="152" r="38" fill="#A78BFA" opacity=".45"/><path d="M232 162a38 38 0 0 0 72 0z" fill="#A78BFA"/><rect x="258" y="96" width="20" height="30" fill="#A78BFA" opacity=".45"/>
      <path d="M86 300h20v24l22 46H64l22-46z" fill="#FB923C" opacity=".5"/><path d="M76 346h40l8 24H68z" fill="#FB923C"/>
      <rect x="160" y="294" width="34" height="76" rx="8" fill="#FDE68A" opacity=".5"/><rect x="160" y="330" width="34" height="40" rx="6" fill="#FDE68A"/>
      <rect x="226" y="310" width="66" height="60" rx="10" fill="#38BDF8" opacity=".35"/>
      <rect x="640" y="62" width="30" height="56" rx="7" fill="#C4B5FD" opacity=".55"/><path d="M712 60h18v18l16 40h-50l16-40z" fill="#6EE7B7" opacity=".6"/>
    </g>
    <path d="M0 590h1280v130H0z" fill="url(#g-floor)"/><path d="M0 590h1280" stroke="#4C5BC7" stroke-width="5"/>
    <g fill="#F8FAFC" opacity=".05"><path d="M90 590L0 720h200zM480 590l-90 130h200zM880 590l-80 130h190zM1200 590l-90 130h200z"/></g>`);

  SM.DEFS = DEFS;
  SM.illus = function (key) {
    return A[key] ? A[key]() : '';
  };

  /* A complete SVG document that can draw itself on a canvas (certificate). */
  SM.illusStandalone = function (key) {
    return (A[key] ? A[key]() : '').replace(/(<svg[^>]*>)/, '$1' + DEFS);
  };

  /* Makes the shared gradients available to every inline picture. The holder
     stays rendered at zero size because display:none would break references. */
  SM.installDefs = function () {
    const holder = document.createElement('div');
    holder.setAttribute('aria-hidden', 'true');
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.innerHTML = '<svg width="0" height="0">' + DEFS + '</svg>';
    document.body.prepend(holder);
  };

  /* ---------- Small interface icons ---------- */
  const ic = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  SM.icons = {
    home: ic('<path d="M3 11.5 12 4l9 7.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>'),
    prev: ic('<path d="M15 5l-7 7 7 7"/>'),
    next: ic('<path d="M9 5l7 7-7 7"/>'),
    soundOn: ic('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>'),
    soundOff: ic('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M17 10l4 4M21 10l-4 4"/>'),
    full: ic('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    exitFull: ic('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'),
    check: ic('<path d="M5 13l4.5 4.5L19 7"/>'),
    lock: ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    reset: ic('<path d="M4 4v6h6"/><path d="M5 10a8 8 0 1 1-1 5"/>'),
    download: ic('<path d="M12 4v11M7 11l5 5 5-5"/><path d="M4 20h16"/>'),
    print: ic('<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M8 14h8v6H8z"/>')
  };
  SM.starSvg = () => A.star();

  /* Badge artwork: a medal with a symbol for each lab area. */
  SM.badgeArt = function (sym, col) {
    const glyphs = {
      flask: '<path d="M43 26h14v13l12 24a5 5 0 0 1-5 7H36a5 5 0 0 1-5-7l12-24z" fill="#fff"/><path d="M36 56h28l4 8a4 4 0 0 1-4 5H36a4 4 0 0 1-4-5z" fill="' + col + '"/>',
      lens: '<circle cx="46" cy="44" r="15" fill="none" stroke="#fff" stroke-width="7"/><path d="M57 55l13 13" stroke="#fff" stroke-width="8" stroke-linecap="round"/>',
      atoms: '<g fill="#fff"><circle cx="38" cy="38" r="8"/><circle cx="62" cy="38" r="8"/><circle cx="38" cy="62" r="8"/><circle cx="62" cy="62" r="8"/></g>',
      drop: '<path d="M50 22c12 18 20 26 20 36a20 20 0 0 1-40 0c0-10 8-18 20-36z" fill="#fff"/>',
      thermo: '<rect x="44" y="20" width="12" height="42" rx="6" fill="#fff"/><circle cx="50" cy="66" r="12" fill="#fff"/>',
      cap: '<path d="M50 28l34 15-34 15-34-15z" fill="#fff"/><path d="M30 52v12c12 9 28 9 40 0V52l-20 9z" fill="#fff"/>'
    };
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="${col}"/><circle cx="50" cy="50" r="46" fill="none" stroke="#FFF3B0" stroke-width="5"/><circle cx="50" cy="50" r="38" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>${glyphs[sym] || ''}</svg>`;
  };
})();
