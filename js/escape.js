/**
 * HopStop — Ambient Escape Mode (Full-Screen Mental Getaway & Spatial Audio)
 */

// ==========================================================================
// 4. Ambient Escape Mode (Full-Screen Mental Getaway & Spatial Audio)
// ==========================================================================

function initEscapeAudioEngine() {
  if (escapeAudioContext) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    escapeAudioContext = new AudioCtx();

    // Master Volume Gain Node
    const masterGain = escapeAudioContext.createGain();
    masterGain.gain.setValueAtTime(escapeVolume, escapeAudioContext.currentTime);
    masterGain.connect(escapeAudioContext.destination);

    // Generate Pink/Nature Noise Buffer for organic soundscapes
    const bufferSize = 2 * escapeAudioContext.sampleRate;
    const noiseBuffer = escapeAudioContext.createBuffer(1, bufferSize, escapeAudioContext.sampleRate);
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
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
      b6 = white * 0.115926;
    }

    // 1. Spring Rain Sound Node
    const rainSource = escapeAudioContext.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;
    const rainFilter = escapeAudioContext.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1400, escapeAudioContext.currentTime);
    const rainGain = escapeAudioContext.createGain();
    rainGain.gain.setValueAtTime(escapeActiveSounds.rain ? 0.35 : 0, escapeAudioContext.currentTime);
    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(masterGain);
    rainSource.start(0);

    // 2. Alpine Mountain Wind Node
    const windSource = escapeAudioContext.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;
    const windFilter = escapeAudioContext.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(360, escapeAudioContext.currentTime);
    windFilter.Q.setValueAtTime(3.2, escapeAudioContext.currentTime);
    const windGain = escapeAudioContext.createGain();
    windGain.gain.setValueAtTime(escapeActiveSounds.wind ? 0.4 : 0, escapeAudioContext.currentTime);
    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    windSource.start(0);

    // 3. Ocean Waves Node
    const waveSource = escapeAudioContext.createBufferSource();
    waveSource.buffer = noiseBuffer;
    waveSource.loop = true;
    const waveFilter = escapeAudioContext.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(450, escapeAudioContext.currentTime);
    const waveGain = escapeAudioContext.createGain();
    waveGain.gain.setValueAtTime(escapeActiveSounds.waves ? 0.4 : 0, escapeAudioContext.currentTime);
    waveSource.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(masterGain);
    waveSource.start(0);

    // 4. Campfire Crackle Node
    const fireSource = escapeAudioContext.createBufferSource();
    fireSource.buffer = noiseBuffer;
    fireSource.loop = true;
    const fireFilter = escapeAudioContext.createBiquadFilter();
    fireFilter.type = 'highpass';
    fireFilter.frequency.setValueAtTime(2600, escapeAudioContext.currentTime);
    const fireGain = escapeAudioContext.createGain();
    fireGain.gain.setValueAtTime(escapeActiveSounds.fire ? 0.22 : 0, escapeAudioContext.currentTime);
    fireSource.connect(fireFilter);
    fireFilter.connect(fireGain);
    fireGain.connect(masterGain);
    fireSource.start(0);

    escapeAudioNodes = {
      masterGain,
      rainGain,
      windGain,
      waveGain,
      fireGain
    };
  } catch (err) {
    console.warn('Web Audio engine deferred:', err);
  }
}

window.openEscapeMode = function (index = 0) {
  const escapeModal = document.getElementById('escapeModal');
  if (!escapeModal) return;
  currentEscapeIndex = index >= 0 && index < ESCAPE_SCENES.length ? index : 0;
  loadEscapeScene(currentEscapeIndex);
  escapeModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  initEscapeAudioEngine();
  if (escapeAudioContext && escapeAudioContext.state === 'suspended') {
    escapeAudioContext.resume();
  }

  showToast('🎧 Escape Mode active — Spatial audio running. Relax & enjoy 🌿');
};

window.closeEscapeMode = function () {
  const escapeModal = document.getElementById('escapeModal');
  if (!escapeModal) return;
  escapeModal.classList.remove('open');
  document.body.style.overflow = '';
  const video = document.getElementById('escapeVideoBg');
  if (video) {
    video.pause();
    video.classList.remove('loaded');
  }
  if (escapeAudioContext && escapeAudioContext.state === 'running') {
    escapeAudioContext.suspend();
  }
  clearInterval(escapeZenTimer);
  const countdownEl = document.getElementById('escapeTimerCountdown');
  if (countdownEl) countdownEl.textContent = '';
};

function renderEscapeQuickNav() {
  const navContainer = document.getElementById('escapeScenesQuickNav');
  if (!navContainer) return;
  navContainer.innerHTML = ESCAPE_SCENES.map((sc, idx) => `
    <button class="escape-nav-pill ${idx === currentEscapeIndex ? 'active' : ''}" 
            onclick="openEscapeMode(${idx})" 
            title="${sc.title} — ${sc.location}">
      ${sc.shortName || sc.location.split(',')[0]}
    </button>
  `).join('');
}

function loadEscapeScene(index) {
  const scene = ESCAPE_SCENES[index];
  if (!scene) return;

  const imgEl = document.getElementById('escapeImageBg');
  const video = document.getElementById('escapeVideoBg');
  const title = document.getElementById('escapeSceneTitle');
  const location = document.getElementById('escapeSceneLocation');
  const quote = document.getElementById('escapeSceneQuote');

  // 1. Instant High-Definition Scenic Photo with Ken Burns Motion
  if (imgEl && scene.imageUrl) {
    imgEl.style.backgroundImage = `url('${scene.imageUrl}')`;
  }

  // 2. Ambient Video Background (Gracefully overlays scenery image when stream is ready)
  if (video) {
    video.classList.remove('loaded');
    if (scene.videoUrl) {
      video.src = scene.videoUrl;
      video.onloadeddata = () => {
        video.classList.add('loaded');
      };
      video.onerror = () => {
        video.classList.remove('loaded');
      };
      video.play().catch(() => {
        video.classList.remove('loaded');
      });
    } else {
      video.removeAttribute('src');
    }
  }

  if (title) title.textContent = scene.title;
  if (location) location.textContent = `📍 ${scene.location}`;
  if (quote) quote.textContent = scene.quote;

  renderEscapeQuickNav();
}

window.navigateEscapeScene = function (direction) {
  let newIndex = currentEscapeIndex + direction;
  if (newIndex < 0) newIndex = ESCAPE_SCENES.length - 1;
  if (newIndex >= ESCAPE_SCENES.length) newIndex = 0;
  currentEscapeIndex = newIndex;
  loadEscapeScene(currentEscapeIndex);
};

window.toggleEscapeSound = function (soundType) {
  escapeActiveSounds[soundType] = !escapeActiveSounds[soundType];
  const btnId = `btnSound${soundType.charAt(0).toUpperCase() + soundType.slice(1)}`;
  document.getElementById(btnId)?.classList.toggle('active', escapeActiveSounds[soundType]);

  if (escapeAudioNodes && escapeAudioNodes[`${soundType}Gain`]) {
    const gainNode = escapeAudioNodes[`${soundType}Gain`];
    const targetGain = escapeActiveSounds[soundType] ? (soundType === 'fire' ? 0.22 : 0.4) : 0;
    gainNode.gain.setValueAtTime(targetGain, escapeAudioContext.currentTime);
  }

  showToast(`${soundType.toUpperCase()} sound layer ${escapeActiveSounds[soundType] ? 'activated 🔊' : 'muted 🔇'}`);
};

window.setEscapeVolume = function (val) {
  escapeVolume = parseFloat(val);
  if (escapeAudioNodes && escapeAudioNodes.masterGain) {
    escapeAudioNodes.masterGain.gain.setValueAtTime(escapeVolume, escapeAudioContext.currentTime);
  }
};

window.startEscapeZenTimer = function (minutes) {
  clearInterval(escapeZenTimer);
  document.querySelectorAll('.escape-timer-pill').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`timer${minutes}m`)?.classList.add('active');

  escapeTimerSeconds = minutes * 60;
  const countdownEl = document.getElementById('escapeTimerCountdown');

  showToast(`🧘 Zen timer set for ${minutes} minutes. Breathe & unwind...`);

  escapeZenTimer = setInterval(() => {
    escapeTimerSeconds--;
    if (escapeTimerSeconds <= 0) {
      clearInterval(escapeZenTimer);
      if (countdownEl) countdownEl.textContent = '✨ Completed';
      awardUserXp(50, 'Zen Meditation Escape');
      showToast('✨ Zen meditation completed! +50 XP bonus earned 🧘');
      return;
    }

    const m = Math.floor(escapeTimerSeconds / 60);
    const s = String(escapeTimerSeconds % 60).padStart(2, '0');
    if (countdownEl) countdownEl.textContent = `⏱️ ${m}:${s}`;
  }, 1000);
};

window.addCurrentEscapeToItinerary = function () {
  const scene = ESCAPE_SCENES[currentEscapeIndex];
  if (!scene || !scene.postId) return;
  addToItinerary(scene.postId);
};

window.viewCurrentEscapeOnMap = function () {
  const scene = ESCAPE_SCENES[currentEscapeIndex];
  if (!scene || !scene.postId) return;
  closeEscapeMode();
  focusPostOnMap(scene.postId);
};

