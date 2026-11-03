import { Link } from "@tanstack/react-router";
import { Upload, CheckCircle2, XCircle, Trash2, MessageSquare } from "lucide-react";
import { useKycState } from "@/lib/kyc/store";
import { fmtShort } from "@/lib/kyc/format";
import type { Activity } from "@/lib/kyc/types";
import { cn } from "@/lib/utils";

const META = {
  upload: { icon: Upload, label: "Dépôt", tone: "text-primary" },
  approve: { icon: CheckCircle2, label: "Validation", tone: "text-success" },
  reject: { icon: XCircle, label: "Refus", tone: "text-danger" },
  delete: { icon: Trash2, label: "Suppression", tone: "text-muted-foreground" },
  comment: { icon: MessageSquare, label: "Commentaire", tone: "text-muted-foreground" },
};

export function ActivityTable({ items, compact }: { items: Activity[]; compact?: boolean }) {
  const { clients, documents } = useKycState();
  const byId = new Map(clients.map((c) => [c.id, c]));
  const docIds = new Set(documents.map((d) => d.id));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b bg-muted text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Type</th>
            {!compact && <th className="px-4 py-2">Auteur</th>}
            <th className="px-4 py-2">Client</th>
            <th className="px-4 py-2">Détail</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Aucune activité.</td>
            </tr>
          )}
          {items.map((a) => {
            const m = META[a.type];
            const c = byId.get(a.clientId);
            return (
              <tr key={a.id} className="border-b last:border-0">
                <td className="whitespace-nowrap px-4 py-2 tabular-nums text-muted-foreground">{fmtShort(a.at)}</td>
                <td className="px-4 py-2">
                  <span className={cn("inline-flex items-center gap-1.5 font-medium", m.tone)}>
                    <m.icon className="size-3.5" /> {m.label}
                  </span>
                </td>
                {!compact && <td className="px-4 py-2">{a.actor}</td>}
                <td className="px-4 py-2">
                  {c ? (
                    <Link to="/admin/clients/$clientId" params={{ clientId: c.id }} className="text-primary hover:underline">
                      {c.firstName} {c.lastName}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-2">
                  {a.docId && docIds.has(a.docId) ? (
                    <Link to="/admin/documents/$docId" params={{ docId: a.docId }} className="hover:underline">
                      {a.message}
                    </Link>
                  ) : (
                    a.message
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
