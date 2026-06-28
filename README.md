# Portfolio Fahran Gérondal
Portfolio en ligne : https://xfahran.github.io/portfolio/

Portfolio professionnel statique en HTML, CSS et JavaScript vanilla, généré avec Eleventy pour éviter la duplication des pages tout en restant compatible GitHub Pages.

## Architecture

```text
src/
  _data/                  Données structurées : navigation, projets, stack, certifications
  _includes/
    components/           Cartes et header réutilisables
    layouts/base.njk      Layout HTML commun
  assets/                 Images et icônes statiques
  css/                    CSS découpé par responsabilité
  js/
    main.js               Orchestrateur d'initialisation
    modules/              Effets, navigation, filtres, recherche, cartes, clipboard
  *.njk                   Pages sources
tests/
  e2e/                    Tests Playwright
  documentation/          Stratégie de test
```

La sortie générée est `_site/`. Elle n’est pas versionnée.

## Commandes

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
npm run validate
```

Le serveur local Eleventy est lancé par défaut sur un port disponible. Les tests Playwright démarrent leur propre serveur sur `http://127.0.0.1:4317`.

## Déploiement GitHub Pages

Le workflow `.github/workflows/pages.yml` construit le site, applique le `pathPrefix` du dépôt GitHub et publie `_site/` via GitHub Pages.

Dans les paramètres du dépôt GitHub, utiliser GitHub Pages avec la source `GitHub Actions`.

## Données projets

Les cartes projets sont générées depuis `src/_data/projects.json`.

Les champs `repositoryUrl`, `demoUrl`, `image` et `imageAlt` restent à `null` tant qu’aucune information réelle n’est fournie. L’interface ne rend pas de bouton vide ou trompeur.

## TODO

- Ajouter les URLs réelles des dépôts GitHub lorsque les repositories publics sont disponibles.
- Ajouter les URLs de démonstration uniquement pour les projets réellement déployés.
- Ajouter de vraies captures d’écran projet avec un texte alternatif précis.
- Compléter les champs `context`, `difficulties`, `technicalDecisions` et `tests` lorsqu’ils sont documentés.
- Surveiller l’audit npm : Eleventy `3.1.6` dépend de `gray-matter/js-yaml`, signalé en vulnérabilité modérée sans correctif disponible au moment de cette refonte. La dépendance est utilisée au build, pas livrée côté navigateur.

## Qualité

- JavaScript découpé en modules ES natifs.
- CSS découpé en tokens, base, layout, composants, pages, animations et responsive.
- `prefers-reduced-motion` respecté.
- Filtres projets et recherche stack couverts par Playwright.
- Navigation mobile testée avec état `aria-expanded`.
- Bouton de copie testé avec région de statut accessible.
