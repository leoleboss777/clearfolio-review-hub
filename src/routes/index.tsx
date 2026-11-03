import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FolderLock,
  FileCheck2,
  ShieldCheck,
  Activity,
  Building2,
  UploadCloud,
  Check,
} from "lucide-react";
import { MarketingShell, SectionHeading } from "@/components/kyc/MarketingShell";
import { HeroIllustration } from "@/components/kyc/HeroIllustration";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KYC62 — Simplifiez la gestion de vos vérifications KYC" },
      {
        name: "description",
        content:
          "KYC62 centralise vos documents administratifs et facilite leur validation grâce à une plateforme unique pour les entreprises et leurs clients.",
      },
      { property: "og:title", content: "KYC62 — Simplifiez vos vérifications KYC" },
      {
        property: "og:description",
        content: "Collecte, organisation et validation des justificatifs KYC sur une plateforme unique.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: FolderLock,
    title: "Centralisation documentaire",
    text: "Tous les justificatifs de vos clients réunis dans un espace unique, classés par catégorie.",
  },
  {
    icon: UploadCloud,
    title: "Gestion simplifiée des justificatifs",
    text: "Glisser-déposer, dépôt multiple, formats PDF, JPG et PNG. Vos clients transmettent en quelques secondes.",
  },
  {
    icon: FileCheck2,
    title: "Validation des documents",
    text: "Vos équipes conformité approuvent ou refusent chaque pièce, avec un motif clair communiqué au client.",
  },
  {
    icon: Activity,
    title: "Suivi en temps réel",
    text: "Chaque décision est immédiatement visible côté client. Fini les relances par e-mail.",
  },
];

function Index() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid" aria-hidden />
        <div className="absolute inset-0 bg-hero" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 md:pt-28">
          <div className="animate-rise mx-auto max-w-3xl text-center">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" /> Plateforme KYC pour entreprises
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-gradient md:text-6xl">
              Simplifiez la gestion de vos vérifications KYC.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              KYC62 centralise vos documents administratifs et facilite leur validation grâce à une
              plateforme unique dédiée aux entreprises et à leurs clients.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="electric" size="lg">
                <Link to="/login">
                  Accéder à mon espace <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <Link to="/fonctionnalites">Découvrir la solution</Link>
              </Button>
            </div>
          </div>
          <div className="animate-rise mt-16" style={{ animationDelay: "0.15s" }}>
            <HeroIllustration />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeading
          eyebrow="La plateforme"
          title="Du dépôt à la validation, un seul flux."
          text="KYC62 relie vos clients et vos équipes conformité autour des mêmes dossiers."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass group rounded-2xl p-6 transition-transform hover:-translate-y-0.5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-electric ring-1 ring-primary/25">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="glass grid gap-10 overflow-hidden rounded-3xl p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">Pour les entreprises</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Une solution pensée pour les entreprises.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Un back-office dédié à vos collaborateurs : tableaux de suivi, filtres, file de
              vérification et historique complet de chaque dossier.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Espace administrateur multi-collaborateurs",
                "Motifs de refus standardisés et commentaires",
                "Journal d'activité et traçabilité des décisions",
                "Indicateurs de performance de la conformité",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex size-5 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Button asChild variant="electric" className="mt-8">
              <Link to="/solutions">
                Voir les solutions entreprises <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 self-center">
            {[
              [Building2, "Banques & fintechs"],
              [ShieldCheck, "Assurances"],
              [FolderLock, "Agences immobilières"],
              [FileCheck2, "Cabinets comptables"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Building2;
              return (
                <div key={label as string} className="rounded-2xl border border-border bg-surface-2/50 p-5">
                  <I className="size-5 text-electric" />
                  <p className="mt-6 text-sm font-medium">{label as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
