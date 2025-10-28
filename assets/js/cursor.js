(function () {
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  if (document.querySelector('.cursor-aura')) {
    return;
  }

  const aura = document.createElement('div');
  aura.className = 'cursor-aura cursor-aura--hidden';
  const core = document.createElement('span');
  core.className = 'cursor-aura__core';
  aura.appendChild(core);
  document.body.appendChild(aura);

  let rafId = null;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let isVisible = false;

  const render = () => {
    currentX += (targetX - currentX) * 0.2;
    currentY += (targetY - currentY) * 0.2;

    aura.style.setProperty('--cursor-x', currentX.toFixed(2));
    aura.style.setProperty('--cursor-y', currentY.toFixed(2));

    rafId = window.requestAnimationFrame(render);
  };

  const ensureRender = () => {
    if (rafId === null) {
      rafId = window.requestAnimationFrame(render);
    }
  };

  const showAura = () => {
    if (!isVisible) {
      isVisible = true;
      aura.classList.remove('cursor-aura--hidden');
      aura.classList.add('cursor-aura--visible');
    }
  };

  const hideAura = () => {
    if (isVisible) {
      isVisible = false;
      aura.classList.add('cursor-aura--hidden');
      aura.classList.remove('cursor-aura--visible');
    }
    aura.style.setProperty('--cursor-scale', '1');
    aura.classList.remove('cursor-aura--active');
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!isVisible) {
      currentX = targetX;
      currentY = targetY;
      aura.style.setProperty('--cursor-x', currentX.toFixed(2));
      aura.style.setProperty('--cursor-y', currentY.toFixed(2));
    }
    showAura();
    ensureRender();
  });

  window.addEventListener('pointerdown', () => {
    aura.style.setProperty('--cursor-scale', '0.9');
    aura.classList.add('cursor-aura--active');
  });

  window.addEventListener('pointerup', () => {
    aura.style.setProperty('--cursor-scale', '1');
    aura.classList.remove('cursor-aura--active');
  });

  window.addEventListener('pointercancel', () => {
    aura.style.setProperty('--cursor-scale', '1');
    aura.classList.remove('cursor-aura--active');
  });

  window.addEventListener('pointerleave', hideAura);
  window.addEventListener('blur', hideAura);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      hideAura();
    }
  });
})();
