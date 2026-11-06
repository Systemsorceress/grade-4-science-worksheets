# The Incredible World of Matter

An interactive Year 4 science adventure about solids, liquids, gases and changing state. It has 18 slides, with missions, stars, badges, a 15-question quiz and a printable certificate.

## How to run it

Double-click `index.html`. There is nothing to install, and it works offline in any modern browser. It uses only HTML, CSS and vanilla JavaScript.

| Key | Action |
| --- | --- |
| Left / Right arrow | Previous / next slide |
| Home / End | First slide / furthest slide reached |
| F | Full screen |
| M | Sound on or off (sound starts off) |

Progress saves automatically in the browser's localStorage. To clear it, go to slide 1 and press **New player** twice.

## Using your own images

The app is complete without any image files, because every picture has a built-in SVG illustration. To use your own picture:

1. Find the image's entry in `js/assets.js`. Each one has a `find` link to a Google Images search.
2. Save the picture you choose to the path shown in `file`, such as `assets/images/ice_cube.png`.
3. Reload the page. The picture replaces the illustration wherever that one is used, and if the file is missing the illustration stays.

To use a different filename, change `file` in `js/assets.js`. Transparent PNGs look best.

**The search links cannot go straight into the HTML.** They open a Google results page, not a picture, so an `<img>` tag pointing at one shows a broken image. They would not work offline either. Please check that each image's licence allows school use.

**Water vapour accuracy:** water vapour is invisible, but many images found by searching "water vapour steam" show white clouds, which are really tiny liquid droplets. If you add `water_vapour.png`, choose a particle-style picture, or set its `file` to `null` to keep the accurate built-in one.

Animated scenes, such as the pouring water, melting ice and particle tanks, are drawn in code so they can move. Flat images do not replace those.

## Rewards

- 1 star for finishing an activity.
- 1 bonus star for finishing a right-or-wrong activity with no mistakes.
- 1 bonus star for each quiz question answered correctly, the first time that question is answered correctly.
- 54 stars are available in total.
- 6 badges, one for finishing each lab area.
- 6 levels: Lab Rookie, Curious Explorer, Lab Assistant, Junior Researcher, Matter Expert and Master Scientist.

Children can always move forward with NEXT, so a class is never stuck. The slide map opens slides up to one past the furthest reached. The certificate unlocks after the quiz and shows the best quiz score.

## Editing the content

| To change | Edit |
| --- | --- |
| Slide list, activity names | top of `js/slides.js` |
| Slides 1-8 | `js/slides.js` |
| Slides 9-16 | `js/slides-changes.js` |
| Quiz questions (slide 17) | the `Q` list in `js/quiz.js` |
| Certificate (slide 18) | `js/certificate.js` |
| Badges, levels, sounds | `js/gamification.js` |
| Colours and fonts | `:root` in `css/style.css` |

## Project layout

```
index.html
css/   style.css (design system and game interface), animations.css,
       slides.css (each slide's look), responsive.css (phones and tablets)
js/    assets.js (image map), illustrations.js (SVG art), gamification.js,
       activities.js (drag and drop, particle tanks, thermometers),
       slides.js, slides-changes.js, quiz.js, certificate.js, app.js
assets/images, backgrounds, icons (for your own images)
assets/fonts   Fredoka and Nunito (SIL Open Font License)
```
