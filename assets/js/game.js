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

  const deckDefinitions = {
    'main-1': [
      { id: 1, question: 'Какая твоя самая ведьмовская привычка в реальной жизни?' },
      {
        id: 2,
        question: 'Случалось ли тебе использовать чары — флирт, взгляд, слова — чтобы получить то, что хочешь?',
      },
      { id: 3, question: 'Какое твоё заклинание работает лучше любого магического ритуала?' },
      { id: 4, question: 'Какая тайна из твоего прошлого до сих пор шепчет тебе на ухо?' },
      { id: 5, question: 'Какой поступок ты бы стерла из памяти других, если бы могла?' },
      { id: 6, question: 'Что тебя может свести с ума — восхищение или власть?' },
      { id: 7, question: 'Какая эмоция в тебе самая разрушительная?' },
      { id: 8, question: 'Какое желание ты прячешь, даже от самой себя?' },
      {
        id: 9,
        question: 'Если бы ты могла заколдовать одного человека — кто бы это был и что бы ты с ним сделала?',
      },
      { id: 10, question: 'За что ты могла бы быть осуждена на ведьмовском суде?' },
      {
        id: 11,
        question: 'Кто из присутствующих заслужил бы стать твоим “со-заговорщиком” и почему?',
      },
      { id: 12, question: 'Какое твоё самое соблазнительное оружие?' },
      { id: 13, question: 'Когда ты чувствуешь себя по-настоящему магически привлекательной?' },
      { id: 14, question: 'Какая твоя тёмная сторона тебе даже нравится?' },
      {
        id: 15,
        question: 'Был ли человек, о котором ты думала: “Я могла бы разрушить его жизнь — и это было бы красиво”?',
      },
      { id: 16, question: 'Что ты делала ночью, о чём лучше не рассказывать солнцу?' },
      { id: 17, question: 'Какая “запрещённая” фантазия возвращается к тебе чаще всего?' },
      {
        id: 18,
        question: 'Какой комплимент тебе хочется услышать чаще, но ты боишься признаться в этом?',
      },
      { id: 19, question: 'Что ты считаешь своим самым большим искушением?' },
      {
        id: 20,
        question: 'Если бы твой характер был зельем — какие три ингредиента в нём были бы?',
      },
      {
        id: 21,
        question: 'Что в тебе заставляет людей тянуться к тебе — и отдаляться?',
      },
      { id: 22, question: 'Есть ли человек, которого ты мысленно прокляла? Сработало?' },
      {
        id: 23,
        question: 'Какая часть твоей жизни похожа на заклинание, которое вышло из-под контроля?',
      },
      {
        id: 24,
        question: 'Если бы ты могла изменить прошлое, не потеряв урок — что бы это было?',
      },
      { id: 25, question: 'Какую клятву ты дала себе — и нарушила?' },
      {
        id: 26,
        question: 'Кого из бывших ты бы вызвала обратно — не ради любви, а ради любопытства?',
      },
      {
        id: 27,
        question: 'Что ты когда-нибудь делала, зная, что это разрушит — но всё равно продолжала?',
      },
      { id: 28, question: 'Что ты сделала бы, если бы никто не узнал?' },
      {
        id: 29,
        question: 'Когда ты в последний раз притворялась, что тебе всё равно — хотя не было?',
      },
      {
        id: 30,
        question: 'Кому из присутствующих ты бы доверила тайну, способную тебя разрушить?',
      },
      { id: 31, question: 'Что в тебе самое опасное — твой ум, тело или способность чувствовать?' },
      { id: 32, question: 'Когда ты была самой жестокой — и наслаждалась этим?' },
      { id: 33, question: 'Что ты украла — буквально или символически — и не пожалела?' },
      { id: 34, question: 'Что тебе легче: манипулировать или поддаваться?' },
      {
        id: 35,
        question: 'Когда ты чувствовала, что кто-то читает тебя, как открытую книгу — и это было приятно?',
      },
      { id: 36, question: 'Что ты скрываешь под образом «всё под контролем»?' },
      {
        id: 37,
        question: 'Что бы ты хотела вернуть: человека, чувство или момент?',
      },
      {
        id: 38,
        question: 'Когда ты в последний раз нарочно сделала что-то неправильное — просто ради вкуса греха?',
      },
      { id: 39, question: 'Что тебя возбуждает сильнее — власть или покорность?' },
      { id: 40, question: 'Что бы ты сказала себе десять лет назад?' },
      {
        id: 41,
        question: 'Какое желание ты долго называла «глупостью», пока не поняла, что это именно то, что тебе нужно?',
      },
      {
        id: 42,
        question: 'Если бы Луна могла задать тебе один вопрос — чего бы ты боялась услышать?',
      },
      { id: 43, question: 'Что в тебе — дар, а что — проклятье?' },
      {
        id: 44,
        question: 'Когда ты в последний раз чувствовала себя настоящей ведьмой — уверенной, желанной и чуть опасной?',
      },
      { id: 45, question: 'Есть ли у тебя «священный секрет», о котором никто не знает?' },
      { id: 46, question: 'Любовь без страсти ❤️ или страсть без любви 🔥?' },
      { id: 47, question: 'Предсказать будущее — или переписать прошлое?' },
      { id: 48, question: 'Властвовать над другими — или над собой?' },
      { id: 49, question: 'Никогда не ошибаться — или всегда получать второй шанс?' },
      { id: 50, question: 'Признаться в грехе — или повторить его ещё раз?' },
      { id: 51, question: 'Сказать правду — или произнести красивую ложь?' },
      { id: 52, question: 'Спасти любовь — или сохранить свободу?' },
      { id: 53, question: 'Делать больно — или чувствовать боль?' },
      { id: 54, question: 'Сдаться — или сделать вид, что ты не хотела победы?' },
      { id: 55, question: 'Простить — или наблюдать, как судьба мстит за тебя?' },
      { id: 56, question: 'Стать легендой — или остаться тайной?' },
      {
        id: 57,
        question: 'Получить всё — но потерять вкус к игре, или проиграть — и смеяться?',
      },
      { id: 58, question: 'Отдать силу за любовь — или любовь за силу?' },
      {
        id: 59,
        question: 'Жертвовать собой ради других — или позволять другим жертвовать ради тебя?',
      },
      { id: 60, question: 'Оставаться в тени — или выйти на свет и сгореть?' },
      { id: 61, question: 'Что бы ты выбрала — знать всё или чувствовать всё?' },
      {
        id: 62,
        question: 'Если бы ты могла переродиться ведьмой в другой эпохе — какую бы выбрала?',
      },
    ],
  };

  const deckStates = new Map();

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

  const drawCardFromDeck = (deckId) => {
    const deck = deckDefinitions[deckId];
    if (!Array.isArray(deck) || deck.length === 0) {
      return null;
    }

    let state = deckStates.get(deckId);
    if (!state || state.remaining.length === 0) {
      state = {
        remaining: deck.slice(),
      };
    }

    const { remaining } = state;
    if (!Array.isArray(remaining) || remaining.length === 0) {
      return null;
    }

    const randomIndex = getRandomIntInclusive(0, remaining.length - 1);
    const [card] = remaining.splice(randomIndex, 1);
    deckStates.set(deckId, { remaining });

    return card ?? null;
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
        const deckId = typeof deckButton.dataset.gameDeck === 'string' ? deckButton.dataset.gameDeck.trim() : '';
        let popupContent = '';

        if (deckId.length > 0) {
          const card = drawCardFromDeck(deckId);
          if (card && typeof card.question === 'string') {
            popupContent = card.question.trim();
          } else if (deckDefinitions[deckId]) {
            popupContent = 'В этой колоде пока нет карт.';
          }
        }

        deckButton.dataset.deckContent = popupContent;

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
