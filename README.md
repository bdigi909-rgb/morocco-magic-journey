# Morocco Magic Journey (Medina Trips)

Ce projet a été exporté depuis Lovable (projet "Morocco Magic Journey") pour permettre de continuer le développement en dehors de la plateforme, le temps de recharger les crédits Lovable.

Plateforme tout-en-un pour organiser un voyage au Maroc : hébergement, transport local, excursions, guides, circuits sur mesure, panier centralisé et tableau de bord voyage.

## Build with Lovable

Ce projet reste connecté à https://lovable.dev/projects/436948fa-2a32-4438-a5a7-45fd01129c7f — tu peux continuer à y travailler dès que les crédits sont rechargés, ou développer ici en local puis pousser via GitHub (la synchro Lovable ↔ GitHub remonte automatiquement les changements dans l'éditeur).

## Développement local

```sh
# avec bun (recommandé, gestionnaire utilisé par le projet — bun.lock non exporté, sera régénéré)
bun install
bun run dev

# ou avec npm
npm install
npm run dev
```

## ⚠️ Étapes manuelles avant de lancer le projet

Cet export automatique a récupéré tout le code métier (routes, logique panier, composants custom, config) mais **deux catégories de fichiers n'ont pas pu être extraites en texte** :

### 1. Composants shadcn/ui (`src/components/ui/*.tsx`)
Une quarantaine de composants UI standards (button, card, dialog, select, tabs, etc.) générés par shadcn/ui — non copiés ici pour gagner du temps car ce sont des fichiers boilerplate identiques à toute installation shadcn "new-york" style. À régénérer avec :

```sh
npx shadcn@latest add button card dialog select tabs badge input label \
  radio-group slider separator sonner accordion alert-dialog aspect-ratio \
  avatar breadcrumb calendar carousel chart checkbox collapsible command \
  context-menu drawer dropdown-menu form hover-card input-otp menubar \
  navigation-menu pagination popover progress resizable scroll-area \
  sidebar skeleton switch table toggle toggle-group tooltip alert
```

(La config est déjà dans `components.json` — style "new-york", base slate, alias `@/components/ui`.)

### 2. Images (`src/assets/*.jpg`)
4 images (hero-desert.jpg, riad.jpg, souk.jpg, atlas.jpg) utilisées dans `src/lib/data.ts` et les pages. Binaires, non récupérables via l'export texte. Deux options :
- Retélécharger depuis l'éditeur Lovable (Assets panel) une fois les crédits rechargés
- Remplacer par tes propres visuels Maroc (désert, riad, souk, Atlas) au même chemin

Tant que ces fichiers ne sont pas ajoutés, le projet ne compilera pas (imports cassés).

## Points d'entrée clés pour la suite du développement

- **`src/lib/trip-store.tsx`** — état global du panier (Context API + localStorage). C'est ici que la logique de paiement (Stripe/CMI) devra se brancher.
- **`src/routes/panier.tsx`** — page de checkout. Le bouton "Payer" est actuellement un mock (`confirm()` + toast) : aucun paiement réel n'est effectué. C'est le fichier à modifier pour intégrer Stripe Checkout / CMI.
- **`src/lib/data.ts`** — catalogue produits (hébergements, excursions, transport, guides, circuits clé en main). Données statiques en dur, à terme à connecter à une vraie base (Supabase envisageable, cf. connecteur Lovable disponible).
- **`src/routes/excursions.tsx`** — contient déjà un onglet "Guides" fonctionnel (ajout au panier), à enrichir si besoin (fiches guides détaillées, disponibilités, etc.)

## Stack technique

- TanStack Start (SSR) + TanStack Router (file-based routing dans `src/routes/`)
- React 19, TypeScript
- Tailwind CSS v4 + shadcn/ui (style "new-york")
- Zustand-like Context API pour l'état panier (pas de lib externe)
- i18n maison (FR/EN/ES) via `src/lib/i18n.ts`

## Prochaine feature prévue (en attente de crédits Lovable)

Intégration paiement Stripe + CMI (Maroc) dans `panier.tsx` :
- Stripe Checkout natif Lovable pour EUR/USD
- CMI via edge function backend (hash serveur, jamais de storeKey côté client) pour MAD, avec variables d'env sandbox en attendant les vraies clés marchand
- Sélecteur de méthode par défaut selon devise, option acompte/solde (déjà présente dans l'UI actuelle du panier)
