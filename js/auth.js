/**
 * HopStop — Theme Management, Auth Modals, and Main View Router
 */

// Safe Toast Utility
if (typeof window.showToast !== 'function') {
  window.showToast = function (msg) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0f172a;color:#ffffff;padding:10px 18px;border-radius:999px;font-size:0.85rem;font-weight:600;z-index:99999;box-shadow:0 10px 25px rgba(0,0,0,0.3);transition:all 0.3s ease;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      if (toast) toast.style.opacity = '0';
    }, 2800);
  };
}

window.initTheme = function () {
  const savedTheme = localStorage.getItem('hopstop_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
};

window.toggleTheme = function () {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('hopstop_theme', newTheme);
  updateThemeIcon(newTheme);
  if (typeof updateMapTiles === 'function') updateMapTiles();
  if (typeof showToast === 'function') showToast(`Switched to ${newTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode!`);
};

window.updateThemeIcon = function (theme) {
  document.querySelectorAll('#themeToggle, .theme-toggle-btn').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
};

// ==========================================================================
// Authentication & Routing Engine
// ==========================================================================

function syncAuthState() {
  const authHeaderActions = document.getElementById('authHeaderActions');
  const guestHeaderActions = document.getElementById('guestHeaderActions');
  const currentUserNameEls = document.querySelectorAll('.current-user-name');
  const currentUserAvatarEls = document.querySelectorAll('.current-user-avatar');
  const currentUserHandleEls = document.querySelectorAll('.current-user-handle');
  const sidebarUserLevelCard = document.getElementById('sidebarUserLevelCard');
  const sidebarGuestStatusCard = document.getElementById('sidebarGuestStatusCard');
  const sidebarGuestCard = document.getElementById('sidebarGuestCard');
  const guestFeedComposerBanner = document.getElementById('guestFeedComposerBanner');
  const feedCreateBox = document.querySelector('.feed-create-box');
  const messengerGuestBanners = document.querySelectorAll('.messenger-guest-banner');
  const userMenuTierBadges = document.querySelectorAll('.user-dropdown-tier-badge, .user-dropdown-tier');
  const userMenuXpWraps = document.querySelectorAll('.user-dropdown-xp-card, .user-dropdown-xp-progress');

  if (currentUser) {
    if (authHeaderActions) authHeaderActions.style.display = 'flex';
    if (guestHeaderActions) guestHeaderActions.style.display = 'none';
    messengerGuestBanners.forEach(b => b.style.display = 'none');

    const rawName = currentUser.name || '';
    const cleanName = (rawName.trim().length > 0 && /[\w]/.test(rawName)) ? rawName.trim() : (currentUser.isGuest ? 'Guest Explorer' : 'Maya Lin');
    const rawHandle = currentUser.handle || '';
    const cleanHandle = (rawHandle.length > 1 && /[\w]/.test(rawHandle)) ? rawHandle : (currentUser.isGuest ? '@guest_explorer' : '@mayawanders');

    if (currentUser.isGuest) {
      // Guest User state: can view & DM, but no fake level/XP or composer
      if (sidebarUserLevelCard) sidebarUserLevelCard.style.display = 'none';
      if (sidebarGuestStatusCard) sidebarGuestStatusCard.style.display = 'block';
      if (sidebarGuestCard) sidebarGuestCard.style.display = 'block';
      if (feedCreateBox) feedCreateBox.style.display = 'none';
      if (guestFeedComposerBanner) guestFeedComposerBanner.style.display = 'block';
      userMenuTierBadges.forEach(b => b.innerHTML = '🔞 18+ Verified &bull; Guest Explorer');
      userMenuXpWraps.forEach(w => w.style.display = 'none');

      currentUserNameEls.forEach(el => el.textContent = cleanName);
      currentUserAvatarEls.forEach(el => el.src = currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
      currentUserHandleEls.forEach(el => el.textContent = cleanHandle);
    } else {
      // Full Signed-in Member state
      if (sidebarUserLevelCard) sidebarUserLevelCard.style.display = 'block';
      if (sidebarGuestStatusCard) sidebarGuestStatusCard.style.display = 'none';
      if (sidebarGuestCard) sidebarGuestCard.style.display = 'none';
      if (feedCreateBox) feedCreateBox.style.display = 'block';
      if (guestFeedComposerBanner) guestFeedComposerBanner.style.display = 'none';
      userMenuTierBadges.forEach(b => b.textContent = '⚡ Level 2: Trailblazer');
      userMenuXpWraps.forEach(w => w.style.display = 'block');

      currentUserNameEls.forEach(el => el.textContent = cleanName);
      currentUserAvatarEls.forEach(el => el.src = currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
      currentUserHandleEls.forEach(el => el.textContent = cleanHandle);

      if (typeof userXp !== 'undefined') {
        const xpValEl = document.querySelector('.user-dropdown-xp-val');
        const xpFillEl = document.querySelector('.user-dropdown-xp-fill');
        if (xpValEl) xpValEl.innerHTML = '<strong>' + userXp + '</strong> / 600 XP';
        if (xpFillEl) xpFillEl.style.width = Math.min(100, Math.round((userXp / 600) * 100)) + '%';
      }
    }
  } else {
    // Unauthenticated state
    if (authHeaderActions) authHeaderActions.style.display = 'none';
    if (guestHeaderActions) guestHeaderActions.style.display = 'flex';
    if (sidebarUserLevelCard) sidebarUserLevelCard.style.display = 'none';
    if (sidebarGuestStatusCard) sidebarGuestStatusCard.style.display = 'block';
    if (sidebarGuestCard) sidebarGuestCard.style.display = 'block';
    if (feedCreateBox) feedCreateBox.style.display = 'none';
    if (guestFeedComposerBanner) guestFeedComposerBanner.style.display = 'block';
    messengerGuestBanners.forEach(b => b.style.display = 'flex');
  }

  if (typeof window.initUserMenuTrigger === 'function') {
    window.initUserMenuTrigger();
  }
}

window.switchView = function (viewName, shouldScrollTop = true) {
  currentView = viewName;

  const viewUrlMap = {
    'landing': 'index.html',
    'app': 'feed.html',
    'dreamboards': 'boards.html',
    'battles': 'battles.html',
    'itinerary': 'planner.html',
    'bounty': 'bounties.html',
    'publications': 'publications.html'
  };

  const landingView = document.getElementById('landingView');
  const appView = document.getElementById('appView');
  const bountyView = document.getElementById('bountyView');
  const itineraryView = document.getElementById('itineraryView');
  const publicationsView = document.getElementById('publicationsView');
  const dreamBoardsView = document.getElementById('dreamBoardsView');
  const photoBattlesView = document.getElementById('photoBattlesView');

  const views = [landingView, appView, bountyView, itineraryView, publicationsView, dreamBoardsView, photoBattlesView];
  const targetViewEl = 
    viewName === 'app' ? appView :
    viewName === 'dreamboards' ? dreamBoardsView :
    viewName === 'battles' ? photoBattlesView :
    viewName === 'bounty' ? bountyView :
    viewName === 'itinerary' ? itineraryView :
    viewName === 'publications' ? publicationsView : landingView;

  // If target view element is present on this page, activate it
  if (targetViewEl) {
    views.forEach(v => {
      if (v) v.classList.remove('active-view');
    });

    const sidebarFeedBtn = document.getElementById('sidebarFeedBtn');
    const sidebarBoardsBtn = document.getElementById('sidebarBoardsBtn');
    const sidebarBattlesBtn = document.getElementById('sidebarBattlesBtn');
    const sidebarBountyBtn = document.getElementById('sidebarBountyBtn');
    const sidebarItineraryBtn = document.getElementById('sidebarItineraryBtn');
    const sidebarPubBtn = document.getElementById('sidebarPubBtn');

    sidebarFeedBtn?.classList.remove('active');
    sidebarBoardsBtn?.classList.remove('active');
    sidebarBattlesBtn?.classList.remove('active');
    sidebarBountyBtn?.classList.remove('active');
    sidebarItineraryBtn?.classList.remove('active');
    sidebarPubBtn?.classList.remove('active');

    // Update header nav link active states
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    if (viewName === 'app') {
      appView?.classList.add('active-view');
      sidebarFeedBtn?.classList.add('active');
      if (typeof renderPosts === 'function') renderPosts();
      if (typeof renderStories === 'function') renderStories();
      if (shouldScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'dreamboards') {
      dreamBoardsView?.classList.add('active-view');
      sidebarBoardsBtn?.classList.add('active');
      if (typeof renderDreamBoards === 'function') renderDreamBoards();
      if (typeof renderLockedGuides === 'function') renderLockedGuides();
      if (shouldScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'battles') {
      photoBattlesView?.classList.add('active-view');
      sidebarBattlesBtn?.classList.add('active');
      if (typeof renderPhotoBattles === 'function') renderPhotoBattles();
      if (shouldScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'bounty') {
      bountyView?.classList.add('active-view');
      sidebarBountyBtn?.classList.add('active');
      if (typeof renderBounties === 'function') renderBounties();
      if (shouldScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'itinerary') {
      itineraryView?.classList.add('active-view');
      sidebarItineraryBtn?.classList.add('active');
      if (typeof renderItineraryView === 'function') renderItineraryView();
      if (shouldScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        if (typeof itineraryMap !== 'undefined' && itineraryMap) itineraryMap.invalidateSize();
      }, 300);
    } else if (viewName === 'publications') {
      publicationsView?.classList.add('active-view');
      sidebarPubBtn?.classList.add('active');
      if (typeof renderPublications === 'function') renderPublications();
      if (shouldScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      landingView?.classList.add('active-view');
      if (shouldScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        if (typeof leafletMap !== 'undefined' && leafletMap) leafletMap.invalidateSize();
      }, 300);
    }
  } else if (viewUrlMap[viewName]) {
    // Navigate cleanly to the dedicated multi-page HTML file
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath !== viewUrlMap[viewName]) {
      window.location.href = viewUrlMap[viewName];
    }
  }
};

window.openAuthModal = function (tab = 'signin') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  switchAuthTab(tab);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeAuthModal = function () {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

window.switchAuthTab = function (tab) {
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');
  const tabSigninBtn = document.getElementById('tabSigninBtn');
  const tabSignupBtn = document.getElementById('tabSignupBtn');

  if (tab === 'signup') {
    if (signinForm) signinForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
    tabSigninBtn?.classList.remove('active');
    tabSignupBtn?.classList.add('active');
  } else {
    if (signinForm) signinForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
    tabSigninBtn?.classList.add('active');
    tabSignupBtn?.classList.remove('active');
  }
};

window.loginAsDemo = function () {
  currentUser = { ...DEFAULT_USER, isGuest: false };
  localStorage.setItem('hopstop_auth_user', JSON.stringify(currentUser));
  closeAuthModal();
  syncAuthState();
  if (typeof showToast === 'function') showToast(`👋 Welcome back, ${currentUser.name}! Full Member access unlocked.`);
  
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  if (redirect && redirect.endsWith('.html')) {
    window.location.href = redirect;
  } else if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '') {
    window.location.href = 'feed.html';
  } else {
    window.location.reload();
  }
};

window.loginAsGuest = function () {
  if (typeof openGuestEntryModal === 'function') {
    openGuestEntryModal();
  } else {
    // Universal 18+ enforcement: redirect to login.html with guest modal open
    const currentPath = window.location.pathname.split('/').pop() || 'feed.html';
    window.location.href = 'login.html?guest=open&redirect=' + encodeURIComponent(currentPath);
  }
};

window.handleSignOut = function () {
  currentUser = null;
  localStorage.removeItem('hopstop_auth_user');
  if (typeof window.closeUserMenu === 'function') window.closeUserMenu();
  syncAuthState();
  if (typeof showToast === 'function') showToast('Signed out of HopStop.');
  if (window.location.pathname.endsWith('feed.html')) {
    window.location.replace('index.html');
  } else {
    window.location.reload();
  }
};

window.logout = window.handleUserLogout = window.handleSignOut;

window.openUserMenu = function () {
  const dropdown = document.getElementById('userMenuDropdown');
  const wrap = document.querySelector('.user-menu-wrap');
  const trigger = document.getElementById('userMenuTrigger');
  if (!dropdown) return;

  // Close notifications dropdown if open
  const notifDropdown = document.getElementById('notificationsDropdown');
  if (notifDropdown) notifDropdown.classList.remove('open');

  dropdown.classList.add('open');
  if (wrap) wrap.classList.add('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
};

window.closeUserMenu = function () {
  const dropdown = document.getElementById('userMenuDropdown');
  const wrap = document.querySelector('.user-menu-wrap');
  const trigger = document.getElementById('userMenuTrigger');
  if (dropdown) dropdown.classList.remove('open');
  if (wrap) wrap.classList.remove('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
};

window.toggleUserMenu = function (e) {
  if (e) {
    if (e._hopstopMenuHandled) return;
    e._hopstopMenuHandled = true;
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }

  // Guard against rapid duplicate trigger within 250ms
  const now = Date.now();
  if (window._lastUserMenuToggle && (now - window._lastUserMenuToggle) < 250) {
    return;
  }
  window._lastUserMenuToggle = now;

  const dropdown = document.getElementById('userMenuDropdown');
  if (!dropdown) return;

  const isCurrentlyOpen = dropdown.classList.contains('open');
  if (isCurrentlyOpen) {
    window.closeUserMenu();
  } else {
    window.openUserMenu();
  }
};

window.initUserMenuTrigger = function () {
  const triggers = document.querySelectorAll('#userMenuTrigger, .user-avatar-btn');
  triggers.forEach(btn => {
    // If the button already has an inline onclick handler for toggleUserMenu, DO NOT bind another listener
    const onclickAttr = btn.getAttribute('onclick') || '';
    if (onclickAttr.includes('toggleUserMenu')) {
      return;
    }
    if (!btn._menuTriggerBound) {
      btn._menuTriggerBound = true;
      btn.addEventListener('click', (e) => {
        window.toggleUserMenu(e);
      });
    }
  });
};

// Global click listener to close user dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu-wrap')) {
    window.closeUserMenu();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initUserMenuTrigger);
} else {
  window.initUserMenuTrigger();
}

window.handleFeedNavClick = function (e) {
  if (!currentUser) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    window.location.href = 'login.html?redirect=feed.html';
    return false;
  }
  if (!e || !e.currentTarget || e.currentTarget.tagName !== 'A') {
    window.location.href = 'feed.html';
  }
  return true;
};

// Check if URL has ?auth=required or ?auth=signin
(function checkAuthUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'required' || params.get('auth') === 'signin') {
      setTimeout(() => {
        if (typeof openAuthModal === 'function') openAuthModal('signin');
        if (typeof showToast === 'function') {
          showToast('🔒 Please sign in to access the Social Feed and Direct Messages!');
        }
      }, 250);
    }
  } catch (e) {}
})();
