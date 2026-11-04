/**
 * HopStop — Theme Management, Auth Modals, and Main View Router
 */

// ==========================================================================
// Theme Management (Synced with Leaflet Tiles)
// ==========================================================================

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

  if (currentUser) {
    if (authHeaderActions) authHeaderActions.style.display = 'flex';
    if (guestHeaderActions) guestHeaderActions.style.display = 'none';

    currentUserNameEls.forEach(el => el.textContent = currentUser.name);
    currentUserAvatarEls.forEach(el => el.src = currentUser.avatar);
  } else {
    if (authHeaderActions) authHeaderActions.style.display = 'none';
    if (guestHeaderActions) guestHeaderActions.style.display = 'flex';
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
  currentUser = { ...DEFAULT_USER };
  localStorage.setItem('hopstop_auth_user', JSON.stringify(currentUser));
  closeAuthModal();
  syncAuthState();
  if (typeof showToast === 'function') showToast(`👋 Welcome back, ${currentUser.name}! Demo profile activated.`);
};

window.handleSignOut = function () {
  currentUser = null;
  localStorage.removeItem('hopstop_auth_user');
  if (typeof window.closeUserMenu === 'function') window.closeUserMenu();
  syncAuthState();
  if (typeof showToast === 'function') showToast('Signed out of HopStop.');
};

window.logout = window.handleUserLogout = window.handleSignOut;

window.toggleUserMenu = function (e) {
  if (e) {
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }
  const dropdown = document.getElementById('userMenuDropdown');
  const wrap = document.querySelector('.user-menu-wrap');
  if (!dropdown) return;

  const willOpen = !dropdown.classList.contains('open');

  // Close notifications dropdown if open
  const notifDropdown = document.getElementById('notificationsDropdown');
  if (notifDropdown) notifDropdown.classList.remove('open');

  if (willOpen) {
    // Sync latest XP & tier in user menu
    if (typeof userXp !== 'undefined') {
      const xpValEl = document.querySelector('.user-dropdown-xp-val');
      const xpFillEl = document.querySelector('.user-dropdown-xp-fill');
      if (xpValEl) xpValEl.innerHTML = '<strong>' + userXp + '</strong> / 600 XP';
      if (xpFillEl) xpFillEl.style.width = Math.min(100, Math.round((userXp / 600) * 100)) + '%';
    }
    dropdown.classList.add('open');
    if (wrap) wrap.classList.add('open');
  } else {
    dropdown.classList.remove('open');
    if (wrap) wrap.classList.remove('open');
  }
};

window.closeUserMenu = function () {
  const dropdown = document.getElementById('userMenuDropdown');
  const wrap = document.querySelector('.user-menu-wrap');
  if (dropdown) dropdown.classList.remove('open');
  if (wrap) wrap.classList.remove('open');
};

// Global click listener to close user dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu-wrap')) {
    window.closeUserMenu();
  }
});
