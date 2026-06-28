export function initAmbientCanvas(prefersReducedMotion) {
  if (prefersReducedMotion) {
    return;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return;
  }

  canvas.className = 'motion-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const colors = ['37, 217, 242', '255, 184, 77', '85, 242, 154', '255, 92, 122'];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let points = [];
  let animationFrame = 0;
  let lastDrawTime = 0;

  const createPoint = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    radius: Math.random() * 1.4 + 0.8,
    color: colors[Math.floor(Math.random() * colors.length)]
  });

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pointCount = Math.min(48, Math.max(24, Math.floor((width * height) / 38000)));
    points = Array.from({ length: pointCount }, createPoint);
  };

  const draw = (currentTime = 0) => {
    if (currentTime - lastDrawTime < 34) {
      animationFrame = window.requestAnimationFrame(draw);
      return;
    }

    lastDrawTime = currentTime;
    context.clearRect(0, 0, width, height);

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];

      point.x += point.vx;
      point.y += point.vy;

      if (point.x < 0 || point.x > width) {
        point.vx *= -1;
      }

      if (point.y < 0 || point.y > height) {
        point.vy *= -1;
      }

      context.beginPath();
      context.fillStyle = `rgba(${point.color}, 0.7)`;
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fill();

      for (let otherIndex = index + 1; otherIndex < points.length; otherIndex += 1) {
        const otherPoint = points[otherIndex];
        const distanceX = point.x - otherPoint.x;
        const distanceY = point.y - otherPoint.y;
        const distance = Math.hypot(distanceX, distanceY);

        if (distance > 138) {
          continue;
        }

        const opacity = (1 - distance / 138) * 0.18;
        context.beginPath();
        context.strokeStyle = `rgba(${point.color}, ${opacity})`;
        context.lineWidth = 1;
        context.moveTo(point.x, point.y);
        context.lineTo(otherPoint.x, otherPoint.y);
        context.stroke();
      }
    }

    animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
      return;
    }

    draw();
  });
}


export function initCursorSpotlight(prefersReducedMotion) {
  const canUsePointer = window.matchMedia('(pointer: fine)').matches;

  if (prefersReducedMotion || !canUsePointer) {
    return;
  }

  const spotlight = document.createElement('div');
  let animationFrame = 0;
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  spotlight.className = 'cursor-spotlight';
  spotlight.setAttribute('aria-hidden', 'true');
  document.body.append(spotlight);

  const moveSpotlight = () => {
    spotlight.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    animationFrame = 0;
  };

  window.addEventListener('pointermove', event => {
    x = event.clientX;
    y = event.clientY;
    document.body.classList.add('has-pointer');

    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(moveSpotlight);
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    document.body.classList.remove('has-pointer');
  });
}


export function initTypewriter(prefersReducedMotion) {
  const typewriterElement = document.getElementById('typewriter-text');

  if (!(typewriterElement instanceof HTMLElement)) {
    return;
  }

  const phrases = [
    'Développeur web et applicatif',
    'Backend TypeScript / Node.js',
    'Qualité logicielle certifiée ISTQB',
    'Sécurité, tests & conception'
  ];

  if (prefersReducedMotion) {
    typewriterElement.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;
  let timeoutId = 0;

  const write = () => {
    if (document.hidden) {
      timeoutId = 0;
      return;
    }

    const currentPhrase = phrases[phraseIndex];

    typewriterElement.textContent = currentPhrase.slice(0, letterIndex);

    if (!isDeleting && letterIndex < currentPhrase.length) {
      letterIndex += 1;
      timeoutId = window.setTimeout(write, 68);
      return;
    }

    if (!isDeleting && letterIndex === currentPhrase.length) {
      isDeleting = true;
      timeoutId = window.setTimeout(write, 1250);
      return;
    }

    if (isDeleting && letterIndex > 0) {
      letterIndex -= 1;
      timeoutId = window.setTimeout(write, 34);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    timeoutId = window.setTimeout(write, 220);
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = 0;
      return;
    }

    if (!document.hidden && !timeoutId) {
      write();
    }
  });

  write();
}


export function initTextScramble(prefersReducedMotion) {
  const elements = document.querySelectorAll('[data-scramble]');

  if (prefersReducedMotion || elements.length === 0) {
    return;
  }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_';

  elements.forEach(element => {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    const originalText = element.textContent ?? '';
    const characters = originalText.split('');
    const totalFrames = 34;
    let frame = 0;

    const animate = () => {
      const output = characters.map((character, index) => {
        if (character === ' ' || character === ',' || character === '.') {
          return character;
        }

        const settleFrame = Math.floor((index / characters.length) * totalFrames) + 8;

        if (frame >= settleFrame) {
          return character;
        }

        return letters[Math.floor(Math.random() * letters.length)];
      });

      element.textContent = output.join('');
      frame += 1;

      if (frame <= totalFrames + 8) {
        window.requestAnimationFrame(animate);
        return;
      }

      element.textContent = originalText;
    };

    window.setTimeout(animate, 240);
  });
}


export function initHoverSparks(prefersReducedMotion) {
  const canUsePointer = window.matchMedia('(pointer: fine)').matches;
  const cards = document.querySelectorAll('.skill-card, .project-card');

  if (prefersReducedMotion || !canUsePointer || cards.length === 0) {
    return;
  }

  cards.forEach(card => {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    card.addEventListener('pointerenter', event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      for (let index = 0; index < 7; index += 1) {
        const spark = document.createElement('span');
        const angle = (Math.PI * 2 * index) / 7;
        const distance = 22 + Math.random() * 26;

        spark.className = 'card-spark';
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
        spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
        spark.style.setProperty('--spark-delay', `${index * 18}ms`);

        card.append(spark);
        window.setTimeout(() => spark.remove(), 760);
      }
    });
  });
}


export function initCertificatePulse(prefersReducedMotion) {
  const certificates = document.querySelectorAll('[data-cert-pulse], [data-cert-card]');

  if (certificates.length === 0) {
    return;
  }

  let activeIndex = 0;
  let intervalId = 0;

  const setActiveCertificate = () => {
    certificates.forEach((certificate, index) => {
      certificate.classList.toggle('is-active', index === activeIndex);
    });

    activeIndex = (activeIndex + 1) % certificates.length;
  };

  setActiveCertificate();

  if (!prefersReducedMotion) {
    intervalId = window.setInterval(setActiveCertificate, 1800);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && intervalId) {
        window.clearInterval(intervalId);
        intervalId = 0;
        return;
      }

      if (!document.hidden && !intervalId) {
        intervalId = window.setInterval(setActiveCertificate, 1800);
      }
    });
  }
}

