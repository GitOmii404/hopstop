/**
 * HopStop — Stories Full-Screen Engine
 */

// ==========================================================================
// Stories Full-Screen Engine
// ==========================================================================

window.openStoryViewer = function (index) {
  if (!storyViewerModal) return;
  activeStoryIndex = index;
  storyViewerModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  awardUserXp(10, 'Viewing Traveler Stories');
  loadStorySlide(activeStoryIndex);
};

window.closeStoryViewer = function () {
  if (!storyViewerModal) return;
  clearInterval(storyTimer);
  storyViewerModal.classList.remove('open');
  document.body.style.overflow = '';
};

function loadStorySlide(index) {
  const story = STORIES_DATA[index];
  if (!story) {
    closeStoryViewer();
    return;
  }

  const progressBarWrap = document.getElementById('storyProgressBarWrap');
  const storyImg = document.getElementById('storyImgDisplay');
  const storyAvatar = document.getElementById('storyAvatarDisplay');
  const storyName = document.getElementById('storyNameDisplay');
  const storyTitle = document.getElementById('storyTitleDisplay');
  const storyDesc = document.getElementById('storyDescDisplay');

  if (progressBarWrap) {
    progressBarWrap.innerHTML = STORIES_DATA.map((_, i) => `
      <div class="story-progress-segment">
        <div class="story-progress-fill" id="storyFill_${i}" style="width: ${i < index ? '100%' : '0%'}"></div>
      </div>
    `).join('');
  }

  if (storyImg) storyImg.src = story.image;
  if (storyAvatar) storyAvatar.src = story.avatar;
  if (storyName) storyName.textContent = story.author;
  if (storyTitle) storyTitle.textContent = `${story.title} (📍 ${story.location})`;
  if (storyDesc) storyDesc.textContent = story.desc;

  clearInterval(storyTimer);
  const fillEl = document.getElementById(`storyFill_${index}`);
  if (fillEl) {
    fillEl.style.transition = 'width 5s linear';
    setTimeout(() => { fillEl.style.width = '100%'; }, 50);
  }

  storyTimer = setTimeout(() => {
    if (activeStoryIndex < STORIES_DATA.length - 1) {
      activeStoryIndex++;
      loadStorySlide(activeStoryIndex);
    } else {
      closeStoryViewer();
    }
  }, 5000);
}

window.prevStorySlide = function (e) {
  if (e) e.stopPropagation();
  if (activeStoryIndex > 0) {
    activeStoryIndex--;
    loadStorySlide(activeStoryIndex);
  }
};

window.nextStorySlide = function (e) {
  if (e) e.stopPropagation();
  if (activeStoryIndex < STORIES_DATA.length - 1) {
    activeStoryIndex++;
    loadStorySlide(activeStoryIndex);
  } else {
    closeStoryViewer();
  }
};

// Keyboard Arrow Navigation for Stories
window.addEventListener('keydown', (e) => {
  if (!storyViewerModal || !storyViewerModal.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') {
    prevStorySlide(e);
  } else if (e.key === 'ArrowRight' || e.key === ' ') {
    nextStorySlide(e);
  }
});
