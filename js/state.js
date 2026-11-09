/**
 * HopStop — Global Application State, LocalStorage hydration, and Board/Battle datasets
 */

// --- HopStop Schema & Authentic Asset Migration Engine ---
const CURRENT_APP_DATA_VERSION = '20261109_v8_global_nearest_gems';
const storedHopstopVersion = (() => {
  try { return localStorage.getItem('hopstop_data_version'); } catch (e) { return null; }
})();

if (storedHopstopVersion !== CURRENT_APP_DATA_VERSION) {
  try {
    // Purge outdated cached datasets that may contain mismatched stock images or legacy board IDs
    localStorage.removeItem('hopstop_dreamboards');
    localStorage.removeItem('hopstop_locked_guides');
    localStorage.removeItem('hopstop_bounties');
    localStorage.removeItem('hopstop_community_posts');
    localStorage.removeItem('hopstop_battles');
    localStorage.setItem('hopstop_data_version', CURRENT_APP_DATA_VERSION);
  } catch (e) {}
}

// --- State Variables ---
let currentUser = (() => {
  try {
    const user = JSON.parse(localStorage.getItem('hopstop_auth_user'));
    if (user && typeof user === 'object') {
      const raw = (user.name || '').trim();
      if (!raw || raw.length < 2 || !/[\w]/.test(raw)) {
        user.name = user.isGuest ? 'Guest Explorer' : 'Maya Lin';
      }
      if (!user.handle || user.handle.length < 2 || !/[\w]/.test(user.handle)) {
        user.handle = user.isGuest ? '@guest_explorer' : '@mayawanders';
      }
      return user;
    }
  } catch (e) {}
  return null;
})();
let currentView = currentUser ? 'app' : 'landing';
let postsData = (() => {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('hopstop_community_posts'));
  } catch (e) {}

  if (saved && Array.isArray(saved) && saved.length > 0) {
    // Sync with master posts to ensure authentic image match
    const updated = INITIAL_POSTS.map(initPost => {
      const found = saved.find(p => p.id === initPost.id);
      return found ? { ...found, image: initPost.image, title: initPost.title, placeName: initPost.placeName, locationQuery: initPost.locationQuery, coords: initPost.coords } : initPost;
    });
    const customPosts = saved.filter(p => !INITIAL_POSTS.some(ip => ip.id === p.id));
    const merged = [...updated, ...customPosts];
    localStorage.setItem('hopstop_community_posts', JSON.stringify(merged));
    return merged;
  }
  localStorage.setItem('hopstop_community_posts', JSON.stringify(INITIAL_POSTS));
  return INITIAL_POSTS;
})();
let savedBookmarks = JSON.parse(localStorage.getItem('hopstop_saved')) || [1, 2];
let suggestedExplorers = [...SUGGESTED_EXPLORERS];
let activeStoryIndex = 0;
let storyTimer = null;
let currentLightboxIndex = 0;
let displayedGalleryItems = [];
let activePostForModal = null;
let currentCategory = 'all';
let currentGalleryFilter = 'all';
let currentMapFilter = 'all';
let currentBountyFilter = 'all';
let searchQuery = '';

// Local Micro-Adventures Geolocation State
let userCoordinates = [37.3891, -5.9845]; // Seville, Spain baseline (closest to Setenil/Cadiz)
let userLocationName = 'Seville, Spain (GPS Auto)';
let currentRadiusFilter = 'all';

// Daily Habit & Streak State
let userStreakDays = parseInt(localStorage.getItem('hopstop_streak_days')) || 5;
let lastCheckinDate = localStorage.getItem('hopstop_last_checkin') || '';
let dailyGemPost = null;
let dailyTimerInterval = null;

// Micro-Publications Series State
let subscribedSeries = JSON.parse(localStorage.getItem('hopstop_subscribed_series')) || ['pub_1', 'pub_2'];
let activeReadingSeriesId = null;
let activeReadingChapterIndex = 0;

// Escape Mode Ambient Theater State
let currentEscapeIndex = 0;
let escapeAudioContext = null;
let escapeVolume = 0.7;
let escapeZenTimer = null;
let escapeTimerSeconds = 0;
let escapeActiveSounds = { rain: true, wind: true, waves: false, fire: false };

// Gamification State
let userXp = parseInt(localStorage.getItem('hopstop_user_xp')) || 450;
let unlockedBadges = JSON.parse(localStorage.getItem('hopstop_unlocked_badges')) || ['alpine', 'fortress', 'gemhunter', 'pioneer', 'scribe'];
let bountiesData = (() => {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('hopstop_bounties'));
  } catch (e) {}

  if (saved && Array.isArray(saved) && saved.length >= INITIAL_BOUNTIES.length) {
    const updated = INITIAL_BOUNTIES.map(initB => {
      const found = saved.find(s => s.id === initB.id);
      return found ? { ...initB, status: initB.status, solvedBy: initB.solvedBy, solvedPlace: initB.solvedPlace } : initB;
    });
    const customBounties = saved.filter(s => !INITIAL_BOUNTIES.some(ib => ib.id === s.id));
    const merged = [...updated, ...customBounties];
    localStorage.setItem('hopstop_bounties', JSON.stringify(merged));
    return merged;
  }
  localStorage.setItem('hopstop_bounties', JSON.stringify(INITIAL_BOUNTIES));
  return INITIAL_BOUNTIES;
})();

// --- Collaborative Dream Boards Dataset (Pinterest Co-Saving) ---
const DREAMBOARDS_DATA = [
  {
    id: "board_1",
    title: "European Summer 2027",
    category: "euro-summer",
    desc: "Hitting hidden cliff towns, secret caves, and roadless villages with the crew!",
    customImages: [
      "https://images.unsplash.com/photo-1684862363333-4f5ab43e7edf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1652287350277-db5ba07dfd46?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590435525959-40d4af82c270?auto=format&fit=crop&w=600&q=80"
    ],
    collaborators: [
      { name: "Maya Lin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", handle: "@mayawanders" },
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", handle: "@sarah" },
      { name: "Leo Ramos", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", handle: "@leo" }
    ],
    pins: [
      { postId: 1, tag: "@sarah", note: "we have to eat tapas under this giant boulder at lunch!", addedBy: "Maya", addedAt: "2h ago" },
      { postId: 2, tag: "@leo", note: "the boat inside the emerald spring cave is a must!", addedBy: "Sarah", addedAt: "1d ago" },
      { postId: 4, tag: "@sarah", note: "renting whisper boats at dawn with no tourists!", addedBy: "Leo", addedAt: "2d ago" }
    ],
    isShared: true
  },
  {
    id: "board_2",
    title: "Secret Speakeasies & Underground Cellars",
    category: "speakeasies",
    desc: "Subterranean wine caverns, hidden teahouses behind alleyways, and lantern spots.",
    customImages: [
      "https://images.unsplash.com/photo-1561906814-23da9a8bfee0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1781100536081-4072da14956c?auto=format&fit=crop&w=600&q=80"
    ],
    collaborators: [
      { name: "Maya Lin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", handle: "@mayawanders" },
      { name: "Elena Vance", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", handle: "@elenavance" }
    ],
    pins: [
      { postId: 7, tag: "@elena", note: "century-old bodega carved inside the limestone gorge!", addedBy: "Elena", addedAt: "4d ago" },
      { postId: 6, tag: "@everyone", note: "sunset tea ceremony before heading down to the cellar!", addedBy: "Maya", addedAt: "3d ago" },
      { postId: 1, tag: "@maya", note: "underground rock-carved bar in the cliff gorge!", addedBy: "Elena", addedAt: "1d ago" }
    ],
    isShared: true
  },
  {
    id: "board_3",
    title: "Alpine Rifugios & Solitude Huts",
    category: "alps",
    desc: "High altitude mountain sanctuaries far above the tourist routes.",
    customImages: [
      "https://images.unsplash.com/photo-1790378338449-e189c8bec45c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1790378338486-a1adee74bf56?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1788094710338-7f13749c72e4?auto=format&fit=crop&w=600&q=80"
    ],
    collaborators: [
      { name: "Maya Lin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", handle: "@mayawanders" },
      { name: "Giorgi Tabatadze", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", handle: "@giorgi_svaneti" }
    ],
    pins: [
      { postId: 8, tag: "@sarah", note: "solitude wooden hut sitting under the needle peaks!", addedBy: "Giorgi", addedAt: "2d ago" },
      { postId: 5, tag: "@giorgi", note: "1,000-year watchtowers beneath the glaciers!", addedBy: "Giorgi", addedAt: "5d ago" }
    ],
    isShared: false
  },
  {
    id: "board_4",
    title: "Mediterranean Secret Lagoons & Cliff Coves",
    category: "coastal",
    desc: "Turquoise sea caves, secluded volcanic calderas, and wild coastal cliffs without resort crowds.",
    customImages: [
      "https://images.unsplash.com/photo-1601531364909-4199c3050f52?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"
    ],
    collaborators: [
      { name: "Maya Lin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", handle: "@mayawanders" },
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", handle: "@sarah" },
      { name: "Leila Halilovic", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", handle: "@leila_h" }
    ],
    pins: [
      { postId: 9, tag: "@leila_h", note: "sea kayak straight through the white volcanic sea arches!", addedBy: "Maya", addedAt: "6h ago" },
      { postId: 10, tag: "@sarah", note: "sunset wine overlooking the pastel cliff houses and azure water!", addedBy: "Sarah", addedAt: "1d ago" }
    ],
    isShared: true
  }
];

let dreamBoardsData = (() => {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('hopstop_dreamboards'));
  } catch (e) {}

  if (saved && Array.isArray(saved) && saved.length > 0) {
    // Purge legacy hyphenated board IDs (e.g., 'board-1', 'board-2')
    const validSaved = saved.filter(b => b.id && !b.id.includes('-'));
    // Sync master customImages, title, and pins
    const updated = DREAMBOARDS_DATA.map(masterBoard => {
      const found = validSaved.find(b => b.id === masterBoard.id);
      return found ? { ...masterBoard, customImages: masterBoard.customImages, pins: (found.pins && found.pins.length >= masterBoard.pins.length) ? found.pins : masterBoard.pins } : masterBoard;
    });
    const customBoards = validSaved.filter(b => !DREAMBOARDS_DATA.some(m => m.id === b.id));
    const merged = [...updated, ...customBoards];
    localStorage.setItem('hopstop_dreamboards', JSON.stringify(merged));
    return merged;
  }
  localStorage.setItem('hopstop_dreamboards', JSON.stringify(DREAMBOARDS_DATA));
  return DREAMBOARDS_DATA;
})();

// --- Weekly Photo Battles Dataset ---
const WEEKLY_BATTLES_DATA = {
  prompt: "Best Hidden Sunrise Spot Under $10",
  desc: "Submit your most spectacular, uncrowded sunrise vista. Sunday midnight the community votes crown the top 3 explorers on the global Discover wall!",
  theme: "Sunrise & Dawn",
  endsInSeconds: 224850,
  prizeXp: 500,
  submissions: [
    {
      id: "bat_1",
      placeName: "Mount Bromo Crater Ridge",
      country: "Indonesia",
      photoUrl: "https://images.unsplash.com/photo-1666887799869-4fbeda25d17f?auto=format&fit=crop&w=1000&q=80",
      author: { name: "Carlos Mendoza", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", handle: "@carlos_andes" },
      votes: 412,
      hasVoted: false,
      cost: "$0 (Public Footpath)",
      caption: "Pure silence as the sea of clouds illuminates in violet and amber at 5:00 AM."
    },
    {
      id: "bat_2",
      placeName: "Lago di Braies Dawn Mist",
      country: "Italy",
      photoUrl: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1000&q=80",
      author: { name: "Elena Vance", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", handle: "@elenavance" },
      votes: 389,
      hasVoted: true,
      cost: "$0 (Free Lake Access)",
      caption: "Arrived at 5:15 AM before the boathouse opened. The water was like liquid glass."
    },
    {
      id: "bat_3",
      placeName: "Meteora Clifftop Sunrise",
      country: "Greece",
      photoUrl: "https://images.unsplash.com/photo-1682187233368-73b848553081?auto=format&fit=crop&w=1000&q=80",
      author: { name: "Leila Halilovic", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", handle: "@leila_h" },
      votes: 345,
      hasVoted: false,
      cost: "$4 Monastery Permit",
      caption: "Watching golden sunlight bathe 600-year stone hermitage towers above morning fog."
    }
  ]
};

// --- Locked Creator Guides Dataset (Micro-Monetization) ---
const LOCKED_GUIDES_DATA = [
  {
    id: "guide_1",
    title: "Complete 7-Day Andalusia Hidden Troglodyte Route & Coordinates",
    region: "Cadiz & Malaga, Spain",
    author: { name: "Mateo Fernandez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", handle: "@mateotravels", followers: 4800 },
    heroImg: "https://images.unsplash.com/photo-1684862363333-4f5ab43e7edf?auto=format&fit=crop&w=1000&q=80",
    priceXp: 150,
    isUnlocked: false,
    secretCoords: "36.8642, -5.1814 | 36.7462, -5.1612 | 36.9124, -5.3310",
    localContacts: [
      { role: "Private Wine Cellar Host", name: "Don Rafael", phone: "+34 612 884 912" },
      { role: "Secret River Canyon Guide", name: "Maria Jose", phone: "+34 655 201 449" }
    ],
    itineraryDays: [
      "Day 1: Setenil Boulder Overhang Walk & Cellar Lunch",
      "Day 2: Rio Trejo Moorish Hydraulic Mills Trek",
      "Day 3: Grazalema Hidden Pinsapo Forest Sanctuary",
      "Day 4: Zahara de la Sierra Castle Ridge Sunset",
      "Day 5: Cueva del Gato Secret Emerald Lagoon",
      "Day 6: Montejaque Limestone Amphitheatre",
      "Day 7: Private Bodega Sherry Tasting & Return"
    ]
  },
  {
    id: "guide_2",
    title: "Secret Greater Caucasus 4x4 Off-Grid Pass & Guesthouse Network",
    region: "Svaneti, Georgia",
    author: { name: "Giorgi Tabatadze", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", handle: "@giorgi_svaneti", followers: 6200 },
    heroImg: "https://images.unsplash.com/photo-1788094710338-7f13749c72e4?auto=format&fit=crop&w=1000&q=80",
    priceXp: 150,
    isUnlocked: true,
    secretCoords: "42.9175, 43.0167 | 42.8710, 42.7214 | 43.0412, 42.7301",
    localContacts: [
      { role: "Ushguli Mountain Host", name: "Tamaz Ratiani", phone: "+995 599 123 456" },
      { role: "Glacial Moraine Horse Guide", name: "Nika Kapanadze", phone: "+995 577 988 231" }
    ],
    itineraryDays: [
      "Day 1: Enguri Gorge Canyon 4x4 Pass",
      "Day 2: Mestia Ancient Machubi & Tower Exploration",
      "Day 3: Secret Chalaadi Glacier Footpath",
      "Day 4: Ushguli Glacial Moraine Sunrise",
      "Day 5: Lamaria 10th-Century Clifftop Chapel",
      "Day 6: Zagari Pass Wild Flower Alpine Ridge",
      "Day 7: Traditional Svaneti Hearth Feast & Toast"
    ]
  },
  {
    id: "guide_3",
    title: "Hidden Kyoto & Lake Biwa Woodcraft Villages & Ancient Waterways",
    region: "Kansai & Shiga, Japan",
    author: { name: "Kenji Takahashi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", handle: "@kenji_crafts", followers: 8400 },
    heroImg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    priceXp: 180,
    isUnlocked: false,
    secretCoords: "35.0394, 135.7292 | 35.2155, 135.9814 | 35.3421, 136.0315",
    localContacts: [
      { role: "Master Joinery Carpenter", name: "Sensei Morimoto", phone: "+81 75 391 8820" },
      { role: "Lake Biwa Wooden Boatman", name: "Haruto Sato", phone: "+81 77 522 3411" }
    ],
    itineraryDays: [
      "Day 1: Sagano Bamboo Deep Grove & Ancient Joinery Atelier",
      "Day 2: Omi-Hachiman Secret Merchant Canal Flatboat",
      "Day 3: Shigaraki Ceramic Mountain Kilns & Tea Cellar",
      "Day 4: Mount Hiei Monastic Ridge Trail",
      "Day 5: Takashima Pure Spring Water Settlement (Kabata)",
      "Day 6: Hidden Cedar Workshop & Traditional Chisel Lesson",
      "Day 7: Sunrise Tea Ceremony on Lake Biwa Wooden Pier"
    ]
  },
  {
    id: "guide_4",
    title: "Dolomites Secret Alpine Bivouacs & Forgotten High Passes",
    region: "Val di Fassa & Alta Badia, Italy",
    author: { name: "Elena Vance", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", handle: "@elenavance", followers: 9800 },
    heroImg: "https://images.unsplash.com/photo-1790378338449-e189c8bec45c?auto=format&fit=crop&w=1000&q=80",
    priceXp: 160,
    isUnlocked: false,
    secretCoords: "46.5412, 11.8724 | 46.4912, 11.9541 | 46.6120, 12.0142",
    localContacts: [
      { role: "Alpine Rescue & Mountain Hut Keeper", name: "Marco De Luca", phone: "+39 0471 796 112" },
      { role: "Via Ferrata Pioneer Guide", name: "Giulia Bellini", phone: "+39 335 842 901" }
    ],
    itineraryDays: [
      "Day 1: Lago di Carezza Dawn Reflection & Rosengarten Ascent",
      "Day 2: Secret WWI Tunnel Ledge & Cliffside Bivouac",
      "Day 3: Passo Giau Unmarked Shepherd Ridge",
      "Day 4: Val Venegia Pale di San Martino Amphitheatre",
      "Day 5: Glacial Tarn Wild Swim & Alpine Cheese Cellar",
      "Day 6: Tre Cime Hidden Backside Ridge Without Tourists",
      "Day 7: Traditional Tyrolean Woodstove Polenta Dinner"
    ]
  }
];

let activeDetailBoardId = null;
let currentBoardFilter = 'all';

let battlesData = (() => {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('hopstop_battles'));
  } catch (e) {}

  if (saved && Array.isArray(saved.submissions) && saved.submissions.length > 0) {
    const updatedSubmissions = WEEKLY_BATTLES_DATA.submissions.map(masterSub => {
      const found = saved.submissions.find(s => s.id === masterSub.id);
      return found ? { ...masterSub, votes: found.votes || masterSub.votes, hasVoted: !!found.hasVoted } : masterSub;
    });
    const updated = { ...WEEKLY_BATTLES_DATA, ...saved, submissions: updatedSubmissions };
    localStorage.setItem('hopstop_battles', JSON.stringify(updated));
    return updated;
  }
  localStorage.setItem('hopstop_battles', JSON.stringify(WEEKLY_BATTLES_DATA));
  return WEEKLY_BATTLES_DATA;
})();
let battleCountdownInterval = null;
let currentBattleSort = 'votes';

// Initialize locked guides and merge new guides seamlessly
let storedLockedGuides = null;
try {
  storedLockedGuides = JSON.parse(localStorage.getItem('hopstop_locked_guides'));
} catch (e) {}

let lockedGuidesData = (() => {
  if (storedLockedGuides && Array.isArray(storedLockedGuides) && storedLockedGuides.length >= LOCKED_GUIDES_DATA.length) {
    const updated = LOCKED_GUIDES_DATA.map(masterGuide => {
      const found = storedLockedGuides.find(g => g.id === masterGuide.id);
      return found ? { ...masterGuide, isUnlocked: found.isUnlocked } : masterGuide;
    });
    localStorage.setItem('hopstop_locked_guides', JSON.stringify(updated));
    return updated;
  }
  localStorage.setItem('hopstop_locked_guides', JSON.stringify(LOCKED_GUIDES_DATA));
  return LOCKED_GUIDES_DATA;
})();

let activeLockedGuideId = null;

// --- Travel Passport & Scratch-Off Visited Countries Dataset ---
const PASSPORT_COUNTRIES_DATA = [
  { code: "ES", name: "Spain", flag: "🇪🇸", capital: "Madrid", samplePlace: "Setenil de las Bodegas", visited: true, stampDate: "OCT 2026", stampColor: "#ef4444" },
  { code: "BA", name: "Bosnia & Herzegovina", flag: "🇧🇦", capital: "Sarajevo", samplePlace: "Blagaj Tekke", visited: true, stampDate: "AUG 2026", stampColor: "#0284c7" },
  { code: "PE", name: "Peru", flag: "🇵🇪", capital: "Lima", samplePlace: "Huacachina Oasis", visited: true, stampDate: "MAY 2026", stampColor: "#ea580c" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", capital: "Amsterdam", samplePlace: "Giethoorn Thatched Canals", visited: true, stampDate: "APR 2026", stampColor: "#f59e0b" },
  { code: "GE", name: "Georgia", flag: "🇬🇪", capital: "Tbilisi", samplePlace: "Svaneti Watchtowers", visited: true, stampDate: "SEP 2026", stampColor: "#10b981" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", capital: "Taipei", samplePlace: "Jiufen Lantern Mountain", visited: true, stampDate: "FEB 2026", stampColor: "#8b5cf6" },
  { code: "GR", name: "Greece", flag: "🇬🇷", capital: "Athens", samplePlace: "Meteora Sky Monasteries", visited: true, stampDate: "JUN 2026", stampColor: "#06b6d4" },
  { code: "AT", name: "Austria", flag: "🇦🇹", capital: "Vienna", samplePlace: "Hallstatt Lake Ridge", visited: true, stampDate: "JUL 2026", stampColor: "#ec4899" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", capital: "Jakarta", samplePlace: "Mount Bromo Ridge", visited: false, stampDate: null, stampColor: "#10b981" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", capital: "Rabat", samplePlace: "Chefchaouen Blue Medina", visited: false, stampDate: null, stampColor: "#0284c7" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", capital: "Zagreb", samplePlace: "Plitvice Secret Grotto", visited: false, stampDate: null, stampColor: "#3b82f6" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", capital: "Lisbon", samplePlace: "Sintra Mist Valley", visited: false, stampDate: null, stampColor: "#f97316" }
];

let passportData = JSON.parse(localStorage.getItem('hopstop_passport_countries')) || PASSPORT_COUNTRIES_DATA;

// --- Notification Center & Weekly Digest Dataset ---
const NOTIFICATIONS_DATA = [
  { id: "notif_1", icon: "🔔", title: "New 9.9 Gem Near Saved Spot", desc: "Setenil de las Bodegas was pinned 18km from your Andalusia wishlist.", time: "15m ago", isUnread: true, action: "openArticleModal(1)" },
  { id: "notif_2", icon: "📬", title: "Weekly Curated Digest Ready", desc: "5 hidden gems picked for your spring Mediterranean wishlist.", time: "2h ago", isUnread: true, action: "openWeeklyDigestModal()" },
  { id: "notif_3", icon: "📌", title: "Sarah tagged you on Dream Board", desc: '@sarah: "we have to eat tapas under this giant boulder!"', time: "5h ago", isUnread: true, action: "openBoardDetail('board_1')" },
  { id: "notif_4", icon: "🏆", title: "Photo Battle Live Update", desc: "Carlos Mendoza just upvoted your Mount Bromo sunrise entry.", time: "1d ago", isUnread: false, action: "switchView('battles')" }
];

let notificationsData = JSON.parse(localStorage.getItem('hopstop_notifications')) || NOTIFICATIONS_DATA;

// --- Monthly Top-Finders Leaderboard Dataset ---
const MONTHLY_LEADERBOARD_DATA = [
  { rank: 1, name: "Mateo Fernandez", handle: "@mateotravels", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", tier: "👑 Grand Trailblazer", gems: 14, monthlyXp: 3420, badge: "🥇 #1 Discover Legend" },
  { rank: 2, name: "Elena Vance", handle: "@elenavance", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", tier: "⚡ Master Explorer", gems: 11, monthlyXp: 2850, badge: "🥈 #2 Discover Podium" },
  { rank: 3, name: "Leila Halilovic", handle: "@leila_h", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", tier: "💎 Gem Seeker", gems: 9, monthlyXp: 2100, badge: "🥉 #3 Discover Podium" },
  { rank: 4, name: "Carlos Mendoza", handle: "@carlos_andes", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", tier: "🏔️ Alpine Scout", gems: 7, monthlyXp: 1650, badge: "Top 5 Contributor" },
  { rank: 5, name: "Maya Lin (You)", handle: "@mayawanders", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", tier: "⚡ Trailblazer", gems: 6, monthlyXp: 1450, badge: "Top 5 Contributor" }
];

// --- In-Trip Collaborative Crew Chat Dataset ---
const TRIP_CHAT_DATA = {
  "board_1": [
    { id: 1, author: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", text: "Hey crew! Should we book the 1:00 PM cave table at Setenil on Friday?", time: "10:15 AM", isMine: false },
    { id: 2, author: "Leo Ramos", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", text: "Yes! And I have the drone charged for the Blagaj spring cliff flight.", time: "10:18 AM", isMine: false },
    { id: 3, author: "Maya Lin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", text: "Awesome, I just converted our pins into the Smart Route Planner!", time: "10:22 AM", isMine: true }
  ],
  "board_4": [
    { id: 1, author: "Leila Halilovic", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", text: "Found the hidden stairs down to the sea cave! Zero tourists here.", time: "2:10 PM", isMine: false },
    { id: 2, author: "Maya Lin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", text: "Adding the cliff jump waypoint to our route right now!", time: "2:14 PM", isMine: true }
  ]
};

let tripChatData = JSON.parse(localStorage.getItem('hopstop_trip_chat')) || TRIP_CHAT_DATA;

// Feed Algorithm State
let currentFeedSortMode = 'foryou';

// Itinerary Route Planner State
let itineraryStops = JSON.parse(localStorage.getItem('hopstop_itinerary')) || [1, 2, 4];
let itineraryTransitMode = 'driving';
let itineraryMap = null;
let itineraryPolylineLayer = null;
let itineraryMarkerLayer = null;

// Supabase Cloud State & Handles
let supabaseClient = null;
let isCloudConnected = false;
let realtimeChannel = null;
const SUPABASE_STORAGE_URL_KEY = 'hopstop_supabase_url';
const SUPABASE_STORAGE_KEY_KEY = 'hopstop_supabase_anon_key';

// Leaflet Map Instance & Layer Handles
let leafletMap = null;
let mapTileLayer = null;
let mapMarkerLayerGroup = null;

// --- DOM References ---
const landingView = document.getElementById('landingView');
const appView = document.getElementById('appView');
const bountyView = document.getElementById('bountyView');
const itineraryView = document.getElementById('itineraryView');
const publicationsView = document.getElementById('publicationsView');
const dreamBoardsView = document.getElementById('dreamBoardsView');
const photoBattlesView = document.getElementById('photoBattlesView');
const escapeModal = document.getElementById('escapeModal');
const dailyGemModal = document.getElementById('dailyGemModal');
const publicationReaderModal = document.getElementById('publicationReaderModal');
const createBoardModal = document.getElementById('createBoardModal');
const boardDetailModal = document.getElementById('boardDetailModal');
const addPinToBoardModal = document.getElementById('addPinToBoardModal');
const submitBattleModal = document.getElementById('submitBattleModal');
const lockedGuideModal = document.getElementById('lockedGuideModal');
const travelPassportModal = document.getElementById('travelPassportModal');
const weeklyDigestModal = document.getElementById('weeklyDigestModal');
const tripModeModal = document.getElementById('tripModeModal');
const leaderboardModal = document.getElementById('leaderboardModal');
const notificationsDropdown = document.getElementById('notificationsDropdown');
const authModal = document.getElementById('authModal');
const cloudModal = document.getElementById('cloudModal');
const postBountyModal = document.getElementById('postBountyModal');
const solveBountyModal = document.getElementById('solveBountyModal');
const addWaypointModal = document.getElementById('addWaypointModal');
const achievementModal = document.getElementById('achievementModal');
const authHeaderActions = document.getElementById('authHeaderActions');
const guestHeaderActions = document.getElementById('guestHeaderActions');
const currentUserNameEls = document.querySelectorAll('.current-user-name');
const currentUserAvatarEls = document.querySelectorAll('.current-user-avatar');
const userMenuDropdown = document.getElementById('userMenuDropdown');
const userMenuTrigger = document.getElementById('userMenuTrigger');

const socialFeedContainer = document.getElementById('socialFeedContainer');
const storiesTray = document.getElementById('storiesTray');
const suggestedUsersList = document.getElementById('suggestedUsersList');
const storyViewerModal = document.getElementById('storyViewerModal');

const postsGrid = document.getElementById('postsGrid');
const galleryGrid = document.getElementById('galleryGrid');
const bountyGrid = document.getElementById('bountyGrid');
const bucketListContainer = document.getElementById('bucketListContainer');
const bucketCountBadge = document.getElementById('bucketCount');
const toastContainer = document.getElementById('toastContainer');
const themeToggle = document.getElementById('themeToggle');


// State variables are ready.

