import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/kyc/client/ClientShell";
import { DocCard } from "@/components/kyc/client/DocCard";
import { Uploader } from "@/components/kyc/client/Uploader";
import { useCurrentClient } from "@/lib/kyc/hooks";
import type { DocStatus } from "@/lib/kyc/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/documents")({
  head: () => ({
    meta: [
      { title: "My Documents — Espace client SESAME62" },
      { name: "description", content: "Tous vos justificatifs KYC et leur statut de validation." },
      { property: "og:title", content: "My Documents — SESAME62" },
      { property: "og:description", content: "Tous vos justificatifs KYC et leur statut." },
    ],
  }),
  component: MyDocuments,
});

const FILTERS: { id: "all" | DocStatus; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

function MyDocuments() {
  const { client, documents } = useCurrentClient();
  const [filter, setFilter] = useState<"all" | DocStatus>("all");
  const list = filter === "all" ? documents : documents.filter((d) => d.status === filter);

  return (
    <>
      <PageHeader
        eyebrow="My Documents"
        title="Mes documents"
        text="Déposez un ou plusieurs justificatifs, puis suivez leur statut de validation."
      />
      <Uploader clientId={client.id} />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium">{documents.length} document(s)</h2>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {FILTERS.map((f) => {
            const n = f.id === "all" ? documents.length : documents.filter((d) => d.status === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition",
                  filter === f.id ? "bg-card text-foreground shadow" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label} <span className="ml-1 font-mono opacity-60">{n}</span>
              </button>
            );
          })}
        </div>
      </div>
      {list.length === 0 ? (
        <div className="glass mt-4 rounded-2xl p-10 text-center text-sm text-muted-foreground">Aucun document.</div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <DocCard key={d.id} doc={d} />
          ))}
        </div>
      )}
    </>
  );
}
