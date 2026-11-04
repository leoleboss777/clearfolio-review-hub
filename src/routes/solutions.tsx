import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, ListChecks, BarChart3, ArrowRight } from "lucide-react";
import { MarketingShell, SectionHeading } from "@/components/kyc/MarketingShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions entreprises — SESAME62" },
      { name: "description", content: "Un back-office de conformité pour examiner, valider ou refuser les justificatifs de vos clients." },
      { property: "og:title", content: "Solutions entreprises — SESAME62" },
      { property: "og:description", content: "Le back-office KYC pensé pour les équipes conformité." },
    ],
  }),
  component: Page,
});

const BLOCKS = [
  [Users, "Gestion des clients", "Tableau des clients, filtres par statut de dossier, recherche instantanée et fiche détaillée."],
  [ListChecks, "File de vérification", "Les documents en attente arrivent dans une file dédiée, prêts à être examinés."],
  [BarChart3, "Pilotage", "Taux de validation, volumes traités, refus et dossiers en attente en un coup d'œil."],
] as const;

function Page() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-5 py-24">
        <SectionHeading
          eyebrow="Solutions entreprises"
          title="Le back-office de vos équipes conformité."
          text="Banques, assurances, agences immobilières, cabinets : SESAME62 s'adapte à vos processus de vérification."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {BLOCKS.map(([Icon, title, text]) => (
            <div key={title} className="glass rounded-2xl p-7">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-electric">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="glass mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl p-8 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-medium">Découvrez l'espace administrateur</h3>
            <p className="mt-1 text-sm text-muted-foreground">Accès de démonstration disponible sur la page de connexion.</p>
          </div>
          <Button asChild variant="electric">
            <Link to="/login">
              Se connecter <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </MarketingShell>
  );
}
