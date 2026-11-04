# 🌲 HopStop — The Hidden Gem & Expedition Community 💎

[![HopStop](https://img.shields.io/badge/HopStop-Travel%20Discovery-orange?style=for-the-badge&logo=compass&logoColor=white)](https://github.com/GitOmii404/hopstop)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-brightgreen?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend%20Ready-emerald?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **HopStop** is a social discovery and crowdsourced expedition platform built for modern travelers seeking authentic, underrated destinations, secret cliffside coves, subterranean caves, and off-grid mountain sanctuaries far from tourist crowds.

---

## 🌟 Key Highlights & Feature Matrix

### 🗺️ Live Interactive Cartography
* **Zero-Watermark OpenStreetMap Engine**: Crisp, high-definition vector map powered by Leaflet.js with custom coordinate telemetry.
* **Filter by Expedition Category**: Villages, Alpine Sanctuaries, Secret Coastlines, Ancient Cellars, and Historic Craftsmanship.
* **GPS Coordinate Telemetry HUD**: Live sensor display indicating closest coordinates, altitude, and leave-no-trace terrain difficulty.

### 📌 Collaborative Dream Boards ("Co-Saving")
* **Crew Collaboration**: Create shared or private moodboards with real-time crew tagging (`@sarah`, `@leo`) and expedition notes.
* **Turn-by-Turn Route Conversion**: Instantly transform any curated moodboard into an optimized multi-stop expedition with one click.
* **Rich Visual Mosaic**: Multi-image preview tiles showcasing authentic photographs of each saved waypoint.

### 🎯 Crowdsourced Travel Bounty Board
* **Community Quests**: Post requests for elusive spots (e.g., hidden dervish springs, alpine cloud bivouacs, secret speakeasies).
* **XP Rewards & Solved Verification**: Claim and solve community bounties with verified GPS coordinates and photo proof.
* **Balanced Explorer Board**: 12 bounties across Nature, Culture, and Coastal ecosystems with active and verified states.

### 🏆 Weekly Photo Battles
* **Weekly Themed Showdowns**: Explorers submit high-resolution sunrise and vista photography under strict community budget rules (e.g. *Best Hidden Sunrise Under $10*).
* **Live Voting & Hall of Fame**: Dynamic countdown timers, upvoting mechanisms, and immortalized Hall of Fame champion cards.

### 🗺️ Multi-Stop Route Planner & Road-Trip Mode
* **Intelligent Sequencing**: Build multi-day itineraries with automatic mileage, drive-time, and transit estimation.
* **Google Maps GPS Navigation**: One-click deep link to navigate full turn-by-turn routes in Google Maps.
* **Live Road-Trip Cockpit**: Fullscreen driving HUD mode designed for on-the-road travel navigation.

### 🎧 Ambient Escape Theater
* **Cinematic Soundscapes**: High-fidelity looping field ambience (rain on thatched roofs, mountain glacial wind, cavern water drips, roaring fire).
* **Zen Immersion Timer**: Integrated meditation & focus timer with ambient background visuals from real hidden gems (Ushguli, Blagaj, Giethoorn).

### 📰 Serialized Micro-Publications & Creator Field Guides
* **Longform Expedition Chronicles**: Multi-part deep-dive journals (*The Wild Caucasus Chronicles*, *Subterranean Andalusia*).
* **Locked Creator Field Guides**: Exclusive dossiers with high-precision coordinates, offline GPX waypoints, and vetted local fixer contacts unlocked via Gem XP.

### 🛂 Travel Passport & Gamification Deck
* **Scratch-Off Country Stamps**: Interactive digital passport collecting bespoke rubber stamps as you explore destinations worldwide.
* **Daily Streaks & Explorer Badges**: 5-level rank progression system (Wanderer → Alpine Seeker → Master Cartographer → Early Pioneer).

---

## 🏗️ Architecture & Technology Stack

```
hopstop/
├── 📄 index.html            # Main discovery portal, hero carousel, telemetry HUD & map
├── 📄 feed.html             # Social community feed, check-ins, modal lightboxes & comments
├── 📄 boards.html           # Collaborative dream boards & locked creator dossiers
├── 📄 bounties.html         # Crowdsourced bounty board & quest claim flow
├── 📄 planner.html          # Multi-stop route planner, turn-by-turn map & transit metrics
├── 📄 battles.html          # Weekly photo battles, voting engine & Hall of Fame
├── 📄 publications.html     # Longform serialized micro-publications
├── 📁 js/
│   ├── app-init.js          # App lifecycle, safe execution & route bootstrapping
│   ├── auth.js              # Authentication, session & simulated user state
│   ├── battles.js           # Photo battle voting, submissions & countdown
│   ├── boards.js            # Dream boards engine, modal pinning & board filtering
│   ├── bounties.js          # Travel bounties resolver & modal claim flow
│   ├── cloud.js             # Supabase cloud hydration & synchronization
│   ├── creator-guides.js    # Locked dossiers, micro-monetization & XP unlocking
│   ├── crew-chat.js         # Real-time expedition crew chat widget
│   ├── daily-streak.js      # Daily explorer habit tracking & streak multiplier
│   ├── data.js              # Master dataset (Posts, Stories, Gallery, Bounties, Guides)
│   ├── escape.js            # Ambient Escape Theater & Web Audio synthesizer
│   ├── feed.js              # Social feed rendering, filters & check-ins
│   ├── gallery.js           # Masonry photo wall, filters & contribution modal
│   ├── gamification.js      # XP engine, badges & level calculation
│   ├── human-craft.js       # UI micro-interactions, sound effects & ambient audio
│   ├── leaderboard.js       # Global top-finders leaderboard & rankings
│   ├── map.js               # Leaflet.js interactive world map & telemetry
│   ├── micro-adventures.js  # Nearby radius compass calculation
│   ├── notifications.js     # Expedition notification dispatch center
│   ├── passport.js          # Digital travel passport & stamp collection
│   ├── planner.js           # Itinerary sequencer & OpenStreetMap route layer
│   ├── postcard-thread.js   # Community postcard thread & comments
│   ├── publications.js      # Serialized micro-magazine reader
│   ├── state.js             # Centralized application state & automatic schema migration
│   ├── stories.js           # Instagram-style ephemeral story viewer
│   ├── trip-mode.js         # Fullscreen driving cockpit HUD
│   └── ui-effects.js        # Confetti celebrations, modals & toast feedback
├── 📁 css/                  # Modular styles (variables, themes, animations, layouts)
├── 📁 audio/                # Ambient nature recordings & wanderlust audio
├── 📄 schema.sql            # Supabase PostgreSQL relational database schema
└── 📄 README.md             # Project documentation
```

### Stack Components:
* **Frontend Core**: Vanilla ES6+ JavaScript (Zero heavyweight framework overhead, blazing fast execution).
* **Mapping**: Leaflet 1.9.4 with official OpenStreetMap tiles and Cartographic HUD.
* **Audio Engine**: Web Audio API with procedural noise synthesis (rain, wind, stream, fire) + native ambient audio tracks.
* **Storage & Persistence**: Client-side storage with built-in versioned migration engine (`hopstop_data_version`) + Supabase PostgreSQL schema ready for cloud deployment.
* **Design System**: Warm organic human craft aesthetic with fluid responsive grid, CSS custom properties, and full Dark/Light theme toggle.

---

## 🚀 Getting Started

### Local Setup (No build tools required)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GitOmii404/hopstop.git
   cd hopstop
   ```

2. **Start a local development server:**
   * **Python 3:**
     ```bash
     python -m http.server 8000
     ```
   * **Node.js (npx):**
     ```bash
     npx serve -l 8000 .
     ```
   * **VS Code:** Install the *Live Server* extension and click **Go Live**.

3. **Open in your browser:**
   ```
   http://localhost:8000
   ```

---

## 🗄️ Database Setup (Optional — Supabase)

To link HopStop with Supabase cloud database:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and execute the contents of [`schema.sql`](./schema.sql).
4. Update your Supabase URL and public anon key in [`js/cloud.js`](./js/cloud.js).

---

## 🌿 Leave-No-Trace & Preservation Code

HopStop is dedicated to protecting fragile natural environments and living cultural heritage:
* **Take only pictures, leave only footprints.**
* Never disclose sensitive ecological coordinates for endangered flora or fauna habitats.
* Support family-run mountain huts, local artisans, and indigenous guesthouses.
* Pack out all waste and respect private property boundaries.

---

## 🤝 Contributing

Contributions, bug reports, and destination recommendations are warmly welcome!
1. Fork the Project (`https://github.com/GitOmii404/hopstop/fork`)
2. Create your Feature Branch (`git checkout -b feature/EpicSecretSpot`)
3. Commit your Changes (`git commit -m 'feat: Add secret fjord guesthouse'`)
4. Push to the Branch (`git push origin feature/EpicSecretSpot`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<p align="center">
  Crafted with ❤️ by explorers, for explorers. Happy hopping! 🧭✨
</p>
