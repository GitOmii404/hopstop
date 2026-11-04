/**
 * HopStop — In-Trip Crew Chat Engine
 */

// ==========================================================================
// In-Trip Crew Chat Engine
// ==========================================================================

window.switchBoardDetailTab = function (tab) {
  const pinsContent = document.getElementById('boardPinsTabContent');
  const chatContent = document.getElementById('boardChatTabContent');
  const pinsBtn = document.getElementById('tabBoardPinsBtn');
  const chatBtn = document.getElementById('tabBoardChatBtn');

  if (tab === 'chat') {
    if (pinsContent) pinsContent.style.display = 'none';
    if (chatContent) chatContent.style.display = 'block';
    pinsBtn?.classList.remove('active');
    chatBtn?.classList.add('active');
    if (activeBoardDetailId) renderTripChat(activeBoardDetailId);
  } else {
    if (pinsContent) pinsContent.style.display = 'block';
    if (chatContent) chatContent.style.display = 'none';
    pinsBtn?.classList.add('active');
    chatBtn?.classList.remove('active');
  }
};

function renderTripChat(boardId) {
  const chatMessagesEl = document.getElementById('tripChatMessages');
  if (!chatMessagesEl) return;

  const messages = tripChatStore[boardId] || [
    {
      id: "msg_1",
      authorName: "Sarah Chen",
      authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      text: "Hey crew! Should we rent a camper van in Split or take ferries along the coastline? 🚐",
      time: "10:30 AM",
      isMine: false
    },
    {
      id: "msg_2",
      authorName: "Maya Lin",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      text: "@sarah Definitely camper van! That way we can park next to the secret emerald spring at sunrise.",
      time: "10:45 AM",
      isMine: true
    }
  ];

  chatMessagesEl.innerHTML = messages.map(m => `
    <div class="chat-msg ${m.isMine ? 'mine' : ''}">
      <img src="${m.authorAvatar}" class="chat-msg-avatar" alt="${m.authorName}">
      <div class="chat-msg-bubble">
        <div class="chat-msg-author">${m.authorName} <span class="chat-msg-time">${m.time}</span></div>
        <div class="chat-msg-text">${m.text}</div>
      </div>
    </div>
  `).join('');

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

window.handleSendTripChatMessage = function (e) {
  e.preventDefault();
  const input = document.getElementById('tripChatInput');
  if (!input || !activeBoardDetailId) return;
  const text = input.value.trim();
  if (!text) return;

  const authorName = currentUser ? currentUser.name : 'Maya Lin';
  const authorAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  if (!tripChatStore[activeBoardDetailId]) {
    tripChatStore[activeBoardDetailId] = [];
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMsg = {
    id: `msg_${Date.now()}`,
    authorName: authorName,
    authorAvatar: authorAvatar,
    text: text,
    time: timeStr,
    isMine: true
  };

  tripChatStore[activeBoardDetailId].push(newMsg);
  localStorage.setItem('hopstop_trip_chat', JSON.stringify(tripChatStore));
  input.value = '';
  renderTripChat(activeBoardDetailId);
  showToast('Trip message sent to crew! 💬');
};

function initEventListeners() {
  // Dream Boards, Photo Battle & Trip Chat Forms
  document.getElementById('createBoardForm')?.addEventListener('submit', handleCreateBoardSubmit);
  document.getElementById('addPinForm')?.addEventListener('submit', handleAddPinSubmit);
  document.getElementById('submitBattleForm')?.addEventListener('submit', handleSubmitBattle);
  document.getElementById('tripChatForm')?.addEventListener('submit', handleSendTripChatMessage);

  // Map Filter Buttons
  document.querySelectorAll('.map-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMapFilter = btn.getAttribute('data-map-filter');
      plotMapPins();
    });
  });

  // User Dropdown & Notification Dropdown in Header
  userMenuTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenuDropdown?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    userMenuDropdown?.classList.remove('open');
    if (notificationsDropdown && !e.target.closest('#notificationsDropdown') && !e.target.closest('.notif-btn-wrap')) {
      notificationsDropdown.classList.remove('open');
    }
  });

  // Modal Submissions
  document.getElementById('sharePlaceForm')?.addEventListener('submit', handlePostFormSubmit);
  document.getElementById('addCommentForm')?.addEventListener('submit', handleModalCommentSubmit);
  document.getElementById('postBountyForm')?.addEventListener('submit', handlePostBountySubmit);
  document.getElementById('solveBountyForm')?.addEventListener('submit', handleSolveBountySubmit);

  // Bounty Category Tabs
  document.querySelectorAll('.bounty-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bounty-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBountyFilter = btn.getAttribute('data-bounty-filter');
      renderBounties();
    });
  });

  // Auth Forms
  document.getElementById('signinForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    loginAsDemo();
  });

  document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim() || 'New Wanderer';
    const handle = `@${name.toLowerCase().replace(/\s+/g, '')}`;
    currentUser = {
      ...DEFAULT_USER,
      name: name,
      handle: handle
    };
    localStorage.setItem('hopstop_auth_user', JSON.stringify(currentUser));
    closeAuthModal();
    syncAuthState();
    showToast(`Welcome to HopStop, ${name}! 🎉`);
  });

  // Supabase Cloud Backend Form Submit
  document.getElementById('cloudConfigForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('supabaseUrlInput')?.value.trim();
    const key = document.getElementById('supabaseKeyInput')?.value.trim();

    if (!url || !key) {
      showToast('Please enter both Supabase Project URL and Anon Key ⚠️');
      return;
    }

    localStorage.setItem(SUPABASE_STORAGE_URL_KEY, url);
    localStorage.setItem(SUPABASE_STORAGE_KEY_KEY, key);
    initSupabase();
    closeCloudModal();
    showToast('⚡ Connected to Supabase Cloud! Syncing live data...');
  });

  // Gallery Shuffle & Filters
  document.getElementById('shuffleGalleryBtn')?.addEventListener('click', () => {
    renderGallery(true);
    showToast('Shuffled photo wall! 🎲');
  });

  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGalleryFilter = btn.getAttribute('data-gallery-filter');
      renderGallery(false);
    });
  });

  // Filter Pills in Landing Page
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderPosts();
    });
  });

  // Search
  document.getElementById('heroSearch')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPosts();
  });

  // Lightbox Close & Controls
  document.getElementById('lightboxCloseBtn')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrevBtn')?.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
  document.getElementById('lightboxNextBtn')?.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

  // Story Close
  document.getElementById('closeStoryBtn')?.addEventListener('click', closeStoryViewer);

  // Mobile Menu
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('navLinks')?.classList.toggle('mobile-open');
  });

  // Window resize -> invalidate map size
  window.addEventListener('resize', () => {
    if (leafletMap) leafletMap.invalidateSize();
  });

  // Listen to hash changes in browser URL
  window.addEventListener('hashchange', () => {
    window.handleHashRouting();
  });

  // Global anchor click interceptor for #hash links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    
    const targetId = href.substring(1);
    const landingSections = ['gallery', 'explore', 'mapSection', 'toolkit', 'contact', 'home'];
    if (landingSections.includes(targetId)) {
      e.preventDefault();
      if (targetId === 'gallery') {
        window.scrollToGallery();
      } else if (targetId === 'mapSection') {
        window.scrollToMap();
      } else if (targetId === 'home') {
        window.switchView('landing', true);
      } else {
        if (currentView !== 'landing') {
          window.switchView('landing', false);
        }
        setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
      history.pushState(null, null, href);
    }
  });

  // ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthModal();
      closePostModal();
      closeArticleModal();
      closeLightbox();
      closeStoryViewer();
      closeTravelPassport();
      closeWeeklyDigestModal();
      closeTripMode();
      closeLeaderboardModal();
      closeCreateBoardModal();
      closeBoardDetail();
      closeAddPinModal();
      closeSubmitBattleModal();
      closeLockedGuideModal();
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    }
  });
}
