/**
 * HopStop — Seamless Multi-Wave Water Ripple Theme Transition
 * Synchronizes multi-wave liquid surface displacement, traveling wavefronts,
 * and View Transitions with exact mathematical cubic-bezier alignment for 100% seamless fluid transitions.
 */

(function () {
  'use strict';

  // 1. Analytical Cubic Bezier Solver (exact match for CSS cubic-bezier(0.25, 1, 0.35, 1))
  function solveCubicBezier(t, p1x = 0.25, p1y = 1.0, p2x = 0.35, p2y = 1.0) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    // 6 iterations of Newton-Raphson to solve for parametric u given x = t
    for (let i = 0; i < 6; i++) {
      const currentX = 3 * (1 - u) * (1 - u) * u * p1x + 3 * (1 - u) * u * u * p2x + u * u * u;
      const dx = 3 * (1 - u) * (1 - u) * p1x + 6 * (1 - u) * u * (p2x - p1x) + 3 * u * u * (1 - p2x);
      if (Math.abs(dx) < 1e-6) break;
      u -= (currentX - t) / dx;
      u = Math.max(0, Math.min(1, u));
    }
    return 3 * (1 - u) * (1 - u) * u * p1y + 3 * (1 - u) * u * u * p2y + u * u * u;
  }

  // 2. Cascading multi-droplet and water wave audio synthesis via Web Audio API
  let audioCtx = null;
  function playMultiWaterWaveSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;

      // Soft water wave surf wash (filtered pink noise)
      const bufferSize = Math.floor(audioCtx.sampleRate * 1.0);
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.038;
        b6 = white * 0.115926;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, now);
      filter.frequency.exponentialRampToValueAtTime(1150, now + 0.38);
      filter.frequency.exponentialRampToValueAtTime(260, now + 0.95);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.07, now + 0.14);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.98);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 1.0);

      // Cascading drops: 3 sequential droplets landing on water
      const drops = [
        { delay: 0.00, startF: 660, midF: 340, endF: 520, gain: 0.065 },
        { delay: 0.12, startF: 800, midF: 420, endF: 640, gain: 0.050 },
        { delay: 0.25, startF: 540, midF: 280, endF: 440, gain: 0.040 }
      ];

      drops.forEach(d => {
        const t = now + d.delay;
        const osc = audioCtx.createOscillator();
        const dropGain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(d.startF, t);
        osc.frequency.exponentialRampToValueAtTime(d.midF, t + 0.07);
        osc.frequency.exponentialRampToValueAtTime(d.endF, t + 0.18);

        dropGain.gain.setValueAtTime(0.0001, t);
        dropGain.gain.linearRampToValueAtTime(d.gain, t + 0.02);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

        osc.connect(dropGain);
        dropGain.connect(audioCtx.destination);

        osc.start(t);
        osc.stop(t + 0.24);
      });
    } catch (_) {}
  }

  // 3. Ensure SVG Fluid Displacement Filter is in the document
  function ensureWaterFilter() {
    let svg = document.getElementById('hopstopWaterSvg');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'hopstopWaterSvg';
      svg.setAttribute('style', 'position:fixed;width:0;height:0;left:-9999px;top:-9999px;pointer-events:none;');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = `
        <defs>
          <filter id="hopstopWaterFilter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
            <feTurbulence id="hopstopWaterTurb" type="fractalNoise" baseFrequency="0.016 0.022" numOctaves="2" result="liquidNoise" seed="18" />
            <feDisplacementMap id="hopstopWaterDisp" in="SourceGraphic" in2="liquidNoise" scale="0" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          </filter>
        </defs>
      `;
      document.body.appendChild(svg);
    }
    return {
      disp: document.getElementById('hopstopWaterDisp'),
      turb: document.getElementById('hopstopWaterTurb')
    };
  }

  // 4. Seamless Water Ripple Theme Controller
  window.triggerWaterRippleTheme = function (event, newTheme, onThemeApply) {
    const { disp, turb } = ensureWaterFilter();

    // Determine click coordinate origin (x, y)
    const evt = event || window.event;
    let x, y;
    if (evt && typeof evt.clientX === 'number' && evt.clientX > 0) {
      x = evt.clientX;
      y = evt.clientY;
    } else {
      const toggleBtn = document.getElementById('themeToggle') || document.querySelector('.theme-landscape-toggle');
      if (toggleBtn) {
        const rect = toggleBtn.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
      }
    }

    // Tactile & audio immersion
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([14, 35, 10, 35, 8]); } catch (_) {}
    }
    playMultiWaterWaveSound();

    // Liquid button pulse
    const toggleBtn = document.getElementById('themeToggle') || document.querySelector('.theme-landscape-toggle');
    if (toggleBtn) {
      toggleBtn.classList.remove('tlt-water-ripple-active');
      void toggleBtn.offsetWidth;
      toggleBtn.classList.add('tlt-water-ripple-active');
      setTimeout(() => toggleBtn.classList.remove('tlt-water-ripple-active'), 1000);
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    // Extra margin so circular clip completely clears screen corners without clipping artifacts
    const endRadius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 30;
    
    // Exact synchronized duration for both View Transition and Canvas
    const DURATION = 920; // ms
    const isDark = newTheme === 'dark';

    // 5. Setup Water Caustic & Multi-Wave Canvas Overlay
    let canvas = document.getElementById('themeWaterRippleCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'themeWaterRippleCanvas';
      canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999999;';
      document.body.appendChild(canvas);
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const startTime = performance.now();
    let animId = null;

    // Palette for water waves & specular highlights
    const causticTheme = isDark
      ? {
          crest: 'rgba(56, 189, 248, ',     // vibrant sky cyan
          glow: 'rgba(14, 165, 233, ',      // deep oceanic cyan
          caustic: 'rgba(125, 211, 252, ',  // light refraction
          specular: 'rgba(255, 255, 255, '
        }
      : {
          crest: 'rgba(251, 191, 36, ',     // warm sunny amber
          glow: 'rgba(245, 158, 11, ',      // golden honey
          caustic: 'rgba(254, 240, 138, ',  // honey caustics
          specular: 'rgba(255, 255, 255, '
        };

    // Train of 4 consecutive ripples:
    // Wave 0 is the primary wave that exactly covers the theme clip-path edge!
    const WAVE_SERIES = [
      { delay: 0,   weight: 1.00, width: 4.0, glowWidth: 28 }, // Primary leading wave (covers clip-path boundary)
      { delay: 110, weight: 0.78, width: 3.2, glowWidth: 18 }, // 2nd ripple wave
      { delay: 220, weight: 0.58, width: 2.6, glowWidth: 14 }, // 3rd ripple wave
      { delay: 340, weight: 0.38, width: 2.0, glowWidth: 10 }  // 4th ripple wave
    ];

    function renderSeamlessWaterWaves(now) {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / DURATION);

      // A. Multi-Harmonic Physical Water Displacement on Page Elements:
      // Tapers smoothly to EXACTLY 0.00 at p = 1.0 using continuous envelope (zero snap/pop)
      const waveCycle = Math.sin(p * Math.PI * 3.5);
      const envelope = Math.sin(p * Math.PI) * Math.pow(1 - p, 0.75);
      const waveDisplacement = Math.abs(waveCycle * envelope * 32);

      if (disp) {
        disp.setAttribute('scale', waveDisplacement.toFixed(2));
      }

      // Smooth wave frequency modulation
      if (turb) {
        const freqX = (0.016 + Math.sin(p * Math.PI * 3) * 0.004).toFixed(4);
        const freqY = (0.022 + Math.cos(p * Math.PI * 2.5) * 0.005).toFixed(4);
        turb.setAttribute('baseFrequency', `${freqX} ${freqY}`);
      }

      ctx.clearRect(0, 0, w, h);

      // B. Ambient Swimming Pool Water Caustics Shimmer
      if (p < 0.85) {
        const causticAlpha = Math.sin(p * Math.PI) * 0.13;
        const step = 90;
        const timeShift = elapsed * 0.0025;
        ctx.save();
        for (let cx = 0; cx < w; cx += step) {
          for (let cy = 0; cy < h; cy += step) {
            const ox = Math.sin(cy * 0.035 + timeShift * 3) * 12;
            const oy = Math.cos(cx * 0.035 + timeShift * 3) * 12;
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy, 26, 14, (cx + cy) * 0.01, 0, Math.PI * 2);
            ctx.fillStyle = causticTheme.caustic + (causticAlpha * (0.5 + 0.5 * Math.sin((cx + cy) * 0.01 - timeShift * 4))) + ')';
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // C. Render Multi-Wavefront Train
      WAVE_SERIES.forEach((wave, idx) => {
        const waveElapsed = elapsed - wave.delay;
        if (waveElapsed <= 0) return;

        // Uses the EXACT cubic bezier solver so Wave 0 radius matches CSS clip-path to the sub-pixel!
        const waveT = Math.min(1, waveElapsed / (DURATION - wave.delay));
        const waveEase = solveCubicBezier(waveT, 0.25, 1.0, 0.35, 1.0);
        const currentRadius = endRadius * waveEase;
        const waveAlpha = Math.max(0, Math.sin(waveT * Math.PI) * (1 - waveT * 0.4) * wave.weight);

        if (currentRadius > 3 && waveAlpha > 0.01) {
          ctx.save();

          // 1. Refraction band (envelopes the theme boundary line seamlessly)
          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = causticTheme.glow + (waveAlpha * 0.45) + ')';
          ctx.lineWidth = wave.glowWidth;
          ctx.shadowColor = causticTheme.glow + (waveAlpha * 0.8) + ')';
          ctx.shadowBlur = wave.glowWidth * 0.7;
          ctx.stroke();

          // 2. Translucent liquid wave body
          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = causticTheme.crest + (waveAlpha * 0.88) + ')';
          ctx.lineWidth = wave.width * 2.2;
          ctx.stroke();

          // 3. Specular water crest highlight
          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = causticTheme.specular + (waveAlpha * 0.95) + ')';
          ctx.lineWidth = wave.width;
          ctx.shadowBlur = 6;
          ctx.stroke();

          ctx.restore();
        }
      });

      // D. Droplet Concentric Impact Rings (First 350ms)
      if (p < 0.4) {
        const dropT = p / 0.4;
        ctx.save();
        [0, 0.1, 0.2].forEach((dropDelay, i) => {
          const subT = Math.max(0, dropT - dropDelay);
          if (subT > 0 && subT <= 1) {
            const dropR = 8 + subT * 70;
            const dropAlpha = (1 - subT) * (0.7 - i * 0.18);
            ctx.beginPath();
            ctx.arc(x, y, dropR, 0, Math.PI * 2);
            ctx.strokeStyle = causticTheme.specular + dropAlpha + ')';
            ctx.lineWidth = 2.2 * (1 - subT * 0.4);
            ctx.shadowColor = causticTheme.crest + (dropAlpha * 0.7) + ')';
            ctx.shadowBlur = 8;
            ctx.stroke();
          }
        });
        ctx.restore();
      }

      if (p < 1) {
        animId = requestAnimationFrame(renderSeamlessWaterWaves);
      } else {
        // Complete transition: calm the water completely with zero snap
        ctx.clearRect(0, 0, w, h);
        if (disp) disp.setAttribute('scale', '0');
      }
    }

    // Start synchronized animation loop
    animId = requestAnimationFrame(renderSeamlessWaterWaves);

    // 6. View Transitions API Execution (Harmonized Easing & Duration)
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        onThemeApply(newTheme);
      });

      transition.ready.then(() => {
        const anim = document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: DURATION,
            easing: 'cubic-bezier(0.25, 1, 0.35, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );

        anim.onfinish = () => {
          // Perfectly clean landing: zero residual filter
          if (disp) disp.setAttribute('scale', '0');
        };
      });
    } else {
      // Fallback for non-supporting browsers
      const fallbackOverlay = document.createElement('div');
      fallbackOverlay.id = 'themeFallbackRipple';
      fallbackOverlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 999999;
        pointer-events: none;
        background-color: ${isDark ? '#0b0f19' : '#f8fafc'};
        clip-path: circle(0px at ${x}px ${y}px);
        transition: clip-path ${DURATION}ms cubic-bezier(0.25, 1, 0.35, 1), opacity 200ms ease ${DURATION - 180}ms;
      `;
      document.body.appendChild(fallbackOverlay);

      requestAnimationFrame(() => {
        fallbackOverlay.style.clipPath = `circle(${endRadius}px at ${x}px ${y}px)`;
      });

      setTimeout(() => {
        onThemeApply(newTheme);
      }, DURATION * 0.45);

      setTimeout(() => {
        fallbackOverlay.style.opacity = '0';
        setTimeout(() => fallbackOverlay.remove(), 220);
      }, DURATION);
    }
  };
})();
