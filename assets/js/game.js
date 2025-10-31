const parseStoredArray = (value) => {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Не удалось прочитать данные из sessionStorage', error);
    return [];
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const leftPlayersContainer = document.querySelector('.roles-players--left');
  const rightPlayersContainer = document.querySelector('.roles-players--right');
  const turnStatus = document.querySelector('.game-turn__label');
  const noteStatus = document.querySelector('.game-turn__note');
  const finishBtn = document.querySelector('.game-finish');

  if (!leftPlayersContainer || !rightPlayersContainer || !turnStatus || !finishBtn) {
    return;
  }

  const storedNames = parseStoredArray(sessionStorage.getItem('covenPlayers')).map((name) =>
    typeof name === 'string' ? name.trim() : ''
  );
  const storedAssignments = parseStoredArray(sessionStorage.getItem('covenAssignments'));

  if (storedNames.length === 0) {
    window.location.replace('players.html');
    return;
  }

  const playersData = storedNames.map((name, index) => {
    const assignment =
      typeof storedAssignments[index] === 'object' && storedAssignments[index] !== null
        ? storedAssignments[index]
        : {};
    const roleTitle = typeof assignment.roleTitle === 'string' ? assignment.roleTitle.trim() : '';
    const roleSummary = typeof assignment.roleSummary === 'string' ? assignment.roleSummary.trim() : '';
    const roleDetails =
      assignment.roleDetails && typeof assignment.roleDetails === 'object'
        ? assignment.roleDetails
        : null;

    return {
      name,
      roleTitle,
      roleSummary,
      roleDetails,
    };
  });

  const hasAllRoles = playersData.every((player) => player.roleTitle.length > 0);
  if (!hasAllRoles) {
    window.location.replace('roles.html');
    return;
  }

  const createPlayerElement = (player, index) => {
    const article = document.createElement('article');
    article.className = 'roles-player game-player is-complete';
    article.dataset.playerIndex = String(index);

    const scoreWrapper = document.createElement('div');
    scoreWrapper.className = 'game-player__score';

    const decreaseBtn = document.createElement('button');
    decreaseBtn.type = 'button';
    decreaseBtn.className = 'game-player__score-button game-player__score-button--decrease';
    decreaseBtn.setAttribute('aria-label', `Отнять балл у ${player.name}`);
    decreaseBtn.textContent = '−';

    const orb = document.createElement('div');
    orb.className = 'roles-player__orb';

    const scoreValue = document.createElement('span');
    scoreValue.className = 'game-player__score-value';
    scoreValue.textContent = '0';
    scoreValue.setAttribute('aria-live', 'polite');

    orb.append(scoreValue);

    const increaseBtn = document.createElement('button');
    increaseBtn.type = 'button';
    increaseBtn.className = 'game-player__score-button game-player__score-button--increase';
    increaseBtn.setAttribute('aria-label', `Добавить балл ${player.name}`);
    increaseBtn.textContent = '+';

    scoreWrapper.append(decreaseBtn, orb, increaseBtn);

    const nameEl = document.createElement('p');
    nameEl.className = 'roles-player__name';
    nameEl.textContent = player.name;

    const roleEl = document.createElement('p');
    roleEl.className = 'roles-player__role';
    roleEl.textContent = player.roleTitle;
    if (player.roleSummary?.length > 0) {
      roleEl.setAttribute('data-hint', player.roleSummary);
    }

    article.append(scoreWrapper, nameEl, roleEl);

    return {
      element: article,
      scoreValue,
      decreaseBtn,
      increaseBtn,
    };
  };

  const midpoint = playersData.length <= 3 ? playersData.length : Math.ceil(playersData.length / 2);

  const players = playersData.map((player, index) => {
    const playerElement = createPlayerElement(player, index);
    const targetContainer = index < midpoint ? leftPlayersContainer : rightPlayersContainer;
    targetContainer.append(playerElement.element);
    return playerElement;
  });

  if (rightPlayersContainer.childElementCount > 0) {
    const stage = document.querySelector('.game-stage');
    stage?.classList.add('roles-stage--split');
  }

  let activePlayerIndex = 0;
  const scores = players.map(() => 0);

  const updateTurnStatus = () => {
    const active = playersData[activePlayerIndex];
    if (active?.name) {
      turnStatus.textContent = `Сейчас ход: ${active.name}`;
    } else {
      turnStatus.textContent = 'Выберите, кто ходит первым';
    }
  };

  const setActivePlayer = (index) => {
    activePlayerIndex = index;
    players.forEach((player, playerIndex) => {
      player.element.classList.toggle('is-active', playerIndex === index);
    });
    updateTurnStatus();
  };

  const updateFinishButton = (triggerIndex = null) => {
    const hasThreshold = scores.some((score) => score >= 200);
    if (!hasThreshold) {
      if (!finishBtn.hidden) {
        finishBtn.hidden = true;
      }
      if (noteStatus) {
        noteStatus.textContent = '';
      }
      return;
    }

    if (noteStatus && triggerIndex !== null && playersData[triggerIndex]) {
      noteStatus.textContent = `${playersData[triggerIndex].name} набрав(ла) 200 балів!`;
    }

    if (finishBtn.hidden) {
      finishBtn.hidden = false;
      window.setTimeout(() => {
        finishBtn.focus({ preventScroll: true });
      }, 120);
    }
  };

  const adjustScore = (playerIndex, delta) => {
    if (!Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex >= scores.length) {
      return;
    }
    const current = scores[playerIndex];
    const nextScore = Math.max(0, current + delta);
    if (current === nextScore) {
      return;
    }
    scores[playerIndex] = nextScore;
    const scoreLabel = players[playerIndex]?.scoreValue;
    if (scoreLabel) {
      scoreLabel.textContent = String(nextScore);
    }
    updateFinishButton(delta > 0 && nextScore >= 200 ? playerIndex : null);
  };

  players.forEach((player, index) => {
    player.element.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('.game-player__score-button')) {
        return;
      }
      setActivePlayer(index);
    });

    player.decreaseBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      adjustScore(index, -1);
    });

    player.increaseBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      adjustScore(index, 1);
    });
  });

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      const target = finishBtn.dataset.next;
      if (!target) {
        return;
      }
      const resolved = new URL(target, window.location.href);
      window.location.assign(resolved.href);
    });
  }

  setActivePlayer(0);
});
