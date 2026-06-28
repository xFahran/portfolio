# Contribuer

## Principes

- Modifier les données dans `src/_data/` quand le contenu est répétitif.
- Modifier les composants dans `src/_includes/components/` quand le rendu est partagé.
- Ne pas ajouter de lien projet sans URL réelle.
- Ne pas ajouter de secret dans le dépôt.
- Respecter `prefers-reduced-motion` pour tout nouvel effet.

## Vérifications avant livraison

```bash
npm run lint
npm run build
npm run test
```

Pour une vérification complète :

```bash
npm run validate
```

## Nommage des tests

Les tests suivent une forme lisible proche de :

```text
GivenCondition_WhenAction_ThenExpectedResult
```

Chaque test doit avoir un objectif comportemental clair et rester déterministe.
