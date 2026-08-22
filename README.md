# NepTuner

A guitar tuner that runs in the browser, installs to the home screen, and works
with no network at all.

- **Free chromatic note** plus nine preset tunings: E / E♭ / D Standard,
  Drop D, Drop C, Open G, Open D, DADGAD, Open C.
- **English and Spanish**, with letter names (A B C) or Latin names (Do Re Mi),
  chosen by the interface language.
- **Light and dark**, switchable, remembered.

## Privacy

There is nothing to opt out of, because nothing leaves the device.

- No fonts, icons or scripts are loaded from anybody else.
- A `Content-Security-Policy` of `default-src 'none'` and `connect-src 'none'`
  makes the browser enforce that.
- The microphone feeds the browser audio engine; the analysis runs on device.
- No cookies, no analytics, no account. One value is stored locally: the
  chosen theme.

## How it detects the note

YIN (de Cheveigné & Kawahara, 2002). It takes about 4,096 samples and looks for
the delay at which the wave most resembles itself; that delay is the period of
the string. Parabolic interpolation between lags gives roughly cent-level
resolution, a rolling median absorbs octave flickers, and a band-pass around the
instrument's range keeps the room out of it.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | the whole app: markup, styles, audio, drawing |
| `sw.js` | service worker, so it runs offline after one visit |
| `manifest.webmanifest` | name, colours and icon for home-screen install |
| `icon.png` | 512×512 home-screen icon |
| `.nojekyll` | tells GitHub Pages to serve the files untouched |

Serving requires HTTPS (or `localhost`): browsers only grant microphone access
in a secure context.

## Updating

Edit the files, then bump `CACHE` in `sw.js` (`neptuner-v2` → `neptuner-v3`).
The page itself is fetched network-first, so text and layout changes appear on
the next load; the version bump is what clears the cached icon and manifest.
