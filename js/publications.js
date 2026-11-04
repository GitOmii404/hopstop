/**
 * HopStop — Substack-Style Serialized Micro-Publications Engine
 */

// ==========================================================================
// 3. Substack-Style Serialized Micro-Publications Engine
// ==========================================================================

function renderPublications() {
  const grid = document.getElementById('publicationsSeriesGrid');
  if (!grid) return;

  grid.innerHTML = PUBLICATIONS_DATA.map(pub => {
    const isSubscribed = subscribedSeries.includes(pub.id);
    const subCount = pub.author.subscribers + (isSubscribed ? 1 : 0);

    return `
      <article class="pub-series-card post-card-animated">
        <div class="pub-card-cover" onclick="openPublicationReader('${pub.id}', 0)" style="cursor: pointer;">
          <img src="${pub.cover}" alt="${pub.title}">
          <span class="pub-series-badge">${pub.badge}</span>
        </div>

        <div class="pub-card-body">
          <div class="pub-card-author-row">
            <img src="${pub.author.avatar}" alt="${pub.author.name}" class="pub-author-avatar">
            <div>
              <div class="pub-author-name">${pub.author.name}</div>
              <div class="pub-author-subscribers">${subCount.toLocaleString()} subscribers • ${pub.chapters.length} Chapters</div>
            </div>
          </div>

          <h3 class="pub-series-title" onclick="openPublicationReader('${pub.id}', 0)" style="cursor: pointer;">${pub.title}</h3>
          <p class="pub-series-desc">${pub.subtitle}</p>

          <div class="pub-chapters-list">
            ${pub.chapters.map((ch, idx) => `
              <div class="pub-chapter-item" onclick="openPublicationReader('${pub.id}', ${idx})">
                <span><strong>Part ${idx + 1}:</strong> ${ch.title.split(': ')[1] || ch.title}</span>
                <span style="font-size: 0.72rem; color: var(--text-muted);">${ch.readTime}</span>
              </div>
            `).join('')}
          </div>

          <div class="pub-card-footer">
            <button class="pub-subscribe-btn ${isSubscribed ? 'subscribed' : ''}" onclick="toggleSeriesSubscription('${pub.id}')">
              ${isSubscribed ? '✅ Subscribed' : '🔔 Subscribe (+Alerts)'}
            </button>
            <button class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem;" onclick="openPublicationReader('${pub.id}', 0)">
              📖 Read Chronicle
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

window.openPublicationReader = function (seriesId, chapterIndex = 0) {
  const pub = PUBLICATIONS_DATA.find(p => p.id === seriesId);
  if (!pub || !publicationReaderModal) return;

  activeReadingSeriesId = seriesId;
  activeReadingChapterIndex = chapterIndex;
  const chapter = pub.chapters[chapterIndex] || pub.chapters[0];

  const authorAvatar = document.getElementById('pubReaderAuthorAvatar');
  const seriesName = document.getElementById('pubReaderSeriesName');
  const authorName = document.getElementById('pubReaderAuthorName');
  const chapterTitle = document.getElementById('pubReaderChapterTitle');
  const chapterMeta = document.getElementById('pubReaderChapterMeta');
  const chapterBody = document.getElementById('pubReaderChapterBody');
  const subBtn = document.getElementById('pubReaderSubscribeBtn');
  const bottomSubBtn = document.getElementById('pubReaderBottomSubBtn');

  if (authorAvatar) authorAvatar.src = pub.author.avatar;
  if (seriesName) seriesName.textContent = pub.title;
  if (authorName) authorName.textContent = `By ${pub.author.name} (${pub.author.handle})`;
  if (chapterTitle) chapterTitle.textContent = chapter.title;
  if (chapterMeta) chapterMeta.textContent = `Part ${chapterIndex + 1} of ${pub.chapters.length} • ⏱️ ${chapter.readTime} • Serialized Explorer Chronicle`;
  if (chapterBody) chapterBody.innerHTML = chapter.content;

  const isSubscribed = subscribedSeries.includes(pub.id);
  if (subBtn) {
    subBtn.className = `pub-subscribe-btn ${isSubscribed ? 'subscribed' : ''}`;
    subBtn.textContent = isSubscribed ? '✅ Subscribed' : '🔔 Subscribe';
  }
  if (bottomSubBtn) {
    bottomSubBtn.textContent = isSubscribed ? '✅ Subscribed to This Series' : '🔔 Subscribe to Series';
  }

  // Chapter Tabs
  const tabsContainer = document.getElementById('pubReaderChapterTabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = pub.chapters.map((ch, idx) => `
      <button class="radius-pill-btn ${idx === chapterIndex ? 'active' : ''}" onclick="openPublicationReader('${pub.id}', ${idx})" style="white-space: nowrap;">
        Part ${idx + 1}: ${ch.title.split(': ')[1] || ch.title}
      </button>
    `).join('');
  }

  publicationReaderModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closePublicationReader = function () {
  if (!publicationReaderModal) return;
  publicationReaderModal.classList.remove('open');
  document.body.style.overflow = '';
};

window.toggleCurrentSeriesSubscription = function () {
  if (!activeReadingSeriesId) return;
  toggleSeriesSubscription(activeReadingSeriesId);
  const isSubscribed = subscribedSeries.includes(activeReadingSeriesId);
  const subBtn = document.getElementById('pubReaderSubscribeBtn');
  const bottomSubBtn = document.getElementById('pubReaderBottomSubBtn');
  if (subBtn) {
    subBtn.className = `pub-subscribe-btn ${isSubscribed ? 'subscribed' : ''}`;
    subBtn.textContent = isSubscribed ? '✅ Subscribed' : '🔔 Subscribe';
  }
  if (bottomSubBtn) {
    bottomSubBtn.textContent = isSubscribed ? '✅ Subscribed to This Series' : '🔔 Subscribe to Series';
  }
};

window.toggleSeriesSubscription = function (seriesId) {
  const pub = PUBLICATIONS_DATA.find(p => p.id === seriesId);
  if (!pub) return;

  if (subscribedSeries.includes(seriesId)) {
    subscribedSeries = subscribedSeries.filter(id => id !== seriesId);
    showToast(`Unsubscribed from "${pub.title}"`);
  } else {
    subscribedSeries.push(seriesId);
    awardUserXp(30, `Subscribing to ${pub.title}`);
    showToast(`🔔 Subscribed to "${pub.title}"! You will receive notification alerts for new chapters.`);
  }

  localStorage.setItem('hopstop_subscribed_series', JSON.stringify(subscribedSeries));
  renderPublications();
};
