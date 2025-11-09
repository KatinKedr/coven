document.addEventListener('DOMContentLoaded', () => {
  const nameField = document.querySelector('[data-winner-name]');
  const scoreField = document.querySelector('[data-winner-score]');
  const listContainer = document.querySelector('[data-winner-list]');
  const announcementField = document.querySelector('[data-winner-announcement]');
  const ritualButton = document.querySelector('[data-ritual-button]');
  const confetti = document.querySelector('[data-winner-confetti]');

  const raw = sessionStorage.getItem('covenWinner');
  if (!raw) {
    window.location.replace('game.html');
    return;
  }

  let payload = null;

  try {
    payload = JSON.parse(raw);
  } catch (error) {
    console.warn('Не удалось прочитать информацию о победителе', error);
  }

  if (!payload || typeof payload !== 'object') {
    window.location.replace('game.html');
    return;
  }

  const summary = Array.isArray(payload.summary) ? payload.summary : [];
  const winners = Array.isArray(payload.winners) ? payload.winners : [];
  const bestScore = Number.isFinite(payload.bestScore) ? payload.bestScore : 0;

  if (summary.length === 0 || winners.length === 0) {
    window.location.replace('game.html');
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
      announcementField.textContent = 'Переможець ритуалу';
    }
    if (nameField) {
      nameField.textContent = winnerNames[0];
    }
  } else {
    if (announcementField) {
      announcementField.textContent = 'Переможці ритуалу';
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

  if (listContainer instanceof HTMLElement) {
    listContainer.innerHTML = '';

    summary
      .map((entry, index) => ({
        name: formatName(entry.name),
        score: Number.isFinite(entry.score) ? entry.score : 0,
        index,
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .forEach((entry) => {
        const item = document.createElement('li');
        item.className = 'winner-list__item';
        if (entry.score === bestScore) {
          item.classList.add('is-winner');
        }

        const name = document.createElement('span');
        name.textContent = entry.name;

        const score = document.createElement('span');
        score.textContent = `${entry.score} балів`;

        item.append(name, score);
        listContainer.append(item);
      });
  }

  if (ritualButton) {
    ritualButton.addEventListener('click', () => {
      try {
        sessionStorage.removeItem('covenWinner');
      } catch (error) {
        console.warn('Не удалось очистить данные победителя', error);
      }
      const target = ritualButton.dataset.next;
      if (!target) {
        return;
      }
      const resolved = new URL(target, window.location.href);
      window.location.assign(resolved.href);
    });
  }
});
