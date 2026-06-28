export function initTiltCards(prefersReducedMotion) {
  const cards = document.querySelectorAll('.tilt-card, .skill-card');

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


export function initMagneticButtons(prefersReducedMotion) {
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


export function initCardSpotlight() {
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


export function initInteractiveCardGroups(prefersReducedMotion) {
  if (prefersReducedMotion) {
    return;
  }

  const groups = [
    { container: '.stack-grid', item: '.skill-card' },
    { container: '.project-grid', item: '.project-card' }
  ];

  groups.forEach(group => {
    const container = document.querySelector(group.container);

    if (!(container instanceof HTMLElement)) {
      return;
    }

    const cards = [...container.querySelectorAll(group.item)].filter(card => card instanceof HTMLElement);

    if (cards.length === 0) {
      return;
    }

    const clearActiveCard = () => {
      cards.forEach(card => {
        card.classList.remove('is-focused', 'is-muted');
      });
    };

    const setActiveCard = activeCard => {
      cards.forEach(card => {
        const isActive = card === activeCard;

        card.classList.toggle('is-focused', isActive);
        card.classList.toggle('is-muted', !isActive && !card.hidden);
      });
    };

    cards.forEach(card => {
      card.tabIndex = 0;

      card.addEventListener('pointerenter', () => {
        setActiveCard(card);
      });

      card.addEventListener('focus', () => {
        setActiveCard(card);
      });

      card.addEventListener('blur', () => {
        window.setTimeout(() => {
          if (!container.contains(document.activeElement)) {
            clearActiveCard();
          }
        }, 0);
      });
    });

    container.addEventListener('pointerleave', clearActiveCard);
  });
}

