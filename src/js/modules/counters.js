export function initCounters(prefersReducedMotion) {
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

