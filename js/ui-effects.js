/**
 * HopStop — Animation & Interaction Listeners
 */

// ==========================================================================
// Animation & Interaction Listeners
// ==========================================================================

function initScrollRevealAnimations() {
  if (typeof window.initScrollRevealAnimations === 'function' && window.initScrollRevealAnimations !== initScrollRevealAnimations) {
    window.initScrollRevealAnimations();
  }
}

function initTiltEffect() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(800px) rotateX(${(-y / 24).toFixed(2)}deg) rotateY(${(x / 24).toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

function initRippleEffect() {
  document.querySelectorAll('.btn-primary, .btn-gem, .btn-direction, .btn-shuffle, .filter-btn, .map-pill-btn, .map-jump-btn').forEach(target => {
    target.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      circle.className = 'ripple-effect';
      const diameter = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
}

// Global Click Pointer Tracker for Precision Micro-Interaction Origins
window.lastClickEvent = { clientX: window.innerWidth / 2, clientY: 120 };
window.addEventListener('pointerdown', (e) => {
  window.lastClickEvent = { clientX: e.clientX, clientY: e.clientY };
}, { passive: true });

// ==========================================================================
// Floating XP Badge Animation System
// ==========================================================================
window.triggerFloatingXp = function (amount, x = null, y = null, isGold = false) {
  const posX = (x !== null && x !== undefined) ? x : (window.lastClickEvent?.clientX || window.innerWidth / 2);
  const posY = (y !== null && y !== undefined) ? y : (window.lastClickEvent?.clientY || 140);

  const bubble = document.createElement('div');
  bubble.className = `floating-xp-bubble ${isGold || amount >= 100 ? 'gold' : ''}`;
  bubble.innerHTML = `<span>⭐</span> +${amount} XP`;
  bubble.style.left = `${posX}px`;
  bubble.style.top = `${posY}px`;

  document.body.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 1300);
};

// ==========================================================================
// Festive Confetti Burst Engine
// ==========================================================================
window.triggerConfetti = function (originX = null, originY = null) {
  const x = (originX !== null && originX !== undefined) ? originX : (window.lastClickEvent?.clientX || window.innerWidth / 2);
  const y = (originY !== null && originY !== undefined) ? originY : (window.lastClickEvent?.clientY || window.innerHeight / 2);

  const colors = ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#fbbf24'];
  const particleCount = 36;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const bg = colors[Math.floor(Math.random() * colors.length)];
    p.style.backgroundColor = bg;
    
    // Random size & shape
    const isCircle = Math.random() > 0.5;
    const w = 6 + Math.random() * 8;
    const h = isCircle ? w : (8 + Math.random() * 10);
    p.style.width = `${w}px`;
    p.style.height = `${h}px`;
    p.style.borderRadius = isCircle ? '50%' : '2px';

    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    // Calculate spread vector
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 180;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance + 50; // gravity drift down
    const trot = (Math.random() * 720 - 360) + 'deg';

    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    p.style.setProperty('--trot', trot);

    document.body.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 1450);
  }
};

// ==========================================================================
// Heart Burst Micro-Interaction Engine
// ==========================================================================
window.triggerHeartBurst = function (originX = null, originY = null) {
  const x = (originX !== null && originX !== undefined) ? originX : (window.lastClickEvent?.clientX || window.innerWidth / 2);
  const y = (originY !== null && originY !== undefined) ? originY : (window.lastClickEvent?.clientY || window.innerHeight / 2);

  const icons = ['❤️', '💖', '✨', '💎'];
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('div');
    h.className = 'heart-burst-particle';
    h.textContent = icons[Math.floor(Math.random() * icons.length)];
    h.style.left = `${x}px`;
    h.style.top = `${y}px`;

    const tx = (Math.random() - 0.5) * 80;
    const ty = -30 - (Math.random() * 60);

    h.style.setProperty('--tx', `${tx}px`);
    h.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(h);

    setTimeout(() => {
      h.remove();
    }, 1050);
  }
};

// Global Escape Key Listener to dismiss any active modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
      modal.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

function initNavigationSpy() {
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    document.querySelectorAll('section[id]').forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const id = section.getAttribute('id');
        document.querySelectorAll('.nav-links .nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  });
}

// ==========================================================================
// Interactive 3D Hero Card Stack Deck Engine (Infinite Loop on Click)
// ==========================================================================

const HERO_STACK_CARDS = [
  {
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    author: 'Leila Halilovic',
    location: '📍 Setenil de las Bodegas • Verified'
  },
  {
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    author: 'Mateo Fernandez',
    location: '📍 Blagaj Tekke, Bosnia • Verified'
  },
  {
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    author: 'Giorgi Tabatadze',
    location: '📍 Ushguli, Svaneti, Georgia • Pioneer'
  },
  {
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    author: 'Anouk Van Dijk',
    location: '📍 Giethoorn, Netherlands • Top Finder'
  }
];

let currentHeroCardIndex = 0;
let isHeroCardSwapping = false;

window.cycleHeroCard = function () {
  if (isHeroCardSwapping) return;
  const cards = document.querySelectorAll('.hero-stacked-card');
  if (cards.length === 0) return;

  isHeroCardSwapping = true;
  const activeCard = document.querySelector('.hero-stacked-card.pos-0') || cards[0];
  activeCard.classList.add('leaving');

  setTimeout(() => {
    currentHeroCardIndex = (currentHeroCardIndex + 1) % cards.length;
    updateHeroStackPositions();
    isHeroCardSwapping = false;
  }, 320);
};

window.setHeroCard = function (index) {
  if (isHeroCardSwapping || index === currentHeroCardIndex) return;
  currentHeroCardIndex = index;
  updateHeroStackPositions();
};

function updateHeroStackPositions() {
  const cards = document.querySelectorAll('.hero-stacked-card');
  const count = cards.length;
  if (count === 0) return;

  cards.forEach((card, i) => {
    card.classList.remove('leaving', 'pos-0', 'pos-1', 'pos-2', 'pos-3');
    const relPos = (i - currentHeroCardIndex + count) % count;
    card.classList.add(`pos-${relPos}`);
  });

  // Update dots
  document.querySelectorAll('.hero-stack-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentHeroCardIndex);
  });

  // Update floating author card
  const data = HERO_STACK_CARDS[currentHeroCardIndex];
  if (data) {
    const avatar = document.getElementById('heroFloatingAvatar');
    const name = document.getElementById('heroFloatingName');
    const loc = document.getElementById('heroFloatingLocation');
    if (avatar) avatar.src = data.avatar;
    if (name) name.textContent = data.author;
    if (loc) loc.textContent = data.location;
  }
}

