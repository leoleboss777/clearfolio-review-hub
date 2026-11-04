import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useKycState } from "@/lib/kyc/store";
import { clientFileStatus, clientProgress, countStatus, FILE_STATUS_LABEL, type FileStatus } from "@/lib/kyc/compute";
import { fmtDate } from "@/lib/kyc/format";
import { AdminPageTitle, Panel, adminSelect } from "@/components/kyc/admin/AdminShell";
import { FileStatusBadge } from "@/components/kyc/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/clients/")({
  head: () => ({
    meta: [
      { title: "Clients — Administration SESAME62" },
      { name: "description", content: "Liste des clients et état de leur dossier KYC." },
      { property: "og:title", content: "Clients — SESAME62" },
      { property: "og:description", content: "Liste des clients et état de leur dossier KYC." },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  const { clients, documents } = useKycState();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | FileStatus>("all");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return clients
      .map((c) => {
        const docs = documents.filter((d) => d.clientId === c.id);
        return { c, docs, file: clientFileStatus(docs), prog: clientProgress(docs), counts: countStatus(docs) };
      })
      .filter((r) => status === "all" || r.file === status)
      .filter(
        ({ c }) =>
          !s ||
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.ref.toLowerCase().includes(s) ||
          c.company.toLowerCase().includes(s),
      )
      .sort((a, b) => b.counts.pending - a.counts.pending || a.c.lastName.localeCompare(b.c.lastName));
  }, [clients, documents, q, status]);

  return (
    <>
      <AdminPageTitle title="Clients" subtitle="Dossiers KYC par client, avec l'avancement de la validation." />
      <Panel>
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un nom, un e-mail, une société…"
              className={adminSelect + " w-full pl-8"}
            />
          </div>
          <select
            className={adminSelect}
            value={status}
            onChange={(e) => setStatus(e.target.value as "all" | FileStatus)}
            aria-label="Statut du dossier"
          >
            <option value="all">Tous dossiers</option>
            {(Object.keys(FILE_STATUS_LABEL) as FileStatus[]).map((s) => (
              <option key={s} value={s}>{FILE_STATUS_LABEL[s]}</option>
            ))}
          </select>
          <span className="ml-auto text-xs text-muted-foreground">{rows.length} client(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b bg-muted text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5">Client</th>
                <th className="px-4 py-2.5">Société / Ville</th>
                <th className="px-4 py-2.5">Documents</th>
                <th className="px-4 py-2.5">Avancement</th>
                <th className="px-4 py-2.5">Dossier</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Aucun client ne correspond.</td>
                </tr>
              )}
              {rows.map(({ c, file, prog, counts }) => (
                <tr
                  key={c.id}
                  onClick={() => navigate({ to: "/admin/clients/$clientId", params: { clientId: c.id } })}
                  className="cursor-pointer border-b last:border-0 hover:bg-accent/60"
                >
                  <td className="px-4 py-2.5">
                    <p className="font-medium">{c.lastName.toUpperCase()} {c.firstName}</p>
                    <p className="text-[11px] text-muted-foreground">{c.email} · <span className="font-mono">{c.ref}</span></p>
                  </td>
                  <td className="px-4 py-2.5">
                    <p>{c.company}</p>
                    <p className="text-[11px] text-muted-foreground">{c.city} · depuis le {fmtDate(c.createdAt)}</p>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums">
                    <span>{counts.total}</span>
                    {counts.pending > 0 && <span className="ml-2 text-xs font-medium text-warning">{counts.pending} à examiner</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded bg-muted">
                        <div className="h-full bg-success" style={{ width: `${prog.pct}%` }} />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">{prog.done}/{prog.total}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5"><FileStatusBadge status={file} /></td>
                  <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/admin/clients/$clientId" params={{ clientId: c.id }}>
                        Ouvrir <ChevronRight />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
