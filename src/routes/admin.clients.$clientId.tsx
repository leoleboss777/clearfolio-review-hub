import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Mail, Phone, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { addComment, useKycState } from "@/lib/kyc/store";
import { CATEGORIES, docTypeLabel } from "@/lib/kyc/catalog";
import { categoryState, clientFileStatus, clientProgress } from "@/lib/kyc/compute";
import { fmtDate, fmtShort, fmtAgo } from "@/lib/kyc/format";
import { AdminPageTitle, Panel } from "@/components/kyc/admin/AdminShell";
import { ActivityTable } from "@/components/kyc/admin/ActivityTable";
import { CategoryStateBadge, FileStatusBadge, StatusBadge } from "@/components/kyc/StatusBadge";
import { FileIcon } from "@/components/kyc/FileIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/clients/$clientId")({
  head: () => ({
    meta: [
      { title: "Dossier client — Administration KYC62" },
      { name: "description", content: "Détail du dossier KYC d'un client." },
      { property: "og:title", content: "Dossier client — KYC62" },
      { property: "og:description", content: "Détail du dossier KYC d'un client." },
    ],
  }),
  component: ClientDetail,
});

function ClientDetail() {
  const { clientId } = Route.useParams();
  const state = useKycState();
  const [text, setText] = useState("");
  const client = state.clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">Ce client n'existe pas.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/admin/clients">Retour aux clients</Link>
        </Button>
      </div>
    );
  }

  const docs = state.documents
    .filter((d) => d.clientId === client.id)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  const file = clientFileStatus(docs);
  const prog = clientProgress(docs);
  const comments = state.comments.filter((c) => c.clientId === client.id);
  const activity = state.activity.filter((a) => a.clientId === client.id).slice(0, 12);

  return (
    <>
      <Link to="/admin/clients" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Clients
      </Link>
      <AdminPageTitle
        title={`${client.lastName.toUpperCase()} ${client.firstName}`}
        subtitle={`Réf. ${client.ref} · client depuis le ${fmtDate(client.createdAt)}`}
        action={<FileStatusBadge status={file} className="text-sm" />}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panel title="Pièces requises" action={<span className="text-xs tabular-nums text-muted-foreground">{prog.done}/{prog.total} validées</span>}>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {CATEGORIES.map((cat) => {
                const st = categoryState(docs, cat.id);
                return (
                  <div key={cat.id} className="flex items-center justify-between bg-card px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{cat.label}</p>
                      <p className="text-[11px] text-muted-foreground">{cat.required ? "Obligatoire" : "Facultatif"}</p>
                    </div>
                    <CategoryStateBadge state={st} />
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title={`Documents (${docs.length})`}>
            {docs.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Aucun document transmis.</p>
            ) : (
              <ul className="divide-y">
                {docs.map((d) => (
                  <li key={d.id}>
                    <Link
                      to="/admin/documents/$docId"
                      params={{ docId: d.id }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-accent/60"
                    >
                      <FileIcon name={d.fileName} className="size-5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{docTypeLabel(d.docType)}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {d.fileName} · {fmtShort(d.uploadedAt)}
                          {d.status === "rejected" && d.rejectionReason && <span className="text-danger"> · {d.rejectionReason}</span>}
                        </p>
                      </div>
                      <StatusBadge status={d.status} />
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Activité récente">
            <ActivityTable items={activity} compact />
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Coordonnées">
            <dl className="space-y-2.5 px-4 py-3 text-sm">
              <Row icon={Mail} v={client.email} />
              <Row icon={Phone} v={client.phone} />
              <Row icon={Building2} v={client.company} />
              <Row icon={MapPin} v={client.city} />
            </dl>
          </Panel>

          <Panel title="Notes internes">
            <form
              className="space-y-2 border-b px-4 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!text.trim()) return;
                addComment(client.id, text.trim());
                setText("");
                toast.success("Note ajoutée au dossier");
              }}
            >
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ajouter une note visible uniquement par l'équipe conformité…"
                rows={3}
              />
              <Button type="submit" size="sm" disabled={!text.trim()}>Ajouter la note</Button>
            </form>
            {comments.length === 0 ? (
              <p className="px-4 py-4 text-sm text-muted-foreground">Aucune note.</p>
            ) : (
              <ul className="divide-y">
                {comments.map((c) => (
                  <li key={c.id} className="px-4 py-3">
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">{c.author}</span> · {fmtAgo(c.at)}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{c.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}

function Row({ icon: Icon, v }: { icon: typeof Mail; v: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <dd className="truncate">{v}</dd>
    </div>
  );
}
