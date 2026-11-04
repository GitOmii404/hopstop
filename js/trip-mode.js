/**
 * HopStop — Trip Mode (Active Traveler On-The-Road HUD)
 */

// ==========================================================================
// Trip Mode (Active Traveler On-The-Road HUD)
// ==========================================================================

window.openTripMode = function () {
  const modal = document.getElementById('tripModeModal');
  if (!modal) {
    console.error('tripModeModal not found in DOM');
    return;
  }
  renderTripHud();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeTripMode = function () {
  const modal = document.getElementById('tripModeModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

function renderTripHud() {
  const nearbyList = document.getElementById('tripHudNearbyList') || document.getElementById('tripModeRadiusList');
  if (!nearbyList) return;

  const currentCoords = (typeof userCoordinates !== 'undefined' && Array.isArray(userCoordinates)) 
    ? userCoordinates 
    : [37.3891, -5.9845];

  const allPosts = (typeof postsData !== 'undefined' && Array.isArray(postsData)) ? postsData : [];

  const nearbyPosts = allPosts.map(post => {
    const dist = (typeof calculateDistance === 'function') 
      ? calculateDistance(currentCoords[0], currentCoords[1], post.coords[0], post.coords[1])
      : Math.round(Math.hypot(currentCoords[0] - post.coords[0], currentCoords[1] - post.coords[1]) * 111);
    return { ...post, distKm: dist };
  }).sort((a, b) => a.distKm - b.distKm).slice(0, 5);

  if (nearbyPosts.length === 0) {
    nearbyList.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        No nearby hidden gems detected. Search other locations on the World Map.
      </div>
    `;
    return;
  }

  nearbyList.innerHTML = nearbyPosts.map(post => `
    <div class="trip-nearby-item" onclick="if(typeof openDirections === 'function') openDirections(event, '${encodeURIComponent(post.locationQuery)}')">
      <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
        <img src="${post.image}" alt="${post.placeName}" style="width: 54px; height: 54px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0;">
        <div style="min-width: 0;">
          <div style="font-weight: 700; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary);">${post.placeName}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">
            <span>📍 ${post.country}</span> • <span style="color: #0284c7; font-weight: 700;">${post.distKm} km away</span>
          </div>
          <div style="font-size: 0.72rem; color: #10b981; margin-top: 2px;">💎 Gem Score: ${post.gemScore}/10</div>
        </div>
      </div>
      <button class="btn-direction" style="font-size: 0.75rem; padding: 6px 12px; flex-shrink: 0;" onclick="event.stopPropagation(); if(typeof openDirections === 'function') openDirections(event, '${encodeURIComponent(post.locationQuery)}')">
        🧭 Navigate
      </button>
    </div>
  `).join('');
}
