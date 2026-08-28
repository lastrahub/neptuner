# NepTuner 0.24 validation

Last run: 2026-08-28

## Automated regression result

Run from the project root:

~~~sh
node tests/run.mjs
~~~

Current result:

~~~text
NepTuner v0.24 validation passed
  preset tunings: 33
  pitch cases: 138
  worst synthetic pitch error: 0.187 cents
  lowest synthetic clarity: 0.9995
  polyphonic direction and missing-string checks: passed
~~~

The 138 single-note cases cover every preset target used by guitar, bass,
mandolin and ukulele, detuned by −30, 0 and +27 cents, at both 44.1 and 48 kHz.
Signals contain a fundamental, second and third harmonics, deterministic phase
and low deterministic noise. The acceptance bound is 0.5 cents.

The polyphonic checks use a six-string synthetic strum. They verify flat/sharp
direction on the four strings least affected by exact harmonic collisions,
confirm that an unstruck G string is suppressed, and confirm that resetting the
mode removes old results.

The same run also checks:

- JavaScript and manifest syntax;
- the match between the visible version and offline-cache version;
- all 33 preset tunings;
- dimensions of the 512, 192, maskable and Apple icons;
- existence of every file listed by the offline cache;
- custom-link range validation and use of the browser History API;
- use of fresh readings for lock;
- display of detected rather than target Hz;
- stable multi-reading capture and octave enforcement in intonation mode.

## What this does not establish

These tests protect the implementation against regressions. They do not measure
accuracy on a real instrument or phone. In particular, they do not reproduce:

- microphone frequency response, automatic processing or clipping;
- room reflections and background instruments;
- string inharmonicity, beating, decay and sympathetic resonance in their full
  real-world range;
- differences between acoustic instruments, amplifiers and phone placement;
- CPU load and timing behaviour on older mobile devices;
- the exact low-E-harmonic collisions affecting the B and high-E estimates in
  all-strings mode.

For that reason, NepTuner 0.24 does not publish a universal percentage accuracy
for all-strings mode or claim a real-world worst-case error of 0.05 cents.

## Real-device protocol

Use **tests/real-device-template.csv** to record each trial.

1. Compare single-string mode with a trusted reference tuner on every open
   string. Repeat each string near 0, −20 and +20 cents.
2. Tune every string until NepTuner locks, then strum in all-strings mode.
3. Detune one string at a time by approximately −20 and +20 cents according to
   the reference tuner. Confirm the detected string and direction.
4. Repeat with one string deliberately muted. It should show no mark.
5. Record any missed string, wrong direction, false positive or low-confidence
   dashed mark.
6. Repeat on at least:
   - one iPhone/Safari and one Android/Chromium device;
   - acoustic and electric six-string guitars;
   - quiet and moderately noisy rooms;
   - near and music-stand microphone distances.

Report results by device, instrument and string. Do not pool them into one
headline percentage until enough trials exist to show where failures cluster.
