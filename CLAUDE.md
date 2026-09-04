# Instructions de travail — Vitrine & Hub « Les Carnets » 📔

Ce fichier est lu automatiquement au début de chaque session. Il contient les
règles à respecter dans ce dépôt.

Ce dépôt est le **centre de l'écosystème** : vitrine marketing, Hub
d'abonnement, console d'administration, **et les migrations SQL centrales** de
tous les carnets. Lire **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** avant toute
intervention.

---

## ⚠️ Règle n°1 — tenir la main courante

**Tout changement doit être consigné dans `CHANGELOG.md`, dans le même commit
que le changement lui-même.** Jamais après coup, jamais « plus tard ».

Cette main courante est la mémoire du projet : une session future (assistant ou
humain) n'aura pas le contexte de celle qui a fait le changement. Le message de
commit dit *ce qui* a changé ; le CHANGELOG dit *pourquoi*, et ce que ça
implique.

Format d'une entrée — ajouter en **haut** du fichier, sous la date du jour :

```markdown
## AAAA-MM-JJ

### Titre court de la modification (#numéro de PR)

- **Ce qui change** : la modification, en une ou deux phrases concrètes.
- **Pourquoi** : le problème constaté, ou la demande à l'origine.
- **À savoir** : conséquence, limite connue, ou piège à éviter ensuite.
  *(ligne facultative, mais précieuse)*
```

Règles d'écriture : en français, du point de vue de l'utilisateur quand c'est
possible, et **sans jamais mentionner un nom de modèle d'IA**.

> Un changement au **socle** (migrations SQL, modèle d'abonnement, prix) doit en
> plus être répercuté dans `ARCHITECTURE.md`, qui décrit l'état durable et non
> le journal.

---

## Garde-fous de ce dépôt

- **Les prix vivent ici, et nulle part ailleurs** : `src/config.ts` (`PRICING`)
  est la source de vérité unique — 3,99 €/mois la suite, 2,49 €/mois le carnet
  seul. Les carnets n'en définissent aucun et redirigent vers le Hub.
- **Migrations SQL** : numérotées et **jamais modifiées après coup** — en ajouter
  une nouvelle. Elles s'appliquent au projet Supabase partagé par les 4 apps :
  une erreur ici casse tout l'écosystème.
- **Sécurité** : toute nouvelle table doit avoir sa **RLS** activée et ses
  politiques. Ne jamais exposer de clé `service_role` côté client.
- **Aucun dialogue natif** : zéro `window.confirm` / `prompt` / `alert`.
- **Grilles mobiles** : colonnes définies (`grid-cols-1`…), jamais un `grid` nu.
- **PWA** : `beforeinstallprompt` se capte au chargement du module
  (`src/lib/installPrompt.ts`), jamais dans un `useEffect`.
- **Ne jamais demander ni manipuler** : clé API ou secret de webhook Lemon
  Squeezy, clé `service_role` ou mot de passe de la base Supabase.

---

## Méthode de travail

1. Développer sur une branche, jamais directement sur `main`.
2. **Vérifier que ça compile** avant de proposer quoi que ce soit :
   ```bash
   VITE_SUPABASE_URL="https://demo.supabase.co" VITE_SUPABASE_ANON_KEY="demo" npm run build
   ```
3. Mettre à jour `CHANGELOG.md` **dans le même commit**.
4. Ouvrir une PR, puis **vérifier chaque merge un par un** (ne pas supposer
   qu'un lot de PR est passé — cette erreur a déjà été commise).

## État connu

Les problèmes identifiés et non encore corrigés sont suivis dans le tableau de
bord d'audit **[#10](https://github.com/Lacharrogne/vitrine-carnet/issues/10)**,
qui renvoie vers un ticket par dépôt.

Consulter les issues ouvertes avant de proposer des améliorations : le socle
(SSO, paiement Lemon Squeezy, entitlement, pages légales) est **déjà construit
et en production**. Ne pas le proposer comme « à faire ».
