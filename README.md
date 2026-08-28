# NepTuner

A tuner for guitar and other string instruments. It runs in a browser, installs
to the home screen, works with no connection, and stores nothing about you.

Live at **https://lastrahub.github.io/neptuner/**

---

## Using it

Press **Start listening** and grant the microphone. Two pickers sit at the top:
**Instrument** and **Tuning**. The tuning picker also holds the two modes that
are not tunings, at the very top of the list.

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

Tapping a string also plays its target pitch, so you can tune by ear.

### Free note

Chromatic. Reports the nearest of the twelve notes in any octave. One note at a
time — a chord has no single pitch to report.

### Intonation check

Checks whether a string plays in tune along the whole neck, which is a different
question from whether it is in tune open.

1. Tune the string normally first, or the comparison means nothing.
2. Choose **Intonation check**.
3. Play the string **open** and let it ring. It is captured automatically once
   the pitch holds still.
4. **Fret the 12th** on that same string and play it, with your usual pressure.
   Captured the same way.
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
mode. Across a wide family of synthesised guitars it gets the verdict
right 97–99% of the time with a median error under 0.12 cents, but the worst
case is over 30 cents, so the display shows direction rather than numbers — a
figure would claim a precision it does not have.

**A string that was not struck shows nothing.** Its level is compared against the
strum's own, and anything under a fifth of that is treated as silence rather than
measured out of noise.

**A hollow, dashed mark means low confidence.** A guitar is tuned in fourths, so
the third harmonic of the low E lands on the B string and the fourth lands on
the top E, within a fraction of a hertz when both are near pitch. Nothing can
separate two sounds at the same frequency, so those two strings sometimes read
badly or not at all. That is admitted rather than hidden.

#### Checking whether it actually works

The estimator is validated against synthesised strums, which is a test of the
code against a model of a guitar rather than against a guitar. The model is
deliberately hostile — inharmonicity, random brightness and decay, uneven strums,
muted strings, a false string beating against itself, phone-microphone bass
roll-off, noisy rooms — and it holds at 97–99% correct verdicts with a median
error under 0.12 cents. It is still a model.

**The app carries its own reference instrument, so a real test costs nothing.**
The single-string mode is accurate to about 0.02 cents and has been used in
anger; use it as ground truth.

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

The last entry in the tuning list. Tap the string you want to change, then use
**−** and **+** to move it a semitone at a time; each step plays the new pitch.
The range is limited to what that instrument's detector can actually hear.

**The tuning lives in the address bar**, not in storage:

```
lastrahub.github.io/neptuner/#t=guitar-38-45-50-55-57-62
```

Nothing is written to the device, and a tuning you invented can be bookmarked,
put on the home screen, or sent to someone as a link. A malformed link is
ignored and the app starts normally.

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
- **The half-filled circle** — light or dark. Not remembered; every launch
  starts dark.

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
| flat | the string settled — actually in tune |
| sinking steadily | a peg slipping, a new string still stretching, or a nut that grabs and releases |
| never stops waving | a dead or false string; it will not hold, change it |

**It waits before saying in tune.** A string sounds sharp the instant it is
plucked and falls as it settles, so the reading only counts once it has held
within three cents for a third of a second. Until then it says *hold*. Calling
it at the crossing means tuning to the attack and ending up flat — worth two to
four cents in practice, which is a hundred times the detector's own error.

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

There is nothing to opt out of, because nothing leaves the device.

- No fonts, icons, scripts or analytics are loaded from anybody else.
- A `Content-Security-Policy` of `default-src 'none'` and `connect-src 'none'`
  makes the browser refuse any outgoing connection. Enforced, not promised.
- The microphone feeds the browser's audio engine; the analysis runs on device.
  Audio is never recorded, saved or transmitted.
- No cookies, no account, no identifiers, no local storage of any kind. Not even
  the theme.
- The app's own files are stored on the device so it runs offline. After the
  first visit, using it sends no request to any server. The browser checks for a
  new version on its own at most once a day.

The only absolute addresses in the source are the Open Graph tags, read by the
servers of whatever a link is pasted into. The reader's browser never fetches
them.

---

## How it works

**YIN** (de Cheveigné & Kawahara, 2002). It compares the signal with a delayed
copy of itself at every lag, squares the difference, and looks for the lag where
that collapses. A cumulative-mean normalisation makes the first dip the true
period rather than a harmonic. Parabolic interpolation between lags gives
sub-sample resolution; measured error is about **0.02 cents**, worst case 0.05.

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

## Files

| File | Purpose |
| --- | --- |
| `index.html` | the whole app: markup, styles, audio, detection, drawing |
| `sw.js` | keeps the files on the device so the tuner runs offline |
| `manifest.webmanifest` | name, colours, icon and orientation for install |
| `icon.png` | 512×512 home-screen icon |
| `share.png` | 1200×630 card shown when the link is shared |
| `.nojekyll` | tells GitHub Pages to serve the files untouched |

Serving requires HTTPS or `localhost`: browsers only grant microphone access in
a secure context.

---

## Publishing a change

Edit the files, then raise the version in **two** places so they match:

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
