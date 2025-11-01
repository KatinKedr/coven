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
  role.textContent = 'Роль ще не відкрита';

  player.append(avatar, title, role);
  return player;
};

const createCardElement = (index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'role-card';
  button.dataset.roleIndex = String(index);
  button.setAttribute('aria-label', `Обрати карту ролі номер ${index + 1}`);

  const image = document.createElement('img');
  image.src = '../image/deck-char.png';
  image.alt = 'Карта ролі';
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
      console.warn('Не вдалося прочитати список учасниць', error);
    }
  }

  if (storedNames.length === 0) {
    window.location.replace('players.html');
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
      console.warn('Не вдалося зберегти розподіл ролей', error);
    }
  };

  const roles = shuffle([
    {
      title: 'СИРЕНА З ТУМАНУ',
      description: {
        who: `Чарівниця з голосом, від якого пливуть навіть думки. Ти можеш змусити слухати будь-кого — навіть тишу.`,
        howToPlay: `Говори м'яко, розтягуй слова, додавай шепіт і легкий флірт. Твої відповіді мають звучати як таємниця, яку хочеться розгадати.`,
        challenge: `Під час кожного завдання фліртуй з відьмами, торкайся, обіймайся або будуй очі.`,
        superpower: `3 рази за гру можеш «зачарувати» будь-яку відьму — змусити її виконати твоє завдання замість тебе.`,
      },
    },
    {
      title: 'ОРАКУЛ НА МЕЖІ',
      description: {
        who: `Ясновидиця з легким перевтомленням від життя. Ти бачиш знаки в кожній випадковості, навіть у винній краплі.`,
        howToPlay: `Роби пророцтва на будь-яку тему — навіть побутову. Додавай загадковість і впевненість, наче ти знаєш, що буде завтра.`,
        challenge: `Після кожного свого завдання ти маєш зробити передбачення, хай навіть абсурдне: «Якщо ти зараз засмієшся — завтра отримаєш подарунок.»`,
        superpower: `Можеш 3 рази за гру спробувати передбачити фінал, сказавши «Я бачу фінал історії». Якщо вгадала — отримуєш бал.`,
      },
    },
    {
      title: 'БОЖЕВІЛЬНА ПРОВИДИЦЯ',
      description: {
        who: `Акторка з дипломом Академії Хаосу. Ти перетворюєш навіть просту фразу на апокаліпсис.`,
        howToPlay: `Додавай драму, емоції, театральність. Якщо можна впасти на диван — впади. Якщо можна зітхнути — зітхни тричі.`,
        challenge: `Кожне своє завдання завершує вигуком «Хай буде/було так в ім'я Місяця!»`,
        superpower: `Можеш відмовитися від завдання 3 рази за гру, заявивши, що «небо проти».`,
      },
    },
    {
      title: 'ТРАВНИЦЯ ІРОНІЇ',
      description: {
        who: `Спокійна, практична відьма, що лікує сміхом і сарказмом. Ти змішуєш трави, слова й здоровий глузд.`,
        howToPlay: `Усе перетворюй на рецепти, поради й життєві афоризми. Твоя магія — самоіронія та почуття міри.`,
        challenge: `Під час кожного завдання додавай «інгредієнти»: «Візьмемо ложку впевненості й щіпку божевілля...»`,
        superpower: `Можеш «зцілити» будь-яку відьму 3 рази — подарувати їй шанс пропустити хід без втрати балів.`,
      },
    },
    {
      title: 'ПЛУТАНИНА ДОЛІ',
      description: {
        who: `Дух хаосу в оксамитових рукавичках. Ти змінюєш рішення, як вітер напрям.`,
        howToPlay: `Імпровізуй, плутай усіх, став запитання не до теми. Смійся, коли інші серйозні.`,
        challenge: `Після кожного завдання став відьмам дивне запитання. Якщо ніхто не відповів — отримуєш додатковий бал.`,
        superpower: `Можеш 3 рази за гру «перемішати долю» — поміняти ролі між усіма на один раунд.`,
      },
    },
    {
      title: 'ШЕПІТНА ТІНЬ',
      description: {
        who: `Та, чиє мовчання гучніше за слова. Ти спостерігаєш і з'являєшся раптово, як думка, на яку не чекають.`,
        howToPlay: `Говори рідко й пошепки. Коли мовчиш — дивись пильно, ніби бачиш більше.`,
        challenge: `У кожному завданні скажи хоча б одну фразу, від якої у всіх підуть мурахи.`,
        superpower: `3 рази можеш перервати завдання іншої відьми, сказавши «Темрява мовчить.»`,
      },
    },
    {
      title: 'ПІРОМАНТКА ЕМОЦІЙ',
      description: {
        who: `Жива іскра, танець вогню й сміху. Ти заражаєш усіх ентузіазмом і божевільними ідеями.`,
        howToPlay: `Додавай вогонь — жестикуляцію, гучний сміх, рух. Ти — сцена, і всі це відчувають.`,
        challenge: `Кожне завдання виконуй з експресією та полум'яною промовою.`,
        superpower: `Можеш «запалити» будь-яку відьму — дати їй +1 додатковий бал, якщо вважаєш за потрібне.`,
      },
    },
    {
      title: 'ІЛЮЗІОНІСТКА ДОЛІ',
      description: {
        who: `Артистка й маніпуляторка, що ховає жарт у пророцтві. Ти перетворюєш брехню на мистецтво.`,
        howToPlay: `Видавай будь-яку нісенітницю за давнє знання. Промовляй «Я бачила це уві сні» — і ніхто не посміє сперечатися.`,
        challenge: `У кожному раунді збреши щось переконливо й не розкривай обман.`,
        superpower: `3 рази за гру можеш замінити завдання відьми на якесь своє.`,
      },
    },
    {
      title: 'ВІДЬМА ВІТРУ Й СМІХУ',
      description: {
        who: `Весела душа, у якої навіть заклинання звучать як анекдоти. Ти приносиш легкість і шум.`,
        howToPlay: `Усе перетворюй на гру — говори римою, співай, танцюй, жартуй. Не дозволяй нікому бути надто серйозним.`,
        challenge: `У кожному завданні встав риму або каламбур.`,
        superpower: `Можеш розвіяти напругу — змусити всіх відьом розсміятися, і якщо вдалося — отримуєш додатковий бал.`,
      },
    },
    {
      title: 'ХРАНИТЕЛЬКА ТАЄМНИЦЬ',
      description: {
        who: `Та, що знає відповіді, але говорить загадками. Твоя мова — ребуси й флірт.`,
        howToPlay: `Ніколи не відповідай прямо, лише метафорами. «Доля любить тих, хто не питає.»`,
        challenge: `Раз за гру обери відьму й дай їй загадку, на яку немає правильної відповіді.`,
        superpower: `Можеш 3 рази змінити питання або завдання, промовивши: «Це знання надто небезпечне.»`,
      },
    },
    {
      title: 'ЗБИРАЛЬНИЦЯ ІСТОРІЙ',
      description: {
        who: `Хранителька чужих спогадів. Ти все перетворюєш на казку — навіть нудні події.`,
        howToPlay: `Виконуючи завдання, розповідай його як легенду. «Кажуть, тієї ночі свіча тремтіла, і хтось сказав саме це…»`,
        challenge: `Кожне завдання починай із фрази, ніби це казка або легенда.`,
        superpower: `Можеш 3 рази розповісти свою версію історії під час виступу іншої відьми. Якщо ця версія краща — отримуєш додатковий бал.`,
      },
    },
    {
      title: 'ВЛАДИЧИЦЯ ДОЛІ',
      description: {
        who: `Командирка, провидиця, та, що вирішує. Твоє слово — закон, навіть якщо воно випадкове.`,
        howToPlay: `Говори впевнено, голосно, з виглядом всезнайки. Не пояснюй — просто оголошуй.`,
        challenge: `Раз на раунд оголошуй «Закон Ковену» — кумедне або дивне правило на один хід.`,
        superpower: `Можеш один раз оголосити «Поворот Долі» — поміняти всі ролі між відьмами.`,
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
      instructionEl.textContent = 'Усі ролі розкриті';
      return;
    }
    const activeName = playerElements[activePlayerIndex]
      ?.querySelector('.roles-player__name')
      ?.textContent;
    instructionEl.textContent = activeName
      ? `Обери карту для ${activeName}`
      : 'Обери карту';
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
        // Якщо закрили без підтвердження, повернемо карту в початковий стан
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
