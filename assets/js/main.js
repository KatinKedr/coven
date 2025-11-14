const SCREEN_CLASS_PREFIX = 'screen-';

const focusSelectors = [
  '[data-auto-focus]',
  '[autofocus]',
  'input:not([type="hidden"]):not([disabled])',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('title');
  const playBtn = document.getElementById('playBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const musicBtn = document.getElementById('musicToggle');
  const backgroundAudio = document.getElementById('bgMusic');

  const screenElements = new Map();
  document.querySelectorAll('[data-screen]').forEach((section) => {
    const id = section.getAttribute('data-screen');
    if (id) {
      screenElements.set(id, section);
    }
  });

  const styleLinks = Array.from(document.querySelectorAll('link[data-screen-style]')).map((link) => {
    const tokens = (link.dataset.screenStyle || '')
      .split(/[\s,]+/)
      .map((token) => token.trim())
      .filter(Boolean);
    return { link, screens: new Set(tokens) };
  });

  let currentScreen = document.body.dataset.screen || 'start';
  let currentScreenClass = `${SCREEN_CLASS_PREFIX}${currentScreen}`;
  document.body.classList.add(currentScreenClass);

  const updateStylesForScreen = (screenId) => {
    styleLinks.forEach(({ link, screens }) => {
      if (screens.size === 0) {
        link.disabled = false;
        return;
      }
      link.disabled = !screens.has(screenId);
    });
  };

  const focusActiveScreen = (activeScreen) => {
    if (!activeScreen) {
      return;
    }
    const focusCandidate = activeScreen.querySelector(focusSelectors);
    if (focusCandidate && typeof focusCandidate.focus === 'function') {
      window.setTimeout(() => {
        try {
          focusCandidate.focus({ preventScroll: true });
        } catch (error) {
          focusCandidate.focus();
        }
      }, 60);
    }
  };

  const notifyScreenShown = (screenId) => {
    const section = screenElements.get(screenId);
    if (!section) {
      return;
    }
    section.dispatchEvent(
      new CustomEvent('coven:screen:show', {
        bubbles: true,
        detail: { screen: screenId },
      }),
    );
  };

  const showScreen = (targetScreen) => {
    if (!screenElements.has(targetScreen) || targetScreen === currentScreen) {
      return;
    }

    screenElements.forEach((section, id) => {
      const isActive = id === targetScreen;
      section.hidden = !isActive;
      section.classList.toggle('is-active', isActive);
      section.setAttribute('aria-hidden', String(!isActive));
    });

    document.body.dataset.screen = targetScreen;
    document.body.classList.remove(currentScreenClass);
    currentScreenClass = `${SCREEN_CLASS_PREFIX}${targetScreen}`;
    document.body.classList.add(currentScreenClass);
    currentScreen = targetScreen;

    updateStylesForScreen(targetScreen);
    focusActiveScreen(screenElements.get(targetScreen));
    notifyScreenShown(targetScreen);
  };

  window.covenNavigate = (target) => {
    if (typeof target === 'string') {
      showScreen(target);
    }
  };

  updateStylesForScreen(currentScreen);
  focusActiveScreen(screenElements.get(currentScreen));
  notifyScreenShown(currentScreen);

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-target], [data-next-screen]');
    if (!trigger) {
      return;
    }
    const datasetTarget = trigger.dataset.target || trigger.dataset.nextScreen;
    if (!datasetTarget) {
      return;
    }
    event.preventDefault();
    showScreen(datasetTarget);
  });

  const enableFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  fullscreenBtn?.addEventListener('click', async () => {
    try {
      await enableFullscreen();
    } catch (error) {
      console.error('Не удалось переключить полноэкранный режим:', error);
    }
  });

  let musicInitialized = false;
  let isMusicPlaying = false;

  const updateMusicToggle = () => {
    if (!musicBtn) {
      return;
    }
    musicBtn.setAttribute('aria-pressed', String(isMusicPlaying));
    musicBtn.setAttribute(
      'aria-label',
      isMusicPlaying ? 'Остановить музыку' : 'Включить музыку',
    );
  };

  const ensureMusicReady = () => {
    if (!backgroundAudio || musicInitialized) {
      return;
    }
    backgroundAudio.volume = 0.6;
    musicInitialized = true;
  };

  const playBackgroundMusic = async () => {
    if (!backgroundAudio) {
      return;
    }
    ensureMusicReady();
    try {
      await backgroundAudio.play();
      isMusicPlaying = true;
      updateMusicToggle();
    } catch (error) {
      console.warn('Не удалось воспроизвести музыку', error);
    }
  };

  const pauseBackgroundMusic = () => {
    if (!backgroundAudio) {
      return;
    }
    backgroundAudio.pause();
    isMusicPlaying = false;
    updateMusicToggle();
  };

  musicBtn?.addEventListener('click', () => {
    if (!backgroundAudio) {
      return;
    }
    if (isMusicPlaying) {
      pauseBackgroundMusic();
    } else {
      void playBackgroundMusic();
    }
  });

  if (backgroundAudio) {
    backgroundAudio.addEventListener('ended', () => {
      isMusicPlaying = false;
      updateMusicToggle();
    });
  }

  const text = 'COVEN';
  if (title) {
    setTimeout(() => {
      title.textContent = '';
      text.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.animationDelay = `${index * 1}s`;
        title.appendChild(span);

        if (index === text.length - 1) {
          setTimeout(() => playBtn?.classList.add('is-visible'), (index + 1) * 1000 + 800);
        }
      });
    }, 4200);
  }

  playBtn?.addEventListener('click', () => {
    void playBackgroundMusic();
  });
});
