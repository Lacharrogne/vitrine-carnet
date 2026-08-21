# Les Carnets — Site vitrine de l'écosystème

Site vitrine **autonome** qui présente **tout l'écosystème « Carnet »**
(Carnet de recettes, Carnet de budget, Carnet de sport… et bientôt un Hub),
convainc le visiteur et le dirige vers le carnet dont il a besoin.

C'est un projet **indépendant** : il a sa propre configuration, ses propres
dépendances et son propre build. Il peut être déployé sur son propre nom de
domaine (ex. `www.les-carnets.fr`), tandis que chaque application vit ailleurs
(ex. `carnet-de-budget.vercel.app`).

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (mêmes tokens « papier premium » que les applications)
- lucide-react (icônes)

Aucune dépendance à Supabase ou à un backend : c'est une page 100 % statique.

## Démarrer en local

```bash
cd vitrine-carnet
npm install
npm run dev
```

Puis ouvrir l'URL affichée (par défaut http://localhost:5173).

## Construire pour la production

```bash
npm run build      # génère le dossier dist/
npm run preview    # prévisualise le build
```

Le dossier `dist/` est un site statique : déployable tel quel sur **Vercel**,
**Netlify**, **GitHub Pages**, **Cloudflare Pages**, OVH, etc.

## ⚙️ Configuration — le seul fichier à modifier

Tout est centralisé dans **`src/config.ts`**, autour du tableau `CARNETS` :
chaque carnet de l'écosystème y est décrit.

| Clé (par carnet) | Rôle                                                       |
| ---------------- | ---------------------------------------------------------- |
| `name` / `tagline` / `description` | Le nom et la promesse du carnet        |
| `emoji` / `accent` | Visuel et couleur d'accent (`terracotta`, `sage`, `azure`, `honey`) |
| `status`         | `'live'` (en ligne) ou `'soon'` (bientôt)                  |
| `url`            | Adresse de l'application (ou `null` si pas en ligne)       |
| `signupUrl`      | Page d'inscription du carnet (souvent `<url>/auth`)        |
| `highlights`     | 3 points forts affichés sur la carte                       |

Autres réglages : `BRAND` (nom de l'écosystème), `LINKS` (contact + pages
légales) et `PRICING` (prix affichés). Les CTA principaux de la page renvoient
vers la section **« Les carnets »** (`#carnets`), d'où le visiteur choisit et
ouvre l'application voulue.

### Ajouter ou activer un carnet

1. Ajoute (ou complète) une entrée dans `CARNETS`.
2. Passe `status` à `'live'` et renseigne `url` / `signupUrl` une fois déployé.
3. C'est tout : la carte, l'aperçu du hero et les liens du pied de page se
   mettent à jour automatiquement.

## Structure

```
vitrine-carnet/
├── index.html              # SEO / Open Graph / polices
├── src/
│   ├── config.ts           # 👈 carnets, liens & tarifs (à éditer)
│   ├── index.css           # tokens de design (papier premium + accents)
│   ├── App.tsx             # assemblage des sections
│   └── components/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── ProblemSolution.tsx
│       ├── Carnets.tsx          # 👈 vitrine de l'écosystème (depuis config)
│       ├── Features.tsx
│       ├── Benefits.tsx
│       ├── HowItWorks.tsx
│       ├── Testimonials.tsx     # ⚠️ avis d'exemple à remplacer
│       ├── Pricing.tsx
│       ├── Faq.tsx
│       ├── FinalCta.tsx
│       └── Footer.tsx
└── public/                 # logo + favicon
```

## À personnaliser avant la mise en ligne

1. **`src/config.ts`** : vérifier les URLs des carnets, les statuts et l'email
   de contact.
2. **`Testimonials.tsx`** : remplacer les témoignages d'exemple par de vrais avis.
3. Pages légales (Confidentialité, CGU, Mentions) : créer les pages ou pointer
   les liens vers les bonnes adresses.
