(function () {
  const supportsFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  const motionReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsFinePointer || motionReduced) {
    return;
  }

  if (document.querySelector('.mist-canvas')) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'mist-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  const state = {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    particles: [],
    rafId: null,
  };

  const palette = [
    { r: 62, g: 137, b: 137 }, // #3E8989
    { r: 12, g: 60, b: 74 }, // #0C3C4A
  ];

  function resize() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = state.width * state.dpr;
    canvas.height = state.height * state.dpr;
    canvas.style.width = state.width + 'px';
    canvas.style.height = state.height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(state.dpr, state.dpr);
  }

  resize();

  class MistParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 45 + Math.random() * 55;
      this.alpha = 0.45 + Math.random() * 0.25;
      this.life = 1;
      this.decay = 0.012 + Math.random() * 0.01;
      this.dx = (Math.random() - 0.5) * 0.9;
      this.dy = (Math.random() - 0.5) * 0.9;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.018;
      this.palette = palette[Math.floor(Math.random() * palette.length)];
      this.spark = Math.random() < 0.2;
      this.aspect = this.spark ? 1 : 0.65 + Math.random() * 0.2;
      this.coreAlpha = 0.7 + Math.random() * 0.2;
      this.midAlpha = 0.55 + Math.random() * 0.25;
      this.edgeAlpha = 0.25 + Math.random() * 0.2;
    }

    update() {
      this.x += this.dx;
      this.y += this.dy;
      this.rotation += this.rotationSpeed;
      this.life -= this.decay;
    }

    draw() {
      const { r, g, b } = this.palette;
      const fade = Math.max(this.life, 0);

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.filter = 'blur(14px)';
      ctx.globalAlpha = this.alpha * fade;

      const gradient = ctx.createRadialGradient(0, 0, this.size * 0.18, 0, 0, this.size);
      gradient.addColorStop(0, `rgba(219, 249, 244, ${this.coreAlpha})`); // #DBF9F4
      gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${this.midAlpha})`);
      gradient.addColorStop(0.75, `rgba(${Math.max(r - 20, 0)}, ${Math.max(g - 20, 0)}, ${Math.max(
        b - 10,
        0
      )}, ${this.edgeAlpha})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * this.aspect, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.filter = 'none';
    }

    isAlive() {
      return this.life > 0;
    }
  }

  function addParticles(x, y, count) {
    for (let i = 0; i < count; i += 1) {
      state.particles.push(new MistParticle(x, y));
    }
  }

  function render() {
    state.rafId = null;
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.globalCompositeOperation = 'lighter';

    let hasLiving = false;

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const particle = state.particles[i];
      particle.update();
      if (particle.isAlive()) {
        particle.draw();
        hasLiving = true;
      } else {
        state.particles.splice(i, 1);
      }
    }

    ctx.globalCompositeOperation = 'source-over';

    if (hasLiving) {
      state.rafId = window.requestAnimationFrame(render);
    }
  }

  function ensureAnimation() {
    if (state.rafId === null && state.particles.length > 0) {
      state.rafId = window.requestAnimationFrame(render);
    }
  }

  window.addEventListener('pointermove', (event) => {
    addParticles(event.clientX, event.clientY, 3);
    ensureAnimation();
  });

  window.addEventListener('pointerdown', (event) => {
    addParticles(event.clientX, event.clientY, 5);
    ensureAnimation();
  });

  window.addEventListener('blur', stopAnimation);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    }
  });

  window.addEventListener('resize', resize);

  function stopAnimation() {
    state.particles.length = 0;
    ctx.clearRect(0, 0, state.width, state.height);
    if (state.rafId !== null) {
      window.cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  }
})();
