export function initStackSearch(prefersReducedMotion) {
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

