/**
 * HopStop — Social Feed Engine (Posts, Likes, Comments, Search, Category Filter)
 */

// ==========================================================================
// Social Feed Engine
// ==========================================================================

function renderStories() {
  if (!storiesTray) return;

  storiesTray.innerHTML = `
    <div class="story-bubble" onclick="openPostModal()">
      <div class="story-ring-wrap unseen" style="border: 2px dashed #06b6d4; background: transparent;">
        <img src="${currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" class="story-avatar" alt="My Story">
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

function renderAppFeed() {
  if (!socialFeedContainer) return;

  let filteredPosts = postsData.filter(post => {
    if (currentRadiusFilter === 'all') return true;
    const dist = calculateDistance(userCoordinates[0], userCoordinates[1], post.coords[0], post.coords[1]);
    return dist <= Number(currentRadiusFilter);
  });

  // Apply Feed Algorithm & Ranking
  if (currentFeedSortMode === 'foryou') {
    // Smart match based on high gem rating, likes, and photo rich content
    filteredPosts.sort((a, b) => (parseFloat(b.gemScore) * b.likes) - (parseFloat(a.gemScore) * a.likes));
  } else if (currentFeedSortMode === 'topgem') {
    filteredPosts.sort((a, b) => parseFloat(b.gemScore) - parseFloat(a.gemScore));
  } else if (currentFeedSortMode === 'wishlist') {
    filteredPosts.sort((a, b) => {
      const aWish = savedBookmarks.includes(a.id) || itineraryStops.includes(a.id) ? 1 : 0;
      const bWish = savedBookmarks.includes(b.id) || itineraryStops.includes(b.id) ? 1 : 0;
      return bWish - aWish;
    });
  } else {
    // Fresh posts (by id descending)
    filteredPosts.sort((a, b) => b.id - a.id);
  }

  if (filteredPosts.length === 0) {
    socialFeedContainer.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <span style="font-size: 2.8rem;">📍</span>
        <h3 style="margin-top: 10px; font-size: 1.2rem;">No Micro-Adventures within ${currentRadiusFilter} km</h3>
        <p style="color: var(--text-muted); max-width: 440px; margin: 6px auto 16px; font-size: 0.9rem;">
          There are no secret spots pinned within ${currentRadiusFilter} km of ${userLocationName}. Expand your search radius or share the first local hidden gem!
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary" style="padding: 8px 16px; font-size: 0.85rem;" onclick="setRadiusFilter(150)">
            🏕️ Expand to 150 km
          </button>
          <button class="btn-gem" style="padding: 8px 16px; font-size: 0.85rem;" onclick="openPostModal()">
            ✨ Post Local Discovery
          </button>
          <button class="btn-popup-read" style="padding: 8px 14px; font-size: 0.85rem;" onclick="setRadiusFilter('all')">
            🌍 View All Worldwide
          </button>
        </div>
      </div>
    `;
    return;
  }

  socialFeedContainer.innerHTML = filteredPosts.map(post => {
    const isSaved = savedBookmarks.includes(post.id);
    const isInItinerary = itineraryStops.includes(post.id);
    const commentCount = post.comments ? post.comments.length : 0;
    const authorHandle = post.author.handle || `@${post.author.name.toLowerCase().replace(/\s+/g, '')}`;
    const weather = getDestinationWeather(post.coords[0], post.coords[1], post.category);
    const checkIns = post.checkInsCount || (12 + (post.id * 3));
    const isChecked = !!post.isCheckedIn;

    // Distance from user's current GPS / City location
    const distKm = calculateDistance(userCoordinates[0], userCoordinates[1], post.coords[0], post.coords[1]);
    const distPill = distKm < 15
      ? `🚶 ${distKm} km • Walk/Bike`
      : (distKm < 100
        ? `🚗 ${distKm} km • ${Math.round(distKm / 75 * 60)}m drive`
        : (distKm < 500
          ? `🏕️ ${distKm} km away`
          : `✈️ ${distKm.toLocaleString()} km away`));

    return `
      <article class="social-card post-card-animated" data-id="${post.id}">
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
              <span class="social-place-location" onclick="focusPostOnMap(${post.id})" style="cursor: pointer;" title="View on interactive world map">
                📍 ${post.placeName}, ${post.country} • <span class="weather-chip">${weather.icon} ${weather.temp}</span>
              </span>
            </div>
          </div>

          <div class="social-header-actions">
            <span class="card-distance-pill" title="Distance from ${userLocationName}">${distPill}</span>
            <button class="btn-been-here ${isChecked ? 'checked' : ''}" onclick="checkInToGem(${post.id})" title="Confirm you've visited this place">
              ${isChecked ? "✅ Visited" : `📍 Been Here (${checkIns})`}
            </button>
            <button class="btn-header-direction" onclick="openDirections(event, '${encodeURIComponent(post.locationQuery)}')" title="1-Tap Directions">
              🧭
            </button>
          </div>
        </div>

        <div class="social-card-media" ondblclick="handleMediaDoubleTap(event, ${post.id})">
          ${post.videoUrl ? `
            <div class="social-video-wrap">
              <video src="${post.videoUrl}" autoplay loop muted playsinline class="social-video-player" id="feedVideo_${post.id}"></video>
              <div class="video-badge-pill">🎥 Motion Reel</div>
              <button class="video-control-btn" onclick="toggleFeedVideoAudio(event, ${post.id})" title="Toggle Audio">🔇</button>
            </div>
          ` : `
            <img src="${post.image}" alt="${post.title}" loading="lazy">
          `}
          <div class="gem-score-pill">💎 ${post.gemScore}/10 Underrated</div>
          <div class="category-pill-tag">${post.category ? post.category.toUpperCase() : 'SECRET SPOT'}</div>
          <div class="flying-heart" id="flyingHeart_${post.id}">❤️</div>
        </div>

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

        <div class="social-caption-wrap">
          <span class="social-author-handle">${authorHandle}</span>
          <span class="social-post-headline">${post.title}</span>
          <p class="social-post-desc">${post.excerpt}</p>
        </div>

        <div class="social-secret-tip-box">
          <div class="secret-tip-header">
            <span>🤫 SECRET FIELD INTEL</span>
          </div>
          <p class="secret-tip-text">${post.secretTip}</p>
        </div>

        <div class="social-view-comments-btn" onclick="openArticleModal(${post.id})">
          ${commentCount > 0 ? `💬 View all ${commentCount} explorer dispatches & route notes...` : '💬 Leave the first expedition tip on this stop...'}
        </div>

        <form class="social-inline-comment-form" onsubmit="handleInlineCommentSubmit(event, ${post.id})">
          <img src="${currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}" class="comment-author-avatar" alt="You">
          <input type="text" class="social-comment-input" placeholder="Add field notes, transit advice, or secret coordinates..." required>
          <button type="submit" class="btn-post-comment">Dispatch</button>
        </form>
      </article>
    `;
  }).join('');
}

function renderSuggestedUsers() {
  if (!suggestedUsersList) return;

  suggestedUsersList.innerHTML = suggestedExplorers.map((user, idx) => `
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

window.toggleFollowExplorer = function (index) {
  const exp = suggestedExplorers[index];
  if (!exp) return;
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

  const post = postsData.find(p => p.id === postId);
  if (post && !post.isLiked) {
    post.isLiked = true;
    post.likes += 1;
    savePostsData();
    renderAppFeed();
    renderPosts();
    showToast('Liked this stop! ❤️');

    if (supabaseClient) {
      supabaseClient.from('posts').update({ likes_count: post.likes }).eq('id', postId).then();
    }
  }
};

window.sharePostLink = function (postId) {
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

  const post = postsData.find(p => p.id === postId);
  if (!post) return;

  const authorName = currentUser ? currentUser.name : 'Fellow Traveler';
  const authorAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80';

  const newComment = {
    id: Date.now(),
    author: authorName,
    avatar: authorAvatar,
    text: text,
    time: 'Just now'
  };

  if (!post.comments) post.comments = [];
  post.comments.unshift(newComment);
  savePostsData();
  input.value = '';

  renderAppFeed();
  renderPosts();
  showToast('Comment posted! 💬');

  if (supabaseClient) {
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
