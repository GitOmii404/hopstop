/**
 * HopStop — Smart Multi-Stop Itinerary Route Planner & Weather Engine
 */

// ==========================================================================
// Smart Multi-Stop Itinerary Route Planner & Live Destination Weather Engine
// ==========================================================================

// Haversine formula for exact distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
window.calculateDistance = calculateDistance;

function formatDuration(minutes) {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))} mins`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hrs`;
}
window.formatDuration = formatDuration;

// Destination Weather & Climate derivation
function getDestinationWeather(lat, lng, category = 'nature') {
  const absLat = Math.abs(lat || 40);
  // Realistic temperature baseline adjusted for latitude & terrain
  let baseTemp = Math.round(30 - (absLat * 0.35));
  if (category === 'nature' && absLat > 40) baseTemp -= 4; // Mountain cooler
  if (category === 'village') baseTemp += 1;
  if (category === 'coastal') baseTemp += 2;

  let condition = "Pleasant & Clear";
  let icon = "☀️";
  let bestSeason = "Spring & Autumn";

  if (baseTemp >= 28) {
    condition = "Warm & Sunny • Ideal for evening walks";
    icon = "☀️";
    bestSeason = "Early Morning & Sunset";
  } else if (baseTemp >= 20) {
    condition = "Mild & Breezy • Optimal travel weather";
    icon = "🌤️";
    bestSeason = "Spring & Autumn";
  } else if (baseTemp >= 14) {
    condition = "Crisp Mountain Air • Light layer recommended";
    icon = "⛅";
    bestSeason = "Summer & Early Autumn";
  } else {
    condition = "Cool Alpine Breeze • Pack warm layers";
    icon = "🏔️";
    bestSeason = "June - September";
  }

  return {
    temp: `${baseTemp}°C`,
    condition: condition,
    icon: icon,
    bestSeason: `🌸 Best Season: ${bestSeason}`
  };
}

function renderItineraryView() {
  const legsTimeline = document.getElementById('itineraryLegsTimeline');
  const totalDistEl = document.getElementById('itineraryTotalDist');
  const totalTimeEl = document.getElementById('itineraryTotalTime');
  const stopsCountEl = document.getElementById('itineraryStopsCount');
  const weatherSummaryEl = document.getElementById('itineraryWeatherSummary');
  const countBadge = document.getElementById('sidebarItineraryCount');

  // Resolve stop posts
  const resolvedStops = itineraryStops.map(id => postsData.find(p => p.id === id)).filter(Boolean);

  if (countBadge) countBadge.textContent = `${resolvedStops.length} Legs`;
  if (stopsCountEl) stopsCountEl.textContent = resolvedStops.length;

  if (resolvedStops.length === 0) {
    if (legsTimeline) {
      legsTimeline.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <span style="font-size: 3rem;">🗺️</span>
          <h3 style="margin-top: 12px; font-size: 1.3rem;">Your Itinerary Route is Empty</h3>
          <p style="color: var(--text-muted); max-width: 420px; margin: 8px auto 20px;">
            Browse hidden gems in your social feed, map, or discovery wall, and click "🗺️ + Itinerary" to link them into an epic road trip route.
          </p>
          <button class="btn-gem" onclick="openAddWaypointModal()">+ Add Your First Stop</button>
        </div>
      `;
    }
    if (totalDistEl) totalDistEl.textContent = '0 km';
    if (totalTimeEl) totalTimeEl.textContent = '0 hrs';
    if (weatherSummaryEl) weatherSummaryEl.textContent = '☀️ 21°C';
    plotItineraryRoute(resolvedStops);
    return;
  }

  // Calculate legs & distances
  let totalDistanceKm = 0;
  const speedKmh = itineraryTransitMode === 'walking' ? 4.5 : (itineraryTransitMode === 'transit' ? 50 : 75);

  const legs = [];
  for (let i = 0; i < resolvedStops.length; i++) {
    const current = resolvedStops[i];
    let legDist = 0;
    let legTimeMins = 0;

    if (i < resolvedStops.length - 1) {
      const next = resolvedStops[i + 1];
      legDist = calculateDistance(current.coords[0], current.coords[1], next.coords[0], next.coords[1]);
      totalDistanceKm += legDist;
      legTimeMins = (legDist / speedKmh) * 60;
    }

    const weather = getDestinationWeather(current.coords[0], current.coords[1], current.category);
    legs.push({
      stop: current,
      index: i,
      distToNext: legDist,
      timeToNext: formatDuration(legTimeMins),
      weather: weather
    });
  }

  const totalTimeMins = (totalDistanceKm / speedKmh) * 60;
  if (totalDistEl) totalDistEl.textContent = `${totalDistanceKm.toLocaleString()} km`;
  if (totalTimeEl) totalTimeEl.textContent = formatDuration(totalTimeMins);

  const avgWeather = legs[0]?.weather || { temp: '22°C', icon: '☀️' };
  if (weatherSummaryEl) weatherSummaryEl.textContent = `${avgWeather.icon} ${avgWeather.temp}`;

  if (legsTimeline) {
    legsTimeline.innerHTML = legs.map((item, idx) => {
      const p = item.stop;
      const isLast = idx === legs.length - 1;
      const modeIcon = itineraryTransitMode === 'walking' ? '🥾 Trek' : (itineraryTransitMode === 'transit' ? '🚆 Transit' : '🚗 Drive');

      return `
        <div class="itinerary-leg-item post-card-animated" data-stop-id="${p.id}">
          <div class="itinerary-step-badge">${idx + 1}</div>

          <div class="itinerary-leg-card">
            <div class="itinerary-leg-header">
              <div class="itinerary-leg-title-wrap">
                <span class="itinerary-leg-num">Stop ${idx + 1} of ${legs.length}</span>
                <h3 class="itinerary-leg-title" onclick="openArticleModal(${p.id})">${p.placeName}</h3>
                <div class="itinerary-leg-country">📍 ${p.placeName}, ${p.country}</div>
              </div>

              <div class="itinerary-leg-actions">
                <button class="itinerary-btn-icon" onclick="moveItineraryStop(${idx}, -1)" title="Move earlier in route" ${idx === 0 ? 'disabled style="opacity: 0.3; cursor: default;"' : ''}>⬆️</button>
                <button class="itinerary-btn-icon" onclick="moveItineraryStop(${idx}, 1)" title="Move later in route" ${isLast ? 'disabled style="opacity: 0.3; cursor: default;"' : ''}>⬇️</button>
                <button class="itinerary-btn-icon remove" onclick="removeFromItinerary(${idx})" title="Remove from itinerary">✕</button>
              </div>
            </div>

            <div class="itinerary-leg-content">
              <img src="${p.image}" class="itinerary-leg-thumb" alt="${p.placeName}" onclick="openArticleModal(${p.id})">
              
              <div class="itinerary-leg-details">
                <p class="itinerary-leg-desc">${p.excerpt}</p>

                <div class="itinerary-leg-meta-row">
                  <span class="itinerary-meta-pill">💎 Score: ${p.gemScore}/10</span>
                  <span class="itinerary-meta-pill">⏱️ ${p.bestTime || 'Year-round'}</span>
                  <span class="itinerary-meta-pill" style="color: #0284c7; background: rgba(6, 182, 212, 0.12); font-weight: 600;">
                    ${item.weather.icon} ${item.weather.temp} • ${item.weather.condition}
                  </span>
                </div>

                <div class="itinerary-tip-callout">
                  <strong>🤫 Transit Secret:</strong> ${p.secretTip}
                </div>
              </div>
            </div>
          </div>
        </div>

        ${!isLast ? `
          <div class="itinerary-connector">
            <div class="itinerary-connector-line"></div>
            <div class="itinerary-connector-badge">
              <span>${modeIcon}: <strong>${item.distToNext} km</strong></span>
              <span>•</span>
              <span>⏱️ <strong>${item.timeToNext}</strong></span>
            </div>
          </div>
        ` : ''}
      `;
    }).join('');
  }

  // Plot route polyline and custom diamond pins on itinerary map
  plotItineraryRoute(resolvedStops);
}

function initItineraryMap() {
  const mapEl = document.getElementById('itineraryRouteMap');
  if (!mapEl || itineraryMap) return;

  try {
    itineraryMap = L.map('itineraryRouteMap', {
      center: [43.0, 10.0],
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: false
    });

    // 100% Free OpenStreetMap Tiles (Zero watermark, No CARTO, No API Key Required)
    const itineraryTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    });

    itineraryTiles.addTo(itineraryMap);

    itineraryPolylineLayer = L.layerGroup().addTo(itineraryMap);
    itineraryMarkerLayer = L.layerGroup().addTo(itineraryMap);
  } catch (e) {
    console.warn('Leaflet itinerary map init deferred:', e);
  }
}

function plotItineraryRoute(stops = null) {
  const resolvedStops = stops || itineraryStops.map(id => postsData.find(p => p.id === id)).filter(Boolean);
  const mapEl = document.getElementById('itineraryRouteMap');
  if (!mapEl) return;

  if (!itineraryMap) {
    initItineraryMap();
  }

  if (!itineraryMap || !itineraryPolylineLayer || !itineraryMarkerLayer) return;

  itineraryPolylineLayer.clearLayers();
  itineraryMarkerLayer.clearLayers();

  if (resolvedStops.length === 0) return;

  const latLngs = [];

  resolvedStops.forEach((p, idx) => {
    const lat = p.coords[0];
    const lng = p.coords[1];
    latLngs.push([lat, lng]);

    // Numbered glowing waypoint diamond marker
    const markerHtml = `
      <div class="itinerary-map-marker">
        <div class="itinerary-map-marker-pin">
          <span>${idx + 1}</span>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'itinerary-custom-marker-wrapper',
      html: markerHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([lat, lng], { icon: customIcon });
    marker.bindPopup(`
      <div style="font-family: var(--font-sans); padding: 4px; max-width: 200px;">
        <strong style="color: #0284c7; font-size: 0.88rem;">Stop ${idx + 1}: ${p.placeName}</strong>
        <p style="margin: 4px 0 6px; font-size: 0.78rem; color: #475569;">📍 ${p.country}</p>
        <button class="btn-popup-read" style="padding: 3px 8px; font-size: 0.72rem; width: 100%;" onclick="openArticleModal(${p.id})">View Story</button>
      </div>
    `);

    itineraryMarkerLayer.addLayer(marker);
  });

  if (latLngs.length > 1) {
    const routeLine = L.polyline(latLngs, {
      color: '#06b6d4',
      weight: 4,
      opacity: 0.9,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    });
    itineraryPolylineLayer.addLayer(routeLine);
  }

  try {
    const bounds = L.latLngBounds(latLngs);
    itineraryMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
  } catch (e) { }
}

window.setTransitMode = function (mode) {
  itineraryTransitMode = mode;
  document.getElementById('btnModeDrive')?.classList.toggle('active', mode === 'driving');
  document.getElementById('btnModeTrain')?.classList.toggle('active', mode === 'transit');
  document.getElementById('btnModeTrek')?.classList.toggle('active', mode === 'walking');

  const modeLabels = { driving: 'Driving 🚗', transit: 'Train / Public Transit 🚆', walking: 'Foot Trekking 🥾' };
  showToast(`Transit mode set to ${modeLabels[mode] || mode}`);
  renderItineraryView();
};

window.addToItinerary = function (postId) {
  const post = postsData.find(p => p.id === postId);
  if (!post) return;

  if (itineraryStops.includes(postId)) {
    showToast(`"${post.placeName}" is already in your itinerary route! 🗺️`);
    return;
  }

  itineraryStops.push(postId);
  localStorage.setItem('hopstop_itinerary', JSON.stringify(itineraryStops));

  awardUserXp(25, `Adding ${post.placeName} to Itinerary`);
  if (itineraryStops.length >= 3) unlockBadge('cartographer');

  showToast(`Added "${post.placeName}" as Stop #${itineraryStops.length} to Route! 🗺️`);
  renderItineraryView();
  renderAppFeed();
};

window.removeFromItinerary = function (index) {
  const removedId = itineraryStops[index];
  const post = postsData.find(p => p.id === removedId);
  itineraryStops.splice(index, 1);
  localStorage.setItem('hopstop_itinerary', JSON.stringify(itineraryStops));
  renderItineraryView();
  renderAppFeed();
  showToast(`Removed "${post ? post.placeName : 'Stop'}" from itinerary.`);
};

window.moveItineraryStop = function (index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= itineraryStops.length) return;

  const temp = itineraryStops[index];
  itineraryStops[index] = itineraryStops[newIndex];
  itineraryStops[newIndex] = temp;

  localStorage.setItem('hopstop_itinerary', JSON.stringify(itineraryStops));
  renderItineraryView();
  showToast('Route re-ordered! 🔄');
};

window.openGoogleMapsMultiStopRoute = function () {
  const resolvedStops = itineraryStops.map(id => postsData.find(p => p.id === id)).filter(Boolean);
  if (resolvedStops.length === 0) {
    showToast('Add at least one stop to launch Google Maps navigation ⚠️');
    return;
  }

  const queries = resolvedStops.map(s => encodeURIComponent(s.locationQuery || `${s.placeName}, ${s.country}`));
  const googleMapsUrl = `https://www.google.com/maps/dir/${queries.join('/')}`;
  window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  showToast('🚀 Opening multi-stop navigation in Google Maps...');
};

window.openAddWaypointModal = function () {
  if (!addWaypointModal) return;
  filterWaypointOptions('');
  addWaypointModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeAddWaypointModal = function () {
  if (!addWaypointModal) return;
  addWaypointModal.classList.remove('open');
  document.body.style.overflow = '';
};

window.filterWaypointOptions = function (query = '') {
  const listEl = document.getElementById('waypointPlacesList');
  if (!listEl) return;

  const q = query.toLowerCase().trim();
  const available = postsData.filter(p => {
    const isAlreadyIn = itineraryStops.includes(p.id);
    const matches = q === '' || p.placeName.toLowerCase().includes(q) || p.country.toLowerCase().includes(q);
    return !isAlreadyIn && matches;
  });

  if (available.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">
        No matching places found. Try a different search or add custom coordinates below.
      </div>
    `;
    return;
  }

  listEl.innerHTML = available.map(p => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-hover); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${p.image}" alt="${p.placeName}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;">
        <div>
          <div style="font-weight: 700; font-size: 0.88rem;">${p.placeName}</div>
          <span style="font-size: 0.76rem; color: var(--text-muted);">📍 ${p.country} • 💎 ${p.gemScore}/10</span>
        </div>
      </div>
      <button class="btn-gem" style="padding: 5px 12px; font-size: 0.78rem;" onclick="addToItinerary(${p.id}); closeAddWaypointModal();">
        + Add to Route
      </button>
    </div>
  `).join('');
};

window.handleCustomWaypointSubmit = function (e) {
  e.preventDefault();
  const nameInput = document.getElementById('customWaypointName');
  const coordsInput = document.getElementById('customWaypointCoords');

  const name = nameInput.value.trim();
  if (!name) return;

  let coords = [44.0 + (Math.random() * 6 - 3), 12.0 + (Math.random() * 10 - 5)];
  if (coordsInput.value.includes(',')) {
    const parts = coordsInput.value.split(',').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      coords = parts;
    }
  }

  const customPost = {
    id: Date.now(),
    title: `Custom Waypoint: ${name}`,
    placeName: name,
    country: 'Waypoint',
    locationQuery: name,
    coords: coords,
    gemScore: '9.8',
    category: 'nature',
    categoryLabel: 'Custom Waypoint',
    readTime: '3 min read',
    date: 'Just now',
    bestTime: 'Seasonal',
    budget: 'Flexible',
    author: {
      name: currentUser ? currentUser.name : 'Explorer',
      handle: currentUser ? currentUser.handle : '@wanderer',
      avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    excerpt: `Custom waypoint stop added to route: ${name}`,
    secretTip: 'Great scenic stopover with panoramic vantage point.',
    fullContent: `<h4>Custom Waypoint: ${name}</h4><p>Coordinates: ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}</p>`,
    likes: 1,
    isLiked: false,
    comments: []
  };

  postsData.push(customPost);
  savePostsData();
  itineraryStops.push(customPost.id);
  localStorage.setItem('hopstop_itinerary', JSON.stringify(itineraryStops));

  closeAddWaypointModal();
  nameInput.value = '';
  coordsInput.value = '';

  if (typeof triggerConfetti === 'function') {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }

  awardUserXp(35, `Adding Custom Waypoint "${name}"`);
  renderItineraryView();
  showToast(`Added custom waypoint "${name}" to route! 📍`);
};

window.exportItinerarySummary = function () {
  const resolvedStops = itineraryStops.map(id => postsData.find(p => p.id === id)).filter(Boolean);
  if (resolvedStops.length === 0) {
    showToast('Add stops to your itinerary before exporting ⚠️');
    return;
  }

  let text = `🗺️ HOPSTOP TRAVEL ITINERARY ROUTE\n====================================\n`;
  text += `Mode: ${itineraryTransitMode.toUpperCase()} | Total Stops: ${resolvedStops.length}\n\n`;

  resolvedStops.forEach((p, idx) => {
    const weather = getDestinationWeather(p.coords[0], p.coords[1], p.category);
    text += `STOP ${idx + 1}: ${p.placeName} (${p.country})\n`;
    text += `  • GPS: ${p.coords[0]}, ${p.coords[1]}\n`;
    text += `  • Climate: ${weather.temp} (${weather.condition})\n`;
    text += `  • Secret Tip: ${p.secretTip}\n`;
    text += `  • Best Season: ${p.bestTime || 'Spring & Autumn'}\n\n`;
  });

  const queries = resolvedStops.map(s => encodeURIComponent(s.locationQuery || `${s.placeName}, ${s.country}`));
  text += `🧭 Direct Multi-Stop Google Maps Link:\nhttps://www.google.com/maps/dir/${queries.join('/')}\n`;

  navigator.clipboard?.writeText(text);
  awardUserXp(20, 'Exporting Route Itinerary');
  showToast('📋 Complete Route Itinerary copied to clipboard!');
};
