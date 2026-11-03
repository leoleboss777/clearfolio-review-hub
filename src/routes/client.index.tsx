import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, FileStack, X, Bell } from "lucide-react";
import { PageHeader } from "@/components/kyc/client/ClientShell";
import { DocCard } from "@/components/kyc/client/DocCard";
import { useCurrentClient } from "@/lib/kyc/hooks";
import { categoryState, clientProgress, countStatus } from "@/lib/kyc/compute";
import { CATEGORIES } from "@/lib/kyc/catalog";
import { fmtAgo } from "@/lib/kyc/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/")({
  head: () => ({
    meta: [
      { title: "Overview — Espace client KYC62" },
      { name: "description", content: "Vue d'ensemble de votre dossier KYC." },
      { property: "og:title", content: "Overview — KYC62" },
      { property: "og:description", content: "Vue d'ensemble de votre dossier KYC." },
    ],
  }),
  component: Overview,
});

const CAT_TONE = {
  approved: "bg-success/12 text-success",
  pending: "bg-warning/12 text-warning",
  rejected: "bg-danger/12 text-danger",
  missing: "bg-muted text-muted-foreground",
};
const CAT_TXT = { approved: "Validé", pending: "En vérification", rejected: "À renvoyer", missing: "À fournir" };

function Overview() {
  const { client, documents, activity } = useCurrentClient();
  const c = countStatus(documents);
  const p = clientProgress(documents);
  const decisions = activity.filter((a) => a.type === "approve" || a.type === "reject").slice(0, 4);

  const stats = [
    { label: "Total documents", value: c.total, icon: FileStack, tone: "text-electric bg-primary/12" },
    { label: "Validés", value: c.approved, icon: Check, tone: "text-success bg-success/12" },
    { label: "En attente", value: c.pending, icon: Clock, tone: "text-warning bg-warning/12" },
    { label: "Refusés", value: c.rejected, icon: X, tone: "text-danger bg-danger/12" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={`Bonjour ${client.firstName} 👋`}
        text="Voici l'état de votre dossier KYC. Transmettez vos justificatifs et suivez leur validation en temps réel."
        action={
          <Button asChild variant="electric">
            <Link to="/client/documents">
              Ajouter des documents <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="glass animate-rise rounded-2xl p-5" style={{ animationDelay: `${i * 60}ms` }}>
            <span className={cn("flex size-9 items-center justify-center rounded-xl", s.tone)}>
              <s.icon className="size-4" strokeWidth={2.5} />
            </span>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium">Progression globale du dossier KYC</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.done} catégorie(s) obligatoire(s) validée(s) sur {p.total}
              </p>
            </div>
            <p className="text-4xl font-semibold tracking-tight text-gradient">{p.pct}%</p>
          </div>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-electric-gradient shadow-glow transition-all duration-700" style={{ width: `${p.pct}%` }} />
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {CATEGORIES.filter((c) => c.required).map((cat) => {
              const st = categoryState(documents, cat.id);
              return (
                <Link
                  key={cat.id}
                  to="/client/category/$category"
                  params={{ category: cat.id }}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm transition hover:border-electric/40"
                >
                  <span>{cat.label}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", CAT_TONE[st])}>{CAT_TXT[st]}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Bell className="size-4 text-electric" /> Dernières décisions
          </p>
          <div className="mt-4 space-y-3">
            {decisions.length === 0 && <p className="text-sm text-muted-foreground">Aucune décision pour le moment.</p>}
            {decisions.map((a) => (
              <div key={a.id} className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
                    a.type === "approve" ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
                  )}
                >
                  {a.type === "approve" ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" strokeWidth={3} />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm leading-snug">{a.message}</p>
                  <p className="text-[11px] text-muted-foreground">{fmtAgo(a.at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-medium">Derniers documents ajoutés</h2>
        <Link to="/client/documents" className="text-sm text-electric hover:underline">Tout voir</Link>
      </div>
      {documents.length === 0 ? (
        <div className="glass mt-4 rounded-2xl p-10 text-center text-sm text-muted-foreground">
          Aucun document transmis pour l'instant.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.slice(0, 6).map((d) => (
            <DocCard key={d.id} doc={d} />
          ))}
        </div>
      )}
    </>
  );
}
