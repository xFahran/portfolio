'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initMobileNavigation();
  initHeaderState();
  initScrollProgress();
  initRevealAnimations(prefersReducedMotion);
  initTypewriter(prefersReducedMotion);
  initCounters(prefersReducedMotion);
  initProjectFilters();
  initStackSearch();
  initCopyButtons();
  initTiltCards(prefersReducedMotion);
  initMagneticButtons(prefersReducedMotion);
});

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
      threshold: 0.16,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 320)}ms`);
    observer.observe(element);
  });
}

function initTypewriter(prefersReducedMotion) {
  const typewriterElement = document.getElementById('typewriter-text');

  if (!(typewriterElement instanceof HTMLElement)) {
    return;
  }

  const phrases = [
    'Développeur web et web mobile',
    'Développeur d’applications',
    'Backend TypeScript / Node.js',
    'Qualité logicielle & sécurité'
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
      window.setTimeout(write, 72);
      return;
    }

    if (!isDeleting && letterIndex === currentPhrase.length) {
      isDeleting = true;
      window.setTimeout(write, 1300);
      return;
    }

    if (isDeleting && letterIndex > 0) {
      letterIndex -= 1;
      window.setTimeout(write, 36);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    window.setTimeout(write, 240);
  };

  write();
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

    const duration = 900;
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

function initProjectFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('[data-project-card]');

  if (filterButtons.length === 0 || projectCards.length === 0) {
    return;
  }

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
      });
    });
  });
}

function initStackSearch() {
  const searchInput = document.getElementById('stack-search');
  const skillCards = document.querySelectorAll('[data-skill-card]');
  const feedback = document.querySelector('[data-search-feedback]');

  if (!(searchInput instanceof HTMLInputElement) || skillCards.length === 0) {
    return;
  }

  const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const updateSearch = () => {
    const query = normalize(searchInput.value.trim());
    let visibleCount = 0;

    skillCards.forEach(card => {
      if (!(card instanceof HTMLElement)) {
        return;
      }

      const content = normalize(card.textContent ?? '');
      const shouldDisplay = query.length === 0 || content.includes(query);

      card.hidden = !shouldDisplay;

      if (shouldDisplay) {
        visibleCount += 1;
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

      const rotateX = ((y / rect.height) - 0.5) * -7;
      const rotateY = ((x / rect.width) - 0.5) * 7;

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