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

  const title = document.createElement('p');
  title.className = 'roles-player__name';
  title.textContent = name;

  const role = document.createElement('p');
  role.className = 'roles-player__role';
  role.textContent = 'Роль ещё не открыта';

  player.append(title, role);
  return player;
};

const createCardElement = (index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'role-card';
  button.dataset.roleIndex = String(index);
  button.setAttribute('aria-label', `Выбрать карту роли номер ${index + 1}`);

  const image = document.createElement('img');
  image.src = '../image/deck-char.png';
  image.alt = 'Карта роли';
  image.loading = 'lazy';

  button.append(image);
  return button;
};

const assignRoleToPlayer = (playerEl, role) => {
  if (!playerEl) {
    return;
  }
  const roleEl = playerEl.querySelector('.roles-player__role');
  if (roleEl) {
    roleEl.textContent = role.title;
    if (role.hint) {
      roleEl.setAttribute('data-hint', role.hint);
    }
  }
  playerEl.classList.add('is-complete');
};

document.addEventListener('DOMContentLoaded', () => {
  const playersContainer = document.querySelector('.roles-players');
  const instructionEl = document.querySelector('.roles-instruction');
  const cardsContainer = document.querySelector('.roles-cards');
  const continueBtn = document.querySelector('.roles-continue');
  const popup = document.querySelector('.role-popup');
  const popupName = popup?.querySelector('.role-popup__name');
  const popupHint = popup?.querySelector('.role-popup__hint');

  if (!playersContainer || !cardsContainer || !popup || !popupName || !popupHint) {
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
    window.location.replace('players.html');
    return;
  }

  const roles = shuffle([
    { title: 'Верховная жрица', hint: 'Ты ведёшь ритуал и можешь первым говорить в каждом раунде.' },
    { title: 'Прорицательница', hint: 'Каждую ночь ты получаешь видение о другом участнике.' },
    { title: 'Страж круга', hint: 'Твоя задача — защитить выбранную сестру от беды.' },
    { title: 'Теневой алхимик', hint: 'Ты смешиваешь ингредиенты и можешь поменять действие роли.' },
    { title: 'Астромант', hint: 'Следи за звёздами и предупреди ковен об опасности.' },
    { title: 'Повелительница снов', hint: 'Ты выбираешь, кому приснится знак этой ночью.' },
    { title: 'Хранительница огня', hint: 'Поддерживай пламя ритуала и усиливай активные роли.' },
    { title: 'Лунная певица', hint: 'Своей песней ты можешь успокоить или запутать противника.' },
    { title: 'Вестница духов', hint: 'Ты слышишь шёпот духов и передаёшь их послания.' },
    { title: 'Знахарка', hint: 'У тебя есть одно исцеление за игру — используй его мудро.' },
    { title: 'Чаровница ветра', hint: 'Ты перенаправляешь чужие действия, меняя ход событий.' },
    { title: 'Тайная наблюдательница', hint: 'Ты видишь скрытые связи между участниками.' },
  ]);

  const playerElements = storedNames.map((name) => {
    const element = createPlayerElement(name);
    playersContainer.append(element);
    return element;
  });

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

    assignRoleToPlayer(playerEl, role);
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

  const openPopup = (role) => {
    popupName.textContent = role.title;
    popupHint.textContent = role.hint ?? '';
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
      const target = continueBtn.dataset.next;
      if (!target) {
        return;
      }
      const resolved = new URL(target, window.location.href);
      window.location.assign(resolved.href);
    });
  }

  setActivePlayer(0);
});
