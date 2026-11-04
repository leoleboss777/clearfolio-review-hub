import { createFileRoute, notFound } from "@tanstack/react-router";
import { Check, Clock, X, Circle } from "lucide-react";
import { PageHeader } from "@/components/kyc/client/ClientShell";
import { DocCard } from "@/components/kyc/client/DocCard";
import { Uploader } from "@/components/kyc/client/Uploader";
import { useCurrentClient } from "@/lib/kyc/hooks";
import { getCategory } from "@/lib/kyc/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/category/$category")({
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return { label: cat.label };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.label ?? "Catégorie"} — Espace client SESAME62` },
      { name: "description", content: "Justificatifs de cette catégorie et leur statut de validation." },
      { property: "og:title", content: `${loaderData?.label ?? "Catégorie"} — SESAME62` },
      { property: "og:description", content: "Justificatifs KYC par catégorie." },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = getCategory(category)!;
  const { client, documents } = useCurrentClient();
  const docs = documents.filter((d) => d.category === cat.id);

  return (
    <>
      <PageHeader
        eyebrow={cat.required ? "Catégorie obligatoire" : "Catégorie facultative"}
        title={cat.label}
        text={cat.description}
      />
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Uploader key={cat.id} clientId={client.id} fixedCategory={cat.id} />
        </div>
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <p className="text-sm font-medium">Documents acceptés</p>
          <ul className="mt-4 space-y-2">
            {cat.types.map((t) => {
              const ofType = docs.filter((d) => d.docType === t.id);
              const st = ofType.some((d) => d.status === "approved")
                ? "approved"
                : ofType.some((d) => d.status === "pending")
                  ? "pending"
                  : ofType.some((d) => d.status === "rejected")
                    ? "rejected"
                    : "none";
              const Icon = { approved: Check, pending: Clock, rejected: X, none: Circle }[st];
              const tone = {
                approved: "bg-success/15 text-success",
                pending: "bg-warning/15 text-warning",
                rejected: "bg-danger/15 text-danger",
                none: "bg-muted text-muted-foreground",
              }[st];
              return (
                <li key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-2/40 px-3 py-2.5 text-sm">
                  {t.label}
                  <span className={cn("flex size-6 items-center justify-center rounded-full", tone)}>
                    <Icon className="size-3.5" strokeWidth={3} />
                  </span>
                </li>
              );
            })}
          </ul>
          {cat.required && (
            <p className="mt-4 text-xs text-muted-foreground">
              Un document validé dans cette catégorie suffit pour compléter cette étape.
            </p>
          )}
        </div>
      </div>

      <h2 className="mt-10 text-lg font-medium">Documents transmis ({docs.length})</h2>
      {docs.length === 0 ? (
        <div className="glass mt-4 rounded-2xl p-10 text-center text-sm text-muted-foreground">
          Aucun document dans cette catégorie.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <DocCard key={d.id} doc={d} />
          ))}
        </div>
      )}
    </>
  );
}
