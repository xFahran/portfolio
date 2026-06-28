export function initProjectFilters(prefersReducedMotion) {
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
        const isActive = item === button;

        item.classList.toggle('active', isActive);

        if (item instanceof HTMLButtonElement) {
          item.setAttribute('aria-pressed', String(isActive));
        }
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

