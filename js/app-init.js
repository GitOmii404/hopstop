/**
 * HopStop — Scroll Reveal, 3D Tilt, Ripple & Navigation Spy Engine + Main Initialization
 */

// ==========================================================================
// Scroll Reveal, 3D Tilt, Ripple & Navigation Spy Engine
// ==========================================================================

function initScrollRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  // Make immediately visible elements in viewport visible right away
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }
}

function initTiltEffect() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initRippleEffect() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-primary, .btn-gem, .btn-direction');
    if (!btn) return;

    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-effect');

    const ripple = btn.querySelector('.ripple-effect');
    if (ripple) ripple.remove();

    btn.appendChild(circle);
  });
}

function initNavigationSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Global Nav & Scroll Helpers
window.scrollToGallery = function () {
  if (currentView !== 'landing') {
    window.switchView('landing', false);
  }
  const gallerySection = document.getElementById('gallery');
  if (gallerySection) {
    setTimeout(() => {
      gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      gallerySection.style.transition = 'box-shadow 0.6s ease';
      gallerySection.style.boxShadow = '0 0 35px rgba(2, 132, 199, 0.4)';
      setTimeout(() => {
        gallerySection.style.boxShadow = '';
      }, 1600);
    }, 100);
  }
};

window.scrollToMap = function () {
  if (currentView !== 'landing') {
    window.switchView('landing', false);
  }
  const mapSection = document.getElementById('mapSection');
  if (mapSection) {
    setTimeout(() => {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        if (leafletMap) leafletMap.invalidateSize();
      }, 350);
    }, 100);
  }
};

// Global URL Hash Router
window.handleHashRouting = function () {
  const hash = window.location.hash;
  if (!hash) return;
  const normalized = hash.toLowerCase();

  if (normalized === '#gallery' || normalized === '#photowall') {
    window.scrollToGallery();
  } else if (normalized === '#mapsection' || normalized === '#map') {
    window.scrollToMap();
  } else if (normalized === '#explore' || normalized === '#gems') {
    if (currentView !== 'landing') window.switchView('landing', false);
    setTimeout(() => {
      document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else if (normalized === '#toolkit' || normalized === '#saved') {
    if (currentView !== 'landing') window.switchView('landing', false);
    setTimeout(() => {
      document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else if (normalized === '#contact' || normalized === '#newsletter') {
    if (currentView !== 'landing') window.switchView('landing', false);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else if (normalized === '#feed' || normalized === '#app') {
    window.switchView('app');
  } else if (normalized === '#dreamboards' || normalized === '#boards') {
    window.switchView('dreamboards');
  } else if (normalized === '#battles' || normalized === '#battle') {
    window.switchView('battles');
  } else if (normalized === '#itinerary' || normalized === '#planner') {
    window.switchView('itinerary');
  } else if (normalized === '#bounty' || normalized === '#bounties') {
    window.switchView('bounty');
  } else if (normalized === '#publications' || normalized === '#series') {
    window.switchView('publications');
  } else if (normalized === '#passport') {
    window.openTravelPassport();
  } else if (normalized === '#tripmode') {
    window.openTripMode();
  } else if (normalized === '#leaderboard') {
    window.openLeaderboardModal();
  } else if (normalized === '#dailygem') {
    window.openDailyGemModal();
  }
};

// ==========================================================================
// Main Application Lifecycle Initializer
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const safeRun = (fn, name) => {
    if (typeof fn === 'function') {
      try {
        fn();
      } catch (err) {
        console.warn(`[HopStop Init] Error running ${name}:`, err);
      }
    }
  };

  safeRun(initTheme, 'initTheme');
  safeRun(initSupabase, 'initSupabase');
  safeRun(syncAuthState, 'syncAuthState');
  safeRun(initLeafletMap, 'initLeafletMap');
  safeRun(initDailyGemAndStreak, 'initDailyGemAndStreak');
  safeRun(renderAppFeed, 'renderAppFeed');
  safeRun(renderStories, 'renderStories');
  safeRun(renderSuggestedUsers, 'renderSuggestedUsers');
  safeRun(renderPosts, 'renderPosts');
  safeRun(renderGallery, 'renderGallery');
  safeRun(renderBucketList, 'renderBucketList');
  safeRun(renderBadgesShowcase, 'renderBadgesShowcase');
  safeRun(updateUserLevelUI, 'updateUserLevelUI');
  safeRun(renderBounties, 'renderBounties');
  safeRun(renderItineraryView, 'renderItineraryView');
  safeRun(renderPublications, 'renderPublications');
  safeRun(renderDreamBoards, 'renderDreamBoards');
  safeRun(renderPhotoBattles, 'renderPhotoBattles');
  safeRun(initBattleCountdown, 'initBattleCountdown');
  safeRun(renderLockedGuides, 'renderLockedGuides');
  safeRun(renderNotifications, 'renderNotifications');
  safeRun(renderLeaderboardSidebar, 'renderLeaderboardSidebar');
  safeRun(updatePassportUI, 'updatePassportUI');
  safeRun(initEventListeners, 'initEventListeners');
  safeRun(initScrollRevealAnimations, 'initScrollRevealAnimations');
  safeRun(initTiltEffect, 'initTiltEffect');
  safeRun(initRippleEffect, 'initRippleEffect');
  safeRun(initNavigationSpy, 'initNavigationSpy');

  // If a hash was requested in the URL (e.g. #passport, #gallery), execute routing smoothly
  if (window.location.hash) {
    setTimeout(() => {
      safeRun(window.handleHashRouting, 'handleHashRouting');
    }, 120);
  }
});

