import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, SectionHeading } from "@/components/kyc/MarketingShell";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — SESAME62" },
      { name: "description", content: "SESAME62, plateforme B2B de centralisation et validation des documents KYC." },
      { property: "og:title", content: "À propos — SESAME62" },
      { property: "og:description", content: "Notre mission : rendre la conformité KYC simple et transparente." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-5 py-24">
        <SectionHeading
          eyebrow="À propos"
          title="Rendre la conformité simple et transparente."
        />
        <div className="glass mt-12 space-y-5 rounded-2xl p-8 text-muted-foreground">
          <p>
            SESAME62 est née d'un constat simple : la collecte des justificatifs clients reste
            dispersée entre e-mails, pièces jointes et relances. Les équipes perdent du temps, les
            clients ne savent pas où en est leur dossier.
          </p>
          <p>
            Nous proposons une plateforme unique où vos clients déposent leurs documents et où vos
            collaborateurs les examinent, avec des statuts clairs et des décisions motivées.
          </p>
          <p className="text-sm text-muted-foreground/80">
            Cette version est un prototype de démonstration : les données sont simulées et
            conservées uniquement dans votre navigateur. SESAME62 ne réalise ici aucune vérification
            d'identité réelle et ne fournit pas de stockage sécurisé.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["5", "catégories documentaires"],
            ["16", "types de justificatifs"],
            ["2", "espaces connectés"],
          ].map(([v, l]) => (
            <div key={l} className="glass rounded-2xl p-6 text-center">
              <p className="text-3xl font-semibold text-gradient">{v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
