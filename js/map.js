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
