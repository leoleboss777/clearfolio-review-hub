import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useKycState } from "@/lib/kyc/store";
import { CATEGORIES, docTypeLabel, getCategory } from "@/lib/kyc/catalog";
import { fmtShort } from "@/lib/kyc/format";
import type { DocStatus } from "@/lib/kyc/types";
import { StatusBadge } from "../StatusBadge";
import { FileIcon } from "../FileIcon";
import { Panel, adminSelect } from "./AdminShell";
import { Button } from "@/components/ui/button";

export function DocumentsTable({ presetStatus }: { presetStatus?: DocStatus }) {
  const { documents, clients } = useKycState();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState<string>(presetStatus ?? "all");

  const rows = useMemo(() => {
    const byId = new Map(clients.map((c) => [c.id, c]));
    const s = q.trim().toLowerCase();
    return documents
      .map((d) => ({ d, c: byId.get(d.clientId)! }))
      .filter(({ d, c }) => (presetStatus ? d.status === presetStatus : status === "all" || d.status === status))
      .filter(({ d }) => cat === "all" || d.category === cat)
      .filter(
        ({ d, c }) =>
          !s ||
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(s) ||
          d.fileName.toLowerCase().includes(s) ||
          c.ref.toLowerCase().includes(s),
      )
      .sort((a, b) =>
        presetStatus === "pending"
          ? a.d.uploadedAt.localeCompare(b.d.uploadedAt)
          : b.d.uploadedAt.localeCompare(a.d.uploadedAt),
      );
  }, [documents, clients, q, cat, status, presetStatus]);

  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un client, un fichier, un identifiant…"
            className={adminSelect + " w-full pl-8"}
          />
        </div>
        <select className={adminSelect} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Catégorie">
          <option value="all">Toutes catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        {!presetStatus && (
          <select className={adminSelect} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Statut">
            <option value="all">Tous statuts</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{rows.length} résultat(s)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b bg-muted text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Client</th>
              <th className="px-4 py-2.5">Type de document</th>
              <th className="px-4 py-2.5">Fichier</th>
              <th className="px-4 py-2.5">Transmis le</th>
              <th className="px-4 py-2.5">Statut</th>
              <th className="px-4 py-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Aucun document ne correspond aux filtres.
                </td>
              </tr>
            )}
            {rows.map(({ d, c }) => (
              <tr
                key={d.id}
                onClick={() => navigate({ to: "/admin/documents/$docId", params: { docId: d.id } })}
                className="cursor-pointer border-b last:border-0 hover:bg-accent/60"
              >
                <td className="px-4 py-2.5">
                  <p className="font-medium">{c.lastName.toUpperCase()} {c.firstName}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{c.ref}</p>
                </td>
                <td className="px-4 py-2.5">
                  <p>{docTypeLabel(d.docType)}</p>
                  <p className="text-[11px] text-muted-foreground">{getCategory(d.category)?.label}</p>
                </td>
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2">
                    <FileIcon name={d.fileName} className="size-4 text-muted-foreground" />
                    <span className="max-w-[220px] truncate">{d.fileName}</span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-muted-foreground">{fmtShort(d.uploadedAt)}</td>
                <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <Button asChild size="sm" variant={d.status === "pending" ? "default" : "outline"}>
                    <Link to="/admin/documents/$docId" params={{ docId: d.id }}>
                      {d.status === "pending" ? "Examiner" : "Consulter"} <ChevronRight />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
