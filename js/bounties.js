/**
 * HopStop — Community Travel Bounty Board Engine
 */

// ==========================================================================
// Community Travel Bounty Board Engine
// ==========================================================================

function renderBounties() {
  const bountyGrid = document.getElementById('bountyGrid');
  if (!bountyGrid) return;

  const activeCount = bountiesData.filter(b => b.status === 'active').length;
  const solvedCount = bountiesData.filter(b => b.status === 'solved').length;
  const totalXp = bountiesData.reduce((acc, b) => acc + (b.rewardXp || 0), 0);

  const countBadge = document.getElementById('bountyTotalCount');
  if (countBadge) countBadge.textContent = bountiesData.length;

  const solvedBadge = document.getElementById('bountySolvedCount');
  if (solvedBadge) solvedBadge.textContent = solvedCount;

  const activePill = document.getElementById('bountyActiveQuestsCount');
  if (activePill) activePill.textContent = activeCount;

  const xpPill = document.getElementById('bountyXpPool');
  if (xpPill) xpPill.textContent = totalXp.toLocaleString();

  const solvedPill = document.getElementById('bountySolvedTotalCount');
  if (solvedPill) solvedPill.textContent = solvedCount;

  const filtered = bountiesData.filter(b => {
    if (currentBountyFilter === 'all') return true;
    if (currentBountyFilter === 'high-reward') return b.rewardXp >= 600;
    if (currentBountyFilter === 'solved') return b.status === 'solved';
    return b.category === currentBountyFilter;
  });

  if (filtered.length === 0) {
    bountyGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <span style="font-size: 3rem;">🏹</span>
        <h3 style="margin-top: 10px;">No bounties in this category</h3>
        <p style="color: var(--text-muted); margin: 6px 0 16px;">Have a specific secret spot you are looking for? Post a bounty!</p>
        <button class="btn-gem" onclick="openPostBountyModal()">+ Post a Travel Bounty</button>
      </div>
    `;
    return;
  }

  bountyGrid.innerHTML = filtered.map(b => {
    const isSolved = b.status === 'solved';
    return `
      <div class="bounty-card ${isSolved ? 'solved' : ''} post-card-animated">
        <div>
          <div class="bounty-card-header">
            <span class="bounty-reward-pill">💎 +${b.rewardXp} XP</span>
            <span class="bounty-status-tag ${isSolved ? 'solved' : 'active'}">
              ${isSolved ? '✅ Solved' : '🔥 Open Bounty'}
            </span>
          </div>

          <h3 class="bounty-title">${b.title}</h3>
          <p class="bounty-desc">${b.description}</p>
          <div class="bounty-target-meta">
            <span>📍 Target: ${b.targetRegion}</span>
          </div>
        </div>

        <div>
          <div class="bounty-footer">
            <div class="bounty-creator">
              <img src="${b.creatorAvatar}" alt="${b.creatorName}">
              <div>
                <div class="bounty-creator-name">${b.creatorName}</div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">${b.createdAt || 'Recent'}</span>
              </div>
            </div>

            ${isSolved
        ? `<div style="text-align: right;">
             <span style="font-size: 0.78rem; font-weight: 700; color: #10b981; display: block;">✅ Solved by ${b.solvedBy || 'Explorer'}</span>
             ${b.solvedPlace ? `<span style="font-size: 0.7rem; color: var(--text-muted); display: block;">📍 ${b.solvedPlace}</span>` : ''}
           </div>`
        : `<button class="btn-gem" style="padding: 6px 14px; font-size: 0.8rem; background: linear-gradient(135deg, #10b981, #059669);" onclick="openSolveBountyModal(${b.id})">🎯 Claim & Solve</button>`
      }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.setBountyFilter = function (filterKey, btnEl) {
  currentBountyFilter = filterKey;
  document.querySelectorAll('.bounty-tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    document.querySelector(`.bounty-tab-btn[data-bounty-filter="${filterKey}"]`)?.classList.add('active');
  }
  renderBounties();
};

window.openPostBountyModal = function () {
  const postBountyModal = document.getElementById('postBountyModal');
  if (!postBountyModal) return;
  postBountyModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closePostBountyModal = function () {
  const postBountyModal = document.getElementById('postBountyModal');
  if (!postBountyModal) return;
  postBountyModal.classList.remove('open');
  document.body.style.overflow = '';
};

window.handlePostBountySubmit = function (e) {
  e.preventDefault();
  const title = document.getElementById('bountyTitleInput')?.value.trim();
  const category = document.getElementById('bountyCategoryInput')?.value;
  const rewardXp = parseInt(document.getElementById('bountyRewardInput')?.value) || 750;
  const region = document.getElementById('bountyRegionInput')?.value.trim();
  const desc = document.getElementById('bountyDescInput')?.value.trim();

  if (!title || !region || !desc) return;

  const creatorName = currentUser ? currentUser.name : 'Adventurer';
  const creatorAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  const newBounty = {
    id: Date.now(),
    creatorName: creatorName,
    creatorAvatar: creatorAvatar,
    title: title,
    description: desc,
    category: category,
    targetRegion: region,
    rewardXp: rewardXp,
    status: 'active',
    solvedBy: null,
    solvedPlace: null,
    createdAt: 'Just now'
  };

  bountiesData.unshift(newBounty);
  localStorage.setItem('hopstop_bounties', JSON.stringify(bountiesData));
  renderBounties();
  closePostBountyModal();
  document.getElementById('postBountyForm')?.reset();

  if (typeof triggerConfetti === 'function') {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }

  awardUserXp(50, 'Posting a Bounty');
  showToast('🏹 Travel Bounty published to the community board!');

  if (supabaseClient) {
    supabaseClient.from('bounties').insert([{
      creator_name: creatorName,
      creator_avatar: creatorAvatar,
      title: title,
      description: desc,
      category: category,
      target_region: region,
      reward_xp: rewardXp,
      status: 'active'
    }]).then();
  }
};

window.openSolveBountyModal = function (bountyId) {
  const solveBountyModal = document.getElementById('solveBountyModal');
  const bounty = bountiesData.find(b => b.id === Number(bountyId));
  if (!bounty || !solveBountyModal) return;

  const idInput = document.getElementById('solveBountyId');
  const rewardInput = document.getElementById('solveBountyRewardXp');
  const titleEl = document.getElementById('solveBountyRequestTitle');
  const descEl = document.getElementById('solveBountyRequestDesc');
  const subEl = document.getElementById('solveBountyHeaderSubtitle');

  if (idInput) idInput.value = bounty.id;
  if (rewardInput) rewardInput.value = bounty.rewardXp;
  if (titleEl) titleEl.textContent = `Request: ${bounty.title}`;
  if (descEl) descEl.textContent = `Target: ${bounty.targetRegion} — ${bounty.description}`;
  if (subEl) subEl.textContent = `Solve this request to claim +${bounty.rewardXp} XP and unlock 'Bounty Hunter' badge!`;

  solveBountyModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeSolveBountyModal = function () {
  const solveBountyModal = document.getElementById('solveBountyModal');
  if (!solveBountyModal) return;
  solveBountyModal.classList.remove('open');
  document.body.style.overflow = '';
};

window.handleSolveBountySubmit = function (e) {
  e.preventDefault();
  const bountyId = parseInt(document.getElementById('solveBountyId')?.value);
  const rewardXp = parseInt(document.getElementById('solveBountyRewardXp')?.value) || 500;
  const placeName = document.getElementById('solvePlaceName')?.value.trim();
  const country = document.getElementById('solveCountry')?.value.trim();
  const photoUrl = document.getElementById('solvePhotoUrl')?.value.trim();
  const secretTip = document.getElementById('solveSecretTip')?.value.trim();
  const story = document.getElementById('solveStory')?.value.trim();

  const bounty = bountiesData.find(b => b.id === bountyId);
  if (!bounty) return;

  const solverName = currentUser ? currentUser.name : 'Community Explorer';
  const solverAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
  const solverHandle = currentUser ? currentUser.handle : `@${solverName.toLowerCase().replace(/\s+/g, '')}`;

  // Mark bounty as solved
  bounty.status = 'solved';
  bounty.solvedBy = solverName;
  bounty.solvedPlace = `${placeName}, ${country}`;
  localStorage.setItem('hopstop_bounties', JSON.stringify(bountiesData));
  renderBounties();

  // Create an authentic community post from this solution
  const newPost = {
    id: Date.now(),
    title: `[Bounty Solved] ${placeName}: ${bounty.title}`,
    placeName: placeName,
    country: country,
    locationQuery: `${placeName}, ${country}`,
    coords: [42.0 + (Math.random() * 6 - 3), 14.0 + (Math.random() * 12 - 6)],
    gemScore: "9.9",
    category: bounty.category || 'nature',
    categoryLabel: '🎯 Verified Bounty Solution',
    readTime: '4 min read',
    date: 'Just now',
    bestTime: 'Year-round',
    budget: '$35 - $65 / day',
    author: {
      name: solverName,
      handle: solverHandle,
      avatar: solverAvatar
    },
    image: photoUrl,
    excerpt: story.substring(0, 140) + '...',
    secretTip: secretTip,
    fullContent: `
      <h4>🎯 Verified Solution for: "${bounty.title}"</h4>
      <p>${story}</p>
      <h4>Traveler Secret Transit Tip</h4>
      <p>${secretTip}</p>
    `,
    likes: 12,
    isLiked: true,
    comments: [
      {
        id: Date.now() + 1,
        author: bounty.creatorName,
        avatar: bounty.creatorAvatar,
        text: `Thank you so much ${solverName}! This is exactly what I was searching for! ⭐`,
        time: 'Just now'
      }
    ]
  };

  postsData.unshift(newPost);
  savePostsData();
  renderAppFeed();
  renderPosts();
  plotMapPins();

  closeSolveBountyModal();
  document.getElementById('solveBountyForm')?.reset();

  if (typeof triggerConfetti === 'function') {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }

  // Award XP and unlock Bounty Hunter Badge!
  awardUserXp(rewardXp, `Solving "${bounty.title}"`);
  unlockBadge('bountyhunter');

  if (supabaseClient) {
    supabaseClient.from('bounties').update({
      status: 'solved',
      solved_by: solverName,
      solved_place: `${placeName}, ${country}`
    }).eq('id', bountyId).then();

    supabaseClient.from('posts').insert([{
      title: newPost.title,
      place_name: newPost.placeName,
      country: newPost.country,
      location_query: newPost.locationQuery,
      lat: newPost.coords[0],
      lng: newPost.coords[1],
      gem_score: newPost.gemScore,
      category: newPost.category,
      category_label: newPost.categoryLabel,
      read_time: newPost.readTime,
      best_time: newPost.bestTime,
      budget: newPost.budget,
      author_name: newPost.author.name,
      author_handle: newPost.author.handle,
      author_avatar: newPost.author.avatar,
      image_url: newPost.image,
      excerpt: newPost.excerpt,
      secret_tip: newPost.secretTip,
      full_content: newPost.fullContent,
      likes_count: newPost.likes
    }]).then();
  }
};

window.switchAuthTab = function (tab) {
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');
  const tabSigninBtn = document.getElementById('tabSigninBtn');
  const tabSignupBtn = document.getElementById('tabSignupBtn');

  if (tab === 'signin') {
    signinForm.style.display = 'flex';
    signupForm.style.display = 'none';
    tabSigninBtn?.classList.add('active');
    tabSignupBtn?.classList.remove('active');
  } else {
    signinForm.style.display = 'none';
    signupForm.style.display = 'flex';
    tabSigninBtn?.classList.remove('active');
    tabSignupBtn?.classList.add('active');
  }
};

window.loginAsDemo = function () {
  currentUser = { ...DEFAULT_USER };
  localStorage.setItem('hopstop_auth_user', JSON.stringify(currentUser));
  closeAuthModal();
  syncAuthState();
  showToast(`Welcome back, ${currentUser.name}! ✈️`);
};

window.handleUserLogout = function () {
  currentUser = null;
  localStorage.removeItem('hopstop_auth_user');
  userMenuDropdown?.classList.remove('open');
  syncAuthState();
  showToast('Logged out successfully. See you soon!');
};
