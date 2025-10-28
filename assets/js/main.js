document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('title');
  const playBtn = document.getElementById('playBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const text = 'COVEN';

  setTimeout(() => {
    text.split('').forEach((letter, index) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.animationDelay = `${index * 1}s`;
      title.appendChild(span);

      if (index === text.length - 1) {
        setTimeout(() => playBtn.classList.add('show'), (index + 1) * 1000 + 800);
      }
    });
  }, 4200);

  playBtn?.addEventListener('click', (event) => {
    const rawTarget =
      playBtn.getAttribute('href') || playBtn.dataset.target || 'pages/story.html';
    const resolvedTarget = new URL(rawTarget, window.location.href).href;

    event.preventDefault();
    window.location.assign(resolvedTarget);
  });

  fullscreenBtn?.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Не вдалося перемкнути повноекранний режим:', error);
    }
  });
});
