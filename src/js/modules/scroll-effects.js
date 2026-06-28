export function initScrollProgress() {
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


export function initRevealAnimations(prefersReducedMotion) {
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

