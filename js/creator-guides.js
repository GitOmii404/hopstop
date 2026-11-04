/**
 * HopStop — Locked Creator Guides Engine (Micro-Monetization)
 */

// ==========================================================================
// Locked Creator Guides Engine (Micro-Monetization & Follower Thresholds)
// ==========================================================================

function saveLockedGuidesData() {
  localStorage.setItem('hopstop_locked_guides', JSON.stringify(lockedGuidesData));
}

function renderLockedGuides() {
  const grid = document.getElementById('lockedGuidesGrid');
  if (!grid) return;

  grid.innerHTML = lockedGuidesData.map(guide => {
    return `
      <div class="locked-guide-card post-card-animated" onclick="openLockedGuideModal('${guide.id}')">
        <div class="locked-guide-cover-wrap">
          <img src="${guide.heroImg}" alt="${guide.title}" class="locked-guide-cover">
          <div class="locked-guide-tag-overlay">
            <span class="locked-guide-badge">${guide.isUnlocked ? '🔓 UNLOCKED DOSSIER' : '🔒 LOCKED CREATOR INTEL'}</span>
          </div>
        </div>

        <div class="locked-guide-body">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <img src="${guide.author.avatar}" alt="${guide.author.name}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary);">${guide.author.name} • ${guide.author.followers} Followers</span>
          </div>

          <h4 class="locked-guide-title">${guide.title}</h4>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 12px; font-weight: 500;">📍 ${guide.region}</p>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 10px;">
            <span style="font-size: 0.82rem; font-weight: 800; color: ${guide.isUnlocked ? '#10b981' : '#b45309'};">
              ${guide.isUnlocked ? '✅ Full Access' : `🪙 ${guide.priceXp} XP / Free Follower`}
            </span>

            <button class="btn-primary" style="padding: 5px 12px; font-size: 0.76rem;" onclick="event.stopPropagation(); openLockedGuideModal('${guide.id}')">
              ${guide.isUnlocked ? '📖 View Dossier' : '🔓 Unlock Intel'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.openLockedGuideModal = function (guideId) {
  const guide = lockedGuidesData.find(g => g.id === guideId);
  if (!guide || !lockedGuideModal) return;

  activeLockedGuideId = guideId;

  document.getElementById('lockedGuideHeroImg').src = guide.heroImg;
  document.getElementById('lockedGuideHeroTitle').textContent = guide.title;
  document.getElementById('lockedGuideAuthorAvatar').src = guide.author.avatar;
  document.getElementById('lockedGuideAuthorName').textContent = guide.author.name;

  const contentStateEl = document.getElementById('lockedGuideContentState');
  if (contentStateEl) {
    if (guide.isUnlocked) {
      contentStateEl.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px;">
          <div style="font-size: 0.8rem; font-weight: 800; color: #10b981; text-transform: uppercase; margin-bottom: 4px;">✅ UNLOCKED DOSSIER ACTIVE</div>
          <p style="font-size: 0.86rem; color: var(--text-primary); margin: 0;">You have full VIP clearance to exact coordinates and local contact numbers.</p>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px;">📍 Exact GPS Coordinates (High-Precision Waypoints)</h4>
          <div style="background: var(--bg-hover); padding: 10px 14px; border-radius: var(--radius-md); font-family: monospace; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-color);">
            <span>${guide.secretCoords}</span>
            <button class="btn-popup-read" style="padding: 4px 10px; font-size: 0.74rem;" onclick="copySecretCoords('${guide.secretCoords}')">📋 Copy</button>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px;">📞 Verified Local Fixers & Cellar Contacts</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(guide.localContacts || []).map(c => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: var(--radius-md); font-size: 0.84rem;">
                <div>
                  <strong>${c.name}</strong> <span style="color: var(--text-muted);">(${c.role})</span>
                </div>
                <span style="color: #0284c7; font-weight: 700;">${c.phone}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px;">🗓️ 7-Day Complete Step-by-Step Route</h4>
          <ul style="padding-left: 20px; font-size: 0.86rem; line-height: 1.7; color: var(--text-primary);">
            ${(guide.itineraryDays || []).map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <button class="btn-gem" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #10b981, #059669);" onclick="downloadGpxDossier('${guide.title}')">
          📥 Download Complete Offline GPX File & Map Bundle
        </button>
      `;
    } else {
      contentStateEl.innerHTML = `
        <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); padding: 18px; background: var(--bg-hover); margin-bottom: 16px;">
          <div class="locked-blur-text">
            <h4>📍 Exact GPS Coordinates (Locked)</h4>
            <p>36.8642, -5.1814 | 36.7462, -5.1612 | 36.9124, -5.3310</p>
            <h4>📞 Local Contacts: Don Rafael (+34 612 884 912)</h4>
            <h4>🗓️ 7-Day Route: Secret canyon passes and private bodega reservations</h4>
          </div>

          <div class="locked-overlay-btn-wrap">
            <span style="font-size: 2rem; margin-bottom: 4px;">🔒</span>
            <div style="font-weight: 800; font-size: 1rem; margin-bottom: 4px;">Locked Behind Creator Threshold</div>
            <p style="font-size: 0.8rem; color: var(--text-muted); max-width: 380px; margin-bottom: 14px;">
              Unlock exact GPS coordinates, vetted phone numbers, and offline GPX files with 150 Gem XP or by following ${guide.author.name}.
            </p>
            <button class="btn-gem" style="padding: 10px 24px; font-size: 0.92rem; background: linear-gradient(135deg, #eab308, #ca8a04); color: #000; font-weight: 800;" onclick="unlockCreatorGuide('${guide.id}')">
              🔓 Unlock Guide (${guide.priceXp} XP Tip)
            </button>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
          <span>Your balance: <strong style="color: #eab308;">${userXp} XP</strong></span>
          <span>100% of XP tips support independent explorers</span>
        </div>
      `;
    }
  }

  lockedGuideModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeLockedGuideModal = function () {
  if (!lockedGuideModal) return;
  lockedGuideModal.classList.remove('open');
  document.body.style.overflow = '';
  activeLockedGuideId = null;
};

window.unlockCreatorGuide = function (guideId) {
  const guide = lockedGuidesData.find(g => g.id === guideId);
  if (!guide) return;

  if (userXp < guide.priceXp) {
    showToast(`You need ${guide.priceXp} XP to unlock this dossier! Solve bounties or post hidden gems to earn XP. ⚠️`);
    return;
  }

  userXp -= guide.priceXp;
  localStorage.setItem('hopstop_user_xp', userXp.toString());
  updateUserLevelUI();

  guide.isUnlocked = true;
  saveLockedGuidesData();

  if (typeof triggerConfetti === 'function') {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }

  renderLockedGuides();
  openLockedGuideModal(guideId);
  showToast(`🎉 Dossier unlocked! You now have full access to ${guide.author.name}'s secret coordinates.`);
};

window.copySecretCoords = function (coords) {
  navigator.clipboard?.writeText(coords).then(() => {
    showToast('Copied GPS coordinates to clipboard! 📋');
  }).catch(() => {
    showToast(`Coords: ${coords}`);
  });
};

window.downloadGpxDossier = function (title) {
  const dummyGpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="HopStop Offline Explorer">
  <metadata><name>${title}</name></metadata>
  <wpt lat="36.8642" lon="-5.1814"><name>Setenil Secret Boulder Entrance</name></wpt>
  <wpt lat="36.7462" lon="-5.1612"><name>Rio Trejo Moorish Mill Overlook</name></wpt>
</gpx>`;

  const blob = new Blob([dummyGpx], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('📥 Offline GPX file downloaded! Ready for handheld GPS & OsmAnd.');
};

window.setFeedSortMode = function (mode) {
  currentFeedSortMode = mode;
  document.querySelectorAll('.feed-sort-pill').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-sort-mode') === mode) {
      btn.classList.add('active');
    }
  });
  renderAppFeed();
  const labelMap = {
    'foryou': '🔥 Curated "For You" Feed',
    'fresh': '⏱️ Fresh Discoveries',
    'topgem': '💎 Top Gem Score (9.8+)',
    'wishlist': '🏷️ Saved Wishlist & Route Matches'
  };
  showToast(`Switched feed to: ${labelMap[mode] || mode}`);
};

window.checkInToGem = function (postId) {
  const post = postsData.find(p => p.id === postId);
  if (!post) return;

  if (post.isCheckedIn) {
    showToast(`You already confirmed your visit to ${post.placeName}! ⭐`);
    return;
  }

  post.isCheckedIn = true;
  post.checkInsCount = (post.checkInsCount || 12) + 1;
  const scoreNum = parseFloat(post.gemScore);
  if (scoreNum < 9.9) {
    post.gemScore = (scoreNum + 0.02).toFixed(1);
  }
  savePostsData();
  renderAppFeed();
  renderPosts();

  if (typeof triggerConfetti === 'function') {
    triggerConfetti();
  }

  awardUserXp(50, `Check-in at ${post.placeName}`);
  unlockBadge('pioneer');

  const matchedCountry = passportData.find(c => post.country.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(post.country.toLowerCase()));
  if (matchedCountry && !matchedCountry.visited) {
    matchedCountry.visited = true;
    matchedCountry.stampedAt = 'Just now (Check-in)';
    savePassportData();
    updatePassportUI();
  }

  showToast(`📍 Verified Check-in recorded! +50 XP and passport stamped for ${post.placeName}! 🏆`);
};
