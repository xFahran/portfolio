export function initCopyButtons() {
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

