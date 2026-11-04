// ==========================================================================
// HopStop — Authenticated Social Feed, Stories, and Discovery Stream
// Ultra-High-End Editorial Discovery with Interactive Cartographic HUD
// ==========================================================================

// Safeguard distance calculation function
if (typeof calculateDistance !== 'function') {
  window.calculateDistance = function (lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };
}

function initStories() {
  const tray = document.getElementById('storiesTray');
  if (!tray) return;

  const currentAvatar = (typeof currentUser !== 'undefined' && currentUser && currentUser.avatar)
    ? currentUser.avatar
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  tray.innerHTML = `
    <div class="story-bubble" onclick="openPostModal()">
      <div class="story-ring-wrap unseen" style="border: 2px dashed #06b6d4; background: transparent;">
        <img src="${currentAvatar}" class="story-avatar" alt="My Story">
      </div>
      <span class="story-user-name">+ Your Story</span>
    </div>
  ` + STORIES_DATA.map((story, idx) => `
    <div class="story-bubble" onclick="openStoryViewer(${idx})">
      <div class="story-ring-wrap">
        <img src="${story.avatar}" class="story-avatar" alt="${story.author}">
      </div>
      <span class="story-user-name">${story.author.split(' ')[0]}</span>
    </div>
  `).join('');
}
window.renderStories = initStories;

function renderAppFeed() {
  const container = document.getElementById('socialFeedContainer');
  if (!container) return;

  const currentPosts = (typeof postsData !== 'undefined' && Array.isArray(postsData)) ? postsData : [];

  let filteredPosts = currentPosts.filter(post => {
    if (typeof currentRadiusFilter === 'undefined' || currentRadiusFilter === 'all') return true;
    const userCoords = (typeof userCoordinates !== 'undefined' && userCoordinates) ? userCoordinates : [40.4168, -3.7038];
    const dist = calculateDistance(userCoords[0], userCoords[1], post.coords[0], post.coords[1]);
    return dist <= Number(currentRadiusFilter);
  });

  // Apply Feed Algorithm & Ranking
  const sortMode = typeof currentFeedSortMode !== 'undefined' ? currentFeedSortMode : 'foryou';
  if (sortMode === 'foryou') {
    filteredPosts.sort((a, b) => (parseFloat(b.gemScore) * b.likes) - (parseFloat(a.gemScore) * a.likes));
  } else if (sortMode === 'topgem') {
    filteredPosts.sort((a, b) => parseFloat(b.gemScore) - parseFloat(a.gemScore));
  } else if (sortMode === 'wishlist') {
    filteredPosts.sort((a, b) => {
      const aWish = (typeof savedBookmarks !== 'undefined' && savedBookmarks.includes(a.id)) || (typeof itineraryStops !== 'undefined' && itineraryStops.includes(a.id)) ? 1 : 0;
      const bWish = (typeof savedBookmarks !== 'undefined' && savedBookmarks.includes(b.id)) || (typeof itineraryStops !== 'undefined' && itineraryStops.includes(b.id)) ? 1 : 0;
      return bWish - aWish;
    });
  } else {
    filteredPosts.sort((a, b) => b.id - a.id);
  }

  if (filteredPosts.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <span style="font-size: 2.8rem;">📍</span>
        <h3 style="margin-top: 10px; font-size: 1.2rem;">No Micro-Adventures within ${typeof currentRadiusFilter !== 'undefined' ? currentRadiusFilter : 'your'} km</h3>
        <p style="color: var(--text-muted); max-width: 440px; margin: 6px auto 16px; font-size: 0.9rem;">
          Try expanding your search radius to Worldwide to discover unmapped trails and hidden villages.
        </p>
        <button class="btn-gem" onclick="setRadiusFilter('all')" style="padding: 8px 18px; font-size: 0.85rem;">
          🌍 Explore Worldwide Gems
        </button>
      </div>
    `;
    return;
  }

  const userCoords = (typeof userCoordinates !== 'undefined' && userCoordinates) ? userCoordinates : [40.4168, -3.7038];
  const userLocName = typeof userLocationName !== 'undefined' ? userLocationName : 'Your Location';

  container.innerHTML = filteredPosts.map(post => {
    const isSaved = typeof savedBookmarks !== 'undefined' && savedBookmarks.includes(post.id);
    const isInItinerary = typeof itineraryStops !== 'undefined' && itineraryStops.includes(post.id);
    const authorHandle = `@${(post.author?.name || 'explorer').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const commentCount = (post.comments || []).length;
    const weather = post.weather || { icon: "☀️", temp: "22°C" };
    const checkIns = post.checkInsCount || (12 + (post.id * 3));
    const isChecked = !!post.isCheckedIn;

    // Distance from user's current GPS / City location
    const distKm = calculateDistance(userCoords[0], userCoords[1], post.coords[0], post.coords[1]);
    const distPill = distKm < 15
      ? `🚶 ${distKm} km • Walk/Bike`
      : (distKm < 100
        ? `🚗 ${distKm} km • ${Math.round(distKm / 75 * 60)}m drive`
        : (distKm < 500
          ? `🏕️ ${distKm} km away`
          : `✈️ ${distKm.toLocaleString()} km away`));

    const latStr = post.coords ? `${post.coords[0].toFixed(4)}° N` : '46.5386° N';
    const lngStr = post.coords ? `${post.coords[1].toFixed(4)}° E` : '11.8542° E';

    return `
      <article class="social-card" data-id="${post.id}">
        <!-- Top Card Header -->
        <div class="social-card-header">
          <div class="social-author-wrap">
            <div class="social-avatar-ring">
              <img src="${post.author.avatar}" alt="${post.author.name}" class="social-author-img" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'">
            </div>
            <div class="social-author-text">
              <div class="social-author-name">
                <span>${post.author.name}</span>
                <span class="social-verified-badge" title="Verified Field Explorer">✓</span>
              </div>
              <div class="social-place-location" onclick="focusPostOnMap(${post.id})" style="cursor: pointer;" title="View on interactive world map">
                <span>📍 ${post.placeName}, ${post.country}</span>
                <span class="weather-chip">${weather.icon} ${weather.temp}</span>
              </div>
            </div>
          </div>

          <div class="social-header-actions">
            <span class="card-distance-pill" title="Distance from ${userLocName}">${distPill}</span>
            <button class="btn-been-here ${isChecked ? 'checked' : ''}" onclick="checkInToGem(${post.id})" title="Confirm you've visited this place">
              ${isChecked ? "✅ Visited" : `📍 Been Here (${checkIns})`}
            </button>
          </div>
        </div>

        <!-- 16:10 High-Def Media Frame with Smart Video Poster Fallback -->
        <div class="social-card-media" ondblclick="handleMediaDoubleTap(event, ${post.id})">
          ${post.videoUrl ? `
            <video src="${post.videoUrl}" poster="${post.image}" autoplay loop muted playsinline class="social-video-player" id="feedVideo_${post.id}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"></video>
            <img src="${post.image}" alt="${post.title}" class="video-fallback-img" style="display: none; width: 100%; height: 100%; object-fit: cover;">
            <button class="video-control-btn" onclick="toggleFeedVideoAudio(event, ${post.id})" title="Toggle Audio">🔇</button>
          ` : `
            <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'">
          `}
          
          <!-- Tactile Floating Badges -->
          <div class="gem-score-pill">💎 ${post.gemScore}/10 Underrated</div>
          <div class="crowd-meter-pill">🟢 88% Uncrowded</div>
          <div class="dispatch-stamp-badge">🛰️ DISPATCH #${String(post.id).padStart(3, '0')}</div>
          <div class="flying-heart" id="flyingHeart_${post.id}">❤️</div>
        </div>

        <!-- Interactive Unique Feature: Cartographic Field Radar & Coordinates HUD -->
        <div class="field-radar-hud" id="fieldRadarHud_${post.id}" style="display: none;">
          <div class="radar-hud-header">
            <div>
              <span class="radar-blip-pulse"></span>
              <span>EXPEDITION CARTOGRAPHIC INTEL</span>
            </div>
            <span class="radar-coords">🛰️ ${latStr}, ${lngStr}</span>
          </div>
          <div class="radar-hud-metrics">
            <div class="radar-metric">
              <span class="radar-metric-label">Crowd Status</span>
              <span class="radar-metric-val green">🟢 88% Uncrowded</span>
            </div>
            <div class="radar-metric">
              <span class="radar-metric-label">Access Trail</span>
              <span class="radar-metric-val">${post.transit || 'Footpath / 4x4 Track'}</span>
            </div>
            <div class="radar-metric">
              <span class="radar-metric-label">Best Lighting</span>
              <span class="radar-metric-val">${post.bestTime || 'Golden Hour (35mm)'}</span>
            </div>
            <div class="radar-metric">
              <span class="radar-metric-label">Conservation</span>
              <span class="radar-metric-val blue">🌿 Protected Heritage</span>
            </div>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="social-action-bar">
          <div class="social-action-group">
            <button class="action-icon-btn ${post.isLiked ? 'liked' : ''}" onclick="toggleLike(event, ${post.id})" title="Like">
              ${post.isLiked ? '❤️' : '🤍'} <span class="action-btn-counter">${post.likes.toLocaleString()}</span>
            </button>
            <button class="action-icon-btn" onclick="openArticleModal(${post.id})" title="Comment & Transit Intel">
              💬 <span class="action-btn-counter">${commentCount}</span>
            </button>
            <button class="action-icon-btn ${isInItinerary ? 'in-route' : ''}" onclick="addToItinerary(${post.id})" title="${isInItinerary ? 'In Itinerary Route' : 'Add to Route'}">
              🗺️ <span class="action-btn-text">${isInItinerary ? 'In Route' : '+ Route'}</span>
            </button>
            <button class="action-icon-btn" onclick="toggleFieldRadarHud(${post.id})" title="Toggle GPS Coordinates & Field Radar HUD">
              🧭 <span class="action-btn-text">Radar Intel</span>
            </button>
            <button class="action-icon-btn" onclick="openAddPinModal(${post.id})" title="Co-Save to Dream Board">
              📌
            </button>
            <button class="action-icon-btn" onclick="sharePostLink(${post.id})" title="Share Link">
              🚀
            </button>
            <button class="action-icon-btn" onclick="focusPostOnMap(${post.id})" title="Locate on World Map">
              📍
            </button>
          </div>

          <button class="action-icon-btn btn-bookmark-toggle ${isSaved ? 'saved' : ''}" onclick="toggleBookmark(event, ${post.id})" title="Save to Secret Stops">
            ${isSaved ? '🔖 Saved' : '🔖 Save'}
          </button>
        </div>

        <!-- Caption Headline & Excerpt -->
        <div class="social-caption-wrap">
          <div>
            <span class="social-author-handle">${authorHandle}</span>
            <span class="social-post-headline">${post.title}</span>
          </div>
          <p class="social-post-desc">${post.excerpt}</p>
        </div>

        <!-- Secret Field Intel Notebook Box -->
        <div class="social-secret-tip-box">
          <div class="secret-tip-header">
            <span>🤫 SECRET FIELD INTEL</span>
          </div>
          <p class="secret-tip-text">${post.secretTip}</p>
        </div>

        <!-- Comments Link -->
        <div class="social-view-comments-btn" onclick="openArticleModal(${post.id})">
          ${commentCount > 0 ? `💬 View all ${commentCount} explorer dispatches & route notes...` : '💬 Leave the first expedition tip on this stop...'}
        </div>

        <!-- Inline Comment Form -->
        <form class="social-inline-comment-form" onsubmit="handleInlineCommentSubmit(event, ${post.id})">
          <img src="${(typeof currentUser !== 'undefined' && currentUser && currentUser.avatar) ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}" class="comment-author-avatar" alt="You">
          <input type="text" class="social-comment-input" placeholder="Add field notes, transit advice, or secret coordinates..." required>
          <button type="submit" class="btn-post-comment">Dispatch</button>
        </form>
      </article>
    `;
  }).join('');
}
window.renderAppFeed = renderAppFeed;

window.toggleFieldRadarHud = function (postId) {
  const hud = document.getElementById(`fieldRadarHud_${postId}`);
  if (!hud) return;
  const isHidden = hud.style.display === 'none';
  if (isHidden) {
    hud.style.display = 'flex';
    showToast('🛰️ Field Radar & GPS Coordinates Active');
  } else {
    hud.style.display = 'none';
  }
};

function renderSuggestedUsers() {
  const list = document.getElementById('suggestedUsersList');
  if (!list) return;

  const explorers = (typeof suggestedExplorers !== 'undefined' && Array.isArray(suggestedExplorers)) ? suggestedExplorers : [];

  list.innerHTML = explorers.map((user, idx) => `
    <li class="widget-user-item">
      <div class="widget-user-info">
        <img src="${user.avatar}" class="widget-user-avatar" alt="${user.name}">
        <div>
          <div class="widget-user-name">${user.name}</div>
          <div class="widget-user-meta">${user.meta}</div>
        </div>
      </div>
      <button class="btn-follow ${user.isFollowing ? 'following' : ''}" onclick="toggleFollowExplorer(${idx})">
        ${user.isFollowing ? 'Following' : '+ Follow'}
      </button>
    </li>
  `).join('');
}
window.renderSuggestedUsers = renderSuggestedUsers;

window.toggleFollowExplorer = function (index) {
  if (typeof suggestedExplorers === 'undefined' || !suggestedExplorers[index]) return;
  const exp = suggestedExplorers[index];
  exp.isFollowing = !exp.isFollowing;
  renderSuggestedUsers();
  showToast(exp.isFollowing ? `Following ${exp.name}!` : `Unfollowed ${exp.name}`);
};

window.handleMediaDoubleTap = function (e, postId) {
  const heart = document.getElementById(`flyingHeart_${postId}`);
  if (heart) {
    heart.classList.remove('animate');
    void heart.offsetWidth;
    heart.classList.add('animate');
  }

  if (typeof postsData === 'undefined') return;
  const post = postsData.find(p => p.id === postId);
  if (post && !post.isLiked) {
    post.isLiked = true;
    post.likes += 1;
    if (typeof savePostsData === 'function') savePostsData();
    renderAppFeed();
    if (typeof renderPosts === 'function') renderPosts();
    showToast('Liked this stop! ❤️');

    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
      supabaseClient.from('posts').update({ likes_count: post.likes }).eq('id', postId).then();
    }
  }
};

window.sharePostLink = function (postId) {
  if (typeof postsData === 'undefined') return;
  const post = postsData.find(p => p.id === postId);
  if (!post) return;
  navigator.clipboard?.writeText(window.location.href);
  showToast(`Copied secret link for "${post.placeName}" to clipboard! 📋`);
};

window.handleInlineCommentSubmit = function (e, postId) {
  e.preventDefault();
  const input = e.target.querySelector('.social-comment-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  if (typeof postsData === 'undefined') return;
  const post = postsData.find(p => p.id === postId);
  if (!post) return;

  const authorName = (typeof currentUser !== 'undefined' && currentUser && currentUser.name) ? currentUser.name : 'Fellow Traveler';
  const authorAvatar = (typeof currentUser !== 'undefined' && currentUser && currentUser.avatar) ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80';

  const newComment = {
    id: Date.now(),
    author: authorName,
    avatar: authorAvatar,
    text: text,
    time: 'Just now'
  };

  if (!post.comments) post.comments = [];
  post.comments.unshift(newComment);
  if (typeof savePostsData === 'function') savePostsData();
  input.value = '';

  renderAppFeed();
  if (typeof renderPosts === 'function') renderPosts();
  showToast('Comment posted! 💬');

  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    supabaseClient.from('comments').insert([{
      post_id: postId,
      author_name: authorName,
      author_avatar: authorAvatar,
      text: text
    }]).then(({ error }) => {
      if (error) console.warn('Supabase inline comment error:', error.message);
    });
  }
};

window.toggleFeedVideoAudio = function (e, postId) {
  e.stopPropagation();
  const video = document.getElementById(`feedVideo_${postId}`);
  if (!video) return;

  video.muted = !video.muted;
  e.target.textContent = video.muted ? '🔇' : '🔊';
  showToast(video.muted ? 'Muted video audio 🔇' : 'Playing ambient audio 🔊');
};

// Immediate Execution on Load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initStories();
    renderAppFeed();
    renderSuggestedUsers();
  });
} else {
  initStories();
  renderAppFeed();
  renderSuggestedUsers();
}
