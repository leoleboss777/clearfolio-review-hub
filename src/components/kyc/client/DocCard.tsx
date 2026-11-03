import { Check, X, Trash2, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";
import type { KycDocument } from "@/lib/kyc/types";
import { canClientDelete, docTypeLabel, formatSize, getCategory } from "@/lib/kyc/catalog";
import { fmtDate, fmtDateTime } from "@/lib/kyc/format";
import { deleteDocument } from "@/lib/kyc/store";
import { StatusBadge } from "../StatusBadge";
import { FileBadge } from "../FileIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export function DocCard({ doc }: { doc: KycDocument }) {
  const ring =
    doc.status === "approved"
      ? "ring-success/35"
      : doc.status === "rejected"
        ? "ring-danger/35"
        : "ring-transparent";
  return (
    <div className={cn("glass group relative flex flex-col rounded-2xl p-5 ring-1 transition-all hover:-translate-y-0.5", ring)}>
      {doc.status === "approved" && (
        <span
          className="absolute -right-2 -top-2 flex size-9 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg ring-4 ring-background"
          aria-label="Document validé"
        >
          <Check className="size-5" strokeWidth={3.5} />
        </span>
      )}
      {doc.status === "rejected" && (
        <span
          className="absolute -right-2 -top-2 flex size-9 items-center justify-center rounded-full bg-danger text-danger-foreground shadow-lg ring-4 ring-background"
          aria-label="Document refusé"
        >
          <X className="size-5" strokeWidth={3.5} />
        </span>
      )}

      <div className="flex items-start gap-3">
        <FileBadge name={doc.fileName} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" title={doc.fileName}>{doc.fileName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {docTypeLabel(doc.docType)} · {getCategory(doc.category)?.label}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <StatusBadge status={doc.status} />
        <span className="font-mono text-[11px] text-muted-foreground">{formatSize(doc.size)}</span>
      </div>

      <div className="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
        <p>Déposé le {fmtDate(doc.uploadedAt)}</p>
        {doc.status === "approved" && doc.reviewedAt && (
          <p className="text-success">Validé le {fmtDateTime(doc.reviewedAt)}</p>
        )}
        {doc.status === "pending" && (
          <p className="flex items-center gap-1 text-warning">
            <Clock className="size-3" /> En cours de vérification
          </p>
        )}
      </div>

      {doc.status === "rejected" && (
        <div className="mt-3 rounded-lg border border-danger/30 bg-danger/10 p-3 text-xs">
          <p className="flex items-center gap-1.5 font-medium text-danger">
            <AlertTriangle className="size-3.5" /> Motif : {doc.rejectionReason}
          </p>
          {doc.rejectionComment && <p className="mt-1.5 text-foreground/80">{doc.rejectionComment}</p>}
          <p className="mt-1.5 text-muted-foreground">Merci de transmettre un nouveau document.</p>
        </div>
      )}

      {canClientDelete(doc) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="mt-4 inline-flex items-center gap-1.5 self-start text-xs text-muted-foreground transition-colors hover:text-danger">
              <Trash2 className="size-3.5" /> Supprimer
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
              <AlertDialogDescription>
                « {doc.fileName} » sera retiré de votre dossier KYC. Cette action est définitive.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-danger text-danger-foreground hover:bg-danger/90"
                onClick={() => {
                  deleteDocument(doc.id);
                  toast.success("Document supprimé");
                }}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
