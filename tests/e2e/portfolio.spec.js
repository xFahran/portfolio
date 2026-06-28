import { expect, test } from '@playwright/test';

const pages = [
  { path: '/index.html', heading: 'Je code, je teste, je sécurise.' },
  { path: '/profil.html', heading: 'Un développeur qui pense architecture, sécurité et maintenabilité.' },
  { path: '/projets.html', heading: 'Des projets concrets, pas une collection de mots-clés décoratifs.' },
  { path: '/stack.html', heading: "Les outils que j'utilise vraiment." },
  { path: '/formations.html', heading: 'Une base développement, renforcée par la qualité logicielle.' },
  { path: '/contact.html', heading: 'Discutons projet, poste ou collaboration.' }
];

const collectBrowserErrors = page => {
  const errors = [];

  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  return errors;
};

test.describe('portfolio statique', () => {
  for (const portfolioPage of pages) {
    test(`Given ${portfolioPage.path} When loaded Then it renders without browser errors`, async ({ page, isMobile }) => {
      const browserErrors = collectBrowserErrors(page);

      await page.goto(portfolioPage.path);

      await expect(page.getByRole('heading', { level: 1, name: portfolioPage.heading })).toBeVisible();
      await expect(page.locator('nav[aria-label="Navigation principale"]')).toBeAttached();

      if (isMobile) {
        await expect(page.locator('.nav-toggle')).toBeVisible();
      } else {
        await expect(page.locator('nav[aria-label="Navigation principale"]')).toBeVisible();
      }

      expect(browserErrors).toEqual([]);
    });
  }

  test('Given mobile viewport When opening navigation Then aria-expanded and links stay usable', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Le bouton mobile est masqué sur desktop.');

    await page.goto('/index.html');

    const toggle = page.locator('.nav-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('nav[aria-label="Navigation principale"]').getByRole('link', { name: 'Projets', exact: true })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('Given project filters When selecting backend Then only backend projects remain visible', async ({ page }) => {
    await page.goto('/projets.html');

    await page.getByRole('button', { name: 'Backend' }).click();

    await expect(page.getByRole('button', { name: 'Backend' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-project-card]:visible')).toHaveCount(5);
    await expect(page.getByRole('heading', { name: 'Traitement de texte simplifié' })).toBeHidden();
    await expect(page.getByRole('heading', { name: 'API d\'authentification sécurisée' })).toBeVisible();
  });

  test('Given stack search When filtering Docker Then feedback and visible skills are coherent', async ({ page }) => {
    await page.goto('/stack.html');

    await page.getByLabel('Rechercher une compétence').fill('Docker');

    await expect(page.locator('[data-skill-card]:visible')).toHaveCount(2);
    await expect(page.getByRole('heading', { name: 'Docker' })).toBeVisible();
    await expect(page.locator('[data-search-feedback]')).toContainText('2 compétences trouvées.');
  });

  test('Given contact page When copy button is clicked Then an accessible status is shown', async ({ page }) => {
    await page.goto('/contact.html');

    await page.getByRole('button', { name: "Copier l'email" }).click();

    await expect(page.locator('[data-toast]')).toContainText(/Email copié|Copie impossible/);
  });

  test('Given 320px viewport When pages load Then layout does not overflow horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });

    for (const portfolioPage of pages) {
      await page.goto(portfolioPage.path);
      await expect(page.getByRole('heading', { level: 1, name: portfolioPage.heading })).toBeVisible();

      const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(hasHorizontalOverflow).toBe(false);
    }
  });

  test('Given reduced motion preference When homepage loads Then ambient motion canvas is not created', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/index.html');

    await expect(page.locator('.motion-canvas')).toHaveCount(0);
    await expect(page.getByText('Développeur web et applicatif')).toBeVisible();
  });
});
