document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('no-js');

  const slides = Array.from(document.querySelectorAll('[data-slide]'));
  const prevButton = document.querySelector('[data-slide-prev]');
  const nextButton = document.querySelector('[data-slide-next]');
  const counter = document.querySelector('[data-slide-counter]');

  if (slides.length > 0) {
    const totalSlides = slides.length;
    let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
    currentIndex = currentIndex === -1 ? 0 : currentIndex;

    const updateSlides = () => {
      slides.forEach((slide, index) => {
        const isActive = index === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });

      if (prevButton) {
        prevButton.disabled = currentIndex === 0;
      }

      if (nextButton) {
        nextButton.disabled = currentIndex === totalSlides - 1;
      }

      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
      }
    };

    updateSlides();

    const goToSlide = (direction) => {
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0 || nextIndex >= totalSlides) {
        return;
      }

      currentIndex = nextIndex;
      updateSlides();
    };

    prevButton?.addEventListener('click', () => {
      goToSlide(-1);
    });

    nextButton?.addEventListener('click', () => {
      goToSlide(1);
    });
  }

  const audioToggle = document.querySelector('[data-audio-toggle]');
  const audioElement = document.getElementById('ritualAudio');

  if (!audioToggle || !audioElement) {
    return;
  }

  let isPlaying = false;

  const updateState = () => {
    audioToggle.classList.toggle('is-playing', isPlaying);
    audioToggle.setAttribute('aria-pressed', String(isPlaying));
    audioToggle.setAttribute('aria-label', isPlaying ? 'Остановить музыку ритуала' : 'Включить музыку ритуала');
  };

  const playAudio = async () => {
    try {
      await audioElement.play();
      isPlaying = true;
      updateState();
    } catch (error) {
      console.warn('Не удалось воспроизвести музыку ритуала', error);
    }
  };

  const pauseAudio = () => {
    audioElement.pause();
    isPlaying = false;
    updateState();
  };

  audioToggle.addEventListener('click', () => {
    if (!isPlaying) {
      void playAudio();
    } else {
      pauseAudio();
    }
  });

  audioElement.addEventListener('ended', () => {
    isPlaying = false;
    updateState();
  });
});
