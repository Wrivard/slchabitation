---
name: Pièges des contrôles Radix/shadcn dans les formulaires
description: Valeur vide des Select Radix et cartes de choix radio sans labels imbriqués.
---

## Select Radix : passer `''`, jamais `undefined`

Pour afficher le placeholder d'un `Select` piloté par react-hook-form, passer la
chaîne vide (`value={field.value ?? ''}`), pas `value={field.value || undefined}`.

**Why:** `shouldShowPlaceholder` de Radix considère `''` **et** `undefined` comme
« pas de valeur », donc `''` affiche le placeholder tout en gardant le composant
contrôlé. Avec `undefined`, le composant démarre non contrôlé puis devient
contrôlé à la première sélection, ce qui déclenche l'avertissement
« … is changing from uncontrolled to controlled » de `useControllableState`.

**How to apply:** tout `Select` (ou autre primitive Radix contrôlée) branché sur
un champ dont la valeur par défaut est vide.

## Cartes de choix : pas de `label` dans un `label`

Quand chaque option d'un `RadioGroup` est une carte cliquable (`Label` +
`RadioGroupItem`), le titre du groupe ne doit pas être un `FormLabel` : ce serait
un `label` contenant d'autres `label`, et il pointerait vers le `div` du groupe,
qui n'est pas un contrôle étiquetable.

**Why:** HTML invalide et groupe sans nom programmatique fiable pour les lecteurs
d'écran.

**How to apply:** titre du groupe dans un `span` porteur d'un `id`, puis
`aria-labelledby` sur le `RadioGroup`; réserver les `Label` aux options.
