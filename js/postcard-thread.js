/* ==========================================================================
   HopStop — Akai Ito (運命の赤い糸) Dual-Layer Over-Under Weaving Engine
   Simulates authentic Japanese vermilion silk cord physically weaving
   OVER and UNDER postcards through punched brass eyelets, coupled with a
   real-time pendulum physics engine for realistic interactive swinging.
   ========================================================================== */

(function () {
  'use strict';

  // Pentatonic acoustic koto / harp notes
  const PLUCK_NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

  let audioCtx = null;
  function playPluckAudio(frequency = 440) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.985, audioCtx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.048, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {}
  }

  const activeThreads = [];

  class DualLayerThread {
    constructor(trackEl, trackId) {
      this.trackEl = trackEl;
      this.trackId = trackId;
      this.cards = [];
      this.cardStates = [];
      this.segments = [];
      this.svgFront = null;
      this.svgBehind = null;
      this.animId = null;

      this.init();
    }

    init() {
      // Remove any existing SVGs for this track
      const oldFront = this.trackEl.querySelector(`.postcard-thread-svg-front-${this.trackId}`);
      if (oldFront) oldFront.remove();
      const oldBehind = this.trackEl.querySelector(`.postcard-thread-svg-behind-${this.trackId}`);
      if (oldBehind) oldBehind.remove();

      this.cards = Array.from(this.trackEl.querySelectorAll('.polaroid-slide-card'));
      if (this.cards.length === 0) return;

      this.buildSvgs();
      this.initSegmentsAndCards();
      this.attachInteractions();
      this.renderPaths(0);
      this.startPhysicsLoop();
    }

    buildSvgs() {
      const trackWidth = Math.max(this.trackEl.scrollWidth || 6000, 4500);

      // 1. BEHIND Layer (z-index: 4, sits behind the cards)
      const svgBehind = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgBehind.setAttribute('class', `postcard-thread-svg-behind postcard-thread-svg-behind-${this.trackId}`);
      svgBehind.setAttribute('width', trackWidth);
      svgBehind.setAttribute('height', '140');
      svgBehind.setAttribute('viewBox', `0 0 ${trackWidth} 140`);
      svgBehind.style.width = `${trackWidth}px`;
      svgBehind.style.height = '140px';

      svgBehind.innerHTML = `
        <defs>
          <filter id="akaiShadowBehind-${this.trackId}" x="-10%" y="-20%" width="120%" height="180%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" flood-color="rgba(20, 5, 5, 0.3)" />
          </filter>
        </defs>
        <!-- Shadow Layer Behind -->
        <path class="akai-shadow-behind" filter="url(#akaiShadowBehind-${this.trackId})" fill="none" stroke="rgba(20, 5, 5, 0.25)" stroke-width="3.2" stroke-linecap="round" />
        <!-- Vermilion Red Silk Core Behind -->
        <path class="akai-core-behind" fill="none" stroke="#b91c1c" stroke-width="3.4" stroke-linecap="round" />
        <!-- Kumihimo Texture Behind -->
        <path class="akai-kumi-behind" fill="none" stroke="#fef08a" stroke-width="0.9" stroke-dasharray="6, 8" stroke-linecap="round" opacity="0.65" />
      `;

      // 2. FRONT Layer (z-index: 25, sits in front of the cards)
      const svgFront = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgFront.setAttribute('class', `postcard-thread-svg-front postcard-thread-svg-front-${this.trackId}`);
      svgFront.setAttribute('width', trackWidth);
      svgFront.setAttribute('height', '140');
      svgFront.setAttribute('viewBox', `0 0 ${trackWidth} 140`);
      svgFront.style.width = `${trackWidth}px`;
      svgFront.style.height = '140px';

      svgFront.innerHTML = `
        <defs>
          <filter id="akaiShadowFront-${this.trackId}" x="-10%" y="-20%" width="120%" height="180%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" flood-color="rgba(30, 8, 8, 0.35)" />
          </filter>
          <linearGradient id="akaiGradFront-${this.trackId}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#ff4444" />
            <stop offset="25%" stop-color="#dc2626" />
            <stop offset="50%" stop-color="#b91c1c" />
            <stop offset="75%" stop-color="#ef4444" />
            <stop offset="100%" stop-color="#991b1b" />
          </linearGradient>
          <linearGradient id="goldTasselGrad-${this.trackId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="50%" stop-color="#eab308" />
            <stop offset="100%" stop-color="#ca8a04" />
          </linearGradient>
        </defs>

        <!-- Shadow Layer Front -->
        <path class="akai-shadow-front" filter="url(#akaiShadowFront-${this.trackId})" fill="none" stroke="rgba(20, 5, 5, 0.28)" stroke-width="3.2" stroke-linecap="round" />
        <!-- Vermilion Red Silk Core Front -->
        <path class="akai-core-front" fill="none" stroke="url(#akaiGradFront-${this.trackId})" stroke-width="3.4" stroke-linecap="round" style="pointer-events: stroke; cursor: pointer;" />
        <!-- Kumihimo Texture Front -->
        <path class="akai-kumi-front" fill="none" stroke="#fef08a" stroke-width="0.9" stroke-dasharray="6, 8" stroke-linecap="round" opacity="0.85" />
        <!-- Glow Layer Front -->
        <path class="akai-glow-front" fill="none" stroke="#ff7b72" stroke-width="8" opacity="0" stroke-linecap="round" filter="blur(2px)" />

        <!-- Traditional Mizuhiki Tassel Knot at the beginning -->
        <g class="akai-tassel-front"></g>
        <!-- Tied Knots at Every Hole -->
        <g class="akai-knots-front"></g>
        <!-- Sparks Container -->
        <g class="akai-sparks-front"></g>
      `;

      // Prepend behind layer first, then front layer
      this.trackEl.prepend(svgFront);
      this.trackEl.prepend(svgBehind);

      this.svgBehind = svgBehind;
      this.svgFront = svgFront;

      this.pathShadowBehind = svgBehind.querySelector('.akai-shadow-behind');
      this.pathCoreBehind = svgBehind.querySelector('.akai-core-behind');
      this.pathKumiBehind = svgBehind.querySelector('.akai-kumi-behind');

      this.pathShadowFront = svgFront.querySelector('.akai-shadow-front');
      this.pathCoreFront = svgFront.querySelector('.akai-core-front');
      this.pathKumiFront = svgFront.querySelector('.akai-kumi-front');
      this.pathGlowFront = svgFront.querySelector('.akai-glow-front');

      this.tasselGroup = svgFront.querySelector('.akai-tassel-front');
      this.knotsGroup = svgFront.querySelector('.akai-knots-front');
      this.sparksGroup = svgFront.querySelector('.akai-sparks-front');
    }

    initSegmentsAndCards() {
      this.segments = [];
      this.cardStates = [];

      for (let i = 0; i < this.cards.length; i++) {
        const card = this.cards[i];
        const hole = card.querySelector('.postcard-puncture');

        const cx = card.offsetLeft + card.offsetWidth / 2;
        const holeOffset = hole ? (hole.offsetTop + hole.offsetHeight / 2) : 19;
        const cy = card.offsetTop + holeOffset;
        const baseTilt = parseFloat(card.dataset.baseTilt || 0);

        this.cardStates.push({
          card: card,
          angle: baseTilt,
          velocity: 0,
          baseTilt: baseTilt,
          pitch: 0,
          pitchVel: 0,
          liftY: 0,
          liftVel: 0,
          isHovered: false,
          index: i
        });

        this.segments.push({
          cardIndex: i,
          x: cx,
          anchorY: cy,
          offset: 0,
          velocity: 0,
          targetSag: 16
        });
      }

      this.renderTasselAndKnots();
    }

    renderTasselAndKnots() {
      if (!this.segments.length) return;
      const first = this.segments[0];
      const knotX = Math.max(first.x - 170, 45);
      const knotY = first.anchorY + 2;

      // 1. Traditional Japanese Mizuhiki Tassel Knot (Plum Blossom / Ume-musubi) at the beginning
      if (this.tasselGroup) {
        this.tasselGroup.innerHTML = `
          <g transform="translate(${knotX}, ${knotY})" class="mizuhiki-knot-anchor" style="cursor: pointer;" onclick="strumPostcardThread()">
            <!-- Shadow -->
            <path d="M 0 0 C -20 -18, -30 6, -8 10 M 0 0 C 20 -18, 30 6, 8 10" fill="none" stroke="rgba(20,5,5,0.3)" stroke-width="3.5" stroke-linecap="round" />
            <!-- Crimson Braided Cord Loops -->
            <path d="M 0 0 C -18 -16, -28 6, -6 8" fill="none" stroke="#dc2626" stroke-width="3.2" stroke-linecap="round" />
            <path d="M 0 0 C 18 -16, 28 6, 6 8" fill="none" stroke="#dc2626" stroke-width="3.2" stroke-linecap="round" />
            <!-- Gold Cord Cross Wrap -->
            <path d="M -4 4 C -12 -10, 12 -10, 4 4" fill="none" stroke="#facc15" stroke-width="2.2" />
            <!-- Polished Brass Medallion -->
            <circle cx="0" cy="0" r="6" fill="url(#goldTasselGrad-${this.trackId})" stroke="#854d0e" stroke-width="1.2" />
            <circle cx="0" cy="0" r="2.5" fill="#713f12" />
            <!-- Gold Wire Tassel Binding -->
            <rect x="-5" y="7" width="10" height="4.5" rx="1.5" fill="#eab308" stroke="#854d0e" stroke-width="0.6" />
            <!-- Cascading Crimson Silk Tassels with Gold Highlights -->
            <path d="M -3 11 C -6 22, -10 34, -12 42" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" />
            <path d="M -1.5 11 C -3 23, -5 37, -6 46" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" />
            <path d="M 0 11 C 0 24, 0 38, 0 48" fill="none" stroke="#facc15" stroke-width="1.8" stroke-linecap="round" />
            <path d="M 1.5 11 C 3 23, 5 37, 6 46" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" />
            <path d="M 3 11 C 6 22, 10 34, 12 42" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" />
          </g>
        `;
      }
    }

    attachInteractions() {
      // 1. Thread Path Click / Hover
      if (this.pathCoreFront) {
        this.pathCoreFront.addEventListener('click', (e) => {
          const rect = this.trackEl.getBoundingClientRect();
          this.pluckAtX(e.clientX - rect.left, 28);
        });
        this.pathCoreFront.addEventListener('mouseenter', (e) => {
          const rect = this.trackEl.getBoundingClientRect();
          this.pluckAtX(e.clientX - rect.left, 14);
        });
      }

      // 2. Real-Time Card Touching & Pendulum Swing (Calm, gentle & tactile)
      let lastX = null;

      this.cards.forEach((card, index) => {
        card.addEventListener('mouseenter', (e) => {
          if (this.cardStates[index]) this.cardStates[index].isHovered = true;
          const impulse = (lastX !== null && e.clientX < lastX) ? -1.8 : 1.8;
          this.swingCard(index, impulse);
          playPluckAudio(PLUCK_NOTES[index % PLUCK_NOTES.length]);
        });

        card.addEventListener('mouseleave', () => {
          if (this.cardStates[index]) this.cardStates[index].isHovered = false;
        });

        card.addEventListener('mousemove', (e) => {
          if (Math.abs(e.movementX) > 2) {
            // Gentle, smoothly capped impulse — never aggressive or twitchy
            const impulse = Math.max(-1.5, Math.min(1.5, e.movementX * 0.12));
            this.swingCard(index, impulse);
          }
          lastX = e.clientX;
        });

        card.addEventListener('click', () => {
          this.swingCard(index, (Math.random() > 0.5 ? 3.5 : -3.5));
          this.pluckCard(index, 14);
        });
      });

      // 3. Pointer drag & gentle breeze across gallery
      let isStrumming = false;
      this.trackEl.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.postcard-puncture') || e.target === this.pathCoreFront) {
          isStrumming = true;
        }
      });

      this.trackEl.addEventListener('pointermove', (e) => {
        const rect = this.trackEl.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Pluck thread if near string
        if (mouseY >= 5 && mouseY <= 85) {
          if (Math.abs(e.movementY) > 3 || isStrumming) {
            this.pluckAtX(mouseX, Math.min(Math.abs(e.movementY) * 1.5 + 6, 14));
          }
        }

        // Fast horizontal mouse movement blows a gentle soft breeze across nearby cards
        if (Math.abs(e.movementX) > 5) {
          const windDir = e.movementX > 0 ? 1 : -1;
          const gustStrength = Math.min(Math.abs(e.movementX) * 0.08, 2.0);
          for (let i = 0; i < this.segments.length; i++) {
            const dist = Math.abs(this.segments[i].x - mouseX);
            if (dist < 260) {
              const falloff = 1 - (dist / 260);
              this.swingCard(i, gustStrength * falloff * windDir);
            }
          }
        }
      });

      window.addEventListener('pointerup', () => { isStrumming = false; });
    }

    swingCard(cardIndex, impulse = 1.8) {
      if (this.cardStates[cardIndex]) {
        const cs = this.cardStates[cardIndex];
        // Velocity clamped to graceful, calm speeds — eliminates any aggressive jitter
        cs.velocity = Math.max(-4.0, Math.min(4.0, cs.velocity + impulse));

        // Bidirectional coupling: card pulls thread with a gentle harmonic ripple
        if (this.segments[cardIndex]) {
          this.segments[cardIndex].velocity += impulse * 0.25;
        }
      }
    }

    pluckAtX(targetX, force = 20) {
      if (!this.segments.length) return;

      let closestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < this.segments.length; i++) {
        const diff = Math.abs(this.segments[i].x - targetX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }

      const seg = this.segments[closestIdx];
      if (seg) {
        seg.velocity += force * (Math.random() > 0.5 ? 1 : -1);
        if (this.segments[closestIdx - 1]) this.segments[closestIdx - 1].velocity += force * 0.45;
        if (this.segments[closestIdx + 1]) this.segments[closestIdx + 1].velocity += force * 0.45;

        // Thread pulls card
        this.swingCard(closestIdx, force * 0.45);
        this.createSpark(seg.x, seg.anchorY + seg.targetSag);

        if (this.pathGlowFront) {
          this.pathGlowFront.style.opacity = '0.9';
          setTimeout(() => { if (this.pathGlowFront) this.pathGlowFront.style.opacity = '0'; }, 350);
        }
      }
    }

    pluckCard(index, force = 22) {
      if (index >= 0 && index < this.segments.length) {
        const seg = this.segments[index];
        seg.velocity += force;
        if (this.segments[index - 1]) this.segments[index - 1].velocity += force * 0.5;
        if (this.segments[index + 1]) this.segments[index + 1].velocity += force * 0.5;

        this.swingCard(index, force * 0.45);
        this.createSpark(seg.x, seg.anchorY);
      }
    }

    createSpark(x, y) {
      if (!this.sparksGroup) return;
      const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      spark.setAttribute('cx', x);
      spark.setAttribute('cy', y);
      spark.setAttribute('r', '4');
      spark.setAttribute('fill', '#fde047');
      spark.setAttribute('filter', 'drop-shadow(0 0 6px #ef4444)');
      spark.style.transition = 'all 0.45s ease-out';
      spark.style.opacity = '1';

      this.sparksGroup.appendChild(spark);

      requestAnimationFrame(() => {
        spark.setAttribute('r', '9');
        spark.style.transform = `scale(1.8) translateY(-8px)`;
        spark.style.opacity = '0';
      });

      setTimeout(() => spark.remove(), 500);
    }

    updatePhysics(time) {
      const k = 0.082;
      const damping = 0.06;
      const coupling = 0.045;

      // 1. Thread Wave Equations
      for (let i = 0; i < this.segments.length; i++) {
        const seg = this.segments[i];
        const breeze = Math.sin(time * 0.002 + i * 0.75) * 1.6;

        const springForce = -k * (seg.offset - breeze) - damping * seg.velocity;
        seg.velocity += springForce;
        seg.offset += seg.velocity;

        if (i > 0) {
          this.segments[i - 1].velocity += (seg.offset - this.segments[i - 1].offset) * coupling;
        }
        if (i < this.segments.length - 1) {
          this.segments[i + 1].velocity += (seg.offset - this.segments[i + 1].offset) * coupling;
        }
      }

      // 2. Real-Time Traveling Wind Wave & Compound Pendulum Physics (Visible, natural breeze)
      const waveDir = this.trackId === 'top' ? -1 : 1;
      const waveSpeed = time * 0.0018;

      for (let i = 0; i < this.cardStates.length; i++) {
        const cs = this.cardStates[i];

        // Spatial traveling wind waves across the hanging cards
        const windCycle = Math.sin(waveSpeed + i * 0.46 * waveDir);
        const draftCycle = Math.cos(waveSpeed * 0.55 + i * 0.24 * waveDir);

        // Visible natural pendulum sway: ±8.5 deg smooth rhythmic angle
        const windAngle = windCycle * 6.5 + draftCycle * 2.2;
        const targetAngle = cs.baseTilt + windAngle;

        // Smooth spring physics with responsive tracking
        cs.velocity = (cs.velocity + (targetAngle - cs.angle) * 0.10) * 0.88;
        cs.angle += cs.velocity;

        // Clear, visible horizontal swing left & right (±12px to ±16px lateral arc)
        const targetDriftX = (windCycle * 10.5 + draftCycle * 4.0);
        cs.driftX = (cs.driftX || 0) + (targetDriftX - (cs.driftX || 0)) * 0.12;

        // Subtle, elegant hover lift (-5px)
        const targetLift = cs.isHovered ? -5 : 0;
        cs.liftVel = (cs.liftVel + (targetLift - cs.liftY) * 0.16) * 0.84;
        cs.liftY += cs.liftVel;

        // Apply physical transform strictly without any scaling (fixed constant card size)
        cs.card.style.transform = `translateY(${cs.liftY.toFixed(1)}px) translateX(${cs.driftX.toFixed(1)}px) rotateZ(${cs.angle.toFixed(2)}deg)`;

        // Bidirectional coupling: card movement transfers physical energy to thread
        if (this.segments[i]) {
          this.segments[i].velocity += Math.abs(cs.velocity) * 0.08;
        }
      }
    }

    renderPaths(time) {
      if (!this.segments.length || !this.pathCoreFront || !this.pathCoreBehind) return;

      let dFront = '';
      let dBehind = '';

      const first = this.segments[0];
      const knotX = Math.max(first.x - 170, 45);
      const knotY = first.anchorY + 2;

      // Segment 0: From Knot into Hole 0 (In Front of Card 0)
      dFront += `M ${knotX} ${knotY} `;
      dFront += `C ${knotX + 60} ${knotY + 14}, ${first.x - 60} ${first.anchorY + 14}, ${first.x} ${first.anchorY} `;

      // Weave OVER and UNDER through every single card:
      // Even gaps (0 -> 1, 2 -> 3...): Thread goes BEHIND the cards!
      // Odd gaps (1 -> 2, 3 -> 4...): Thread goes IN FRONT OF the cards!
      for (let i = 0; i < this.segments.length - 1; i++) {
        const curr = this.segments[i];
        const next = this.segments[i + 1];

        const x1 = curr.x;
        const y1 = curr.anchorY;
        const x2 = next.x;
        const y2 = next.anchorY;

        const dx = x2 - x1;
        const sag = curr.targetSag + curr.offset;

        const cp1x = x1 + dx * 0.35;
        const cp1y = y1 + sag;
        const cp2x = x2 - dx * 0.35;
        const cp2y = y2 + sag;

        const curveCmd = `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)} `;

        if (i % 2 === 0) {
          // GOES BEHIND: Enters Hole i to the back -> drapes behind -> enters Hole i+1 from below!
          dBehind += curveCmd;
        } else {
          // GOES IN FRONT: Exits Hole i to the front -> drapes in front of card -> enters Hole i+1 from above!
          dFront += curveCmd;
        }
      }

      // Tail trailing off after the last card
      const last = this.segments[this.segments.length - 1];
      const tailX = last.x + 130;
      const tailY = last.anchorY + 28;
      dFront += `M ${last.x} ${last.anchorY} C ${last.x + 40} ${last.anchorY + 14}, ${last.x + 85} ${last.anchorY + 26}, ${tailX} ${tailY}`;

      // Update Front Layer
      this.pathCoreFront.setAttribute('d', dFront);
      if (this.pathKumiFront) this.pathKumiFront.setAttribute('d', dFront);
      if (this.pathShadowFront) this.pathShadowFront.setAttribute('d', dFront);
      if (this.pathGlowFront) this.pathGlowFront.setAttribute('d', dFront);

      // Update Behind Layer
      this.pathCoreBehind.setAttribute('d', dBehind);
      if (this.pathKumiBehind) this.pathKumiBehind.setAttribute('d', dBehind);
      if (this.pathShadowBehind) this.pathShadowBehind.setAttribute('d', dBehind);
    }

    startPhysicsLoop() {
      const step = (time) => {
        this.updatePhysics(time);
        this.renderPaths(time);
        this.animId = requestAnimationFrame(step);
      };
      this.animId = requestAnimationFrame(step);
    }

    destroy() {
      if (this.animId) cancelAnimationFrame(this.animId);
      if (this.svgFront) this.svgFront.remove();
      if (this.svgBehind) this.svgBehind.remove();
    }
  }

  window.initPostcardThreads = function () {
    while (activeThreads.length) {
      const th = activeThreads.pop();
      th.destroy();
    }

    const trackTop = document.getElementById('galleryTrackTop');
    const trackBottom = document.getElementById('galleryTrackBottom');

    if (trackTop) activeThreads.push(new DualLayerThread(trackTop, 'top'));
    if (trackBottom) activeThreads.push(new DualLayerThread(trackBottom, 'bottom'));
  };

  window.pluckCardThread = function (cardIndex) {
    activeThreads.forEach(th => th.pluckCard(cardIndex, 26));
  };

  window.strumPostcardThread = function () {
    activeThreads.forEach((th) => {
      for (let i = 0; i < Math.min(th.segments.length, 14); i++) {
        setTimeout(() => { th.pluckCard(i, 20); }, i * 70);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { setTimeout(window.initPostcardThreads, 200); });
  } else {
    setTimeout(window.initPostcardThreads, 200);
  }

})();
