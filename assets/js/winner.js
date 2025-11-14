document.addEventListener('DOMContentLoaded', () => {
  const nameField = document.querySelector('[data-winner-name]');
  const scoreField = document.querySelector('[data-winner-score]');
  const announcementField = document.querySelector('[data-winner-announcement]');
  const ritualButton = document.querySelector('[data-ritual-button]');
  const confetti = document.querySelector('[data-winner-confetti]');

  const raw = sessionStorage.getItem('covenWinner');
  const scheduleRedirectToGame = (() => {
    let scheduled = false;
    return () => {
      if (scheduled) {
        return;
      }
      scheduled = true;
      document.addEventListener('coven:screen:show', (event) => {
        if (event?.detail?.screen === 'winner' && typeof window.covenNavigate === 'function') {
          window.covenNavigate('game');
        }
      });
    };
  })();

  if (!raw) {
    scheduleRedirectToGame();
    return;
  }

  let payload = null;

  try {
    payload = JSON.parse(raw);
  } catch (error) {
    console.warn('Не удалось прочитать информацию о победителе', error);
  }

  if (!payload || typeof payload !== 'object') {
    scheduleRedirectToGame();
    return;
  }

  const winners = Array.isArray(payload.winners) ? payload.winners : [];
  const bestScore = Number.isFinite(payload.bestScore) ? payload.bestScore : 0;

  if (winners.length === 0) {
    scheduleRedirectToGame();
    return;
  }

  const formatName = (name) => {
    if (typeof name === 'string' && name.trim().length > 0) {
      return name.trim();
    }
    return 'Таинственная ведьма';
  };

  const uniqueWinners = winners
    .map((entry) => ({
      name: formatName(entry.name),
      score: Number.isFinite(entry.score) ? entry.score : bestScore,
    }))
    .filter((entry, index, array) => index === array.findIndex((item) => item.name === entry.name && item.score === entry.score));

  const winnerNames = uniqueWinners.map((entry) => entry.name);

  if (winnerNames.length === 1) {
    if (announcementField) {
      announcementField.textContent = 'Победитель ритуала';
    }
    if (nameField) {
      nameField.textContent = winnerNames[0];
    }
  } else {
    if (announcementField) {
      announcementField.textContent = 'Победители ритуала';
    }
    if (nameField) {
      nameField.textContent = winnerNames.join(' ✶ ');
    }
  }

  if (scoreField) {
    scoreField.textContent = String(bestScore);
  }

  if (confetti) {
    confetti.classList.add('is-visible');
  }

  if (ritualButton) {
    ritualButton.addEventListener('click', () => {
      try {
        sessionStorage.removeItem('covenWinner');
      } catch (error) {
        console.warn('Не удалось очистить данные победителя', error);
      }
      const target = ritualButton.dataset.nextScreen;
      if (!target) {
        return;
      }
      if (typeof window.covenNavigate === 'function') {
        window.covenNavigate(target);
      }
    });
  }
});
