document.addEventListener('DOMContentLoaded', () => {
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
