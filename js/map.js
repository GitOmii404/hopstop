/**
 * HopStop — Leaflet.js Interactive World Map Engine & Diamond Markers
 */

// ==========================================================================
// Leaflet.js Interactive World Map Engine
// ==========================================================================

let activeMapTheme = 'google';

function initLeafletMap() {
  const mapContainer = document.getElementById('hopstopWorldMap');
  if (!mapContainer || leafletMap || typeof L === 'undefined') return;

  // Initialize map centered on Europe/Mediterranean crossway
  leafletMap = L.map('hopstopWorldMap', {
    center: [32.0, 15.0],
    zoom: 2.5,
    minZoom: 2,
    maxZoom: 18,
    zoomControl: true,
    scrollWheelZoom: false // disable accidental scroll on page flow
  });

  // Enable scroll zoom on click/focus
  leafletMap.on('focus', () => leafletMap.scrollWheelZoom.enable());
  leafletMap.on('blur', () => leafletMap.scrollWheelZoom.disable());

  // Set theme tile layer
  updateMapTiles();

  // Create layer group for pins
  mapMarkerLayerGroup = L.layerGroup().addTo(leafletMap);

  // Plot all destination markers
  plotMapPins();

  // Update map stats
  updateMapStats();

  // Auto-detect user location & render 10 nearest places
  setTimeout(() => {
    initUserLocationAndNearestGems();
  }, 350);

  setTimeout(() => {
    if (leafletMap) leafletMap.invalidateSize();
  }, 250);
}

function updateMapTiles(theme = activeMapTheme) {
  if (!leafletMap || typeof L === 'undefined') return;

  activeMapTheme = theme;

  if (mapTileLayer) {
    leafletMap.removeLayer(mapTileLayer);
  }

  // 100% Free, High-Res Map Layers (No CARTO, No Watermark, No API Key Required)
  let tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
  let subdomains = ['0', '1', '2', '3'];
  let attribution = '&copy; <a href="https://maps.google.com" target="_blank">Google Maps</a>';

  if (theme === 'satellite') {
    // Google Maps Satellite + Street / City Labels Hybrid
    tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    subdomains = ['0', '1', '2', '3'];
    attribution = '&copy; <a href="https://maps.google.com" target="_blank">Google Maps Satellite</a>';
  } else if (theme === 'dark') {
    // Dark Canvas Map (Esri Clean Dark)
    tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    subdomains = ['server'];
    attribution = '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> &mdash; Dark Canvas';
  } else if (theme === 'osm') {
    // OpenStreetMap Standard
    tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    subdomains = ['a', 'b', 'c'];
    attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';
  } else {
    // Default Clean Street Map (Google Maps)
    tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    subdomains = ['0', '1', '2', '3'];
    attribution = '&copy; <a href="https://maps.google.com" target="_blank">Google Maps</a>';
  }

  mapTileLayer = L.tileLayer(tileUrl, {
    attribution: attribution,
    maxZoom: 20,
    subdomains: subdomains
  });

  // Resilient fallback: If any tile errors out, seamlessly switch to OpenStreetMap
  let hasFallenBack = false;
  mapTileLayer.on('tileerror', function () {
    if (!hasFallenBack && tileUrl.includes('google.com')) {
      hasFallenBack = true;
      console.warn('Switching to OpenStreetMap fallback tiles');
      mapTileLayer.setUrl('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    }
  });

  mapTileLayer.addTo(leafletMap);
}
window.updateMapTiles = updateMapTiles;

window.setMapTileTheme = function (theme) {
  updateMapTiles(theme);
  document.querySelectorAll('.map-theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
  });
  showToast(`Switched map layer to ${theme.toUpperCase()} view 🗺️`);
};

window.searchFor = function (term) {
  const searchInput = document.getElementById('heroSearch');
  if (searchInput) searchInput.value = term;
  searchQuery = term;
  renderPosts();
  showToast(`Filtering for "${term}" secret stops... 🔍`);

  const exploreSection = document.getElementById('explore');
  if (exploreSection) {
    exploreSection.scrollIntoView({ behavior: 'smooth' });
  }
};

function updateMapStats() {
  const gemsCountEl = document.getElementById('mapTotalGemsCount');
  const countriesCountEl = document.getElementById('mapTotalCountriesCount');

  const validPosts = postsData.filter(p => p.coords && p.coords.length === 2);
  const uniqueCountries = new Set(validPosts.map(p => p.country));

  if (gemsCountEl) gemsCountEl.textContent = validPosts.length;
  if (countriesCountEl) countriesCountEl.textContent = uniqueCountries.size;
}

function plotMapPins() {
  if (!leafletMap || !mapMarkerLayerGroup || typeof L === 'undefined') return;
  mapMarkerLayerGroup.clearLayers();

  const filtered = postsData.filter(post => {
    return currentMapFilter === 'all' || post.category === currentMapFilter;
  });

  filtered.forEach(post => {
    if (!post.coords || post.coords.length !== 2) return;

    // Custom Glowing Diamond DivIcon
    const customIcon = L.divIcon({
      className: 'hopstop-map-pin',
      html: `
        <div class="pin-badge-wrapper" title="${post.placeName}">
          <div class="pin-pulse-ring"></div>
          <span>💎</span>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -20]
    });

    // Custom Pop-up Card HTML
    const popupContent = `
      <div class="map-popup-card">
        <img src="${post.image}" alt="${post.placeName}" class="map-popup-thumb">
        <div class="map-popup-body">
          <span class="map-popup-badge">${post.categoryLabel} • 💎 ${post.gemScore}/10</span>
          <h4 class="map-popup-title">${post.placeName}</h4>
          <p class="map-popup-location">📍 ${post.country}</p>
          <div class="map-popup-secret"><strong>🤫 Tip:</strong> ${post.secretTip}</div>
          <div class="map-popup-actions">
            <button class="btn-popup-read" onclick="openArticleModal(${post.id})">Read Guide</button>
            <button class="btn-direction" style="padding: 5px 10px; font-size: 0.74rem;" onclick="openDirections(event, '${encodeURIComponent(post.locationQuery)}')">🧭 Navigate</button>
          </div>
        </div>
      </div>
    `;

    const marker = L.marker(post.coords, { icon: customIcon });
    marker.bindPopup(popupContent, { maxWidth: 280, closeButton: false });
    mapMarkerLayerGroup.addLayer(marker);
  });
}

window.filterMapPins = function (category) {
  currentMapFilter = category;
  document.querySelectorAll('.map-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-map-filter') === category);
  });
  plotMapPins();
};

window.scrollToMap = function () {
  switchView('landing');
  const mapSection = document.getElementById('mapSection');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 400);
  }
};

window.flyMapTo = function (region) {
  if (!leafletMap) return;

  const destinations = {
    europe: { center: [46.8, 12.5], zoom: 4.5 },
    asia: { center: [30.0, 110.0], zoom: 4 },
    americas: { center: [-10.0, -70.0], zoom: 3.5 },
    global: { center: [32.0, 15.0], zoom: 2.5 }
  };

  const target = destinations[region] || destinations.global;
  leafletMap.flyTo(target.center, target.zoom, { duration: 1.5, easeLinearity: 0.25 });
  showToast(`Flying map view to ${region.toUpperCase()}... ✈️`);
};

window.focusPostOnMap = function (postId) {
  const post = postsData.find(p => p.id === postId);
  if (!post || !post.coords) return;

  scrollToMap();
  setTimeout(() => {
    if (leafletMap) {
      leafletMap.flyTo(post.coords, 8, { duration: 1.4 });
      // Find matching marker & open popup
      mapMarkerLayerGroup.eachLayer(marker => {
        const mPos = marker.getLatLng();
        if (Math.abs(mPos.lat - post.coords[0]) < 0.01 && Math.abs(mPos.lng - post.coords[1]) < 0.01) {
          marker.openPopup();
        }
      });
    }
  }, 500);
};

// ==========================================================================
// AUTO-DETECT USER LOCATION & 10 NEAREST UNDERRATED PLACES ENGINE
// ==========================================================================

let userLocationMarker = null;

// Accurate spherical Haversine distance calculator in kilometers
function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Compute and return 10 nearest places sorted by proximity to user
window.getNearest10Gems = function (coords = userCoordinates) {
  if (!coords || coords.length !== 2) return [];

  const validPosts = (postsData || []).filter(p => p.coords && p.coords.length === 2);
  const withDistance = validPosts.map(post => {
    const dist = calculateHaversineDistanceKm(coords[0], coords[1], post.coords[0], post.coords[1]);
    return { ...post, distanceKm: dist };
  });

  withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
  return withDistance.slice(0, 10);
};

// Render the 10 Nearest Underrated Places HUD Slider
window.renderNearestGemsSlider = function () {
  const slider = document.getElementById('nearestPlacesSlider');
  const label = document.getElementById('nearestUserLocationName');
  const indicator = document.getElementById('nearestGpsIndicator');
  if (!slider) return;

  if (label) label.textContent = userLocationName || 'Madrid, Spain';

  const nearest10 = getNearest10Gems(userCoordinates);
  if (!nearest10 || nearest10.length === 0) {
    slider.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted);">No destinations found nearby.</div>';
    return;
  }

  slider.innerHTML = nearest10.map((gem, index) => {
    const rankNum = index + 1;
    let distBadge = '';
    if (gem.distanceKm < 120) {
      distBadge = `🚗 ${gem.distanceKm} km (Day Trip)`;
    } else if (gem.distanceKm < 600) {
      distBadge = `🚗 ${gem.distanceKm} km (Weekend)`;
    } else {
      distBadge = `✈️ ${gem.distanceKm.toLocaleString()} km away`;
    }

    return `
      <div class="nearest-place-card" id="nearestCard_${gem.id}">
        <div class="nearest-card-thumb-wrap">
          <img src="${gem.image}" alt="${gem.placeName}" class="nearest-card-thumb" loading="lazy">
          <div class="nearest-rank-badge">#${rankNum} Closest</div>
          <div class="nearest-dist-badge">${distBadge}</div>
        </div>
        <div class="nearest-card-content">
          <div class="nearest-card-meta-row">
            <span class="nearest-category-tag">${gem.categoryLabel || gem.category}</span>
            <span class="nearest-score-pill">💎 ${gem.gemScore}/10</span>
          </div>
          <h4 class="nearest-card-title">${gem.placeName}</h4>
          <p class="nearest-card-location">📍 ${gem.country}</p>
          <div class="nearest-card-tip">
            <strong>🤫 Tip:</strong> ${gem.secretTip || gem.excerpt || ''}
          </div>
          <div class="nearest-card-actions">
            <button type="button" class="btn-nearest-view" onclick="focusGemFromSlider(${gem.id})" title="View and center on map">
              <span>🗺️ On Map</span>
            </button>
            <button type="button" class="btn-nearest-nav" onclick="openDirections(event, '${encodeURIComponent(gem.locationQuery || gem.placeName)}')" title="1-Click Navigation">
              <span>🧭 Navigate</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

// Focus a gem from the 10 nearest slider on the Leaflet map
window.focusGemFromSlider = function (gemId) {
  // Highlight card
  document.querySelectorAll('.nearest-place-card').forEach(c => c.classList.remove('active-selected'));
  const card = document.getElementById(`nearestCard_${gemId}`);
  if (card) {
    card.classList.add('active-selected');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Focus map
  focusPostOnMap(gemId);
};

// Update user location pin on Leaflet map
window.updateUserLocationMarkerOnMap = function () {
  if (!leafletMap || typeof L === 'undefined' || !userCoordinates) return;

  if (userLocationMarker) {
    try { leafletMap.removeLayer(userLocationMarker); } catch (e) {}
    userLocationMarker = null;
  }

  const userIcon = L.divIcon({
    className: 'hopstop-user-location-pin',
    html: `
      <div class="user-pulse-marker" title="You Are Here (${userLocationName})">
        <div class="user-pulse-wave"></div>
        <span>📍</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });

  userLocationMarker = L.marker(userCoordinates, {
    icon: userIcon,
    zIndexOffset: 1200
  }).addTo(leafletMap);

  userLocationMarker.bindPopup(`
    <div style="padding: 10px 14px; text-align: center; font-family: var(--font-body);">
      <div style="font-size: 1.4rem; margin-bottom: 4px;">📍</div>
      <strong style="color: var(--text-primary); font-size: 0.92rem;">Your Active Base</strong><br/>
      <span style="font-size: 0.8rem; color: #0284c7; font-weight: 700;">${userLocationName || 'Detected GPS'}</span>
      <p style="font-size: 0.74rem; color: var(--text-muted); margin: 6px 0 0 0;">Calculating closest underrated waypoints from this hub.</p>
    </div>
  `);
};

// Auto-Detect User Location using HTML5 Geolocation with seamless IP fallback
window.autoDetectUserLocation = function (isUserInitiated = false) {
  const label = document.getElementById('nearestUserLocationName');
  const indicator = document.getElementById('nearestGpsIndicator');
  if (label && isUserInitiated) label.textContent = 'Detecting exact GPS... 📡';

  if (isUserInitiated) {
    showToast('📡 Requesting GPS coordinates to find nearest underrated places...');
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCoordinates = [position.coords.latitude, position.coords.longitude];
        userLocationName = `GPS Location (${position.coords.latitude.toFixed(2)}°, ${position.coords.longitude.toFixed(2)}°)`;
        
        // Save to cache
        try {
          localStorage.setItem('hopstop_user_coords', JSON.stringify(userCoordinates));
          localStorage.setItem('hopstop_user_location_name', userLocationName);
        } catch (e) {}

        if (label) label.textContent = userLocationName;
        if (indicator) {
          indicator.textContent = '🟢 Precise GPS';
          indicator.style.color = '#10b981';
        }

        updateUserLocationMarkerOnMap();
        renderNearestGemsSlider();
        fitMapToNearestGems();
        showToast('🎯 GPS Updated! Showing your 10 nearest underrated places.');
      },
      (error) => {
        console.warn('[HopStop Geo] GPS denied or timed out, trying IP fallback:', error);
        fallbackToIpLocation(isUserInitiated);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  } else {
    fallbackToIpLocation(isUserInitiated);
  }
};

// Fast IP-based geolocation fallback (No prompt needed)
function fallbackToIpLocation(isUserInitiated) {
  const label = document.getElementById('nearestUserLocationName');
  const indicator = document.getElementById('nearestGpsIndicator');

  // Try fast free IP geolocation endpoint
  fetch('https://get.geojs.io/v1/ip/geo.json')
    .then(r => r.json())
    .then(data => {
      if (data && data.latitude && data.longitude) {
        userCoordinates = [parseFloat(data.latitude), parseFloat(data.longitude)];
        userLocationName = `${data.city || 'Nearby'}, ${data.country || 'Region'}`;
        if (label) label.textContent = userLocationName;
        if (indicator) {
          indicator.textContent = '🌐 IP Auto-Detect';
          indicator.style.color = '#0284c7';
        }
        updateUserLocationMarkerOnMap();
        renderNearestGemsSlider();
        if (isUserInitiated) {
          fitMapToNearestGems();
          showToast(`📍 Location detected: ${userLocationName}`);
        }
      } else {
        useDefaultHub(isUserInitiated);
      }
    })
    .catch(() => {
      useDefaultHub(isUserInitiated);
    });
}

// Fallback to high-density default hub if both GPS & IP fail
function useDefaultHub(isUserInitiated) {
  const label = document.getElementById('nearestUserLocationName');
  const indicator = document.getElementById('nearestGpsIndicator');

  // Seville / Mediterranean baseline (close to Setenil, Rifugio, Civita, Blagaj)
  userCoordinates = [37.3891, -5.9845];
  userLocationName = 'Seville, Spain (Default Base)';
  if (label) label.textContent = userLocationName;
  if (indicator) {
    indicator.textContent = '📍 Adventure Hub';
    indicator.style.color = '#f97316';
  }
  updateUserLocationMarkerOnMap();
  renderNearestGemsSlider();
  if (isUserInitiated) {
    showToast('Using Seville base hub. Select "Change City" to pick any world city! 🌍');
  }
}

// Fit map view to encompass user location + top 10 nearest places
window.fitMapToNearestGems = function () {
  if (!leafletMap || typeof L === 'undefined' || !userCoordinates) return;

  const nearest10 = getNearest10Gems(userCoordinates);
  if (!nearest10 || nearest10.length === 0) return;

  const points = [userCoordinates, ...nearest10.map(g => g.coords)];
  const bounds = L.latLngBounds(points);
  leafletMap.fitBounds(bounds, {
    padding: [60, 60],
    maxZoom: 9
  });
};

// Filter button on map control panel
window.showNearestGemsView = function () {
  document.querySelectorAll('.map-pill-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btnFilterNearest10')?.classList.add('active');

  fitMapToNearestGems();
  const hud = document.getElementById('nearestGemsHud');
  if (hud) {
    hud.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  showToast('Showing your 10 nearest underrated spots! 📍');
};

// ==========================================================================
// CITY SWITCHER / ADVENTURE HUBS PICKER
// ==========================================================================

const GLOBAL_ADVENTURE_HUBS = [
  { name: 'Madrid, Spain', coords: [40.4168, -3.7038], flag: '🇪🇸' },
  { name: 'Rome, Italy', coords: [41.9028, 12.4964], flag: '🇮🇹' },
  { name: 'London, UK', coords: [51.5074, -0.1278], flag: '🇬🇧' },
  { name: 'Berlin, Germany', coords: [52.5200, 13.4050], flag: '🇩🇪' },
  { name: 'Athens, Greece', coords: [37.9838, 23.7275], flag: '🇬🇷' },
  { name: 'New Delhi, India', coords: [28.6139, 77.2090], flag: '🇮🇳' },
  { name: 'Mumbai, India', coords: [19.0760, 72.8777], flag: '🇮🇳' },
  { name: 'Tokyo, Japan', coords: [35.6762, 139.6503], flag: '🇯🇵' },
  { name: 'Bangkok, Thailand', coords: [13.7563, 100.5018], flag: '🇹🇭' },
  { name: 'New York, USA', coords: [40.7128, -74.0060], flag: '🇺🇸' },
  { name: 'San Francisco, USA', coords: [37.7749, -122.4194], flag: '🇺🇸' },
  { name: 'Mexico City, Mexico', coords: [19.4326, -99.1332], flag: '🇲🇽' },
  { name: 'Lima, Peru', coords: [-12.0464, -77.0428], flag: '🇵🇪' },
  { name: 'Cairo, Egypt', coords: [30.0444, 31.2357], flag: '🇪🇬' },
  { name: 'Sydney, Australia', coords: [-33.8688, 151.2093], flag: '🇦🇺' }
];

window.openCityPickerModal = function () {
  let modal = document.getElementById('cityPickerModal');
  if (!modal) {
    createCityPickerModalDOM();
    modal = document.getElementById('cityPickerModal');
  }
  if (modal) modal.classList.add('open');
};

window.closeCityPickerModal = function () {
  const modal = document.getElementById('cityPickerModal');
  if (modal) modal.classList.remove('open');
};

function createCityPickerModalDOM() {
  const div = document.createElement('div');
  div.id = 'cityPickerModal';
  div.className = 'city-picker-modal';
  div.innerHTML = `
    <div class="city-picker-box">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <span>🌍</span> Choose Any City Base
        </h3>
        <button type="button" class="modal-close-btn" onclick="closeCityPickerModal()" style="font-size: 1.3rem; background: none; border: none; cursor: pointer; color: var(--text-muted);">&times;</button>
      </div>
      <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
        Pick any world city or type a location below to instantly calculate and fly to the 10 closest hidden gems from that point!
      </p>
      
      <input type="text" id="citySearchInput" class="city-search-input" placeholder="Type city or country (e.g. Paris, Tokyo, Mumbai, New York)..." onkeyup="handleCitySearchKey(event)">
      
      <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">
        POPULAR ADVENTURE HUBS
      </div>
      <div class="city-hubs-grid" id="cityHubsGrid">
        ${GLOBAL_ADVENTURE_HUBS.map(hub => `
          <button type="button" class="city-hub-btn" onclick="selectCityHub('${hub.name}', [${hub.coords[0]}, ${hub.coords[1]}])">
            <span>${hub.flag}</span>
            <span>${hub.name.split(',')[0]}</span>
          </button>
        `).join('')}
      </div>

      <div style="display: flex; gap: 10px; margin-top: 14px;">
        <button type="button" class="btn-detect-gps" style="flex: 1; justify-content: center;" onclick="closeCityPickerModal(); autoDetectUserLocation(true);">
          <span>🎯 Use My Real GPS</span>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  // Close on backdrop click
  div.addEventListener('click', (e) => {
    if (e.target === div) closeCityPickerModal();
  });
}

window.selectCityHub = function (cityName, coords) {
  userCoordinates = coords;
  userLocationName = cityName;

  const label = document.getElementById('nearestUserLocationName');
  const indicator = document.getElementById('nearestGpsIndicator');
  if (label) label.textContent = userLocationName;
  if (indicator) {
    indicator.textContent = '🏙️ Custom City Base';
    indicator.style.color = '#f97316';
  }

  closeCityPickerModal();
  updateUserLocationMarkerOnMap();
  renderNearestGemsSlider();
  fitMapToNearestGems();
  showToast(`Switched home base to ${cityName}! Recalculated 10 nearest gems 🗺️`);
};

window.handleCitySearchKey = function (e) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim().toLowerCase();
    if (!val) return;

    // Search existing hubs first
    const found = GLOBAL_ADVENTURE_HUBS.find(h => h.name.toLowerCase().includes(val));
    if (found) {
      selectCityHub(found.name, found.coords);
      return;
    }

    // Try OpenStreetMap Nominatim geocoding for any arbitrary city name entered by the user
    showToast(`Searching coordinates for "${val}"... 🔍`);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=1`)
      .then(r => r.json())
      .then(results => {
        if (results && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          const dispName = results[0].display_name.split(',').slice(0, 2).join(',');
          selectCityHub(dispName, [lat, lon]);
        } else {
          showToast(`Could not find "${val}". Please try another city!`);
        }
      })
      .catch(() => {
        showToast(`Could not find "${val}". Please try another city!`);
      });
  }
};

// Initialize user location and nearest gems on map load
function initUserLocationAndNearestGems() {
  // Check if previously stored
  try {
    const saved = localStorage.getItem('hopstop_user_coords');
    const savedName = localStorage.getItem('hopstop_user_location_name');
    if (saved) {
      userCoordinates = JSON.parse(saved);
      if (savedName) userLocationName = savedName;
    }
  } catch (e) {}

  updateUserLocationMarkerOnMap();
  renderNearestGemsSlider();

  // Try auto-detecting without intrusive prompt
  autoDetectUserLocation(false);
}
window.initUserLocationAndNearestGems = initUserLocationAndNearestGems;
