/**
 * HopStop — Daily Habit & Discovery Streak Engine
 */

// ==========================================================================
// 1. Daily Habit & Discovery Streak Engine
// ==========================================================================

function initDailyGemAndStreak() {
  const streakText = document.getElementById('streakDaysCount');
  if (streakText) streakText.textContent = `${userStreakDays}-Day Discovery Streak`;

  // Pick deterministic Gem of the Day from dataset
  const dayIndex = Math.floor(Date.now() / 86400000) % postsData.length;
  dailyGemPost = postsData[dayIndex] || postsData[0];

  const dailyThumb = document.getElementById('dailyGemThumb');
  const dailyTitle = document.getElementById('dailyGemTitle');
  const dailyLocation = document.getElementById('dailyGemLocation');

  if (dailyThumb) dailyThumb.src = dailyGemPost.image;
  if (dailyTitle) dailyTitle.textContent = dailyGemPost.title;
  if (dailyLocation) dailyLocation.textContent = `📍 ${dailyGemPost.placeName}, ${dailyGemPost.country}`;

  // Countdown to next morning 8:00 AM reveal
  clearInterval(dailyTimerInterval);
  updateDailyCountdown();
  dailyTimerInterval = setInterval(updateDailyCountdown, 1000);
}

function updateDailyCountdown() {
  const timerEl = document.getElementById('dailyRevealTimer');
  if (!timerEl) return;

  const now = new Date();
  const target = new Date();
  target.setHours(24, 0, 0, 0); // Next midnight/morning cycle

  let diff = target - now;
  if (diff < 0) diff = 0;

  const hrs = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
  const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
  const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

  timerEl.textContent = `${hrs}:${mins}:${secs}`;
}

window.claimDailyCheckin = function () {
  if (!currentUser || currentUser.isGuest) {
    if (typeof showToast === 'function') {
      showToast('🔒 Sign in or create an account to claim daily streak XP!');
    }
    setTimeout(() => {
      window.location.href = 'login.html?redirect=feed.html';
    }, 1200);
    return;
  }
  const todayStr = new Date().toDateString();
  if (lastCheckinDate === todayStr) {
    showToast(`You already claimed today's +50 XP! Streak: ${userStreakDays} Days 🔥`);
    return;
  }

  userStreakDays++;
  lastCheckinDate = todayStr;
  localStorage.setItem('hopstop_streak_days', userStreakDays.toString());
  localStorage.setItem('hopstop_last_checkin', todayStr);

  const streakText = document.getElementById('streakDaysCount');
  if (streakText) streakText.textContent = `${userStreakDays}-Day Discovery Streak`;

  awardUserXp(50, 'Daily Discovery Check-in');
  showToast(`🔥 ${userStreakDays}-Day Explorer Streak! +50 XP Claimed!`);

  const btn = document.getElementById('claimDailyCheckinBtn');
  if (btn) {
    btn.textContent = '✅ Claimed Today';
    btn.style.opacity = '0.6';
  }
};

window.openDailyGemModal = function () {
  if (!dailyGemModal || !dailyGemPost) return;

  const heroImg = document.getElementById('dailyModalHeroImg');
  const title = document.getElementById('dailyModalTitle');
  const location = document.getElementById('dailyModalLocation');
  const score = document.getElementById('dailyModalScore');
  const summary = document.getElementById('dailyModalSummary');
  const secretTip = document.getElementById('dailyModalSecretTip');

  if (heroImg) heroImg.src = dailyGemPost.image;
  if (title) title.textContent = dailyGemPost.title;
  if (location) location.textContent = `📍 ${dailyGemPost.placeName}, ${dailyGemPost.country}`;
  if (score) score.textContent = `💎 ${dailyGemPost.gemScore}/10 Underrated`;
  if (summary) summary.textContent = dailyGemPost.excerpt;
  if (secretTip) secretTip.textContent = dailyGemPost.secretTip;

  const addItinBtn = document.getElementById('dailyModalAddItineraryBtn');
  if (addItinBtn) {
    const isInItinerary = itineraryStops.includes(dailyGemPost.id);
    addItinBtn.textContent = isInItinerary ? '✅ In Route Planner' : '🗺️ + Add to Itinerary';
    addItinBtn.onclick = () => {
      addToItinerary(dailyGemPost.id);
      addItinBtn.textContent = '✅ In Route Planner';
    };
  }

  const readFullBtn = document.getElementById('dailyModalReadFullBtn');
  if (readFullBtn) {
    readFullBtn.onclick = () => {
      closeDailyGemModal();
      openArticleModal(dailyGemPost.id);
    };
  }

  dailyGemModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeDailyGemModal = function () {
  const modal = document.getElementById('dailyGemModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};
