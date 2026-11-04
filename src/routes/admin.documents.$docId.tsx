import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Download, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { approveDocument, rejectDocument, useKycState } from "@/lib/kyc/store";
import { docTypeLabel, formatSize, getCategory, REJECTION_REASONS } from "@/lib/kyc/catalog";
import { fmtDateTime } from "@/lib/kyc/format";
import { getFile } from "@/lib/kyc/files";
import { AdminPageTitle, Panel } from "@/components/kyc/admin/AdminShell";
import { DocumentPreview } from "@/components/kyc/DocumentPreview";
import { StatusBadge } from "@/components/kyc/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/documents/$docId")({
  head: () => ({
    meta: [
      { title: "Examen du document — Administration KYC62" },
      { name: "description", content: "Aperçu et décision de validation d'un document KYC." },
      { property: "og:title", content: "Examen du document — KYC62" },
      { property: "og:description", content: "Aperçu et décision de validation d'un document KYC." },
    ],
  }),
  component: DocumentReview,
});

function DocumentReview() {
  const { docId } = Route.useParams();
  const navigate = useNavigate();
  const { documents, clients } = useKycState();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(REJECTION_REASONS[0]);
  const [comment, setComment] = useState("");

  const doc = documents.find((d) => d.id === docId);
  const client = doc ? clients.find((c) => c.id === doc.clientId) : undefined;

  if (!doc) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">Ce document n'existe plus (il a peut-être été supprimé par le client).</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/admin/pending">Retour aux documents en attente</Link>
        </Button>
      </div>
    );
  }

  const nextPending = documents
    .filter((d) => d.status === "pending" && d.id !== doc.id)
    .sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt))[0];

  const goNext = () => {
    if (nextPending) navigate({ to: "/admin/documents/$docId", params: { docId: nextPending.id } });
  };

  const approve = () => {
    approveDocument(doc.id);
    toast.success("Document approuvé", { description: "Le client voit désormais une coche verte." });
  };

  const reject = () => {
    if (reason === "Autre motif" && !comment.trim()) {
      toast.error("Précisez le motif dans le commentaire.");
      return;
    }
    rejectDocument(doc.id, reason, comment);
    setOpen(false);
    setComment("");
    toast.error("Document refusé", { description: `Motif transmis au client : ${reason}` });
  };

  const download = async () => {
    const blob = await getFile(doc.id);
    if (!blob) {
      toast.info("Fichier de démonstration", { description: "Ce document fictif n'a pas de fichier réel à télécharger." });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Link to="/admin/pending" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Pending Reviews
      </Link>
      <AdminPageTitle
        title={docTypeLabel(doc.docType)}
        subtitle={client ? `${client.firstName} ${client.lastName} · ${getCategory(doc.category)?.label ?? ""}` : undefined}
        action={<StatusBadge status={doc.status} className="text-sm" />}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Panel title="Aperçu" action={<Button size="sm" variant="ghost" onClick={download}><Download /> Télécharger</Button>} className="overflow-hidden">
          <div className="bg-muted/50">
            <DocumentPreview doc={doc} client={client} />
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Décision">
            <div className="space-y-3 p-4">
              {doc.status === "pending" ? (
                <p className="text-sm text-muted-foreground">Vérifiez la lisibilité, la validité et la cohérence du document avant de statuer.</p>
              ) : doc.status === "approved" ? (
                <div className="flex items-start gap-2 rounded border border-success/30 bg-success/10 p-3 text-sm text-success">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  <span>Approuvé par {doc.reviewer} le {doc.reviewedAt && fmtDateTime(doc.reviewedAt)}</span>
                </div>
              ) : (
                <div className="space-y-1 rounded border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                  <p className="flex items-center gap-2 font-medium"><XCircle className="size-4" /> {doc.rejectionReason}</p>
                  {doc.rejectionComment && <p className="text-foreground">{doc.rejectionComment}</p>}
                  <p className="text-xs opacity-80">Par {doc.reviewer} le {doc.reviewedAt && fmtDateTime(doc.reviewedAt)}</p>
                </div>
              )}
              <Button
                className="w-full bg-success text-success-foreground hover:bg-success/90"
                onClick={approve}
                disabled={doc.status === "approved"}
              >
                <CheckCircle2 /> Approve Document
              </Button>
              <Button
                className="w-full bg-danger text-danger-foreground hover:bg-danger/90"
                onClick={() => setOpen(true)}
                disabled={doc.status === "rejected"}
              >
                <XCircle /> Reject Document
              </Button>
              {nextPending && (
                <Button variant="outline" className="w-full" onClick={goNext}>
                  Document en attente suivant <ChevronRight />
                </Button>
              )}
            </div>
          </Panel>

          <Panel title="Informations">
            <dl className="divide-y text-sm">
              <Info k="Client" v={client ? (
                <Link to="/admin/clients/$clientId" params={{ clientId: client.id }} className="text-primary hover:underline">
                  {client.firstName} {client.lastName}
                </Link>
              ) : "—"} />
              <Info k="Référence" v={<span className="font-mono text-xs">{client?.ref ?? "—"}</span>} />
              <Info k="Catégorie" v={getCategory(doc.category)?.label ?? "—"} />
              <Info k="Fichier" v={<span className="break-all">{doc.fileName}</span>} />
              <Info k="Taille" v={formatSize(doc.size)} />
              <Info k="Transmis le" v={fmtDateTime(doc.uploadedAt)} />
            </dl>
          </Panel>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser le document</DialogTitle>
            <DialogDescription>Le motif et le commentaire seront affichés au client dans son espace.</DialogDescription>
          </DialogHeader>
          <RadioGroup value={reason} onValueChange={setReason} className="gap-2">
            {REJECTION_REASONS.map((r) => (
              <Label key={r} className="flex cursor-pointer items-center gap-2.5 rounded border px-3 py-2 font-normal has-[[data-state=checked]]:border-danger has-[[data-state=checked]]:bg-danger/5">
                <RadioGroupItem value={r} /> {r}
              </Label>
            ))}
          </RadioGroup>
          <div className="space-y-1.5">
            <Label htmlFor="reject-comment">Commentaire {reason === "Autre motif" ? "(obligatoire)" : "(facultatif)"}</Label>
            <Textarea
              id="reject-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex. : merci de transmettre une copie recto-verso en couleur."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button className="bg-danger text-danger-foreground hover:bg-danger/90" onClick={reject}>
              <XCircle /> Confirmer le refus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Info({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
