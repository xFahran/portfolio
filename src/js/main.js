import {
  initAmbientCanvas,
  initCertificatePulse,
  initCursorSpotlight,
  initHoverSparks,
  initTextScramble,
  initTypewriter
} from './modules/motion-effects.js';
import {
  initPageTransitionLayer,
  initPageTransitions
} from './modules/page-transitions.js';
import {
  initHeaderState,
  initMobileNavigation
} from './modules/navigation.js';
import {
  initRevealAnimations,
  initScrollProgress
} from './modules/scroll-effects.js';
import { initCounters } from './modules/counters.js';
import { initProjectFilters } from './modules/project-filters.js';
import { initStackSearch } from './modules/stack-search.js';
import { initCopyButtons } from './modules/clipboard.js';
import {
  initCardSpotlight,
  initInteractiveCardGroups,
  initMagneticButtons,
  initTiltCards
} from './modules/cards.js';

const getReducedMotionPreference = () => {
  if (!('matchMedia' in window)) {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const reportInitializationError = (moduleName, error) => {
  const message = error instanceof Error ? error.message : 'Erreur inconnue';
  console.error(`[Portfolio] Initialisation impossible pour ${moduleName}: ${message}`);
};

const initializeModule = ({ name, run }) => {
  try {
    run();
  } catch (error) {
    reportInitializationError(name, error);
  }
};

const initializePortfolio = () => {
  const prefersReducedMotion = getReducedMotionPreference();
  const modules = [
    { name: 'page-transition-layer', run: () => initPageTransitionLayer() },
    { name: 'ambient-canvas', run: () => initAmbientCanvas(prefersReducedMotion) },
    { name: 'cursor-spotlight', run: () => initCursorSpotlight(prefersReducedMotion) },
    { name: 'mobile-navigation', run: () => initMobileNavigation() },
    { name: 'header-state', run: () => initHeaderState() },
    { name: 'scroll-progress', run: () => initScrollProgress() },
    { name: 'reveal-animations', run: () => initRevealAnimations(prefersReducedMotion) },
    { name: 'typewriter', run: () => initTypewriter(prefersReducedMotion) },
    { name: 'text-scramble', run: () => initTextScramble(prefersReducedMotion) },
    { name: 'counters', run: () => initCounters(prefersReducedMotion) },
    { name: 'project-filters', run: () => initProjectFilters(prefersReducedMotion) },
    { name: 'stack-search', run: () => initStackSearch(prefersReducedMotion) },
    { name: 'clipboard', run: () => initCopyButtons() },
    { name: 'tilt-cards', run: () => initTiltCards(prefersReducedMotion) },
    { name: 'magnetic-buttons', run: () => initMagneticButtons(prefersReducedMotion) },
    { name: 'card-spotlight', run: () => initCardSpotlight() },
    { name: 'interactive-card-groups', run: () => initInteractiveCardGroups(prefersReducedMotion) },
    { name: 'hover-sparks', run: () => initHoverSparks(prefersReducedMotion) },
    { name: 'certificate-pulse', run: () => initCertificatePulse(prefersReducedMotion) },
    { name: 'page-transitions', run: () => initPageTransitions(prefersReducedMotion) }
  ];

  modules.forEach(initializeModule);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolio, { once: true });
} else {
  initializePortfolio();
}
