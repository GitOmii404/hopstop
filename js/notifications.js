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

window.openWeeklyDigestModal = function () {
  const dropdown = document.getElementById('notificationsDropdown');
  if (dropdown) dropdown.classList.remove('open');
  renderWeeklyDigest();
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

function renderWeeklyDigest() {
  const grid = document.getElementById('weeklyDigestCardsList') || document.getElementById('weeklyDigestGrid');
  if (!grid) return;
  const posts = (typeof postsData !== 'undefined' && Array.isArray(postsData)) ? postsData : [];
  const topGems = [...posts].sort((a, b) => parseFloat(b.gemScore || 0) - parseFloat(a.gemScore || 0)).slice(0, 5);

  grid.innerHTML = topGems.map((gem, idx) => `
    <div class="weekly-digest-card" style="display: flex; gap: 14px; padding: 14px; background: var(--bg-hover); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 12px; cursor: pointer;" onclick="if(typeof openArticleModal==='function') openArticleModal(${gem.id})">
      <img src="${gem.image}" style="width: 100px; height: 100px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0;" alt="${gem.title}">
      <div class="weekly-digest-card-body" style="flex: 1; min-width: 0;">
        <div style="font-size: 0.72rem; font-weight: 700; color: #ea580c; text-transform: uppercase;">#${idx + 1} Editor's Choice • 💎 ${gem.gemScore}/10</div>
        <h4 style="font-weight: 700; font-size: 1rem; margin: 2px 0 4px; color: var(--text-primary);">${gem.placeName}, ${gem.country}</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${gem.excerpt || gem.fullStory || ''}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.74rem;">
          <span style="color: var(--text-secondary);">✍️ ${gem.author?.name || 'Explorer'}</span>
          <span style="color: #0284c7; font-weight: 700;">Explore Stop →</span>
        </div>
      </div>
    </div>
  `).join('');
}
