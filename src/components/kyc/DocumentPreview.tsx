import { useEffect, useState } from "react";
import { getFile } from "@/lib/kyc/files";
import { docTypeLabel, fileExt } from "@/lib/kyc/catalog";
import { fmtDate } from "@/lib/kyc/format";
import type { Client, KycDocument } from "@/lib/kyc/types";
import { FileIcon } from "./FileIcon";
import { CheckCircle2, XCircle } from "lucide-react";

/** Shows the locally stored file (image / PDF) or a stylised representation for demo data. */
export function DocumentPreview({ doc, client }: { doc: KycDocument; client?: Client }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(doc.hasFile);

  useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;
    if (!doc.hasFile) {
      setUrl(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getFile(doc.id).then((blob) => {
      if (cancelled) return;
      if (blob) {
        revoked = URL.createObjectURL(blob);
        setUrl(revoked);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [doc.id, doc.hasFile]);

  const ext = fileExt(doc.fileName);
  const isImage = ["jpg", "jpeg", "png"].includes(ext) || doc.mime.startsWith("image/");
  const isPdf = ext === "pdf" || doc.mime === "application/pdf";

  return (
    <div className="relative h-full min-h-[520px] w-full">
      {loading ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Chargement de l'aperçu…
        </div>
      ) : url && isImage ? (
        <div className="flex h-full items-center justify-center p-4">
          <img src={url} alt={doc.fileName} className="max-h-[640px] max-w-full rounded border bg-card shadow-sm" />
        </div>
      ) : url && isPdf ? (
        <iframe src={url} title={doc.fileName} className="h-[680px] w-full rounded border bg-card" />
      ) : url ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
          <FileIcon name={doc.fileName} className="size-14" />
          <p className="text-sm">Aperçu non disponible pour ce format.</p>
        </div>
      ) : (
        <MockSheet doc={doc} client={client} />
      )}

      {doc.status !== "pending" && (
        <div
          className={
            "pointer-events-none absolute right-6 top-6 flex items-center gap-2 rounded-md border-2 px-3 py-1.5 text-sm font-bold uppercase tracking-wider " +
            (doc.status === "approved"
              ? "border-success bg-card/90 text-success"
              : "border-danger bg-card/90 text-danger")
          }
        >
          {doc.status === "approved" ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
          {doc.status === "approved" ? "Approved" : "Rejected"}
        </div>
      )}
    </div>
  );
}

function MockSheet({ doc, client }: { doc: KycDocument; client?: Client }) {
  const title = docTypeLabel(doc.docType);
  const name = client ? `${client.lastName.toUpperCase()} ${client.firstName}` : "—";
  const isId = doc.category === "identity";
  return (
    <div className="flex h-full items-start justify-center p-6">
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-sm border bg-card p-8 shadow-md">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="-rotate-[24deg] select-none text-3xl font-bold uppercase tracking-[0.3em] text-muted-foreground/15">
            Aperçu démo
          </span>
        </div>
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              République Française
            </p>
            <p className="mt-1 text-lg font-semibold">{title}</p>
          </div>
          <FileIcon name={doc.fileName} className="size-8 text-muted-foreground" />
        </div>
        {isId ? (
          <div className="mt-6 flex gap-5">
            <div className="h-32 w-24 shrink-0 rounded bg-secondary" />
            <dl className="grid flex-1 grid-cols-1 gap-2 text-xs">
              <Field k="Nom / Prénom" v={name} />
              <Field k="Nationalité" v="FRA" />
              <Field k="Date de naissance" v="14/03/1990" />
              <Field k="N° de document" v={`${doc.id.slice(-6).toUpperCase()}FR`} />
              <Field k="Expire le" v="03/2031" />
            </dl>
          </div>
        ) : (
          <div className="mt-6 space-y-3 text-xs">
            <Field k="Titulaire" v={name} />
            <Field k="Adresse" v={client ? `${client.city}, France` : "—"} />
            <Field k="Émis le" v={fmtDate(doc.uploadedAt)} />
            <div className="mt-4 space-y-2 pt-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex justify-between gap-6">
                  <span className="h-2 rounded bg-secondary" style={{ width: `${40 + ((i * 17) % 45)}%` }} />
                  <span className="h-2 w-14 rounded bg-secondary" />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 font-mono text-[10px] leading-relaxed tracking-widest text-muted-foreground/70">
          {"<<<"}
          {doc.fileName.toUpperCase().replace(/[^A-Z0-9]/g, "<").slice(0, 32)}
          {"<<<<<<<<"}
        </div>
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
