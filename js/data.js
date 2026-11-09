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
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
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
  },
  {
    id: 11,
    title: "Hampi: Monolithic Boulder Kingdom & Sacred Riverside Temples",
    placeName: "Hampi Bouldered Ruins",
    country: "India",
    locationQuery: "Hampi, Karnataka, India",
    coords: [15.3350, 76.4600],
    gemScore: "9.9",
    category: "culture",
    categoryLabel: "Ancient Kingdom",
    readTime: "6 min read",
    date: "1 day ago",
    bestTime: "October - March",
    budget: "$20 - $40 / day",
    author: {
      name: "Aarav Sharma",
      handle: "@aarav_wanderer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A surreal open-air museum where millions of colossal golden boulders balance precariously over 14th-century Vijayanagara empire palaces.",
    secretTip: "Cross the Tungabhadra river on a round wicker coracle boat at sunrise to Sanapur Lake where granite rocks glow amber.",
    fullContent: "<h4>The Forgotten Capital</h4><p>Once one of the richest medieval cities in the world, Hampi’s ruins stretch across 41 square kilometers of rugged rock-strewn landscape. Silent chariot stone temples sit quietly alongside tranquil banana plantations.</p>",
    likes: 540,
    isLiked: true,
    comments: []
  },
  {
    id: 12,
    title: "Dhankar Gompa: Cliffside Citadel Over Spiti Valley",
    placeName: "Dhankar Cliff Gompa",
    country: "India",
    locationQuery: "Dhankar Gompa, Spiti Valley, Himachal Pradesh, India",
    coords: [32.0225, 78.2144],
    gemScore: "9.8",
    category: "nature",
    categoryLabel: "Himalayan Citadel",
    readTime: "7 min read",
    date: "2 days ago",
    bestTime: "June - September",
    budget: "$25 - $45 / day",
    author: {
      name: "Pooja Malhotra",
      handle: "@poojaspiti",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Perched dramatically at 3,894m on a razor-thin clay needle ridge overlooking the confluence of the Spiti and Pin rivers.",
    secretTip: "Hike 45 minutes up the mountain trail behind the monastery to reach turquoise Dhankar Lake tucked secretly beneath jagged peaks.",
    fullContent: "<h4>High-Altitude Solitude</h4><p>Dhankar was the historic capital of the Spiti kingdom. Its mud-brick fortress and ancient Buddhist shrine have clung to crumbly clay cliffs for over 1,000 years.</p>",
    likes: 412,
    isLiked: false,
    comments: []
  },
  {
    id: 13,
    title: "Mawlynnong: Living Root Bridges in Cloud Rainforests",
    placeName: "Mawlynnong Root Bridges",
    country: "India",
    locationQuery: "Mawlynnong, East Khasi Hills, Meghalaya, India",
    coords: [25.2970, 91.9054],
    gemScore: "9.7",
    category: "nature",
    categoryLabel: "Bio-Architecture",
    readTime: "5 min read",
    date: "3 days ago",
    bestTime: "September - May",
    budget: "$25 - $50 / day",
    author: {
      name: "Rohan Das",
      handle: "@rohandas",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Ingenious suspension bridges grown from living Ficus elastica tree roots by Khasi tribes across rushing monsoon gorges.",
    secretTip: "Walk beyond the village center to Riwai single-decker bridge at 7:00 AM when mist hovers over the emerald rainforest stream.",
    fullContent: "<h4>Trees That Grow Into Bridges</h4><p>Rather than cutting timber that rots in heavy monsoons, indigenous tribes train living rubber fig tree roots across rivers over decades, creating indestructible living bridges.</p>",
    likes: 388,
    isLiked: true,
    comments: []
  },
  {
    id: 14,
    title: "Civita di Bagnoregio: The Floating Clifftop Island",
    placeName: "Civita di Bagnoregio",
    country: "Italy",
    locationQuery: "Civita di Bagnoregio, Viterbo, Italy",
    coords: [42.6275, 12.1136],
    gemScore: "9.9",
    category: "village",
    categoryLabel: "Floating Island",
    readTime: "5 min read",
    date: "4 days ago",
    bestTime: "April - June & Sept - Oct",
    budget: "$45 - $80 / day",
    author: {
      name: "Elena Vance",
      handle: "@elenavance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1528114039593-4366cc08227d?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A fragile 2,500-year-old Etruscan citadel perched high atop a steep volcanic plateau connected only by a soaring footbridge.",
    secretTip: "Cross the pedestrian suspension bridge before 8:30 AM when morning valley clouds make the citadel look like an island in the sky.",
    fullContent: "<h4>The City in the Clouds</h4><p>With only about a dozen permanent residents, Civita di Bagnoregio is carved entirely from volcanic tuff rock and offers complete medieval silence above clay canyons.</p>",
    likes: 470,
    isLiked: false,
    comments: []
  },
  {
    id: 15,
    title: "Quinta da Regaleira: Initiation Wells & Subterranean Grottoes",
    placeName: "Quinta da Regaleira",
    country: "Portugal",
    locationQuery: "Quinta da Regaleira, Sintra, Portugal",
    coords: [38.7963, -9.3960],
    gemScore: "9.8",
    category: "culture",
    categoryLabel: "Subterranean Mystic",
    readTime: "4 min read",
    date: "5 days ago",
    bestTime: "March - November",
    budget: "$35 - $70 / day",
    author: {
      name: "Mateo Fernandez",
      handle: "@mateotravels",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Spiraling 27-meter subterranean stone wells and secret labyrinth caves built into lush Sintra mountain mist.",
    secretTip: "Descend the stone stairs of the Initiation Well, then step across the mossy stones over the hidden underground lagoon pool.",
    fullContent: "<h4>The Mystic Initiation</h4><p>Built with Masonic, Knights Templar, and Rosicrucian symbolism, this estate features underground passageways leading to hidden waterfall caves.</p>",
    likes: 520,
    isLiked: true,
    comments: []
  },
  {
    id: 16,
    title: "Subterranean Guanajuato: City Built Inside Ancient River Tunnels",
    placeName: "Subterranean Guanajuato",
    country: "Mexico",
    locationQuery: "Guanajuato, Mexico",
    coords: [21.0190, -101.2574],
    gemScore: "9.8",
    category: "village",
    categoryLabel: "Underground Network",
    readTime: "5 min read",
    date: "6 days ago",
    bestTime: "October - April",
    budget: "$30 - $60 / day",
    author: {
      name: "Carlos Mendoza",
      handle: "@carlos_andes",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A UNESCO colonial jewel where cars and pedestrians journey through a massive underground labyrinth of stone river conduits.",
    secretTip: "Enter Callejon del Padre Belauzarán tunnel on foot at dusk to see the stone arches lit by lanterns with zero street traffic.",
    fullContent: "<h4>The City with Two Levels</h4><p>Originally carved out to prevent flooding in the silver mining boom, Guanajuato’s stone tunnels now create the most unique subterranean transit network in Latin America.</p>",
    likes: 340,
    isLiked: false,
    comments: []
  },
  {
    id: 17,
    title: "Sedona Secret Subway Cave: Hidden Keyhole Red Rock Grotto",
    placeName: "Sedona Secret Subway Cave",
    country: "United States",
    locationQuery: "Boynton Canyon, Sedona, Arizona, USA",
    coords: [34.9080, -111.8385],
    gemScore: "9.9",
    category: "nature",
    categoryLabel: "Red Rock Grotto",
    readTime: "6 min read",
    date: "1 week ago",
    bestTime: "October - May",
    budget: "$50 - $95 / day",
    author: {
      name: "Maya Lin",
      handle: "@mayawanders",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A breathtaking natural keyhole slot cavern carved into crimson sandstone cliffs far off the main hiking paths.",
    secretTip: "Branch off Boynton Canyon trail at the alligator juniper tree at mile 2.1 to scramble up the hidden sandstone tunnel for the keyhole vista.",
    fullContent: "<h4>Sedona’s Greatest Kept Secret</h4><p>Hidden high above the canyon floor, this pristine amphitheater cave frames ancient Sinagua cliff dwellings and panoramic red rock pinnacles.</p>",
    likes: 615,
    isLiked: true,
    comments: []
  },
  {
    id: 18,
    title: "Shirakawa-go: Thatched Roof Gassho-Zukuri Alpine Hamlet",
    placeName: "Shirakawa-go Village",
    country: "Japan",
    locationQuery: "Shirakawa-go, Gifu, Japan",
    coords: [36.2562, 136.9066],
    gemScore: "9.8",
    category: "village",
    categoryLabel: "Thatched Haven",
    readTime: "5 min read",
    date: "1 week ago",
    bestTime: "December - February & May",
    budget: "$55 - $110 / day",
    author: {
      name: "Mei-Ling Chen",
      handle: "@meiling_tw",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Ancient triangular thatched farmhouses built without a single nail to withstand massive alpine snowfall in remote mountain valleys.",
    secretTip: "Walk up to Shiroyama Viewpoint on the old castle hill for the postcard panorama of 300-year-old steep thatched roof farmhouses.",
    fullContent: "<h4>Hands in Prayer</h4><p>The Gassho-zukuri architecture resembles hands folded in prayer. Each spring, the entire village bands together to re-thatch roofs in a centuries-old tradition called 'Yui'.</p>",
    likes: 490,
    isLiked: true,
    comments: []
  },
  {
    id: 19,
    title: "Pai Canyon: Red Sandstone Razor Ridges & Jungle Chasms",
    placeName: "Pai Canyon",
    country: "Thailand",
    locationQuery: "Pai Canyon, Mae Hong Son, Thailand",
    coords: [19.3039, 98.4528],
    gemScore: "9.7",
    category: "nature",
    categoryLabel: "Clay Labyrinth",
    readTime: "4 min read",
    date: "2 weeks ago",
    bestTime: "November - February",
    budget: "$20 - $38 / day",
    author: {
      name: "Sarah Chen",
      handle: "@sarah",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Narrow zigzag sandstone canyon ridges with steep 30m vertical drop-offs overlooking emerald Thai mountain valleys.",
    secretTip: "Walk the narrow 1-meter razor-thin red clay ridge paths to the third viewpoint 45 minutes before golden hour for breathtaking jungle valley views.",
    fullContent: "<h4>Thailand’s Grand Canyon</h4><p>Carved by centuries of seasonal monsoon erosion, Pai Canyon offers high-adrenaline ridge walks and panoramic vistas of northern Thailand’s forested peaks.</p>",
    likes: 360,
    isLiked: false,
    comments: []
  },
  {
    id: 20,
    title: "Siwa Oasis: Ancient Mud Fortresses & Neon Turquoise Salt Springs",
    placeName: "Siwa Desert Oasis",
    country: "Egypt",
    locationQuery: "Siwa Oasis, Western Desert, Egypt",
    coords: [29.2032, 25.5195],
    gemScore: "9.9",
    category: "nature",
    categoryLabel: "Mineral Salt Springs",
    readTime: "6 min read",
    date: "2 weeks ago",
    bestTime: "October - April",
    budget: "$30 - $55 / day",
    author: {
      name: "Leila Halilovic",
      handle: "@leila_h",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1000&q=80",
    excerpt: "An isolated desert haven near the Libyan border famous for buoyant turquoise salt pools, olive groves, and the ancient oracle of Amun.",
    secretTip: "Swim in the subterranean hot spring of Cleopatra’s Bath then float weightlessly in the neon-cyan salt crystal lagoons of the Great Sand Sea.",
    fullContent: "<h4>The Jewel of the Great Sand Sea</h4><p>Surrounded by hundreds of kilometers of barren Sahara dunes, Siwa’s organic salt lakes are so hyper-saline you float completely effortlessly without sinking.</p>",
    likes: 510,
    isLiked: true,
    comments: []
  },
  {
    id: 21,
    title: "Plitvice Secret Upper Cascades: Untouched Travertine Lakes",
    placeName: "Plitvice Upper Cascades",
    country: "Croatia",
    locationQuery: "Plitvice Lakes National Park, Croatia",
    coords: [44.8654, 15.6031],
    gemScore: "9.8",
    category: "coastal",
    categoryLabel: "Cascading Lakes",
    readTime: "5 min read",
    date: "3 weeks ago",
    bestTime: "May - June & September - October",
    budget: "$40 - $75 / day",
    author: {
      name: "Anouk Van Dijk",
      handle: "@anoukvandijk",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1589312133722-eab40c686ebb?auto=format&fit=crop&w=1000&q=80",
    excerpt: "16 interconnected crystalline turquoise lakes cascading through ancient dolomite travertine dams and pristine beech forests.",
    secretTip: "Take Trail K from Entrance 2 at 7:00 AM to walk the quiet wooden boardwalks over crystal travertine waterfalls with zero tourist crowds.",
    fullContent: "<h4>Liquid Turquoise</h4><p>The natural biological travertine barriers constantly shift and grow moss year-over-year, creating ever-evolving turquoise water terraces and hidden cave springs.</p>",
    likes: 430,
    isLiked: false,
    comments: []
  },
  {
    id: 22,
    title: "Hallstatt Alpine Trails: Ancient Salt Mine High Above The Fjord",
    placeName: "Hallstatt Mountain Trail",
    country: "Austria",
    locationQuery: "Hallstatt, Salzkammergut, Austria",
    coords: [47.5622, 13.6493],
    gemScore: "9.7",
    category: "coastal",
    categoryLabel: "Alpine Fjord Trail",
    readTime: "5 min read",
    date: "3 weeks ago",
    bestTime: "May - October",
    budget: "$60 - $110 / day",
    author: {
      name: "Elena Vance",
      handle: "@elenavance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1652433062476-43e6dd7753b1?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Skip the crowded lower lakefront to hike the 7,000-year-old salt carrier footpath clinging to sheer alpine crags.",
    secretTip: "Skip the lakeside selfie crowd and hike up through the Soleleitung trail—the world’s oldest industrial pipeline trail hugging mountain waterfalls.",
    fullContent: "<h4>Beyond The Postcard</h4><p>The upper mountain paths lead to the oldest salt mine on Earth, dating back 7,000 years, offering sweeping silence high above the misty fjord.</p>",
    likes: 390,
    isLiked: true,
    comments: []
  },
  {
    id: 23,
    title: "Chefchaouen Blue Medina: Cobalt Alleys & Cascades of Akchour",
    placeName: "Chefchaouen Blue Medina",
    country: "Morocco",
    locationQuery: "Chefchaouen, Rif Mountains, Morocco",
    coords: [35.1688, -5.2636],
    gemScore: "9.8",
    category: "village",
    categoryLabel: "The Blue Pearl",
    readTime: "5 min read",
    date: "1 month ago",
    bestTime: "March - May & September - November",
    budget: "$25 - $50 / day",
    author: {
      name: "Mateo Fernandez",
      handle: "@mateotravels",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A dreamlike mountain town washed in endless shades of powder blue, indigo, and cobalt beneath the rugged peaks of the Rif mountains.",
    secretTip: "Hike up to the Spanish Mosque on the eastern hill at sunset to hear the call to prayer echo across the indigo blue-washed valley.",
    fullContent: "<h4>The Blue Pearl of the Rif</h4><p>Founded in 1471, the blue walls were painted by Sephardic Jewish and Moorish refugees to mirror the heavens. Just 30 minutes away lie the hidden river gorges and natural rock arch bridges of Akchour.</p>",
    likes: 475,
    isLiked: false,
    comments: []
  },
  {
    id: 24,
    title: "Incahuasi Island: Giant Cacti in the Endless White Salt Mirror",
    placeName: "Salar de Uyuni Cactus Island",
    country: "Bolivia",
    locationQuery: "Incahuasi Island, Salar de Uyuni, Bolivia",
    coords: [-20.2483, -67.6256],
    gemScore: "9.9",
    category: "nature",
    categoryLabel: "Salt Flat Oasis",
    readTime: "6 min read",
    date: "1 month ago",
    bestTime: "Jan - April (Mirror) or May - Nov (Hexagons)",
    budget: "$40 - $75 / day",
    author: {
      name: "Carlos Mendoza",
      handle: "@carlos_andes",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A rocky volcanic island covered in 1,000-year-old giant Trichocereus cacti stranded in the middle of 10,000 square km of pure white salt.",
    secretTip: "Wake at 4:30 AM to watch the Milky Way reflect symmetrically on the glass-flat salt flats before the morning sun turns the crust rose gold.",
    fullContent: "<h4>The Sea of White</h4><p>At 3,656 meters elevation on the Bolivian Altiplano, Uyuni is the world’s largest salt desert. When a thin sheet of rainwater covers it, it forms the largest mirror on planet Earth.</p>",
    likes: 580,
    isLiked: true,
    comments: []
  },
  {
    id: 25,
    title: "Lençóis Maranhenses: Crystal Rainwater Lagoons in Pure White Dunes",
    placeName: "Lençóis Maranhenses",
    country: "Brazil",
    locationQuery: "Lençóis Maranhenses National Park, Maranhão, Brazil",
    coords: [-2.4870, -43.1250],
    gemScore: "9.9",
    category: "coastal",
    categoryLabel: "Dune Lagoons",
    readTime: "7 min read",
    date: "1 month ago",
    bestTime: "June - September",
    budget: "$45 - $85 / day",
    author: {
      name: "Sofia Alarcon",
      handle: "@sofia_alarcon",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Hundreds of kilometers of blinding white sand dunes that fill each monsoon season with thousands of emerald and blue freshwater lagoons.",
    secretTip: "Visit between June and August when seasonal rains fill the valleys between blinding white sand dunes with crystal turquoise freshwater pools.",
    fullContent: "<h4>A Mirage Made Real</h4><p>Though it resembles a desert, Lençóis receives 1,200mm of rain annually. Impermeable rock beneath the sand prevents water from draining, creating an impossible labyrinth of thousands of pristine swimming lagoons.</p>",
    likes: 620,
    isLiked: true,
    comments: []
  }
];

if (typeof window !== 'undefined') {
  window.INITIAL_POSTS = INITIAL_POSTS;
}

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
