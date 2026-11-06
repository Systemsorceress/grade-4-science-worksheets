/* ------------------------------------------------------------------
   ASSET MAP – the one place to change image filenames.

   key      name used by the code (do not change)
   file     where the app looks for your image (change freely)
   alt      description read out by screen readers
   find     a search page that can help you FIND an image. It is a
            website, not a picture, so it can never be used as an image
            source. Save the picture you choose to the "file" path.

   If "file" loads, it replaces the built-in SVG. If it is missing, the SVG
   stays and no broken-image icon appears. Set file: null to always use the
   SVG, which also stops the browser looking for that file.
------------------------------------------------------------------- */
window.SM = window.SM || {};

(function () {
  const G = q => 'https://www.google.com/search?tbm=isch&q=' + q;
  const I = 'assets/images/';
  const B = 'assets/backgrounds/';

  SM.ASSETS = {
    /* A. Main educational illustrations */
    ice_cube:      { file: I + 'ice_cube.png',      alt: 'An ice cube',                   find: G('3D+ice+cube+educational+illustration+PNG') },
    water_glass:   { file: I + 'water_glass.png',   alt: 'A glass of water',              find: G('glass+of+water+isolated+PNG') },
    water_vapour:  { file: I + 'water_vapour.png',  alt: 'A model of invisible water vapour particles', find: G('water+vapour+steam+educational+illustration+PNG') },
    wooden_blocks: { file: I + 'wooden_blocks.png', alt: 'Wooden building blocks',        find: G('wooden+blocks+isolated+PNG') },
    water_pouring: { file: I + 'water_pouring.png', alt: 'Water pouring from a jug',      find: G('water+pouring+jug+glass+PNG') },
    air_balloon:   { file: I + 'air_balloon.png',   alt: 'A balloon filled with air',     find: G('balloon+filled+with+air+illustration+PNG') },
    particle_model:{ file: I + 'particle_model.png',alt: 'Particle diagrams of a solid, a liquid and a gas', find: G('solid+liquid+gas+particle+model+diagram') },
    sand:          { file: I + 'sand.png',          alt: 'A pile of sand',                find: G('sand+pile+isolated+PNG') },
    honey:         { file: I + 'honey.png',         alt: 'Honey dripping from a spoon',   find: G('honey+dripping+spoon+PNG') },
    toothpaste:    { file: I + 'toothpaste.png',    alt: 'Toothpaste on a toothbrush',    find: G('toothpaste+on+toothbrush+PNG') },
    oobleck:       { file: I + 'oobleck.png',       alt: 'Oobleck in a bowl',             find: G('oobleck+cornstarch+water+experiment') },
    condensation:  { file: I + 'condensation.png',  alt: 'Water droplets on a cold glass',find: G('condensation+water+drops+cold+glass') },

    /* B. Scientific equipment */
    thermometer:   { file: I + 'thermometer.png',   alt: 'A Celsius thermometer',         find: G('educational+Celsius+thermometer+PNG') },
    stopwatch:     { file: I + 'stopwatch.png',     alt: 'A stopwatch',                   find: G('stopwatch+isolated+PNG') },
    beaker:        { file: I + 'beaker.png',        alt: 'A science beaker',              find: G('school+science+beaker+PNG') },
    measuring_jug: { file: I + 'measuring_jug.png', alt: 'A measuring jug',               find: G('transparent+measuring+jug+PNG') },

    /* C. Interface and decoration */
    scientist_mascot: { file: I + 'scientist_mascot.png', alt: 'Dr Fizz, a friendly scientist', find: G('cute+3D+cartoon+scientist+mascot+PNG') },
    trophy:        { file: I + 'trophy.png',        alt: 'A golden trophy',               find: G('3D+gold+trophy+cartoon+PNG') },
    stars:         { file: I + 'stars.png',         alt: 'Colourful reward stars',        find: G('colorful+cartoon+stars+transparent+PNG') },

    /* D. Slide backgrounds */
    science_lab_bg:{ file: I + 'science_lab_bg.png',alt: '', find: G('cartoon+science+laboratory+background+16%3A9') },
    bg_welcome:    { file: B + 'welcome.png',       alt: '', find: G('colorful+cartoon+science+laboratory+background') },
    bg_matter:     { file: B + 'matter.png',        alt: '', find: G('solid+liquid+gas+objects+educational+collage') },
    bg_states:     { file: B + 'states.png',        alt: '', find: G('three+states+of+matter+educational+illustration') },
    bg_particles:  { file: B + 'particles.png',     alt: '', find: G('solid+liquid+gas+particle+model+colorful') },
    bg_changes:    { file: B + 'changes.png',       alt: '', find: G('water+states+change+melting+freezing+evaporation+condensation+diagram') },
    bg_quiz:       { file: B + 'quiz.png',          alt: '', find: G('cute+young+scientist+cartoon+trophy') },
    bg_certificate:{ file: B + 'certificate.png',   alt: '', find: G('kids+science+achievement+certificate+template') }
  };

  /* Which supplied background goes on which slide. A slide with no image
     keeps its designed CSS and SVG scene. */
  SM.SLIDE_BACKGROUNDS = {
    welcome: 'bg_welcome', matter: 'bg_matter', states: 'bg_states', particles: 'bg_particles',
    change: 'bg_changes', quiz: 'bg_quiz', certificate: 'bg_certificate'
  };

  const loaded = {};

  /* Try each file once. When one loads, swap it in wherever it is on screen. */
  SM.probeAssets = function () {
    Object.keys(SM.ASSETS).forEach(key => {
      const a = SM.ASSETS[key];
      if (!a.file) return;
      const img = new Image();
      img.onload = () => {
        loaded[key] = a.file;
        document.querySelectorAll('.art[data-art="' + key + '"]').forEach(el => {
          if (!el.dataset.svgOnly) el.innerHTML = imgTag(key);
        });
        document.querySelectorAll('[data-bg-art="' + key + '"]').forEach(paintBg);
      };
      img.src = a.file;
    });
  };

  function imgTag(key) {
    return '<img src="' + loaded[key] + '" alt="" draggable="false">';
  }

  function paintBg(el) {
    const key = el.dataset.bgArt;
    if (loaded[key]) el.style.backgroundImage = 'url("' + loaded[key] + '")';
  }

  /* Returns the HTML for a picture: a supplied image if there is one, or
     the built-in illustration if not. Animated scenes pass svgOnly because
     their moving parts cannot come from a flat PNG. */
  SM.art = function (key, opts) {
    opts = opts || {};
    const meta = SM.ASSETS[key];
    const alt = opts.alt !== undefined ? opts.alt : (meta ? meta.alt : '');
    const inner = (!opts.svgOnly && loaded[key]) ? imgTag(key) : SM.illus(key);
    return '<span class="art ' + (opts.cls || '') + '" data-art="' + key + '"' +
      (opts.svgOnly ? ' data-svg-only="1"' : '') +
      (alt ? ' role="img" aria-label="' + alt + '"' : ' aria-hidden="true"') +
      (opts.style ? ' style="' + opts.style + '"' : '') + '>' + inner + '</span>';
  };

  SM.applySlideBackground = function (slideEl, slideId) {
    const key = SM.SLIDE_BACKGROUNDS[slideId];
    if (!key) return;
    const layer = document.createElement('div');
    layer.className = 'supplied-bg';
    layer.dataset.bgArt = key;
    slideEl.prepend(layer);
    paintBg(layer);
  };
})();
