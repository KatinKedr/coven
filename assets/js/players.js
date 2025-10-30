document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.players-form');
  if (!form) {
    return;
  }

  const inputs = Array.from(form.querySelectorAll('.player-field input'));
  const errorEl = document.querySelector('.players-error');
  const continueBtn = document.getElementById('continueBtn');

  const storedNames = sessionStorage.getItem('covenPlayers');
  if (storedNames) {
    try {
      const parsed = JSON.parse(storedNames);
      if (Array.isArray(parsed)) {
        inputs.forEach((input, index) => {
          if (typeof parsed[index] === 'string') {
            input.value = parsed[index];
          }
        });
      }
    } catch (error) {
      console.warn('Не удалось загрузить сохранённые имена:', error);
    }
  }

  const MIN_PLAYERS = 2;

  const getFilledNames = () =>
    inputs
      .map((input) => input.value.trim())
      .filter((name) => name.length > 0);

  const updateButtonState = () => {
    if (!continueBtn) {
      return;
    }
    const filledCount = getFilledNames().length;
    continueBtn.disabled = filledCount < MIN_PLAYERS;
  };

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (errorEl) {
        errorEl.textContent = '';
      }
      updateButtonState();
    });
  });

  updateButtonState();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const names = getFilledNames();

    if (names.length < MIN_PLAYERS) {
      if (errorEl) {
        errorEl.textContent = 'Добавьте как минимум два имени, чтобы продолжить.';
      }
      const firstEmptyInput = inputs.find((input) => input.value.trim().length === 0);
      (firstEmptyInput ?? inputs[0]).focus();
      return;
    }

    sessionStorage.setItem('covenPlayers', JSON.stringify(names));

    if (continueBtn) {
      continueBtn.disabled = true;
      continueBtn.classList.add('is-submitting');
      continueBtn.textContent = 'Подожди…';
    }

    const target = continueBtn?.dataset?.next;
    const resolvedTarget = target ? new URL(target, window.location.href).href : null;

    window.setTimeout(() => {
      if (continueBtn) {
        continueBtn.classList.remove('is-submitting');
        continueBtn.textContent = 'Продолжить';
        continueBtn.disabled = false;
      }

      if (resolvedTarget) {
        window.location.assign(resolvedTarget);
      }
    }, 300);
  });
});
