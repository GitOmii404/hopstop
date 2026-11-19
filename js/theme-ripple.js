/**
 * HopStop — Organic Liquid Water Transformation Theme Transition
 * Makes the entire page physically ripple, bend, and wave like real water during the theme transition.
 * Combines SVG fluid displacement mapping, traveling liquid waves, water surface caustics, and View Transitions.
 */

(function () {
  'use strict';

  // 1. Synthetic organic water surf & droplet splash audio via Web Audio API
  let audioCtx = null;
  function playWaterWaveSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;

      // A. Pink noise water wave wash
      const bufferSize = audioCtx.sampleRate * 0.8;
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

      // Lowpass filter for deep soothing water wash
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);
      filter.frequency.exponentialRampToValueAtTime(1100, now + 0.35);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.8);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.07, now + 0.12);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.78);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.8);

      // B. Resonant water drop glissando
      const osc = audioCtx.createOscillator();
      const dropGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.22);

      dropGain.gain.setValueAtTime(0.001, now);
      dropGain.gain.linearRampToValueAtTime(0.065, now + 0.03);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(dropGain);
      dropGain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (_) {
      // Audio autoplay restrictions or unsupported
    }
  }

  // 2. Ensure SVG Fluid Displacement Filter is in the document
  function ensureWaterFilter() {
    let svg = document.getElementById('hopstopWaterSvg');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'hopstopWaterSvg';
      svg.setAttribute('style', 'position:fixed;width:0;height:0;left:-9999px;top:-9999px;pointer-events:none;');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = `
        <defs>
          <filter id="hopstopWaterFilter" x="-15%" y="-15%" width="130%" height="130%" filterUnits="objectBoundingBox">
            <feTurbulence id="hopstopWaterTurb" type="fractalNoise" baseFrequency="0.016 0.024" numOctaves="3" result="liquidNoise" seed="14" />
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

  // 3. Main Water Ripple Theme Transformation Controller
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

    // Gentle tactile feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(14); } catch (_) {}
    }
    playWaterWaveSound();

    // Animate button with liquid pulse
    const toggleBtn = document.getElementById('themeToggle') || document.querySelector('.theme-landscape-toggle');
    if (toggleBtn) {
      toggleBtn.classList.remove('tlt-water-ripple-active');
      void toggleBtn.offsetWidth;
      toggleBtn.classList.add('tlt-water-ripple-active');
      setTimeout(() => toggleBtn.classList.remove('tlt-water-ripple-active'), 900);
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const endRadius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 40;
    const DURATION = 960; // ms
    const isDark = newTheme === 'dark';

    // 4. Setup Water Caustic & Surface Wave Canvas Overlay
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

    // Turn whole page into liquid water: apply filter class
    document.documentElement.classList.add('theme-water-submerged');

    const startTime = performance.now();
    let animId = null;

    // Caustic color themes
    const causticTheme = isDark
      ? {
          crest: 'rgba(56, 189, 248, ',   // ocean cyan
          glow: 'rgba(14, 165, 233, ',
          caustic: 'rgba(125, 211, 252, ',
          specular: 'rgba(255, 255, 255, '
        }
      : {
          crest: 'rgba(251, 191, 36, ',   // golden amber
          glow: 'rgba(245, 158, 11, ',
          caustic: 'rgba(254, 240, 138, ',
          specular: 'rgba(255, 255, 255, '
        };

    function renderWaterLiquidFrame(now) {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / DURATION);

      // A. Physical water displacement scale:
      // Swells up to ~40px displacement (making all page elements wobble and bend like water),
      // ripples through harmonic decay, then gently flattens to 0.
      const waveDisplacement = Math.sin(p * Math.PI) * Math.max(0, 1 - p * 0.45) * 40;
      if (disp) {
        disp.setAttribute('scale', waveDisplacement.toFixed(2));
      }

      // B. Animate traveling liquid frequencies (simulates wave propagation across the page)
      if (turb) {
        const freqX = (0.015 + Math.sin(p * Math.PI * 3.5) * 0.006).toFixed(4);
        const freqY = (0.022 + Math.cos(p * Math.PI * 3.0) * 0.007).toFixed(4);
        turb.setAttribute('baseFrequency', `${freqX} ${freqY}`);
      }

      // C. Render water surface caustics & wave boundary on canvas
      ctx.clearRect(0, 0, w, h);

      // Expanding wavefront radius using smooth water easing
      const waveEase = 1 - Math.pow(1 - p, 3);
      const currentRadius = endRadius * waveEase;
      const waveAlpha = Math.max(0, Math.sin(p * Math.PI) * (1 - p * 0.3));

      if (currentRadius > 6 && waveAlpha > 0.01) {
        ctx.save();

        // 1. Full-screen subtle water caustic network (pool water reflection)
        const causticAlpha = waveAlpha * 0.18;
        ctx.fillStyle = causticTheme.caustic + causticAlpha + ')';
        // Organic swimming pool light ribbon caustic grid
        const step = 80;
        const timeShift = elapsed * 0.003;
        for (let cx = 0; cx < w; cx += step) {
          for (let cy = 0; cy < h; cy += step) {
            const waveDist = Math.hypot(cx - x, cy - y);
            // Caustics are strongest right near the traveling wave boundary
            const distFromWave = Math.abs(waveDist - currentRadius);
            if (distFromWave < 280) {
              const localAlpha = (1 - distFromWave / 280) * causticAlpha;
              const ox = Math.sin(cy * 0.04 + timeShift * 3) * 12;
              const oy = Math.cos(cx * 0.04 + timeShift * 3) * 12;
              ctx.beginPath();
              ctx.ellipse(cx + ox, cy + oy, 24, 14, (cx + cy) * 0.01, 0, Math.PI * 2);
              ctx.fillStyle = causticTheme.caustic + localAlpha + ')';
              ctx.fill();
            }
          }
        }

        // 2. High-gloss traveling water wave boundary
        // Soft outer glow of the water wave
        ctx.beginPath();
        ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = causticTheme.glow + (waveAlpha * 0.45) + ')';
        ctx.lineWidth = 22;
        ctx.shadowColor = causticTheme.glow + (waveAlpha * 0.8) + ')';
        ctx.shadowBlur = 24;
        ctx.stroke();

        // Sharp shimmering specular water crest
        ctx.beginPath();
        ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = causticTheme.specular + (waveAlpha * 0.95) + ')';
        ctx.lineWidth = 3.6;
        ctx.shadowBlur = 10;
        ctx.stroke();

        // Secondary and tertiary liquid wave ripples trailing behind
        const echo1 = currentRadius - 32 * (1 - waveEase * 0.25);
        if (echo1 > 10) {
          ctx.beginPath();
          ctx.arc(x, y, echo1, 0, Math.PI * 2);
          ctx.strokeStyle = causticTheme.crest + (waveAlpha * 0.6) + ')';
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        const echo2 = currentRadius - 68 * (1 - waveEase * 0.35);
        if (echo2 > 15) {
          ctx.beginPath();
          ctx.arc(x, y, echo2, 0, Math.PI * 2);
          ctx.strokeStyle = causticTheme.crest + (waveAlpha * 0.35) + ')';
          ctx.lineWidth = 2.4;
          ctx.stroke();
        }

        ctx.restore();
      }

      if (p < 1) {
        animId = requestAnimationFrame(renderWaterLiquidFrame);
      } else {
        // Complete transition: calm the water completely
        ctx.clearRect(0, 0, w, h);
        if (disp) disp.setAttribute('scale', '0');
        document.documentElement.classList.remove('theme-water-submerged');
      }
    }

    // Start water physics loop
    animId = requestAnimationFrame(renderWaterLiquidFrame);

    // 5. Apply the Theme via View Transitions API or Fallback
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        onThemeApply(newTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
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
        transition: clip-path ${DURATION}ms cubic-bezier(0.25, 1, 0.35, 1), opacity 220ms ease ${DURATION - 160}ms;
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
        setTimeout(() => fallbackOverlay.remove(), 250);
      }, DURATION);
    }
  };
})();
