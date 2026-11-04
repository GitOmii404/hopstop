/**
 * HopStop — Monthly Top-Finders Leaderboard Engine
 */

// ==========================================================================
// Monthly Top-Finders Leaderboard Engine
// ==========================================================================

function getLeaderboardData() {
  if (typeof MONTHLY_LEADERBOARD_DATA !== 'undefined' && Array.isArray(MONTHLY_LEADERBOARD_DATA)) {
    return MONTHLY_LEADERBOARD_DATA;
  }
  if (typeof leaderboardList !== 'undefined' && Array.isArray(leaderboardList)) {
    return leaderboardList;
  }
  return [
    { rank: 1, name: "Mateo Fernandez", handle: "@mateotravels", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", tier: "👑 Grand Trailblazer", gems: 14, monthlyXp: 3420, badge: "🥇 #1 Discover Legend" },
    { rank: 2, name: "Elena Vance", handle: "@elenavance", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", tier: "⚡ Master Explorer", gems: 11, monthlyXp: 2850, badge: "🥈 #2 Discover Podium" },
    { rank: 3, name: "Leila Halilovic", handle: "@leila_h", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", tier: "💎 Gem Seeker", gems: 9, monthlyXp: 2100, badge: "🥉 #3 Discover Podium" },
    { rank: 4, name: "Carlos Mendoza", handle: "@carlos_andes", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", tier: "🏔️ Alpine Scout", gems: 7, monthlyXp: 1650, badge: "Top 5 Contributor" },
    { rank: 5, name: "Maya Lin (You)", handle: "@mayawanders", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", tier: "⚡ Trailblazer", gems: 6, monthlyXp: 1450, badge: "Top 5 Contributor" }
  ];
}

window.openLeaderboardModal = function () {
  renderLeaderboard();
  const modal = document.getElementById('leaderboardModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeLeaderboardModal = function () {
  const modal = document.getElementById('leaderboardModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

function renderLeaderboardSidebar() {
  const listEl = document.getElementById('sidebarLeaderboardList');
  if (!listEl) return;
  const data = getLeaderboardData();

  listEl.innerHTML = data.slice(0, 3).map((finder, idx) => {
    const xp = finder.monthlyXp || finder.xp || 1000;
    const gems = finder.gems || finder.gemsFound || 5;
    return `
      <div class="widget-user-item" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0;">
        <div class="widget-user-info" style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 800; font-size: 0.95rem; width: 22px; color: ${idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : '#b45309'};">#${idx + 1}</span>
          <img src="${finder.avatar}" class="widget-user-avatar" alt="${finder.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
          <div>
            <div class="widget-user-name" style="font-size: 0.84rem; font-weight: 700;">${finder.name} <span style="font-size: 0.72rem; color: #38bdf8;">✓</span></div>
            <div class="widget-user-meta" style="font-size: 0.72rem; color: var(--text-muted);">${gems} gems • ${xp.toLocaleString()} XP</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderLeaderboard() {
  const podiumEl = document.getElementById('leaderboardPodiumGrid') || document.getElementById('leaderboardPodium');
  const listEl = document.getElementById('leaderboardTableList') || document.getElementById('leaderboardList');
  const data = getLeaderboardData();

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  if (podiumEl && top3.length >= 3) {
    const xp0 = (top3[0].monthlyXp || top3[0].xp || 0).toLocaleString();
    const xp1 = (top3[1].monthlyXp || top3[1].xp || 0).toLocaleString();
    const xp2 = (top3[2].monthlyXp || top3[2].xp || 0).toLocaleString();

    podiumEl.innerHTML = `
      <!-- #2 Rank -->
      <div class="podium-card rank-2" style="text-align: center; padding: 16px; background: var(--bg-hover); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="font-size: 1.5rem; margin-bottom: 4px;">🥈</div>
        <img src="${top3[1].avatar}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; margin-bottom: 6px;" alt="${top3[1].name}">
        <div style="font-weight: 700; font-size: 0.92rem;">${top3[1].name}</div>
        <div style="color: #0284c7; font-weight: 800; font-size: 0.85rem;">${xp1} XP</div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">${top3[1].badge || top3[1].tier}</div>
      </div>

      <!-- #1 Rank -->
      <div class="podium-card rank-1" style="text-align: center; padding: 20px 16px; background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(245, 158, 11, 0.1)); border-radius: var(--radius-md); border: 2px solid #eab308;">
        <div style="font-size: 1.8rem; margin-bottom: 4px;">👑</div>
        <img src="${top3[0].avatar}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-bottom: 6px; border: 2px solid #eab308;" alt="${top3[0].name}">
        <div style="font-weight: 800; font-size: 1rem;">${top3[0].name} <span style="color:#38bdf8;">✓</span></div>
        <div style="color: #ea580c; font-weight: 800; font-size: 0.92rem;">${xp0} XP</div>
        <div style="font-size: 0.75rem; color: #b45309; font-weight: 700;">${top3[0].badge || top3[0].tier}</div>
      </div>

      <!-- #3 Rank -->
      <div class="podium-card rank-3" style="text-align: center; padding: 16px; background: var(--bg-hover); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="font-size: 1.5rem; margin-bottom: 4px;">🥉</div>
        <img src="${top3[2].avatar}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; margin-bottom: 6px;" alt="${top3[2].name}">
        <div style="font-weight: 700; font-size: 0.92rem;">${top3[2].name}</div>
        <div style="color: #0284c7; font-weight: 800; font-size: 0.85rem;">${xp2} XP</div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">${top3[2].badge || top3[2].tier}</div>
      </div>
    `;
  }

  if (listEl) {
    listEl.innerHTML = rest.map((finder, idx) => {
      const xp = (finder.monthlyXp || finder.xp || 0).toLocaleString();
      const gems = finder.gems || finder.gemsFound || 5;
      return `
        <div class="leaderboard-row" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 800; font-size: 0.92rem; width: 24px; color: var(--text-muted);">#${idx + 4}</span>
            <img src="${finder.avatar}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;" alt="${finder.name}">
            <div>
              <div style="font-weight: 700; font-size: 0.9rem;">${finder.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${finder.handle} • ${gems} verified gems</div>
            </div>
          </div>
          <div style="font-weight: 800; color: #0284c7; font-size: 0.88rem;">${xp} XP</div>
        </div>
      `;
    }).join('');
  }
}
