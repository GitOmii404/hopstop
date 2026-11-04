/**
 * HopStop — Initial Seed Datasets (Stories, Explorers, Posts, Scenes)
 */

/**
 * HopStop — Production-Grade Travel Social Network & Blog Platform
 * Integrated with Leaflet.js Interactive World Map (CartoDB Tiles & Custom Diamond Pins)
 */

// --- Default Demo User Profile ---
const DEFAULT_USER = {
  id: "user_maya",
  name: "Maya Lin",
  handle: "@mayawanders",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  bio: "Chasing cliffside towns, misty temples & quiet valleys ✈️ 24 countries explored.",
  followers: 1420,
  following: 380,
  postsCount: 12
};

// --- Stories Dataset ---
const STORIES_DATA = [
  {
    id: "story_1",
    author: "Elena Vance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    title: "Dolomites Hidden Rifugio",
    location: "Cortina, Italy",
    coords: [46.5383, 12.1376],
    image: "https://images.unsplash.com/photo-1790378338449-e189c8bec45c?auto=format&fit=crop&w=1000&q=80",
    desc: "Waking up above the cloud inversion at 2,400m elevation. Pure silence."
  },
  {
    id: "story_2",
    author: "Mateo Fernandez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    title: "Setenil Cliff Street",
    location: "Cadiz, Spain",
    coords: [36.8642, -5.1814],
    image: "https://images.unsplash.com/photo-1684862363333-4f5ab43e7edf?auto=format&fit=crop&w=1000&q=80",
    desc: "Tasting local sherry right beneath 2 million tons of solid boulder ceiling."
  },
  {
    id: "story_3",
    author: "Leila Halilovic",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    title: "Blagaj Spring Cave",
    location: "Mostar, Bosnia",
    coords: [43.2567, 17.9034],
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1000&q=80",
    desc: "Subterranean emerald water emerges from 200m limestone cliffs at 43,000 L/sec."
  },
  {
    id: "story_4",
    author: "Carlos Mendoza",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    title: "Huacachina Sunset Dunes",
    location: "Ica, Peru",
    coords: [-14.0875, -75.7626],
    image: "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1000&q=80",
    desc: "Catching the golden hour sandboarding off South America's tallest dunes."
  },
  {
    id: "story_5",
    author: "Anouk Van Dijk",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    title: "Giethoorn Thatched Canals",
    location: "Overijssel, Netherlands",
    coords: [52.7402, 6.0792],
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1000&q=80",
    desc: "Quiet morning whisper boat ride through 176 wooden bridges without a single car."
  },
  {
    id: "story_6",
    author: "Giorgi Tabatadze",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    title: "Svaneti Watchtowers",
    location: "Ushguli, Georgia",
    coords: [42.9175, 43.0167],
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80",
    desc: "Medieval stone towers guarded by the glaciers of Mount Shkhara."
  }
];

// --- Suggested Explorers ---
const SUGGESTED_EXPLORERS = [
  {
    id: "exp_1",
    name: "Elena Vance",
    handle: "@elenavance",
    meta: "Alpine explorer • 48 stops",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    isFollowing: false
  },
  {
    id: "exp_2",
    name: "Mateo Fernandez",
    handle: "@mateotravels",
    meta: "Andalusia & Balkans • 32 stops",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    isFollowing: true
  },
  {
    id: "exp_3",
    name: "Leila Halilovic",
    handle: "@leila_h",
    meta: "Balkan hidden gems • 19 stops",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    isFollowing: false
  }
];

// --- Initial Hidden Gems Database with Exact Geocoordinates ---

const INITIAL_POSTS = [
  {
    id: 1,
    title: "Setenil de las Bodegas: The Town Built Beneath Giant Boulders",
    placeName: "Setenil de las Bodegas",
    country: "Spain",
    locationQuery: "Setenil de las Bodegas, Cadiz, Spain",
    coords: [36.8642, -5.1814],
    gemScore: "9.9",
    category: "village",
    categoryLabel: "Cliffside Wonder",
    readTime: "5 min read",
    date: "2 hours ago",
    bestTime: "April - June & Sept - Nov",
    budget: "$40 - $70 / day",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-winding-road-in-a-mountain-valley-41387-large.mp4",
    author: {
      name: "Mateo Fernandez",
      handle: "@mateotravels",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1684862363333-4f5ab43e7edf?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Whitewashed houses built directly into the overhangs of a colossal river gorge in Andalusia where rocks form natural ceilings.",
    secretTip: "Head to Calle Cuevas del Sol around 1:00 PM for shade-cooled tapas under millions of tons of natural cliff roof.",
    fullContent: `
      <h4>Why It's An Incredible Hidden Gem</h4>
      <p>Unlike most Andalusian cliff towns built atop rock plateaus for defense, the ancient inhabitants of Setenil carved their homes inside the eroded canyon overhangs of Rio Trejo. Millions of tons of natural rock serve as roofs, naturally air-conditioning dwellings year-round.</p>
      <h4>How To Reach It</h4>
      <p>Fly into Malaga or Seville. Rent a car and drive 1.5 hours through the white village route (Pueblos Blancos). Parking is easiest at the upper municipal lot before walking down the cobblestones.</p>
    `,
    likes: 248,
    isLiked: false,
    comments: [
      {
        id: 101,
        author: "Sofia Alarcon",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        text: "I went here last spring! Sitting under that gigantic boulder eating Iberian ham was surreal.",
        time: "2 hours ago"
      }
    ]
  },
  {
    id: 2,
    title: "Blagaj Tekke: 600-Year Dervish Monastery on an Emerald Spring",
    placeName: "Blagaj Tekke",
    country: "Bosnia & Herzegovina",
    locationQuery: "Blagaj Tekke, Blagaj, Bosnia and Herzegovina",
    coords: [43.2567, 17.9034],
    gemScore: "9.8",
    category: "culture",
    categoryLabel: "Sacred Sanctuary",
    readTime: "4 min read",
    date: "5 hours ago",
    bestTime: "May - September",
    budget: "$30 - $55 / day",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
    author: {
      name: "Leila Halilovic",
      handle: "@leila_h",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A mystical 15th-century Sufi monastery built at the base of a towering 200m limestone cliff right where the turquoise Buna River gushes from a dark cave.",
    secretTip: "Take the wooden boat inside the subterranean cave right at the spring source for $3; the water is ice cold and crystal clear.",
    fullContent: `
      <h4>The Legend of Blagaj</h4>
      <p>Constructed around 1520 during Ottoman rule, Blagaj Tekija was built specifically for Sufi dervish orders for silent meditation, prayer, and hospitality. Water emerges from Europe’s largest karst spring at 43,000 L/sec.</p>
    `,
    likes: 312,
    isLiked: true,
    comments: [
      {
        id: 201,
        author: "Darius Miller",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
        text: "The emerald color of the river looks photoshopped in real life, but it truly is that vivid!",
        time: "1 day ago"
      }
    ]
  },
  {
    id: 3,
    title: "Huacachina: The Surreal Desert Lagoon Hidden in Peru's Dunes",
    placeName: "Huacachina Desert Oasis",
    country: "Peru",
    locationQuery: "Huacachina Oasis, Ica, Peru",
    coords: [-14.0875, -75.7626],
    gemScore: "9.7",
    category: "nature",
    categoryLabel: "Desert Oasis",
    readTime: "6 min read",
    date: "1 day ago",
    bestTime: "Year-round (Best: May - Nov)",
    budget: "$35 - $60 / day",
    author: {
      name: "Carlos Mendoza",
      handle: "@carlos_andes",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A natural palm-tree oasis with emerald waters encircled by some of the tallest golden sand dunes on planet Earth.",
    secretTip: "Book the 4:30 PM dune buggy tour so you are atop the highest ridge exactly when the sun turns the desert magenta.",
    fullContent: `
      <h4>A Fairy Tale in the Ica Desert</h4>
      <p>Huacachina looks like a mirage. Built around a natural desert lagoon surrounded by palm and eucalyptus groves, it is famous for high-speed sandboarding.</p>
    `,
    likes: 189,
    isLiked: false,
    comments: []
  },
  {
    id: 4,
    title: "Giethoorn: The Roadless Village of 176 Wooden Bridges",
    placeName: "Giethoorn",
    country: "Netherlands",
    locationQuery: "Giethoorn, Overijssel, Netherlands",
    coords: [52.7402, 6.0792],
    gemScore: "9.8",
    category: "village",
    categoryLabel: "Water Village",
    readTime: "4 min read",
    date: "2 days ago",
    bestTime: "May - June & September",
    budget: "$65 - $110 / day",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-beach-1406-large.mp4",
    author: {
      name: "Anouk Van Dijk",
      handle: "@anoukvandijk",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1000&q=80",
    excerpt: "No cars, no roads—only whisper-quiet electric boats gliding through thatched-roof farmhouse canals and flower bridges.",
    secretTip: "Rent an electric 'whisper boat' before 10:00 AM to glide down misty canals completely in silence.",
    fullContent: `
      <h4>The Venice of the North</h4>
      <p>In historic Giethoorn, there are zero roads. Mail is delivered by punt boat, and thatched 18th-century farmhouses sit on private peat islands.</p>
    `,
    likes: 420,
    isLiked: true,
    comments: []
  },
  {
    id: 5,
    title: "Svaneti Towers: Medieval Caucasus Fortresses in the Clouds",
    placeName: "Ushguli & Mestia, Svaneti",
    country: "Georgia",
    locationQuery: "Ushguli, Svaneti, Georgia",
    coords: [42.9175, 43.0167],
    gemScore: "9.9",
    category: "nature",
    categoryLabel: "Mountain Fortress",
    readTime: "7 min read",
    date: "4 days ago",
    bestTime: "June - October",
    budget: "$25 - $45 / day",
    author: {
      name: "Giorgi Tabatadze",
      handle: "@giorgi_svaneti",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Europe’s highest continuously inhabited village guarded by hundreds of 1,000-year-old defensive stone watchtowers under glaciers.",
    secretTip: "Stay in a traditional family guesthouse in Ushguli for home-cooked Khachapuri cheese bread and homemade Svaneti mountain salt stew.",
    fullContent: `
      <h4>Untouched Mountain Heritage</h4>
      <p>Perched high in the Greater Caucasus, Svaneti remained isolated for centuries. Each clan built their own stone fortress tower (koshki) to survive avalanches and invaders.</p>
    `,
    likes: 175,
    isLiked: false,
    comments: []
  },
  {
    id: 6,
    title: "Jiufen: Misty Lantern Mountain & Whispering Teahouses",
    placeName: "Jiufen Old Street",
    country: "Taiwan",
    locationQuery: "Jiufen Old Street, Ruifang District, New Taipei City, Taiwan",
    coords: [25.1099, 121.8452],
    gemScore: "9.6",
    category: "culture",
    categoryLabel: "Lantern Haven",
    readTime: "5 min read",
    date: "1 week ago",
    bestTime: "October - April",
    budget: "$30 - $60 / day",
    author: {
      name: "Mei-Ling Chen",
      handle: "@meiling_tw",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Clinging to lush seaside mountains, this former gold rush town is famous for glowing red lantern alleys, misty sea views, and heritage Oolong tea.",
    secretTip: "Book a window table on the top floor of Amei Teahouse at 5:30 PM just as twilight lanterns illuminate.",
    fullContent: `
      <h4>A Labyrinth of Lanterns</h4>
      <p>Carved into steep mountain slopes overlooking the East China Sea, Jiufen’s narrow stone stairs are lined with wooden tea houses and red paper lanterns.</p>
    `,
    likes: 295,
    isLiked: false,
    comments: []
  },
  {
    id: 7,
    title: "Bodega de las Cuevas: Subterranean Stone Wine Cellar",
    placeName: "Setenil Bodegas",
    country: "Spain",
    locationQuery: "Setenil de las Bodegas, Spain",
    coords: [36.8642, -5.1814],
    gemScore: "9.8",
    category: "culture",
    categoryLabel: "Ancient Cellar",
    readTime: "4 min read",
    date: "5 days ago",
    bestTime: "Year-round",
    budget: "$20 - $40 / day",
    author: {
      name: "Elena Vance",
      handle: "@elenavance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1561906814-23da9a8bfee0?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Atmospheric 12th-century subterranean wine cavern carved beneath basalt cliffs where vintage oak casks age in cool cave air.",
    secretTip: "Ask Don Rafael for the private cellar tour down through the lower limestone gallery.",
    fullContent: "<p>Hidden beneath the cliff faces, natural stone caverns have been utilized for wine aging and storage since Roman and Moorish times.</p>",
    likes: 310,
    isLiked: true,
    comments: []
  },
  {
    id: 8,
    title: "Rifugio Forcella: Solitude Mountain Cabin in the Jagged Crags",
    placeName: "Rifugio Forcella",
    country: "Italy",
    locationQuery: "Val di Funes, Dolomites, Italy",
    coords: [46.6433, 11.7212],
    gemScore: "9.9",
    category: "nature",
    categoryLabel: "Alpine Sanctuary",
    readTime: "6 min read",
    date: "6 days ago",
    bestTime: "June - September",
    budget: "$50 - $90 / day",
    author: {
      name: "Elena Vance",
      handle: "@elenavance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1790378338449-e189c8bec45c?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Traditional wooden mountain huts sitting in high alpine meadows beneath soaring limestone needle spires far above tourist roads.",
    secretTip: "The dawn light on the Geisler peaks produces a stunning pink Alpenglow reflection across the meadow.",
    fullContent: "<p>Accessible only by footpaths winding from Santa Maddalena, this quiet alpine refuge offers authentic wood-fired polenta and total serenity.</p>",
    likes: 485,
    isLiked: true,
    comments: []
  },
  {
    id: 9,
    title: "Kleftiko Sea Caves: White Volcanic Arches and Emerald Waters",
    placeName: "Kleftiko Sea Caves",
    country: "Greece",
    locationQuery: "Kleftiko Beach, Milos, Greece",
    coords: [36.6667, 24.3333],
    gemScore: "9.8",
    category: "coastal",
    categoryLabel: "Volcanic Grotto",
    readTime: "5 min read",
    date: "4 days ago",
    bestTime: "May - October",
    budget: "$30 - $60 / day",
    author: {
      name: "Mateo Fernandez",
      handle: "@mateotravels",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1601531364909-4199c3050f52?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Labyrinth of blinding white volcanic rock arches, sea stacks, and translucent caves carved into the Aegean Sea.",
    secretTip: "Take an early morning sailboat from Adamas before tour catamarans anchor.",
    fullContent: "<p>Once an impenetrable pirate lair, Kleftiko features crystalline turquoise waters and natural swim-through sea labyrinths.</p>",
    likes: 395,
    isLiked: false,
    comments: []
  },
  {
    id: 10,
    title: "Manarola Cliffside: Colorful Fishing Hamlet on the Ligurian Sea",
    placeName: "Manarola Cliffside",
    country: "Italy",
    locationQuery: "Manarola, Cinque Terre, Italy",
    coords: [44.1069, 9.7289],
    gemScore: "9.7",
    category: "coastal",
    categoryLabel: "Cliffside Hamlet",
    readTime: "4 min read",
    date: "3 days ago",
    bestTime: "April - October",
    budget: "$40 - $80 / day",
    author: {
      name: "Sarah Chen",
      handle: "@sarah",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Pastel houses tumbling down sheer sea crags into a tiny harbor where wooden fishing skiffs bob in azure swells.",
    secretTip: "Walk up the cemetery path to Nessun Dorma terrace for the iconic cliff panorama at twilight.",
    fullContent: "<p>Manarola is one of the oldest villages in Cinque Terre, renowned for its Sciacchetra sweet wine and dramatic black rock foundations.</p>",
    likes: 420,
    isLiked: true,
    comments: []
  }
];

// --- Curated Gallery Wall Pool ---
const GALLERY_POOL = [
  { id: 1, title: "Lago di Braies Reflection", location: "Dolomites, Italy", category: "nature", badge: "🏔️ Alpine Mist", span: "tall", image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80" },
  { id: 2, title: "Blagaj Dervish Spring", location: "Blagaj, Bosnia", category: "culture", badge: "💎 Karst Cave", span: "standard", image: "https://images.unsplash.com/photo-1652287350277-db5ba07dfd46?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Setenil Cliffside Houses", location: "Cadiz, Spain", category: "village", badge: "🏘️ Boulder Roofs", span: "standard", image: "https://images.unsplash.com/photo-1684862363333-4f5ab43e7edf?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Huacachina Desert Oasis", location: "Ica, Peru", category: "nature", badge: "🌅 Golden Dunes", span: "wide", image: "https://images.unsplash.com/photo-1769358758778-5b12f301051b?auto=format&fit=crop&w=1200&q=80" },
  { id: 5, title: "Giethoorn Thatched Canals", location: "Overijssel, Netherlands", category: "coastal", badge: "🛶 Whisper Boats", span: "tall", image: "https://images.unsplash.com/photo-1590435525959-40d4af82c270?auto=format&fit=crop&w=900&q=80" },
  { id: 6, title: "Svaneti Medieval Towers", location: "Ushguli, Georgia", category: "village", badge: "🏰 1,000-Yr Fort", span: "standard", image: "https://images.unsplash.com/photo-1788094710338-7f13749c72e4?auto=format&fit=crop&w=800&q=80" },
  { id: 7, title: "Jiufen Mountain Lanterns", location: "New Taipei, Taiwan", category: "culture", badge: "🏮 Twilight Fog", span: "standard", image: "https://images.unsplash.com/photo-1781100536081-4072da14956c?auto=format&fit=crop&w=800&q=80" },
  { id: 8, title: "Chefchaouen Blue Medina", location: "Rif Mountains, Morocco", category: "village", badge: "💙 Blue Pearl", span: "wide", image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=1200&q=80" },
  { id: 9, title: "Meteora Clifftop Monasteries", location: "Thessaly, Greece", category: "culture", badge: "⛩️ Rock Monasteries", span: "tall", image: "https://images.unsplash.com/photo-1682187233368-73b848553081?auto=format&fit=crop&w=900&q=80" },
  { id: 10, title: "Hallstatt Alpine Lake Sunrise", location: "Salzkammergut, Austria", category: "coastal", badge: "🌊 Alpine Mirror", span: "standard", image: "https://images.unsplash.com/photo-1652433062476-43e6dd7753b1?auto=format&fit=crop&w=800&q=80" },
  { id: 11, title: "Plitvice Cascades & Turquoise Lakes", location: "Lika, Croatia", category: "coastal", badge: "💧 Cascading Falls", span: "standard", image: "https://images.unsplash.com/photo-1589312133722-eab40c686ebb?auto=format&fit=crop&w=800&q=80" },
  { id: 12, title: "Pena Palace Fairytale Castle", location: "Sintra, Portugal", category: "culture", badge: "🏰 Romantic Castle", span: "wide", image: "https://images.unsplash.com/photo-1561405159-8b3a339817dc?auto=format&fit=crop&w=1200&q=80" },
  { id: 13, title: "Yosemite Valley Mist", location: "California, USA", category: "nature", badge: "🌲 Granite Peaks", span: "tall", image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1000&q=80" },
  { id: 14, title: "Manarola Cliffside", location: "Cinque Terre, Italy", category: "coastal", badge: "⛵ Pastel Cliffs", span: "wide", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80" },
  { id: 15, title: "Reine Rorbuer Cabins & Fjords", location: "Lofoten Islands, Norway", category: "village", badge: "❄️ Arctic Fjord Cabins", span: "standard", image: "https://images.unsplash.com/photo-1540292763668-0949a90ab56a?auto=format&fit=crop&w=1000&q=80" },
  { id: 16, title: "Yasaka Pagoda & Historic Higashiyama", location: "Kyoto, Japan", category: "culture", badge: "⛩️ Ancient Pagodas", span: "tall", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80" },
  { id: 17, title: "Heddal Medieval Timber Stave Cathedral", location: "Notodden, Telemark, Norway", category: "craft", badge: "🪵 Ancient Timber Joinery", span: "tall", image: "https://images.unsplash.com/photo-1763569967275-13056b588293?auto=format&fit=crop&w=1000&q=80" },
  { id: 18, title: "Chand Baori Geometric Stepwell", location: "Abhaneri, Rajasthan, India", category: "craft", badge: "🧱 3,500 Geometric Steps", span: "wide", image: "https://images.unsplash.com/photo-1782134266746-0d13b8e871b0?auto=format&fit=crop&w=1000&q=80" }
];

// --- Badges Catalog ---
const BADGES_CATALOG = [
  { key: 'alpine', icon: '🏔️', name: 'Alpine Seeker', desc: 'Explored high-altitude mountain spots & passes', xpBonus: 100 },
  { key: 'fortress', icon: '🏰', name: 'Fortress Guard', desc: 'Explored medieval stone castles & ancient towers', xpBonus: 100 },
  { key: 'coastal', icon: '🌊', name: 'Coast Pioneer', desc: 'Mapped secret sea grottoes & quiet whisper canals', xpBonus: 100 },
  { key: 'gemhunter', icon: '💎', name: 'Gem Hunter', desc: 'Discovered spots with 9.8+ underrated scores', xpBonus: 150 },
  { key: 'bountyhunter', icon: '🎯', name: 'Bounty Hunter', desc: 'Solved a community travel bounty request', xpBonus: 250 },
  { key: 'scribe', icon: '✍️', name: 'Master Scribe', desc: 'Wrote detailed transit directions & secret tips', xpBonus: 100 },
  { key: 'cartographer', icon: '🗺️', name: 'Cartographer', desc: 'Pinned exact GPS coordinates for travelers', xpBonus: 150 },
  { key: 'pioneer', icon: '🌟', name: 'Early Pioneer', desc: 'Foundational explorer of the HopStop network', xpBonus: 200 }
];

// --- Initial Bounties Dataset (Balanced 12 Bounties across all categories) ---
const INITIAL_BOUNTIES = [
  {
    id: 1,
    creatorName: 'Elena Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Hidden Mountain Monasteries in Greece with Sunset Views',
    description: 'Looking for a secluded cliffside retreat or active monastery in Greece that has no tour bus access and is reachable only by a scenic foot trail.',
    category: 'culture',
    targetRegion: 'Meteora / Zagori, Greece',
    rewardXp: 750,
    status: 'active',
    solvedBy: null,
    solvedPlace: null,
    createdAt: '1 day ago'
  },
  {
    id: 2,
    creatorName: 'Carlos Mendoza',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    title: 'Secret Natural Thermal Spring with Blue Water in the Alps',
    description: 'Seeking an uncommercialized mountain thermal bath or natural hot spring in the Alps hidden in a pine forest valley under $40/day.',
    category: 'nature',
    targetRegion: 'Swiss / Italian Alps',
    rewardXp: 500,
    status: 'active',
    solvedBy: null,
    solvedPlace: null,
    createdAt: '2 days ago'
  },
  {
    id: 3,
    creatorName: 'Mateo Fernandez',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'Cliffside Fishing Hamlet with Cave Dining in Southern Italy',
    description: 'Seeking a coastal whitewashed village in Puglia or Calabria carved straight into sea grottoes where fishermen still haul wooden boats by hand.',
    category: 'coastal',
    targetRegion: 'Southern Italy / Puglia',
    rewardXp: 600,
    status: 'active',
    solvedBy: null,
    solvedPlace: null,
    createdAt: '3 days ago'
  },
  {
    id: 4,
    creatorName: 'Maya Lin',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Misty Bamboo Forest Sanctuary & Whispering Teahouses',
    description: 'Looking for a tranquil bamboo grove or moss garden temple in East Asia with traditional hand-whisked matcha, free of large tour crowds.',
    category: 'culture',
    targetRegion: 'Kyoto / Arashiyama Outskirts, Japan',
    rewardXp: 850,
    status: 'active',
    solvedBy: null,
    solvedPlace: null,
    createdAt: '4 hours ago'
  },
  {
    id: 5,
    creatorName: 'Anouk Van Dijk',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    title: 'Roadless Nordic Fjord Farmstead with Glacial Waterfall Trail',
    description: 'Looking for an off-grid 18th-century cliffside wooden farm above the fjords reachable only by scenic passenger boat and mountain footpath.',
    category: 'nature',
    targetRegion: 'Nærøyfjord & Aurland, Norway',
    rewardXp: 900,
    status: 'solved',
    solvedBy: 'Elena Vance',
    solvedPlace: 'Otternes Farmstead, Norway',
    createdAt: '4 days ago'
  },
  {
    id: 6,
    creatorName: 'Giorgi Tabatadze',
    creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    title: 'Secret Subterranean Troglodyte Wine Cavern & Ancient Cellar',
    description: 'Discovered a 12th-century limestone cave cellar buried underneath cliff bluffs with naturally chilled vintage oak casks.',
    category: 'culture',
    targetRegion: 'Cadiz & Ronda, Andalusia, Spain',
    rewardXp: 800,
    status: 'solved',
    solvedBy: 'Maya Lin',
    solvedPlace: 'Bodega Cuevas del Sol, Setenil',
    createdAt: '5 days ago'
  },
  {
    id: 7,
    creatorName: 'Sarah Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    title: 'Hidden Emerald Sea Grotto Accessible Only at Low Tide Kayak',
    description: 'Located a secluded turquoise bioluminescent tidal cavern tucked behind sheer limestone sea stacks with zero tourist boat traffic.',
    category: 'coastal',
    targetRegion: 'Kleftiko Coast, Milos, Greece',
    rewardXp: 950,
    status: 'solved',
    solvedBy: 'Mateo Fernandez',
    solvedPlace: 'Sikia Sea Cave Arch, Milos',
    createdAt: '6 days ago'
  },
  {
    id: 8,
    creatorName: 'Leo Ramos',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'High-Altitude Solitude Rifugio Above the Cloud Inversion',
    description: 'Found an unmapped alpine stone bivouac perch high above the needle crags with a wood-fired hearth and direct glacier pass trail.',
    category: 'nature',
    targetRegion: 'Dolomites, Trentino-Alto Adige, Italy',
    rewardXp: 850,
    status: 'solved',
    solvedBy: 'Giorgi Tabatadze',
    solvedPlace: 'Bivacco Forcella della Roa (2,617m)',
    createdAt: '1 week ago'
  },
  {
    id: 9,
    creatorName: 'Carlos Mendoza',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    title: 'Untracked Glacial Tarn in the High Pyrenees Cirque',
    description: 'Hunting for a crystal-clear turquoise glacial cirque tarn reachable by an unmarked scree scramble on the Spanish-French border.',
    category: 'nature',
    targetRegion: 'Ordesa & Monte Perdido, Spain',
    rewardXp: 750,
    status: 'active',
    solvedBy: null,
    solvedPlace: null,
    createdAt: '1 day ago'
  },
  {
    id: 10,
    creatorName: 'Sarah Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    title: 'Ancient Clifftop Dervish Tekke & Spring Sanctuary',
    description: 'Seeking a 600-year Ottoman monastery built directly under a 200-meter vertical limestone cliff over a turquoise karst spring river.',
    category: 'culture',
    targetRegion: 'Blagaj & Mostar, Bosnia & Herzegovina',
    rewardXp: 800,
    status: 'solved',
    solvedBy: 'Sarah Chen',
    solvedPlace: 'Blagaj Tekke, Buna Spring',
    createdAt: '1 week ago'
  },
  {
    id: 11,
    creatorName: 'Maya Lin',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Pastel Fishing Village Staircase Down to Hidden Low-Tide Pier',
    description: 'Looking for a secret staircase carved through seaside vineyards leading down to an uncrowded pastel harbor in the Italian Riviera.',
    category: 'coastal',
    targetRegion: 'Cinque Terre, Liguria, Italy',
    rewardXp: 700,
    status: 'active',
    solvedBy: null,
    solvedPlace: null,
    createdAt: '2 days ago'
  },
  {
    id: 12,
    creatorName: 'Elena Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Carved Volcanic Sea Arches & Hidden Emerald Pirate Cove',
    description: 'Discovered the legendary volcanic sea caves and gleaming white limestone stacks where pirate frigates concealed themselves in the Cyclades.',
    category: 'coastal',
    targetRegion: 'Milos, Cyclades Islands, Greece',
    rewardXp: 900,
    status: 'solved',
    solvedBy: 'Elena Vance',
    solvedPlace: 'Kleftiko White Volcanic Arches',
    createdAt: '2 weeks ago'
  }
];

// --- Substack-Style Serialized Micro-Publications Dataset ---
const PUBLICATIONS_DATA = [
  {
    id: "pub_1",
    title: "The Wild Caucasus Chronicles",
    subtitle: "A 3-part expedition through isolated mountain fortresses and glacier valleys in Svaneti",
    author: {
      name: "Giorgi Tabatadze",
      handle: "@giorgi_svaneti",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      subscribers: 2480
    },
    cover: "https://images.unsplash.com/photo-1788094710338-7f13749c72e4?auto=format&fit=crop&w=1000&q=80",
    badge: "🏔️ Alpine Expedition",
    chapters: [
      {
        title: "Part 1: The Valley of Stone Watchtowers",
        readTime: "5 min read",
        excerpt: "Entering Mestia as evening fog wraps around 1,000-year-old defensive towers built during the Golden Age of Georgia.",
        content: `
          <p>Perched high in the Greater Caucasus, Svaneti remained isolated from outside conquerors for centuries. As our 4x4 climbed the eroded gravel pass along the Enguri Gorge, the silhouettes of hundreds of stone towers suddenly pierced through the autumn mist.</p>
          <p>Each family tower (koshki) stood 4 to 5 stories tall, built entirely from local river stone and limestone mortar. They weren't mere military outposts—they were self-contained refuges where families survived avalanches, clan feuds, and brutal Caucasian winters.</p>
          <div class="itinerary-tip-callout" style="margin: 20px 0;">
            <strong>🤫 Explorer's Field Note:</strong> Always remove your boots before entering a traditional Svaneti machubi room; family elders will immediately pour you homemade cha-cha and hot sulguni cheese bread.
          </div>
        `
      },
      {
        title: "Part 2: Ushguli — Europe's Highest Inhabited Hamlet",
        readTime: "6 min read",
        excerpt: "Trekking 2,200 meters above sea level to the base of Mount Shkhara's glacial wall.",
        content: `
          <p>Ushguli is where the road ends and the glacial moraine begins. In late October, snow blankets the cobblestone footpaths while woodsmoke curls from slate chimneys.</p>
          <p>Life here moves at the pace of centuries ago. Horses are tied outside stone gatehouses, and water is collected directly from glacier springs flowing through carved pine troughs.</p>
        `
      },
      {
        title: "Part 3: The Secret Alpine Salt of Svaneti",
        readTime: "4 min read",
        excerpt: "Inside a mountain grandmother's kitchen learning the ancient recipe for coriander-infused sea salt.",
        content: `
          <p>The culinary soul of the Caucasus lies in Svanuri Marili (Svaneti Salt). Prepared by hand using local garlic, coriander seed, red pepper, and wild alpine herbs gathered in August, it transforms simple roasted potatoes and khinkali into unforgettable feasts.</p>
        `
      }
    ]
  },
  {
    id: "pub_2",
    title: "Subterranean Andalusia: The Boulder Towns",
    subtitle: "Exploring ancient troglodyte settlements and canyon dwellings across Cadiz and Ronda",
    author: {
      name: "Mateo Fernandez",
      handle: "@mateotravels",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      subscribers: 3150
    },
    cover: "https://images.unsplash.com/photo-1684862363333-4f5ab43e7edf?auto=format&fit=crop&w=1000&q=80",
    badge: "🏘️ Troglodyte Architecture",
    chapters: [
      {
        title: "Part 1: Living Beneath Two Million Tons of Rock",
        readTime: "5 min read",
        excerpt: "How the inhabitants of Setenil turned geological overhangs into naturally climate-controlled whitewashed streets.",
        content: `
          <p>Walking down Calle Cuevas del Sol feels like walking into the jaws of a sleeping giant. The natural basalt and sandstone overhang extends tens of meters above the road, forming a natural ceiling that never allows rain to touch the cobblestones.</p>
          <p>Inside the homes, the back walls are pure, unpolished bedrock. In the scorching 42°C Andalusian summer, step inside one of these cave dwellings and the temperature instantly drops to a cool 19°C.</p>
        `
      },
      {
        title: "Part 2: The Secret Olive Mills of the Rio Trejo Gorge",
        readTime: "4 min read",
        excerpt: "Hidden canyon trails leading to 300-year-old water-powered stone olive presses.",
        content: `
          <p>Beyond the tourist cafes lies a quiet footpath winding downstream along Rio Trejo. Here, forgotten hydraulic mills dating back to Moorish times sit enveloped by wild fig trees and blackberry brambles.</p>
        `
      }
    ]
  },
  {
    id: "pub_3",
    title: "Whispering Waterways: Roadless Europe",
    subtitle: "Gliding through quiet peat canals, wooden bridges, and secret coastal whisper hamlets",
    author: {
      name: "Anouk Van Dijk",
      handle: "@anoukvandijk",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      subscribers: 1890
    },
    cover: "https://images.unsplash.com/photo-1590435525959-40d4af82c270?auto=format&fit=crop&w=1000&q=80",
    badge: "🛶 Water Sanctuary",
    chapters: [
      {
        title: "Part 1: Giethoorn Before the World Wakes Up",
        readTime: "4 min read",
        excerpt: "The quiet magic of rowing through morning mist with 176 wooden bridges without a single combustion engine.",
        content: `
          <p>At 6:30 AM, Giethoorn is pure glass. The thatched 18th-century farmhouses reflect perfectly in emerald canal water. Mallards glide silently beneath curved wooden footbridges, and the only sound is the soft drip from your wooden paddle.</p>
        `
      },
      {
        title: "Part 2: The Peat Island Dwellers",
        readTime: "5 min read",
        excerpt: "How historic farmers dug canals by hand to transport cows on wooden punts.",
        content: `
          <p>Every island in Giethoorn was dug by hand centuries ago for peat extraction. Because horses and tractors couldn't cross the soft marshland, farmers trained their cattle to board flat-bottomed punt boats to reach pastures.</p>
        `
      }
    ]
  }
];

// --- Escape Mode Ambient Scenes Dataset ---
const ESCAPE_SCENES = [
  {
    id: "esc_1",
    shortName: "Blagaj",
    title: "Emerald Karst Spring & Cavern Drips",
    location: "Blagaj Tekke, Bosnia & Herzegovina",
    quote: '"Subterranean emerald water emerges from 200m limestone cliffs with gentle cave rain."',
    imageUrl: "https://images.unsplash.com/photo-1652287350277-db5ba07dfd46?auto=format&fit=crop&w=2400&q=85",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
    coords: [43.2567, 17.9034],
    postId: 2
  },
  {
    id: "esc_2",
    shortName: "Svaneti",
    title: "Sunset Mist Over Svaneti Medieval Watchtowers",
    location: "Ushguli, Svaneti, Georgia",
    quote: '"Medieval stone towers guarded by the glaciers of Mount Shkhara with crisp mountain breezes."',
    imageUrl: "https://images.unsplash.com/photo-1788094710338-7f13749c72e4?auto=format&fit=crop&w=2400&q=85",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-winding-road-in-a-mountain-valley-41387-large.mp4",
    coords: [42.9175, 43.0167],
    postId: 5
  },
  {
    id: "esc_3",
    shortName: "Giethoorn",
    title: "Whispering Peat Canals & Rain Drops",
    location: "Giethoorn, Overijssel, Netherlands",
    quote: '"Quiet morning whisper boat ride through wooden bridges without a single car."',
    imageUrl: "https://images.unsplash.com/photo-1590435525959-40d4af82c270?auto=format&fit=crop&w=2400&q=85",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-beach-1406-large.mp4",
    coords: [52.7402, 6.0792],
    postId: 4
  },
  {
    id: "esc_4",
    shortName: "Setenil",
    title: "Twilight Canyon Silence & Boulder Roofs",
    location: "Setenil de las Bodegas, Cadiz, Spain",
    quote: '"Resting beneath 2 million tons of natural boulder ceiling while the canyon breeze cools the whitewashed walls."',
    imageUrl: "https://images.unsplash.com/photo-1684862363333-4f5ab43e7edf?auto=format&fit=crop&w=2400&q=85",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-winding-road-in-a-mountain-valley-41387-large.mp4",
    coords: [36.8642, -5.1814],
    postId: 1
  },
  {
    id: "esc_5",
    shortName: "Dolomites",
    title: "Alpine Cloud Inversion & Dolomite Peaks",
    location: "Cortina d'Ampezzo, Dolomites, Italy",
    quote: '"Floating above a sea of alpine clouds at 2,400m elevation while the morning sun warms the limestone pinnacles."',
    imageUrl: "https://images.unsplash.com/photo-1790378338449-e189c8bec45c?auto=format&fit=crop&w=2400&q=85",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-winding-road-in-a-mountain-valley-41387-large.mp4",
    coords: [46.5383, 12.1376],
    postId: 8
  },
  {
    id: "esc_6",
    shortName: "Huacachina",
    title: "Golden Hour Glow Over Desert Lagoon Dunes",
    location: "Huacachina Oasis, Ica, Peru",
    quote: '"Palm trees swaying around an emerald desert lake encircled by glowing 500-foot golden sand dunes."',
    imageUrl: "https://images.unsplash.com/photo-1769358758778-5b12f301051b?auto=format&fit=crop&w=2400&q=85",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
    coords: [-14.0875, -75.7626],
    postId: 3
  }
];
