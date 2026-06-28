# Stratégie de test

## TC-001 - Rendu des pages principales

- Identifiant : TC-001
- Objectif : vérifier que chaque page statique se charge avec son titre principal, sa navigation et sans erreur JavaScript navigateur.
- Préconditions : dépendances installées, serveur Eleventy lancé par Playwright.
- Données d’entrée : `/index.html`, `/profil.html`, `/projets.html`, `/stack.html`, `/formations.html`, `/contact.html`.
- Étapes : ouvrir chaque URL, contrôler le `h1`, contrôler la navigation, collecter les erreurs console et `pageerror`.
- Résultat attendu : chaque page est visible, la navigation existe, aucune erreur navigateur n’est remontée.
- Priorité : haute.
- Type de test : smoke test E2E.

## TC-002 - Navigation mobile

- Identifiant : TC-002
- Objectif : vérifier que le menu mobile est accessible et pilotable au clavier.
- Préconditions : viewport mobile Playwright.
- Données d’entrée : page d’accueil.
- Étapes : ouvrir la page, cliquer sur le bouton de menu, vérifier `aria-expanded`, contrôler un lien, fermer avec `Escape`.
- Résultat attendu : le menu s’ouvre, expose son état, puis se ferme sans bloquer la navigation.
- Priorité : haute.
- Type de test : E2E accessibilité fonctionnelle.

## TC-003 - Filtres projets

- Identifiant : TC-003
- Objectif : vérifier que les filtres projets masquent uniquement les cartes non concernées.
- Préconditions : page Projets chargée.
- Données d’entrée : filtre `Backend`.
- Étapes : cliquer sur `Backend`, vérifier `aria-pressed`, compter les cartes visibles, contrôler qu’un projet desktop est masqué.
- Résultat attendu : cinq projets backend restent visibles et le filtre actif est exposé.
- Priorité : haute.
- Type de test : E2E comportemental.

## TC-004 - Recherche stack

- Identifiant : TC-004
- Objectif : vérifier que la recherche filtre les compétences de manière déterministe.
- Préconditions : page Stack chargée.
- Données d’entrée : requête `Docker`.
- Étapes : saisir la requête, compter les cartes visibles, lire le message de feedback.
- Résultat attendu : les compétences contenant Docker dans leur titre ou description restent visibles et le feedback annonce deux résultats.
- Priorité : moyenne.
- Type de test : E2E fonctionnel.

## TC-005 - Copie email

- Identifiant : TC-005
- Objectif : vérifier que l’action de copie ne provoque pas d’échec silencieux.
- Préconditions : page Contact chargée.
- Données d’entrée : bouton `Copier l'email`.
- Étapes : cliquer sur le bouton et lire la région `role=status`.
- Résultat attendu : un message de succès ou d’échec explicite est affiché.
- Priorité : moyenne.
- Type de test : E2E robustesse.

## TC-006 - Réduction des animations

- Identifiant : TC-006
- Objectif : vérifier que `prefers-reduced-motion` désactive les animations les plus coûteuses.
- Préconditions : préférence média `reduce` activée avant chargement.
- Données d’entrée : page d’accueil.
- Étapes : ouvrir la page, vérifier l’absence du canvas animé, vérifier que le texte principal reste lisible.
- Résultat attendu : aucun canvas de motion ambiant n’est créé et le contenu reste accessible.
- Priorité : haute.
- Type de test : E2E accessibilité.

## TC-007 - Largeur minimale mobile

- Identifiant : TC-007
- Objectif : vérifier que les pages restent exploitables à 320 pixels de largeur.
- Préconditions : viewport Playwright réglé sur `320x720`.
- Données d’entrée : toutes les pages principales.
- Étapes : ouvrir chaque page, contrôler le titre principal, mesurer `scrollWidth`.
- Résultat attendu : aucun débordement horizontal global n’est détecté.
- Priorité : haute.
- Type de test : E2E responsive.
