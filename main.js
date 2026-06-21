'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initPageTransitionLayer();
  initAmbientCanvas(prefersReducedMotion);
  initCursorSpotlight(prefersReducedMotion);
  initMobileNavigation();
  initHeaderState();
  initScrollProgress();
  initRevealAnimations(prefersReducedMotion);
  initTypewriter(prefersReducedMotion);
  initTextScramble(prefersReducedMotion);
  initCounters(prefersReducedMotion);
  initProjectFilters(prefersReducedMotion);
  initStackSearch(prefersReducedMotion);
  initCopyButtons();
  initTiltCards(prefersReducedMotion);
  initMagneticButtons(prefersReducedMotion);
  initCardSpotlight();
  initCertificatePulse(prefersReducedMotion);
  initPageTransitions(prefersReducedMotion);
});

function initPageTransitionLayer() {
  const transitionLayer = document.createElement('div');

  transitionLayer.className = 'page-transition';
  transitionLayer.setAttribute('aria-hidden', 'true');
  document.body.append(transitionLayer);
}

function initAmbientCanvas(prefersReducedMotion) {
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

function initCursorSpotlight(prefersReducedMotion) {
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

function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!(navToggle instanceof HTMLButtonElement) || !(mainNav instanceof HTMLElement)) {
    return;
  }

  const closeMenu = () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  };

  navToggle.addEventListener('click', event => {
    event.stopPropagation();
    toggleMenu();
  });

  mainNav.addEventListener('click', event => {
    const target = event.target;

    if (target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener('click', event => {
    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (!mainNav.contains(target) && !navToggle.contains(target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

function initHeaderState() {
  const header = document.querySelector('[data-header]');

  if (!(header instanceof HTMLElement)) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');

  if (!(progressBar instanceof HTMLElement)) {
    return;
  }

  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

    progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

function initRevealAnimations(prefersReducedMotion) {
  const elements = document.querySelectorAll('[data-reveal], .glass-card, .skill-card');

  if (elements.length === 0) {
    return;
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach(element => {
      element.classList.add('is-visible');
    });

    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -54px 0px'
    }
  );

  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 42, 340)}ms`);
    observer.observe(element);
  });
}

function initTypewriter(prefersReducedMotion) {
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

  const write = () => {
    const currentPhrase = phrases[phraseIndex];

    typewriterElement.textContent = currentPhrase.slice(0, letterIndex);

    if (!isDeleting && letterIndex < currentPhrase.length) {
      letterIndex += 1;
      window.setTimeout(write, 68);
      return;
    }

    if (!isDeleting && letterIndex === currentPhrase.length) {
      isDeleting = true;
      window.setTimeout(write, 1250);
      return;
    }

    if (isDeleting && letterIndex > 0) {
      letterIndex -= 1;
      window.setTimeout(write, 34);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    window.setTimeout(write, 220);
  };

  write();
}

function initTextScramble(prefersReducedMotion) {
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

function initCounters(prefersReducedMotion) {
  const counters = document.querySelectorAll('[data-counter]');

  if (counters.length === 0) {
    return;
  }

  const setFinalValue = element => {
    const target = Number.parseInt(element.dataset.counter ?? '0', 10);
    element.textContent = Number.isFinite(target) ? String(target) : '0';
  };

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach(setFinalValue);
    return;
  }

  const animateCounter = element => {
    const target = Number.parseInt(element.dataset.counter ?? '0', 10);

    if (!Number.isFinite(target) || target <= 0) {
      element.textContent = '0';
      return;
    }

    const duration = 950;
    const startTime = performance.now();

    const tick = currentTime => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * easedProgress);

      element.textContent = String(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        if (entry.target instanceof HTMLElement) {
          animateCounter(entry.target);
        }

        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function initProjectFilters(prefersReducedMotion) {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('[data-project-card]');

  if (filterButtons.length === 0 || projectCards.length === 0) {
    return;
  }

  const animateVisibleCard = card => {
    if (prefersReducedMotion) {
      return;
    }

    card.animate(
      [
        { opacity: 0, transform: 'translateY(14px) scale(0.98)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ],
      {
        duration: 320,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      }
    );
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const selectedFilter = button.dataset.filter ?? 'all';

      filterButtons.forEach(item => {
        item.classList.toggle('active', item === button);
      });

      projectCards.forEach(card => {
        if (!(card instanceof HTMLElement)) {
          return;
        }

        const categories = card.dataset.category ?? '';
        const shouldDisplay = selectedFilter === 'all' || categories.includes(selectedFilter);

        card.hidden = !shouldDisplay;
        card.classList.toggle('is-filtered-out', !shouldDisplay);

        if (shouldDisplay) {
          animateVisibleCard(card);
        }
      });
    });
  });
}

function initStackSearch(prefersReducedMotion) {
  const searchInput = document.getElementById('stack-search');
  const skillCards = document.querySelectorAll('[data-skill-card]');
  const feedback = document.querySelector('[data-search-feedback]');

  if (!(searchInput instanceof HTMLInputElement) || skillCards.length === 0) {
    return;
  }

  const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const revealSkill = card => {
    if (prefersReducedMotion) {
      return;
    }

    card.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      {
        duration: 240,
        easing: 'ease-out'
      }
    );
  };

  const updateSearch = () => {
    const query = normalize(searchInput.value.trim());
    let visibleCount = 0;

    skillCards.forEach(card => {
      if (!(card instanceof HTMLElement)) {
        return;
      }

      const content = normalize(card.textContent ?? '');
      const shouldDisplay = query.length === 0 || content.includes(query);
      const wasHidden = card.hidden;

      card.hidden = !shouldDisplay;

      if (shouldDisplay) {
        visibleCount += 1;

        if (wasHidden) {
          revealSkill(card);
        }
      }
    });

    if (feedback instanceof HTMLElement) {
      feedback.textContent = query.length === 0
        ? ''
        : `${visibleCount} compétence${visibleCount > 1 ? 's' : ''} trouvée${visibleCount > 1 ? 's' : ''}.`;
    }
  };

  searchInput.addEventListener('input', updateSearch);
}

function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  const toast = document.querySelector('[data-toast]');

  if (copyButtons.length === 0) {
    return;
  }

  const showToast = message => {
    if (!(toast instanceof HTMLElement)) {
      return;
    }

    toast.textContent = message;
    toast.classList.add('is-visible');

    window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2200);
  };

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const textToCopy = button.dataset.copy;

      if (!textToCopy) {
        return;
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Email copié.');
      } catch {
        showToast('Copie impossible. Sélectionne le mail manuellement.');
      }
    });
  });
}

function initTiltCards(prefersReducedMotion) {
  const cards = document.querySelectorAll('.tilt-card');

  if (prefersReducedMotion || cards.length === 0) {
    return;
  }

  cards.forEach(card => {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function initMagneticButtons(prefersReducedMotion) {
  const buttons = document.querySelectorAll('.magnetic');

  if (prefersReducedMotion || buttons.length === 0) {
    return;
  }

  buttons.forEach(button => {
    if (!(button instanceof HTMLElement)) {
      return;
    }

    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.08}px, ${y * 0.16}px)`;
    });

    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });
}

function initCardSpotlight() {
  const cards = document.querySelectorAll('.glass-card, .project-card, .skill-card, .stat-card, .value-card, .cert-card, .cert-pill');

  cards.forEach(card => {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

function initCertificatePulse(prefersReducedMotion) {
  const certificates = document.querySelectorAll('[data-cert-pulse], [data-cert-card]');

  if (certificates.length === 0) {
    return;
  }

  let activeIndex = 0;

  const setActiveCertificate = () => {
    certificates.forEach((certificate, index) => {
      certificate.classList.toggle('is-active', index === activeIndex);
    });

    activeIndex = (activeIndex + 1) % certificates.length;
  };

  setActiveCertificate();

  if (!prefersReducedMotion) {
    window.setInterval(setActiveCertificate, 1800);
  }
}

function initPageTransitions(prefersReducedMotion) {
  if (prefersReducedMotion) {
    return;
  }

  document.addEventListener('click', event => {
    const target = event.target;
    const link = target instanceof Element ? target.closest('a') : null;

    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    const isInternal = url.protocol === 'file:' || url.origin === window.location.origin;
    const isSamePage = url.pathname === window.location.pathname && url.hash === window.location.hash;

    if (!isInternal || isSamePage || link.target || link.hasAttribute('download') || url.protocol === 'mailto:') {
      return;
    }

    event.preventDefault();
    document.body.classList.add('is-leaving');

    window.setTimeout(() => {
      window.location.href = url.href;
    }, 170);
  });
}
