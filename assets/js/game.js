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
  const finishBtn = document.querySelector('.game-finish-link');

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

  const getRandomIntInclusive = (min, max) => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
  };

  let activePlayerIndex = 0;
  const scores = players.map(() => 0);
  let turnsUntilEvent = getRandomIntInclusive(3, 6);
  let currentEvent = null;
  const finishThreshold = 100;
  let finishNote = '';
  let lastOpenedDeckType = null;

  const auxiliaryDecks = Array.from(document.querySelectorAll(
    '.game-deck--auxiliary'
  ));

  const renderNote = () => {
    const parts = [];
    if (currentEvent) {
      const eventLabel =
        currentEvent === 'ritual' ? 'Время ритуала' : 'Время разгадать загадку';
      parts.push(`${eventLabel}! Возьмите карту из дополнительной колоды.`);
    }
    if (finishNote) {
      parts.push(finishNote);
    }

    if (noteStatus) {
      noteStatus.textContent = parts.join(' • ');
    }

    auxiliaryDecks.forEach((deck) => {
      const isRitualDeck = deck.classList.contains('game-deck--aux-1');
      const isMysteryDeck = deck.classList.contains('game-deck--aux-2');
      const shouldHighlight =
        (currentEvent === 'ritual' && isRitualDeck) ||
        (currentEvent === 'mystery' && isMysteryDeck);
      deck.classList.toggle('game-deck--highlight', shouldHighlight);
    });
  };

  const updateTurnStatus = () => {
    const active = playersData[activePlayerIndex];
    if (active?.name) {
      turnStatus.textContent = `Сейчас ход: ${active.name}`;
    } else {
      turnStatus.textContent = 'Выберите, кто ходит первым';
    }
    renderNote();
  };

  const setActivePlayer = (index) => {
    activePlayerIndex = index;
    players.forEach((player, playerIndex) => {
      player.element.classList.toggle('is-active', playerIndex === index);
    });
    updateTurnStatus();
  };

  const updateFinishButton = (triggerIndex = null) => {
    const hasThreshold = scores.some((score) => score >= finishThreshold);
    if (!hasThreshold) {
      if (!finishBtn.hidden) {
        finishBtn.hidden = true;
      }
      finishNote = '';
      renderNote();
      return;
    }

    if (triggerIndex !== null && playersData[triggerIndex]) {
      finishNote = `${playersData[triggerIndex].name} набрав(ла) ${finishThreshold} балів! Можна завершити гру або продовжити.`;
    }
    if (!finishNote) {
      finishNote = `Хтось набрав ${finishThreshold} балів. Ви можете завершити гру або продовжити.`;
    }

    finishBtn.hidden = false;

    renderNote();
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
    updateFinishButton(delta > 0 && nextScore >= finishThreshold ? playerIndex : null);
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

  const deckPopup = document.querySelector('.game-deck-popup');
  const deckButtons = document.querySelectorAll('[data-game-deck]');
  const deckPopupTitle = deckPopup?.querySelector('[data-deck-field="title"]');
  const deckPopupTasks = deckPopup?.querySelector('[data-deck-field="tasks"]');
  const deckPopupDivider = deckPopup?.querySelector('.role-popup__divider');
  let lastFocusedDeck = null;

  const closeDeckPopup = () => {
    if (!deckPopup || deckPopup.hidden) {
      return;
    }
    deckPopup.hidden = true;
    deckPopup.classList.remove('is-active');
    document.removeEventListener('keydown', handleDeckPopupKeydown);
    if (deckPopupTitle) {
      deckPopupTitle.textContent = '';
      deckPopupTitle.hidden = true;
    }
    if (deckPopupTasks) {
      deckPopupTasks.replaceChildren();
      deckPopupTasks.hidden = true;
    }
    if (deckPopupDivider) {
      deckPopupDivider.hidden = true;
    }
    if (lastFocusedDeck instanceof HTMLElement) {
      lastFocusedDeck.focus({ preventScroll: true });
    }
    lastFocusedDeck = null;

    let eventResolved = false;
    if (currentEvent && lastOpenedDeckType === 'auxiliary') {
      currentEvent = null;
      turnsUntilEvent = getRandomIntInclusive(3, 6);
      eventResolved = true;
    }

    lastOpenedDeckType = null;

    if (players.length > 0) {
      if (!eventResolved) {
        turnsUntilEvent = Math.max(turnsUntilEvent - 1, 0);
      }

      if (turnsUntilEvent <= 0 && !currentEvent) {
        currentEvent = Math.random() < 0.5 ? 'ritual' : 'mystery';
        turnsUntilEvent = 0;
      }

      const nextIndex = (activePlayerIndex + 1) % players.length;
      setActivePlayer(nextIndex);

      if (!currentEvent && turnsUntilEvent === 0) {
        turnsUntilEvent = getRandomIntInclusive(3, 6);
      }
    }
  };

  const handleDeckPopupKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDeckPopup();
    }
  };

  const openDeckPopup = (trigger) => {
    if (!deckPopup || !deckPopupTitle || !deckPopupTasks) {
      return;
    }

    const title = typeof trigger.dataset.deckTitle === 'string' ? trigger.dataset.deckTitle.trim() : '';
    const content = typeof trigger.dataset.deckContent === 'string' ? trigger.dataset.deckContent.trim() : '';

    if (trigger.classList.contains('game-deck--auxiliary')) {
      lastOpenedDeckType = 'auxiliary';
    } else {
      lastOpenedDeckType = 'main';
    }

    deckPopupTitle.textContent = title;
    deckPopupTitle.hidden = title.length === 0;

    deckPopupTasks.replaceChildren();
    if (content.length > 0) {
      const paragraph = document.createElement('p');
      paragraph.className = 'game-deck-popup__text';
      paragraph.textContent = content;
      deckPopupTasks.append(paragraph);
      deckPopupTasks.hidden = false;
    } else {
      deckPopupTasks.hidden = true;
    }

    if (deckPopupDivider) {
      deckPopupDivider.hidden = deckPopupTitle.hidden && deckPopupTasks.hidden;
    }

    deckPopup.hidden = false;
    deckPopup.classList.add('is-active');
    document.addEventListener('keydown', handleDeckPopupKeydown);

    lastFocusedDeck = trigger;

    const closeButton = deckPopup.querySelector('.role-popup__close');
    if (closeButton instanceof HTMLElement) {
      closeButton.focus({ preventScroll: true });
    }
  };

  if (deckPopup && deckButtons.length > 0) {
    deckPopup.hidden = true;
    if (deckPopupTitle) {
      deckPopupTitle.hidden = true;
    }
    if (deckPopupTasks) {
      deckPopupTasks.hidden = true;
    }
    if (deckPopupDivider) {
      deckPopupDivider.hidden = true;
    }

    deckButtons.forEach((deckButton) => {
      deckButton.addEventListener('click', () => {
        openDeckPopup(deckButton);
      });
    });

    deckPopup.addEventListener('click', (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest('[data-close-popup]') : null;
      if (target) {
        event.preventDefault();
        closeDeckPopup();
      }
    });
  }

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
