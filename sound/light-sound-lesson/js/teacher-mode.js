/* ==========================================================
   teacher-mode.js — teacher notes panel, lesson plan & timer.
   Hidden in presentation (student) mode. Toggle with T or the
   graduation-cap button.
   ========================================================== */
window.LS = window.LS || {};

LS.TIMINGS = [
  ['Introduction', 5, 'intro'], ['Light Lab', 17, 'light'], ['Vibrations', 8, 'vibe'], ['Sound travel', 10, 'travel'],
  ['Pitch', 10, 'pitch'], ['Final mission', 6, 'mission'], ['Assessment', 4, 'quiz']
];

LS.NOTES = {
  welcome: {
    teach: 'Set the scene: pupils are Science Detectives investigating two labs. Read the four mission cards aloud — these are the learning objectives.',
    ask: ['What do you already know about light?', 'What do you already know about sound?'],
    expect: ['Light comes from the Sun / lamps; we need it to see.', 'Sounds can be loud or quiet; we hear with our ears.'],
    demo: 'Optional hook: switch the classroom lights off for a moment, then make a sound (clap). "Which sense still works in the dark?"',
    mis: 'None yet — collect pupils\' ideas to revisit at the end.'
  },
  mystery: {
    teach: 'Prediction activity. Let pupils vote (hands up or mini whiteboards) before clicking. Unlock the two big ideas: LIGHT helps us see, SOUND helps us hear.',
    ask: ['Can you see objects in complete darkness?', 'What happens when we switch on a torch?', 'Can you hear someone without seeing them?', 'What travels from a speaker to our ears?'],
    expect: ['No — there is no light to reach our eyes.', 'Light bounces off the toy into our eyes.', 'Yes — sound travels around/through walls and doors.', 'Vibrations / sound waves through the air.'],
    demo: 'Use the "Switch on" button in card 2 to show the torch lighting up the toy.',
    mis: 'Many pupils think "our eyes get used to the dark" means we can see in total darkness. In complete darkness we cannot see at all — we only see when some light is present.'
  },
  see: {
    teach: 'Play the light journey: source → object → reflected light → eye → brain. Stress that light must travel from the object INTO our eyes.',
    ask: ['Why can\'t we see the teddy in a dark cupboard?', 'Is the Moon a light source?'],
    expect: ['No light reaches the teddy, so none reflects into our eyes.', 'No — it reflects light from the Sun.'],
    demo: 'Light source hunt: pupils come up and click only objects that make their own light.',
    mis: 'Common misconception: eyes send out light ("beams" from the eyes). Also: the Moon and shiny objects are light sources. Correct both explicitly.'
  },
  reflection: {
    teach: 'Reflection = light bouncing off a surface. Use the ball analogy. In the mirror challenge, tilting the mirror changes the direction of the reflected ray.',
    ask: ['Does light disappear when it hits a mirror?', 'What happens to the reflected ray when you tilt the mirror?'],
    expect: ['No — it is reflected in another direction.', 'It changes direction.'],
    demo: 'Hit the three stars by tilting the mirror. Optional: point out that the angle going in equals the angle coming out (the dashed line is the "normal").',
    mis: 'Pupils may think only mirrors reflect light. All objects we can see reflect some light — that\'s how we see them.'
  },
  absorption: {
    teach: 'Absorption = a material takes in light energy. Press "Shine the torch" to compare the black surface, white surface and mirror.',
    ask: ['Which surface reflects the most light?', 'What happens to the light that is absorbed?', 'Why might dark clothes feel warmer on a sunny day?'],
    expect: ['The mirror (clear reflection); white paper reflects lots too but scatters it.', 'Its energy is taken in — the material warms a little.', 'They absorb more light energy.'],
    demo: 'Point out the thermometer on the black surface rising.',
    mis: 'Avoid "black absorbs ALL light" or "white reflects ALL light". Most real materials reflect some and absorb some (see the bars).'
  },
  sort: {
    teach: 'Drag-and-drop sorting. We sort by which the object does MORE of — not all or nothing.',
    ask: ['Why did you put the spoon in that box?', 'Does a mirror absorb any light at all?'],
    expect: ['It is shiny/smooth so it reflects lots of light.', 'Yes — a tiny amount.'],
    demo: 'Invite pupils to the board to drag. Click-then-click also works on touch screens.',
    mis: 'Watch for "black paper reflects no light" — if it reflected none, we couldn\'t see it at all!'
  },
  detective: {
    teach: 'Hands-on practical (about 7 minutes). Work in small groups. Use the instructions one at a time. Use the virtual lab as a backup or to model before groups start.',
    ask: ['Which object reflected light most clearly?', 'What happened when the mirror was tilted?', 'Did black paper reflect as much visible light as white paper?', 'What is the difference between reflection and absorption?'],
    expect: ['The mirror.', 'The reflected light moved / changed direction.', 'No — black paper reflected much less light; it absorbed more.', 'Reflection: light bounces off. Absorption: the material takes in the light energy.'],
    demo: 'Equipment per group: torch, small mirror, sheet of white paper, sheet of black paper. Dim the room lights if possible. Shine the torch at the mirror so the reflection lands on a wall or ceiling.',
    mis: 'SAFETY: never direct a torch into anyone\'s eyes. Use low-power torches; no laser pointers. Glass mirrors should have safe edges (use plastic/acrylic mirrors if possible).'
  },
  vibrations: {
    teach: 'All sounds are made by vibrations — quick back-and-forth movements. Click each object to see/hear it vibrate. Pluck the big guitar string.',
    ask: ['Can you make a sound without something vibrating?', 'What vibrates when you speak?'],
    expect: ['No — every sound starts with a vibration (sometimes too small or fast to see).', 'Our vocal cords.'],
    demo: 'Real demo: rice or paper bits on a drum skin; a tuning fork dipped in water; pupils gently touch their throats and hum.',
    mis: 'Pupils may think sound is made by "hitting" alone. The hit makes the object vibrate — it\'s the vibration that makes the sound.'
  },
  'ruler-practical': {
    teach: 'Practical: pairs with a 30 cm ruler. Watch the ruler vibrate and notice the sound stops when the vibrations stop.',
    ask: ['What is moving?', 'What can you hear?', 'What happens when the ruler stops moving?'],
    expect: ['The end of the ruler hanging over the desk.', 'A twangy/buzzing sound.', 'The sound stops.'],
    demo: 'Hold the ruler FIRMLY on the desk edge. Pull the free end down gently (just 1–2 cm) and let go. Plastic or wooden rulers both work.',
    mis: 'Some pupils think the desk makes the sound. Try holding the ruler with a looser grip — compare.'
  },
  travel: {
    teach: 'Vibrating object → particles → sound waves → ear → brain. Introduce MEDIUM. Press "Make it vibrate" and watch the red particle.',
    ask: ['Does the red particle travel all the way to the ear?', 'What is a medium?', 'Why can\'t sound travel in space?'],
    expect: ['No — it only vibrates around its own place, passing the vibration on.', 'A material sound travels through (air, water, solids).', 'Space is a vacuum — no particles to pass on vibrations.'],
    demo: 'Human particle chain: pupils stand in a line, shoulder to shoulder; the first gently sways and nudges the next. The "sound" travels, but nobody leaves their spot.',
    mis: 'Big misconception: air travels from the source to the ear. Emphasise that the particles vibrate in place and pass the vibration along.'
  },
  media: {
    teach: 'Sound travels through gases, liquids and solids, but not through a vacuum. Answer then "Test it" each medium.',
    ask: ['Can you hear sounds underwater?', 'Why does tapping a desk sound loud when your ear is on the desk?'],
    expect: ['Yes — sound travels through water.', 'Sound travels well through solids.'],
    demo: 'Pupils put an ear on the desk while a partner gently taps the far end.',
    mis: 'Some pupils think sound can\'t travel through solids or water. Others think space is noisy (films!). Sound cannot travel through a vacuum.'
  },
  telephone: {
    teach: 'Practical (or demo). The voice makes the cup vibrate; the vibrations travel along the TIGHT string (a solid) to the second cup, which vibrates and makes sound.',
    ask: ['What happens when the string is tight?', 'What happens when the string is loose?', 'How does the sound reach the other cup?'],
    expect: ['The voice is clear.', 'Very quiet or nothing — vibrations aren\'t passed on well.', 'As vibrations along the string.'],
    demo: 'Make the hole with a sharpened pencil (adult). Use 5–10 m of string, knotted inside each cup. Keep the string straight and not touching anything.',
    mis: 'Accuracy: the sound travels as vibrations through the STRING material (a solid medium) — never say "through empty string" or through a vacuum. Pinching the string stops the sound — try it!'
  },
  pitch: {
    teach: 'Pitch = how high or low a sound is. Click examples and watch the pitch meter. Use "High vs low" for a clear comparison.',
    ask: ['Is a bird\'s chirp high or low pitched?', 'Is pitch the same as loudness?'],
    expect: ['High.', 'No — a sound can be loud and low (thunder) or quiet and high.'],
    demo: 'Volume is kept gentle. Ask pupils to show high/low with their hands as each sound plays.',
    mis: 'Pupils often confuse pitch with volume ("high" = loud). Keep the words separate: pitch = high/low, volume = loud/quiet.'
  },
  frequency: {
    teach: 'Frequency = the number of vibrations in one second. Fast vibrations → high pitch; slow vibrations → low pitch. Use the slider to hear the link.',
    ask: ['Which wave has more vibrations per second?', 'What happens to the pitch when the vibrations get faster?'],
    expect: ['The high-pitch wave.', 'It gets higher.'],
    demo: 'Use the slider with the tone on, moving slowly from slower to faster.',
    mis: 'The animations are slowed down — real sounds vibrate hundreds of times every second.'
  },
  features: {
    teach: 'Features that affect pitch: length, tightness, thickness. Each changes how fast the object vibrates.',
    ask: ['What happens to the pitch if the vibrating part is shorter?', 'Does thickness always decide the pitch?'],
    expect: ['It usually gets higher.', 'No — material and tightness matter too.'],
    demo: 'Click each pair to compare.',
    mis: 'Don\'t teach "thin = high" as a universal rule. It holds when the material and tightness are the same.'
  },
  'ruler-exp': {
    teach: 'Fair test: change only the overhang length. Predict first, then test short and long overhangs, record results, conclude.',
    ask: ['What did we change?', 'What did we keep the same?', 'What pattern did you find?'],
    expect: ['The length hanging over the desk.', 'The same ruler, the same pull.', 'Shorter overhang → higher pitch.'],
    demo: 'Real version: mark 8 cm and 24 cm on the ruler. Pupils record results in a table.',
    mis: 'Pupils may say the longer ruler is "louder" — focus on high/low, not loud/quiet.'
  },
  bands: {
    teach: 'Rubber band guitar: tightness, length (bridge) and thickness all affect pitch.',
    ask: ['What happened when you tightened the bands?', 'What happened when you moved the bridge?', 'Which band was highest — and why?'],
    expect: ['The pitch got higher.', 'A shorter vibrating part gave a higher pitch.', 'The thinnest — in this box they are the same material and equally tight.'],
    demo: 'Real version: shoebox or open plastic tub, rubber bands of different thicknesses, a pencil as the bridge.',
    mis: 'Thickness alone does not always decide pitch — tightness, length and material matter too.'
  },
  bottles: {
    teach: 'TAPPING identical bottles: more water → lower pitch (the glass and water vibrate together; more mass vibrates more slowly).',
    ask: ['Which bottle gave the lowest pitch?', 'Why?'],
    expect: ['The one with the most water.', 'More water makes the bottle vibrate more slowly.'],
    demo: 'Use identical glass bottles or jars. Tap the SIDES gently with a pencil or wooden spoon. Plastic bottles don\'t ring well.',
    mis: 'IMPORTANT: blowing across the tops is a DIFFERENT experiment with the OPPOSITE pattern. When blowing, the air column vibrates: more water → shorter air column → higher pitch. Don\'t mix the two experiments.'
  },
  challenge: {
    teach: 'Apply learning: three predictions, then complete the sentence. Accept length, tightness, thickness, amount of water, etc.',
    ask: ['Can you explain your answer using the word "vibrate"?'],
    expect: ['Short ruler — higher pitch.', 'Tighter band — higher pitch.', 'More water (tapping) — lower pitch.'],
    demo: 'Pupils can answer on mini whiteboards first, then one pupil clicks.',
    mis: 'Check pupils aren\'t just guessing — ask for "because…" explanations.'
  },
  quiz: {
    teach: '15 questions covering all objectives. One question at a time with feedback. Pupils can work individually or in pairs.',
    ask: ['(Review any question most pupils got wrong.)'],
    expect: ['Aim for 10+ / 15.'],
    demo: 'Use the dots at the top to see progress. "Retry quiz" restarts it.',
    mis: 'Use incorrect answers as discussion points.'
  },
  certificate: {
    teach: 'Celebrate! Pupils type their name and print or download the certificate.',
    ask: ['What was the most surprising thing you learned today?'],
    expect: ['Any reflection.'],
    demo: 'Use "New student" to clear progress before the next class (click twice to confirm).',
    mis: '—'
  }
};

LS.teacher = (() => {
  let open = false, panel, elapsed = 0, running = false, tick = null, lastT = 0;
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function render() {
    if (!open) return;
    const s = LS.slides[LS.current], n = LS.NOTES[s.id] || {};
    const sec = s.section;
    panel.innerHTML = `
      <button class="t-close" id="t-close">Close ✕</button>
      <h2>${LS.icons.teacher.replace('<svg', '<svg width="24" height="24"')} Teacher notes</h2>
      <p style="margin:6px 0 0"><b>Slide ${LS.current + 1}: ${s.title}</b></p>
      <span class="t-time">Time: ${s.time}</span>
      <div class="t-timer"><b id="t-clock">${fmt(elapsed)}</b><button id="t-run">${running ? 'Pause' : 'Start'}</button><button id="t-reset">Reset</button><span class="t-target">Lesson timer<br>target for this slide: ${s.time}</span></div>
      <h4>Teaching explanation</h4><p>${n.teach || ''}</p>
      <h4>Questions to ask</h4><ul>${(n.ask || []).map(q => `<li>${q}</li>`).join('')}</ul>
      <h4>Expected answers</h4><ul>${(n.expect || []).map(q => `<li>${q}</li>`).join('')}</ul>
      <h4>Practical / demonstration</h4><p>${n.demo || ''}</p>
      <h4>Misconceptions &amp; safety</h4><p class="t-mis">${n.mis || ''}</p>
      <h4>Lesson timings (60 minutes)</h4>
      <table class="t-plan">${LS.TIMINGS.map(t => `<tr class="${t[2] === sec ? 'now' : ''}"><td>${t[0]}</td><td style="text-align:right">${t[1]} min</td></tr>`).join('')}<tr><td><b>Total</b></td><td style="text-align:right"><b>60 min</b></td></tr></table>
      <p style="font-size:13px;color:#5E6A86;margin-top:12px">Keys: ← → slides · T teacher notes · F fullscreen · M sound · Home first slide</p>`;
    LS.$('#t-close', panel).onclick = toggle;
    LS.$('#t-run', panel).onclick = () => { running = !running; lastT = performance.now(); render(); };
    LS.$('#t-reset', panel).onclick = () => { elapsed = 0; running = false; render(); };
  }
  function toggle(force) {
    open = typeof force === 'boolean' ? force : !open;
    panel.hidden = !open;
    document.body.classList.toggle('teacher', open);
    LS.$('#btn-teacher').classList.toggle('on', open);
    render();
    LS.layout && LS.layout();
  }
  function init() {
    panel = LS.$('#teacher-panel');
    tick = setInterval(() => {
      if (running) { const t = performance.now(); elapsed += (t - lastT) / 1000; lastT = t; const c = document.getElementById('t-clock'); if (c) c.textContent = fmt(elapsed); }
    }, 500);
  }
  return { init, toggle, render, get open() { return open; } };
})();
