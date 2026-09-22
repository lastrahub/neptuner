/* NepTuner monophonic pitch engine.

   Kept in its own dependency-free file so the browser application and the
   offline benchmark execute exactly the same detector. The public surface is
   deliberately tiny: callers can use the shared detector or create an
   isolated instance for parallel/reproducible tests. */
(function exposeNepTunerPitch(root){
  'use strict';

  const THRESHOLD = 0.12;
  const FALLBACK = 0.35;

  function createPitchDetector(){
    let diff = null;
    let norm = null;
    let cachedTauMax = -1;

    /* YIN (de Cheveigne & Kawahara, 2002): squared difference over lag,
       cumulative-mean normalisation, first reliable local minimum and
       parabolic sub-sample interpolation. `step` decimates bass input after
       the application's low-pass filter has removed frequencies that would
       alias at the reduced rate. */
    return function detectPitch(buf, sampleRate, minHz, maxHz, mayGuess, step){
      step = step || 1;
      if (!buf || !Number.isFinite(sampleRate) || sampleRate <= 0 ||
          !Number.isFinite(minHz) || !Number.isFinite(maxHz) ||
          minHz <= 0 || maxHz <= minHz) return null;

      const rate = sampleRate / step;
      const len = Math.floor(buf.length / step);
      const tauMax = Math.min(Math.floor(rate / minHz), len >> 1);
      const tauMin = Math.max(2, Math.floor(rate / maxHz));
      const window = Math.min(3072, len - tauMax);
      if (window < 16 || tauMax <= tauMin) return null;

      if (tauMax !== cachedTauMax){
        diff = new Float32Array(tauMax + 2);
        norm = new Float32Array(tauMax + 2);
        cachedTauMax = tauMax;
      }

      for (let tau = 1; tau <= tauMax; tau++){
        let sum = 0;
        for (let i = 0; i < window; i++){
          const d = buf[i * step] - buf[(i + tau) * step];
          sum += d * d;
        }
        diff[tau] = sum;
      }

      let running = 0;
      norm[0] = 1;
      for (let tau = 1; tau <= tauMax; tau++){
        running += diff[tau];
        norm[tau] = running > 0 ? diff[tau] * tau / running : 1;
      }

      let found = -1;
      for (let tau = tauMin; tau <= tauMax; tau++){
        if (norm[tau] < THRESHOLD){
          while (tau + 1 <= tauMax && norm[tau + 1] < norm[tau]) tau++;
          found = tau;
          break;
        }
      }

      /* A shallow periodic dip is still useful while a note is strong, but a
         caller can disable this fallback as a decaying note approaches the
         noise floor. */
      if (found < 0 && mayGuess){
        /* Prefer the earliest credible local minimum. A non-stationary pluck
           can make the two- or three-period dip slightly deeper than the true
           one; choosing the global minimum then reports a clean but false
           sub-octave. The caller still applies its independent clarity gate. */
        for (let tau = tauMin + 1; tau < tauMax; tau++){
          if (norm[tau] < FALLBACK && norm[tau] <= norm[tau - 1] && norm[tau] <= norm[tau + 1]){
            found = tau;
            break;
          }
        }
      }
      if (found < 0) return null;

      /* A strong second harmonic can create a convincing half-period dip and
         make the first-threshold rule report an octave too high. Only switch
         to the doubled period when its local dip is dramatically cleaner.
         The lower bound deliberately leaves already-clean fundamentals and
         genuinely harmonic-free tones alone. */
      if (norm[found] > .008 && found * 2 - 2 <= tauMax){
        let doubled = found * 2;
        for (let tau = Math.max(tauMin, found * 2 - 2);
          tau <= Math.min(tauMax, found * 2 + 2); tau++){
          if (norm[tau] < norm[doubled]) doubled = tau;
        }
        if (norm[doubled] < norm[found] * .25) found = doubled;
      }

      let period = found;
      if (found > tauMin && found < tauMax){
        const s0 = norm[found - 1];
        const s1 = norm[found];
        const s2 = norm[found + 1];
        const denominator = 2 * (2 * s1 - s2 - s0);
        if (denominator !== 0) period = found + (s2 - s0) / denominator;
      }

      const hz = rate / period;
      if (!Number.isFinite(hz) || hz < minHz || hz > maxHz) return null;
      return { hz, clarity:1 - norm[found] };
    };
  }

  root.NepTunerPitch = Object.freeze({
    THRESHOLD,
    FALLBACK,
    createPitchDetector,
    detectPitch:createPitchDetector(),
  });
})(typeof globalThis !== 'undefined' ? globalThis : self);
