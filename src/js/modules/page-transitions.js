export function initPageTransitionLayer() {
  const transitionLayer = document.createElement('div');

  transitionLayer.className = 'page-transition';
  transitionLayer.setAttribute('aria-hidden', 'true');
  document.body.append(transitionLayer);
}


export function initPageTransitions(prefersReducedMotion) {
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
