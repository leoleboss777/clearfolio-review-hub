import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, getCategory, isAcceptedFile, MAX_FILE_SIZE } from "@/lib/kyc/catalog";
import { uploadDocuments } from "@/lib/kyc/store";
import type { CategoryId } from "@/lib/kyc/types";
import { cn } from "@/lib/utils";

const selectCls =
  "h-10 w-full rounded-lg border border-input bg-surface-2/70 px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/50";

export function Uploader({ clientId, fixedCategory }: { clientId: string; fixedCategory?: CategoryId }) {
  const [category, setCategory] = useState<CategoryId>(fixedCategory ?? "identity");
  const cat = getCategory(fixedCategory ?? category)!;
  const [docType, setDocType] = useState(cat.types[0].id);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const typeValid = cat.types.some((t) => t.id === docType) ? docType : cat.types[0].id;

  async function handle(list: FileList | File[]) {
    const files = Array.from(list);
    const ok = files.filter((f) => isAcceptedFile(f.name) && f.size <= MAX_FILE_SIZE);
    const bad = files.length - ok.length;
    if (bad > 0) toast.error(`${bad} fichier(s) ignoré(s)`, { description: "Formats acceptés : PDF, JPG, JPEG, PNG — 10 Mo max." });
    if (!ok.length) return;
    setBusy(true);
    try {
      await uploadDocuments(clientId, cat.id, typeValid, ok);
      toast.success(`${ok.length} document(s) transmis`, { description: "Statut : Pending — en attente de vérification." });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files.length) void handle(e.dataTransfer.files);
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className={cn("grid gap-3", fixedCategory ? "sm:grid-cols-1" : "sm:grid-cols-2")}>
        {!fixedCategory && (
          <label className="space-y-1.5 text-xs text-muted-foreground">
            Catégorie
            <select
              className={selectCls}
              value={category}
              onChange={(e) => {
                const c = e.target.value as CategoryId;
                setCategory(c);
                setDocType(getCategory(c)!.types[0].id);
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
        )}
        <label className="space-y-1.5 text-xs text-muted-foreground">
          Type de document
          <select className={selectCls} value={typeValid} onChange={(e) => setDocType(e.target.value)}>
            {cat.types.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={cn(
          "mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition-all",
          drag ? "border-electric bg-primary/10 shadow-glow" : "border-border hover:border-electric/60 hover:bg-primary/5",
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-electric ring-1 ring-primary/25">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <UploadCloud className="size-5" />}
        </span>
        <p className="mt-4 text-sm font-medium">
          {busy ? "Transmission en cours…" : "Glissez-déposez vos fichiers ici"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          ou <span className="text-electric">parcourez</span> — PDF, JPG, JPEG, PNG · plusieurs fichiers · 10 Mo max
        </p>
        <input
          ref={input}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => e.target.files && void handle(e.target.files)}
        />
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground/70">
        Prototype : vos fichiers restent dans ce navigateur et ne sont envoyés à aucun serveur.
      </p>
    </div>
  );
}
