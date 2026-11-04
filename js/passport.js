/**
 * HopStop — Travel Passport & Scratch-off Visited Countries Map Engine
 */

// ==========================================================================
// Travel Passport & Scratch-off Visited Countries Map Engine
// ==========================================================================

function savePassportData() {
  if (typeof passportData !== 'undefined') {
    localStorage.setItem('hopstop_passport_countries', JSON.stringify(passportData));
  }
}

function updatePassportUI() {
  if (typeof passportData === 'undefined' || !Array.isArray(passportData)) return;

  const visitedCount = passportData.filter(c => c.visited).length;
  const total = passportData.length;
  const percent = total > 0 ? Math.round((visitedCount / total) * 100) : 0;

  const headerVisitedCount = document.getElementById('passportVisitedCount');
  if (headerVisitedCount) {
    headerVisitedCount.textContent = `${visitedCount} / ${total}`;
  }

  const stampsCountEl = document.getElementById('passportStampsCount');
  if (stampsCountEl) {
    stampsCountEl.textContent = visitedCount;
  }

  const sidebarCount = document.getElementById('sidebarVisitedCount');
  const sidebarPct = document.getElementById('sidebarVisitedPct');
  const sidebarFill = document.getElementById('sidebarVisitedFill');
  const heroCount = document.getElementById('passportVisitedCountHero');
  const heroPct = document.getElementById('passportVisitedPctHero');
  const heroFill = document.getElementById('passportVisitedFillHero');

  if (sidebarCount) sidebarCount.textContent = visitedCount;
  if (sidebarPct) sidebarPct.textContent = `${percent}%`;
  if (sidebarFill) sidebarFill.style.width = `${percent}%`;
  if (heroCount) heroCount.textContent = visitedCount;
  if (heroPct) heroPct.textContent = `${percent}%`;
  if (heroFill) heroFill.style.width = `${percent}%`;
}

window.openTravelPassport = function () {
  const modal = document.getElementById('travelPassportModal');
  if (!modal) {
    console.error('travelPassportModal not found in DOM');
    return;
  }
  renderTravelPassport();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeTravelPassport = function () {
  const modal = document.getElementById('travelPassportModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
};

function renderTravelPassport() {
  if (typeof passportData === 'undefined' || !Array.isArray(passportData)) return;

  updatePassportUI();
  const scratchGrid = document.getElementById('scratchCountryPills') || document.getElementById('passportScratchGrid');
  const stampsGrid = document.getElementById('passportStampsGrid');

  if (scratchGrid) {
    scratchGrid.innerHTML = passportData.map(c => `
      <button type="button" class="scratch-pill ${c.visited ? 'visited' : 'unvisited'}" onclick="toggleCountryVisited('${c.code}')">
        <span>${c.flag}</span>
        <span>${c.name}</span>
        <span>${c.visited ? '✅' : '➕'}</span>
      </button>
    `).join('');
  }

  if (stampsGrid) {
    const visitedCountries = passportData.filter(c => c.visited);
    if (visitedCountries.length === 0) {
      stampsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 32px 20px; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🛂</div>
          <div style="font-weight: 700; margin-bottom: 4px;">No visa stamps yet!</div>
          <div>Tap any country on the scratch-off map above to stamp your official explorer passport.</div>
        </div>
      `;
    } else {
      stampsGrid.innerHTML = visitedCountries.map((c, i) => `
        <div class="visa-stamp-card">
          <div class="visa-stamp-ink">HOPSTOP ENTRY</div>
          <div class="visa-stamp-flag" style="font-size: 2.2rem; text-align: center; margin: 8px 0;">${c.flag}</div>
          <div class="visa-stamp-country" style="font-weight: 800; font-size: 1rem; text-align: center; letter-spacing: 1px;">${c.name.toUpperCase()}</div>
          <div class="visa-stamp-date" style="font-size: 0.72rem; color: #64748b; text-align: center; margin-top: 4px;">${c.stampedAt || 'VALIDATED • TODAY'}</div>
          <div style="font-size: 0.65rem; color: #94a3b8; margin-top: 8px; text-align: center;">PASS NO. HP-${1000 + i * 47}</div>
        </div>
      `).join('');
    }
  }
}

window.toggleCountryVisited = function (countryCode) {
  if (typeof passportData === 'undefined') return;
  const country = passportData.find(c => c.code === countryCode);
  if (!country) return;

  country.visited = !country.visited;
  if (country.visited) {
    country.stampedAt = 'VALIDATED • TODAY';
    if (typeof awardUserXp === 'function') awardUserXp(50, `Visiting ${country.name}`);
    if (typeof showToast === 'function') showToast(`🛃 Visited ${country.name}! Visa stamp added to passport (+50 XP)`);
  } else {
    if (typeof showToast === 'function') showToast(`Removed ${country.name} from visited places.`);
  }

  savePassportData();
  renderTravelPassport();
};
