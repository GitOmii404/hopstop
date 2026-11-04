/**
 * HopStop — Landing Discover Grid, Photo Wall & Lightbox Modal
 */

// ==========================================================================
// Landing Discover Grid & Photo Wall
// ==========================================================================

function renderPosts() {
  if (!postsGrid) return;

  const filtered = postsData.filter(post => {
    const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    postsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px;" class="reveal visible">
        <div style="font-size: 3rem; margin-bottom: 12px;">🗺️</div>
        <h3>No hidden stops found</h3>
        <p style="color: var(--text-muted); margin: 8px 0 20px;">Be the first to share an underrated stop here!</p>
        <button class="btn-gem" onclick="openPostModal()">+ Post a Hidden Stop</button>
      </div>
    `;
    return;
  }

  postsGrid.innerHTML = filtered.map((post, idx) => {
    const isSaved = savedBookmarks.includes(post.id);
    const delay = (idx * 0.06).toFixed(2);
    const commentCount = post.comments ? post.comments.length : 0;

    return `
      <article class="post-card tilt-card post-card-animated" data-id="${post.id}" style="animation-delay: ${delay}s;">
        <div class="post-image-wrap">
          <img src="${post.image}" alt="${post.placeName}" loading="lazy">
          <div class="card-stamp-badge"><span>★</span> OFF-GRID FIND</div>
          <div class="post-gem-badge">💎 Gem Score: ${post.gemScore}/10</div>

          <div class="post-action-overlay">
            <button class="post-action-btn ${post.isLiked ? 'liked' : ''}" onclick="toggleLike(event, ${post.id})" title="Like">
              ${post.isLiked ? '❤️' : '🤍'}
            </button>
            <button class="post-action-btn ${isSaved ? 'saved' : ''}" onclick="toggleBookmark(event, ${post.id})" title="Save">
              ${isSaved ? '📌' : '➕'}
            </button>
          </div>
        </div>

        <div class="post-body">
          <div class="post-location-bar">
            <span class="post-location-name" onclick="focusPostOnMap(${post.id})" style="cursor: pointer;">
              📍 ${post.placeName}, ${post.country}
            </span>
            <button class="btn-direction" onclick="openDirections(event, '${encodeURIComponent(post.locationQuery)}')">
              🧭 Directions
            </button>
          </div>

          <h3 class="post-title" onclick="openArticleModal(${post.id})">${post.title}</h3>
          <p class="post-excerpt">${post.excerpt}</p>

          <div class="post-secret-tip-pill">
            <strong>🤫 Secret Tip:</strong> ${post.secretTip}
          </div>

          <div class="post-footer">
            <div class="post-author">
              <img src="${post.author.avatar}" alt="${post.author.name}" class="author-img">
              <div class="author-info">
                <span class="author-name">${post.author.name}</span>
                <span class="post-date">${post.date}</span>
              </div>
            </div>

            <div class="post-interactions">
              <span class="interactive-chip" onclick="toggleLike(event, ${post.id})">
                ${post.isLiked ? '❤️' : '🤍'} ${post.likes}
              </span>
              <span class="interactive-chip" onclick="openArticleModal(${post.id})">
                💬 ${commentCount}
              </span>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  initTiltEffect();
}

let isGalleryPaused = false;

function renderGallery(shouldShuffle = false) {
  const trackTop = document.getElementById('galleryTrackTop');
  const trackBottom = document.getElementById('galleryTrackBottom');
  if (!trackTop && !trackBottom) return;

  let items = [...GALLERY_POOL];
  if (currentGalleryFilter && currentGalleryFilter !== 'all') {
    items = items.filter(item => item.category === currentGalleryFilter);
  }
  if (shouldShuffle) {
    items = items.sort(() => Math.random() - 0.5);
  }

  displayedGalleryItems = items;

  if (items.length === 0) {
    if (trackTop) {
      trackTop.innerHTML = `<div style="padding: 40px; color: var(--text-muted); font-weight: 600;">No photos in this category.</div>`;
    }
    if (trackBottom) trackBottom.innerHTML = '';
    return;
  }

  // Split into two rows for dual opposing continuous streams
  const half = Math.ceil(items.length / 2);
  let topList = items.slice(0, half);
  let bottomList = items.slice(half);

  if (bottomList.length === 0) bottomList = [...topList];

  // Duplicate items to ensure seamless infinite looping without gaps
  let topLoop = [...topList];
  while (topLoop.length < 12) {
    topLoop = topLoop.concat(topList);
  }
  topLoop = topLoop.concat(topLoop); // Duplicate for seamless 0% -> -50% loop

  let bottomLoop = [...bottomList];
  while (bottomLoop.length < 12) {
    bottomLoop = bottomLoop.concat(bottomList);
  }
  bottomLoop = bottomLoop.concat(bottomLoop); // Duplicate for seamless -50% -> 0% loop

  const tilts = [-1.8, 1.4, -0.9, 1.8, -1.4, 2.0, -1.2, 1.1];
  const cameraNotes = ["🎞️ Portra 400", "📷 Leica M6", "🎞️ Kodak Gold", "📷 Fuji X-T5", "🎞️ Cinestill 800T", "📷 Hasselblad 500C"];

  const renderCard = (item, originalIdx) => {
    const tilt = tilts[originalIdx % tilts.length];
    const cameraTag = cameraNotes[originalIdx % cameraNotes.length];
    const itemNum = String(item.id).padStart(3, '0');

    return `
      <div class="gallery-card-carousel polaroid-slide-card" 
           style="--card-tilt: ${tilt}deg; --wind-delay: ${-(originalIdx * 0.72) % 4.8}s;" 
           data-card-index="${originalIdx}"
           data-base-tilt="${tilt}"
           onclick="openGalleryLightbox(${originalIdx})" 
           title="Click to view 35mm slide and camera notes">
        
        <!-- Washi Tape Mount Strip (Top-Center) -->
        <div class="card-washi-tape"></div>

        <!-- Punched Brass Eyelet with Tied Japanese Red Silk Knot (Akai Ito Musubi) -->
        <div class="postcard-puncture" title="Tied with Akai Ito red silk knot">
          <div class="akai-eyelet-knot">
            <svg viewBox="-16 -8 32 34" width="32" height="34" class="eyelet-knot-svg">
              <defs>
                <filter id="knotShadow-${item.id}" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="rgba(25, 5, 5, 0.4)" />
                </filter>
              </defs>
              <g filter="url(#knotShadow-${item.id})">
                <!-- Left Dangling Red Silk Cord Tail -->
                <path d="M -3 2 C -7 8, -8 15, -6 21" fill="none" stroke="#dc2626" stroke-width="2.6" stroke-linecap="round" />
                <!-- Left Cord Gold Aglet / Tip -->
                <path d="M -6.8 18 C -6.5 19.5, -6.2 21, -6 21.5" fill="none" stroke="#facc15" stroke-width="2.6" stroke-linecap="round" />
                <!-- Right Dangling Red Silk Cord Tail -->
                <path d="M 3 2 C 7 8, 8 15, 6 21" fill="none" stroke="#b91c1c" stroke-width="2.6" stroke-linecap="round" />
                <!-- Right Cord Gold Aglet / Tip -->
                <path d="M 6.8 18 C 6.5 19.5, 6.2 21, 6 21.5" fill="none" stroke="#facc15" stroke-width="2.6" stroke-linecap="round" />
                <!-- Through-the-Hole Loop (Entering from the front) -->
                <path d="M -6 -4 C -8 3, 8 3, 6 -4" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
                <!-- Main Tied Knot Coil -->
                <ellipse cx="0" cy="1.5" rx="5" ry="3.2" fill="#dc2626" stroke="#991b1b" stroke-width="0.8" />
                <!-- Gold Kumihimo Center Wrap -->
                <rect x="-2.8" y="-0.2" width="5.6" height="3.4" rx="0.8" fill="#facc15" stroke="#ca8a04" stroke-width="0.5" />
                <!-- Knot Silk Luster Highlight -->
                <circle cx="-1" cy="1" r="1" fill="#fef08a" />
              </g>
            </svg>
          </div>
        </div>

        <div class="polaroid-photo-frame">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
          <span class="polaroid-badge-chip">${item.badge}</span>
          <div class="polaroid-hover-curtain">
            <span class="hover-inspect-btn">🔍 View 35mm Slide</span>
          </div>
        </div>

        <!-- Studio & Field Caption Bar -->
        <div class="polaroid-caption-bar">
          <div class="polaroid-title-row">
            <h4 class="polaroid-place-title">${item.title}</h4>
            <span class="polaroid-serial">#${itemNum}</span>
          </div>
          <div class="polaroid-meta-row">
            <span class="polaroid-location">📍 ${item.location}</span>
            <span class="polaroid-camera-tag">${cameraTag}</span>
          </div>
        </div>
      </div>
    `;
  };

  if (trackTop) {
    trackTop.innerHTML = topLoop.map(item => {
      const origIdx = displayedGalleryItems.findIndex(i => i.id === item.id);
      return renderCard(item, origIdx >= 0 ? origIdx : 0);
    }).join('');
  }

  if (trackBottom) {
    trackBottom.innerHTML = bottomLoop.map(item => {
      const origIdx = displayedGalleryItems.findIndex(i => i.id === item.id);
      return renderCard(item, origIdx >= 0 ? origIdx : 0);
    }).join('');
  }

  // Initialize and weave the interactive threads through all postcards
  if (typeof window.initPostcardThreads === 'function') {
    requestAnimationFrame(() => {
      window.initPostcardThreads();
    });
  }
}

window.toggleGalleryPause = function () {
  isGalleryPaused = !isGalleryPaused;
  const tracks = document.querySelectorAll('.gallery-carousel-track');
  tracks.forEach(track => {
    track.classList.toggle('paused', isGalleryPaused);
  });

  const playIcon = document.getElementById('galleryPlayIcon');
  const playText = document.getElementById('galleryPlayText');
  const indicator = document.getElementById('galleryLiveIndicator');
  const liveText = document.getElementById('galleryLiveText');

  if (playIcon) playIcon.textContent = isGalleryPaused ? '▶️' : '⏸️';
  if (playText) playText.textContent = isGalleryPaused ? 'Play Reel' : 'Pause Reel';
  if (indicator) indicator.classList.toggle('paused', isGalleryPaused);
  if (liveText) liveText.textContent = isGalleryPaused ? 'Reel Paused' : 'Streaming Live';

  showToast(`Reel stream ${isGalleryPaused ? 'paused ⏸️' : 'resumed ▶️'}`);
};

window.nudgeGallery = function (direction) {
  const tracks = document.querySelectorAll('.gallery-carousel-track');
  tracks.forEach(track => {
    const shift = direction === 'left' ? -320 : 320;
    track.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    const computed = window.getComputedStyle(track);
    const matrix = new DOMMatrixReadOnly(computed.transform);
    track.style.transform = `translateX(${matrix.m41 + shift}px)`;

    setTimeout(() => {
      track.style.transition = '';
      track.style.transform = '';
      if (isGalleryPaused) {
        track.classList.add('paused');
      } else {
        track.classList.remove('paused');
      }
    }, 450);
  });
  if (typeof showToast === 'function') {
    showToast(direction === 'left' ? '⏪ Reel scrubbed backward' : '⏩ Reel scrubbed forward');
  }
};

window.setGalleryFilter = function (filterCategory, btnEl) {
  currentGalleryFilter = filterCategory;
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    document.querySelector(`.gallery-filter-btn[data-gallery-filter="${filterCategory}"]`)?.classList.add('active');
  }
  renderGallery(false);
};

window.shuffleGallery = function () {
  const shuffleBtn = document.getElementById('shuffleGalleryBtn');
  const icon = shuffleBtn?.querySelector('.shuffle-icon');
  if (icon) {
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => { icon.style.transform = ''; }, 500);
  }
  renderGallery(true);
  showToast('Photo stream randomized! 🎲');
};

// Lightbox
window.openGalleryLightbox = function (index) {
  if (!displayedGalleryItems || displayedGalleryItems.length === 0) return;
  currentLightboxIndex = index;
  updateLightboxView();
  const lightboxModal = document.getElementById('lightboxModal');
  lightboxModal?.classList.add('open');
  document.body.style.overflow = 'hidden';
};

function updateLightboxView() {
  const item = displayedGalleryItems[currentLightboxIndex];
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  if (!item || !lightboxImg) return;

  lightboxImg.src = item.image;
  if (lightboxCaption) {
    lightboxCaption.textContent = `${item.title} — 📍 ${item.location} (${currentLightboxIndex + 1} / ${displayedGalleryItems.length})`;
  }
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + displayedGalleryItems.length) % displayedGalleryItems.length;
  updateLightboxView();
}

function closeLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  lightboxModal?.classList.remove('open');
  document.body.style.overflow = '';
}

// Directions
window.openDirections = function (e, encodedQuery) {
  if (e) e.stopPropagation();
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`;
  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  showToast('Opening live Google Maps directions... 🧭');
};

// Likes
window.toggleLike = function (e, postId) {
  if (e) e.stopPropagation();
  const post = postsData.find(p => p.id === postId);
  if (!post) return;

  if (post.isLiked) {
    post.isLiked = false;
    post.likes = Math.max(0, post.likes - 1);
  } else {
    post.isLiked = true;
    post.likes += 1;
    if (typeof triggerHeartBurst === 'function') {
      const x = e ? e.clientX : window.innerWidth / 2;
      const y = e ? e.clientY : 150;
      triggerHeartBurst(x, y);
    }
    awardUserXp(10, `Liking ${post.placeName}`);
    showToast('Liked this hidden gem! ❤️');
  }

  savePostsData();
  renderAppFeed();
  renderPosts();

  if (activePostForModal && activePostForModal.id === postId) {
    updateModalLikeState(post);
  }

  if (supabaseClient) {
    supabaseClient.from('posts')
      .update({ likes_count: post.likes })
      .eq('id', postId)
      .then(({ error }) => {
        if (error) console.warn('Supabase like sync error:', error.message);
      });
  }
};

// Saved Bucket List
window.toggleBookmark = function (e, postId) {
  if (e) e.stopPropagation();
  const post = postsData.find(p => p.id === postId);
  const index = savedBookmarks.indexOf(postId);
  if (index > -1) {
    savedBookmarks.splice(index, 1);
    showToast('Removed from saved bucket list 🔖');
  } else {
    savedBookmarks.push(postId);
    awardUserXp(15, `Saving ${post ? post.placeName : 'Stop'} to Bucket List`);
    showToast('Saved to your private Bucket List! 📌');
  }
  localStorage.setItem('hopstop_saved', JSON.stringify(savedBookmarks));
  renderAppFeed();
  renderPosts();
  renderBucketList();
};

function renderBucketList() {
  if (bucketCountBadge) bucketCountBadge.textContent = savedBookmarks.length;

  const badgeEl = document.getElementById('itineraryStopsBadge');
  if (badgeEl) {
    badgeEl.textContent = `${savedBookmarks.length} ${savedBookmarks.length === 1 ? 'Stop' : 'Stops'} Saved`;
  }

  if (!bucketListContainer) return;

  const savedList = postsData.filter(p => savedBookmarks.includes(p.id));
  const footerEl = document.getElementById('toolkitFooter');

  if (savedList.length === 0) {
    bucketListContainer.innerHTML = `
      <div class="itinerary-empty-deck">
        <div class="empty-deck-icon-wrap">
          <span class="empty-deck-compass">🧭</span>
        </div>
        <h4>Your Expedition Deck is Ready</h4>
        <p>You haven't saved any secret waypoints yet. Explore the hidden gems across our interactive map or community photowall, and tap <strong>🔖 Save Stop</strong> on any destination to curate your private travel itinerary.</p>
        <div class="empty-deck-actions">
          <a href="#mapSection" class="btn-gem" style="text-decoration: none; padding: 9px 20px; font-size: 0.84rem;">
            🌍 Explore Live Interactive Map
          </a>
          <a href="#gallery" class="btn-popup-read" style="text-decoration: none; padding: 9px 18px; font-size: 0.84rem;">
            📸 Browse Photo Wall Stream
          </a>
        </div>
      </div>
    `;
    if (footerEl) footerEl.innerHTML = '';
    return;
  }

  bucketListContainer.innerHTML = savedList.map((item, index) => `
    <div class="bucket-item post-card-animated">
      <div class="bucket-item-index">${String(index + 1).padStart(2, '0')}</div>
      <div class="bucket-item-media" onclick="openArticleModal(${item.id})" title="Click to view full photo dossier">
        <img src="${item.image}" alt="${item.title}">
        <span class="bucket-item-tag">${item.categoryLabel || 'Waypoint'}</span>
      </div>
      <div class="bucket-item-info">
        <div class="bucket-item-title-row">
          <h4 onclick="openArticleModal(${item.id})">${item.placeName}</h4>
          <span class="bucket-item-country">${item.country}</span>
        </div>
        <div class="bucket-item-meta-pills">
          <span class="meta-pill gem">💎 ${item.gemScore}/10 Underrated</span>
          <span class="meta-pill season">☀️ ${item.bestTime || 'Year-round'}</span>
          <span class="meta-pill budget">💰 ${item.budget || '$40 - $70 / day'}</span>
        </div>
        <p class="bucket-item-excerpt">${item.excerpt || ''}</p>
      </div>
      <div class="bucket-item-actions">
        <button type="button" class="btn-action-map" onclick="focusPostOnMap(${item.id})" title="Center Diamond Pin on Map">
          <span>🗺️</span> <span>Locate</span>
        </button>
        <button type="button" class="btn-action-nav" onclick="openDirections(event, '${encodeURIComponent(item.locationQuery)}')" title="Navigate via Google Maps GPS">
          <span>🧭</span> <span>Directions</span>
        </button>
        <button type="button" class="btn-action-dossier" onclick="openArticleModal(${item.id})" title="Read Full Secret Journal & Coordinates">
          <span>📖</span> <span>Dossier</span>
        </button>
        <button type="button" class="btn-action-del" onclick="toggleBookmark(event, ${item.id})" title="Remove from Itinerary">
          ✕
        </button>
      </div>
    </div>
  `).join('');

  if (footerEl) {
    footerEl.innerHTML = `
      <div class="toolkit-footer-bar">
        <div class="toolkit-footer-stats">
          <span class="stat-bubble"><strong>${savedList.length}</strong> Waypoints</span>
          <span class="stat-bubble"><strong>~${savedList.length * 95} km</strong> Total Distance</span>
          <span class="stat-bubble verified">🌿 Leave-No-Trace Route</span>
        </div>
        <div class="toolkit-footer-buttons">
          <button type="button" class="btn-popup-read" onclick="clearAllBookmarks()" style="font-size: 0.78rem; padding: 7px 14px; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
            🗑️ Clear Itinerary
          </button>
          <a href="planner.html" class="btn-gem" style="text-decoration: none; padding: 8px 20px; font-size: 0.84rem; display: inline-flex; align-items: center; gap: 6px;">
            🚀 Calculate Turn-by-Turn Route →
          </a>
        </div>
      </div>
    `;
  }
}

window.clearAllBookmarks = function () {
  if (confirm('Clear all saved stops from your itinerary?')) {
    savedBookmarks = [];
    localStorage.setItem('hopstop_saved', JSON.stringify(savedBookmarks));
    renderAppFeed();
    renderPosts();
    renderBucketList();
    if (typeof showToast === 'function') showToast('Cleared itinerary stops 🧹');
  }
};

// Post Creation Form
window.openPostModal = function () {
  if (!currentUser || currentUser.isGuest) {
    if (typeof showToast === 'function') {
      showToast('🔒 Please sign in to post hidden gems! Guests can browse & chat.');
    }
    setTimeout(() => {
      window.location.href = 'login.html?redirect=feed.html';
    }, 1200);
    return;
  }
  const postPlaceModal = document.getElementById('postPlaceModal');
  if (!postPlaceModal) return;
  postPlaceModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closePostModal = function () {
  const postPlaceModal = document.getElementById('postPlaceModal');
  if (!postPlaceModal) return;
  postPlaceModal.classList.remove('open');
  document.body.style.overflow = '';
};

function handlePostFormSubmit(e) {
  e.preventDefault();

  const placeName = document.getElementById('formPlaceName').value.trim();
  const country = document.getElementById('formCountry').value.trim();
  const title = document.getElementById('formTitle').value.trim();
  const category = document.getElementById('formCategory').value;
  const gemScore = document.getElementById('formGemScore').value || "9.8";
  const image = document.getElementById('formImage').value.trim() || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80';
  const videoUrl = document.getElementById('formVideo')?.value.trim();
  const locationQuery = document.getElementById('formLocationQuery').value.trim() || `${placeName}, ${country}`;
  const coordinatesInput = document.getElementById('formCoordinates')?.value.trim();
  const bestTime = document.getElementById('formBestTime').value.trim() || 'Spring & Autumn';
  const budget = document.getElementById('formBudget').value.trim() || '$40 - $70 / day';
  const secretTip = document.getElementById('formSecretTip').value.trim() || 'Arrive at sunrise for magical mist views.';
  const story = document.getElementById('formStory').value.trim();

  // Parse GPS coordinates or use fallback based on category
  let coords = [40.0 + (Math.random() * 10 - 5), 15.0 + (Math.random() * 20 - 10)];
  if (coordinatesInput && coordinatesInput.includes(',')) {
    const parts = coordinatesInput.split(',').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      coords = parts;
    }
  }

  const authorName = currentUser ? currentUser.name : 'Fellow Explorer';
  const authorAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
  const authorHandle = currentUser ? currentUser.handle : `@${authorName.toLowerCase().replace(/\s+/g, '')}`;

  const categoryLabels = {
    nature: 'Natural Wonder',
    village: 'Hidden Village',
    coastal: 'Coastal Secret',
    culture: 'Cultural Sanctuary',
    ruins: 'Ancient Relic'
  };

  const newPost = {
    id: Date.now(),
    title: title,
    placeName: placeName,
    country: country,
    locationQuery: locationQuery,
    coords: coords,
    gemScore: gemScore,
    category: category,
    categoryLabel: categoryLabels[category] || 'Underrated Stop',
    readTime: '4 min read',
    date: 'Just now',
    bestTime: bestTime,
    budget: budget,
    videoUrl: videoUrl || null,
    author: {
      name: authorName,
      handle: authorHandle,
      avatar: authorAvatar
    },
    image: image,
    excerpt: story.substring(0, 140) + '...',
    secretTip: secretTip,
    fullContent: `
      <h4>About ${placeName}</h4>
      <p>${story}</p>
      <h4>Best Season & Budget</h4>
      <p>Recommended during <strong>${bestTime}</strong>. Estimated budget: <strong>${budget}</strong>.</p>
    `,
    likes: 1,
    isLiked: true,
    comments: []
  };

  postsData.unshift(newPost);
  savePostsData();
  renderAppFeed();
  renderPosts();
  plotMapPins(); // Plot new pin on Leaflet world map!
  closePostModal();
  document.getElementById('sharePlaceForm')?.reset();

  if (typeof triggerConfetti === 'function') {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }

  showToast(`🎉 "${placeName}" published to Feed & Map!`);
  focusPostOnMap(newPost.id);

  // Award XP and check badges
  awardUserXp(100, `Sharing ${placeName}`);
  if (coordinatesInput && coordinatesInput.includes(',')) unlockBadge('cartographer');
  if (secretTip && secretTip.length > 10) unlockBadge('scribe');
  if (parseFloat(gemScore) >= 9.8) unlockBadge('gemhunter');

  // Sync to Supabase PostgreSQL Database if connected
  if (supabaseClient) {
    supabaseClient.from('posts').insert([{
      title: title,
      place_name: placeName,
      country: country,
      location_query: locationQuery,
      lat: coords[0],
      lng: coords[1],
      gem_score: gemScore,
      category: category,
      category_label: categoryLabels[category] || 'Underrated Stop',
      read_time: '4 min read',
      best_time: bestTime,
      budget: budget,
      video_url: videoUrl || null,
      author_name: authorName,
      author_handle: authorHandle,
      author_avatar: authorAvatar,
      image_url: image,
      excerpt: story.substring(0, 140) + '...',
      secret_tip: secretTip,
      full_content: `<h4>About ${placeName}</h4><p>${story}</p><h4>Best Season & Budget</h4><p>Recommended during <strong>${bestTime}</strong>. Estimated budget: <strong>${budget}</strong>.</p>`,
      likes_count: 1
    }]).then(({ error }) => {
      if (error) {
        console.warn('Supabase post insert failed:', error.message);
      } else {
        fetchCloudPosts();
      }
    });
  }
}

// Article Detail Modal
window.openArticleModal = function (id) {
  const post = postsData.find(p => p.id === id);
  const articleModal = document.getElementById('articleModal');
  if (!post || !articleModal) return;

  activePostForModal = post;

  document.getElementById('modalHeroImg').src = post.image;
  document.getElementById('modalTag').textContent = post.categoryLabel;
  document.getElementById('modalGemScore').textContent = `💎 Gem Score: ${post.gemScore}/10`;
  document.getElementById('modalTitle').textContent = post.title;
  document.getElementById('modalLocationText').textContent = `📍 ${post.placeName}, ${post.country}`;
  document.getElementById('modalAuthorInfo').innerHTML = `Shared by <strong>${post.author.name}</strong> • ${post.date} • ⏱️ ${post.readTime}`;
  document.getElementById('modalSecretTipText').textContent = post.secretTip;
  document.getElementById('modalBody').innerHTML = post.fullContent;

  // Live Destination Weather Radar
  const weather = getDestinationWeather(post.coords[0], post.coords[1], post.category);
  const modalWeatherIcon = document.getElementById('modalWeatherIcon');
  const modalWeatherTemp = document.getElementById('modalWeatherTemp');
  const modalWeatherCondition = document.getElementById('modalWeatherCondition');
  const modalBestSeasonPill = document.getElementById('modalBestSeasonPill');

  if (modalWeatherIcon) modalWeatherIcon.textContent = weather.icon;
  if (modalWeatherTemp) modalWeatherTemp.textContent = weather.temp;
  if (modalWeatherCondition) modalWeatherCondition.textContent = weather.condition;
  if (modalBestSeasonPill) modalBestSeasonPill.textContent = weather.bestSeason;

  const modalAddItineraryBtn = document.getElementById('modalAddItineraryBtn');
  if (modalAddItineraryBtn) {
    const isInItinerary = itineraryStops.includes(post.id);
    modalAddItineraryBtn.textContent = isInItinerary ? '✅ In Itinerary' : '🗺️ + Itinerary';
    modalAddItineraryBtn.onclick = () => {
      addToItinerary(post.id);
      modalAddItineraryBtn.textContent = '✅ In Itinerary';
    };
  }

  const modalDirectionsBtn = document.getElementById('modalDirectionsBtn');
  if (modalDirectionsBtn) {
    modalDirectionsBtn.onclick = () => openDirections(null, encodeURIComponent(post.locationQuery));
  }

  const modalViewOnMapBtn = document.getElementById('modalViewOnMapBtn');
  if (modalViewOnMapBtn) {
    modalViewOnMapBtn.onclick = () => {
      closeArticleModal();
      focusPostOnMap(post.id);
    };
  }

  updateModalLikeState(post);
  renderModalComments(post);

  articleModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

function updateModalLikeState(post) {
  const modalLikeBtn = document.getElementById('modalLikeBtn');
  const modalLikeCount = document.getElementById('modalLikeCount');
  if (!modalLikeBtn || !modalLikeCount) return;

  modalLikeCount.textContent = post.likes;
  modalLikeBtn.innerHTML = `${post.isLiked ? '❤️' : '🤍'} <span>${post.likes}</span> Likes`;
  modalLikeBtn.onclick = () => toggleLike(null, post.id);
}

function renderModalComments(post) {
  const commentsList = document.getElementById('commentsList');
  const commentsCount = document.getElementById('commentsCount');
  if (!commentsList || !commentsCount) return;

  const comments = post.comments || [];
  commentsCount.textContent = comments.length;

  if (comments.length === 0) {
    commentsList.innerHTML = `<li style="color: var(--text-muted); padding: 14px 0;">No comments yet. Be the first to share your thoughts!</li>`;
    return;
  }

  commentsList.innerHTML = comments.map(c => `
    <li class="comment-item post-card-animated">
      <img src="${c.avatar}" alt="${c.author}" class="comment-avatar">
      <div class="comment-content">
        <div class="comment-meta">
          <span class="comment-name">${c.author}</span>
          <span class="comment-time">${c.time}</span>
        </div>
        <p class="comment-text">${c.text}</p>
      </div>
    </li>
  `).join('');
}

function handleModalCommentSubmit(e) {
  e.preventDefault();
  if (!activePostForModal) return;

  const nameInput = document.getElementById('commentAuthorInput');
  const textInput = document.getElementById('commentTextInput');
  const text = textInput.value.trim();
  if (!text) return;

  const author = currentUser ? currentUser.name : (nameInput.value.trim() || 'Wanderer');
  const avatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80';

  const newComment = {
    id: Date.now(),
    author: author,
    avatar: avatar,
    text: text,
    time: 'Just now'
  };

  if (!activePostForModal.comments) activePostForModal.comments = [];
  activePostForModal.comments.unshift(newComment);
  savePostsData();

  renderModalComments(activePostForModal);
  renderAppFeed();
  renderPosts();

  textInput.value = '';
  showToast('Comment posted! 💬');

  // Sync to Supabase PostgreSQL Database if connected
  if (supabaseClient) {
    supabaseClient.from('comments').insert([{
      post_id: activePostForModal.id,
      author_name: author,
      author_avatar: avatar,
      text: text
    }]).then(({ error }) => {
      if (error) {
        console.warn('Supabase comment insert failed:', error.message);
      } else {
        fetchCloudPosts();
      }
    });
  }
}

window.closeArticleModal = function () {
  const articleModal = document.getElementById('articleModal');
  if (!articleModal) return;
  articleModal.classList.remove('open');
  document.body.style.overflow = '';
  activePostForModal = null;
};

// Toast Notifications
function showToast(message) {
  const container = document.getElementById('toastContainer') || toastContainer;
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
window.showToast = showToast;

function savePostsData() {
  localStorage.setItem('hopstop_community_posts', JSON.stringify(postsData));
}
