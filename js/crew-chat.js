/**
 * HopStop — In-Trip Crew Chat & Real-Time Direct Messaging (DMs) Engine
 */

// ==========================================================================
// 1. ONLINE EXPLORERS DIRECTORY & DM DATA STORE
// ==========================================================================
const ONLINE_EXPLORERS = [
  {
    id: 'mateo',
    name: 'Mateo Fernandez',
    handle: '@mateotravels',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    location: 'Dolomites Ridge Trail',
    status: 'Exploring Dolomites, Italy',
    tier: '👑 Grand Trailblazer',
    replyPrompt: "That's epic! The sunset up here in the Dolomites was unmatched. Putting the drone up for another pass right now! 🏔️✨"
  },
  {
    id: 'elena',
    name: 'Elena Vance',
    handle: '@elenavance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    location: 'Setenil de las Bodegas',
    status: 'In Setenil, Spain',
    tier: '⚡ Master Explorer',
    replyPrompt: "Totally agree! The locals in Setenil told me about a hidden underground bodega cafe. Dropping the pin coordinates for you! 🍇"
  },
  {
    id: 'leila',
    name: 'Leila Halilovic',
    handle: '@leila_h',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    location: 'Blagaj Emerald Spring',
    status: 'At Blagaj Tekke, Bosnia',
    tier: '💎 Gem Seeker',
    replyPrompt: "The emerald water at the spring is freezing but so pure! Definitely stamp this in your Travel Passport! 💧🏔️"
  },
  {
    id: 'carlos',
    name: 'Carlos Mendoza',
    handle: '@carlos_andes',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    location: 'Patagonia Glaciers',
    status: 'Hiking Torres del Paine',
    tier: '🏔️ Alpine Scout',
    replyPrompt: "Glacier winds are picking up down here in Patagonia! Camp is set. Stay wild! ⛺🔥"
  },
  {
    id: 'sarah',
    name: 'Sarah Chen',
    handle: '@sarahchen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    location: 'Faroe Islands Cliffs',
    status: 'At Kalsoy Lighthouse',
    tier: '🌊 Coastal Explorer',
    replyPrompt: "Love this! Let me know if you want the ferry timetable for Kalsoy cliffs. Zero crowds out here! 🚢"
  },
  {
    id: 'giorgi',
    name: 'Giorgi Tabatadze',
    handle: '@giorgi_svaneti',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    location: 'Svaneti Towers, Georgia',
    status: 'Scouting Ushguli Village',
    tier: '⛩️ Heritage Scout',
    replyPrompt: "Svaneti hospitality is legendary! The host family just baked fresh khachapuri for everyone! 🧀🥖"
  }
];

// Curated Travel GIFs
const TRAVEL_GIFS = [
  { label: 'Mountain Sunrise', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hveHRmNXhka2p4bHB6NXhka2p4bHB6NXhka2p4bHB6NXhka2p4bCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7TKTDnUxE0vc08oM/giphy.gif' },
  { label: 'Camper Van Road Trip', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnluaG44cGpuaHRzZmFrcXFvY3l0cnJzNXA0aW50ZzF2MnA0eW9tciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT0xeJpnrWC4XWblEk/giphy.gif' },
  { label: 'Backpacking Trek', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHFpZnl0dHhhNjBveXR1dzl0bXdtbzQxNHp5ZjF0NW1oaGF5c3ZzeCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l2JhvUj3d3b7501G0/giphy.gif' },
  { label: 'Cliff Ocean Dive', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2sxeWtzcG0ycHByNWg5M3lyOXF5YTN6MnY4M2h5a3VyeDJhM3pxaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26xBLqBabHxElFe0M/giphy.gif' },
  { label: 'Campfire Cheers', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW4ycjlmdmVzdzUxdHF0cndwb2FwcnQ1Y2hkaHhvdmpvMGVva3ZrcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l41lI4bYmcsPJX9Go/giphy.gif' },
  { label: 'Scenic Drone View', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjdwbHNvdmpwZXhpaWl4Z3A3cnlzOW05bWRrNG9wbTZwcnN5MWhkNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7TKoWXm3okO1kgHC/giphy.gif' }
];

// Preset Travel Snapshots
const PRESET_TRAVEL_PHOTOS = [
  { label: '🏔️ Alpine Vista', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { label: '🌊 Azure Cove', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { label: '🏘️ Cliffside Village', url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
  { label: '⛩️ Shrine Mist', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' }
];

// Seed Initial Direct Messages
const DEFAULT_DM_STORE = {
  mateo: [
    {
      id: 'm1',
      sender: 'mateo',
      text: 'Hey Maya! Just reached the Tre Cime ridge. The clouds rolled away just in time for golden hour! 🏔️✨',
      photoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      time: '10:14 AM'
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'Incredible! Are the via ferrata trails open this late in the week?',
      time: '10:16 AM'
    },
    {
      id: 'm3',
      sender: 'mateo',
      text: 'Yes! Route 104 is completely dry. Bring your harness and gloves!',
      time: '10:18 AM'
    }
  ],
  elena: [
    {
      id: 'e1',
      sender: 'elena',
      text: 'Did you find that cave cafe under the boulders in Setenil? You have to try their fresh almond figs! 😋',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hveHRmNXhka2p4bHB6NXhka2p4bHB6NXhka2p4bHB6NXhka2p4bCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7TKTDnUxE0vc08oM/giphy.gif',
      time: 'Yesterday'
    }
  ],
  sarah: [
    {
      id: 's1',
      sender: 'sarah',
      text: 'Got your route recommendation! Saved it to my Dream Board. 📌',
      time: 'Oct 30'
    }
  ]
};

// Global State
let activeDmExplorerId = null;
let dmStore = {};

function initDmStore() {
  try {
    const saved = localStorage.getItem('hopstop_direct_messages');
    if (saved) {
      dmStore = JSON.parse(saved);
    } else {
      dmStore = DEFAULT_DM_STORE;
      localStorage.setItem('hopstop_direct_messages', JSON.stringify(dmStore));
    }
  } catch (e) {
    dmStore = DEFAULT_DM_STORE;
  }
}

// ==========================================================================
// 2. MOUNT FLOATING MESSENGER UI INTO DOM
// ==========================================================================
function mountMessengerUI() {
  if (document.getElementById('hopstopMessenger')) return;

  const container = document.createElement('div');
  container.innerHTML = `
    <!-- Floating Messenger Launcher Pill -->
    <button class="floating-messenger-pill" id="floatingMessengerBtn" onclick="window.toggleMessenger()">
      <span class="messenger-dot-live"></span>
      <span class="messenger-icon">💬</span>
      <span class="messenger-label">Messages</span>
      <span class="messenger-badge" id="messengerUnreadBadge">${ONLINE_EXPLORERS.length}</span>
    </button>

    <!-- Messenger Drawer / Floating Window -->
    <div class="hopstop-messenger-window" id="hopstopMessenger">
      
      <!-- View A: Threads & Online Explorers Hub -->
      <div class="messenger-view" id="messengerThreadsView">
        <div class="messenger-header">
          <div class="messenger-header-title">
            <span style="font-size: 1.15rem;">💬</span>
            <div>
              <h3 style="margin: 0; font-size: 0.96rem; font-weight: 700;">Direct Messages</h3>
              <span style="font-size: 0.7rem; color: #10b981; font-weight: 600;">${ONLINE_EXPLORERS.length} Explorers Online Now</span>
            </div>
          </div>
          <div class="messenger-header-actions">
            <button class="messenger-btn-icon close" onclick="window.closeMessenger()" title="Close">✕</button>
          </div>
        </div>

        <!-- Search Bar -->
        
        <!-- Guest Explorer Mode Pill Banner -->
        <div class="messenger-guest-banner" id="messengerGuestBanner" style="display: ${currentUser ? 'none' : 'flex'};">
          <div class="guest-banner-left">
            <span class="guest-badge-icon">🧭</span>
            <div>
              <strong>Guest Explorer Mode</strong>
              <span>You can DM & chat freely!</span>
            </div>
          </div>
          <button type="button" class="guest-demo-tap-btn" onclick="loginAsDemo();" title="Activate full explorer profile with 1 tap">
            ⚡ 1-Tap Login
          </button>
        </div>

        <div class="messenger-search-wrap">
          <input type="text" class="messenger-search-input" id="messengerSearchInput" placeholder="🔍 Search online explorers..." oninput="window.filterMessengerExplorers(this.value)">
        </div>

        <!-- Horizontal Online Explorers Tray -->
        <div class="messenger-online-tray">
          <div class="online-tray-title">
            <span class="messenger-dot-live"></span>
            <span>Online Explorers (Live)</span>
          </div>
          <div class="online-avatars-row" id="messengerOnlineAvatarsRow"></div>
        </div>

        <!-- Recent Threads List -->
        <div class="messenger-threads-list" id="messengerThreadsList"></div>
      </div>

      <!-- View B: Direct Active Conversation Window -->
      <div class="messenger-view hidden" id="messengerChatView">
        <div class="dm-chat-header">
          <div class="dm-user-meta">
            <button class="messenger-btn-icon" onclick="window.backToConversations()" title="Back to all chats">←</button>
            <div class="dm-user-meta-avatar">
              <img id="dmActiveAvatar" src="" alt="Explorer">
              <span class="online-user-badge-dot"></span>
            </div>
            <div class="dm-user-details">
              <h4 id="dmActiveName">Explorer</h4>
              <span class="dm-user-status" id="dmActiveStatus">🟢 Online</span>
            </div>
          </div>
          <div class="messenger-header-actions">
            <button class="messenger-btn-icon close" onclick="window.closeMessenger()" title="Close">✕</button>
          </div>
        </div>

        <!-- Messages Scroll Container -->
        
        <!-- Guest Explorer Mode Pill Banner -->
        <div class="messenger-guest-banner" id="messengerGuestBanner" style="display: ${currentUser ? 'none' : 'flex'};">
          <div class="guest-banner-left">
            <span class="guest-badge-icon">🧭</span>
            <div>
              <strong>Guest Explorer Mode</strong>
              <span>You can DM & chat freely!</span>
            </div>
          </div>
          <button type="button" class="guest-demo-tap-btn" onclick="loginAsDemo();" title="Activate full explorer profile with 1 tap">
            ⚡ 1-Tap Login
          </button>
        </div>

        <div class="dm-messages-container" id="dmMessagesContainer"></div>

        <!-- Quick Emoji Reaction Bar -->
        <div class="dm-quick-emoji-bar">
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('🔥')">🔥</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('❤️')">❤️</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('🏔️')">🏔️</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('📸')">📸</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('💎')">💎</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('🍻')">🍻</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('🌿')">🌿</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('😍')">😍</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('🚀')">🚀</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('🗺️')">🗺️</button>
          <button type="button" class="emoji-quick-btn" onclick="window.appendEmoji('👋')">👋</button>
        </div>

        <!-- GIF Popover Tray -->
        <div class="dm-tray-popover" id="dmGifTray">
          <div class="dm-tray-title">
            <span>🎬 Wanderlust Travel GIFs</span>
            <span style="cursor: pointer;" onclick="window.toggleGifTray()">✕</span>
          </div>
          <div class="dm-gif-grid" id="dmGifGrid"></div>
        </div>

        <!-- Photo Popover Tray -->
        <div class="dm-tray-popover" id="dmPhotoTray">
          <div class="dm-tray-title">
            <span>📸 Attach Travel Photo</span>
            <span style="cursor: pointer;" onclick="window.togglePhotoTray()">✕</span>
          </div>
          <div class="dm-photo-input-group">
            <input type="url" id="dmPhotoInput" placeholder="Paste image link...">
            <button type="button" class="online-dm-btn" onclick="window.sendCustomPhoto()">Send</button>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">Or 1-click send instant snapshot:</div>
          <div class="dm-gif-grid" id="dmPhotoPresetsGrid"></div>
        </div>

        <!-- Chat Input Form -->
        <form class="dm-chat-input-bar" id="dmChatForm" onsubmit="window.handleSendDirectMessage(event)">
          <button type="button" class="dm-action-btn" onclick="window.togglePhotoTray()" title="Send Photo">📸</button>
          <button type="button" class="dm-action-btn" onclick="window.toggleGifTray()" title="Send GIF">🎬</button>
          <input type="text" class="dm-chat-input" id="dmMessageInput" placeholder="Message this explorer..." autocomplete="off">
          <button type="submit" class="dm-send-btn" title="Send">➤</button>
        </form>
      </div>

    </div>
  `;

  document.body.appendChild(container);
  populateGifGrid();
  populatePhotoPresets();
  renderOnlineAvatarsRow();
  renderThreadsList();
}

// ==========================================================================
// 3. MESSENGER CONTROLS & RENDERING
// ==========================================================================
window.toggleMessenger = function() {
  if (!currentUser) {
    if (typeof openAuthModal === 'function') openAuthModal('signin');
    if (typeof showToast === 'function') {
      showToast('🔒 Please sign in or use 1-Click Demo Login to chat and DM with explorers!');
    }
    return;
  }
  const win = document.getElementById('hopstopMessenger');
  if (!win) return;
  win.classList.toggle('open');
  if (win.classList.contains('open')) {
    renderOnlineAvatarsRow();
    renderThreadsList();
  }
};

window.openMessenger = function() {
  const win = document.getElementById('hopstopMessenger');
  if (win) {
    win.classList.add('open');
    renderOnlineAvatarsRow();
    renderThreadsList();
  }
};

window.closeMessenger = function() {
  const win = document.getElementById('hopstopMessenger');
  if (win) win.classList.remove('open');
  closeTrays();
};

window.backToConversations = function() {
  document.getElementById('messengerThreadsView')?.classList.remove('hidden');
  document.getElementById('messengerChatView')?.classList.add('hidden');
  activeDmExplorerId = null;
  renderThreadsList();
  closeTrays();
};

window.openDirectMessage = function(explorerIdOrName) {
  let explorer = ONLINE_EXPLORERS.find(e => e.id === explorerIdOrName || e.name.toLowerCase() === (explorerIdOrName || '').toLowerCase());
  if (!explorer) {
    explorer = ONLINE_EXPLORERS[0]; // fallback to Mateo
  }

  activeDmExplorerId = explorer.id;
  window.openMessenger();

  document.getElementById('messengerThreadsView')?.classList.add('hidden');
  document.getElementById('messengerChatView')?.classList.remove('hidden');

  const avatarEl = document.getElementById('dmActiveAvatar');
  const nameEl = document.getElementById('dmActiveName');
  const statusEl = document.getElementById('dmActiveStatus');

  if (avatarEl) avatarEl.src = explorer.avatar;
  if (nameEl) nameEl.textContent = explorer.name;
  if (statusEl) statusEl.textContent = `🟢 ${explorer.status}`;

  renderDirectMessages(explorer.id);
  closeTrays();

  setTimeout(() => {
    document.getElementById('dmMessageInput')?.focus();
  }, 100);
};

function renderOnlineAvatarsRow(filterText = '') {
  const row = document.getElementById('messengerOnlineAvatarsRow');
  if (!row) return;

  const filtered = ONLINE_EXPLORERS.filter(e => 
    !filterText || e.name.toLowerCase().includes(filterText.toLowerCase()) || e.handle.toLowerCase().includes(filterText.toLowerCase())
  );

  row.innerHTML = filtered.map(e => `
    <div class="online-user-pill" onclick="window.openDirectMessage('${e.id}')" title="Chat with ${e.name}">
      <div class="online-user-avatar-wrap">
        <img src="${e.avatar}" alt="${e.name}">
        <span class="online-user-badge-dot"></span>
      </div>
      <span class="online-user-name">${e.name.split(' ')[0]}</span>
    </div>
  `).join('');

  // Also render into sidebar widget on feed.html if present
  renderSidebarOnlineList();
}

function renderSidebarOnlineList() {
  const sidebarList = document.getElementById('sidebarOnlineExplorers');
  if (!sidebarList) return;

  sidebarList.innerHTML = ONLINE_EXPLORERS.slice(0, 4).map(e => `
    <div class="online-explorer-row" onclick="window.openDirectMessage('${e.id}')">
      <div class="online-explorer-left">
        <div class="online-explorer-row-avatar">
          <img src="${e.avatar}" alt="${e.name}">
          <span class="online-dot"></span>
        </div>
        <div>
          <div class="online-explorer-name">${e.name}</div>
          <div class="online-explorer-loc">${e.location}</div>
        </div>
      </div>
      <button type="button" class="online-dm-btn" onclick="event.stopPropagation(); window.openDirectMessage('${e.id}')">💬 Chat</button>
    </div>
  `).join('');
}

window.filterMessengerExplorers = function(val) {
  renderOnlineAvatarsRow(val);
  renderThreadsList(val);
};

function renderThreadsList(filterText = '') {
  const list = document.getElementById('messengerThreadsList');
  if (!list) return;

  const filtered = ONLINE_EXPLORERS.filter(e => 
    !filterText || e.name.toLowerCase().includes(filterText.toLowerCase()) || e.handle.toLowerCase().includes(filterText.toLowerCase())
  );

  list.innerHTML = filtered.map(e => {
    const thread = dmStore[e.id] || [];
    const lastMsg = thread.length > 0 ? thread[thread.length - 1] : null;
    let snippet = 'Say hello and exchange waypoint tips! ✨';
    let time = 'Active';

    if (lastMsg) {
      if (lastMsg.gifUrl) snippet = '🎬 Sent a travel GIF';
      else if (lastMsg.photoUrl) snippet = '📸 Shared a waypoint photo';
      else snippet = lastMsg.text;
      time = lastMsg.time || 'Today';
    }

    return `
      <div class="thread-item" onclick="window.openDirectMessage('${e.id}')">
        <div class="thread-avatar-wrap">
          <img src="${e.avatar}" alt="${e.name}">
          <span class="online-user-badge-dot"></span>
        </div>
        <div class="thread-info">
          <div class="thread-info-top">
            <span class="thread-author-name">${e.name}</span>
            <span class="thread-time">${time}</span>
          </div>
          <p class="thread-snippet">${snippet}</p>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// 4. ACTIVE CONVERSATION RENDERING & SENDING
// ==========================================================================
function renderDirectMessages(explorerId) {
  const container = document.getElementById('dmMessagesContainer');
  if (!container) return;

  const explorer = ONLINE_EXPLORERS.find(e => e.id === explorerId) || ONLINE_EXPLORERS[0];
  const messages = dmStore[explorerId] || [];

  container.innerHTML = messages.map(m => {
    const isMine = m.sender === 'me';
    const avatar = isMine ? (currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80') : explorer.avatar;
    const senderLabel = isMine ? (currentUser ? currentUser.name : 'You (Guest Wanderer)') : explorer.name;
    
    let contentHtml = '';
    if (m.text) {
      contentHtml += `<div>${m.text}</div>`;
    }
    if (m.photoUrl) {
      contentHtml += `<img src="${m.photoUrl}" class="dm-attachment-img" alt="Photo" onclick="window.open('${m.photoUrl}', '_blank')">`;
    }
    if (m.gifUrl) {
      contentHtml += `<img src="${m.gifUrl}" class="dm-gif-img" alt="GIF">`;
    }

    return `
      <div class="dm-msg ${isMine ? 'mine' : 'theirs'}">
        <img src="${avatar}" class="dm-msg-avatar" alt="${isMine ? 'You' : explorer.name}">
        <div class="dm-msg-bubble">
          <div style="font-size: 0.68rem; font-weight: 700; opacity: 0.8; margin-bottom: 2px;">${senderLabel}</div>
          ${contentHtml}
          <span class="dm-msg-time">${m.time || 'Just now'}</span>
        </div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

window.handleSendDirectMessage = function(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('dmMessageInput');
  if (!input || !activeDmExplorerId) return;

  const text = input.value.trim();
  if (!text) return;

  sendPayload({ text: text });
  input.value = '';
};

window.sendDirectGif = function(gifUrl) {
  if (!activeDmExplorerId) return;
  sendPayload({ gifUrl: gifUrl });
  closeTrays();
};

window.sendDirectPhoto = function(photoUrl) {
  if (!activeDmExplorerId) return;
  sendPayload({ photoUrl: photoUrl });
  closeTrays();
};

window.sendCustomPhoto = function() {
  const input = document.getElementById('dmPhotoInput');
  const url = input?.value.trim();
  if (!url) return;
  window.sendDirectPhoto(url);
  input.value = '';
};

function sendPayload(payload) {
  if (!activeDmExplorerId) return;

  if (!dmStore[activeDmExplorerId]) {
    dmStore[activeDmExplorerId] = [];
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const myMsg = {
    id: 'dm_' + Date.now(),
    sender: 'me',
    time: timeStr,
    ...payload
  };

  dmStore[activeDmExplorerId].push(myMsg);
  saveDmStore();
  renderDirectMessages(activeDmExplorerId);

  // Trigger realistic simulated typing and reply
  simulateExplorerReply(activeDmExplorerId);
}

function simulateExplorerReply(explorerId) {
  const explorer = ONLINE_EXPLORERS.find(e => e.id === explorerId);
  if (!explorer) return;

  const container = document.getElementById('dmMessagesContainer');
  if (!container) return;

  // 1. Show Typing indicator after 700ms
  setTimeout(() => {
    if (activeDmExplorerId !== explorerId) return;

    const existingIndicator = document.getElementById('dmTypingIndicator');
    if (existingIndicator) existingIndicator.remove();

    const typingEl = document.createElement('div');
    typingEl.id = 'dmTypingIndicator';
    typingEl.className = 'dm-typing-indicator';
    typingEl.innerHTML = `
      <div class="dm-typing-dots">
        <span class="dm-typing-dot"></span>
        <span class="dm-typing-dot"></span>
        <span class="dm-typing-dot"></span>
      </div>
      <span>${explorer.name.split(' ')[0]} is typing...</span>
    `;
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;
  }, 700);

  // 2. Deliver message after 2.2s
  setTimeout(() => {
    const existingIndicator = document.getElementById('dmTypingIndicator');
    if (existingIndicator) existingIndicator.remove();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const replyMsg = {
      id: 'dm_reply_' + Date.now(),
      sender: explorer.id,
      text: explorer.replyPrompt,
      time: timeStr
    };

    if (!dmStore[explorerId]) dmStore[explorerId] = [];
    dmStore[explorerId].push(replyMsg);
    saveDmStore();

    if (activeDmExplorerId === explorerId) {
      renderDirectMessages(explorerId);
    } else {
      showToast(`💬 New message from ${explorer.name}!`);
    }

    if (typeof showCustomToast === 'function') {
      showCustomToast(`💬 ${explorer.name}: "${explorer.replyPrompt.substring(0, 50)}..."`);
    }
  }, 2400);
}

function saveDmStore() {
  localStorage.setItem('hopstop_direct_messages', JSON.stringify(dmStore));
}

// ==========================================================================
// 5. TRAYS & EMOJI CONTROLS
// ==========================================================================
window.toggleGifTray = function() {
  const tray = document.getElementById('dmGifTray');
  const photoTray = document.getElementById('dmPhotoTray');
  if (photoTray) photoTray.classList.remove('open');
  if (tray) tray.classList.toggle('open');
};

window.togglePhotoTray = function() {
  const tray = document.getElementById('dmPhotoTray');
  const gifTray = document.getElementById('dmGifTray');
  if (gifTray) gifTray.classList.remove('open');
  if (tray) tray.classList.toggle('open');
};

function closeTrays() {
  document.getElementById('dmGifTray')?.classList.remove('open');
  document.getElementById('dmPhotoTray')?.classList.remove('open');
}

window.appendEmoji = function(emoji) {
  const input = document.getElementById('dmMessageInput');
  if (input) {
    input.value += emoji;
    input.focus();
  }
};

function populateGifGrid() {
  const grid = document.getElementById('dmGifGrid');
  if (!grid) return;

  grid.innerHTML = TRAVEL_GIFS.map(g => `
    <img src="${g.url}" class="dm-gif-thumb" alt="${g.label}" title="${g.label}" onclick="window.sendDirectGif('${g.url}')">
  `).join('');
}

function populatePhotoPresets() {
  const grid = document.getElementById('dmPhotoPresetsGrid');
  if (!grid) return;

  grid.innerHTML = PRESET_TRAVEL_PHOTOS.map(p => `
    <div style="cursor: pointer;" onclick="window.sendDirectPhoto('${p.url}')" title="${p.label}">
      <img src="${p.url}" class="dm-gif-thumb" alt="${p.label}">
      <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${p.label}</div>
    </div>
  `).join('');
}

// ==========================================================================
// 6. INITIALIZATION & ORIGINAL CREW CHAT INTEGRATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDmStore();
  mountMessengerUI();
  initEventListeners();
});

// Also run immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initDmStore();
  mountMessengerUI();
  initEventListeners();
}

// Re-export original functions
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

  // User Dropdown is handled via window.toggleUserMenu(event)

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu-wrap')) userMenuDropdown?.classList.remove('open');
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
    const name = document.getElementById('signupName')?.value?.trim() || 'New Wanderer';
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
    const params = new URLSearchParams(window.location.search);
    if (params.get('redirect') === 'feed' || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '') {
      window.location.href = 'feed.html';
    } else {
      window.location.reload();
    }
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

