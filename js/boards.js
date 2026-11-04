/**
 * HopStop — Collaborative Dream Boards & Friend Tagging Engine
 */

// ==========================================================================
// Collaborative "Dream Boards" & Friend Tagging Engine (Pinterest Co-Saving)
// ==========================================================================

function saveDreamBoardsData() {
  localStorage.setItem('hopstop_dreamboards', JSON.stringify(dreamBoardsData));
}

let dreamBoardSearchTerm = '';

function renderDreamBoards(filter = currentBoardFilter) {
  const grid = document.getElementById('dreamBoardsGrid');
  const countEl = document.getElementById('dreamBoardsCount');
  if (!grid) return;

  let boards = (typeof dreamBoardsData !== 'undefined' && Array.isArray(dreamBoardsData)) 
    ? dreamBoardsData 
    : (typeof DREAMBOARDS_DATA !== 'undefined' ? DREAMBOARDS_DATA : []);

  if (countEl) countEl.textContent = boards.length;
  const heroCountEl = document.getElementById('heroStatsBoardCount');
  if (heroCountEl) heroCountEl.textContent = boards.length;

  let filtered = boards;
  if (filter === 'shared') {
    filtered = boards.filter(b => b.isShared);
  } else if (filter === 'euro-summer') {
    filtered = boards.filter(b => b.category === 'euro-summer');
  } else if (filter === 'speakeasies') {
    filtered = boards.filter(b => b.category === 'speakeasies');
  } else if (filter === 'alps') {
    filtered = boards.filter(b => b.category === 'alps');
  } else if (filter === 'coastal') {
    filtered = boards.filter(b => b.category === 'coastal');
  } else if (filter === 'locked') {
    const lockedSection = document.querySelector('.locked-guides-section-wrap');
    if (lockedSection) {
      lockedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    renderLockedGuides();
    return;
  }

  if (dreamBoardSearchTerm) {
    const term = dreamBoardSearchTerm.toLowerCase();
    filtered = filtered.filter(b => 
      b.title.toLowerCase().includes(term) ||
      (b.desc && b.desc.toLowerCase().includes(term)) ||
      (b.collaborators && b.collaborators.some(c => c.name.toLowerCase().includes(term) || c.handle.toLowerCase().includes(term)))
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <span style="font-size: 3rem;">📌</span>
        <h3 style="margin-top: 10px; font-weight: 700;">No dream boards matching "${dreamBoardSearchTerm || filter}"</h3>
        <p style="color: var(--text-muted); margin: 6px 0 16px;">Create a shared board to co-save hidden gems with your travel crew!</p>
        <button class="btn-gem" onclick="openCreateBoardModal()">📌 + Create Dream Board</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(board => {
    // Collect preview images from board pins or category defaults
    let pinImages = [];
    if (board.customImages && Array.isArray(board.customImages) && board.customImages.length >= 3) {
      pinImages = [...board.customImages];
    } else {
      pinImages = (board.pins || []).map(pin => {
        const post = (typeof postsData !== 'undefined') ? postsData.find(p => p.id === pin.postId) : null;
        return post ? post.image : null;
      }).filter(Boolean);
    }

    // Category-specific high-definition matching fallbacks
    const CATEGORY_FALLBACKS = {
      'euro-summer': [
        "https://images.unsplash.com/photo-1684862363333-4f5ab43e7edf?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1652287350277-db5ba07dfd46?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1590435525959-40d4af82c270?auto=format&fit=crop&w=600&q=80"
      ],
      'speakeasies': [
        "https://images.unsplash.com/photo-1561906814-23da9a8bfee0?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1781100536081-4072da14956c?auto=format&fit=crop&w=600&q=80"
      ],
      'alps': [
        "https://images.unsplash.com/photo-1790378338449-e189c8bec45c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1790378338486-a1adee74bf56?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1788094710338-7f13749c72e4?auto=format&fit=crop&w=600&q=80"
      ],
      'coastal': [
        "https://images.unsplash.com/photo-1601531364909-4199c3050f52?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"
      ]
    };

    const fallbacks = CATEGORY_FALLBACKS[board.category] || CATEGORY_FALLBACKS['euro-summer'];
    while (pinImages.length < 3) {
      pinImages.push(fallbacks[pinImages.length % fallbacks.length]);
    }

    const firstTagPin = (board.pins || []).find(p => p.tag);

    return `
      <div class="dreamboard-card post-card-animated" onclick="openBoardDetail('${board.id}')">
        <!-- Mosaic Cover Gallery -->
        <div class="dreamboard-mosaic">
          ${pinImages.slice(0, 3).map((img, i) => `
            <img src="${img}" alt="Board Cover" class="mosaic-img-${i + 1}">
          `).join('')}
          <div class="dreamboard-pin-count-badge">
            📌 ${(board.pins || []).length} Saved Pins
          </div>
        </div>

        <div class="dreamboard-card-body">
          <div class="dreamboard-title-row">
            <h3 class="dreamboard-title">${board.title}</h3>
            <span class="dreamboard-shared-tag">${board.isShared ? '👥 Shared Crew' : '🔒 Private'}</span>
          </div>

          <p class="dreamboard-desc">${board.desc || 'Curated secret places and co-saved stops.'}</p>

          ${firstTagPin ? `
            <div style="margin-bottom: 14px;">
              <span class="friend-tag-pill">
                <span>💬</span> <strong>${firstTagPin.tag}</strong> "${firstTagPin.note.substring(0, 42)}..."
              </span>
            </div>
          ` : ''}

          <div class="dreamboard-card-footer">
            <div class="collaborator-avatar-stack">
              ${(board.collaborators || []).map(c => `
                <img src="${c.avatar}" alt="${c.name}" class="collaborator-avatar" title="${c.name} (${c.handle})">
              `).join('')}
            </div>

            <div style="display: flex; gap: 6px; align-items: center;">
              <button class="btn-popup-read" style="padding: 6px 12px; font-size: 0.78rem; font-weight: 700;" onclick="event.stopPropagation(); openBoardDetail('${board.id}')">
                Open ❯
              </button>
              <button class="btn-gem" style="padding: 6px 10px; font-size: 0.78rem; background: linear-gradient(135deg, #ec4899, #db2777);" onclick="event.stopPropagation(); openAddPinModal('${board.id}');" title="Co-Save a Pin">
                + 📌
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.searchDreamBoards = function (query) {
  dreamBoardSearchTerm = query.trim();
  renderDreamBoards(currentBoardFilter);
};

window.filterDreamBoards = function (filter) {
  currentBoardFilter = filter;
  document.querySelectorAll('.dreamboard-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-board-filter') === filter);
  });
  renderDreamBoards(filter);
};

window.openCreateBoardModal = function () {
  const modal = document.getElementById('createBoardModal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeCreateBoardModal = function () {
  const modal = document.getElementById('createBoardModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

function handleCreateBoardSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('boardTitleInput')?.value.trim();
  const category = document.getElementById('boardCategoryInput')?.value;
  const desc = document.getElementById('boardDescInput')?.value.trim();
  const collabText = document.getElementById('boardCollaboratorsInput')?.value.trim() || '';

  if (!title) {
    showToast('Please give your dream board a title 📌');
    return;
  }

  const collabs = [
    {
      name: currentUser ? currentUser.name : "Maya Lin",
      handle: currentUser ? currentUser.handle : "@mayawanders",
      avatar: currentUser ? currentUser.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    }
  ];

  if (collabText) {
    collabText.split(',').forEach(h => {
      const handle = h.trim();
      if (handle) {
        collabs.push({
          name: handle.replace('@', ''),
          handle: handle.startsWith('@') ? handle : `@${handle}`,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999999)}?auto=format&fit=crop&w=150&q=80`
        });
      }
    });
  }

  const newBoard = {
    id: `board_${Date.now()}`,
    title: title,
    category: category,
    desc: desc,
    collaborators: collabs,
    pins: [],
    isShared: collabs.length > 1
  };

  dreamBoardsData.unshift(newBoard);
  saveDreamBoardsData();
  renderDreamBoards();
  closeCreateBoardModal();
  document.getElementById('createBoardForm')?.reset();

  if (typeof triggerConfetti === 'function') {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }

  awardUserXp(75, `Creating "${title}" Dream Board`);
  showToast(`📌 "${title}" Dream Board created! Tag your travel buddies.`);
  openBoardDetail(newBoard.id);
}

window.openBoardDetail = function (boardId) {
  const board = dreamBoardsData.find(b => b.id === boardId);
  if (!board || !boardDetailModal) return;

  activeDetailBoardId = boardId;

  document.getElementById('detailBoardTitle').textContent = board.title;
  document.getElementById('detailBoardDesc').textContent = board.desc || 'Shared collaborative trip board.';
  document.getElementById('detailBoardPinsCount').textContent = (board.pins || []).length;

  // Collaborators Stack
  const crewStack = document.getElementById('detailBoardCrewStack');
  if (crewStack) {
    crewStack.innerHTML = (board.collaborators || []).map(c => `
      <img src="${c.avatar}" alt="${c.name}" class="collaborator-avatar" title="${c.name} (${c.handle})" style="width: 32px; height: 32px;">
    `).join('');
  }

  // Render Co-Saved Pins Grid
  const pinsGrid = document.getElementById('detailBoardPinsGrid');
  if (pinsGrid) {
    if ((board.pins || []).length === 0) {
      pinsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 32px 16px; background: var(--bg-hover); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <span style="font-size: 2.2rem;">💎</span>
          <h4 style="margin: 8px 0 4px;">No gems co-saved on this board yet</h4>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px;">Start adding hidden spots from your feed or map!</p>
          <button class="btn-gem" style="padding: 6px 14px; font-size: 0.82rem;" onclick="openAddPinModal()">+ Co-Save a Stop</button>
        </div>
      `;
    } else {
      pinsGrid.innerHTML = board.pins.map(pin => {
        const post = postsData.find(p => p.id === pin.postId);
        if (!post) return '';

        return `
          <div class="dreamboard-pin-card post-card-animated">
            <img src="${post.image}" alt="${post.placeName}" class="pin-card-img" onclick="openArticleModal(${post.id})">
            
            <div class="pin-card-body">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;" onclick="openArticleModal(${post.id})">${post.placeName}</h4>
                <span style="font-size: 0.76rem; font-weight: 700; color: #06b6d4;">💎 ${post.gemScore}</span>
              </div>
              <div style="font-size: 0.78rem; color: #0284c7; margin-bottom: 8px;">📍 ${post.country}</div>

              ${pin.tag ? `
                <div class="pin-friend-tag-callout">
                  <span class="friend-tag-pill" style="margin-bottom: 4px;">${pin.tag}</span>
                  <p style="margin: 0; font-size: 0.8rem; color: var(--text-primary); line-height: 1.4;">"${pin.note}"</p>
                  <span style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-top: 4px;">Added by ${pin.addedBy || 'Crew'} • ${pin.addedAt || 'Recently'}</span>
                </div>
              ` : `
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 8px;">${pin.note || 'No notes added yet.'}</p>
              `}

              <div style="display: flex; gap: 6px; margin-top: 10px;">
                <button class="btn-primary" style="flex: 1; padding: 6px; font-size: 0.76rem;" onclick="openArticleModal(${post.id})">
                  📖 View Gem
                </button>
                <button class="btn-direction" style="padding: 6px 10px; font-size: 0.76rem;" onclick="openDirections(null, '${encodeURIComponent(post.locationQuery)}')">
                  🧭 Map
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  boardDetailModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeBoardDetailModal = function () {
  if (!boardDetailModal) return;
  boardDetailModal.classList.remove('open');
  document.body.style.overflow = '';
  activeDetailBoardId = null;
};

window.openAddPinModal = function (preselectedPlaceId = null) {
  const boardSelect = document.getElementById('pinTargetBoardSelect');
  const placeSelect = document.getElementById('pinTargetPlaceSelect');
  if (!boardSelect || !placeSelect || !addPinToBoardModal) return;

  boardSelect.innerHTML = dreamBoardsData.map(b => `
    <option value="${b.id}" ${b.id === activeDetailBoardId ? 'selected' : ''}>📌 ${b.title}</option>
  `).join('');

  placeSelect.innerHTML = postsData.map(p => `
    <option value="${p.id}" ${p.id === preselectedPlaceId ? 'selected' : ''}>💎 ${p.placeName} (${p.country})</option>
  `).join('');

  addPinToBoardModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeAddPinModal = function () {
  const modal = document.getElementById('addPinToBoardModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

function handleAddPinSubmit(e) {
  e.preventDefault();
  const boardId = document.getElementById('pinTargetBoardSelect')?.value;
  const placeId = parseInt(document.getElementById('pinTargetPlaceSelect')?.value);
  const friendTag = document.getElementById('pinFriendTagSelect')?.value;
  const tagText = document.getElementById('pinFriendTagText')?.value.trim();
  const note = document.getElementById('pinNoteInput')?.value.trim() || tagText || 'Must visit on our next trip!';

  const board = dreamBoardsData.find(b => b.id === boardId);
  const post = postsData.find(p => p.id === placeId);
  if (!board || !post) return;

  if (!board.pins) board.pins = [];

  const newPin = {
    postId: placeId,
    tag: friendTag,
    note: tagText ? `${tagText}` : note,
    addedBy: currentUser ? currentUser.name : "Maya",
    addedAt: "Just now"
  };

  board.pins.unshift(newPin);
  saveDreamBoardsData();

  closeAddPinModal();
  renderDreamBoards();
  if (activeDetailBoardId === boardId) {
    openBoardDetail(boardId);
  }

  awardUserXp(50, `Co-saving ${post.placeName}`);
  showToast(`📌 Pinned "${post.placeName}" with friend tag ${friendTag}!`);
}

window.inviteFriendToBoard = function () {
  const friendHandle = prompt("Enter travel buddy handle to invite to this Dream Board (e.g. @sarah):", "@sarah");
  if (!friendHandle) return;

  const board = dreamBoardsData.find(b => b.id === activeDetailBoardId);
  if (!board) return;

  if (!board.collaborators) board.collaborators = [];
  board.collaborators.push({
    name: friendHandle.replace('@', ''),
    handle: friendHandle.startsWith('@') ? friendHandle : `@${friendHandle}`,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
  });
  board.isShared = true;

  saveDreamBoardsData();
  openBoardDetail(activeDetailBoardId);
  awardUserXp(25, `Inviting ${friendHandle}`);
  showToast(`👥 Invited ${friendHandle} to "${board.title}"! They can now co-save pins.`);
};

window.convertBoardToItinerary = function () {
  const board = dreamBoardsData.find(b => b.id === activeDetailBoardId);
  if (!board || !board.pins || board.pins.length === 0) {
    showToast('Add some pins to this dream board first before creating a route 🗺️');
    return;
  }

  board.pins.forEach(pin => {
    if (!itineraryStops.includes(pin.postId)) {
      itineraryStops.push(pin.postId);
    }
  });

  saveItinerary();
  closeBoardDetailModal();
  if (typeof triggerConfetti === 'function') {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }
  switchView('itinerary');
  showToast(`🗺️ Imported ${board.pins.length} stops from "${board.title}" into Route Planner!`);
};
