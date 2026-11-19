/**
 * HopStop — Multi-Wave Organic Water Ripple Transformation
 * Generates multiple distinct, concentric liquid waves expanding across the viewport.
 * The entire page undulates through multi-harmonic physical water displacement,
 * with layered caustics, traveling wave crests, and cascading droplet ripples.
 */

(function () {
  'use strict';

  // 1. Cascading multi-droplet and water surf audio synthesis
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

      // A. Pink noise water wave wash
      const bufferSize = Math.floor(audioCtx.sampleRate * 1.1);
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
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.042;
        b6 = white * 0.115926;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.42);
      filter.frequency.exponentialRampToValueAtTime(260, now + 1.05);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.08);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 1.1);

      // B. Cascading droplets: 3 sequential droplets landing on water
      const drops = [
        { time: 0.00, startF: 660, midF: 320, endF: 520, gain: 0.075 },
        { time: 0.14, startF: 820, midF: 440, endF: 680, gain: 0.060 },
        { time: 0.28, startF: 540, midF: 260, endF: 420, gain: 0.045 }
      ];

      drops.forEach(d => {
        const t = now + d.time;
        const osc = audioCtx.createOscillator();
        const dropGain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(d.startF, t);
        osc.frequency.exponentialRampToValueAtTime(d.midF, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(d.endF, t + 0.2);

        dropGain.gain.setValueAtTime(0.0001, t);
        dropGain.gain.linearRampToValueAtTime(d.gain, t + 0.025);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);

        osc.connect(dropGain);
        dropGain.connect(audioCtx.destination);

        osc.start(t);
        osc.stop(t + 0.25);
      });
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
          <filter id="hopstopWaterFilter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
            <feTurbulence id="hopstopWaterTurb" type="fractalNoise" baseFrequency="0.018 0.025" numOctaves="3" result="liquidNoise" seed="23" />
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

  // 3. Main Multi-Wave Water Ripple Transformation Controller
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

    // Tactile feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([15, 40, 12, 40, 10]); } catch (_) {}
    }
    playMultiWaterWaveSound();

    // Liquid multi-pulse on button
    const toggleBtn = document.getElementById('themeToggle') || document.querySelector('.theme-landscape-toggle');
    if (toggleBtn) {
      toggleBtn.classList.remove('tlt-water-ripple-active');
      void toggleBtn.offsetWidth;
      toggleBtn.classList.add('tlt-water-ripple-active');
      setTimeout(() => toggleBtn.classList.remove('tlt-water-ripple-active'), 1200);
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const endRadius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 50;
    const DURATION = 1180; // ms for full multi-wave propagation and settling
    const isDark = newTheme === 'dark';

    // 4. Setup Water Caustic & Multi-Wave Canvas Overlay
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

    // Apply fluid water filter to viewport
    document.documentElement.classList.add('theme-water-submerged');

    const startTime = performance.now();
    let animId = null;

    // Palette for water waves & specular highlights
    const causticTheme = isDark
      ? {
          crest: 'rgba(56, 189, 248, ',     // vibrant cyan
          glow: 'rgba(14, 165, 233, ',      // oceanic blue
          caustic: 'rgba(125, 211, 252, ',  // light refraction
          specular: 'rgba(255, 255, 255, '
        }
      : {
          crest: 'rgba(251, 191, 36, ',     // warm sunny amber
          glow: 'rgba(245, 158, 11, ',      // golden honey
          caustic: 'rgba(254, 240, 138, ',  // sunny caustics
          specular: 'rgba(255, 255, 255, '
        };

    // Configuration of 5 Consecutive Traveling Water Waves
    // Each wave launches with a small time offset, creating the distinct multi-wave train
    const WAVE_SERIES = [
      { delay: 0,   weight: 1.00, width: 4.5, glowWidth: 26 }, // Primary leading wave
      { delay: 130, weight: 0.85, width: 3.8, glowWidth: 20 }, // 2nd ripple wave
      { delay: 260, weight: 0.70, width: 3.2, glowWidth: 16 }, // 3rd ripple wave
      { delay: 390, weight: 0.52, width: 2.6, glowWidth: 12 }, // 4th ripple wave
      { delay: 520, weight: 0.35, width: 2.0, glowWidth: 8  }  // 5th trailing wave
    ];

    function renderMultiWaterWaves(now) {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / DURATION);

      // A. Multi-Harmonic Physical Water Displacement on Page Elements:
      // Generates 4 oscillating liquid wave cycles that swell and decay smoothly
      const waveCycle = Math.sin(p * Math.PI * 4.2);
      const envelope = Math.sin(p * Math.PI) * Math.pow(1 - p, 0.5);
      const waveDisplacement = Math.abs(waveCycle * envelope * 46);

      if (disp) {
        disp.setAttribute('scale', waveDisplacement.toFixed(2));
      }

      // Modulate liquid surface frequencies dynamically as waves travel
      if (turb) {
        const freqX = (0.016 + Math.sin(p * Math.PI * 5) * 0.007).toFixed(4);
        const freqY = (0.024 + Math.cos(p * Math.PI * 4) * 0.008).toFixed(4);
        turb.setAttribute('baseFrequency', `${freqX} ${freqY}`);
      }

      // B. Render Multi-Wavefront Train & Caustics
      ctx.clearRect(0, 0, w, h);

      // Draw subtle organic swimming pool water caustics
      if (p < 0.9) {
        const causticAlpha = Math.sin(p * Math.PI) * 0.16;
        const step = 85;
        const timeShift = elapsed * 0.0028;
        ctx.save();
        for (let cx = 0; cx < w; cx += step) {
          for (let cy = 0; cy < h; cy += step) {
            const waveDist = Math.hypot(cx - x, cy - y);
            // Caustic ribbons shimmer along the path of the multiple waves
            const ox = Math.sin(cy * 0.038 + timeShift * 3.2) * 14;
            const oy = Math.cos(cx * 0.038 + timeShift * 3.2) * 14;
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy, 26, 15, (cx + cy) * 0.01, 0, Math.PI * 2);
            ctx.fillStyle = causticTheme.caustic + (causticAlpha * (0.4 + 0.6 * Math.sin(waveDist * 0.015 - timeShift * 5))) + ')';
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // Draw each consecutive expanding water wave in the wave train
      WAVE_SERIES.forEach((wave, idx) => {
        const waveElapsed = elapsed - wave.delay;
        if (waveElapsed <= 0) return;

        // Individual wave progress over ~750ms
        const waveT = Math.min(1, waveElapsed / 780);
        const waveEase = 1 - Math.pow(1 - waveT, 2.8);
        const currentRadius = endRadius * waveEase;
        const waveAlpha = Math.max(0, Math.sin(waveT * Math.PI) * (1 - waveT * 0.38) * wave.weight);

        if (currentRadius > 4 && waveAlpha > 0.01) {
          ctx.save();

          // 1. Outer water wave refraction glow
          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = causticTheme.glow + (waveAlpha * 0.42) + ')';
          ctx.lineWidth = wave.glowWidth;
          ctx.shadowColor = causticTheme.glow + (waveAlpha * 0.75) + ')';
          ctx.shadowBlur = wave.glowWidth * 0.8;
          ctx.stroke();

          // 2. Translucent liquid wave body
          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = causticTheme.crest + (waveAlpha * 0.85) + ')';
          ctx.lineWidth = wave.width * 2.2;
          ctx.stroke();

          // 3. Sharp high-gloss specular water crest highlight
          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = causticTheme.specular + (waveAlpha * 0.95) + ')';
          ctx.lineWidth = wave.width;
          ctx.shadowBlur = 8;
          ctx.stroke();

          // 4. Trailing minor echo ring for each wave
          if (idx === 0 && currentRadius > 40) {
            ctx.beginPath();
            ctx.arc(x, y, currentRadius - 22, 0, Math.PI * 2);
            ctx.strokeStyle = causticTheme.crest + (waveAlpha * 0.45) + ')';
            ctx.lineWidth = 2.2;
            ctx.stroke();
          }

          ctx.restore();
        }
      });

      // C. Droplet Impact Concentric Origin Rings (0ms -> 450ms)
      if (p < 0.45) {
        const dropT = p / 0.45;
        ctx.save();
        [0, 0.12, 0.24].forEach((dropDelay, i) => {
          const subT = Math.max(0, dropT - dropDelay);
          if (subT > 0 && subT <= 1) {
            const dropR = 10 + subT * 85;
            const dropAlpha = (1 - subT) * (0.75 - i * 0.18);
            ctx.beginPath();
            ctx.arc(x, y, dropR, 0, Math.PI * 2);
            ctx.strokeStyle = causticTheme.specular + dropAlpha + ')';
            ctx.lineWidth = 2.4 * (1 - subT * 0.4);
            ctx.shadowColor = causticTheme.crest + (dropAlpha * 0.8) + ')';
            ctx.shadowBlur = 10;
            ctx.stroke();
          }
        });
        ctx.restore();
      }

      if (p < 1) {
        animId = requestAnimationFrame(renderMultiWaterWaves);
      } else {
        // Complete transition: calm the water completely
        ctx.clearRect(0, 0, w, h);
        if (disp) disp.setAttribute('scale', '0');
        document.documentElement.classList.remove('theme-water-submerged');
      }
    }

    // Start multi-wave animation loop
    animId = requestAnimationFrame(renderMultiWaterWaves);

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
            duration: 860,
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
        transition: clip-path 860ms cubic-bezier(0.25, 1, 0.35, 1), opacity 240ms ease ${DURATION - 200}ms;
      `;
      document.body.appendChild(fallbackOverlay);

      requestAnimationFrame(() => {
        fallbackOverlay.style.clipPath = `circle(${endRadius}px at ${x}px ${y}px)`;
      });

      setTimeout(() => {
        onThemeApply(newTheme);
      }, 400);

      setTimeout(() => {
        fallbackOverlay.style.opacity = '0';
        setTimeout(() => fallbackOverlay.remove(), 260);
      }, DURATION);
    }
  };
})();
