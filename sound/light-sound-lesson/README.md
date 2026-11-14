# Light & Sound Mission — Year 4 Science

An interactive, gamified 60-minute lesson on **light and sound** for Year 4 (ages 8–9).
Pupils become *Science Detectives* exploring a **Light Lab** and a **Sound Lab**.

## How to run

Double-click `index.html` (Chrome, Edge, Firefox or Safari). No install, no server and no internet connection needed. Everything (fonts, images, sounds) is stored locally.

## Controls

| Action | How |
|---|---|
| Next / previous slide | → / ← keys, PageDown / PageUp (clicker remotes), or the round arrow buttons |
| First / last slide | Home / End, or the logo button (Home) |
| Mission map (jump to any slide) | Click the progress bar |
| Stars & badges | Click the star counter |
| Teacher notes | **T** key or the graduation-cap button (hidden by default = presentation mode) |
| Fullscreen | **F** key or the fullscreen button |
| Sound on/off | **M** key or the speaker button |
| Close panels | Esc |

## Lesson plan (60 minutes)

| Section | Slides | Time |
|---|---|---|
| Introduction | 1–2 | 5 min |
| Light Lab | 3–7 | 17 min |
| Sound Lab: vibrations | 8–9 | 8 min |
| Sound Lab: how sound travels | 10–12 | 10 min |
| Sound Lab: pitch | 13–18 | 10 min |
| Final mission | 19 | 6 min |
| Assessment + certificate | 20–21 | 4 min |

Each slide has teacher notes covering the explanation, questions to ask, expected answers, the practical/demo, misconceptions/safety and its time slot. The panel also has a lesson timer.

## Features

- 21 interactive slides: prediction questions, an animated "how we see" diagram, a light-source hunt, a tilting-mirror challenge, a reflect/absorb comparison, drag-and-drop sorting, a virtual Mirror Detective lab, a pluckable guitar string, a draggable vibrating ruler, a particle model of sound waves, a medium challenge (gas, liquid, solid, vacuum), a string-telephone simulation, pitch sounds with a pitch meter, frequency waves with a live tone slider, a ruler pitch experiment with predictions and a results table, a rubber-band guitar (tightness, bridge length, thickness), tapping water bottles, the final challenge, a 15-question quiz and a printable/downloadable certificate.
- Stars, 15 badges and a progress bar, all saved in `localStorage` (slide, stars, badges, completed activities, quiz scores and name).
- All sounds are generated with the Web Audio API at gentle volume. Nothing plays until the user clicks.
- The 16:9 stage scales to fit any laptop or projector screen. On phones and narrow windows, it switches to a stacked, scrolling layout.
- **New student:** on the certificate slide, click "New student" twice to clear all progress.

## Project structure

```
index.html
css/   style.css (core UI) · animations.css · slides.css (per-slide layouts) · responsive.css
js/    audio.js (Web Audio synth) · activities.js (reusable components & simulations)
       slides.js (the 21 slides) · quiz.js (quiz + certificate) · teacher-mode.js (notes, timings, timer)
       app.js (state, navigation, scaling, HUD, badges, keyboard)
assets/images       original SVG illustrations (scientist, torch, mirror, instruments, ear, eye…)
assets/backgrounds  lab_background.svg
assets/icons        star.svg
assets/fonts        Fredoka & Nunito (SIL Open Font License, from Google Fonts)
```

## Assets & licensing

All illustrations are **original SVGs made for this project**, so there are no third-party image licences to track. The fonts are Fredoka and Nunito under the SIL Open Font License 1.1. No audio files are used; every sound is synthesised in the browser.

## Science notes

The content follows the brief's science-accuracy list. Specifically:
- Most materials both reflect and absorb some light.
- Particles vibrate in place rather than travelling to the ear.
- Sound cannot travel through a vacuum.
- Thickness is not presented as a universal rule for pitch.
- The tapping-bottles pattern (more water → lower pitch) is kept separate from the blowing-across-bottles pattern, which appears only as a teacher note.
