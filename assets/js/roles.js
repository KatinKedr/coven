const shuffle = (items) => {
  const array = items.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const createPlayerElement = (name) => {
  const player = document.createElement('article');
  player.className = 'roles-player';

  const avatar = document.createElement('div');
  avatar.className = 'roles-player__orb';
  avatar.setAttribute('aria-hidden', 'true');

  const title = document.createElement('p');
  title.className = 'roles-player__name';
  title.textContent = name;

  const role = document.createElement('p');
  role.className = 'roles-player__role';
  role.textContent = 'Роль ещё не открыта';

  player.append(avatar, title, role);
  return player;
};

const createCardElement = (index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'role-card';
  button.dataset.roleIndex = String(index);
  button.setAttribute('aria-label', `Выбрать карту роли номер ${index + 1}`);

  const image = document.createElement('img');
  image.src = 'image/deck-char.png';
  image.alt = 'Карта роли';
  image.loading = 'lazy';

  button.append(image);
  return button;
};

const assignRoleToPlayer = (playerEl, role) => {
  if (!playerEl) {
    return '';
  }
  let summary = '';
  const roleEl = playerEl.querySelector('.roles-player__role');
  if (roleEl) {
    roleEl.textContent = role.title;
    const hintCandidate =
      typeof role.hint === 'string' && role.hint.trim().length > 0
        ? role.hint.trim()
        : role.description?.who;
    if (typeof hintCandidate === 'string') {
      summary = hintCandidate.trim();
    }
    if (summary.length > 0) {
      roleEl.setAttribute('data-hint', summary);
    } else {
      roleEl.removeAttribute('data-hint');
    }
  }
  playerEl.classList.add('is-complete');
  return summary;
};

document.addEventListener('DOMContentLoaded', () => {
  const leftPlayersContainer = document.querySelector('.roles-players--left');
  const rightPlayersContainer = document.querySelector('.roles-players--right');
  const instructionEl = document.querySelector('.roles-instruction');
  const cardsContainer = document.querySelector('.roles-cards');
  const continueBtn = document.querySelector('.roles-continue');
  const popup = document.querySelector('.role-popup');
  const popupName = popup?.querySelector('.role-popup__name');
  const popupFields = {
    who: popup?.querySelector('[data-role-field="who"]'),
    howToPlay: popup?.querySelector('[data-role-field="howToPlay"]'),
    challenge: popup?.querySelector('[data-role-field="challenge"]'),
    superpower: popup?.querySelector('[data-role-field="superpower"]'),
  };
  const popupDetailBlocks = {
    who: popup?.querySelector('[data-role-detail="who"]'),
    howToPlay: popup?.querySelector('[data-role-detail="howToPlay"]'),
    challenge: popup?.querySelector('[data-role-detail="challenge"]'),
    superpower: popup?.querySelector('[data-role-detail="superpower"]'),
  };

  if (
    !leftPlayersContainer ||
    !rightPlayersContainer ||
    !cardsContainer ||
    !popup ||
    !popupName ||
    Object.values(popupFields).some((field) => !field) ||
    Object.values(popupDetailBlocks).some((detail) => !detail)
  ) {
    return;
  }

  const storedNamesRaw = sessionStorage.getItem('covenPlayers');
  let storedNames = [];

  if (storedNamesRaw) {
    try {
      const parsed = JSON.parse(storedNamesRaw);
      if (Array.isArray(parsed)) {
        storedNames = parsed
          .map((name) => (typeof name === 'string' ? name.trim() : ''))
          .filter((name) => name.length > 0);
      }
    } catch (error) {
      console.warn('Не удалось прочитать список участниц', error);
    }
  }

  if (storedNames.length === 0) {
    document.addEventListener('coven:screen:show', (event) => {
      if (event?.detail?.screen === 'roles' && typeof window.covenNavigate === 'function') {
        window.covenNavigate('players');
      }
    });
    return;
  }

  sessionStorage.removeItem('covenAssignments');

  const assignments = storedNames.map((name) => ({
    name,
    roleTitle: '',
    roleSummary: '',
    roleDetails: null,
  }));

  const persistAssignments = () => {
    try {
      sessionStorage.setItem('covenAssignments', JSON.stringify(assignments));
    } catch (error) {
      console.warn('Не удалось сохранить распределение ролей', error);
    }
  };

  const roles = shuffle([
    {
      title: 'СИРЕНА ИЗ ТУМАНА',
      description: {
        who: `Чаровница с голосом, от которого плывут даже мысли. Ты можешь заставить слушать любого — даже тишину.`,
        howToPlay: `Говори мягко, растягивай слова, добавляй шёпот и лёгкий флирт. Твои ответы должны звучать как тайна, которую хочется разгадать.`,
        challenge: `Во время каждого задания флиртуй с ведьмами, касайся, обнимайся или строй глазки.`,
        superpower: `3 раза за игру можешь «очаровать» любую ведьму — заставить её выполнить твоё задание вместо тебя.`,
      },
    },
    {
      title: 'ОРАКУЛ НА ГРАНИ',
      description: {
        who: `Ясновидящая с лёгким переутомлением от жизни. Ты видишь знаки в каждой случайности, даже в винной капле.`,
        howToPlay: `Делай пророчества на любую тему — даже бытовую. Добавляй загадочность и уверенность, будто ты знаешь, что будет завтра.`,
        challenge: `После каждого твоего задания ты должна сделать предсказание, пусть даже абсурдное: «Если ты сейчас засмеёшься — завтра получишь подарок.»`,
        superpower: `Можешь 3 раза за игру попробовать предсказать конец, сказав «Я вижу исход истории». Если угадала — получаешь бал.`,
      },
    },
    {
      title: 'БЕЗУМНАЯ ПРОВИДИЦА',
      description: {
        who: `Актриса с дипломом из Академии Хаоса. Ты превращаешь даже простую фразу в апокалипсис.`,
        howToPlay: `Добавляй драму, эмоции, театральность. Если можно упасть на диван — упади. Если можно вздохнуть — вздохни трижды.`,
        challenge: `Каждое своё задание ты должна завершать восклицанием «Да будет/было так во имя Луны!»`,
        superpower: `Можешь отказаться от задания 3 раза за игру, заявив, что «небо против».`,
      },
    },
    {
      title: 'ТРАВНИЦА ИРОНИИ',
      description: {
        who: `Спокойная, практичная ведьма, что лечит смехом и сарказмом. Ты мешаешь травы, слова и здравый смысл.`,
        howToPlay: `Всё превращай в рецепты, советы и жизненные афоризмы. Твоя магия — самоирония и чувство меры.`,
        challenge: `Во время каждого задания добавляй «ингредиенты»: «Возьмём ложку уверенности и щепотку безумия...»`,
        superpower: `Можешь «исцелить» любую ведьму 3 раза — подарить ей шанс пропустить ход без потери очков.`,
      },
    },
    {
      title: 'ПУТАНИЦА СУДЕБ',
      description: {
        who: `Дух хаоса в бархатных перчатках. Ты меняешь решения, как ветер направление.`,
        howToPlay: `Импровизируй, путай всех, задавай вопросы не в тему. Смейся, когда другие серьёзны.`,
        challenge: `После каждого задания задавай странный вопрос ведьмам. Если никто не ответил — получаешь дополнительный бал.`,
        superpower: `Можешь 3 раза за игру «перемешать судьбу» — поменять роли между всеми на один раунд.`,
      },
    },
    {
      title: 'ШЕПЧУЩАЯ ТЕНЬ',
      description: {
        who: `Та, чьё молчание громче слов. Ты наблюдаешь и появляешься внезапно, как мысль, которую не ждут.`,
        howToPlay: `Говори редко и шёпотом. Когда молчишь — смотри пристально, будто видишь больше.`,
        challenge: `В каждом задании скажи хотя бы одну фразу, из-за которой у всех пойдут мурашки.`,
        superpower: `3 раза можешь прервать задание другой ведьмы, сказав «Тьма молчит.»`,
      },
    },
    {
      title: 'ПИРОМАНТКА ЭМОЦИЙ',
      description: {
        who: `Живая искра, танец огня и смеха. Ты заражаешь всех энтузиазмом и безумными идеями.`,
        howToPlay: `Добавляй огонь — жестикуляцию, громкий смех, движение. Ты — сцена, и все это чувствуют.`,
        challenge: `Каждое задание выполняй с экспрессией и пламенной речью.`,
        superpower: `Можешь «зажечь» любую ведьму — дать ей +1 дополнительный бал, если считаешь нужным.`,
      },
    },
    {
      title: 'ИЛЛЮЗИОНИСТКА СУДЬБЫ',
      description: {
        who: `Артистка и манипулятор, прячущая шутку в пророчестве. Ты превращаешь ложь в искусство.`,
        howToPlay: `Выдавай любую чушь за древнее знание. Произноси «Я это видела во сне» — и никто не посмеет спорить.`,
        challenge: `В каждом раунде соври что-то убедительно и не раскрой обман.`,
        superpower: `3 раза за игру можешь заменить задание ведьмы на какое-то своё.`,
      },
    },
    {
      title: 'ВЕДЬМА ВЕТРА И СМЕХА',
      description: {
        who: `Весёлая душа, у которой даже заклинания звучат как анекдоты. Ты приносишь лёгкость и шум.`,
        howToPlay: `Всё превращай в игру — говори рифмой, пой, танцуй, шути. Не позволяй никому быть слишком серьёзным.`,
        challenge: `В каждом задании вставь рифму или каламбур.`,
        superpower: `Можешь развеять напряжение — заставить всех ведьм рассмеяться, и если получилось — получаешь дополнительный бал.`,
      },
    },
    {
      title: 'ХРАНИТЕЛЬНИЦА ТАЙН',
      description: {
        who: `Та, что знает ответы, но говорит загадками. Твоя речь — ребусы и флирт.`,
        howToPlay: `Никогда не отвечай прямо, только метафорами. «Судьба любит тех, кто не спрашивает.»`,
        challenge: `Однажды за игру выбери ведьму и дай ей загадку, на которую нет правильного ответа.`,
        superpower: `Можешь 3 раза поменять вопрос или задание, произнеся: «Это знание слишком опасно.»`,
      },
    },
    {
      title: 'СОБИРАТЕЛЬНИЦА ИСТОРИЙ',
      description: {
        who: `Хранительница чужих воспоминаний. Ты всё превращаешь в сказку — даже скучные события.`,
        howToPlay: `Выполняя задание, рассказывай его как легенду. «Говорят, в ту ночь свеча дрожала, и кто-то сказал именно это…»`,
        challenge: `Каждое задание начинай с фразы, будто это сказка или легенда.`,
        superpower: `Можешь 3 раза рассказать свою версию истории в ходе другой ведьмы. Если эта версия лучше — получаешь дополнительный бал.`,
      },
    },
    {
      title: 'СУДЬБОНОСНАЯ ВЛАДЫЧИЦА',
      description: {
        who: `Командир, прорицательница, та, кто решает. Твоё слово — закон, даже если оно случайно.`,
        howToPlay: `Говори уверенно, громко, с видом всезнающей. Не объясняй — просто объявляй.`,
        challenge: `Раз в раунд объяви «Закон Ковена» — смешное или странное правило на один ход.`,
        superpower: `Можешь единожды объявить «Поворот Судьбы» — поменять все роли между ведьмами.`,
      },
    },
  ]);

  const totalPlayers = storedNames.length;
  const midpoint = totalPlayers <= 3 ? totalPlayers : Math.ceil(totalPlayers / 2);

  const playerElements = storedNames.map((name, index) => {
    const element = createPlayerElement(name);

    const targetContainer = index < midpoint ? leftPlayersContainer : rightPlayersContainer;
    targetContainer.append(element);
    return element;
  });

  const stage = document.querySelector('.roles-stage');
  if (stage && rightPlayersContainer.childElementCount > 0) {
    stage.classList.add('roles-stage--split');
  }

  const availableRoles = roles.slice(0, 12);
  availableRoles.forEach((role, index) => {
    const card = createCardElement(index);
    cardsContainer.append(card);
  });

  let activePlayerIndex = 0;
  let pendingSelection = null;

  const getCards = () => Array.from(cardsContainer.querySelectorAll('.role-card'));

  const updateInstruction = () => {
    if (!instructionEl) {
      return;
    }
    if (activePlayerIndex >= playerElements.length) {
      instructionEl.textContent = 'Все роли раскрыты';
      return;
    }
    const activeName = playerElements[activePlayerIndex]
      ?.querySelector('.roles-player__name')
      ?.textContent;
    instructionEl.textContent = activeName
      ? `Выбери карту для ${activeName}`
      : 'Выбери карту';
  };

  const setActivePlayer = (index) => {
    activePlayerIndex = index;
    playerElements.forEach((element, elementIndex) => {
      element.classList.toggle('is-active', elementIndex === index);
    });
    updateInstruction();
  };

  const showContinueButton = () => {
    if (!continueBtn) {
      return;
    }
    if (continueBtn.hidden) {
      continueBtn.hidden = false;
      window.setTimeout(() => {
        continueBtn.focus({ preventScroll: true });
      }, 120);
    }
  };

  const finalizeSelection = (selection) => {
    const { playerIndex, roleIndex, card } = selection;
    const role = availableRoles[roleIndex];
    const playerEl = playerElements[playerIndex];
    if (!role || !playerEl || !card) {
      return;
    }

    const summary = assignRoleToPlayer(playerEl, role);
    assignments[playerIndex] = {
      name: storedNames[playerIndex] ?? '',
      roleTitle: role.title,
      roleSummary: summary,
      roleDetails: role.description ?? null,
    };
    persistAssignments();
    playerEl.classList.remove('is-active');

    card.classList.remove('is-pending');
    card.classList.add('is-revealed');
    card.disabled = true;
    card.setAttribute('aria-disabled', 'true');

    const nextIndex = playerElements.findIndex((element, idx) => {
      return idx > playerIndex && !element.classList.contains('is-complete');
    });

    if (nextIndex !== -1) {
      setActivePlayer(nextIndex);
      return;
    }

    const firstIncomplete = playerElements.findIndex((element) => !element.classList.contains('is-complete'));
    if (firstIncomplete === -1) {
      setActivePlayer(playerElements.length);
      showContinueButton();
    } else {
      setActivePlayer(firstIncomplete);
    }
  };

  const fillPopupDetails = (role) => {
    const descriptions = role.description ?? {};
    Object.entries(popupFields).forEach(([key, element]) => {
      if (!element) {
        return;
      }
      const text = typeof descriptions[key] === 'string' ? descriptions[key].trim() : '';
      element.textContent = text;
      const block = popupDetailBlocks[key];
      if (block) {
        block.classList.toggle('is-empty', text.length === 0);
      }
    });
  };

  const openPopup = (role) => {
    popupName.textContent = role.title;
    fillPopupDetails(role);
    popup.hidden = false;
    popup.classList.remove('is-visible');
    void popup.offsetWidth;
    popup.classList.add('is-visible');
  };

  const closePopup = (shouldApplySelection) => {
    if (popup.hidden) {
      return;
    }
    popup.classList.remove('is-visible');
    window.setTimeout(() => {
      popup.hidden = true;
      if (shouldApplySelection && pendingSelection) {
        finalizeSelection(pendingSelection);
      } else if (pendingSelection) {
        // Если закрыли без подтверждения, вернём карту в исходное состояние
        pendingSelection.card?.classList.remove('is-pending');
      }
      pendingSelection = null;
    }, 320);
  };

  getCards().forEach((card) => {
    card.addEventListener('click', () => {
      if (card.disabled || card.getAttribute('aria-disabled') === 'true') {
        return;
      }
      if (activePlayerIndex >= playerElements.length) {
        return;
      }
      if (popup.classList.contains('is-visible')) {
        return;
      }

      const roleIndex = Number(card.dataset.roleIndex);
      const role = availableRoles[roleIndex];
      if (!Number.isFinite(roleIndex) || !role) {
        return;
      }

      pendingSelection = {
        playerIndex: activePlayerIndex,
        roleIndex,
        card,
      };

      card.classList.add('is-pending');
      openPopup(role);
    });
  });

  popup.querySelectorAll('[data-close-popup]').forEach((closer) => {
    closer.addEventListener('click', () => closePopup(true));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.classList.contains('is-visible')) {
      event.preventDefault();
      closePopup(true);
    }
  });

  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      const target = continueBtn.dataset.nextScreen;
      if (!target) {
        return;
      }
      if (typeof window.covenNavigate === 'function') {
        window.covenNavigate(target);
      }
    });
  }

  setActivePlayer(0);
});
