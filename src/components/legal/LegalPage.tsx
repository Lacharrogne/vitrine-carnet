import type { ReactNode } from 'react'

import { BRAND, LINKS } from '../../config'

export type LegalKind = 'cgu' | 'confidentialite' | 'mentions-legales'

const LAST_UPDATE = '26 juillet 2026'

/** Petit bloc de section avec titre, pour un rendu homogène. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="font-display text-xl font-black text-espresso">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-cacao/85">
        {children}
      </div>
    </section>
  )
}

/** Marqueur pour les informations que l'éditeur doit renseigner lui-même. */
function Todo({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-terracotta/10 px-1.5 py-0.5 font-bold text-terracotta">
      [{children}]
    </span>
  )
}

const META: Record<LegalKind, { title: string; intro: string }> = {
  cgu: {
    title: "Conditions générales d'utilisation",
    intro:
      "Les présentes conditions régissent l'utilisation de la suite « Les Carnets » et de ses applications. En créant un compte, vous les acceptez.",
  },
  confidentialite: {
    title: 'Politique de confidentialité',
    intro:
      "Cette politique explique quelles données personnelles nous collectons, pourquoi, et quels sont vos droits (RGPD).",
  },
  'mentions-legales': {
    title: 'Mentions légales',
    intro:
      "Informations légales relatives à l'éditeur et à l'hébergement du site et des applications « Les Carnets ».",
  },
}

function CguBody() {
  return (
    <>
      <Section title="1. Objet">
        <p>
          « Les Carnets » est un écosystème d'applications web (le « Service »)
          comprenant le Carnet de recettes, le Carnet de budget et le Carnet de
          sport, accessibles depuis <strong>lescarnets.app</strong> et ses
          sous-domaines. Un compte unique et un abonnement unique donnent accès
          aux carnets souscrits, via une authentification partagée (SSO).
        </p>
      </Section>

      <Section title="2. Compte">
        <p>
          L'accès au Service nécessite la création d'un compte avec une adresse
          e-mail valide. Vous êtes responsable de la confidentialité de vos
          identifiants et de toute activité réalisée depuis votre compte. Le
          Service est réservé aux personnes âgées d'au moins 15 ans.
        </p>
      </Section>

      <Section title="3. Essai gratuit et abonnement">
        <p>
          Le Service est proposé avec un <strong>essai gratuit de 14 jours</strong>{' '}
          donnant accès à toutes les fonctionnalités, sans carte bancaire. À
          l'issue de l'essai, la poursuite de l'utilisation nécessite un
          abonnement (par carnet ou global, mensuel ou annuel), aux tarifs
          affichés sur la page Tarifs.
        </p>
        <p>
          Le paiement, la facturation et la gestion de l'abonnement sont opérés
          par <strong>Lemon Squeezy</strong> (Lemon Squeezy, LLC), agissant en
          qualité de <strong>Merchant of Record</strong> (revendeur officiel).
          Les conditions générales de vente, la politique de facturation et la
          politique de remboursement de Lemon Squeezy s'appliquent à la
          transaction d'achat. L'abonnement se renouvelle automatiquement à
          échéance jusqu'à résiliation.
        </p>
      </Section>

      <Section title="4. Résiliation">
        <p>
          Vous pouvez résilier votre abonnement à tout moment depuis votre
          espace client (portail Lemon Squeezy). La résiliation prend effet à la
          fin de la période déjà payée : vous conservez l'accès jusqu'à cette
          date, sans nouveau prélèvement ensuite. Aucun remboursement au prorata
          n'est dû pour la période en cours, sauf disposition légale contraire.
        </p>
      </Section>

      <Section title="5. Droit de rétractation">
        <p>
          Le Service étant un contenu numérique fourni immédiatement, vous
          reconnaissez, en démarrant l'accès, renoncer à votre droit de
          rétractation de 14 jours conformément à l'article L221-28 du Code de
          la consommation. Cette information vous est rappelée au moment du
          paiement.
        </p>
      </Section>

      <Section title="6. Utilisation acceptable">
        <p>
          Vous vous engagez à ne pas détourner le Service de sa finalité,
          notamment à ne pas tenter d'y accéder de façon non autorisée, de le
          revendre, d'en extraire massivement les données, ou de perturber son
          fonctionnement. Le contenu que vous saisissez (recettes, données de
          budget, séances) vous appartient et relève de votre responsabilité.
        </p>
      </Section>

      <Section title="7. Disponibilité et responsabilité">
        <p>
          Le Service est fourni « en l'état ». Nous mettons tout en œuvre pour
          en assurer la disponibilité mais ne garantissons pas une absence
          totale d'interruption. Notre responsabilité ne saurait être engagée
          pour les dommages indirects résultant de l'utilisation ou de
          l'impossibilité d'utiliser le Service. Il vous appartient de conserver
          une copie de vos données importantes.
        </p>
      </Section>

      <Section title="8. Propriété intellectuelle">
        <p>
          La marque « Les Carnets », les logos, l'interface et le code du
          Service sont protégés. Aucun droit de propriété intellectuelle ne vous
          est cédé au titre de l'abonnement, hormis un droit d'usage personnel
          et non exclusif.
        </p>
      </Section>

      <Section title="9. Modification des conditions">
        <p>
          Ces conditions peuvent évoluer. En cas de modification substantielle,
          vous en serez informé. La poursuite de l'utilisation vaut acceptation
          des conditions mises à jour.
        </p>
      </Section>

      <Section title="10. Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit français. En cas de
          litige, une solution amiable sera recherchée avant toute action
          judiciaire. Vous pouvez également recourir à la plateforme européenne
          de règlement en ligne des litiges.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          Pour toute question :{' '}
          <a
            href={`mailto:${LINKS.CONTACT_EMAIL}`}
            className="font-bold text-terracotta"
          >
            {LINKS.CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </>
  )
}

function ConfidentialiteBody() {
  return (
    <>
      <Section title="1. Responsable du traitement">
        <p>
          Le responsable du traitement des données est l'éditeur du Service :{' '}
          <Todo>NOM OU RAISON SOCIALE</Todo>, joignable à{' '}
          <a
            href={`mailto:${LINKS.CONTACT_EMAIL}`}
            className="font-bold text-terracotta"
          >
            {LINKS.CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="2. Données collectées">
        <p>Nous collectons uniquement les données nécessaires au Service :</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Compte</strong> : adresse e-mail et données
            d'authentification.
          </li>
          <li>
            <strong>Abonnement</strong> : statut, formule, dates de
            renouvellement (les données de paiement — carte bancaire — ne
            transitent jamais par nous : elles sont traitées par Lemon Squeezy).
          </li>
          <li>
            <strong>Contenu des carnets</strong> : les informations que vous
            saisissez vous-même (recettes, opérations de budget, séances de
            sport, poids, etc.).
          </li>
          <li>
            <strong>Données techniques</strong> : cookie de session nécessaire à
            la connexion.
          </li>
        </ul>
      </Section>

      <Section title="3. Finalités et base légale">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Fournir et sécuriser le Service, gérer votre compte —{' '}
            <em>exécution du contrat</em>.
          </li>
          <li>
            Gérer l'abonnement et la facturation —{' '}
            <em>exécution du contrat et obligation légale</em>.
          </li>
          <li>
            Répondre à vos demandes de support —{' '}
            <em>intérêt légitime</em>.
          </li>
        </ul>
        <p>
          Nous n'utilisons pas vos données à des fins publicitaires et ne les
          vendons jamais.
        </p>
      </Section>

      <Section title="4. Sous-traitants et hébergement">
        <p>Nous faisons appel à des prestataires techniques :</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Supabase</strong> (base de données et authentification) —
            stockage de vos données de compte et de vos carnets.
          </li>
          <li>
            <strong>Vercel</strong> (hébergement des sites et applications).
          </li>
          <li>
            <strong>Lemon Squeezy</strong> (paiement et facturation, Merchant of
            Record).
          </li>
        </ul>
        <p>
          Certains prestataires étant situés hors de l'Union européenne, les
          transferts sont encadrés par des garanties appropriées (clauses
          contractuelles types).
        </p>
      </Section>

      <Section title="5. Durée de conservation">
        <p>
          Vos données sont conservées tant que votre compte est actif. Après
          suppression du compte, elles sont effacées sous 30 jours, hormis les
          données que la loi impose de conserver (par exemple les documents
          comptables et de facturation).
        </p>
      </Section>

      <Section title="6. Vos droits">
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de
          rectification, d'effacement, de portabilité et d'opposition sur vos
          données. Vous pouvez les exercer à tout moment en écrivant à{' '}
          <a
            href={`mailto:${LINKS.CONTACT_EMAIL}`}
            className="font-bold text-terracotta"
          >
            {LINKS.CONTACT_EMAIL}
          </a>
          . Vous pouvez également introduire une réclamation auprès de la CNIL
          (cnil.fr).
        </p>
      </Section>

      <Section title="7. Cookies">
        <p>
          Le Service utilise uniquement un <strong>cookie de session</strong>{' '}
          strictement nécessaire à votre connexion. Aucun cookie publicitaire ou
          de traçage tiers n'est déposé. Un cookie strictement nécessaire ne
          requiert pas de consentement préalable.
        </p>
      </Section>
    </>
  )
}

function MentionsBody() {
  return (
    <>
      <Section title="Éditeur">
        <ul className="list-none space-y-1.5">
          <li>
            <strong>Éditeur :</strong> <Todo>NOM OU RAISON SOCIALE</Todo>
          </li>
          <li>
            <strong>Statut :</strong>{' '}
            <Todo>ex. entrepreneur individuel / micro-entreprise</Todo>
          </li>
          <li>
            <strong>SIRET :</strong> <Todo>NUMÉRO SIRET</Todo>
          </li>
          <li>
            <strong>Adresse :</strong> <Todo>ADRESSE POSTALE</Todo>
          </li>
          <li>
            <strong>Contact :</strong>{' '}
            <a
              href={`mailto:${LINKS.CONTACT_EMAIL}`}
              className="font-bold text-terracotta"
            >
              {LINKS.CONTACT_EMAIL}
            </a>
          </li>
          <li>
            <strong>Directeur de la publication :</strong>{' '}
            <Todo>NOM DU DIRECTEUR DE PUBLICATION</Todo>
          </li>
        </ul>
      </Section>

      <Section title="Hébergement du site et des applications">
        <p>
          <strong>Vercel Inc.</strong> — 340 S Lemon Ave #4133, Walnut, CA
          91789, États-Unis — vercel.com
        </p>
      </Section>

      <Section title="Hébergement des données">
        <p>
          <strong>Supabase, Inc.</strong> — base de données et authentification
          — supabase.com. Région d'hébergement des données :{' '}
          <Todo>ex. Europe (UE)</Todo>.
        </p>
      </Section>

      <Section title="Paiement">
        <p>
          Le paiement et la facturation sont opérés par{' '}
          <strong>Lemon Squeezy, LLC</strong> (Merchant of Record) —
          lemonsqueezy.com. Lemon Squeezy émet les factures et gère la TVA au
          nom de l'éditeur.
        </p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>
          L'ensemble des contenus du site (marque « Les Carnets », logos,
          textes, interface) est protégé. Toute reproduction sans autorisation
          est interdite.
        </p>
      </Section>
    </>
  )
}

export default function LegalPage({ kind }: { kind: LegalKind }) {
  const meta = META[kind]

  return (
    <div className="paper-grain min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <a
          href="#top"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-hazel transition hover:text-terracotta"
        >
          ← Retour au site
        </a>

        <div className="mt-6 flex items-center gap-3">
          <img
            src={BRAND.logo}
            alt={BRAND.name}
            className="h-10 w-10 object-contain"
          />
          <p className="font-display font-black text-espresso">{BRAND.name}</p>
        </div>

        <h1 className="mt-6 font-display text-3xl font-black text-espresso">
          {meta.title}
        </h1>
        <p className="mt-2 text-sm text-hazel">
          Dernière mise à jour : {LAST_UPDATE}
        </p>
        <p className="mt-4 text-sm leading-7 text-cacao/85">{meta.intro}</p>

        {kind === 'cgu' && <CguBody />}
        {kind === 'confidentialite' && <ConfidentialiteBody />}
        {kind === 'mentions-legales' && <MentionsBody />}

        <div className="mt-12 border-t border-bark/70 pt-6">
          <a
            href="#top"
            className="text-sm font-bold text-hazel transition hover:text-terracotta"
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  )
}
