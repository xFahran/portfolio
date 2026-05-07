const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));});}

const observer = new IntersectionObserver(
  entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);}}},
  { threshold: 0.15 });

document.querySelectorAll('.glass-card, .skill-card').forEach(element => {
  observer.observe(element);});

document.addEventListener('DOMContentLoaded', () => {
  const typewriterEl = document.getElementById('typewriter-text');
  if (!typewriterEl) {
    return;
  }
  const phrases = [
    'Développeur web et web mobile',
    'Développeur d’applications'
  ];
  let i = 0;
  let currentPhraseIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[currentPhraseIndex];
    if (!isDeleting) {
      typewriterEl.textContent = currentPhrase.slice(0, i++);
      if (i > currentPhrase.length) {
        isDeleting = true;
        i = currentPhrase.length;
        setTimeout(type, 1500);
        return;
      }
    } else {
      typewriterEl.textContent = currentPhrase.slice(0, i--);
      if (i < 0) {
        // Finished deleting, switch to next phrase
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        i = 0;}}
    const timeout = isDeleting ? 80 : 120;
    setTimeout(type, timeout);}
  type();});
