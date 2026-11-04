import { createFileRoute, Link } from "@tanstack/react-router";
import { UploadCloud, Layers, BadgeCheck, MessageSquareWarning, BellRing, History, ArrowRight } from "lucide-react";
import { MarketingShell, SectionHeading } from "@/components/kyc/MarketingShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/fonctionnalites")({
  head: () => ({
    meta: [
      { title: "Fonctionnalités — SESAME62" },
      { name: "description", content: "Dépôt de justificatifs, classement par catégorie, validation et suivi des documents KYC." },
      { property: "og:title", content: "Fonctionnalités — SESAME62" },
      { property: "og:description", content: "Toutes les fonctionnalités de la plateforme SESAME62." },
    ],
  }),
  component: Page,
});

const ITEMS = [
  [UploadCloud, "Dépôt par glisser-déposer", "Plusieurs fichiers à la fois, en PDF, JPG, JPEG ou PNG."],
  [Layers, "Catégories documentaires", "Identité, professionnel, financier, personnel et autres documents."],
  [BadgeCheck, "Validation en un clic", "Approbation horodatée et attribuée au collaborateur."],
  [MessageSquareWarning, "Motifs de refus", "Motifs prédéfinis et commentaire personnalisé visible par le client."],
  [BellRing, "Statuts synchronisés", "Pending, Approved, Rejected : le client voit chaque décision."],
  [History, "Historique complet", "Journal d'activité et chronologie de chaque dossier client."],
] as const;

function Page() {
  return (
    <MarketingShell>
      <section className="relative">
        <div className="absolute inset-0 bg-hero" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-24">
          <SectionHeading
            eyebrow="Fonctionnalités"
            title="Tout ce qu'il faut pour vos dossiers KYC."
            text="Une expérience moderne pour vos clients, un outil de travail rigoureux pour vos équipes."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.map(([Icon, title, text]) => (
              <div key={title} className="glass rounded-2xl p-6">
                <Icon className="size-5 text-electric" />
                <h3 className="mt-4 font-medium">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="electric" size="lg">
              <Link to="/login">
                Essayer la démo <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
