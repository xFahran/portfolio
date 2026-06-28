export function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!(navToggle instanceof HTMLButtonElement) || !(mainNav instanceof HTMLElement)) {
    return;
  }

  const closeMenu = () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
  };

  const toggleMenu = () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
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


export function initHeaderState() {
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

