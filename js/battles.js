/**
 * HopStop — Weekly Community Photo Battles & Prompts Engine
 */

// ==========================================================================
// Weekly Community Photo Battles & Prompts Engine
// ==========================================================================

function saveBattlesData() {
  localStorage.setItem('hopstop_battles', JSON.stringify(battlesData));
}

function initBattleCountdown() {
  if (battleCountdownInterval) clearInterval(battleCountdownInterval);

  const timerEl = document.getElementById('battleCountdownTimer');
  if (!timerEl) return;

  let remaining = battlesData.endsInSeconds || 224850;

  function update() {
    remaining = Math.max(0, remaining - 1);
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const mins = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;

    timerEl.textContent = `${days}d ${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  }

  update();
  battleCountdownInterval = setInterval(update, 1000);
}

let battleSearchQuery = '';

function renderPhotoBattles() {
  const grid = document.getElementById('battleSubmissionsGrid');
  if (!grid) return;

  const promptTitleEl = document.getElementById('battlePromptTitle');
  const promptDescEl = document.getElementById('battlePromptDesc');

  if (promptTitleEl) promptTitleEl.textContent = `Prompt: "${battlesData.prompt}"`;
  if (promptDescEl) promptDescEl.textContent = battlesData.desc;

  let subs = [...(battlesData.submissions || [])];

  // Update Hero Stats
  const totalVotes = subs.reduce((acc, s) => acc + (s.votes || 0), 0);
  const totalSubsEl = document.getElementById('battleStatsSubCount');
  const totalVotesEl = document.getElementById('battleStatsVoteCount');
  if (totalSubsEl) totalSubsEl.textContent = subs.length;
  if (totalVotesEl) totalVotesEl.textContent = totalVotes;

  if (battleSearchQuery) {
    const term = battleSearchQuery.toLowerCase();
    subs = subs.filter(s => 
      s.placeName.toLowerCase().includes(term) ||
      s.country.toLowerCase().includes(term) ||
      s.caption.toLowerCase().includes(term) ||
      (s.author && (s.author.name.toLowerCase().includes(term) || s.author.handle.toLowerCase().includes(term)))
    );
  }

  if (currentBattleSort === 'votes') {
    subs.sort((a, b) => b.votes - a.votes);
  } else if (currentBattleSort === 'free') {
    subs = subs.filter(s => (s.cost || '').toLowerCase().includes('free') || (s.cost || '').includes('$0'));
  } else {
    subs.reverse();
  }

  if (subs.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <span style="font-size: 3rem;">📸</span>
        <h3 style="margin-top: 10px; font-weight: 700;">No submissions found</h3>
        <p style="color: var(--text-muted); margin: 6px 0 16px;">Be the first explorer to submit a photo for this week's prompt!</p>
        <button class="btn-gem" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800;" onclick="openSubmitBattleModal()">📸 + Submit Photo</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = subs.map((sub, index) => {
    const isFirst = index === 0;
    const isSecond = index === 1;
    const isThird = index === 2;

    let podiumBadge = '';
    if (isFirst) podiumBadge = `<span class="battle-rank-pill gold">🥇 #1 Live Leader</span>`;
    else if (isSecond) podiumBadge = `<span class="battle-rank-pill silver">🥈 #2 Runner-Up</span>`;
    else if (isThird) podiumBadge = `<span class="battle-rank-pill bronze">🥉 #3 Podium</span>`;
    else podiumBadge = `<span class="battle-rank-pill">#${index + 1} Entry</span>`;

    return `
      <div class="battle-card ${isFirst ? 'podium-winner' : ''} post-card-animated">
        <div class="battle-card-media">
          <img src="${sub.photoUrl}" alt="${sub.placeName}" class="battle-card-img" onclick="openLightboxForBattle('${sub.photoUrl}', '${sub.placeName}')">
          <div class="battle-card-overlay-top">
            ${podiumBadge}
            <span class="battle-cost-tag">🏷️ ${sub.cost || 'Under $10'}</span>
          </div>
        </div>

        <div class="battle-card-body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
            <div>
              <h3 class="battle-card-title">${sub.placeName}</h3>
              <div class="battle-card-location">📍 ${sub.country}</div>
            </div>

            <button class="battle-vote-btn ${sub.hasVoted ? 'voted' : ''}" onclick="voteForBattleSubmission('${sub.id}')">
              ${sub.hasVoted ? '❤️' : '🤍'} <span>${sub.votes}</span>
            </button>
          </div>

          <p class="battle-card-caption">${sub.caption}</p>

          <div class="battle-author-row">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="${sub.author.avatar}" alt="${sub.author.name}" class="battle-author-avatar">
              <div>
                <span class="battle-author-name">${sub.author.name}</span>
                <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">${sub.author.handle}</span>
              </div>
            </div>

            <button class="btn-popup-read" style="padding: 4px 10px; font-size: 0.74rem;" onclick="voteForBattleSubmission('${sub.id}')">
              ${sub.hasVoted ? '✅ Upvoted' : '🗳️ Vote Entry'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.searchBattleSubmissions = function (query) {
  battleSearchQuery = query.trim();
  renderPhotoBattles();
};

window.sortBattleEntries = function (criteria) {
  currentBattleSort = criteria;
  document.querySelectorAll('#battleSortTabs .bounty-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-sort') === criteria);
  });
  renderPhotoBattles();
};

window.setBattlePhotoPreset = function (url, place, country, caption, cost) {
  const urlEl = document.getElementById('battlePhotoUrl');
  const placeEl = document.getElementById('battlePlaceName');
  const countryEl = document.getElementById('battleCountry');
  const capEl = document.getElementById('battleCaption');
  const costEl = document.getElementById('battleCost');

  if (urlEl) urlEl.value = url;
  if (placeEl) placeEl.value = place;
  if (countryEl) countryEl.value = country;
  if (capEl) capEl.value = caption;
  if (costEl) costEl.value = cost;
};

window.voteForBattleSubmission = function (submissionId) {
  const sub = (battlesData.submissions || []).find(s => s.id === submissionId);
  if (!sub) return;

  if (sub.hasVoted) {
    sub.hasVoted = false;
    sub.votes = Math.max(0, sub.votes - 1);
    showToast(`Removed vote for ${sub.placeName}`);
  } else {
    sub.hasVoted = true;
    sub.votes += 1;
    if (typeof triggerHeartBurst === 'function') {
      triggerHeartBurst();
    }
    awardUserXp(20, `Voting in Photo Battle`);
    showToast(`🗳️ Voted for "${sub.placeName}"! +20 XP awarded.`);
  }

  saveBattlesData();
  renderPhotoBattles();
};

window.openLightboxForBattle = function (imgUrl, title) {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  if (!lightboxModal || !lightboxImg) return;

  lightboxImg.src = imgUrl;
  if (lightboxCaption) lightboxCaption.textContent = `🏆 Battle Entry: ${title}`;

  lightboxModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.openSubmitBattleModal = function () {
  if (!submitBattleModal) return;
  submitBattleModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeSubmitBattleModal = function () {
  if (!submitBattleModal) return;
  submitBattleModal.classList.remove('open');
  document.body.style.overflow = '';
};

function handleSubmitBattle(e) {
  e.preventDefault();
  const placeName = document.getElementById('battlePlaceName')?.value.trim();
  const country = document.getElementById('battleCountry')?.value.trim();
  const photoUrl = document.getElementById('battlePhotoUrl')?.value.trim();
  const caption = document.getElementById('battleCaption')?.value.trim();
  const cost = document.getElementById('battleCost')?.value.trim() || '$0 (Free)';

  if (!placeName || !country || !photoUrl || !caption) {
    showToast('Please fill out all required battle submission fields 📸');
    return;
  }

  const newSubmission = {
    id: `bat_${Date.now()}`,
    placeName: placeName,
    country: country,
    photoUrl: photoUrl,
    caption: caption,
    cost: cost,
    votes: 1,
    hasVoted: true,
    author: {
      name: currentUser ? currentUser.name : "Maya Lin",
      handle: currentUser ? currentUser.handle : "@mayawanders",
      avatar: currentUser ? currentUser.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    }
  };

  if (!battlesData.submissions) battlesData.submissions = [];
  battlesData.submissions.unshift(newSubmission);
  saveBattlesData();

  closeSubmitBattleModal();
  renderPhotoBattles();
  document.getElementById('submitBattleForm')?.reset();

  if (typeof triggerConfetti === 'function') {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }

  awardUserXp(150, `Submitting to "${battlesData.prompt}" Photo Battle`);
  unlockBadge('gemhunter');
  showToast(`🚀 "${placeName}" submitted to Active Battle! Sunday community voting is live.`);
}
