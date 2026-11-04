/**
 * HopStop — Local Micro-Adventures (Radius Geolocation Filter) Engine
 */

// ==========================================================================
// 2. Local Micro-Adventures (Radius Geolocation Filter) Engine
// ==========================================================================

window.setRadiusFilter = function (radius) {
  currentRadiusFilter = radius;
  document.querySelectorAll('.radius-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-radius') === String(radius));
  });

  const label = radius === 'all' ? 'All Worldwide' : `Within ${radius} km`;
  showToast(`Filtering Micro-Adventures: ${label} 📍`);
  renderAppFeed();
};

window.requestUserGeolocation = function () {
  const badgeLabel = document.getElementById('userLocationLabel');
  if (navigator.geolocation) {
    showToast('📡 Detecting your exact GPS location for local micro-adventures...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCoordinates = [position.coords.latitude, position.coords.longitude];
        userLocationName = `GPS (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`;
        if (badgeLabel) badgeLabel.textContent = `📍 ${userLocationName}`;
        showToast('🎯 GPS location updated! Recalculating local stops...');
        renderAppFeed();
      },
      (error) => {
        // Fallback: Cycle between popular adventure hubs
        const hubs = [
          { name: 'Seville, Spain', coords: [37.3891, -5.9845] },
          { name: 'Madrid, Spain', coords: [40.4168, -3.7038] },
          { name: 'Sarajevo, Bosnia', coords: [43.8563, 18.4131] },
          { name: 'Amsterdam, Netherlands', coords: [52.3676, 4.9041] },
          { name: 'Tbilisi, Georgia', coords: [41.7151, 44.8271] },
          { name: 'Lima, Peru', coords: [-12.0464, -77.0428] }
        ];
        const nextHub = hubs[(Math.floor(Math.random() * hubs.length))];
        userCoordinates = nextHub.coords;
        userLocationName = nextHub.name;
        if (badgeLabel) badgeLabel.textContent = `📍 ${userLocationName}`;
        showToast(`Switched virtual base to: ${nextHub.name} 🌍`);
        renderAppFeed();
      },
      { timeout: 6000 }
    );
  } else {
    showToast('Geolocation not supported by browser. Using Seville base 📍');
  }
};
