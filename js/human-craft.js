/**
 * HopStop — Human-Crafted Interactive Magic & Tactile Micro-Interactions
 * Brings warmth, surprise, sound, 3D tilt, and authentic traveler vibes.
 */

(function() {
  'use strict';

  // 1. Dual-Engine Audio Player for Wanderlust Ambience
  // Primary: Crystal-clear 24s lossless WAV soundtrack (Ocean Surf, Tibetan Bells & Campfire)
  // Secondary: Procedural Web Audio API synthesizer for instant zero-latency feedback
  let nativeAudio = null;
  let audioCtx = null;
  let masterGain = null;
  let isPlayingAudio = false;
  let chimeTimer = null;
  let synthNodes = [];

  function showCustomToast(msg) {
    if (typeof window.showToast === 'function') {
      try { window.showToast(msg); return; } catch (e) {}
    }
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `<span class="toast-icon">✨</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  function getNativeAudio() {
    if (!nativeAudio) {
      nativeAudio = document.getElementById('wanderlustNativeAudio');
      if (!nativeAudio) {
        nativeAudio = document.createElement('audio');
        nativeAudio.id = 'wanderlustNativeAudio';
        nativeAudio.src = 'audio/wanderlust-ambience.wav';
        nativeAudio.loop = true;
        nativeAudio.preload = 'auto';
        document.body.appendChild(nativeAudio);
      }
    }
    return nativeAudio;
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    return audioCtx;
  }

  // Instant tactile chime bell sound (guarantees audible feedback within 50ms)
  function playImmediateChime(freq = 659.25) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2.01, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 2.9);
      osc2.stop(now + 2.9);
    } catch (err) {
      console.warn('Instant chime fallback error:', err);
    }
  }

  // Synthesize procedural ambient backup sound
  function startSynthAmbience() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.4);
      masterGain.connect(ctx.destination);

      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.4) * 0.14;
      }

      const waveSource = ctx.createBufferSource();
      waveSource.buffer = noiseBuffer;
      waveSource.loop = true;

      const waveFilter = ctx.createBiquadFilter();
      waveFilter.type = 'bandpass';
      waveFilter.frequency.setValueAtTime(850, ctx.currentTime);
      waveFilter.Q.setValueAtTime(1.2, ctx.currentTime);

      const waveGain = ctx.createGain();
      waveGain.gain.setValueAtTime(0.35, ctx.currentTime);

      waveSource.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(masterGain);

      waveSource.start();
      synthNodes = [waveSource];
    } catch (e) {
      console.warn('Synth ambience error:', e);
    }
  }

  function stopSynthAmbience() {
    if (chimeTimer) {
      clearTimeout(chimeTimer);
      chimeTimer = null;
    }
    if (masterGain && audioCtx) {
      try {
        masterGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        setTimeout(() => {
          synthNodes.forEach(node => {
            try { node.stop(); node.disconnect(); } catch (e) {}
          });
          synthNodes = [];
          if (masterGain) {
            try { masterGain.disconnect(); } catch (e) {}
          }
        }, 250);
      } catch (e) {}
    }
  }

  async function toggleWanderlustAudio() {
    const pill = document.getElementById('wanderlustAudioPill');
    const bars = document.getElementById('soundBars');
    const label = document.getElementById('audioPillLabel');
    const audio = getNativeAudio();

    if (!isPlayingAudio) {
      isPlayingAudio = true;

      // 1. Play immediate welcoming Tibetan chime for instant audible feedback
      playImmediateChime(659.25); // E5 Bell
      setTimeout(() => {
        if (isPlayingAudio) playImmediateChime(880.00); // A5 Bell
      }, 350);

      // 2. Play high-fidelity studio ambient soundtrack
      try {
        audio.volume = 0.85;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('Native HTML5 audio blocked/failed, starting procedural synth:', err);
            startSynthAmbience();
          });
        }
      } catch (err) {
        console.warn('Native audio play threw error, using synth:', err);
        startSynthAmbience();
      }

      // 3. Update UI states
      if (pill) pill.classList.add('playing');
      if (bars) bars.classList.remove('paused');
      if (label) label.textContent = 'Pause Wanderlust Ambience';

      showCustomToast('🎧 Playing Wanderlust Ambience (Ocean surf, breeze & Tibetan bells)');
    } else {
      // Pause audio
      isPlayingAudio = false;

      try {
        audio.pause();
      } catch (e) {}

      stopSynthAmbience();

      if (pill) pill.classList.remove('playing');
      if (bars) bars.classList.add('paused');
      if (label) label.textContent = 'Play Wanderlust Ambience';

      showCustomToast('🔇 Wanderlust Ambience paused');
    }
  }

  // 2. Surprise Teleport to Random Secret Stop
  window.teleportRandomGem = function() {
    if (typeof scrollToMap === 'function') {
      scrollToMap();
    } else {
      const mapEl = document.getElementById('mapSection');
      if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      // Find stops from global data or markers
      const stops = window.HOPSTOP_DATA || [];
      if (stops.length > 0) {
        const randomStop = stops[Math.floor(Math.random() * stops.length)];
        if (window.hopstopMap && randomStop.coords) {
          window.hopstopMap.flyTo(randomStop.coords, 12, {
            animate: true,
            duration: 1.8
          });

          // Open popup after fly animation
          setTimeout(() => {
            if (window.mapMarkers) {
              const marker = window.mapMarkers.find(m => m.stopId === randomStop.id);
              if (marker && marker.leafletMarker) {
                marker.leafletMarker.openPopup();
              }
            }
          }, 1900);
        }

        if (typeof showToast === 'function') {
          showToast(`🎲 Teleported to ${randomStop.title} (${randomStop.location})! ✨`);
        }
        if (typeof triggerConfetti === 'function') {
          triggerConfetti();
        }
      }
    }, 400);
  };

  // 3. Tactile 3D Tilt for Cards on Mouse Movement
  function init3DTilt() {
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.post-card, .hero-stacked-card.pos-0');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        // Only calculate for cards currently in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
          } else {
            // Reset when mouse moves outside
            if (card.style.transform.includes('perspective')) {
              card.style.transform = '';
            }
          }
        }
      });
    });
  }

  // 4. Interactive Sticker Interactions
  function initStickers() {
    document.querySelectorAll('.human-sticker').forEach(sticker => {
      sticker.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = sticker.innerText.trim();
        if (typeof triggerConfetti === 'function') triggerConfetti();
        if (typeof showToast === 'function') {
          showToast(`✨ Traveler Note: "${text}" is verified by our community!`);
        }
      });
    });
  }

  // 5. Setup Ambient Sound Pill Button
  function setupAudioPill() {
    if (window.location.pathname.includes('feed.html') || window.location.href.includes('feed.html')) return;
    if (document.getElementById('wanderlustAudioPill')) return;

    const pill = document.createElement('button');
    pill.id = 'wanderlustAudioPill';
    pill.className = 'wanderlust-audio-pill';
    pill.setAttribute('title', 'Click to toggle relaxing wanderlust audio ambience');
    pill.innerHTML = `
      <div class="sound-bars paused" id="soundBars">
        <span class="sound-bar"></span>
        <span class="sound-bar"></span>
        <span class="sound-bar"></span>
      </div>
      <span id="audioPillLabel">Play Wanderlust Ambience</span>
      <span style="font-size: 0.9rem;">🎧</span>
    `;

    pill.addEventListener('click', toggleWanderlustAudio);
    document.body.appendChild(pill);
  }

  // 6. Expanding 3D Destination Stage Carousel Controls
  function initExpandingStage() {
    const nextBtn = document.getElementById('stageNextBtn');
    const prevBtn = document.getElementById('stagePrevBtn');
    const slide = document.getElementById('hopstopStageSlide');

    if (!slide) return;

    const progressBar = document.getElementById('stageProgressBar');
    const DURATION = 12000; // 12 seconds auto-advance cycle
    const STEP = 100;
    let elapsed = 0;
    let isPaused = false;

    function resetProgress() {
      elapsed = 0;
      if (progressBar) progressBar.style.width = '0%';
    }

    window.hopstopStageNext = function() {
      const items = slide.querySelectorAll('.item');
      if (items.length > 0) {
        slide.appendChild(items[0]);
        resetProgress();
      }
    };

    window.hopstopStagePrev = function() {
      const items = slide.querySelectorAll('.item');
      if (items.length > 0) {
        slide.prepend(items[items.length - 1]);
        resetProgress();
      }
    };

    if (nextBtn) nextBtn.addEventListener('click', window.hopstopStageNext);
    if (prevBtn) prevBtn.addEventListener('click', window.hopstopStagePrev);

    // Clicking any preview card (index 2 onwards) cycles directly to it!
    slide.addEventListener('click', (e) => {
      const clickedItem = e.target.closest('.item');
      if (!clickedItem) return;
      if (e.target.closest('button, a')) return;
      
      const items = Array.from(slide.querySelectorAll('.item'));
      const index = items.indexOf(clickedItem);
      if (index >= 2) {
        for (let i = 0; i < index - 1; i++) {
          slide.appendChild(slide.querySelector('.item'));
        }
        resetProgress();
      }
    });

    // Auto-advance loop every 12 seconds with live progress bar
    setInterval(() => {
      if (!isPaused) {
        elapsed += STEP;
        const pct = Math.min((elapsed / DURATION) * 100, 100);
        if (progressBar) progressBar.style.width = `${pct}%`;

        if (elapsed >= DURATION) {
          window.hopstopStageNext();
        }
      }
    }, STEP);

    const container = document.querySelector('.hopstop-stage-container');
    if (container) {
      container.addEventListener('mouseenter', () => {
        isPaused = true;
      });
      container.addEventListener('mouseleave', () => {
        isPaused = false;
      });
    }
  }

  // 7. Init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init3DTilt();
      initStickers();
      setupAudioPill();
      initExpandingStage();
    });
  } else {
    init3DTilt();
    initStickers();
    setupAudioPill();
    initExpandingStage();
  }

  window.toggleWanderlustAudio = toggleWanderlustAudio;
})();

