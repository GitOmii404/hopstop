/**
 * HopStop — Explorer Badges & Gamification Leveling Engine
 */

// ==========================================================================
// Explorer Badges & Gamification Leveling Engine
// ==========================================================================

function calculateLevel(xp) {
  if (xp < 200) {
    return {
      tier: 'Level 1: Scout',
      badge: '🧭 Scout',
      min: 0,
      max: 200,
      progress: Math.min(100, Math.round((xp / 200) * 100)),
      nextTier: 'Level 2: Trailblazer'
    };
  } else if (xp < 600) {
    return {
      tier: 'Level 2: Trailblazer',
      badge: '⚡ Trailblazer',
      min: 200,
      max: 600,
      progress: Math.min(100, Math.round(((xp - 200) / 400) * 100)),
      nextTier: 'Level 3: Master Wayfarer'
    };
  } else if (xp < 1500) {
    return {
      tier: 'Level 3: Master Wayfarer',
      badge: '💎 Master',
      min: 600,
      max: 1500,
      progress: Math.min(100, Math.round(((xp - 600) / 900) * 100)),
      nextTier: 'Level 4: Legend Explorer'
    };
  } else {
    return {
      tier: 'Level 4: Legend Explorer',
      badge: '👑 Legend',
      min: 1500,
      max: 3000,
      progress: 100,
      nextTier: 'Max Rank'
    };
  }
}

function updateUserLevelUI() {
  const lvl = calculateLevel(userXp);
  const tierBadge = document.getElementById('userTierBadge');
  const xpText = document.getElementById('userXpText');
  const xpFill = document.getElementById('userXpFill');
  const unlockedCount = document.getElementById('unlockedBadgeCount');

  if (tierBadge) tierBadge.textContent = lvl.tier;
  if (xpText) xpText.textContent = `${userXp} / ${lvl.max} XP`;
  if (xpFill) xpFill.style.width = `${lvl.progress}%`;
  if (unlockedCount) unlockedCount.textContent = unlockedBadges.length;
}

function renderBadgesShowcase() {
  const sidebarGrid = document.getElementById('sidebarBadgeGrid');
  if (!sidebarGrid) return;

  sidebarGrid.innerHTML = BADGES_CATALOG.map(badge => {
    const isUnlocked = unlockedBadges.includes(badge.key);
    return `
      <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}" onclick="handleBadgeClick('${badge.key}')">
        <div class="badge-tooltip">
          <strong>${badge.name}</strong><br>
          ${badge.desc}<br>
          <span style="color: #38bdf8;">${isUnlocked ? '✅ Unlocked' : '🔒 Locked'}</span>
        </div>
        <span class="badge-icon">${badge.icon}</span>
        <span class="badge-name">${badge.name}</span>
      </div>
    `;
  }).join('');
}

window.handleBadgeClick = function (key) {
  const badge = BADGES_CATALOG.find(b => b.key === key);
  if (!badge) return;
  const isUnlocked = unlockedBadges.includes(key);

  if (isUnlocked) {
    showToast(`🏅 ${badge.name}: ${badge.desc} (Unlocked!)`);
  } else {
    showToast(`🔒 ${badge.name}: ${badge.desc} (+${badge.xpBonus} XP when unlocked)`);
  }
};

window.awardUserXp = function (amount, reason = 'Travel Discovery', customOrigin = null) {
  userXp += amount;
  localStorage.setItem('hopstop_user_xp', userXp.toString());
  updateUserLevelUI();

  if (typeof triggerFloatingXp === 'function') {
    const originX = customOrigin?.x || window.lastClickEvent?.clientX || (window.innerWidth / 2);
    const originY = customOrigin?.y || window.lastClickEvent?.clientY || 120;
    triggerFloatingXp(amount, originX, originY, amount >= 100);
  }

  showToast(`⭐ +${amount} XP Earned for ${reason}!`);
};

window.unlockBadge = function (key) {
  if (unlockedBadges.includes(key)) return;
  const badge = BADGES_CATALOG.find(b => b.key === key);
  if (!badge) return;

  unlockedBadges.push(key);
  localStorage.setItem('hopstop_unlocked_badges', JSON.stringify(unlockedBadges));
  renderBadgesShowcase();
  updateUserLevelUI();

  if (supabaseClient && currentUser) {
    supabaseClient.from('user_badges').insert([{
      user_handle: currentUser.handle,
      badge_key: badge.key,
      title: badge.name,
      icon: badge.icon,
      description: badge.desc
    }]).then();
  }

  triggerAchievementModal(badge);
};

function triggerAchievementModal(badge) {
  const iconEl = document.getElementById('achievementIcon');
  const titleEl = document.getElementById('achievementTitle');
  const descEl = document.getElementById('achievementDesc');
  const rewardEl = document.getElementById('achievementRewardText');

  if (iconEl) iconEl.textContent = badge.icon;
  if (titleEl) titleEl.textContent = `${badge.name} Unlocked!`;
  if (descEl) descEl.textContent = badge.desc;
  if (rewardEl) rewardEl.textContent = `+${badge.xpBonus || 200} XP Bonus Added to Your Profile!`;

  awardUserXp(badge.xpBonus || 200, `${badge.name} Badge`);

  if (typeof triggerConfetti === 'function') {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }

  if (achievementModal) {
    achievementModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

window.closeAchievementModal = function () {
  if (!achievementModal) return;
  achievementModal.classList.remove('open');
  document.body.style.overflow = '';
};
