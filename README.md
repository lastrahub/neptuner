# NepTuner

A tuner for guitar and other string instruments. It runs in a browser, installs
to the home screen, works with no connection, and collects nothing about you.

Live at **https://lastrahub.github.io/neptuner/**

---

## Using it

Press **Start listening** and grant the microphone. Two pickers sit at the top:
**Instrument** and **Tuning**. The tuning picker also holds the three modes that
are not tunings — free note, intonation and all strings at once — at the top.

### Tuning mode — the default

Pluck a string and let it ring. The app works out which string of the selected
tuning you mean and tells you what to do with the peg: **loosen** or **tighten**,
never "sharp" or "flat", because the peg is the thing in your hand.

**Tap a string button to tune that string alone.** Two things happen: the target
stops being a guess, and the detector narrows its search to seven semitones
either side of that string. Do this whenever you are changing tuning — with the
guitar still in standard and Drop C selected, the sixth string sits three
semitones under G and four over C, and no automatic choice can be right. Tap the
button again to go back to automatic.

Automatic refuses to guess when the runner-up target is nearly as close as the
winner. It says **pick the string** instead of inventing an answer.

Tapping a string also plays its target pitch, so you can tune by ear. While that
reference tone sounds, microphone analysis pauses so the phone cannot mistake
its own speaker for the instrument.

### Free note

Chromatic. Reports the nearest of the twelve notes in any octave. One note at a
time — a chord has no single pitch to report.

### Intonation check

Checks whether a string plays in tune along the whole neck, which is a different
question from whether it is in tune open.

1. Tune the string normally first, or the comparison means nothing.
2. Choose **Intonation check**.
3. Play the string **open** and let it ring. It is captured automatically from
   the median of a sequence of fresh, stable readings.
4. **Fret the 12th** on that same string and play it, with your usual pressure.
   It is captured the same way, but only if the note is actually near the octave.
5. The verdict says how many cents it misses the octave by, and which way to
   move the saddle: back to lengthen the string if it is sharp, forward to
   shorten it if it is flat.

**Start over** clears both slots for the next string. Cents are shown to one
decimal in this mode, and it never announces "in tune" — a three-cent band is
exactly the resolution this job cannot afford.

Acoustics and classicals usually have a one-piece bone saddle with nothing to
adjust. The check still tells you whether it is worth a visit to a luthier.

### All strings at once

Strum everything, and six marks appear on one line — one per string, at its own
error. When they all sit in a row, everything is in tune. Arrows show which way
each has to go, and the big number is how many are already right.

**It is a check, not a precision tool.** Tune the marked strings in the normal
mode. Harmonic collisions can produce a wrong or missing estimate, so the
display deliberately shows direction rather than a numeric value.

**A string that was not struck shows nothing.** Its level is compared against the
strum's own, and anything under a fifth of that is treated as silence rather than
measured out of noise.

**A hollow, dashed mark means low confidence.** A guitar is tuned in fourths, so
the third harmonic of the low E lands on the B string and the fourth lands on
the top E, within a fraction of a hertz when both are near pitch. Nothing can
separate two sounds at the same frequency, so those two strings sometimes read
badly or not at all. That is admitted rather than hidden.

#### Checking whether it actually works

The repository includes deterministic synthetic regression tests for the pitch
detector and the direction reported by the polyphonic estimator. They test the
code against a signal model rather than against a real instrument, so they guard
against software regressions but are not a real-world accuracy claim.

**The app carries its own reference instrument, so a real test costs nothing.**
Use the single-string mode as the practical reference after checking it against
a trusted tuner on the phone and instrument being tested.

1. Tune all six strings in the normal mode until each locks.
2. Switch to **All strings at once** and strum. Every mark should sit on the
   line and the count should read the full number of strings.
3. Pick one string. In the normal mode, detune it deliberately to about +20
   cents — the readout tells you exactly where you are.
4. Strum again. That one string should stand above the line; the others should
   not have moved.
5. Put it back, then repeat flat, and repeat for each string.

Twelve trials, about fifteen minutes. Write down whether the right string was
flagged, whether the direction was right, and whether any other mark moved when
it should not have. That is a real accuracy figure on a real instrument, and it
will be worth more than everything above.

Expect the B and top E to be the weak ones. If they are, the model was right. If
something else fails, the model was wrong and this needs revisiting.

### Custom tuning

Choose **Custom** near the top of the tuning list. Tap the string you want to
change, then use
**−** and **+** to move it a semitone at a time; each step plays the new pitch.
The range is limited to what that instrument's detector can actually hear.

**The shareable tuning lives in the address bar**:

```
lastrahub.github.io/neptuner/#t=guitar-38-45-50-55-57-62
```

It can be bookmarked or sent to someone as a link. The app also remembers it
locally with the other settings for the next launch. A malformed or out-of-range
link is ignored and the app starts normally.

### Turn the phone

While it is listening, landscape gives the meter the whole screen — readable
from a music stand or across a stage. Everything else hides; turning back
restores it. It only switches while listening, so the button that starts it is
never the thing that disappears. If nothing happens, check the device's own
rotation lock.

### The rest of the header

- **Language** — English or Spanish. Galician, Catalan and Basque fall back to
  Spanish. Note names follow the language: letters for English, Do-Re-Mi with
  the letter in brackets for Spanish.
- **A4** — the reference, 392 to 466 Hz.
- **The half-filled circle** — light or dark.

The instrument, tuning, A4 reference, language and theme are remembered in this
browser. **Reset saved settings** deletes them and returns the next launch to
the defaults.

---

## Reading the meter

The water sits where the pitch is: above the centre line means sharp, below
means flat. Three things say the same thing at once, so no single one has to be
noticed:

- **Height** — distance from the centre line is the error.
- **Colour** — a five-stop ramp from red when far out to bright aquamarine at
  the centre. Contrast climbs as you approach, so the ramp reads even with no
  colour perception at all.
- **Movement** — swell and drift both scale with the error. The water flattens
  and slows as you close in.

The head of the current is at the right: that is now. The **wake** trailing left
is the last six seconds, coloured by where the note was at each moment, one
stroke per pluck. That trail is the diagnosis:

| Wake | Meaning |
| --- | --- |
| flat | the string appears to have settled |
| sinking steadily | may suggest a slipping peg, a new string stretching, or a nut that grabs and releases |
| never stops waving | may suggest beating or a false/degraded string |

**It waits before saying in tune.** A string sounds sharp the instant it is
plucked and falls as it settles, so the reading only counts once it has held
within three cents for a third of a second. Until then it says *hold*. Calling
it at the crossing means tuning to the attack and ending up flat by several
cents in practice.

When it locks, the panel, the note, the guide lines and a single expanding ring
all agree at once.

---

## Instruments and tunings

| Instrument | Strings | Tunings |
| --- | --- | --- |
| Guitar | 6 | E / E♭ / D / C♯ / B Standard, Drop D, Double Drop D, Drop C, Drop B, Drop A, Open G, Open D, Open E, Open A, Open C, Open Dm, DADGAD |
| Guitar | 7 | B Standard, A Standard, Drop A |
| Bass | 4 | E / E♭ / D Standard, Drop D, Drop C |
| Bass | 5 | B Standard, Drop A |
| Mandolin | 4 courses | GDAE, GDAD, GDGD |
| Ukulele | 4 | C6 (GCEA), Low G, D6 |

33 tunings, plus a custom one per instrument. Every mode works with every
instrument. A mandolin has eight strings in
four courses, so there are four things to tune, not eight.

Each instrument carries its own detection band, filters and buffer length. A
bass low E is 41 Hz and a ukulele A is 440; one setting cannot serve both. The
high-pass that keeps a guitar clean would erase the bottom of a bass, and the
85 ms buffer that suits a guitar holds barely two periods of one.

---

## Privacy

There is nothing to opt out of because no personal data or audio leaves the
device.

- No fonts, icons, scripts or analytics are loaded from third parties.
- A `Content-Security-Policy` of `default-src 'none'` and `connect-src 'none'`
  blocks programmatic outgoing connections from the page.
- The microphone feeds the browser's audio engine; the analysis runs on device.
  Audio is never recorded, saved or transmitted.
- No cookies, account or identifiers. Instrument, tuning, A4, language, theme
  and custom tunings are kept locally as device preferences and can be deleted
  with **Reset saved settings**.
- The app's own files are stored on the device so it runs offline. The first
  load and occasional update checks contact only NepTuner's own address.

The only absolute addresses in the source are the Open Graph tags, read by the
servers of whatever a link is pasted into. The reader's browser never fetches
them.

---

## How it works

**YIN** (de Cheveigné & Kawahara, 2002). It compares the signal with a delayed
copy of itself at every lag, squares the difference, and looks for the lag where
that collapses. A cumulative-mean normalisation makes the first dip the true
period rather than a harmonic. Parabolic interpolation between lags gives
sub-sample resolution. In the included deterministic synthetic checks, errors
remain below half a cent across the supported target ranges at 44.1 and 48 kHz.
Real strings, microphones and rooms dominate the uncertainty, so this is a
software regression bound rather than a promise of real-world accuracy.

What surrounds the algorithm matters more than the algorithm:

- **The gate is measured against the room**, not against a fixed level. The noise
  floor follows quiet moments down quickly and creeps back up slowly; a note has
  to stand three times above it to open, and 1.6 times to keep tracking. That is
  what lets a guitar two metres away still register — it arrives quieter, but it
  is no less clean.
- **A big jump in pitch needs an attack.** Pluck the top E and the open A rings
  in sympathy, because 330 Hz is exactly its third harmonic; the combined wave is
  genuinely periodic at 110 Hz, so a detector reporting A is not making a
  mistake. What separates a new note from a leftover resonance is the level: a
  pluck rises, a resonance only fades.
- **A clarity floor** rejects anything not periodic enough, and the shallow-dip
  fallback that makes plain steel strings readable is only allowed while the
  signal is strong.
- **The bass decimates**, reading every fourth sample. Its period is four times
  shorter in samples, which puts six periods in the window instead of under two,
  and costs half what the guitar does.
- **Filters follow the instrument**, and close in further around a chosen string.
  The knee has to sit above the top string's harmonics: at 1100 Hz a guitar's
  high E comes out 79 degrees out of phase with its own fundamental, the wave
  stops resembling itself, and the two thinnest strings simply vanish.

---

## Validation

Run the deterministic checks with:

```sh
node tests/run.mjs
```

They verify version/cache consistency, the 33 preset tunings, install-icon
dimensions, custom-link safeguards, single-note pitch error at 44.1 and 48 kHz,
and polyphonic direction on synthetic strums. `VALIDATION.md` records the current
automated result and the limits of what it establishes.

Real-device validation is still required before publishing a population-wide
accuracy percentage. `tests/real-device-template.csv` provides a consistent log
for phones, instruments, strings, flat/sharp trials, missed strings and false
positives.

---

## Files

| File | Purpose |
| --- | --- |
| `index.html` | the whole app: markup, styles, audio, detection, drawing |
| `sw.js` | keeps the files on the device so the tuner runs offline |
| `manifest.webmanifest` | name, colours, icon and orientation for install |
| `icon.svg` | clean vector master for the app icon |
| `icon.png`, `icon-192.png` | 512×512 and 192×192 install icons |
| `icon-maskable-512.png` | safe-zone-aware adaptive icon |
| `apple-touch-icon.png` | 180×180 iOS home-screen icon |
| `share.png` | 1200×630 card shown when the link is shared |
| `tests/run.mjs` | deterministic regression checks |
| `tests/real-device-template.csv` | real-instrument validation log |
| `VALIDATION.md` | current evidence and explicit limitations |
| `.nojekyll` | tells GitHub Pages to serve the files untouched |

Serving requires HTTPS or `localhost`: browsers only grant microphone access in
a secure context.

---

## Publishing a change

Run `node tests/run.mjs`, then raise the version in **two** places so they match:

- `VERSION` in `index.html` — the number shown at the foot of the app
- `CACHE` in `sw.js` — the name of the stored copy

Upload to the repository root. A device picks the change up the next time the
browser checks, or immediately if the reader presses **Check for updates**.

If the version at the foot of the app does not match what you published, the
device is still serving its stored copy.

---

## What it deliberately does not do

No chord library, no song catalogue, no lessons, no metronome, no account, no
notifications, no ads. Those are what turned the tuner everybody used into the
one everybody complains about. This one tunes.
