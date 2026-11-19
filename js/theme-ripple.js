/**
 * HopStop — Organic Water Ripple Theme Transition
 * Creates a fluid, water-droplet shockwave & circular ripple that travels across the viewport,
 * revealing the new theme (Light / Dark) seamlessly along the expanding wavefront.
 */

(function () {
  'use strict';

  // Audio synthesis: Organic subtle water droplet sound using Web Audio API
  let audioCtx = null;
  function playWaterDropSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Pitch glide: starting high, dropping, then a bubbly resonating rise
      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch (_) {
      // Audio not permitted or not supported, ignore silently
    }
  }

  // Smooth cubic ease for water wave propagation
  function easeWater(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  window.triggerWaterRippleTheme = function (event, newTheme, onThemeApply) {
    // 1. Determine origin coordinate (x, y)
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
      try { navigator.vibrate(12); } catch (_) {}
    }
    playWaterDropSound();

    // 2. Animate the toggle button with a liquid ripple pulse
    const toggleBtn = document.getElementById('themeToggle') || document.querySelector('.theme-landscape-toggle');
    if (toggleBtn) {
      toggleBtn.classList.remove('tlt-water-ripple-active');
      // Trigger reflow
      void toggleBtn.offsetWidth;
      toggleBtn.classList.add('tlt-water-ripple-active');
      setTimeout(() => toggleBtn.classList.remove('tlt-water-ripple-active'), 800);
    }

    // 3. Compute maximum radius from origin to farthest corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    ) + 30;

    const DURATION = 780; // ms
    const isDark = newTheme === 'dark';

    // 4. Setup full-screen Canvas for the water ripple wave-front
    let canvas = document.getElementById('themeWaterRippleCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'themeWaterRippleCanvas';
      canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999999;';
      document.body.appendChild(canvas);
    }

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Color definitions for water wave-front & caustics
    // When going to dark: oceanic twilight cyan/aquamarine water with specular crystal glow
    // When going to light: sunlit golden amber water with sparkling honey caustics
    const waveTheme = isDark
      ? {
          crest: 'rgba(56, 189, 248, ', // sky cyan
          crestGlow: 'rgba(14, 165, 233, ', // deep sky
          innerShadow: 'rgba(3, 7, 18, ', // dark water trough
          specular: 'rgba(255, 255, 255, ',
          ambient: 'rgba(56, 189, 248, 0.15)'
        }
      : {
          crest: 'rgba(251, 191, 36, ', // warm amber
          crestGlow: 'rgba(245, 158, 11, ', // golden amber
          innerShadow: 'rgba(120, 53, 15, ', // amber trough
          specular: 'rgba(255, 255, 255, ',
          ambient: 'rgba(251, 191, 36, 0.18)'
        };

    const startTime = performance.now();
    let animationFrameId = null;

    function renderWaterWaves(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / DURATION);
      const progress = easeWater(t);
      const currentRadius = endRadius * progress;

      ctx.clearRect(0, 0, w, h);

      // 1. Initial droplet ripples blooming at origin (0ms -> 380ms)
      if (t < 0.5) {
        const dropT = t / 0.5;
        const dropAlpha = (1 - dropT) * 0.7;
        const dropRadius = 8 + dropT * 75;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, dropRadius, 0, Math.PI * 2);
        ctx.strokeStyle = waveTheme.crest + dropAlpha + ')';
        ctx.lineWidth = 3.5 * (1 - dropT * 0.5);
        ctx.shadowColor = waveTheme.crest + (dropAlpha * 0.8) + ')';
        ctx.shadowBlur = 10;
        ctx.stroke();

        if (dropRadius > 20) {
          ctx.beginPath();
          ctx.arc(x, y, dropRadius * 0.58, 0, Math.PI * 2);
          ctx.strokeStyle = waveTheme.specular + (dropAlpha * 0.6) + ')';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Main Traveling Water Wave Crest (The boundary that shifts the world)
      if (currentRadius > 4) {
        const waveAlpha = Math.max(0, 1 - Math.pow(t, 2.2)); // Fades out gently as it reaches outer edges

        ctx.save();

        // A. Subtle water refraction band ahead of the crest
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0, currentRadius + 6), 0, Math.PI * 2);
        ctx.strokeStyle = waveTheme.crestGlow + (waveAlpha * 0.35) + ')';
        ctx.lineWidth = 14;
        ctx.shadowColor = waveTheme.crestGlow + (waveAlpha * 0.6) + ')';
        ctx.shadowBlur = 18;
        ctx.stroke();

        // B. Sharp high-gloss liquid wave crest (Specular highlight)
        ctx.beginPath();
        ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = waveTheme.specular + (waveAlpha * 0.88) + ')';
        ctx.lineWidth = 3.8;
        ctx.stroke();

        // C. Core water crest body with luminous color
        ctx.beginPath();
        ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = waveTheme.crest + (waveAlpha * 0.95) + ')';
        ctx.lineWidth = 7.5;
        ctx.stroke();

        // D. Secondary trailing echo wave (28px behind)
        const echo1R = currentRadius - 28 * (1 - progress * 0.25);
        if (echo1R > 8) {
          const echo1Alpha = waveAlpha * 0.55;
          ctx.beginPath();
          ctx.arc(x, y, echo1R, 0, Math.PI * 2);
          ctx.strokeStyle = waveTheme.crest + echo1Alpha + ')';
          ctx.lineWidth = 3.2;
          ctx.shadowBlur = 8;
          ctx.stroke();
        }

        // E. Tertiary trailing echo wave (58px behind)
        const echo2R = currentRadius - 58 * (1 - progress * 0.35);
        if (echo2R > 12) {
          const echo2Alpha = waveAlpha * 0.32;
          ctx.beginPath();
          ctx.arc(x, y, echo2R, 0, Math.PI * 2);
          ctx.strokeStyle = waveTheme.crestGlow + echo2Alpha + ')';
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }

        ctx.restore();
      }

      if (t < 1) {
        animationFrameId = requestAnimationFrame(renderWaterWaves);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }

    // Start wave physics on canvas
    animationFrameId = requestAnimationFrame(renderWaterWaves);

    // 5. Apply the Theme via View Transitions API or Fallback
    if (document.startViewTransition) {
      // Modern standards path: View Transitions API captures the DOM snapshot
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
      // Fallback path for browsers without View Transitions API
      // Create a full-screen water overlay that reveals the new theme color
      const fallbackOverlay = document.createElement('div');
      fallbackOverlay.id = 'themeFallbackRipple';
      fallbackOverlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 999999;
        pointer-events: none;
        background-color: ${isDark ? '#0b0f19' : '#f8fafc'};
        clip-path: circle(0px at ${x}px ${y}px);
        transition: clip-path ${DURATION}ms cubic-bezier(0.25, 1, 0.35, 1), opacity 200ms ease ${DURATION - 150}ms;
      `;
      document.body.appendChild(fallbackOverlay);

      // Trigger clip-path expansion
      requestAnimationFrame(() => {
        fallbackOverlay.style.clipPath = `circle(${endRadius}px at ${x}px ${y}px)`;
      });

      // Switch theme halfway through expansion
      setTimeout(() => {
        onThemeApply(newTheme);
      }, DURATION * 0.45);

      // Clean up fallback overlay
      setTimeout(() => {
        fallbackOverlay.style.opacity = '0';
        setTimeout(() => fallbackOverlay.remove(), 250);
      }, DURATION);
    }
  };
})();
