document.addEventListener('DOMContentLoaded', () => {
  const actions = document.querySelectorAll('.tarot-card__action');
  const seenLabels = new Set();

  actions.forEach((action) => {
    const label = action.textContent.trim();
    if (label && seenLabels.has(label)) {
      action.remove();
      return;
    }

    if (label) {
      seenLabels.add(label);
    }
  });
});
