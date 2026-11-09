/**
 * HopStop — Notification Center & Weekly Digest Engine
 */

// ==========================================================================
// Notification Center & Weekly Digest Engine
// ==========================================================================

function getNotifications() {
  if (typeof notificationsData !== 'undefined' && Array.isArray(notificationsData)) {
    return notificationsData;
  }
  if (typeof notificationsList !== 'undefined' && Array.isArray(notificationsList)) {
    return notificationsList;
  }
  if (typeof NOTIFICATIONS_DATA !== 'undefined' && Array.isArray(NOTIFICATIONS_DATA)) {
    return NOTIFICATIONS_DATA;
  }
  return [];
}

window.toggleNotificationDropdown = function (e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('notificationsDropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('open');
  renderNotifications();
};

function renderNotifications() {
  const listEl = document.getElementById('notificationsList');
  const badgeEl = document.getElementById('notifBadgeDot') || document.getElementById('notifBadgeCount');
  const unreadCountEl = document.getElementById('notifUnreadCount');
  const list = getNotifications();

  const unreadCount = list.filter(n => n.isUnread || !n.read).length;
  if (badgeEl) {
    badgeEl.textContent = unreadCount;
    badgeEl.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }
  if (unreadCountEl) {
    unreadCountEl.textContent = unreadCount;
  }

  if (!listEl) return;
  if (list.length === 0) {
    listEl.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No notifications right now</div>';
    return;
  }

  listEl.innerHTML = list.map(notif => `
    <div class="notif-item ${notif.isUnread || !notif.read ? 'unread' : ''}" style="padding: 10px 12px; display: flex; gap: 10px; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="handleNotificationClick('${notif.id}')">
      <div class="notif-item-icon" style="font-size: 1.4rem;">${notif.icon || '🔔'}</div>
      <div class="notif-item-content" style="flex: 1; min-width: 0;">
        <div class="notif-item-title" style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">${notif.title}</div>
        <div class="notif-item-desc" style="font-size: 0.76rem; color: var(--text-muted); margin: 2px 0;">${notif.desc}</div>
        <div class="notif-item-time" style="font-size: 0.7rem; color: #0284c7;">${notif.time}</div>
      </div>
    </div>
  `).join('');
}

window.markAllNotificationsRead = function () {
  const list = getNotifications();
  list.forEach(n => {
    n.read = true;
    n.isUnread = false;
  });
  localStorage.setItem('hopstop_notifications', JSON.stringify(list));
  renderNotifications();
  if (typeof showToast === 'function') showToast('All notifications marked as read ✓');
};

window.handleNotificationClick = function (notifId) {
  const list = getNotifications();
  const notif = list.find(n => n.id === notifId);
  if (!notif) return;
  notif.read = true;
  notif.isUnread = false;
  localStorage.setItem('hopstop_notifications', JSON.stringify(list));
  renderNotifications();

  const dropdown = document.getElementById('notificationsDropdown');
  if (dropdown) dropdown.classList.remove('open');

  if (notif.action) {
    try {
      eval(notif.action);
    } catch (e) {
      console.log('Action eval:', e);
    }
  } else if (notif.actionType === 'article' && typeof openArticleModal === 'function') {
    openArticleModal(notif.targetId);
  } else if (notif.actionType === 'digest') {
    openWeeklyDigestModal();
  } else if (notif.actionType === 'board') {
    if (typeof openBoardDetail === 'function') openBoardDetail(notif.targetId);
  } else if (notif.actionType === 'battle') {
    window.location.href = 'battles.html';
  }
};

let currentDigestFilter = 'all';

window.openWeeklyDigestModal = function () {
  const dropdown = document.getElementById('notificationsDropdown');
  if (dropdown) dropdown.classList.remove('open');
  currentDigestFilter = 'all';
  renderWeeklyDigest('all');
  const modal = document.getElementById('weeklyDigestModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeWeeklyDigestModal = function () {
  const modal = document.getElementById('weeklyDigestModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

window.filterWeeklyDigest = function (category) {
  currentDigestFilter = category;
  document.querySelectorAll('.digest-tab-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-filter') === category);
  });
  renderWeeklyDigest(category);
};

window.saveAllDigestGems = function () {
  const posts = (typeof postsData !== 'undefined' && Array.isArray(postsData)) ? postsData : [];
  const topGems = [...posts].sort((a, b) => parseFloat(b.gemScore || 0) - parseFloat(a.gemScore || 0)).slice(0, 5);
  
  if (typeof savedBookmarks !== 'undefined') {
    topGems.forEach(g => {
      if (!savedBookmarks.includes(g.id)) {
        savedBookmarks.push(g.id);
      }
    });
    localStorage.setItem('hopstop_saved', JSON.stringify(savedBookmarks));
    if (typeof renderBucketList === 'function') renderBucketList();
  }
  showToast('🎉 All 5 Editor Choice gems saved to your Dream Board!');
};

function renderWeeklyDigest(filter = currentDigestFilter) {
  const grid = document.getElementById('weeklyDigestCardsList') || document.getElementById('weeklyDigestGrid');
  if (!grid) return;
  const posts = (typeof postsData !== 'undefined' && Array.isArray(postsData)) ? postsData : [];

  let candidates = [...posts];
  if (filter !== 'all') {
    candidates = candidates.filter(p => p.category === filter);
  }

  // Pick top 5 by gemScore
  const topGems = candidates.sort((a, b) => parseFloat(b.gemScore || 0) - parseFloat(a.gemScore || 0)).slice(0, 5);

  if (topGems.length === 0) {
    grid.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-muted);">No destinations found for this category.</div>';
    return;
  }

  grid.innerHTML = topGems.map((gem, idx) => {
    const isSaved = typeof savedBookmarks !== 'undefined' && savedBookmarks.includes(gem.id);
    const authorAvatar = gem.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
    const authorName = gem.author?.name || 'Explorer';
    const rankLabel = `#${idx + 1} Top Pick`;
    const seasonBudget = `${gem.bestTime ? '🌤️ ' + gem.bestTime : ''}${gem.budget ? ' • ' + gem.budget : ''}`;

    return `
      <div class="weekly-digest-card" onclick="if(typeof openArticleModal==='function') openArticleModal(${gem.id})">
        <div class="digest-card-thumb-wrap">
          <img src="${gem.image}" alt="${gem.placeName}" class="digest-card-thumb" loading="lazy">
          <div class="digest-rank-badge">${rankLabel}</div>
          <div class="digest-score-overlay">💎 ${gem.gemScore}/10</div>
        </div>
        <div class="digest-card-body">
          <div class="digest-meta-row">
            <span class="digest-category-badge">${gem.categoryLabel || gem.category} &bull; ${gem.country}</span>
            <span class="digest-season-pill">${seasonBudget}</span>
          </div>
          <h3 class="digest-card-title">${gem.placeName}</h3>
          <p class="digest-card-desc">${gem.excerpt || gem.title}</p>
          ${gem.secretTip ? `
            <div class="digest-secret-memo">
              <strong>🤫 Traveler Intel:</strong> ${gem.secretTip}
            </div>
          ` : ''}
          <div class="digest-card-footer">
            <div class="digest-author-capsule">
              <img src="${authorAvatar}" alt="${authorName}" class="digest-author-avatar">
              <span class="digest-author-name">By ${authorName}</span>
            </div>
            <div class="digest-actions-group" onclick="event.stopPropagation()">
              <button type="button" class="btn-digest-direction" onclick="openDirections(event, '${encodeURIComponent(gem.locationQuery || gem.placeName)}')">
                <span>🧭 Directions</span>
              </button>
              <button type="button" class="btn-digest-direction" onclick="toggleBookmark(event, ${gem.id})">
                <span>${isSaved ? '📌 Saved' : '📌 Co-Save'}</span>
              </button>
              <button type="button" class="btn-digest-explore" onclick="openArticleModal(${gem.id})">
                <span>Explore &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
